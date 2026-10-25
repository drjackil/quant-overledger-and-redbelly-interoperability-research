---
title: Could Redbelly connect to Quant's Overledger?
subtitle: A feasibility study of what a connection would take, what it could offer institutions, and where compliance could break
cutoff: 25 October 2026
version: 1.0
---

## Read this first {#read-first}

This is feasibility research. It answers three questions with public sources: could Redbelly Network connect to Quant's Overledger, what would that take, and what could it offer institutions that use Redbelly.

::: notice
**No partnership, talks or plans.** Redbelly and Quant have no announced partnership or talks, and nothing in this report suggests otherwise [S48]. Redbelly has not published an official position on bridging [S48], so anything that is not in a public source is treated here as unknown.
:::

Every finding sits in one of three labelled panels, so you can always tell what kind of statement you are reading:

- **Confirmed.** Stated in a public source, with the source linked next to the claim. Some confirmed items come from live checks we ran ourselves on 25 October 2026. Those are marked "live check" and link to the raw results, which anyone can reproduce.
- **Analysis.** Our reasoning, built only on confirmed facts. It is not a statement by Redbelly, Quant, Tokeniser or anyone else.
- **Unknown.** Not answered by any public source we could find. We name these gaps so nobody fills them with guesses.

Research cut-off: 25 October 2026. Overledger's documentation says the number of networks it reaches is growing and that the live list comes from its API [S07], so parts of this picture can change quickly. The section [What would change the answer](#signals) lists what to watch. This report contains no price discussion and no investment advice.

## The answer on one page {#answer}

::: confirmed
- Overledger reaches blockchains through Connectors. Public, permissionless networks in six families, EVM among them, can be added self-serve with a single API call. Permissioned, consortium and operator-gated networks go through a managed engagement with Quant's team [S07].
- Redbelly is EVM compatible (EVM version Prague, Solidity v0.8.30) [S23]. Mainnet is chain ID 151 and Testnet is chain ID 153, each with a public RPC address [S21].
- Anyone can read Redbelly, but only identity-verified accounts can write. Users claim an access credential from an accredited issuer before they can enable write access [S25]. In our live check, a transaction signed by a new, unverified key was refused on both Mainnet and Testnet with "Sender not authorised to write transactions" [S49].
- Redbelly is not named in any of the Overledger documentation pages reviewed for this report [S05, S06, S07, S11], and it is not one of the networks Fusion Rollup connected at testnet launch [S11]. Overledger's live network list needs an account to read [S49]. Read with an account on 25 October 2026, the list on the documented gateway held 59 networks, and none of them is Redbelly by name, RPC host or chain ID [S50].
:::

::: analysis
**Redbelly is not connected to Overledger today.** A thin link, where an Overledger account registers a Redbelly RPC endpoint and passes already-signed transactions through, looks possible on paper. Redbelly speaks the EVM family's language [S23], a Redbelly endpoint is already offered by a provider on Overledger's approved list [S07, S21], and Overledger lets accounts add new EVM networks [S07]. It is untested, and it depends on one decision only Quant can make: whether a chain where anyone can read but only verified accounts can write belongs on the self-serve route, or needs an engagement. Overledger's own glossary calls that model "public permissioned" [S06].

Anything deeper, such as Quant-held signing, Flow App workflows, or moving assets through Fusion Rollup, is **not possible yet** unless Quant chooses to support Redbelly. And Redbelly's compliance controls would **not follow an asset to another chain by default**. A connection would have to be designed to carry them.
:::

### Scorecard {#scorecard}

We split "connect" into four levels, because each one needs different work and different people.

