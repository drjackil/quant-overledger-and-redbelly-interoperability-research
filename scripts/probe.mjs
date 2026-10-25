// Live checks against Redbelly's public RPC endpoints and Overledger's public gateway.
// Read-only except for one deliberately invalid write: a zero-value transaction signed by a
// freshly generated, unfunded and unverified key, which Redbelly is expected to reject.
// Nothing here needs credentials, and nothing here can move funds.
//
//   node scripts/probe.mjs          run the checks and write evidence/live-checks.json
//   node scripts/probe.mjs --check  run the checks and fail if any expectation no longer holds

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Wallet } from 'ethers';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'evidence', 'live-checks.json');
const CHECK = process.argv.includes('--check');

const RPC = {
  mainnet: 'https://governors.mainnet.redbelly.network',
  testnet: 'https://governors.testnet.redbelly.network',
  ankr: 'https://rpc.ankr.com/redbelly_mainnet'
};
const OVERLEDGER = 'https://fusion-rollup.quant.dev';

// Well known contract addresses that cross-chain tooling commonly expects to find.
const CONTRACTS = {
  'Permit2 (Uniswap, used by Overledger x402 payment gates)': '0x000000000022D473030F116dDEE9F6B43aC78BA3',
  'Multicall3': '0xcA11bde05977b3631167028862bE2a173976CA11',
  'Deterministic CREATE2 deployer': '0x4e59b44847b379578588920cA78FbF26c0B4956C',
  'Redbelly accredited issuer registry (mainnet)': '0x2d68f1C50a057a310EeF28DF3199F95A65cE4ac5'
};

async function rpc(url, method, params = []) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      signal: AbortSignal.timeout(20000)
    });
    const body = await res.json();
    return { http: res.status, ms: Date.now() - started, ...('error' in body ? { error: body.error } : { result: body.result }) };
  } catch (e) {
    return { http: 0, ms: Date.now() - started, error: { message: String(e.message || e) } };
  }
}

async function http(path) {
  try {
    const res = await fetch(OVERLEDGER + path, { signal: AbortSignal.timeout(20000) });
    const text = await res.text();
    let body; try { body = JSON.parse(text); } catch { body = text.slice(0, 120); }
    return { http: res.status, body };
  } catch (e) {
    return { http: 0, body: String(e.message || e) };
  }
}

const hex = (v) => (typeof v === 'string' && v.startsWith('0x') ? parseInt(v, 16) : v);
const checks = [];
function record(id, title, endpoint, request, response, expectation, pass, meaning) {
  checks.push({ id, title, endpoint, request, response, expectation, pass, meaning });
}

