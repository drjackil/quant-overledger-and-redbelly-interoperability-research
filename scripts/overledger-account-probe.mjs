// Account-level checks that public access cannot reach. Run by someone who holds the access.
//
//   OVERLEDGER_API_KEY=fk_... node scripts/overledger-account-probe.mjs
//       Stage 1, read-only: who the key belongs to, the live network list (is Redbelly in it?),
//       Fusion's connected networks, and the account's registered nodes. Changes nothing.
//
//   ... node scripts/overledger-account-probe.mjs --node-test
//       Stage 2: registers Redbelly TESTNET (chain 153) as a node, sends test calls through
//       Overledger to it, then deletes the node. Overledger's docs say the first registration of
//       a new network makes it available to Overledger users, so this stage is opt-in. Prefer
//       making the node private in the Quant Connect UI and passing its id with NODE_ID=...
//
//   ... REDBELLY_TESTNET_PRIVATE_KEY=0x... node scripts/overledger-account-probe.mjs --node-test --write
//       Stage 3: also sends one zero-value self-transfer on Redbelly Testnet through Overledger,
//       signed by a Redbelly-verified testnet address. Costs a tiny amount of testnet RBNT only.
//
// The API key and private key are never written to disk. Results go to
// evidence/overledger-account-checks.json, which the build turns into a report section.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Wallet } from 'ethers';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'evidence', 'overledger-account-checks.json');
const BASE = (process.env.OVERLEDGER_URL || 'https://fusion-rollup.quant.dev').replace(/\/$/, '');
const KEY = process.env.OVERLEDGER_API_KEY;
const NODE_URL = process.env.REDBELLY_NODE_URL || 'https://governors.testnet.redbelly.network';
const args = new Set(process.argv.slice(2));

if (!KEY) {
  console.error('Set OVERLEDGER_API_KEY first. Create one in Quant Connect (API Keys page). See README, "Account-level checks".');
  process.exit(2);
}

const redact = (v) => JSON.parse(JSON.stringify(v ?? null).split(KEY).join('<api-key>'));
const checks = [];
const record = (stage, id, title, request, response, expectation, pass, meaning) => {
  checks.push({ stage, id, title, request, response: redact(response), expectation, pass, meaning });
  console.log(`${pass === null ? 'INFO' : pass ? 'PASS' : 'FAIL'}  [${stage}] ${title}`);
};

async function api(method, path, body) {
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: { 'x-api-key': KEY, accept: 'application/json', ...(body ? { 'content-type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30000)
    });
    const text = await res.text();
    let json; try { json = JSON.parse(text); } catch { json = text.slice(0, 300); }
    return { http: res.status, body: json };
  } catch (e) { return { http: 0, body: String(e.message || e) }; }
}

async function rpc(path, method, params = []) {
  const r = await api('POST', path, { jsonrpc: '2.0', id: 1, method, params });
  return { http: r.http, ...(r.body && typeof r.body === 'object' ? ('error' in r.body ? { error: r.body.error } : { result: r.body.result }) : { body: r.body }) };
}

const hex = (v) => (typeof v === 'string' && v.startsWith('0x') ? parseInt(v, 16) : v);
const looksRedbelly = (n) => /redbelly|rbnt/i.test(`${n.name} ${n.networkId} ${n.rpc}`);

