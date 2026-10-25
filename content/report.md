---
title: Could Redbelly connect to Quant's Overledger?
subtitle: An evidence-first look at the technical fit, the work involved, the institutional value and the compliance risks of linking Redbelly Network to Overledger
cutoff: 25 October 2026
version: 1.1
---

## Before you read {#read-first}

This document studies one question from public evidence: is a link between Redbelly Network and Quant's Overledger technically feasible, what would building it involve, and what would institutions on Redbelly gain or risk.

::: notice
**Read this as research, not news.** No partnership or talks between Redbelly and Quant have been announced, and this document does not imply any [S48]. Redbelly has published no official stance on bridging either [S48]. Wherever no public source answers a point, we mark it as unknown instead of guessing.
:::

Each finding carries one of three labels:

- **Confirmed** means a public source says it, and the citation chip beside the sentence links to that source. Results of the tests we ran ourselves also count as confirmed; they are labelled "live check" and link to raw output that anyone can regenerate.
- **Analysis** is our own reasoning from confirmed facts. Nobody at Redbelly, Quant or Tokeniser has said it.
- **Unknown** marks a gap that no public source fills.

Evidence was gathered up to 25 October 2026. Quant says Overledger keeps adding networks and points readers to its API for the current set [S07], so some details here will date quickly. [What would change the answer](#signals) lists the things worth watching. There is no price talk and no investment advice here.

## The verdict in sixty seconds {#answer}

::: confirmed
- Overledger has two doors for blockchains. Any account can plug in an open network from one of six supported families, EVM among them, with a single API request. Consortium, permissioned and operator-gated networks are onboarded in a project with Quant's team [S07].
- Redbelly runs the EVM at version Prague with Solidity v0.8.30 [S23]. It has a Mainnet (chain 151) and a Testnet (chain 153), each with a public RPC address [S21].
- Reading Redbelly is open to all, but writing needs an identity. Before switching on write access, each user has to collect an access credential issued by an accredited issuer [S25]. When we signed a transaction with a brand new key, both networks rejected it with "Sender not authorised to write transactions" [S49].
- None of the Overledger documentation we read mentions Redbelly [S05, S06, S07, S11], and Fusion Rollup did not include it among its first connected chains [S11]. Using an Overledger account, we pulled the live network list on 25 October 2026: it held 59 networks and Redbelly was not one of them by name, RPC host or chain ID [S50].
:::

::: analysis
**Today there is no Redbelly connection on Overledger.** The smallest possible link would be an Overledger account pointing at a Redbelly RPC endpoint, so Overledger can read the chain and relay transactions that verified Redbelly users have already signed. On paper that looks achievable: Redbelly is EVM [S23], Ankr already runs a Redbelly endpoint and sits on Overledger's list of approved providers [S07, S21], and accounts may add EVM networks Overledger has never seen [S07]. Nobody has tested it. The deciding factor belongs to Quant: whether a chain with open reads and gated writes, which Overledger's own glossary calls "public permissioned" [S06], may use the self-service door.

Everything beyond that minimal link, including signing keys held by Quant, Overledger workflows and moving value through Fusion Rollup, cannot happen unless Quant adds Redbelly support. Separately, Redbelly's compliance rules stay on Redbelly. An asset copied to another chain leaves them behind unless the link is deliberately built to carry them.
:::

### The connection ladder {#scorecard}

"Connected" can mean very different things, so we split it into four rungs. Each rung needs more work and a different set of people.

| Rung | What a user would notice | Can it happen today? | Who holds the key to it |
|---|---|---|---|
| 1. Observe | Overledger shows Redbelly balances, blocks and contract state | [[part:Plausible, not tested]] | Any Overledger account, provided the node passes Overledger's health check [S07, S49] |
| 2. Relay | Overledger forwards a Redbelly transaction that a verified user signed | [[part:Plausible, not tested]] | As rung 1, and every signer must already have Redbelly write access [S25, S49] |
| 3. Automate | Flow Apps, Quant custody keys and event trackers work on Redbelly | [[no:Not available]] | Quant, plus Redbelly-verified signing addresses [S09, S12] |
| 4. Transfer value | Tokens or messages cross between Redbelly and other chains via Overledger | [[no:Not available]] | Quant, through a Fusion Rollup or bridge project [S11] |
| Listing | Redbelly shows up in Overledger's network list | [[no:Absent]] | Read with an account: 59 networks, no Redbelly [S50] |
| Bank reach | Institutions on TCH's network can reach Redbelly assets | [[unk:Unknown]] | TCH and its member banks; no ledgers or public chain links announced [S01, S03] |
| Rules travel | Receptor and Tokeniser checks still apply once an asset leaves Redbelly | [[no:Only by design]] | Whoever designs the link (see [Compliance across chains](#compliance)) |

@diagram(levels)

## Where this question comes from {#why-now}

::: confirmed
The Clearing House (TCH) announced on 24 September 2026 that it had chosen Quant to power its On-Chain Money Initiative, which it describes as "a new interoperable payments network that will enable financial institutions of all sizes to clear and settle tokenized deposit transactions" [S01]. Quant's technology "will enable the network's interoperability, orchestration, and transaction-management layer", and the network will connect to existing rails such as RTP and CHIPS [S01, S02]. TCH expects participating institutions to have access in the first half of 2027 [S01].

TCH had first presented the initiative on 5 June 2026, as a project led by banks and operated by TCH [S04]. According to Quant, the choice followed a competitive process. Quant adds that US institutions clearing through TCH without tokenised deposits of their own will be able to use its Tokenised Deposits-as-a-Service offering [S03].
:::

::: analysis
The link to Redbelly is indirect. A large US bank network has picked Quant to sit between its members and their ledgers. Should Quant end up as common bank plumbing, chains its software already speaks to would sit closer to those banks. The community question grows out of that thought.

Two gaps in the announcement deserve attention. The press texts speak of "Quant's technology" without naming a product [S01, S02, S03]. We study Overledger because the task names it and because its public documentation is the part of Quant's stack that explains how chains are attached [S05]. And the announcement says nothing about Redbelly, or about public blockchains in general.
:::

::: unknown
None of the four announcements names the ledgers underneath the bank network or mentions links to public blockchains [S01, S02, S03, S04].
:::

## How Overledger works {#overledger}

A useful picture is an airport hub. Passengers check in once at the hub, and the hub routes each of them to the right airline. Overledger plays the hub for applications, and blockchains are the airlines.

::: confirmed
Quant describes Overledger as a multi-DLT platform with "one set of credentials, one API surface, one execution environment that connects to many DLT networks" [S05]. Its main parts are:

- **The Gateway**, the single entry point. It checks who is calling, sends each request to the right place and hosts higher-level workflows [S06].
- **Connectors**, one per blockchain family, which "abstract individual DLT RPC protocols behind a common interface" [S06]. Each one draws on a pool of nodes run by Quant and nodes added by customers [S06].
- **Flow Apps**, typed multi-step sessions for jobs such as signing, deploying a contract, a compliance check or a payment [S05]. Flow Apps that touch a chain mostly use a Prepare, Sign, Execute sequence [S12]. Outside parties may host Flow Apps and register them [S05, S12], although Quant states that every app it currently ships is internal [S12].
- **The Signer**. Customers either sign with their own keys or let Quant keep the keys, in a hot wallet on testnet or under contract in a KMS or HSM on mainnet. Private keys never pass through the Gateway [S09].
- **The Overledger Firewall**, which works at two levels: off-chain it decides which users may reach which networks, and on-chain its Fusion Firewall component decides which addresses may call contracts, send messages between chains or bridge particular tokens [S10].
- **Fusion Rollup**, an OP Stack based rollup that settles to several base chains at the same time and offers one EVM environment over all of them [S11].
- **Quant Connect**, the web portal for opening an account and creating API keys [S08].

The API can also watch a contract event on a given network and post the result to a callback URL [S14], and Flow Apps send signed webhooks [S12].
:::

@diagram(stack)

### The three doors into Overledger {#how-chains-connect}

::: confirmed
The Connectors chapter sets out two onboarding paths, and Fusion Rollup forms a third, separate route [S07, S11].

**Door 1, self-service.** The supported families are EVM, Solana, Cosmos, SUI, Hedera and Aptos, and the door is meant for open networks without membership rules [S07]. Quant names three tests a family must pass: "(a) its nodes expose RPC or REST over HTTPS, (b) the RPC requires no security factor beyond an API key, and (c) node identity does not matter to other tenants" [S07]. An account may attach a node to a network Overledger already knows, or bring a network it does not know yet, if the family qualifies. In Quant's words, "The first POST /nodes call registers both the network and your node for it. This new network will then be available for Overledger users" [S07].

Each node is either shared or kept to the account. A shared (public) node joins the common pool, must be hosted by an approved provider and must embed that provider's API key in its URL; ankr.com is one of the approved domains [S07, S13]. A private node may sit on any domain and serves only the account that added it [S07]. All nodes go through a health check when they are added [S07].

**Door 2, engagement.** Quant reserves this for networks "where node identity matters, typically permissioned DLTs used by regulated consortia and operator-gated public chains" [S07]. Quant lists Fabric, Corda, Canton, permissioned Besu and Quorum among them, and adds that a network offering RPC over HTTPS "and authenticates with a bearer or API-key factor, Quant can normally onboard it" [S07]. A completely new family needs a "DLT checker (health validation + chain identifer lookup)", which Quant puts at around two days of work plus about a day per app that must handle it [S07].

Some rules hold for every path. Administrative methods such as `personal_*`, `admin_*` and `txpool_*` are blocked at the Gateway on EVM [S07]. Every network is public, permissioned (open to users the owner grants) or private [S07]. To choose a node, the Gateway favours the caller's private nodes and then weighs latency, error rates and QNT staked on each node [S07]. The current network list is served by `GET /networks` [S07].

**Door 3, Fusion Rollup.** The rollup keeps its own list of base chains. At testnet launch these were Ethereum Sepolia, Polygon Amoy and Quant's own permissioned Besu testnet [S11]. Each base chain carries "Standard OP Stack contracts, one deployment per chain" [S11].
:::

@diagram(routes)

::: unknown
The pages we read describe which chains Fusion was launched with, but give no self-service procedure for adding another base chain [S11].
:::

## Redbelly's profile {#redbelly}

::: confirmed
- **Positioning.** Redbelly's documentation calls it "a layer 1 blockchain, built and optimised for real world asset tokenisation" [S15].
- **Execution.** Redbelly "can execute smart contracts written for the EVM", and its portal pins EVM version Prague and Solidity v0.8.30 [S23].
- **Access points.** Mainnet uses chain ID 151 and the RPC host `governors.mainnet.redbelly.network`; Testnet uses chain ID 153 [S21]. The portal also names two third-party Mainnet endpoints: Ankr at `rpc.ankr.com/redbelly_mainnet`, and Uniblock, which expects an API key in a header [S21].
- **Consensus.** DBFT has no leader, withstands faults while t < n/3, settles transactions deterministically "in a matter of seconds", and Redbelly states that the chain "cannot fork" [S22].
- **Fees.** Each unit of gas costs a fixed US dollar amount, converted at execution time by an on-chain oracle [S24].
- **Identity.** Every participant must prove who they are before getting access [S25]. A user shows a passport, verified by biometrics, to an accredited issuer and then turns on write access "through a specific network smart contract" [S26]. The accredited issuers sit in an on-chain registry [S27]. Redbelly's access app names Averer as the issuer; one verified person can link several accounts, and Testnet access is offered once verification is done [S30]. A community builder reports that Mainnet and Testnet approvals are granted separately [S46].
- **Organisations.** A business proves incorporation to an accredited issuer [S29], after at least one officeholder has onboarded as an individual [S27].
- **Consensus nodes.** Running one requires two accounts with network access and acceptance into the operator programme, which is not taking applications at the moment [S31].
:::

### Bridges Redbelly already uses {#existing-routes}

::: confirmed
- **LayerZero.** LayerZero V2 lists a Redbelly Mainnet deployment [S38], and Redbelly's portal lists tokens that move over LayerZero via Stargate, among them RBNT, USD₮0, AUDF and WETH [S33].
- **Lucid Labs**, built on Polymer and LayerZero [S34], is the tool Redbelly's portal recommends for bringing RBNT back to Redbelly from elsewhere [S32].
- **Celer cBridge** uses a pegged model between Ethereum, BNB Chain and Redbelly [S36]. Celer's post shows USDT, USDC, WBTC and ETH flowing into Redbelly and RBNT flowing out [S36]. According to Redbelly's portal, Celer moves RBNT one way only: it "bridges out from Redbelly to Ethereum and BNB Chain, not back" [S35].
- **Wrapped RBNT on Ethereum.** Redbelly published `0xb45ffb51984d626ee758b336c61cf20990c6bf13` as the official Wrapped RBNT contract on Ethereum [S37], and its portal lists that address in the Lucid Labs table [S34]. Celer's Ethereum token for wrapped RBNT is a separate contract, `0x063a1D5BFEAb213c9c12f47b704fccf81D60983e` [S35].
- **DAO work.** The selected TASK-08 entry built a testnet bridge that locks ETH on Sepolia and mints on Redbelly Testnet, secured by two of three relayers [S44], with a working demo [S45]. The selected TASK-16 entry is a recovery guide for RBNT stuck between chains [S47].
:::

::: analysis
Two observations shape the rest of this study.

The first is technical familiarity. Redbelly speaks EVM, the family with the widest self-service support on Overledger, and several unrelated bridge providers already run on it. That proves outside infrastructure can work with Redbelly's EVM. It proves nothing about Overledger in particular.

The second is Redbelly's access model. Anyone can read the chain, but only verified identities can write. Overledger's documentation divides networks into open ones that use self-service and gated ones that go through engagement [S07]. Redbelly falls between the two, and Overledger's glossary happens to name its exact model, "public permissioned", defined as "anyone can read but only allowlisted parties can write" [S06]. How Quant files Redbelly is the first question any attempt would hit.

One more detail stands out. Ethereum already hosts at least two different wrapped RBNT tokens issued by different bridges [S34, S35]. Fusion's "Unify" feature was designed to "merge multiple chain-specific representations of the same underlying asset into a single rollup balance" [S11]. In principle that fits Redbelly's situation, but adding tokens to Fusion needs sign-off from Quant's governance [S10].
:::

## Field tests without an account {#live-checks}

Documentation can drift from reality, so we tested whatever could be tested without credentials. Every call only reads, except one transaction that is meant to fail. The code is in `scripts/probe.mjs`, the raw output in `evidence/live-checks.json`, and `npm run probe` repeats the whole run.

::: live
| What we sent, 25 October 2026 | What came back | Why it is relevant |
|---|---|---|
| `eth_chainId` to Redbelly Mainnet, Testnet and the Ankr endpoint | 151, 153 and 151 [S49] | Plain EVM JSON-RPC over HTTPS works on all three, which is self-service test (a). |
| A call to Ankr without any API key | Normal answer [S49] | Ankr is an approved provider [S07] that serves Redbelly Mainnet [S21]. A shared node also needs a key in its URL; we did not test a keyed URL. |
| `net_version` to Mainnet | Rejected as unavailable, code -32601 [S49] | Quant's docs keep this method "for wallets and tools that predate eth_chainId" [S11]. They do not reveal what the EVM health check calls. |
| `eth_syncing`, `eth_gasPrice`, `eth_feeHistory`, `eth_maxPriorityFeePerGas` | All returned values [S49] | Ordinary status and fee queries behave normally. |
| Block tag `finalized` | Equal to the newest block [S49] | Fits deterministic finality [S22]. |
| Block tag `safe` | {{SAFE_LAG}} blocks older than `finalized` [S49] | Odd. Anything waiting on `safe` sees stale data. No documentation explains it. |
| A zero-value transaction signed by a fresh, unverified key | Rejected on both networks: "Sender not authorised to write transactions" [S49] | The identity gate is enforced at the RPC, as a community builder also reported [S46]. |
| Gas estimate for that same key | Returned an estimate [S49] | A workflow could get through "prepare" and only fail at "execute". |
| Code at Permit2's usual address | None [S49] | Overledger's x402 payment gates depend on Permit2 on EVM [S12]. |
| Code at the Multicall3 and CREATE2 deployer addresses | Present [S49] | Tools that expect these helpers at their usual addresses will find them. |
| Overledger `GET /health` | HTTP 200, no login needed [S49] | The gateway named in the docs is up. |
| Overledger `GET /networks` and `/networks/fusion` | HTTP 401 without login [S49] | The list is closed to the public; we read it with an account in the next section. |
:::

## Tests with an Overledger account {#account-checks}

Some questions can only be answered by someone holding the right access. We split them into three stages inside one script, `npm run probe:account`.

::: confirmed
- **The network list sits behind a login.** It comes from `GET /networks` [S07], which returns HTTP 401 to anonymous callers [S49]. Accounts and API keys are issued through Quant Connect [S08].
- **Adding a node may publish a network.** When a network is new to Overledger, "the first POST /nodes call registers both the network and your node for it" and the network "will then be available for Overledger users" [S07]. The API reference for `POST /nodes` covers the node URL, network, name and family, and sets out the rules for shared nodes [S13]; the choice between shared and private is described for the Quant Connect form [S07].
- **A real Redbelly transaction needs a verified signer**, meaning a passport and biometric check with the accredited issuer Averer before write access is switched on [S26, S30].
:::

::: analysis
Because of the second point, we chose not to register Redbelly as a shared network: other Overledger users would see the entry, and it could be taken for a listing. The script respects that line. Stage 1 only reads. Stage 2 works on Redbelly Testnet, prefers a node set to private in Quant Connect, and removes the node when finished. Stage 3 sends a single zero-value transfer from the operator's own verified Testnet address. No API key or private key is ever written to disk.
:::

@include(account-checks)

::: confirmed
- **Size and mix.** The account could see 59 networks: 54 EVM, plus one each of Solana, SUI, Aptos, Hedera and Canton [S50]. Five of the six self-service families from the documentation are represented; there was no Cosmos network [S07, S50].
- **Almost all test networks.** Other than Quant's permissioned Canton network, every entry is a test network, for example Ethereum Sepolia, Base Sepolia and Avalanche Fuji, and the gateway the documentation names is itself a testnet environment [S50].
- **Redbelly absent.** A search of every field in every entry for "redbelly", "rbnt", Redbelly's RPC host and chain IDs 151, 152 and 153 returned nothing [S50].
- **Fusion today.** The rollup reports three connected networks: Quant Private Network (chain 7695), Ethereum Sepolia and Amoy [S50], three base chains as in the documentation [S11].
- **Live field names.** Entries use `displayName` and `dltType`, while the documented model calls these fields `name` and `type` [S07, S50].
:::

::: analysis
The EVM networks Overledger already serves on testnet are a varied group, from rollups like zkSync, Scroll and Linea to standalone chains like Avalanche, Sei and Monad [S50]. That variety makes it more likely, though not certain, that an EVM chain with Redbelly's quirks would pass the checker. The list covers testnet only and tells us nothing about Overledger's mainnet. A stage 2 run would settle the health check question; we held back because registering a new network on the shared gateway can create an entry that others see [S07].
:::

## Door by door: can Redbelly get in today? {#connect-now}

Below, each Overledger route is held up against Redbelly's documentation and our test results.

### Door 1: the self-service tests {#self-serve-tests}

| Overledger's condition [S07] | Evidence from Redbelly | Our call |
|---|---|---|
| (a) HTTPS RPC | Mainnet and Testnet publish HTTPS endpoints [S21] that answered our calls [S49] | [[ok:Satisfied]] |
| (b) Nothing beyond an API key at the RPC | Reads need no key on the governor or Ankr endpoints [S49]; the write gate checks the signer of a transaction, not the connection [S25, S49] | [[part:Satisfied at the RPC; signers gated]] |
| (c) Nodes interchangeable for tenants | Every endpoint returns the same chain state, since the gate is on the signer [S25, S49] | [[part:Looks satisfied; Quant decides]] |
| Network is open and permissionless | Reads open, writes gated, a model Overledger itself calls "public permissioned" [S06], while its engagement path names "operator-gated public chains" [S07] | [[unk:Quant decides]] |

::: analysis
Measured against the written tests alone, Redbelly appears to qualify. The sticking point is labelling. Self-service is presented as the path for open, permissionless networks [S07], and Redbelly's write gate is the sort of feature that could steer Quant toward the engagement path instead. Only Quant can make that call; the Redbelly community cannot.
:::

### Door 1: attaching a node {#self-serve-node}

::: confirmed
- Self-service accepts networks Overledger has not listed yet, as long as the family is supported, and EVM is [S07].
- A shared node must be hosted on an approved domain with an API key in its path; ankr.com qualifies [S07, S13], and Redbelly's portal publishes an Ankr Mainnet endpoint [S21].
- A private node may live on any HTTPS domain and serves only the account that added it [S07].
:::

::: analysis
Two ways in appear possible on paper.

- **Private node.** An account adds Redbelly's own RPC address as a private node, visible to that account alone. This is the easiest option and would give that account rung 1 (observe), and rung 2 (relay) for transactions already signed by a verified Redbelly user.
- **Shared node.** An account adds a keyed Ankr address for Redbelly as a shared node. If Overledger accepted it, the same call would create the Redbelly network entry for every Overledger user [S07].

In both cases the write gate stays with Redbelly. Overledger would only deliver the transaction; Redbelly would still decide whether the signer may write.
:::

::: unknown
- Whether Overledger's EVM health check accepts Redbelly. Quant describes it only as "health validation + chain identifer lookup" [S07], and Redbelly has no `net_version` and a lagging `safe` tag [S49]. Either detail might matter, or neither.
- Whether a keyed Ankr URL for Redbelly exists in the format Overledger requires. The keyless endpoint works [S49]; the keyed one was not tested.
- Whether Quant would allow a write-gated network to be created through self-service in the first place.
:::

### Door 2: an engagement with Quant {#engagement}

::: confirmed
Quant uses engagements for gated, consortium and permissioned networks, and expects to onboard most networks that expose HTTPS RPC protected by a bearer token or API key [S07].
:::

::: analysis
Redbelly's public RPC meets the transport side of that description [S21, S49]. Engagement is how Redbelly would become a fully supported network, with Quant-operated nodes, firewall rules and support from Quant. There is a practical snag: Overledger node pools include nodes Quant runs itself [S06], yet becoming a Redbelly consensus node requires selection into the operator programme and network access, and the programme is closed to applications [S31]. Quant would more likely rely on third-party RPC providers, or on a non-consensus node if Redbelly offers one, which we could not establish. An engagement only happens if Quant chooses it, and no public source shows that any such work exists or is planned.
:::

### Door 3: Fusion Rollup {#fusion}

::: confirmed
Fusion launched on testnet with Ethereum Sepolia, Polygon Amoy and Quant's own permissioned Besu testnet [S11]. Each base chain hosts the standard OP Stack bridge and dispute contracts [S11], and Fusion Firewall rules are mirrored onto every base chain [S06]. Users sign their own deposits and withdrawals [S11].
:::

::: analysis
For Redbelly to become a Fusion base chain, the OP Stack contracts would have to be deployed on Redbelly and Redbelly would have to be wired into deposits, messages and withdrawals. The deployer and every depositing or withdrawing address would need write access on Redbelly [S25]. Fusion counts a deposit as final once the base chain block containing it has finalized [S11]. Redbelly's `finalized` tag returns the newest block, which suits that model, but its `safe` tag lags [S49], so the way Fusion's software reads Redbelly's block tags would need testing. This is a Quant-led project in which Redbelly participants would take part, not a switch the community can flip.
:::

::: unknown
We found nothing public on what it takes, costs or how long it lasts to make a chain a Fusion base chain.
:::

### Where that leaves Redbelly {#verdict}

::: analysis
**No connection exists today.** Rungs 1 and 2 look achievable on paper through self-service, most simply with a private node. Nobody has tried it, and two things could stop it: Overledger's health check and Quant's classification of a write-gated network. Rungs 3 and 4, meaning Quant custody, Flow Apps and Fusion Rollup, stay out of reach unless Quant decides to support Redbelly.
:::

## The build list {#the-work}

Here is the work in the order an engineering team would face it, described for non-engineers. The owners listed are our reading of the roles in the documentation, not anyone's actual plan.

| Task | Why it is needed | Likely owner | Blocking question |
|---|---|---|---|
| 1. Choose a door | Private self-service node, shared self-service node, engagement or Fusion each have different reach [S07, S11] | Whoever holds the Overledger account; Quant for engagement or Fusion | Will Quant accept a write-gated chain on self-service |
| 2. Point at a node | Overledger needs a Redbelly RPC address; a shared listing needs an approved provider and a keyed URL [S07] | The account holder, with a provider such as Ankr [S21] | Does a keyed Ankr URL work |
| 3. Clear the health check | Overledger validates the node and the chain identity before accepting it [S07] | Quant's software | Does the checker depend on `net_version` or the `safe` tag [S49] |
| 4. Verify the signers | Each address that signs on Redbelly needs an access credential [S25]; companies go through business verification [S29] | The institution, an accredited issuer, and Quant for Quant-held keys [S09] | In whose name would a Quant-held key be verified |
| 5. Prove it on Testnet | Exercise reads, signed writes, refusals of unverified signers, fees and event trackers on chain 153 [S21, S14] | Quant engineers, with Redbelly developers testing alongside | Requires an Overledger account and verified test signers |
| 6. Decide what moves | Either keep assets on Redbelly and send instructions, or mirror them onto other chains [S11] | Issuers, and Quant if Fusion is used | The compliance design described below |
| 7. Line up the rules | Match Overledger's allowlists [S10] to Receptor eligibility [S28], including what happens when eligibility ends | Issuers, Quant and Redbelly | Legal and product choices |
| 8. Settle the terms | Commercial, legal and support agreements between the operators | Whoever runs the link | Not public |

::: analysis
**Tasks 1 to 5 are enough for rungs 1 and 2.** Since Redbelly is already EVM, it should not need the new-family work Quant estimates at roughly two days plus a day per app [S07], unless gaps such as the missing `net_version` force a Redbelly-specific checker.

**Task 4 is unique to Redbelly.** Every signing address on Redbelly is an identity decision as much as a technical one: an unverified key is turned away no matter what it signs [S25, S49]. Overledger API keys identify the caller but cannot sign anything, and each transaction still needs the caller's own key [S08], so the identity question follows the signing key wherever it is kept.

**Tasks 6 and 7 carry the heaviest load,** because they determine whether a Redbelly asset keeps its safeguards once another chain is involved.
:::

### Small gaps an engineer would check first {#gaps}

::: analysis
None of these would stop a project on its own, but each needs an answer.

- **No `net_version`** [S49]. Quant keeps it for older wallets and tools [S11]; any checker or Flow App that calls it would have to switch to `eth_chainId`.
- **A lagging `safe` tag** [S49]. Software waiting on `safe` would treat Redbelly as slower than it really is.
- **No Permit2** at its standard address [S49]. Paid Flow App actions rely on Permit2 for x402 on EVM [S12], so a verified account would have to deploy it first. The CREATE2 deployer that normally places it is already there [S49].
- **Gas estimates do not check identity** [S49]. A workflow should confirm write access before preparing a transaction rather than discovering the problem at submission.
- **Dollar-pegged fees** through an on-chain oracle [S24]. Fee logic built around a market auction would need retesting.
:::

## What institutions would gain {#offer}

::: analysis
**Gains for institutions already on Overledger**

- **Fewer integrations.** Redbelly would be reached with the same login and API they use for other networks [S05], not a separate integration project.
- **Linked workflows.** Flow Apps and event trackers [S12, S14] could make an action on another network depend on an event on Redbelly, for instance releasing a payment once a tokenised fund unit has been transferred. Quant would first have to support Redbelly in those tools.
- **Custody flexibility.** Keys can stay in-house or sit with Quant in a KMS or HSM [S09], matching different custody policies, provided each signing address has Redbelly write access [S25].

**Gains for institutions already on Redbelly**

- **A possible path to bank networks built on Quant**, should those networks ever open to outside chains. Today nobody knows whether they will [S01, S03].
- **Their current advantages remain.** Verified counterparties [S25], deterministic finality [S22] and dollar-denominated fees [S24] are why an issuer might pick Redbelly in the first place, and a link would leave them untouched.
- **A ready interface.** Tokeniser already exposes an API and MCP for connecting to existing systems [S39], the kind of surface an Overledger workflow or an AI agent could use.

**Limits and costs**

- **Compliance stays behind.** Overledger's Firewall governs who may act inside Overledger [S10]; Redbelly's controls decide ownership and transfer rights on Redbelly itself [S28, S39]. They are separate and currently unconnected.
- **No ticket to TCH's network.** Membership and ledger choices there belong to TCH [S01, S04].
- **Another dependency.** Institutions would add an outside provider to their stack, on terms nobody has published for this case.
:::

## Compliance across chains {#compliance}

This part looks at how Redbelly's compliance tools operate now, and at the points where they could stop protecting an asset, or a claim on it, after it leaves Redbelly.

::: confirmed
- **Receptor credentials** follow the W3C verifiable credential model and come with Issuer, Holder and Verifier modules [S16]. Issuers that grant network access must be accredited [S16].
- **Issuer identifiers name the network.** Averer's identifiers include it, for example `did:receptor:redbelly:mainnet:...` on Mainnet [S19].
- **Proof by Query** has a verifier smart contract check a zero-knowledge proof, so the verifier never sees or keeps personal data [S17]. The Eligibility SDK builds on Privado ID and the Iden3 zero-knowledge tools [S19].
- **Selective Disclosure** is built on BBS+ signatures, and Redbelly says this method "can only be used off-chain" [S18].
- **What queries can do today.** On-chain checks handle one query at a time, with multiple queries per check listed as coming later. Supported credentials include AML/CTF and Australian sophisticated or wholesale investor status. Verifiers are told to leave revocation checks on in production [S20].
- **Gated contract functions.** Developers can limit smart contract functions to users who prove they meet set criteria, and they choose which issuers they trust [S28].
- **Tokeniser** operates on Redbelly and "programs eligibility into every asset at the protocol level: identity, KYC, AML, CTF, wholesale and sophisticated investor tests, and TMD". It verifies every holder and checks every transfer [S39]. Its rules are "enforced at the point of transfer, every time" [S40]; failing trades are stopped and each check is logged [S41]. In secondary transfers "ownership and payment are exchanged in a single step" [S42], and units pledged as collateral stay locked until the loan is repaid [S43].
- **On Overledger's side**, the Fusion Firewall works on addresses: Overledger keeps a record off-chain of which addresses belong to which user [S10] and copies the firewall rules to every base chain [S06].
:::

@diagram(journey)

::: analysis
Every one of those protections lives **on Redbelly**. A contract verifies the Receptor proof and Tokeniser applies the asset's rules when it moves [S17, S40]. A different chain or a rollup cannot see those checks and applies whatever rules it has. A link must therefore either recreate equivalent checks on the far side or keep the asset at home where the checks already run.

| Situation | Protection on Redbelly today | After the asset leaves | Risk |
|---|---|---|---|
| Who owns it | Each holder is verified [S39] | The far chain sets the rules | A plain wrapped token can end up with anyone |
| Passing it on | Each transfer is checked [S40] | Trades of the wrapped copy happen where Redbelly cannot see them | Resale bypasses eligibility |
| Proving eligibility | A verifier contract checks the zero-knowledge proof [S17] | Contracts elsewhere only learn the result if someone relays it | A relayed status is wrong or out of date |
| Losing eligibility | Revocation is enforced when checks stay on [S20] | Every copy of the status elsewhere must change too | Someone no longer eligible keeps an allowlist entry |
| Sharing personal data | Selective Disclosure happens off-chain only [S18] | No on-chain proof exists to move | A contract cannot repeat a disclosure-based check |
| Control of the key | Each account maps to one verified person [S25, S30] | The asset may sit with a custodian, in an omnibus wallet or behind a Quant key [S09] | The identity behind an address becomes unclear |
| Settlement | Asset and payment move in one step [S42] | Payment may settle on another network | One side settles and the other does not |
| Collateral | Pledged units stay locked until repayment [S43] | A copy on another chain might be pledged again | The same asset backs two loans |
| Bridge plumbing | Not needed | Locking, minting, custody and relayers enter the picture | "Lock-and-mint mismatches, custodian compromise, oracle failure" [S11] |
| Several versions | One native asset | Each bridge issues its own wrapped token [S34, S35] | Rules enforced on one version but not another |
| The trip home | Moving anything on Redbelly needs write access [S25], and Tokeniser assets only go to eligible holders [S39] | The receiving address must be verified to move the asset, and eligible for a Tokeniser asset | Assets arrive somewhere they cannot leave, a problem the DAO recovery guide already covers for RBNT [S47] |
:::

### Patterns that keep the rules intact {#designs}

::: analysis
Five patterns follow from the evidence. We offer them for discussion only; we are not recommending any of them to anyone and know of none under consideration.

- **A. Instructions travel, the asset stays.** Overledger runs the workflow, but the asset itself stays put on Redbelly, where Tokeniser and Receptor keep checking each transfer [S39, S17]. The payment side could settle on another network. This carries the least compliance risk but needs care so that either both sides complete or neither does.
- **B. Eligibility as a workflow step.** Quant cites a "compliance check" as an example of a Flow App step [S05] and accepts Flow Apps hosted by outside parties [S12]. A workflow could call a Receptor eligibility check before it acts, leaving the check where it was designed to run. Someone would still have to build and operate that app.
- **C. A mirrored allowlist.** The asset is represented elsewhere, and its contract only allows transfers between addresses on a list that copies Redbelly eligibility. Such a list could live in Overledger's address controls [S10], provided something reliable updates it the moment a holder stops qualifying.
- **D. Prove it again over there.** The holder repeats the eligibility proof on the destination chain using the same credential. Receptor's tools build on Iden3 and Privado ID [S19], yet its documentation only describes verification on Redbelly.
- **E. One balance through Fusion.** Fusion can merge versions of the same asset from different chains into one rollup balance [S11], and its firewall controls which tokens may be deposited [S10]. On its own this would not enforce Tokeniser's investor rules.
:::

::: unknown
- Whether Receptor verifier contracts, or trust in Redbelly's accredited issuers, could be used on another chain.
- What Tokeniser would do if one of its assets were mirrored elsewhere. Everything it publishes describes checks on Redbelly [S39, S40].
- Whether Receptor eligibility could feed Overledger's allowlists automatically. Overledger describes lists kept by Overledger and by contract deployers [S10], not by external credential systems.
:::

## Hard stops and open questions {#unknowns}

::: confirmed
**Hard stops as of the cut-off date:**

- Redbelly cannot be used as an Overledger network today. The Overledger documentation we read never mentions it [S05, S06, S07, S11], and the live list we read with an account does not contain it [S50].
- Redbelly cannot be attached to Fusion Rollup. It is not a connected network and no self-service route is documented [S11].
- No route, Overledger included, lets an unverified address write to Redbelly [S25, S49].
- Overledger's Permit2-based payment gates cannot run on Redbelly until Permit2 is deployed there [S12, S49].
:::

::: unknown
**Open questions:**

- Which door Quant would assign to Redbelly, self-service or engagement [S06, S07].
- Whether Overledger's EVM health check would accept a Redbelly node [S07, S49].
- Whether Overledger's mainnet environment, or another account, would see a different network list [S07, S50].
- Whether Quant-held keys could gain Redbelly write access, and in whose name [S09, S25].
- Whether the bank network TCH is building will ever reach a public blockchain [S01].
- Whether Receptor verification can work on other chains.
- What an engagement would cost, how long it would take and on what commercial terms.
- What Redbelly's official view on bridging is; none has been published [S48].
:::

## What would change the answer {#signals}

::: analysis
Any of the following public events would turn an unknown into a confirmed fact. They are indicators to watch, not forecasts:

- Redbelly showing up in Overledger's documentation or its `GET /networks` list [S07].
- A published Overledger test against Redbelly Testnet, chain ID 153 [S21].
- An official Redbelly statement on bridging [S48].
- TCH naming the ledgers behind the On-Chain Money network [S01].
- Receptor documentation that covers verification on chains other than Redbelly [S16, S17].
- Quant documenting how a new base chain joins Fusion Rollup [S11].
:::

## How this study was done {#method}

- **Evidence base.** Quant's Overledger guides and endpoint reference; announcements from TCH and Quant; Redbelly's technical docs, the Vine developer portal and the access app; Tokeniser's site; documentation from Celer and LayerZero; Redbelly's Wrapped RBNT announcement; and DAO community deliverables. The [source list](#sources) shows what each source supports.
- **Claim checking.** For each source we stored the exact wording our claims rely on, {{QUOTE_COUNT}} phrases in all. `npm run verify:sources` loads each link again and searches the page for every stored phrase. On {{SOURCE_CHECK_DATE}} all {{SOURCE_COUNT}} external links opened and every phrase was found.
- **Text checking.** `npm run lint` makes sure every confirmed statement carries a citation, every citation resolves, and the text contains no partnership wording, no price talk, no personal credit, no dashes and no emoji.
- **Tests without credentials.** `npm run probe` repeats the {{PROBE_COUNT}} checks from [Field tests without an account](#live-checks). It needs no credentials and cannot move funds.
- **Tests that need access.** `npm run probe:account` reads Overledger's network list, can relay calls to a Redbelly Testnet node, and can complete a Redbelly transaction. Stage 1, the read-only list check, was run with an Overledger account on 25 October 2026; see [Tests with an Overledger account](#account-checks). Stages 2 and 3 were not run, so anything said about Overledger's behaviour with a Redbelly node remains analysis.
- **Vendor claims.** Statements by Quant, Redbelly, Tokeniser and bridge operators are reported as their own; anything beyond them is labelled analysis.
- **No position taken.** This study does not argue for or against a link, and it contains no price discussion or investment advice.

## Glossary {#glossary}

| Term | In this report it means |
|---|---|
| Overledger | Quant's multi-DLT platform, giving applications one API across many ledgers [S05] |
| Gateway | The entry point of Overledger that authenticates and routes every request [S06] |
| Connector | The component that speaks a given blockchain family's own protocol [S06] |
| Self-service | Attaching a node, or a new network, through `POST /nodes` without Quant's team [S07] |
| Engagement | A project with Quant's team to bring a gated or new network on board [S07] |
| Flow App | A typed, multi-step workflow driven through the Gateway [S12] |
| Fusion Rollup | Quant's OP Stack rollup that settles to several base chains together [S11] |
| EVM | The Ethereum Virtual Machine, the contract runtime Redbelly implements [S23] |
| RPC endpoint | The URL that programs call to query a blockchain node or submit transactions to it |
| Public permissioned | Overledger's label for networks with open reads and allowlisted writes [S06] |
| Receptor | Redbelly's identity and credential protocol [S16] |
| Verifiable credential | A digitally signed claim about someone, kept by that person [S16] |
| Accredited issuer | An issuer Redbelly authorises to grant network access [S27] |
| Zero-knowledge proof | Cryptographic evidence that a condition holds, such as being eligible, that hides the underlying data [S17] |
| Lock-and-mint | Locking an asset on its home chain while an equivalent token is created on another [S44] |
| Tokenised deposit | A commercial bank deposit recorded on a ledger, the focus of TCH's initiative [S01] |
| KMS or HSM | Managed key services or dedicated hardware that safeguard signing keys [S09] |
| TMD | Target market determination, among the rules Tokeniser applies when an asset is transferred [S40] |