| Level | What it means in plain words | Status on 25 October 2026 | What it depends on |
|---|---|---|---|
| 1. Read | Overledger can fetch Redbelly data (balances, blocks, contract state) | [[part:Possible on paper, untested]] | An account registering a Redbelly node, and Overledger's health check accepting it [S07, S49] |
| 2. Pass-through | Overledger carries a transaction that a verified Redbelly account has already signed | [[part:Possible on paper, untested]] | Level 1, plus every sending address holding Redbelly write access [S25, S49] |
| 3. Orchestrate | Overledger tools act on Redbelly: Flow Apps, Quant-held signing, event trackers | [[no:Not possible yet]] | Quant adding Redbelly to those tools, and verified signing addresses [S09, S12] |
| 4. Move | Assets or messages travel between Redbelly and other chains through Overledger | [[no:Not possible yet]] | A Quant-led project to wire Redbelly into Fusion Rollup or a bridge flow [S11] |
| Shared listing | Redbelly appears in Overledger's network list | [[no:Not listed]] | Checked with an account: 59 networks, Redbelly not among them [S50] |
| Bank network reach | Banks on TCH's On-Chain Money network reach Redbelly assets | [[unk:Unknown]] | TCH and its banks; no ledger or public chain link has been announced [S01, S03] |
| Compliance carried across | Receptor and Tokeniser rules still apply after an asset leaves Redbelly | [[no:Not by default]] | How a connection is designed (see [Credentials and assets across chains](#compliance)) |

@diagram(levels)

## Why the question is being asked now {#why-now}

::: confirmed
On 24 September 2026 The Clearing House (TCH) announced that it had selected Quant to power its On-Chain Money Initiative, "a new interoperable payments network that will enable financial institutions of all sizes to clear and settle tokenized deposit transactions" [S01]. Quant's technology "will enable the network's interoperability, orchestration, and transaction-management layer", with connectivity to fiat systems including the RTP and CHIPS networks [S01, S02]. TCH expects the network to become available to participating institutions in the first half of 2027 [S01].

The initiative was first unveiled on 5 June 2026 as a bank-led effort that TCH will operate [S04]. Quant says the selection followed a competitive process, and that it will also offer a shared Tokenised Deposits-as-a-Service platform to US institutions that process through TCH but do not yet have tokenised deposit capability [S03].
:::

::: analysis
For Redbelly, the announcement matters indirectly. A major US bank network has chosen Quant as its interoperability layer. If Quant's software becomes common plumbing for banks, chains that Quant can reach may become easier for those banks to reach. That is why the community is asking.

Two things the announcement does not say are worth stating plainly. First, the announcement text refers to "Quant's technology" and does not name a specific Quant product [S01, S02, S03]. This report treats Overledger as the relevant platform because the task asks about it and because it is the Quant platform whose public documentation covers connecting chains [S05]. Second, nothing in the announcements says the network will connect to Redbelly or to any public chain.
:::

::: unknown
Which ledgers the On-Chain Money network will run on, and whether it will connect to public blockchains at all, is not stated in the announcements we reviewed [S01, S02, S03, S04].
:::

## Overledger in plain words {#overledger}

Think of Overledger as a switchboard. An institution plugs into it once, and the switchboard forwards each call to the right blockchain in that blockchain's own language.

::: confirmed
Overledger is Quant's multi-DLT platform for building applications that span more than one blockchain, with "one set of credentials, one API surface, one execution environment that connects to many DLT networks" [S05]. Its documentation describes these building blocks:

- **Gateway.** The front door. It authenticates callers, routes requests and runs higher-level workflows [S06].
- **Connectors.** Adapters that "abstract individual DLT RPC protocols behind a common interface" [S06]. Each blockchain family has a pool of nodes, made up of Quant-operated nodes plus nodes that customers register [S06].
- **Flow Apps.** Multi-step workflows such as signing, contract deployment, a compliance check or a payment, run as typed sessions [S05]. Most Flow Apps that touch a chain follow a Prepare, Sign, Execute pattern [S12]. Partners can host their own Flow Apps and register them with the Gateway [S05, S12], although every app Quant ships today is internal [S12].
- **Signer.** Either the customer holds the keys and signs, or Quant holds them in a testnet hot wallet or a contracted mainnet KMS or HSM. The Gateway never sees private keys [S09].
- **Overledger Firewall.** Access control in two layers: an off-chain layer that decides whether a user may reach a network, and an on-chain Fusion Firewall that allowlists addresses for contract calls, cross-chain messages and token bridging [S10].
- **Fusion Rollup.** A rollup built on the OP Stack that anchors to several base chains at once, giving one EVM environment across them [S11].
- **Quant Connect.** The web portal where users create an account and API keys [S08].

The API also offers event trackers that watch a contract event on a given network and call back a URL [S14], and signed webhooks for workflow events [S12].
:::

@diagram(stack)

### How a chain gets connected today {#how-chains-connect}

::: confirmed
Overledger's Connectors chapter describes two routes [S07].

**Route A: self-serve.** For public, permissionless networks in six families: EVM, Solana, Cosmos, SUI, Hedera and Aptos [S07]. A family qualifies if "(a) its nodes expose RPC or REST over HTTPS, (b) the RPC requires no security factor beyond an API key, and (c) node identity does not matter to other tenants" [S07]. An account can add a node to a network Overledger already lists, or add a network Overledger does not list yet, as long as it belongs to a self-serve family. "The first POST /nodes call registers both the network and your node for it. This new network will then be available for Overledger users" [S07].

Every node is registered as public or private. A **public** node joins the shared pool, must come from a whitelisted provider domain, and must carry the provider's API key in its URL. The approved domains include ankr.com [S07, S13]. A **private** node can come from any domain and is only usable by the account that added it [S07]. Every node passes a health check at registration [S07].

**Route B: managed engagement.** For networks "where node identity matters, typically permissioned DLTs used by regulated consortia and operator-gated public chains" [S07]. Examples include Hyperledger Fabric, R3 Corda, Canton, permissioned Besu and Quorum. The documentation adds that if a network exposes RPC over HTTPS "and authenticates with a bearer or API-key factor, Quant can normally onboard it" [S07]. A brand-new blockchain family needs a "DLT checker (health validation + chain identifer lookup)", which Quant estimates at about two days of work, plus about a day for each app that must support it [S07].

A few rules apply to every route. The Gateway blocks administrative methods such as `personal_*`, `admin_*` and `txpool_*` on EVM [S07]. Each network has a visibility of public, permissioned (users granted by the network owner) or private [S07]. When choosing a node, the Gateway prefers the caller's own private nodes, then weighs latency, error rate and QNT staked against each node [S07]. The live list of networks comes from `GET /networks` [S07].

**Fusion Rollup** has its own set of connected chains. At testnet launch they were Ethereum Sepolia, Polygon Amoy and Quant's own permissioned Besu testnet [S11]. Each connected chain hosts "Standard OP Stack contracts, one deployment per chain" [S11].
:::

@diagram(routes)

::: unknown
We found no documented self-serve way to add a new base chain to Fusion Rollup. The pages we reviewed say which chains Fusion connected, not how a chain is added [S11].
:::

## Redbelly, in the terms that matter here {#redbelly}

::: confirmed
- **Purpose.** Redbelly describes itself as "a layer 1 blockchain, built and optimised for real world asset tokenisation" [S15].
- **EVM base.** Redbelly "can execute smart contracts written for the EVM". Its portal lists EVM version Prague and Solidity v0.8.30 [S23].
- **Networks and endpoints.** Mainnet is chain ID 151 with RPC at `governors.mainnet.redbelly.network`; Testnet is chain ID 153 [S21]. Redbelly's portal also lists two third-party public Mainnet endpoints: Ankr (`rpc.ankr.com/redbelly_mainnet`) and Uniblock, which needs an API key in a header [S21].
- **Consensus and finality.** DBFT is leaderless, tolerates faults up to t < n/3, finalises transactions deterministically "in a matter of seconds", and the chain "cannot fork" [S22].
- **Fees.** The unit price of gas is fixed in US dollar terms and converted at execution through an on-chain oracle [S24].
- **Identity before writing.** All participants must prove who they are before gaining access [S25]. A user proves a passport through biometric checks with an accredited issuer, then self-enables write access "through a specific network smart contract" [S26]. Accredited issuers are listed in an on-chain registry [S27]. The accredited issuer in Redbelly's access app is Averer, and one verified identity can have several accounts, with Testnet access offered after verification [S30]. Mainnet and Testnet approvals are separate [S46].
- **Businesses.** Businesses prove they are incorporated to an accredited issuer [S29], and at least one officeholder must first onboard as a user [S27].
- **Node operators.** Running a consensus node needs network access for two accounts and selection into the operator programme, and applications are currently closed [S31].
:::

### Redbelly already has cross-chain routes {#existing-routes}

::: confirmed
- **LayerZero.** Redbelly Mainnet is listed among LayerZero V2 deployments [S38]. Redbelly's portal lists tokens that move via LayerZero using Stargate, including RBNT, USD₮0, AUDF and WETH [S33].
- **Lucid Labs.** Powered by Polymer and LayerZero [S34]. Redbelly's portal names it as the way to bring RBNT back to Redbelly from another chain [S32].
- **Celer cBridge.** A pegged bridge connecting Ethereum, BNB Chain and Redbelly [S36]. Celer's announcement lists USDT, USDC, WBTC and ETH moving into Redbelly and RBNT moving out [S36]. Redbelly's portal adds that through Celer, RBNT "bridges out from Redbelly to Ethereum and BNB Chain, not back" [S35].
- **Wrapped RBNT on Ethereum.** Redbelly announced Wrapped RBNT on Ethereum with the official contract `0xb45ffb51984d626ee758b336c61cf20990c6bf13` [S37]. The same address appears in the portal's Lucid Labs table [S34]. Celer's wrapped RBNT on Ethereum is a different contract, `0x063a1D5BFEAb213c9c12f47b704fccf81D60983e` [S35].
- **Community bridges.** The winning TASK-08 entry is a lock-and-mint bridge from Ethereum Sepolia to Redbelly Testnet secured by a 2-of-3 relayer set [S44], with a live demo [S45]. The winning TASK-16 entry is a playbook for recovering stuck cross-chain RBNT [S47].
:::

::: analysis
Two facts carry most of the weight for this question.

First, Redbelly speaks the same EVM language as Overledger's largest self-serve family, and mainstream cross-chain tools already work with it. That shows Redbelly's EVM base is usable by outside infrastructure. It says nothing about Overledger specifically.

Second, Redbelly is open to read but gated to write. Overledger sorts networks into public permissionless (self-serve) and permissioned or operator-gated (engagement) [S07]. Redbelly does not sit cleanly in either box, and Overledger's glossary describes exactly its model under the name "public permissioned": "anyone can read but only allowlisted parties can write" [S06]. How Quant would classify Redbelly is the first practical question any connection would face.

A smaller point matters too. There are already at least two different wrapped RBNT contracts on Ethereum [S34, S35], from different bridges. Fusion Rollup's "Unify" primitive exists to "merge multiple chain-specific representations of the same underlying asset into a single rollup balance" [S11]. That is relevant to Redbelly's situation, but it would only help if Quant chose to support those tokens, which needs governance sign-off [S10].
:::

## What we tested ourselves {#live-checks}

Documentation can be out of date, so we checked the parts we could check without an Overledger account. All checks are read-only except one deliberately invalid write. The script is `scripts/probe.mjs`, the raw results are in `evidence/live-checks.json`, and `npm run probe` repeats them.

::: live
| Check, 25 October 2026 | Result | Why it matters |
|---|---|---|
| `eth_chainId` on Redbelly Mainnet, Testnet and Ankr | 151, 153 and 151 [S49] | All three endpoints answer standard EVM JSON-RPC over HTTPS. That matches self-serve test (a). |
| Ankr endpoint with no API key | Answers normally [S49] | Ankr is on Overledger's approved list [S07] and serves Redbelly Mainnet [S21]. Overledger requires a provider key in a public node's URL, which we did not test. |
| `net_version` on Mainnet | Not available, error -32601 [S49] | Overledger's own docs say it is kept "for wallets and tools that predate eth_chainId" [S11]. They do not say which methods the EVM health check uses. |
| `eth_syncing`, `eth_gasPrice`, `eth_feeHistory`, `eth_maxPriorityFeePerGas` | All answered [S49] | Standard fee and status methods work. |
| `finalized` block tag | Same as the latest block [S49] | Consistent with deterministic finality [S22]. |
| `safe` block tag | {{SAFE_LAG}} blocks behind `finalized` [S49] | Unusual. Software that waits for `safe` would see an older block. The reason is not documented. |
| Zero-value transaction from a new, unverified key | Refused on Mainnet and Testnet: "Sender not authorised to write transactions" [S49] | Confirms write gating at the RPC. Matches the community report [S46]. |
| Gas estimate for the same unverified key | Succeeds [S49] | A workflow could pass its "prepare" step and then fail at "execute". |
| Permit2 at its usual address | Not deployed [S49] | Overledger's x402 payment gates use Permit2 on EVM [S12]. |
| Multicall3 and the CREATE2 deployer | Deployed [S49] | Present at their usual addresses, so tools that look for them there will find them. |
| Overledger `GET /health` | Public, HTTP 200 [S49] | The gateway named in the docs is live. |
| Overledger `GET /networks` and `/networks/fusion` | HTTP 401 without an account [S49] | The list cannot be read publicly. We read it with an account, see [Account-level checks](#account-checks). |
:::

## Account-level checks {#account-checks}

The checks above use public access only. Three further checks need access that a public researcher does not have, so they are packaged as a script for someone who holds it.

::: confirmed
- **Reading the live network list needs an Overledger account.** The list is returned by `GET /networks` [S07], which answers HTTP 401 without credentials [S49]. An account is created in Quant Connect, which issues the API key [S08].
- **Registering a node can create a shared network entry.** For a network Overledger does not list yet, "the first POST /nodes call registers both the network and your node for it", and the new network "will then be available for Overledger users" [S07]. The published API reference for `POST /nodes` lists the node URL, network, name and family, and describes public node rules [S13]. The public or private choice is described for the Quant Connect form [S07].
- **Completing a Redbelly transaction needs a verified address.** That means a passport check with biometrics through an accredited issuer, Averer, before write access is enabled [S26, S30].
:::

::: analysis
For those reasons this report does not register a public Redbelly network on Overledger: doing so would make an entry visible to other Overledger users, which could be read as a listing. The script is built to stay on the safe side of that line. Stage 1 only reads. Stage 2 uses Redbelly Testnet, prefers a node made private in the Quant Connect form, and deletes the node at the end. Stage 3 sends one zero-value transfer from the operator's own verified testnet address. API keys and private keys are never stored.
:::

@include(account-checks)

::: confirmed
- **The live list.** 59 networks were visible to the account: 54 in the EVM family, and one each for Solana, SUI, Aptos, Hedera and Canton [S50]. That covers five of the six self-serve families in the documentation; no Cosmos network was listed [S07, S50].
- **Mostly test networks.** Apart from Quant's Canton private network, which is marked permissioned, every entry is a test network such as Ethereum Sepolia, Base Sepolia or Avalanche Fuji, and the documented gateway itself is a testnet environment [S50].
- **No Redbelly.** Searching every field of every entry for "redbelly", "rbnt", Redbelly's RPC host, and chain IDs 151, 152 and 153 found nothing [S50].
- **Fusion's base chains.** Fusion Rollup lists three connected networks: Quant Private Network (chain ID 7695), Ethereum Sepolia and Amoy [S50]. That matches the documentation's three base chains at testnet launch [S11].
- **Field names differ from the documented model.** The live entries use `displayName` and `dltType`, where the documented network model uses `name` and `type` [S07, S50].
:::

::: analysis
The listed set shows how varied the EVM chains are that Overledger already reaches on testnet, from rollups such as zkSync, Scroll and Linea to separate layer 1 chains such as Avalanche, Sei and Monad [S50]. That makes it more plausible that an EVM chain with Redbelly's differences could pass the EVM checker, but it is not a test of Redbelly. The list we read is the testnet environment, so it says nothing about Overledger's mainnet. The stage 2 node test would answer the health check question directly; it was not run because registering a new network on the shared gateway could create an entry other users can see [S07].
:::

## Can Redbelly connect now? {#connect-now}

Each Overledger route is tested below against what Redbelly's documentation and our live checks show.

### Route A, part 1: does Redbelly pass the self-serve tests? {#self-serve-tests}

| Self-serve test [S07] | What Redbelly shows | Our reading |
|---|---|---|
| (a) Nodes expose RPC over HTTPS | Public HTTPS RPC for Mainnet and Testnet [S21], answering in our check [S49] | [[ok:Meets it]] |
| (b) RPC needs no security factor beyond an API key | Reading needs no key at all on the governor or Ankr endpoints [S49]. Writing needs a verified sending address, which is a property of the transaction, not of the RPC connection [S25, S49] | [[part:Meets it for the RPC; writes are gated at the account level]] |
| (c) Node identity does not matter to other tenants | Any endpoint gives the same chain state; the gate sits on who signs, not on which node you call [S25, S49] | [[part:Appears to meet it; Quant's call]] |
| Family is "public, permissionless" | Open to read, gated to write. Overledger's glossary names this "public permissioned" [S06]; its engagement route covers "operator-gated public chains" [S07] | [[unk:Unknown, Quant's call]] |

::: analysis
On the three written tests, Redbelly looks like a fit. The difficulty is the category label. Overledger describes self-serve as being for public, permissionless networks [S07], and Redbelly's write gate is exactly the kind of property that might push it into the engagement route. This is a classification decision for Quant, not something the Redbelly community can settle.
:::

### Route A, part 2: registering a node {#self-serve-node}

::: confirmed
- Self-serve covers networks Overledger does not list yet, if their family is supported, and EVM is supported [S07].
- A public node must come from an approved provider domain with an API key in the path; ankr.com is approved [S07, S13]. Redbelly's portal lists an Ankr Mainnet endpoint [S21].
- A private node can come from any HTTPS domain and is only usable by the account that added it [S07].
:::

::: analysis
On paper, two registrations are possible.

- **Private node.** An Overledger account holder registers Redbelly's own RPC URL as a private node. Only that account can use it. This is the lowest barrier and would give a working Level 1 (read) link for that one account, and Level 2 (pass-through) for transactions signed by a verified Redbelly address.
- **Public node.** An account registers a key-bearing Ankr URL for Redbelly as a public node. If accepted, the first registration would also create the network entry and make Redbelly available to other Overledger users [S07].

Neither changes Redbelly's rule that only verified accounts can write. Overledger would carry the transaction; Redbelly would still check the sender.
:::

::: unknown
- Whether Overledger's EVM health check passes against Redbelly. It is described only as "health validation + chain identifer lookup" [S07]. Redbelly does not serve `net_version` and returns an older block for the `safe` tag [S49]. Either could matter, or neither.
- Whether a key-bearing Ankr URL for Redbelly exists in the form Overledger expects. Ankr's keyless endpoint works [S49]; the keyed form was not tested.
- Whether Quant would let a write-gated chain be created through self-serve at all.
- Whether the mainnet environment lists different networks. The list we read came from the testnet gateway named in the documentation [S50].
:::

### Route B: managed engagement {#engagement}

::: confirmed
Quant uses managed engagement for permissioned, consortium and operator-gated networks, and says a network with HTTPS RPC and bearer or API-key authentication can normally be onboarded [S07].
:::

::: analysis
Redbelly's public RPC fits the transport part of that description [S21, S49]. An engagement is the route by which Redbelly could become a fully supported network with Quant-run nodes, firewall settings and Quant support. One practical wrinkle: Overledger's pools include Quant-operated nodes [S06], but running a Redbelly consensus node needs selection into the operator programme and network access, and applications are currently closed [S31]. Quant would more likely use third-party RPC endpoints, or run a non-consensus node if Redbelly allows one, which we could not confirm. Any engagement needs Quant to choose to do it. Nothing public says such work exists or is being considered.
:::

### Route C: Fusion Rollup {#fusion}

::: confirmed
Fusion connected Ethereum Sepolia, Polygon Amoy and Quant's own permissioned Besu testnet at launch [S11]. Every connected chain hosts standard OP Stack bridge and dispute contracts [S11], and Fusion Firewall policies are mirrored on each connected chain [S06]. Deposits and withdrawals are signed by the user's own keys [S11].
:::

::: analysis
Joining Fusion would mean deploying Fusion's OP Stack contracts on Redbelly and wiring Redbelly into the rollup's deposit, messaging and withdrawal paths. On Redbelly, the deploying address and every address that deposits or withdraws would need write access [S25]. Fusion treats a deposit as final once the connected chain's block has finalized [S11]. Redbelly's `finalized` tag returns the latest block, which fits, but its `safe` tag lags [S49], so how Fusion's software reads Redbelly's block tags would need checking. This would be a project led by Quant, with Redbelly-side participants taking part. It is not something the community can switch on.
:::

::: unknown
No public source describes the steps, cost or timeline for adding a base chain to Fusion Rollup.
:::

### Verdict {#verdict}

::: analysis
**Not connected today.** A thin link at Level 1 (read) and Level 2 (pass-through) looks possible on paper through self-serve, most simply as a private node. It is untested, and two things could block it: Overledger's health check, and how Quant classifies a write-gated chain. Levels 3 and 4 (Quant-held signing, Flow Apps, Fusion Rollup) are not possible yet unless Quant chooses to support Redbelly.
:::

## What a connection would take {#the-work}

The table lists the work in the order it would happen, in plain words. "Who would act" is our reading of the documented roles. It does not describe any actual plan by anyone.

| Step | In plain words | Who would act | Open question |
|---|---|---|---|
| 1. Pick the route | Choose a private self-serve node, a public self-serve node, an engagement, or Fusion [S07, S11] | An Overledger account holder, or Quant | How Quant classifies a write-gated chain |
| 2. Provide a node | Point Overledger at a Redbelly RPC endpoint. Public listing needs a whitelisted provider with a key in the URL [S07] | Account holder; a provider such as Ankr [S21] | Does the keyed Ankr URL work |
| 3. Pass the health check | Overledger checks the node and the chain's identity before accepting it [S07] | Quant's software | Does the EVM checker rely on `net_version` or `safe` [S49] |
| 4. Verify every sender | Every address that signs Redbelly transactions needs a Redbelly access credential [S25]. Businesses use business verification [S29] | The institution, an accredited issuer, and Quant if Quant holds keys [S09] | Whose identity stands behind a Quant-held key |
| 5. Test on Testnet | Run reads, signed writes, refusals for unverified senders, fees and event trackers against chain ID 153 [S21, S14] | Quant engineers with Redbelly developers | Needs an Overledger account and verified test accounts |
| 6. Decide how assets move | Keep assets on Redbelly and move instructions, or represent them on other chains [S11] | Asset issuers, and Quant for Fusion | The compliance design in the next section |
| 7. Map compliance | Line up Overledger's allowlists [S10] with Receptor eligibility [S28], including what happens when someone stops being eligible | Issuers, Quant and Redbelly | Legal and product decisions |
| 8. Agree terms | Commercial, legal and support arrangements between whoever runs it | The parties involved | Not public |

::: analysis
**Steps 1 to 5 are enough for Levels 1 and 2.** Because Redbelly is an EVM chain, it should not need the "new DLT family" work Quant estimates at about two days plus a day per app [S07], unless Redbelly's differences, such as the missing `net_version`, force a Redbelly-specific checker.

**Step 4 is the step that is specific to Redbelly.** On Redbelly every signing address is an identity decision as well as a technical one: a new key is refused whatever it signs [S25, S49]. Overledger's API keys only identify the caller, and transactions still need the caller's own signature [S08], so the identity question attaches to the signing key, wherever it lives.

**Steps 6 and 7 are where most of the real effort would go,** because they decide whether a Redbelly asset keeps its protections once it touches another chain.
:::

### Small technical gaps found {#gaps}

::: analysis
None of these is a blocker on its own. Each is a concrete item an engineer would need to check.

- **`net_version` is not served** [S49]. Overledger keeps it for older wallets and tools [S11]. If a checker or a Flow App uses it, it would need to use `eth_chainId` instead.
- **The `safe` tag returns an older block than `finalized`** [S49]. Software that waits for `safe` would see Redbelly as slower than it is.
- **Permit2 is not deployed** at its usual address [S49]. Overledger's x402 payment gates on EVM rely on Permit2 [S12], so paid Flow App actions on Redbelly would need it deployed by a verified account first. The CREATE2 deployer it normally comes from is present [S49].
- **Gas estimates succeed for unverified addresses** [S49]. A workflow should check write access before it prepares a transaction, not after it fails.
- **Fees are fixed in US dollar terms through an on-chain oracle** [S24]. Fee logic that assumes a market fee would need testing against this model.
:::

## What it could offer institutions {#offer}

::: analysis
**For institutions that already use Overledger:**

- **One integration instead of another.** Redbelly would sit behind the same credentials and API as their other networks [S05], instead of needing its own integration.
- **Workflows across chains.** Flow Apps and event trackers [S12, S14] could tie a step on Redbelly to steps elsewhere. For example, a payment instruction on one network could be released when a tokenised fund unit changes hands on Redbelly. This needs Quant to support Redbelly in those tools.
- **Custody choices.** Overledger supports self-custody or Quant-held keys in a KMS or HSM [S09], which suits institutions with different custody policies, as long as every signing address is Redbelly-verified [S25].

**For institutions using Redbelly:**

- **A possible route toward bank networks that standardise on Quant**, if those networks ever connect to outside chains. Today that is unknown [S01, S03].
- **Redbelly's own properties come along.** Identity-verified counterparties [S25], deterministic finality [S22], and fees fixed in US dollar terms [S24] are the properties an institution would weigh when choosing where to issue. A connection would not change them.
- **Tokeniser's API.** Tokeniser already offers an API and MCP for integrating with existing systems [S39]. That is the kind of surface an Overledger workflow, or an AI agent driving one, could call.

**What it would not offer:**

- **Compliance does not travel automatically.** Overledger's Firewall controls which users and addresses may act inside Overledger [S10]. Redbelly's controls decide who may hold and move assets on Redbelly [S28, S39]. They are separate systems, and nothing links them today.
- **No access to TCH's network follows from it.** Who joins that network, and which ledgers it uses, is TCH's decision [S01, S04].
- **A new dependency.** Institutions would rely on a third-party platform whose terms for such a connection are not public.
:::

## Credentials and assets across chains {#compliance}

This section explains how Redbelly's compliance tools work today, and where they could stop working once an asset, or a claim on it, leaves Redbelly.

::: confirmed
- **Receptor credentials** are W3C verifiable credentials, with Issuer, Holder and Verifier modules [S16]. Issuers that grant network access must be accredited [S16].
- **Issuer identifiers name the Redbelly network.** Averer's issuer identifiers are network specific, for example `did:receptor:redbelly:mainnet:...` for Mainnet [S19].
- **Proof by Query** checks a zero-knowledge proof in a verifier smart contract; the verifier never sees or stores the personal data [S17]. The Eligibility SDK uses Privado ID and the Iden3 zero-knowledge ecosystem [S19].
- **Selective Disclosure** uses BBS+ signatures and "can only be used off-chain" [S18].
- **Query support today.** On-chain checks support single queries; on-chain multi query is listed as planned. Credential types include AML/CTF and Australian sophisticated or wholesale investor credentials. Verifiers are told to keep revocation checks on in production [S20].
- **Eligibility in contracts.** Eligibility checks can restrict smart contract functions to users who prove they meet the criteria, and each developer decides which issuers to trust [S28].
- **Tokeniser** runs on Redbelly and "programs eligibility into every asset at the protocol level: identity, KYC, AML, CTF, wholesale and sophisticated investor tests, and TMD". Every holder is verified and every transfer checked [S39]. Rules are "enforced at the point of transfer, every time" [S40]. Trades that fail a check do not proceed [S41]. In a secondary transfer, "ownership and payment are exchanged in a single step" [S42]. Pledged units stay locked until the loan is repaid [S43].
- **Overledger's Fusion Firewall** allowlists on-chain addresses; Overledger maps users to their authorised addresses off-chain [S10], and policies are mirrored on each connected chain [S06].
:::

@diagram(journey)

::: analysis
All of the checks above run **on Redbelly**. A Receptor proof is checked by a contract, and a Tokeniser transfer is checked against the asset's rules at the point of transfer [S17, S40]. Another chain, or a rollup, does not see those checks. It applies its own rules. So a connection either brings equivalent checks to the other side, or keeps the asset where the checks are.

| Moment | On Redbelly today | Once it touches another chain | Where it could break |
|---|---|---|---|
| Holding | Every holder is verified [S39] | The other chain applies its own rules | A wrapped token without the same checks lets anyone hold it |
| Transferring | Every transfer is checked [S40] | Transfers of a wrapped token happen out of Redbelly's sight | Secondary trading skips eligibility entirely |
| Proving eligibility | A zero-knowledge proof is checked by a verifier contract [S17] | A contract elsewhere cannot read that result unless it is relayed | The relayed status goes stale or is relayed wrongly |
| Losing eligibility | Revocation checks apply when kept on [S20] | Any copy of the status elsewhere must also update | A holder no longer eligible stays allowlisted elsewhere |
| Disclosing data | Selective Disclosure is off-chain only [S18] | There is no on-chain proof to carry across | Checks that rely on disclosure cannot be re-run by a contract |
| Who holds the key | One verified identity behind each account [S25, S30] | The asset may sit with a custodian, an omnibus wallet or a Quant-held key [S09] | It becomes unclear whose identity stands behind an address |
| Paying for it | Ownership and payment move in one step [S42] | Payment may settle on a different network from the asset | One leg completes and the other does not |
| Pledged as collateral | Units locked until repayment [S43] | A copy elsewhere could be pledged again | Double use of the same asset |
| Bridge mechanics | Not involved | Lock-and-mint, custody and relayers come into play | "Lock-and-mint mismatches, custodian compromise, oracle failure" [S11] |
| Several copies | One native asset | Different bridges issue different wrapped versions [S34, S35] | Rules applied to one copy but not another |
| Coming back | Sending on Redbelly needs write access [S25], and Tokeniser assets only go to eligible holders [S39] | The recipient must be verified to move the asset onward, and eligible to hold a Tokeniser asset | Funds land where they cannot be moved, a kind of failure the DAO playbook already covers for RBNT [S47] |
:::

### Designs that would keep compliance intact {#designs}

::: analysis
Five designs follow from the facts above. They are options for discussion, not recommendations to any party, and none is known to be under consideration.

1. **Keep the asset on Redbelly and move instructions.** Overledger coordinates the workflow, but the asset never leaves Redbelly, so every transfer still passes Tokeniser's and Receptor's checks [S39, S17]. A payment leg could settle elsewhere. Least compliance risk; needs care so both legs complete or neither does.
2. **Package the eligibility check as a Flow App.** Overledger lists a "compliance check" as a typical Flow App step [S05] and lets partners host external Flow Apps [S12]. A workflow could call a Receptor eligibility check before acting. This keeps the check where it is designed to run, but someone would have to build and host that app.
3. **Represent the asset elsewhere, with eligibility mirrored.** The destination contract only allows transfers between allowlisted addresses that mirror Redbelly eligibility. Overledger's address allowlists [S10] are one place such a mirror could live. It needs a trusted way to update the mirror when people stop being eligible.
4. **Re-prove eligibility on the destination.** The holder proves eligibility again on the other chain with the same credential. Receptor's tooling builds on Iden3 and Privado ID [S19], but its documentation describes verification on Redbelly only.
5. **Unify representations through Fusion.** Fusion can merge several chain-specific versions of one asset into a single rollup balance [S11], and its firewall controls which tokens may be deposited [S10]. It would not by itself enforce Tokeniser's investor rules.
:::

::: unknown
- Whether Receptor verifier contracts, or trust in Redbelly's accredited issuers, can be used on chains other than Redbelly.
- How Tokeniser would treat a representation of one of its assets on another chain. Its public material describes checks on Redbelly only [S39, S40].
- Whether Overledger's allowlists could be fed by Receptor eligibility automatically. The documentation describes allowlists managed by Overledger and by contract deployers [S10], not by outside credential systems.
:::

## Not possible yet, and unknown {#unknowns}

::: confirmed
**Not possible yet, based on public sources at the cut-off:**

- Using Redbelly as a listed Overledger network. None of the Overledger documentation reviewed names Redbelly [S05, S06, S07, S11], and the live network list read with an account does not include it [S50].
- Connecting Redbelly to Fusion Rollup. It is not among Fusion's connected networks, and no self-serve route is documented [S11].
- Sending a Redbelly transaction from an unverified address by any route, Overledger included [S25, S49].
- Using Overledger's Permit2-based payment gates on Redbelly without first deploying Permit2 [S12, S49].
:::

::: unknown
**Unknown:**

- How Quant would classify Redbelly: self-serve or managed engagement [S06, S07].
- Whether Overledger's EVM health check accepts a Redbelly node [S07, S49].
- Whether the live network list differs on Overledger's mainnet environment or for other accounts [S07, S50].
- Whether Quant-held signing keys could be Redbelly-verified, and under whose identity [S09, S25].
- Whether TCH's On-Chain Money network will connect to any public chain [S01].
- Whether Receptor verification can run on other chains.
- The cost, timeline and commercial terms of any engagement.
- Redbelly's official position on bridging, which has not been published [S48].
:::

## What would change the answer {#signals}

::: analysis
These public signals would move items from "unknown" to "confirmed". They are things to watch, not predictions:

- Redbelly appearing in Overledger's documentation or in `GET /networks` [S07].
- A published test of an Overledger Connector against Redbelly Testnet, chain ID 153 [S21].
- Redbelly publishing an official position on bridging [S48].
- TCH publishing which ledgers the On-Chain Money network will use [S01].
- Receptor documentation describing verification on chains other than Redbelly [S16, S17].
- Quant documenting how a base chain is added to Fusion Rollup [S11].
:::

## Method and limits {#method}

- **Sources.** Quant's Overledger documentation and API reference; the TCH and Quant announcements; Redbelly's technical documentation, Vine developer portal and access app; Tokeniser's website; Celer's and LayerZero's documentation; Redbelly's announcement of Wrapped RBNT; and DAO community work. Every source is listed with what it supports in the [source list](#sources).
- **Checking every claim.** For each source we recorded the exact phrases that support our claims, {{QUOTE_COUNT}} in total. `npm run verify:sources` loads every link and confirms each phrase is still on the page. On {{SOURCE_CHECK_DATE}} all {{SOURCE_COUNT}} external links loaded and every phrase was found.
- **Checking the text.** `npm run lint` checks that every confirmed panel cites a source, that every citation points to a listed source, and that the text contains no partnership wording, no price talk, no personal credit, and no dashes or emoji outside the brand rules.
- **Live checks.** `npm run probe` repeats the {{PROBE_COUNT}} checks in [What we tested ourselves](#live-checks). It uses no credentials and cannot move funds.
- **Checks that need access.** Reading Overledger's live network list, sending calls through Overledger to a Redbelly node, and completing a Redbelly transaction need an Overledger account and a Redbelly-verified address. They are packaged as `npm run probe:account`. Stage 1, the read-only network list check, was run with an Overledger account on 25 October 2026 and its results are in [Account-level checks](#account-checks). Stages 2 and 3 were not run, so every statement about how Overledger would behave with a Redbelly node is analysis, not a test result.
- **Vendor material.** Descriptions from Quant, Redbelly, Tokeniser and bridge providers are their own. We report what they say and label anything beyond that as analysis.
- **Neutrality.** This report takes no view on whether a connection should happen. It contains no price discussion and no investment advice.

## Glossary {#glossary}

| Term | Meaning |
|---|---|
| Overledger | Quant's platform for applications that span several blockchains [S05] |
| Gateway | Overledger's front door: authentication, routing and workflows [S06] |
| Connector | Overledger's adapter for one family of blockchains [S06] |
| Self-serve | Adding a node or network to Overledger yourself through `POST /nodes` [S07] |
| Managed engagement | Onboarding a network with Quant's team [S07] |
| Flow App | A multi-step workflow run through the Gateway [S12] |
| Fusion Rollup | Quant's rollup that anchors to several base chains at once [S11] |
| EVM | Ethereum Virtual Machine, the smart contract environment Redbelly supports [S23] |
| RPC endpoint | The web address software calls to read from or send to a blockchain node |
| Public permissioned | Overledger's term for a network anyone can read but only allowlisted parties can write [S06] |
| Receptor | Redbelly's identity and verifiable credential protocol [S16] |
| Verifiable credential | A signed digital statement about a person or company, held by them [S16] |
| Accredited issuer | An issuer Redbelly allows to grant network access [S27] |
| Zero-knowledge proof | A way to prove a fact, such as eligibility, without revealing the data behind it [S17] |
| Lock-and-mint | A bridge pattern that locks an asset on one chain and creates a copy on another [S44] |
| Tokenised deposit | A bank deposit represented on a ledger, the subject of TCH's initiative [S01] |
| KMS or HSM | Key management services and hardware security modules that protect signing keys [S09] |
| TMD | Target market determination, one of the rules Tokeniser says it enforces at the point of transfer [S40] |