async function stage1() {
  const me = await api('GET', '/users/me/id');
  record(1, 'auth', 'API key authenticates', 'GET /users/me/id', { http: me.http }, 'HTTP 200', me.http === 200,
    'The key is valid. The user id itself is not stored.');
  if (me.http !== 200) return false;

  const all = [];
  for (let page = 1; page <= 20; page++) {
    const r = await api('GET', `/networks?page=${page}&pageSize=100`);
    if (r.http !== 200 || !r.body?.data) { record(1, 'networks-error', 'Live network list loads', `GET /networks?page=${page}`, r, 'HTTP 200', false, 'Could not read the list.'); break; }
    all.push(...r.body.data);
    if (!r.body.hasMore) break;
  }
  // The live API does not always use the field names in the documented network model, so record the
  // real field names and search every field, not only name and id.
  const KEYISH = /key|token|secret|auth|password/i;
  const clean = (n) => Object.fromEntries(Object.entries(n).filter(([k]) => !KEYISH.test(k)).map(([k, v]) => [k, typeof v === 'string' ? v.replace(/\/[A-Za-z0-9_-]{24,}(?=\/|$)/g, '/<redacted>') : v]));
  const fieldNames = [...new Set(all.flatMap((n) => Object.keys(n)))].sort();
  const pick = (n, names) => { for (const k of names) if (n[k] !== undefined && n[k] !== null && n[k] !== '') return n[k]; return undefined; };
  const label = (n) => pick(n, ['name', 'displayName', 'networkName', 'label', 'title', 'networkId', 'id', 'slug', 'key']);
  const family = (n) => pick(n, ['type', 'dlt', 'family', 'dltType', 'protocol']);
  const chainOf = (n) => { const v = pick(n, ['chainId', 'chainID', 'chain_id', 'evmChainId']); return v === undefined ? undefined : Number(v); };
  const slim = all.map((n) => ({ label: label(n), family: family(n), chainId: chainOf(n), environment: n.environment, visibility: n.visibility, status: n.status }));
  const rb = all.filter((n) => /redbelly|rbnt|governors\.(main|test)net/i.test(JSON.stringify(n)) || [151, 152, 153].includes(chainOf(n))).map(clean);
  const labelled = slim.filter((n) => n.label !== undefined).length;
  record(1, 'networks', `Live network list: ${slim.length} networks visible to this account`, 'GET /networks (all pages)',
    { count: slim.length, fieldNames, labelledEntries: labelled, families: [...new Set(slim.map((n) => n.family).filter(Boolean))], networks: slim, sample: all.slice(0, 2).map(clean) },
    'list loads', slim.length > 0,
    'The live list that the documentation points to. Visibility rules mean another account may see a different list.');
  const searchable = fieldNames.length > 3;
  record(1, 'redbelly-listed', rb.length ? 'Redbelly appears in the live network list' : (searchable ? 'Redbelly does not appear in the live network list' : 'Live list entries carry too few fields to search'),
    'search every field of every entry for "redbelly", "rbnt", the governors RPC host, or chain ID 151, 152 or 153', { fieldsSearched: fieldNames, matches: rb }, 'observation', null,
    rb.length ? 'Redbelly is already reachable through Overledger for this account.' : (searchable ? 'Redbelly is not a listed network for this account on this date.' : 'The result cannot be read either way; the entries do not include names or chain IDs.'));

  const fusion = await api('GET', '/networks/fusion');
  const fData = fusion.body?.data || fusion.body;
  record(1, 'fusion', 'Fusion Rollup connected networks', 'GET /networks/fusion',
    { http: fusion.http, fieldNames: Array.isArray(fData) ? [...new Set(fData.flatMap((n) => Object.keys(n)))].sort() : [], networks: Array.isArray(fData) ? fData.map((n) => ({ label: label(n), chainId: chainOf(n), isFusion: n.isFusion })) : fData },
    'HTTP 200', fusion.http === 200, 'Shows which base chains the rollup is connected to today.');

  const nodes = await api('GET', '/users/me/nodes');
  record(1, 'my-nodes', 'Nodes registered by this account', 'GET /users/me/nodes', { http: nodes.http, count: Array.isArray(nodes.body?.data) ? nodes.body.data.length : undefined }, 'HTTP 200', nodes.http === 200, 'Baseline before any node test.');
  return true;
}

function unverifiedTx(chainId, gasPrice) {
  const w = Wallet.createRandom();
  return w.signTransaction({ to: w.address, value: 0n, nonce: 0, gasLimit: 21000n, gasPrice: BigInt(gasPrice || '0x1'), chainId: BigInt(chainId), type: 0 });
}

