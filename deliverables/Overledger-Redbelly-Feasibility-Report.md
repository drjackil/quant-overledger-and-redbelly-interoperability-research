# Could Redbelly connect to Quant's Overledger?

*A feasibility study of what a connection would take, what it could offer institutions, and where compliance could break.*

Feasibility research for the Redbelly DAO Community Task Board, TASK-29. Research cut-off 25 October 2026. Version 1.0.

## 1. Read this first

This is feasibility research. It answers three questions with public sources: could Redbelly Network connect to Quant's Overledger, what would that take, and what could it offer institutions that use Redbelly.

> **Notice**
>
> **No partnership, talks or plans.** Redbelly and Quant have no announced partnership or talks, and nothing in this report suggests otherwise [S48](https://taskboard.redbellydao.network/tasks/TASK-29). Redbelly has not published an official position on bridging [S48](https://taskboard.redbellydao.network/tasks/TASK-29), so anything that is not in a public source is treated here as unknown.

Every finding sits in one of three labelled panels, so you can always tell what kind of statement you are reading:

- **Confirmed.** Stated in a public source, with the source linked next to the claim. Some confirmed items come from live checks we ran ourselves on 25 October 2026. Those are marked "live check" and link to the raw results, which anyone can reproduce.
- **Analysis.** Our reasoning, built only on confirmed facts. It is not a statement by Redbelly, Quant, Tokeniser or anyone else.
- **Unknown.** Not answered by any public source we could find. We name these gaps so nobody fills them with guesses.

Research cut-off: 25 October 2026. Overledger's documentation says the number of networks it reaches is growing and that the live list comes from its API [S07](https://docs.overledger.dev/docs/connectors), so parts of this picture can change quickly. The section [What would change the answer](#signals) lists what to watch. This report contains no price discussion and no investment advice.

## 2. The answer on one page

> **Confirmed**
>
> - Overledger reaches blockchains through Connectors. Public, permissionless networks in six families, EVM among them, can be added self-serve with a single API call. Permissioned, consortium and operator-gated networks go through a managed engagement with Quant's team [S07](https://docs.overledger.dev/docs/connectors).
> - Redbelly is EVM compatible (EVM version Prague, Solidity v0.8.30) [S23](https://vine.redbelly.network/consensus/evm-compatibility/). Mainnet is chain ID 151 and Testnet is chain ID 153, each with a public RPC address [S21](https://vine.redbelly.network/environments/).
> - Anyone can read Redbelly, but only identity-verified accounts can write. Users claim an access credential from an accredited issuer before they can enable write access [S25](https://vine.redbelly.network/identity/). In our live check, a transaction signed by a new, unverified key was refused on both Mainnet and Testnet with "Sender not authorised to write transactions" [S49](evidence/live-checks.json).
> - Redbelly is not named in any of the Overledger documentation pages reviewed for this report [S05](https://docs.overledger.dev/docs/start-here) [S06](https://docs.overledger.dev/docs/overview) [S07](https://docs.overledger.dev/docs/connectors) [S11](https://docs.overledger.dev/docs/fusion-rollup), and it is not one of the networks Fusion Rollup connected at testnet launch [S11](https://docs.overledger.dev/docs/fusion-rollup). Overledger's live network list needs an account to read [S49](evidence/live-checks.json).

> **Analysis**
>
> **Redbelly is not connected to Overledger today, as far as public sources show.** A thin link, where an Overledger account registers a Redbelly RPC endpoint and passes already-signed transactions through, looks possible on paper. Redbelly speaks the EVM family's language [S23](https://vine.redbelly.network/consensus/evm-compatibility/), a Redbelly endpoint is already offered by a provider on Overledger's approved list [S07](https://docs.overledger.dev/docs/connectors) [S21](https://vine.redbelly.network/environments/), and Overledger lets accounts add new EVM networks [S07](https://docs.overledger.dev/docs/connectors). It is untested, and it depends on one decision only Quant can make: whether a chain where anyone can read but only verified accounts can write belongs on the self-serve route, or needs an engagement. Overledger's own glossary calls that model "public permissioned" [S06](https://docs.overledger.dev/docs/overview).
>
> Anything deeper, such as Quant-held signing, Flow App workflows, or moving assets through Fusion Rollup, is **not possible yet** unless Quant chooses to support Redbelly. And Redbelly's compliance controls would **not follow an asset to another chain by default**. A connection would have to be designed to carry them.

### Scorecard

We split "connect" into four levels, because each one needs different work and different people.

| Level | What it means in plain words | Status on 25 October 2026 | What it depends on |
|---|---|---|---|
| 1. Read | Overledger can fetch Redbelly data (balances, blocks, contract state) | **Possible on paper, untested** | An account registering a Redbelly node, and Overledger's health check accepting it [S07](https://docs.overledger.dev/docs/connectors) [S49](evidence/live-checks.json) |
| 2. Pass-through | Overledger carries a transaction that a verified Redbelly account has already signed | **Possible on paper, untested** | Level 1, plus every sending address holding Redbelly write access [S25](https://vine.redbelly.network/identity/) [S49](evidence/live-checks.json) |
| 3. Orchestrate | Overledger tools act on Redbelly: Flow Apps, Quant-held signing, event trackers | **Not possible yet** | Quant adding Redbelly to those tools, and verified signing addresses [S09](https://docs.overledger.dev/docs/signing) [S12](https://docs.overledger.dev/docs/flow-apps) |
| 4. Move | Assets or messages travel between Redbelly and other chains through Overledger | **Not possible yet** | A Quant-led project to wire Redbelly into Fusion Rollup or a bridge flow [S11](https://docs.overledger.dev/docs/fusion-rollup) |
| Shared listing | Redbelly appears in Overledger's network list for every user | **Unknown** | The list is only visible with an account [S49](evidence/live-checks.json) |
| Bank network reach | Banks on TCH's On-Chain Money network reach Redbelly assets | **Unknown** | TCH and its banks; no ledger or public chain link has been announced [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative) [S03](https://quant.network/news/quant-powers-the-clearing-houses-on-chain-money-initiative-in-the-us/) |
| Compliance carried across | Receptor and Tokeniser rules still apply after an asset leaves Redbelly | **Not by default** | How a connection is designed (see [Credentials and assets across chains](#compliance)) |

![Figure 1. Four levels of connection, and who would have to act at each one.](figures/levels.png)

*Figure 1. Four levels of connection, and who would have to act at each one.*

## 3. Why the question is being asked now

> **Confirmed**
>
> On 24 September 2026 The Clearing House (TCH) announced that it had selected Quant to power its On-Chain Money Initiative, "a new interoperable payments network that will enable financial institutions of all sizes to clear and settle tokenized deposit transactions" [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative). Quant's technology "will enable the network's interoperability, orchestration, and transaction-management layer", with connectivity to fiat systems including the RTP and CHIPS networks [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative) [S02](https://quant.network/press-releases/the-clearing-house-partners-with-quant-to-advance-the-on-chain-money-initiative/). TCH expects the network to become available to participating institutions in the first half of 2027 [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative).
>
> The initiative was first unveiled on 5 June 2026 as a bank-led effort that TCH will operate [S04](https://www.theclearinghouse.org/payment-systems/Articles/2026/06/Major-Financial-Institutions-Unveil-Bank-Led-On-Chain-Money-Initiative). Quant says the selection followed a competitive process, and that it will also offer a shared Tokenised Deposits-as-a-Service platform to US institutions that process through TCH but do not yet have tokenised deposit capability [S03](https://quant.network/news/quant-powers-the-clearing-houses-on-chain-money-initiative-in-the-us/).

> **Analysis**
>
> For Redbelly, the announcement matters indirectly. A major US bank network has chosen Quant as its interoperability layer. If Quant's software becomes common plumbing for banks, chains that Quant can reach may become easier for those banks to reach. That is why the community is asking.
>
> Two things the announcement does not say are worth stating plainly. First, the announcement text refers to "Quant's technology" and does not name a specific Quant product [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative) [S02](https://quant.network/press-releases/the-clearing-house-partners-with-quant-to-advance-the-on-chain-money-initiative/) [S03](https://quant.network/news/quant-powers-the-clearing-houses-on-chain-money-initiative-in-the-us/). This report treats Overledger as the relevant platform because the task asks about it and because it is the Quant platform whose public documentation covers connecting chains [S05](https://docs.overledger.dev/docs/start-here). Second, nothing in the announcements says the network will connect to Redbelly or to any public chain.

> **Unknown**
>
> Which ledgers the On-Chain Money network will run on, and whether it will connect to public blockchains at all, is not stated in the announcements we reviewed [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative) [S02](https://quant.network/press-releases/the-clearing-house-partners-with-quant-to-advance-the-on-chain-money-initiative/) [S03](https://quant.network/news/quant-powers-the-clearing-houses-on-chain-money-initiative-in-the-us/) [S04](https://www.theclearinghouse.org/payment-systems/Articles/2026/06/Major-Financial-Institutions-Unveil-Bank-Led-On-Chain-Money-Initiative).

## 4. Overledger in plain words

Think of Overledger as a switchboard. An institution plugs into it once, and the switchboard forwards each call to the right blockchain in that blockchain's own language.

> **Confirmed**
>
> Overledger is Quant's multi-DLT platform for building applications that span more than one blockchain, with "one set of credentials, one API surface, one execution environment that connects to many DLT networks" [S05](https://docs.overledger.dev/docs/start-here). Its documentation describes these building blocks:
>
> - **Gateway.** The front door. It authenticates callers, routes requests and runs higher-level workflows [S06](https://docs.overledger.dev/docs/overview).
> - **Connectors.** Adapters that "abstract individual DLT RPC protocols behind a common interface" [S06](https://docs.overledger.dev/docs/overview). Each blockchain family has a pool of nodes, made up of Quant-operated nodes plus nodes that customers register [S06](https://docs.overledger.dev/docs/overview).
> - **Flow Apps.** Multi-step workflows such as signing, contract deployment, a compliance check or a payment, run as typed sessions [S05](https://docs.overledger.dev/docs/start-here). Most Flow Apps that touch a chain follow a Prepare, Sign, Execute pattern [S12](https://docs.overledger.dev/docs/flow-apps). Partners can host their own Flow Apps and register them with the Gateway [S05](https://docs.overledger.dev/docs/start-here) [S12](https://docs.overledger.dev/docs/flow-apps), although every app Quant ships today is internal [S12](https://docs.overledger.dev/docs/flow-apps).
> - **Signer.** Either the customer holds the keys and signs, or Quant holds them in a testnet hot wallet or a contracted mainnet KMS or HSM. The Gateway never sees private keys [S09](https://docs.overledger.dev/docs/signing).
> - **Overledger Firewall.** Access control in two layers: an off-chain layer that decides whether a user may reach a network, and an on-chain Fusion Firewall that allowlists addresses for contract calls, cross-chain messages and token bridging [S10](https://docs.overledger.dev/docs/overledger-firewall).
> - **Fusion Rollup.** A rollup built on the OP Stack that anchors to several base chains at once, giving one EVM environment across them [S11](https://docs.overledger.dev/docs/fusion-rollup).
> - **Quant Connect.** The web portal where users create an account and API keys [S08](https://docs.overledger.dev/docs/authentication).
>
> The API also offers event trackers that watch a contract event on a given network and call back a URL [S14](https://docs.overledger.dev/reference/subscribeevent), and signed webhooks for workflow events [S12](https://docs.overledger.dev/docs/flow-apps).

![Figure 2. How Overledger is put together, from its public documentation. Redbelly is not a listed network.](figures/stack.png)

*Figure 2. How Overledger is put together, from its public documentation. Redbelly is not a listed network.*

### How a chain gets connected today

> **Confirmed**
>
> Overledger's Connectors chapter describes two routes [S07](https://docs.overledger.dev/docs/connectors).
>
> **Route A: self-serve.** For public, permissionless networks in six families: EVM, Solana, Cosmos, SUI, Hedera and Aptos [S07](https://docs.overledger.dev/docs/connectors). A family qualifies if "(a) its nodes expose RPC or REST over HTTPS, (b) the RPC requires no security factor beyond an API key, and (c) node identity does not matter to other tenants" [S07](https://docs.overledger.dev/docs/connectors). An account can add a node to a network Overledger already lists, or add a network Overledger does not list yet, as long as it belongs to a self-serve family. "The first POST /nodes call registers both the network and your node for it. This new network will then be available for Overledger users" [S07](https://docs.overledger.dev/docs/connectors).
>
> Every node is registered as public or private. A **public** node joins the shared pool, must come from a whitelisted provider domain, and must carry the provider's API key in its URL. The approved domains include ankr.com [S07](https://docs.overledger.dev/docs/connectors) [S13](https://docs.overledger.dev/reference/post_nodes). A **private** node can come from any domain and is only usable by the account that added it [S07](https://docs.overledger.dev/docs/connectors). Every node passes a health check at registration [S07](https://docs.overledger.dev/docs/connectors).
>
> **Route B: managed engagement.** For networks "where node identity matters, typically permissioned DLTs used by regulated consortia and operator-gated public chains" [S07](https://docs.overledger.dev/docs/connectors). Examples include Hyperledger Fabric, R3 Corda, Canton, permissioned Besu and Quorum. The documentation adds that if a network exposes RPC over HTTPS "and authenticates with a bearer or API-key factor, Quant can normally onboard it" [S07](https://docs.overledger.dev/docs/connectors). A brand-new blockchain family needs a "DLT checker (health validation + chain identifer lookup)", which Quant estimates at about two days of work, plus about a day for each app that must support it [S07](https://docs.overledger.dev/docs/connectors).
>
> A few rules apply to every route. The Gateway blocks administrative methods such as `personal_*`, `admin_*` and `txpool_*` on EVM [S07](https://docs.overledger.dev/docs/connectors). Each network has a visibility of public, permissioned (users granted by the network owner) or private [S07](https://docs.overledger.dev/docs/connectors). When choosing a node, the Gateway prefers the caller's own private nodes, then weighs latency, error rate and QNT staked against each node [S07](https://docs.overledger.dev/docs/connectors). The live list of networks comes from `GET /networks` [S07](https://docs.overledger.dev/docs/connectors).
>
> **Fusion Rollup** has its own set of connected chains. At testnet launch they were Ethereum Sepolia, Polygon Amoy and Quant's own permissioned Besu testnet [S11](https://docs.overledger.dev/docs/fusion-rollup). Each connected chain hosts "Standard OP Stack contracts, one deployment per chain" [S11](https://docs.overledger.dev/docs/fusion-rollup).

![Figure 3. The three documented ways a chain reaches Overledger, and how Redbelly fits each one.](figures/routes.png)

*Figure 3. The three documented ways a chain reaches Overledger, and how Redbelly fits each one.*

> **Unknown**
>
> We found no documented self-serve way to add a new base chain to Fusion Rollup. The pages we reviewed say which chains Fusion connected, not how a chain is added [S11](https://docs.overledger.dev/docs/fusion-rollup).

## 5. Redbelly, in the terms that matter here

> **Confirmed**
>
> - **Purpose.** Redbelly describes itself as "a layer 1 blockchain, built and optimised for real world asset tokenisation" [S15](https://docs.redbelly.network/).
> - **EVM base.** Redbelly "can execute smart contracts written for the EVM". Its portal lists EVM version Prague and Solidity v0.8.30 [S23](https://vine.redbelly.network/consensus/evm-compatibility/).
> - **Networks and endpoints.** Mainnet is chain ID 151 with RPC at `governors.mainnet.redbelly.network`; Testnet is chain ID 153 [S21](https://vine.redbelly.network/environments/). Redbelly's portal also lists two third-party public Mainnet endpoints: Ankr (`rpc.ankr.com/redbelly_mainnet`) and Uniblock, which needs an API key in a header [S21](https://vine.redbelly.network/environments/).
> - **Consensus and finality.** DBFT is leaderless, tolerates faults up to t < n/3, finalises transactions deterministically "in a matter of seconds", and the chain "cannot fork" [S22](https://vine.redbelly.network/consensus/).
> - **Fees.** The unit price of gas is fixed in US dollar terms and converted at execution through an on-chain oracle [S24](https://vine.redbelly.network/network-fees/).
> - **Identity before writing.** All participants must prove who they are before gaining access [S25](https://vine.redbelly.network/identity/). A user proves a passport through biometric checks with an accredited issuer, then self-enables write access "through a specific network smart contract" [S26](https://vine.redbelly.network/identity/user-access/). Accredited issuers are listed in an on-chain registry [S27](https://vine.redbelly.network/identity/accredited-issuers/). The accredited issuer in Redbelly's access app is Averer, and one verified identity can have several accounts, with Testnet access offered after verification [S30](https://access.redbelly.network/). Mainnet and Testnet approvals are separate [S46](https://github.com/tycayomide/redbelly-testnet-bridge/blob/main/ARTICLE.md).
> - **Businesses.** Businesses prove they are incorporated to an accredited issuer [S29](https://vine.redbelly.network/business-verification/), and at least one officeholder must first onboard as a user [S27](https://vine.redbelly.network/identity/accredited-issuers/).
> - **Node operators.** Running a consensus node needs network access for two accounts and selection into the operator programme, and applications are currently closed [S31](https://vine.redbelly.network/nodes/become-operator/).

### Redbelly already has cross-chain routes

> **Confirmed**
>
> - **LayerZero.** Redbelly Mainnet is listed among LayerZero V2 deployments [S38](https://docs.layerzero.network/v2/deployments/deployed-contracts). Redbelly's portal lists tokens that move via LayerZero using Stargate, including RBNT, USD₮0, AUDF and WETH [S33](https://vine.redbelly.network/bridged-tokens/layerzero/).
> - **Lucid Labs.** Powered by Polymer and LayerZero [S34](https://vine.redbelly.network/bridged-tokens/lucidlabs/). Redbelly's portal names it as the way to bring RBNT back to Redbelly from another chain [S32](https://vine.redbelly.network/native-currency/).
> - **Celer cBridge.** A pegged bridge connecting Ethereum, BNB Chain and Redbelly [S36](https://blog.celer.network/2025/08/01/celer-announces-cbridge-support-for-redbelly/). Celer's announcement lists USDT, USDC, WBTC and ETH moving into Redbelly and RBNT moving out [S36](https://blog.celer.network/2025/08/01/celer-announces-cbridge-support-for-redbelly/). Redbelly's portal adds that through Celer, RBNT "bridges out from Redbelly to Ethereum and BNB Chain, not back" [S35](https://vine.redbelly.network/bridged-tokens/celer/).
> - **Wrapped RBNT on Ethereum.** Redbelly announced Wrapped RBNT on Ethereum with the official contract `0xb45ffb51984d626ee758b336c61cf20990c6bf13` [S37](https://x.com/RedbellyNetwork/status/1890340030197166112). The same address appears in the portal's Lucid Labs table [S34](https://vine.redbelly.network/bridged-tokens/lucidlabs/). Celer's wrapped RBNT on Ethereum is a different contract, `0x063a1D5BFEAb213c9c12f47b704fccf81D60983e` [S35](https://vine.redbelly.network/bridged-tokens/celer/).
> - **Community bridges.** The winning TASK-08 entry is a lock-and-mint bridge from Ethereum Sepolia to Redbelly Testnet secured by a 2-of-3 relayer set [S44](https://github.com/Redbelly-DAO-Community-Taskboard/TASK-08-bridge-integration-guide), with a live demo [S45](https://redbridge.test-hub.xyz/). The winning TASK-16 entry is a playbook for recovering stuck cross-chain RBNT [S47](https://github.com/Redbelly-DAO-Community-Taskboard/TASK-16-cross-chain-recovery-playbook).

> **Analysis**
>
> Two facts carry most of the weight for this question.
>
> First, Redbelly speaks the same EVM language as Overledger's largest self-serve family, and mainstream cross-chain tools already work with it. That shows Redbelly's EVM base is usable by outside infrastructure. It says nothing about Overledger specifically.
>
> Second, Redbelly is open to read but gated to write. Overledger sorts networks into public permissionless (self-serve) and permissioned or operator-gated (engagement) [S07](https://docs.overledger.dev/docs/connectors). Redbelly does not sit cleanly in either box, and Overledger's glossary describes exactly its model under the name "public permissioned": "anyone can read but only allowlisted parties can write" [S06](https://docs.overledger.dev/docs/overview). How Quant would classify Redbelly is the first practical question any connection would face.
>
> A smaller point matters too. There are already at least two different wrapped RBNT contracts on Ethereum [S34](https://vine.redbelly.network/bridged-tokens/lucidlabs/) [S35](https://vine.redbelly.network/bridged-tokens/celer/), from different bridges. Fusion Rollup's "Unify" primitive exists to "merge multiple chain-specific representations of the same underlying asset into a single rollup balance" [S11](https://docs.overledger.dev/docs/fusion-rollup). That is relevant to Redbelly's situation, but it would only help if Quant chose to support those tokens, which needs governance sign-off [S10](https://docs.overledger.dev/docs/overledger-firewall).

## 6. What we tested ourselves

Documentation can be out of date, so we checked the parts we could check without an Overledger account. All checks are read-only except one deliberately invalid write. The script is `scripts/probe.mjs`, the raw results are in `evidence/live-checks.json`, and `npm run probe` repeats them.

> **Confirmed by live check**
>
> | Check, 25 October 2026 | Result | Why it matters |
> |---|---|---|
> | `eth_chainId` on Redbelly Mainnet, Testnet and Ankr | 151, 153 and 151 [S49](evidence/live-checks.json) | All three endpoints answer standard EVM JSON-RPC over HTTPS. That matches self-serve test (a). |
> | Ankr endpoint with no API key | Answers normally [S49](evidence/live-checks.json) | Ankr is on Overledger's approved list [S07](https://docs.overledger.dev/docs/connectors) and serves Redbelly Mainnet [S21](https://vine.redbelly.network/environments/). Overledger requires a provider key in a public node's URL, which we did not test. |
> | `net_version` on Mainnet | Not available, error -32601 [S49](evidence/live-checks.json) | Overledger's own docs say it is kept "for wallets and tools that predate eth_chainId" [S11](https://docs.overledger.dev/docs/fusion-rollup). They do not say which methods the EVM health check uses. |
> | `eth_syncing`, `eth_gasPrice`, `eth_feeHistory`, `eth_maxPriorityFeePerGas` | All answered [S49](evidence/live-checks.json) | Standard fee and status methods work. |
> | `finalized` block tag | Same as the latest block [S49](evidence/live-checks.json) | Consistent with deterministic finality [S22](https://vine.redbelly.network/consensus/). |
> | `safe` block tag | 3,663 blocks behind `finalized` [S49](evidence/live-checks.json) | Unusual. Software that waits for `safe` would see an older block. The reason is not documented. |
> | Zero-value transaction from a new, unverified key | Refused on Mainnet and Testnet: "Sender not authorised to write transactions" [S49](evidence/live-checks.json) | Confirms write gating at the RPC. Matches the community report [S46](https://github.com/tycayomide/redbelly-testnet-bridge/blob/main/ARTICLE.md). |
> | Gas estimate for the same unverified key | Succeeds [S49](evidence/live-checks.json) | A workflow could pass its "prepare" step and then fail at "execute". |
> | Permit2 at its usual address | Not deployed [S49](evidence/live-checks.json) | Overledger's x402 payment gates use Permit2 on EVM [S12](https://docs.overledger.dev/docs/flow-apps). |
> | Multicall3 and the CREATE2 deployer | Deployed [S49](evidence/live-checks.json) | Present at their usual addresses, so tools that look for them there will find them. |
> | Overledger `GET /health` | Public, HTTP 200 [S49](evidence/live-checks.json) | The gateway named in the docs is live. |
> | Overledger `GET /networks` and `/networks/fusion` | HTTP 401 without an account [S49](evidence/live-checks.json) | Whether Redbelly is already listed cannot be checked publicly. |

## 7. Can Redbelly connect now?

Each Overledger route is tested below against what Redbelly's documentation and our live checks show.

### Route A, part 1: does Redbelly pass the self-serve tests?

| Self-serve test [S07](https://docs.overledger.dev/docs/connectors) | What Redbelly shows | Our reading |
|---|---|---|
| (a) Nodes expose RPC over HTTPS | Public HTTPS RPC for Mainnet and Testnet [S21](https://vine.redbelly.network/environments/), answering in our check [S49](evidence/live-checks.json) | **Meets it** |
| (b) RPC needs no security factor beyond an API key | Reading needs no key at all on the governor or Ankr endpoints [S49](evidence/live-checks.json). Writing needs a verified sending address, which is a property of the transaction, not of the RPC connection [S25](https://vine.redbelly.network/identity/) [S49](evidence/live-checks.json) | **Meets it for the RPC; writes are gated at the account level** |
| (c) Node identity does not matter to other tenants | Any endpoint gives the same chain state; the gate sits on who signs, not on which node you call [S25](https://vine.redbelly.network/identity/) [S49](evidence/live-checks.json) | **Appears to meet it; Quant's call** |
| Family is "public, permissionless" | Open to read, gated to write. Overledger's glossary names this "public permissioned" [S06](https://docs.overledger.dev/docs/overview); its engagement route covers "operator-gated public chains" [S07](https://docs.overledger.dev/docs/connectors) | **Unknown, Quant's call** |

> **Analysis**
>
> On the three written tests, Redbelly looks like a fit. The difficulty is the category label. Overledger describes self-serve as being for public, permissionless networks [S07](https://docs.overledger.dev/docs/connectors), and Redbelly's write gate is exactly the kind of property that might push it into the engagement route. This is a classification decision for Quant, not something the Redbelly community can settle.

### Route A, part 2: registering a node

> **Confirmed**
>
> - Self-serve covers networks Overledger does not list yet, if their family is supported, and EVM is supported [S07](https://docs.overledger.dev/docs/connectors).
> - A public node must come from an approved provider domain with an API key in the path; ankr.com is approved [S07](https://docs.overledger.dev/docs/connectors) [S13](https://docs.overledger.dev/reference/post_nodes). Redbelly's portal lists an Ankr Mainnet endpoint [S21](https://vine.redbelly.network/environments/).
> - A private node can come from any HTTPS domain and is only usable by the account that added it [S07](https://docs.overledger.dev/docs/connectors).

> **Analysis**
>
> On paper, two registrations are possible.
>
> - **Private node.** An Overledger account holder registers Redbelly's own RPC URL as a private node. Only that account can use it. This is the lowest barrier and would give a working Level 1 (read) link for that one account, and Level 2 (pass-through) for transactions signed by a verified Redbelly address.
> - **Public node.** An account registers a key-bearing Ankr URL for Redbelly as a public node. If accepted, the first registration would also create the network entry and make Redbelly available to other Overledger users [S07](https://docs.overledger.dev/docs/connectors).
>
> Neither changes Redbelly's rule that only verified accounts can write. Overledger would carry the transaction; Redbelly would still check the sender.

> **Unknown**
>
> - Whether Overledger's EVM health check passes against Redbelly. It is described only as "health validation + chain identifer lookup" [S07](https://docs.overledger.dev/docs/connectors). Redbelly does not serve `net_version` and returns an older block for the `safe` tag [S49](evidence/live-checks.json). Either could matter, or neither.
> - Whether a key-bearing Ankr URL for Redbelly exists in the form Overledger expects. Ankr's keyless endpoint works [S49](evidence/live-checks.json); the keyed form was not tested.
> - Whether Quant would let a write-gated chain be created through self-serve at all.
> - Whether Redbelly already appears in the live `GET /networks` list, which needs an account [S49](evidence/live-checks.json).

### Route B: managed engagement

> **Confirmed**
>
> Quant uses managed engagement for permissioned, consortium and operator-gated networks, and says a network with HTTPS RPC and bearer or API-key authentication can normally be onboarded [S07](https://docs.overledger.dev/docs/connectors).

> **Analysis**
>
> Redbelly's public RPC fits the transport part of that description [S21](https://vine.redbelly.network/environments/) [S49](evidence/live-checks.json). An engagement is the route by which Redbelly could become a fully supported network with Quant-run nodes, firewall settings and Quant support. One practical wrinkle: Overledger's pools include Quant-operated nodes [S06](https://docs.overledger.dev/docs/overview), but running a Redbelly consensus node needs selection into the operator programme and network access, and applications are currently closed [S31](https://vine.redbelly.network/nodes/become-operator/). Quant would more likely use third-party RPC endpoints, or run a non-consensus node if Redbelly allows one, which we could not confirm. Any engagement needs Quant to choose to do it. Nothing public says such work exists or is being considered.

### Route C: Fusion Rollup

> **Confirmed**
>
> Fusion connected Ethereum Sepolia, Polygon Amoy and Quant's own permissioned Besu testnet at launch [S11](https://docs.overledger.dev/docs/fusion-rollup). Every connected chain hosts standard OP Stack bridge and dispute contracts [S11](https://docs.overledger.dev/docs/fusion-rollup), and Fusion Firewall policies are mirrored on each connected chain [S06](https://docs.overledger.dev/docs/overview). Deposits and withdrawals are signed by the user's own keys [S11](https://docs.overledger.dev/docs/fusion-rollup).

> **Analysis**
>
> Joining Fusion would mean deploying Fusion's OP Stack contracts on Redbelly and wiring Redbelly into the rollup's deposit, messaging and withdrawal paths. On Redbelly, the deploying address and every address that deposits or withdraws would need write access [S25](https://vine.redbelly.network/identity/). Fusion treats a deposit as final once the connected chain's block has finalized [S11](https://docs.overledger.dev/docs/fusion-rollup). Redbelly's `finalized` tag returns the latest block, which fits, but its `safe` tag lags [S49](evidence/live-checks.json), so how Fusion's software reads Redbelly's block tags would need checking. This would be a project led by Quant, with Redbelly-side participants taking part. It is not something the community can switch on.

> **Unknown**
>
> No public source describes the steps, cost or timeline for adding a base chain to Fusion Rollup.

### Verdict

> **Analysis**
>
> **Not connected today.** A thin link at Level 1 (read) and Level 2 (pass-through) looks possible on paper through self-serve, most simply as a private node. It is untested, and two things could block it: Overledger's health check, and how Quant classifies a write-gated chain. Levels 3 and 4 (Quant-held signing, Flow Apps, Fusion Rollup) are not possible yet unless Quant chooses to support Redbelly.

## 8. What a connection would take

The table lists the work in the order it would happen, in plain words. "Who would act" is our reading of the documented roles. It does not describe any actual plan by anyone.

| Step | In plain words | Who would act | Open question |
|---|---|---|---|
| 1. Pick the route | Choose a private self-serve node, a public self-serve node, an engagement, or Fusion [S07](https://docs.overledger.dev/docs/connectors) [S11](https://docs.overledger.dev/docs/fusion-rollup) | An Overledger account holder, or Quant | How Quant classifies a write-gated chain |
| 2. Provide a node | Point Overledger at a Redbelly RPC endpoint. Public listing needs a whitelisted provider with a key in the URL [S07](https://docs.overledger.dev/docs/connectors) | Account holder; a provider such as Ankr [S21](https://vine.redbelly.network/environments/) | Does the keyed Ankr URL work |
| 3. Pass the health check | Overledger checks the node and the chain's identity before accepting it [S07](https://docs.overledger.dev/docs/connectors) | Quant's software | Does the EVM checker rely on `net_version` or `safe` [S49](evidence/live-checks.json) |
| 4. Verify every sender | Every address that signs Redbelly transactions needs a Redbelly access credential [S25](https://vine.redbelly.network/identity/). Businesses use business verification [S29](https://vine.redbelly.network/business-verification/) | The institution, an accredited issuer, and Quant if Quant holds keys [S09](https://docs.overledger.dev/docs/signing) | Whose identity stands behind a Quant-held key |
| 5. Test on Testnet | Run reads, signed writes, refusals for unverified senders, fees and event trackers against chain ID 153 [S21](https://vine.redbelly.network/environments/) [S14](https://docs.overledger.dev/reference/subscribeevent) | Quant engineers with Redbelly developers | Needs an Overledger account and verified test accounts |
| 6. Decide how assets move | Keep assets on Redbelly and move instructions, or represent them on other chains [S11](https://docs.overledger.dev/docs/fusion-rollup) | Asset issuers, and Quant for Fusion | The compliance design in the next section |
| 7. Map compliance | Line up Overledger's allowlists [S10](https://docs.overledger.dev/docs/overledger-firewall) with Receptor eligibility [S28](https://vine.redbelly.network/identity/eligibility/), including what happens when someone stops being eligible | Issuers, Quant and Redbelly | Legal and product decisions |
| 8. Agree terms | Commercial, legal and support arrangements between whoever runs it | The parties involved | Not public |

> **Analysis**
>
> **Steps 1 to 5 are enough for Levels 1 and 2.** Because Redbelly is an EVM chain, it should not need the "new DLT family" work Quant estimates at about two days plus a day per app [S07](https://docs.overledger.dev/docs/connectors), unless Redbelly's differences, such as the missing `net_version`, force a Redbelly-specific checker.
>
> **Step 4 is the step that is specific to Redbelly.** On Redbelly every signing address is an identity decision as well as a technical one: a new key is refused whatever it signs [S25](https://vine.redbelly.network/identity/) [S49](evidence/live-checks.json). Overledger's API keys only identify the caller, and transactions still need the caller's own signature [S08](https://docs.overledger.dev/docs/authentication), so the identity question attaches to the signing key, wherever it lives.
>
> **Steps 6 and 7 are where most of the real effort would go,** because they decide whether a Redbelly asset keeps its protections once it touches another chain.

### Small technical gaps found

> **Analysis**
>
> None of these is a blocker on its own. Each is a concrete item an engineer would need to check.
>
> - **`net_version` is not served** [S49](evidence/live-checks.json). Overledger keeps it for older wallets and tools [S11](https://docs.overledger.dev/docs/fusion-rollup). If a checker or a Flow App uses it, it would need to use `eth_chainId` instead.
> - **The `safe` tag returns an older block than `finalized`** [S49](evidence/live-checks.json). Software that waits for `safe` would see Redbelly as slower than it is.
> - **Permit2 is not deployed** at its usual address [S49](evidence/live-checks.json). Overledger's x402 payment gates on EVM rely on Permit2 [S12](https://docs.overledger.dev/docs/flow-apps), so paid Flow App actions on Redbelly would need it deployed by a verified account first. The CREATE2 deployer it normally comes from is present [S49](evidence/live-checks.json).
> - **Gas estimates succeed for unverified addresses** [S49](evidence/live-checks.json). A workflow should check write access before it prepares a transaction, not after it fails.
> - **Fees are fixed in US dollar terms through an on-chain oracle** [S24](https://vine.redbelly.network/network-fees/). Fee logic that assumes a market fee would need testing against this model.

## 9. What it could offer institutions

> **Analysis**
>
> **For institutions that already use Overledger:**
>
> - **One integration instead of another.** Redbelly would sit behind the same credentials and API as their other networks [S05](https://docs.overledger.dev/docs/start-here), instead of needing its own integration.
> - **Workflows across chains.** Flow Apps and event trackers [S12](https://docs.overledger.dev/docs/flow-apps) [S14](https://docs.overledger.dev/reference/subscribeevent) could tie a step on Redbelly to steps elsewhere. For example, a payment instruction on one network could be released when a tokenised fund unit changes hands on Redbelly. This needs Quant to support Redbelly in those tools.
> - **Custody choices.** Overledger supports self-custody or Quant-held keys in a KMS or HSM [S09](https://docs.overledger.dev/docs/signing), which suits institutions with different custody policies, as long as every signing address is Redbelly-verified [S25](https://vine.redbelly.network/identity/).
>
> **For institutions using Redbelly:**
>
> - **A possible route toward bank networks that standardise on Quant**, if those networks ever connect to outside chains. Today that is unknown [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative) [S03](https://quant.network/news/quant-powers-the-clearing-houses-on-chain-money-initiative-in-the-us/).
> - **Redbelly's own properties come along.** Identity-verified counterparties [S25](https://vine.redbelly.network/identity/), deterministic finality [S22](https://vine.redbelly.network/consensus/), and fees fixed in US dollar terms [S24](https://vine.redbelly.network/network-fees/) are the properties an institution would weigh when choosing where to issue. A connection would not change them.
> - **Tokeniser's API.** Tokeniser already offers an API and MCP for integrating with existing systems [S39](https://tokeniser.com/). That is the kind of surface an Overledger workflow, or an AI agent driving one, could call.
>
> **What it would not offer:**
>
> - **Compliance does not travel automatically.** Overledger's Firewall controls which users and addresses may act inside Overledger [S10](https://docs.overledger.dev/docs/overledger-firewall). Redbelly's controls decide who may hold and move assets on Redbelly [S28](https://vine.redbelly.network/identity/eligibility/) [S39](https://tokeniser.com/). They are separate systems, and nothing links them today.
> - **No access to TCH's network follows from it.** Who joins that network, and which ledgers it uses, is TCH's decision [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative) [S04](https://www.theclearinghouse.org/payment-systems/Articles/2026/06/Major-Financial-Institutions-Unveil-Bank-Led-On-Chain-Money-Initiative).
> - **A new dependency.** Institutions would rely on a third-party platform whose terms for such a connection are not public.

## 10. Credentials and assets across chains

This section explains how Redbelly's compliance tools work today, and where they could stop working once an asset, or a claim on it, leaves Redbelly.

> **Confirmed**
>
> - **Receptor credentials** are W3C verifiable credentials, with Issuer, Holder and Verifier modules [S16](https://docs.redbelly.network/pages/receptor/). Issuers that grant network access must be accredited [S16](https://docs.redbelly.network/pages/receptor/).
> - **Issuer identifiers name the Redbelly network.** Averer's issuer identifiers are network specific, for example `did:receptor:redbelly:mainnet:...` for Mainnet [S19](https://docs.redbelly.network/pages/eligibility-sdk/eligibility-sdk/).
> - **Proof by Query** checks a zero-knowledge proof in a verifier smart contract; the verifier never sees or stores the personal data [S17](https://docs.redbelly.network/pages/methods/proof-by-query/). The Eligibility SDK uses Privado ID and the Iden3 zero-knowledge ecosystem [S19](https://docs.redbelly.network/pages/eligibility-sdk/eligibility-sdk/).
> - **Selective Disclosure** uses BBS+ signatures and "can only be used off-chain" [S18](https://docs.redbelly.network/pages/methods/selective-disclosure/).
> - **Query support today.** On-chain checks support single queries; on-chain multi query is listed as planned. Credential types include AML/CTF and Australian sophisticated or wholesale investor credentials. Verifiers are told to keep revocation checks on in production [S20](https://docs.redbelly.network/pages/eligibility-sdk/configure-eligibility-criteria/).
> - **Eligibility in contracts.** Eligibility checks can restrict smart contract functions to users who prove they meet the criteria, and each developer decides which issuers to trust [S28](https://vine.redbelly.network/identity/eligibility/).
> - **Tokeniser** runs on Redbelly and "programs eligibility into every asset at the protocol level: identity, KYC, AML, CTF, wholesale and sophisticated investor tests, and TMD". Every holder is verified and every transfer checked [S39](https://tokeniser.com/). Rules are "enforced at the point of transfer, every time" [S40](https://tokeniser.com/technology). Trades that fail a check do not proceed [S41](https://tokeniser.com/product/superpowers/automated-compliance). In a secondary transfer, "ownership and payment are exchanged in a single step" [S42](https://tokeniser.com/product/superpowers/secondary-transfer). Pledged units stay locked until the loan is repaid [S43](https://tokeniser.com/product/superpowers/collateral-mobility).
> - **Overledger's Fusion Firewall** allowlists on-chain addresses; Overledger maps users to their authorised addresses off-chain [S10](https://docs.overledger.dev/docs/overledger-firewall), and policies are mirrored on each connected chain [S06](https://docs.overledger.dev/docs/overview).

![Figure 4. Where Redbelly's compliance checks run, and where they could break once an asset leaves.](figures/journey.png)

*Figure 4. Where Redbelly's compliance checks run, and where they could break once an asset leaves.*

> **Analysis**
>
> All of the checks above run **on Redbelly**. A Receptor proof is checked by a contract, and a Tokeniser transfer is checked against the asset's rules at the point of transfer [S17](https://docs.redbelly.network/pages/methods/proof-by-query/) [S40](https://tokeniser.com/technology). Another chain, or a rollup, does not see those checks. It applies its own rules. So a connection either brings equivalent checks to the other side, or keeps the asset where the checks are.
>
> | Moment | On Redbelly today | Once it touches another chain | Where it could break |
> |---|---|---|---|
> | Holding | Every holder is verified [S39](https://tokeniser.com/) | The other chain applies its own rules | A wrapped token without the same checks lets anyone hold it |
> | Transferring | Every transfer is checked [S40](https://tokeniser.com/technology) | Transfers of a wrapped token happen out of Redbelly's sight | Secondary trading skips eligibility entirely |
> | Proving eligibility | A zero-knowledge proof is checked by a verifier contract [S17](https://docs.redbelly.network/pages/methods/proof-by-query/) | A contract elsewhere cannot read that result unless it is relayed | The relayed status goes stale or is relayed wrongly |
> | Losing eligibility | Revocation checks apply when kept on [S20](https://docs.redbelly.network/pages/eligibility-sdk/configure-eligibility-criteria/) | Any copy of the status elsewhere must also update | A holder no longer eligible stays allowlisted elsewhere |
> | Disclosing data | Selective Disclosure is off-chain only [S18](https://docs.redbelly.network/pages/methods/selective-disclosure/) | There is no on-chain proof to carry across | Checks that rely on disclosure cannot be re-run by a contract |
> | Who holds the key | One verified identity behind each account [S25](https://vine.redbelly.network/identity/) [S30](https://access.redbelly.network/) | The asset may sit with a custodian, an omnibus wallet or a Quant-held key [S09](https://docs.overledger.dev/docs/signing) | It becomes unclear whose identity stands behind an address |
> | Paying for it | Ownership and payment move in one step [S42](https://tokeniser.com/product/superpowers/secondary-transfer) | Payment may settle on a different network from the asset | One leg completes and the other does not |
> | Pledged as collateral | Units locked until repayment [S43](https://tokeniser.com/product/superpowers/collateral-mobility) | A copy elsewhere could be pledged again | Double use of the same asset |
> | Bridge mechanics | Not involved | Lock-and-mint, custody and relayers come into play | "Lock-and-mint mismatches, custodian compromise, oracle failure" [S11](https://docs.overledger.dev/docs/fusion-rollup) |
> | Several copies | One native asset | Different bridges issue different wrapped versions [S34](https://vine.redbelly.network/bridged-tokens/lucidlabs/) [S35](https://vine.redbelly.network/bridged-tokens/celer/) | Rules applied to one copy but not another |
> | Coming back | Sending on Redbelly needs write access [S25](https://vine.redbelly.network/identity/), and Tokeniser assets only go to eligible holders [S39](https://tokeniser.com/) | The recipient must be verified to move the asset onward, and eligible to hold a Tokeniser asset | Funds land where they cannot be moved, a kind of failure the DAO playbook already covers for RBNT [S47](https://github.com/Redbelly-DAO-Community-Taskboard/TASK-16-cross-chain-recovery-playbook) |

### Designs that would keep compliance intact

> **Analysis**
>
> Five designs follow from the facts above. They are options for discussion, not recommendations to any party, and none is known to be under consideration.
>
> 1. **Keep the asset on Redbelly and move instructions.** Overledger coordinates the workflow, but the asset never leaves Redbelly, so every transfer still passes Tokeniser's and Receptor's checks [S39](https://tokeniser.com/) [S17](https://docs.redbelly.network/pages/methods/proof-by-query/). A payment leg could settle elsewhere. Least compliance risk; needs care so both legs complete or neither does.
> 2. **Package the eligibility check as a Flow App.** Overledger lists a "compliance check" as a typical Flow App step [S05](https://docs.overledger.dev/docs/start-here) and lets partners host external Flow Apps [S12](https://docs.overledger.dev/docs/flow-apps). A workflow could call a Receptor eligibility check before acting. This keeps the check where it is designed to run, but someone would have to build and host that app.
> 3. **Represent the asset elsewhere, with eligibility mirrored.** The destination contract only allows transfers between allowlisted addresses that mirror Redbelly eligibility. Overledger's address allowlists [S10](https://docs.overledger.dev/docs/overledger-firewall) are one place such a mirror could live. It needs a trusted way to update the mirror when people stop being eligible.
> 4. **Re-prove eligibility on the destination.** The holder proves eligibility again on the other chain with the same credential. Receptor's tooling builds on Iden3 and Privado ID [S19](https://docs.redbelly.network/pages/eligibility-sdk/eligibility-sdk/), but its documentation describes verification on Redbelly only.
> 5. **Unify representations through Fusion.** Fusion can merge several chain-specific versions of one asset into a single rollup balance [S11](https://docs.overledger.dev/docs/fusion-rollup), and its firewall controls which tokens may be deposited [S10](https://docs.overledger.dev/docs/overledger-firewall). It would not by itself enforce Tokeniser's investor rules.

> **Unknown**
>
> - Whether Receptor verifier contracts, or trust in Redbelly's accredited issuers, can be used on chains other than Redbelly.
> - How Tokeniser would treat a representation of one of its assets on another chain. Its public material describes checks on Redbelly only [S39](https://tokeniser.com/) [S40](https://tokeniser.com/technology).
> - Whether Overledger's allowlists could be fed by Receptor eligibility automatically. The documentation describes allowlists managed by Overledger and by contract deployers [S10](https://docs.overledger.dev/docs/overledger-firewall), not by outside credential systems.

## 11. Not possible yet, and unknown

> **Confirmed**
>
> **Not possible yet, based on public sources at the cut-off:**
>
> - Relying on documented Overledger support for Redbelly. None of the Overledger documentation reviewed names Redbelly [S05](https://docs.overledger.dev/docs/start-here) [S06](https://docs.overledger.dev/docs/overview) [S07](https://docs.overledger.dev/docs/connectors) [S11](https://docs.overledger.dev/docs/fusion-rollup). Whether the account-only network list includes it is unknown (see below).
> - Connecting Redbelly to Fusion Rollup. It is not among Fusion's connected networks, and no self-serve route is documented [S11](https://docs.overledger.dev/docs/fusion-rollup).
> - Sending a Redbelly transaction from an unverified address by any route, Overledger included [S25](https://vine.redbelly.network/identity/) [S49](evidence/live-checks.json).
> - Using Overledger's Permit2-based payment gates on Redbelly without first deploying Permit2 [S12](https://docs.overledger.dev/docs/flow-apps) [S49](evidence/live-checks.json).

> **Unknown**
>
> **Unknown:**
>
> - How Quant would classify Redbelly: self-serve or managed engagement [S06](https://docs.overledger.dev/docs/overview) [S07](https://docs.overledger.dev/docs/connectors).
> - Whether Overledger's EVM health check accepts a Redbelly node [S07](https://docs.overledger.dev/docs/connectors) [S49](evidence/live-checks.json).
> - Whether Redbelly already appears in the live `GET /networks` list. Checking needs an account [S49](evidence/live-checks.json).
> - Whether Quant-held signing keys could be Redbelly-verified, and under whose identity [S09](https://docs.overledger.dev/docs/signing) [S25](https://vine.redbelly.network/identity/).
> - Whether TCH's On-Chain Money network will connect to any public chain [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative).
> - Whether Receptor verification can run on other chains.
> - The cost, timeline and commercial terms of any engagement.
> - Redbelly's official position on bridging, which has not been published [S48](https://taskboard.redbellydao.network/tasks/TASK-29).

## 12. What would change the answer

> **Analysis**
>
> These public signals would move items from "unknown" to "confirmed". They are things to watch, not predictions:
>
> - Redbelly appearing in Overledger's documentation or in `GET /networks` [S07](https://docs.overledger.dev/docs/connectors).
> - A published test of an Overledger Connector against Redbelly Testnet, chain ID 153 [S21](https://vine.redbelly.network/environments/).
> - Redbelly publishing an official position on bridging [S48](https://taskboard.redbellydao.network/tasks/TASK-29).
> - TCH publishing which ledgers the On-Chain Money network will use [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative).
> - Receptor documentation describing verification on chains other than Redbelly [S16](https://docs.redbelly.network/pages/receptor/) [S17](https://docs.redbelly.network/pages/methods/proof-by-query/).
> - Quant documenting how a base chain is added to Fusion Rollup [S11](https://docs.overledger.dev/docs/fusion-rollup).

## 13. Method and limits

- **Sources.** Quant's Overledger documentation and API reference; the TCH and Quant announcements; Redbelly's technical documentation, Vine developer portal and access app; Tokeniser's website; Celer's and LayerZero's documentation; Redbelly's announcement of Wrapped RBNT; and DAO community work. Every source is listed with what it supports in the [source list](#sources).
- **Checking every claim.** For each source we recorded the exact phrases that support our claims, 154 in total. `npm run verify:sources` loads every link and confirms each phrase is still on the page. On 25 October 2026 all 48 external links loaded and every phrase was found.
- **Checking the text.** `npm run lint` checks that every confirmed panel cites a source, that every citation points to a listed source, and that the text contains no partnership wording, no price talk, no personal credit, and no dashes or emoji outside the brand rules.
- **Live checks.** `npm run probe` repeats the 22 checks in [What we tested ourselves](#live-checks). It uses no credentials and cannot move funds.
- **What we did not do.** We did not open an Overledger account, call authenticated Overledger endpoints, register a node or write any successful transaction. Every statement about how Overledger would behave with Redbelly is analysis, not a test result.
- **Vendor material.** Descriptions from Quant, Redbelly, Tokeniser and bridge providers are their own. We report what they say and label anything beyond that as analysis.
- **Neutrality.** This report takes no view on whether a connection should happen. It contains no price discussion and no investment advice.

## 14. Glossary

| Term | Meaning |
|---|---|
| Overledger | Quant's platform for applications that span several blockchains [S05](https://docs.overledger.dev/docs/start-here) |
| Gateway | Overledger's front door: authentication, routing and workflows [S06](https://docs.overledger.dev/docs/overview) |
| Connector | Overledger's adapter for one family of blockchains [S06](https://docs.overledger.dev/docs/overview) |
| Self-serve | Adding a node or network to Overledger yourself through `POST /nodes` [S07](https://docs.overledger.dev/docs/connectors) |
| Managed engagement | Onboarding a network with Quant's team [S07](https://docs.overledger.dev/docs/connectors) |
| Flow App | A multi-step workflow run through the Gateway [S12](https://docs.overledger.dev/docs/flow-apps) |
| Fusion Rollup | Quant's rollup that anchors to several base chains at once [S11](https://docs.overledger.dev/docs/fusion-rollup) |
| EVM | Ethereum Virtual Machine, the smart contract environment Redbelly supports [S23](https://vine.redbelly.network/consensus/evm-compatibility/) |
| RPC endpoint | The web address software calls to read from or send to a blockchain node |
| Public permissioned | Overledger's term for a network anyone can read but only allowlisted parties can write [S06](https://docs.overledger.dev/docs/overview) |
| Receptor | Redbelly's identity and verifiable credential protocol [S16](https://docs.redbelly.network/pages/receptor/) |
| Verifiable credential | A signed digital statement about a person or company, held by them [S16](https://docs.redbelly.network/pages/receptor/) |
| Accredited issuer | An issuer Redbelly allows to grant network access [S27](https://vine.redbelly.network/identity/accredited-issuers/) |
| Zero-knowledge proof | A way to prove a fact, such as eligibility, without revealing the data behind it [S17](https://docs.redbelly.network/pages/methods/proof-by-query/) |
| Lock-and-mint | A bridge pattern that locks an asset on one chain and creates a copy on another [S44](https://github.com/Redbelly-DAO-Community-Taskboard/TASK-08-bridge-integration-guide) |
| Tokenised deposit | A bank deposit represented on a ledger, the subject of TCH's initiative [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative) |
| KMS or HSM | Key management services and hardware security modules that protect signing keys [S09](https://docs.overledger.dev/docs/signing) |
| TMD | Target market determination, one of the rules Tokeniser says it enforces at the point of transfer [S40](https://tokeniser.com/technology) |

---

## Source list

Quant Overledger and Redbelly Interoperability Research. 49 sources, accessed 2026-10-25. Every external link and the quoted phrases below were re-checked on 25 October 2026 with `npm run verify:sources`.

## The Clearing House and Quant announcements

**S01. The Clearing House Partners with Quant to Advance the On-Chain Money Initiative**  
The Clearing House, 2026-09-24  
https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative  
Supports: TCH selected Quant to power the On-Chain Money Initiative; Quant's technology provides the interoperability, orchestration and transaction-management layer with connectivity to RTP and CHIPS; expected in the first half of 2027.

Quoted phrases checked on the live page:
- "announced the selection of Quant"
- "to power its On-Chain Money Initiative, a new interoperable payments network that will enable financial institutions of all sizes to clear and settle tokenized deposit transactions"
- "Quant's technology will enable the network's interoperability, orchestration, and transaction-management layer"
- "including the RTP® and CHIPS® networks"
- "Announced in June"
- "expected to become available to participating institutions in the first half of 2027"

Cited in: The answer on one page; Why the question is being asked now; What it could offer institutions; Not possible yet, and unknown; What would change the answer; Glossary

**S02. The Clearing House Partners with Quant to Advance the On-Chain Money Initiative (Quant press release)**  
Quant, 2026-09-24  
https://quant.network/press-releases/the-clearing-house-partners-with-quant-to-advance-the-on-chain-money-initiative/  
Supports: Quant's own release of the same announcement, with the same description of its role and timing.

Quoted phrases checked on the live page:
- "The Clearing House will use Quant's technology to bring on-chain capabilities to its tokenised deposit clearing and settlement network for financial institutions."
- "interoperability, orchestration, and transaction-management layer"
- "first half of 2027"

Cited in: Why the question is being asked now

**S03. Quant powers The Clearing House's On-Chain Money Initiative in the US**  
Quant, 2026-09-24  
https://quant.network/news/quant-powers-the-clearing-houses-on-chain-money-initiative-in-the-us/  
Supports: Selection followed a competitive process; Quant will also offer Tokenised Deposits-as-a-Service to US institutions that process through TCH but lack tokenised deposit capability.

Quoted phrases checked on the live page:
- "Following a competitive process, it has selected Quant to power its On-Chain Money Initiative"
- "Quant will serve as the commercial solution for bank-side tokenised deposits for any US financial institution that processes through The Clearing House but does not yet have tokenised deposit capability"
- "Today, tokenised deposits mostly live in walled gardens"

Cited in: The answer on one page; Why the question is being asked now; What it could offer institutions

**S04. Major Financial Institutions Unveil Bank-Led On-Chain Money Initiative**  
The Clearing House, 2026-06-05  
https://www.theclearinghouse.org/payment-systems/Articles/2026/06/Major-Financial-Institutions-Unveil-Bank-Led-On-Chain-Money-Initiative  
Supports: The initiative was unveiled in June 2026 by a group of banks; it is operated by TCH and includes a connectivity layer to fiat rails.

Quoted phrases checked on the live page:
- "June 05, 2026"
- "will be operated by The Clearing House"
- "a connectivity layer linking blockchain-based activity with established fiat rails, such as the RTP® and CHIPS® networks"

Cited in: Why the question is being asked now; What it could offer institutions

## Quant Overledger documentation and API reference

**S05. Start Here (Overledger documentation)**  
Quant, accessed 2026-10-25  
https://docs.overledger.dev/docs/start-here  
Supports: Overledger is Quant's multi-DLT platform with one set of credentials and one API surface; Flow Applications include steps such as a compliance check; customers and partners can host their own Flow Apps.

Quoted phrases checked on the live page:
- "Overledger is Quant's multi-DLT platform for building applications that span more than one blockchain, one set of credentials, one API surface, one execution environment that connects to many DLT networks."
- "Flow Applications turn multi-step business logic (signing, smart-contract deployment, compliance check, payment, …) into typed sessions"
- "customers and partners can host their own Flow Applications externally and register them with the Gateway"

Cited in: The answer on one page; Why the question is being asked now; Overledger in plain words; What it could offer institutions; Credentials and assets across chains; Not possible yet, and unknown; Glossary

**S06. Overview (Overledger documentation)**  
Quant, accessed 2026-10-25  
https://docs.overledger.dev/docs/overview  
Supports: Overledger's three foundations (Gateway, Connectors, Fusion Rollup); network categories; glossary definition of a public permissioned network; Fusion Firewall policies mirrored on each connected L1.

Quoted phrases checked on the live page:
- "A Gateway that authenticates clients, routes requests, and orchestrates higher-level workflows."
- "A set of Connectors that abstract individual DLT RPC protocols behind a common interface."
- "public networks (Ethereum, Polygon, Solana, …), public permissioned networks (consortium chains with public read access), and private permissioned networks (consortium chains)"
- ""public permissioned" means anyone can read but only allowlisted parties can write"
- "Each Connector integrates with a pool of nodes for its DLT family: Quant-operated nodes that ship by default, plus customer-attached nodes that your account can register"
- "The policies of the Fusion Firewall are mirrored on-chain inside the rollup and on each connected L1."

Cited in: The answer on one page; Overledger in plain words; Redbelly, in the terms that matter here; Can Redbelly connect now?; Credentials and assets across chains; Not possible yet, and unknown; Glossary

**S07. Connectors (Overledger documentation)**  
Quant, accessed 2026-10-25  
https://docs.overledger.dev/docs/connectors  
Supports: Self-serve versus managed engagement; six self-serve families; the three self-serve eligibility tests; POST /nodes adds a new network in a supported family; public and private nodes; approved provider domains; engagement for operator-gated chains; new-family effort; node selection; blocked admin methods; network visibility model; live list from GET /networks.

Quoted phrases checked on the live page:
- "Self-serve Connectors for public, permissionless DLT families."
- "Six DLT families are available for self-serve onboarding today"
- "Covers every EVM-compatible chain (Ethereum, Polygon, Arbitrum, Avalanche, …)."
- "A DLT family is considered eligible for self-serve if (a) its nodes expose RPC or REST over HTTPS, (b) the RPC requires no security factor beyond an API key, and (c) node identity does not matter to other tenants"
- "The first POST /nodes call registers both the network and your node for it. This new network will then be available for Overledger users."
- "If public is selected then the user can only add nodes from whitelisted providers. If private is selected then the user can add nodes from any domain."
- "alchemy.com, infura.io, quiknode.pro, chainstack.com, getblock.io, blockdaemon.com, ankr.com"
- "Required, embedded in the URL path (the Gateway forwards the URL as-is), not a header."
- "Health check at registration"
- "typically permissioned DLTs used by regulated consortia and operator-gated public chains"
- "if your DLT exposes RPC (or a documented REST equivalent) over HTTP(S) and authenticates with a bearer or API-key factor, Quant can normally onboard it"
- "Implement a DLT checker (health validation + chain identifer lookup)"
- "QNT staked against each node"
- "personal_*, admin_*, txpool_* on EVM"
- "users explicitly granted by the network owner"
- "Run GET /networks to retrieve the live list."

Cited in: Read this first; The answer on one page; Overledger in plain words; Redbelly, in the terms that matter here; What we tested ourselves; Can Redbelly connect now?; What a connection would take; Not possible yet, and unknown; What would change the answer; Glossary

**S08. Authentication (Overledger documentation)**  
Quant, accessed 2026-10-25  
https://docs.overledger.dev/docs/authentication  
Supports: Accounts are created in Quant Connect; API keys authenticate RPC; a leaked API key cannot move funds because transactions still need the caller's own signature.

Quoted phrases checked on the live page:
- "Go to Quant Connect and create an account."
- "A leaked API key cannot move funds."
- "Blockchain transactions still require a signature from the caller's own wallet private key."

Cited in: Overledger in plain words; What a connection would take

**S09. Signing (Overledger documentation)**  
Quant, accessed 2026-10-25  
https://docs.overledger.dev/docs/signing  
Supports: Two custody options (client-held keys or Quant-held keys in a testnet hot wallet or contracted mainnet KMS/HSM); the Gateway never sees private keys; EVM uses ECDSA on secp256k1; raw signed transactions can be submitted through the Connectors RPC.

Quoted phrases checked on the live page:
- "if Quant holds them on your behalf (testnet hot wallet, or contracted mainnet KMS / HSM), the Signer signs internally"
- "Either way the Gateway and the calling Flow App never see private-key material."
- "ECDSA on secp256k1"
- "sign locally and submit through /rpc/{apiKey} or the Connectors RPC"

Cited in: The answer on one page; Overledger in plain words; What a connection would take; What it could offer institutions; Credentials and assets across chains; Not possible yet, and unknown; Glossary

**S10. Overledger Firewall (Overledger documentation)**  
Quant, accessed 2026-10-25  
https://docs.overledger.dev/docs/overledger-firewall  
Supports: Two firewall layers; the off-chain layer gates network access per user; the on-chain Fusion Firewall allowlists addresses; token allowlist entries need governance sign-off.

Quoted phrases checked on the live page:
- "If permissioned, the user must appear in the network's allowlist."
- "It enforces against on-chain addresses, deciding which addresses can call which smart contracts, send which cross-chain messages, and bridge which tokens."
- "Overledger maintains the binding between each user and their authorised on-chain address(es) off-chain"
- "Token allowlist entries are governance-controlled (Quant Safe signers), not per-deployer"

Cited in: Overledger in plain words; Redbelly, in the terms that matter here; What a connection would take; What it could offer institutions; Credentials and assets across chains

**S11. Fusion Rollup (Overledger documentation)**  
Quant, accessed 2026-10-25  
https://docs.overledger.dev/docs/fusion-rollup  
Supports: Fusion is an OP Stack based multi-ledger rollup; its connected networks at testnet launch; bridge contracts deployed on each connected network; four primitives; known bridge risks; firewall locked down on mainnet; deposits final once the connected chain's block has finalized; net_version kept for older wallets and tools.

Quoted phrases checked on the live page:
- "Fusion is built on the standard OP Stack architecture"
- "Connected DLT networks on testnet launch are: Ethereum Sepolia, Polygon Amoy, Quant's permissioned Besu testnet."
- "The bridge and dispute contracts deployed on each connected DLT network. Standard OP Stack contracts, one deployment per chain."
- "Bridges carry well-known risks: lock-and-mint mismatches, custodian compromise, oracle failure."
- "Merge multiple chain-specific representations of the same underlying asset into a single rollup balance"
- "locked-down on mainnet, permissive on testnet"
- "deposits and withdrawals are signed by the user's own keys"
- "the relevant connected DLT network block has finalized"
- "Exposed for wallets and tools that predate eth_chainId."

Cited in: The answer on one page; Overledger in plain words; Redbelly, in the terms that matter here; What we tested ourselves; Can Redbelly connect now?; What a connection would take; Credentials and assets across chains; Not possible yet, and unknown; What would change the answer; Glossary

**S12. Flow Apps (Overledger documentation)**  
Quant, accessed 2026-10-25  
https://docs.overledger.dev/docs/flow-apps  
Supports: Prepare-Sign-Execute pattern; external Flow Apps hosted by partners; x402 payment gates via Permit2 on EVM; signed webhooks.

Quoted phrases checked on the live page:
- "We call it Prepare-Sign-Execute."
- "Most Flow Apps that touch a chain follow the same three-phase pattern."
- "external apps run as a separately-hosted service (a partner or customer deployment) that the Gateway calls over the network"
- "today every shipped app is internal"
- "implemented on EVM via Uniswap's Permit2 for on-chain settlement"
- "receive HTTP POST callbacks signed with HMAC-SHA256"

Cited in: The answer on one page; Overledger in plain words; What we tested ourselves; What a connection would take; What it could offer institutions; Credentials and assets across chains; Not possible yet, and unknown; Glossary

**S13. Register a new DLT node (Overledger API reference)**  
Quant, accessed 2026-10-25  
https://docs.overledger.dev/reference/post_nodes  
Supports: POST /nodes takes a node URL and a DLT family (EVM among them); public node URLs must come from an approved provider domain with an API key in the path.

Quoted phrases checked on the live page:
- "URL must be from an approved provider domain (for a public node)."
- "Must include an API key in the path."
- "ankr.com"

Cited in: Overledger in plain words; Can Redbelly connect now?

**S14. Subscribe to a specific contract event signature (Overledger API reference)**  
Quant, accessed 2026-10-25  
https://docs.overledger.dev/reference/subscribeevent  
Supports: Overledger's API can subscribe to a contract event on a given network and call back a URL.

Quoted phrases checked on the live page:
- "Subscribe to a specific contract event signature"
- "callbackUrl"
- "networkId"

Cited in: Overledger in plain words; What a connection would take; What it could offer institutions

## Redbelly Network documentation

**S15. Redbelly Network Technical Documentation (home)**  
Redbelly Network, accessed 2026-10-25  
https://docs.redbelly.network/  
Supports: Redbelly is a layer 1 blockchain built for real world asset tokenisation, with a DBFT consensus and an EVM implementation.

Quoted phrases checked on the live page:
- "The Redbelly Network is a layer 1 blockchain, built and optimised for real world asset tokenisation."
- "a scalable EVM implementation"

Cited in: Redbelly, in the terms that matter here

**S16. Receptor (Redbelly documentation)**  
Redbelly Network, accessed 2026-10-25  
https://docs.redbelly.network/pages/receptor/  
Supports: Receptor is Redbelly's identity and verifiable credential protocol, built on the W3C data model, with Issuer, Holder and Verifier modules; issuers that provide network access are accredited.

Quoted phrases checked on the live page:
- "Receptor is Redbelly's native digital identity and verifiable credential protocol."
- "Receptor is built on the W3C verifiable credential data model"
- "the Issuer, the Holder, and the Verifier"
- "Redbelly ensures that all issuers who provide network access are accredited"

Cited in: Credentials and assets across chains; What would change the answer; Glossary

**S17. Proof by Query (Redbelly documentation)**  
Redbelly Network, accessed 2026-10-25  
https://docs.redbelly.network/pages/methods/proof-by-query/  
Supports: Proof by Query uses a zero-knowledge verifier smart contract; personal data is never seen or stored by the verifier.

Quoted phrases checked on the live page:
- "a zero knowledge proof based verifier smart contract"
- "is never seen or stored by the Verifier"
- "credentialAtomicQuerySigV2OnChain.circom"

Cited in: Credentials and assets across chains; What would change the answer; Glossary

**S18. Selective Disclosure (Redbelly documentation)**  
Redbelly Network, accessed 2026-10-25  
https://docs.redbelly.network/pages/methods/selective-disclosure/  
Supports: Selective Disclosure uses BBS+ signatures and can only be used off-chain.

Quoted phrases checked on the live page:
- "Selective Disclosure involves using credentials that implement BBS+ signatures."
- "it can only be used off-chain"

Cited in: Credentials and assets across chains

**S19. Eligibility SDK overview (Redbelly documentation)**  
Redbelly Network, accessed 2026-10-25  
https://docs.redbelly.network/pages/eligibility-sdk/eligibility-sdk/  
Supports: The Eligibility SDK uses Privado ID and Iden3 zero-knowledge proofs; Averer's issuer DIDs are network specific.

Quoted phrases checked on the live page:
- "verify investor eligibility using Privado ID and the Iden3 zero-knowledge proof ecosystem"
- "did:receptor:redbelly:mainnet:31AAH8sSaGd6fpnG1TcB6yQ4UZnNeyHzTk5aM2P7rjv"
- "did:receptor:redbelly:testnet:31K82iKCtE6ciDc7oAr3T5EpjZb4S1EFM7c4xJaWkM2"

Cited in: Credentials and assets across chains

**S20. Configure Eligibility Criteria (Redbelly documentation)**  
Redbelly Network, accessed 2026-10-25  
https://docs.redbelly.network/pages/eligibility-sdk/configure-eligibility-criteria/  
Supports: Supported query types (on-chain single query only; multi query planned); credential types including AML/CTF and Australian sophisticated or wholesale investor; revocation checks should stay on.

Quoted phrases checked on the live page:
- "On-chain Single Query"
- "On-chain Multi Query"
- "AUSophisticatedWholesaleInvestorCredential"
- "AMLCTFCredential"
- "Verifiers should keep revocation checks enabled for production and mainnet flows"

Cited in: Credentials and assets across chains

**S21. Redbelly Network environments (Vine developer portal)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/environments/  
Supports: Mainnet chain ID 151 and Testnet chain ID 153 with public RPC URLs; Ankr and Uniblock listed as third-party public RPC providers for Mainnet.

Quoted phrases checked on the live page:
- "https://governors.mainnet.redbelly.network"
- "Chain ID: 151"
- "Chain ID: 153"
- "https://rpc.ankr.com/redbelly_mainnet"
- "Uniblock requires an API key on the x-api-key header for this endpoint."

Cited in: The answer on one page; Redbelly, in the terms that matter here; What we tested ourselves; Can Redbelly connect now?; What a connection would take; What would change the answer

**S22. DBFT and super block: security, finality and scalability (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/consensus/  
Supports: DBFT is leaderless, tolerates fewer than a third faulty nodes, gives deterministic finality in seconds and cannot fork.

Quoted phrases checked on the live page:
- "DBFT is a leaderless consensus algorithm"
- "DBFT can tolerate faults up to t < n/3"
- "transactions can be deterministically finalised in a matter of seconds"
- "Redbelly blockchain cannot fork"

Cited in: Redbelly, in the terms that matter here; What we tested ourselves; What it could offer institutions

**S23. EVM compatibility (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/consensus/evm-compatibility/  
Supports: Redbelly is EVM compatible; EVM version Prague; Solidity v0.8.30.

Quoted phrases checked on the live page:
- "Redbelly is compatible with the Ethereum Virtual Machine (EVM) and can execute smart contracts written for the EVM."
- "Prague"
- "v0.8.30"

Cited in: The answer on one page; Redbelly, in the terms that matter here; Glossary

**S24. Network fees (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/network-fees/  
Supports: Gas is priced in fixed US dollar terms using an on-chain oracle; a simple native transaction costs US$0.01 in gas.

Quoted phrases checked on the live page:
- "the unit price of gas remains fixed in US$ terms"
- "The gas model ensures that a simple native transaction on Redbelly costs US$0.01."
- "Redbelly implements an on chain, distributed oracle solution"

Cited in: Redbelly, in the terms that matter here; What a connection would take; What it could offer institutions

**S25. Identity and participation on the network (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/identity/  
Supports: All participants must prove who they are before gaining access; users claim an access credential from an accredited issuer before self-enabling write access; business verification exists.

Quoted phrases checked on the live page:
- "all network participants MUST prove they are who they say they are before gaining access"
- "Before users can self-enable their accounts with write access to the network, they must claim an access credential from a network accredited issuer."

Cited in: The answer on one page; Redbelly, in the terms that matter here; Can Redbelly connect now?; What a connection would take; What it could offer institutions; Credentials and assets across chains; Not possible yet, and unknown

**S26. User access (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/identity/user-access/  
Supports: Write access is enabled through a specific network smart contract after a passport and biometric check with an accredited issuer.

Quoted phrases checked on the live page:
- "self enable their account with write access to the network through a specific network smart contract"
- "prove they possess a valid photo identity document (passport) which is verified via biometric checks"

Cited in: Redbelly, in the terms that matter here

**S27. Accredited issuers (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/identity/accredited-issuers/  
Supports: Accredited issuers onboard users and businesses and are listed in an on-chain registry; business onboarding needs an onboarded officeholder.

Quoted phrases checked on the live page:
- "All accredited issuers are listed in an on chain registry."
- "0x2d68f1C50a057a310EeF28DF3199F95A65cE4ac5"
- "For businesses at least one officeholder must have onboarded as a user"

Cited in: Redbelly, in the terms that matter here; Glossary

**S28. Eligibility on Redbelly (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/identity/eligibility/  
Supports: Eligibility checks can restrict smart contract functions to users who prove they meet criteria; developers choose which issuers they trust.

Quoted phrases checked on the live page:
- "Eligibility criteria checks can be used to ensure that only users that can prove they meet the criteria can interact with a smart contract's functions."
- "A developer will also need to determine which issuers they trust"

Cited in: What a connection would take; What it could offer institutions; Credentials and assets across chains

**S29. Business verification (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/business-verification/  
Supports: Businesses prove they are incorporated to an accredited issuer.

Quoted phrases checked on the live page:
- "To be verified, businesses need to prove they are an incorporated entity to a network accredited issuer."

Cited in: Redbelly, in the terms that matter here; What a connection would take

**S30. Redbelly Access (official access dApp)**  
Redbelly Network, accessed 2026-10-25  
https://access.redbelly.network/  
Supports: Averer is the accredited issuer that verifies identity; more accounts can be connected to one identity; Testnet access is offered after verification.

Quoted phrases checked on the live page:
- "Your identity will be verified by an accredited issuer, Averer."
- "you will be offered the option to add more accounts which will be connected to your identity"
- "you will be offered the option to create a Testnet account too"

Cited in: Redbelly, in the terms that matter here; Credentials and assets across chains

**S31. Becoming a node operator (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/nodes/become-operator/  
Supports: Node operators need network access and selection; submissions are currently closed.

Quoted phrases checked on the live page:
- "Node operators MUST have network access for 2 accounts"
- "Submissions currently closed"

Cited in: Redbelly, in the terms that matter here; Can Redbelly connect now?

**S32. Redbelly Network native currency (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/native-currency/  
Supports: RBNT routes listed: Base via LayerZero, Ethereum via Polymer; Lucid Labs Bridge to bring RBNT back to Redbelly.

Quoted phrases checked on the live page:
- "Base (Via LayerZero)"
- "Ethereum mainnet* (Via Polymer)"
- "To bring RBNT from a non-Redbelly chain to Redbelly, use Lucid Labs Bridge"

Cited in: Redbelly, in the terms that matter here

## Tokeniser

**S39. Tokeniser (home and FAQ)**  
Tokeniser Pty Ltd, accessed 2026-10-25  
https://tokeniser.com/  
Supports: Tokeniser runs on Redbelly with identity and eligibility built into the protocol; eligibility is programmed into every asset and every transfer is checked; Tokeniser offers an API and MCP.

Quoted phrases checked on the live page:
- "Tokeniser operates on Redbelly Network, Australia's public digital token infrastructure, with identity and eligibility built into the protocol."
- "Tokeniser programs eligibility into every asset at the protocol level: identity, KYC, AML, CTF, wholesale and sophisticated investor tests, and TMD."
- "Every holder is verified and every transfer checked against the asset's rules, automatically."
- "Our API and MCP let you integrate Tokeniser with your existing registry"

Cited in: What it could offer institutions; Credentials and assets across chains

**S40. Tokeniser technology**  
Tokeniser Pty Ltd, accessed 2026-10-25  
https://tokeniser.com/technology  
Supports: Eligibility, identity and TMD enforced at the point of transfer; Averer provides identity and wallet; Tokeniser's statement on connecting to other networks.

Quoted phrases checked on the live page:
- "Eligibility, identity and your target market determination are enforced at the point of transfer, every time."
- "Identity and the AI-native wallet. Verifiable credentials gate every holder"
- "Full EVM compatibility gives connection to more than 150 networks out of the box, with permissioned or permissionless access as your mandate allows."

Cited in: Credentials and assets across chains; Glossary

**S41. Tokeniser: Automated compliance**  
Tokeniser Pty Ltd, accessed 2026-10-25  
https://tokeniser.com/product/superpowers/automated-compliance  
Supports: Trades that fail an eligibility check do not proceed, and every check is logged.

Quoted phrases checked on the live page:
- "Trades that fail a check do not proceed, and every check is logged."

Cited in: Credentials and assets across chains

**S42. Tokeniser: Secondary transfer**  
Tokeniser Pty Ltd, accessed 2026-10-25  
https://tokeniser.com/product/superpowers/secondary-transfer  
Supports: Ownership and payment are exchanged in a single step between eligible investors.

Quoted phrases checked on the live page:
- "When two eligible investors agree to a transfer, ownership and payment are exchanged in a single step."

Cited in: Credentials and assets across chains

**S43. Tokeniser: Collateral mobility**  
Tokeniser Pty Ltd, accessed 2026-10-25  
https://tokeniser.com/product/superpowers/collateral-mobility  
Supports: Units pledged as collateral remain locked until the loan is repaid; the issuer approves lenders.

Quoted phrases checked on the live page:
- "You approve the lenders and set the terms. Investors pledge units as security, and the units remain locked until the loan is repaid."

Cited in: Credentials and assets across chains

## Existing bridges and wrapped RBNT

**S33. LayerZero bridged tokens (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/bridged-tokens/layerzero/  
Supports: Tokens on Redbelly that can be bridged via LayerZero using Stargate, including RBNT, USDT0, AUDF and WETH.

Quoted phrases checked on the live page:
- "Tokens on Redbelly Network that can be bridged to other chains via LayerZero, using Stargate, and vice versa."
- "AUDF"

Cited in: Redbelly, in the terms that matter here

**S34. Lucid Labs bridged tokens (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/bridged-tokens/lucidlabs/  
Supports: Lucid Labs is powered by Polymer and LayerZero; it lists WRBNT on Ethereum at 0xb45f...bF13.

Quoted phrases checked on the live page:
- "Powered by Polymer and LayerZero."
- "0xb45fFB51984d626Ee758b336C61Cf20990c6bF13"

Cited in: Redbelly, in the terms that matter here; Credentials and assets across chains

**S35. Celer cBridge bridged tokens (Vine)**  
Redbelly Network, accessed 2026-10-25  
https://vine.redbelly.network/bridged-tokens/celer/  
Supports: Through Celer, RBNT bridges out from Redbelly to Ethereum and BNB Chain, not back; Celer's wRBNT on Ethereum is a different contract.

Quoted phrases checked on the live page:
- "RBNT bridges out from Redbelly to Ethereum and BNB Chain, not back."
- "0x063a1D5BFEAb213c9c12f47b704fccf81D60983e"

Cited in: Redbelly, in the terms that matter here; Credentials and assets across chains

**S36. Celer Announces cBridge Support for Redbelly**  
Celer Network, 2025-08-01  
https://blog.celer.network/2025/08/01/celer-announces-cbridge-support-for-redbelly/  
Supports: cBridge connects Ethereum, BNB Chain and Redbelly with a pegged bridge; the listed directions put USDT, USDC, WBTC and ETH into Redbelly and RBNT out of it.

Quoted phrases checked on the live page:
- "Celer is supporting asset and token bridging initially via a pegged bridge method"
- "USDT, USDC, WBTC, ETH"
- "Redbelly → Ethereum"

Cited in: Redbelly, in the terms that matter here

**S37. Redbelly Network on X: Wrapped RBNT live on Ethereum Mainnet**  
Redbelly Network, 2025-02-14  
https://x.com/RedbellyNetwork/status/1890340030197166112  
Supports: Redbelly announced Wrapped RBNT on Ethereum with official contract 0xb45ffb51984d626ee758b336c61cf20990c6bf13, powered by Router Protocol's Nitro.

Quoted phrases checked on the live page:
- "Wrapped RBNT Token is now live on Ethereum Mainnet."
- "0xb45ffb51984d626ee758b336c61cf20990c6bf13"

Cited in: Redbelly, in the terms that matter here

**S38. Deployed Endpoints, Message Libraries, and Executors (LayerZero V2)**  
LayerZero, accessed 2026-10-25  
https://docs.layerzero.network/v2/deployments/deployed-contracts  
Supports: Redbelly Mainnet (chain ID 151) is listed among LayerZero V2 deployments.

Quoted phrases checked on the live page:
- "Redbelly Mainnet"

Cited in: Redbelly, in the terms that matter here

## Redbelly DAO community work

**S44. TASK-08 Existing Bridge Integration Guide (winning entry archive)**  
Redbelly DAO Community Task Board, accessed 2026-10-25  
https://github.com/Redbelly-DAO-Community-Taskboard/TASK-08-bridge-integration-guide  
Supports: A working lock-and-mint testnet bridge from Ethereum Sepolia to Redbelly Testnet secured by a 2-of-3 relayer set.

Quoted phrases checked on the live page:
- "Secured by a 2-of-3 multisig relayer network."
- "lock-and-mint bridge"

Cited in: Redbelly, in the terms that matter here; Glossary

**S45. Redbridge testnet demo (TASK-08)**  
Redbelly DAO community, accessed 2026-10-25  
https://redbridge.test-hub.xyz/  
Supports: Live testnet demo: lock ETH on Sepolia and receive WETH.rb on Redbelly Testnet.

Quoted phrases checked on the live page:
- "Lock ETH on Ethereum Sepolia and receive WETH.rb 1:1 on Redbelly Testnet."

Cited in: Redbelly, in the terms that matter here

**S46. redbelly-testnet-bridge: article (TASK-08 community entry)**  
Redbelly DAO community, accessed 2026-10-25  
https://github.com/tycayomide/redbelly-testnet-bridge/blob/main/ARTICLE.md  
Supports: Unverified wallets cannot send any Testnet transaction; Mainnet and Testnet approvals are separate; LayerZero is live on Mainnet but not Testnet.

Quoted phrases checked on the live page:
- "Sender not authorised to write transactions"
- "Mainnet and Testnet approvals are separate."

Cited in: Redbelly, in the terms that matter here; What we tested ourselves

**S47. TASK-16 Unstick Your RBNT: Cross-Chain Recovery Playbook (winning entry archive)**  
Redbelly DAO Community Task Board, accessed 2026-10-25  
https://github.com/Redbelly-DAO-Community-Taskboard/TASK-16-cross-chain-recovery-playbook  
Supports: Archived DAO playbook for recovering stuck cross-chain RBNT (the deliverable PDF in the repository covers Polymer transfers to Ethereum that must be claimed by hand).

Quoted phrases checked on the live page:
- "Unstick Your RBNT: Cross-Chain Recovery Playbook"

Cited in: Redbelly, in the terms that matter here; Credentials and assets across chains

**S48. TASK-29 brief: Quant Overledger and Redbelly Interoperability Research**  
Redbelly DAO Community Task Board, accessed 2026-10-25  
https://taskboard.redbellydao.network/tasks/TASK-29  
Supports: Redbelly and Quant have no announced partnership or talks; Redbelly has not published an official position on bridging.

Quoted phrases checked on the live page:
- "Redbelly and Quant have no announced partnership or talks"
- "Redbelly has not published an official position on bridging"

Cited in: Read this first; Not possible yet, and unknown; What would change the answer

## Live checks run for this report

**S49. Live checks against Redbelly RPC and the Overledger gateway (this report)**  
This report, scripts/probe.mjs, 2026-10-25  
evidence/live-checks.json  
Supports: Results of 22 reproducible checks: chain IDs, supported methods, block tags, refusal of an unverified write, presence of common contracts, and Overledger endpoints that need an account.

Cited in: The answer on one page; What we tested ourselves; Can Redbelly connect now?; What a connection would take; Not possible yet, and unknown