async function main() {
  const startedAt = new Date();

  // 1. Identity of each endpoint
  for (const [name, url] of Object.entries(RPC)) {
    const r = await rpc(url, 'eth_chainId');
    const want = name === 'testnet' ? 153 : 151;
    record(`chain-id-${name}`, `Chain ID returned by ${name === 'ankr' ? 'Ankr public endpoint' : 'Redbelly ' + name + ' RPC'}`, url, 'eth_chainId', r,
      `returns ${want}`, hex(r.result) === want,
      'The endpoint answers standard EVM JSON-RPC over HTTPS and identifies the expected chain.');
  }

  // 2. Standard methods a generic EVM health checker may call
  for (const m of ['eth_blockNumber', 'eth_syncing', 'eth_gasPrice', 'eth_maxPriorityFeePerGas', 'eth_feeHistory', 'net_version', 'web3_clientVersion']) {
    const params = m === 'eth_feeHistory' ? ['0x4', 'latest', []] : [];
    const r = await rpc(RPC.mainnet, m, params);
    const supported = !r.error;
    const expectSupported = m !== 'net_version';
    record(`method-${m}`, `Mainnet RPC ${expectSupported ? "supports" : "does not support"} ${m}`, RPC.mainnet, m, r,
      expectSupported ? 'method supported' : 'method not available (code -32601)',
      expectSupported ? supported : (r.error && r.error.code === -32601),
      m === 'net_version'
        ? 'Redbelly does not serve net_version. Overledger does not publish which methods its EVM health check calls, so whether this matters is unknown.'
        : 'Standard method answered normally.');
  }

  // 3. Block tags used by rollups and bridges to judge finality
  const latest = await rpc(RPC.mainnet, 'eth_getBlockByNumber', ['latest', false]);
  const finalized = await rpc(RPC.mainnet, 'eth_getBlockByNumber', ['finalized', false]);
  const safe = await rpc(RPC.mainnet, 'eth_getBlockByNumber', ['safe', false]);
  const ln = hex(latest.result?.number), fn = hex(finalized.result?.number), sn = hex(safe.result?.number);
  const slim = (r) => (r.result ? { number: hex(r.result.number), timestamp: new Date(hex(r.result.timestamp) * 1000).toISOString() } : r);
  record('tag-finalized', '"finalized" block tag equals the latest block', RPC.mainnet, 'eth_getBlockByNumber latest / finalized',
    { latest: slim(latest), finalized: slim(finalized) }, 'finalized == latest', ln === fn,
    'Consistent with deterministic finality: the newest block is already final.');
  record('tag-safe', '"safe" block tag lags behind "finalized"', RPC.mainnet, 'eth_getBlockByNumber safe',
    { safe: slim(safe), blocksBehindFinalized: fn - sn }, 'safe < finalized', sn < fn,
    'Observed only. Software that reads the "safe" tag would see an older block than "finalized". The reason is not documented.');

  // 4. Write access is identity gated: a fresh unverified key is refused
  const wallet = Wallet.createRandom();
  for (const [name, chainId] of [['testnet', 153], ['mainnet', 151]]) {
    const gp = await rpc(RPC[name], 'eth_gasPrice');
    const raw = await wallet.signTransaction({ to: wallet.address, value: 0n, nonce: 0, gasLimit: 21000n, gasPrice: BigInt(gp.result || '0x1'), chainId: BigInt(chainId), type: 0 });
    const r = await rpc(RPC[name], 'eth_sendRawTransaction', [raw]);
    record(`write-unverified-${name}`, `Unverified address cannot write on ${name}`, RPC[name], 'eth_sendRawTransaction (zero value, signed by a new unverified key)',
      { from: wallet.address, ...r }, 'rejected with "Sender not authorised to write transactions"',
      !!(r.error && /not authori[sz]ed to write/i.test(r.error.message)),
      'Any party that submits Redbelly transactions through Overledger, including a Quant-held signer, would need Redbelly write access first.');
  }
  const est = await rpc(RPC.mainnet, 'eth_estimateGas', [{ from: wallet.address, to: wallet.address, value: '0x0' }]);
  record('estimate-unverified', 'Gas estimation still succeeds for an unverified address', RPC.mainnet, 'eth_estimateGas', { from: wallet.address, ...est },
    'returns an estimate', !est.error,
    'A "prepare" step can succeed while the later "execute" step fails. A workflow engine would need to check write access up front.');

  // 5. Contracts that common tooling expects
  for (const [label, address] of Object.entries(CONTRACTS)) {
    const r = await rpc(RPC.mainnet, 'eth_getCode', [address, 'latest']);
    const has = typeof r.result === 'string' && r.result.length > 2;
    const expectHas = !label.startsWith('Permit2');
    record(`code-${label.split(' ')[0].toLowerCase()}`, `${label} ${expectHas ? 'is' : 'is not'} deployed on Redbelly mainnet`, RPC.mainnet, `eth_getCode ${address}`,
      { address, bytes: has ? (r.result.length - 2) / 2 : 0, ...(r.error ? { error: r.error } : {}) },
      expectHas ? 'code present' : 'no code', has === expectHas,
      label.startsWith('Permit2')
        ? 'Overledger documents x402 payment gates on EVM via Permit2. Permit2 is not at its usual address on Redbelly, so that feature would need it deployed first.'
        : 'Present at the usual address.');
  }

  // 6. Overledger gateway: public health, authenticated network list
  const health = await http('/health');
  record('overledger-health', 'Overledger gateway health endpoint is public', OVERLEDGER + '/health', 'GET /health',
    { http: health.http, status: health.body?.status }, 'HTTP 200', health.http === 200,
    'The gateway named in Overledger\'s documentation is reachable.');
  for (const path of ['/networks', '/networks/fusion']) {
    const r = await http(path);
    record(`overledger${path.replace(/\//g, '-')}`, `GET ${path} requires an Overledger account`, OVERLEDGER + path, `GET ${path} (no credentials)`,
      { http: r.http, body: r.body }, 'HTTP 401', r.http === 401,
      'The live list of networks is not public. Whether Redbelly appears in it cannot be checked without an account.');
  }

  const result = {
    note: 'Generated by scripts/probe.mjs. Read-only checks plus one zero-value transaction from a new unverified key, which is expected to be refused. No credentials used.',
    ranAt: startedAt.toISOString(),
    node: process.version,
    passed: checks.filter((c) => c.pass).length,
    total: checks.length,
    checks
  };

  for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.title}`);
  console.log(`\n${result.passed}/${result.total} expectations hold (${result.ranAt})`);

  if (!CHECK) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
    console.log(`wrote ${OUT}`);
  }
  if (result.passed !== result.total) process.exitCode = 1;
}

main();