async function stage2() {
  let nodeId = process.env.NODE_ID;
  let created = false;
  if (!nodeId) {
    const r = await api('POST', '/nodes', { address: NODE_URL, dlt: 'EVM', name: 'Redbelly Testnet (feasibility check)', network: 'redbelly-testnet' });
    record(2, 'register', 'Register a Redbelly Testnet node through POST /nodes', `POST /nodes {address: ${NODE_URL}, dlt: EVM}`, r,
      'HTTP 201 with a node id', r.http === 201 && !!r.body?._id,
      r.http === 201 ? 'Overledger accepted the Redbelly node, so its health check passed.' : 'Overledger refused the node. The response explains why (domain rule, health check, or other).');
    if (r.http !== 201 || !r.body?._id) return null;
    nodeId = r.body._id; created = true;
  } else {
    record(2, 'register', 'Using a node registered in the Quant Connect UI', 'NODE_ID from the environment', { nodeId: '<given>' }, 'node id given', true, 'Node added through the UI, where public or private can be chosen.');
  }

  const path = `/dlts/EVM/nodes/${nodeId}/rpc/${KEY}`;
  const cid = await rpc(path, 'eth_chainId');
  record(2, 'rpc-chainid', 'Read through Overledger: eth_chainId', 'eth_chainId via Overledger', cid, 'returns 153', hex(cid.result) === 153, 'Level 1 (read) works end to end.');
  const bn = await rpc(path, 'eth_blockNumber');
  record(2, 'rpc-block', 'Read through Overledger: eth_blockNumber', 'eth_blockNumber via Overledger', bn, 'returns a block number', typeof bn.result === 'string', 'Reads are forwarded unchanged.');
  const fin = await rpc(path, 'eth_getBlockByNumber', ['finalized', false]);
  record(2, 'rpc-finalized', 'Read through Overledger: finalized block', 'eth_getBlockByNumber finalized', { http: fin.http, number: hex(fin.result?.number), error: fin.error }, 'returns a block', !!fin.result, 'Block tags pass through.');
  const nv = await rpc(path, 'net_version');
  record(2, 'rpc-netversion', 'net_version through Overledger', 'net_version via Overledger', nv, 'observation', null, 'Shows whether Overledger passes on Redbelly\'s "method not available" answer.');
  const admin = await rpc(path, 'admin_nodeInfo');
  record(2, 'rpc-admin', 'Blocked admin method is refused by the Gateway', 'admin_nodeInfo via Overledger', admin, 'HTTP 403', admin.http === 403, 'The Gateway method blocklist applies to Redbelly too.');
  const gp = await rpc(path, 'eth_gasPrice');
  const send = await rpc(path, 'eth_sendRawTransaction', [await unverifiedTx(153, gp.result)]);
  record(2, 'rpc-unverified', 'Unverified write through Overledger is refused by Redbelly', 'eth_sendRawTransaction from a new unverified key via Overledger', send,
    'refused: "Sender not authorised to write transactions"', !!(send.error && /not authori[sz]ed to write/i.test(send.error.message)),
    'Level 2 (pass-through): Overledger carries the transaction and Redbelly still enforces its identity gate.');
  return { nodeId, path, created };
}

async function stage3(ctx) {
  const pk = process.env.REDBELLY_TESTNET_PRIVATE_KEY;
  if (!pk) { record(3, 'write-skipped', 'Verified write skipped', 'needs REDBELLY_TESTNET_PRIVATE_KEY', {}, 'key given', false, 'A Redbelly-verified testnet address is needed.'); return; }
  const w = new Wallet(pk);
  const nonce = await rpc(ctx.path, 'eth_getTransactionCount', [w.address, 'pending']);
  const gp = await rpc(ctx.path, 'eth_gasPrice');
  const raw = await w.signTransaction({ to: w.address, value: 0n, nonce: hex(nonce.result), gasLimit: 21000n, gasPrice: BigInt(gp.result), chainId: 153n, type: 0 });
  const sent = await rpc(ctx.path, 'eth_sendRawTransaction', [raw]);
  let receipt = null;
  if (sent.result) for (let i = 0; i < 30 && !receipt; i++) { await new Promise((r) => setTimeout(r, 3000)); receipt = (await rpc(ctx.path, 'eth_getTransactionReceipt', [sent.result])).result; }
  record(3, 'write-verified', 'Verified zero-value transfer on Redbelly Testnet through Overledger',
    'eth_sendRawTransaction (self-transfer, value 0) via Overledger', { from: w.address, txHash: sent.result, error: sent.error, status: receipt?.status, block: hex(receipt?.blockNumber) },
    'receipt with status 0x1', receipt?.status === '0x1',
    'Level 2 completed: a transaction signed by a verified address travels through Overledger and is finalised on Redbelly. Explorer: https://redbelly.testnet.routescan.io/tx/' + (sent.result || ''));
}

const ranAt = new Date().toISOString();
const ok = await stage1();
if (ok && args.has('--node-test')) {
  const ctx = await stage2();
  if (ctx && args.has('--write')) await stage3(ctx);
  if (ctx && ctx.created && !args.has('--keep')) {
    const del = await api('DELETE', `/nodes/${ctx.nodeId}`);
    record(2, 'cleanup', 'Test node removed again', 'DELETE /nodes/{id}', { http: del.http }, 'HTTP 200 or 204', del.http === 200 || del.http === 204, 'Leaves no Redbelly node behind on the account.');
  }
}

mkdirSync(dirname(OUT), { recursive: true });
const graded = checks.filter((c) => c.pass !== null);
writeFileSync(OUT, JSON.stringify({
  note: 'Generated by scripts/overledger-account-probe.mjs with an Overledger API key. Keys are never stored.',
  ranAt, gateway: BASE, stages: [...new Set(checks.map((c) => c.stage))],
  passed: graded.filter((c) => c.pass).length, total: graded.length, checks
}, null, 2) + '\n');
console.log(`\nwrote ${OUT}\nnext: npm run build && npm test`);
