# Could Redbelly plug into Quant's Overledger? The short version

**This is feasibility research, not news.** Redbelly and Quant have no announced partnership or talks [S48](https://taskboard.redbellydao.network/tasks/TASK-29). Redbelly has not published a position on bridging [S48](https://taskboard.redbellydao.network/tasks/TASK-29). Nothing here is a plan, a prediction or investment advice.

**Why people are asking.** On 24 September 2026 The Clearing House picked Quant to power its On-Chain Money Initiative, a network for US banks to settle tokenised deposits, expected in the first half of 2027 [S01](https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative). Quant's Overledger is the platform its documentation describes for connecting blockchains [S05](https://docs.overledger.dev/docs/start-here).

**Is Redbelly connected today?** No. Redbelly is not named in the Overledger documentation we reviewed [S07](https://docs.overledger.dev/docs/connectors) [S11](https://docs.overledger.dev/docs/fusion-rollup). We also read Overledger's live network list with an account: 59 networks, all but one of them test networks, and Redbelly is not among them [S50](evidence/overledger-account-checks.json).

**Could it connect?** A thin link looks possible on paper. Overledger lets accounts add new EVM networks themselves [S07](https://docs.overledger.dev/docs/connectors). Redbelly is EVM compatible [S23](https://vine.redbelly.network/consensus/evm-compatibility/), and a Redbelly endpoint is already offered by Ankr, a provider on Overledger's approved list [S07](https://docs.overledger.dev/docs/connectors) [S21](https://vine.redbelly.network/environments/). That would let Overledger read Redbelly and carry transactions that verified Redbelly accounts have signed. It is untested, and Quant decides whether a chain that anyone can read but only verified accounts can write belongs on that self-serve route [S06](https://docs.overledger.dev/docs/overview) [S07](https://docs.overledger.dev/docs/connectors).

**What we found when we tested.** Redbelly refused a transaction from a new, unverified wallet, as designed [S49](evidence/live-checks.json). It does not support `net_version`, a method Overledger keeps for older wallets and tools [S11](https://docs.overledger.dev/docs/fusion-rollup), and Permit2, which Overledger's payment feature relies on, is not deployed on Redbelly [S49](evidence/live-checks.json) [S12](https://docs.overledger.dev/docs/flow-apps). These are small, concrete items an engineer would need to check.

**What would take Quant's involvement.** Quant-held signing, Overledger workflows and moving assets through Quant's Fusion Rollup all need Quant to support Redbelly [S09](https://docs.overledger.dev/docs/signing) [S11](https://docs.overledger.dev/docs/fusion-rollup) [S12](https://docs.overledger.dev/docs/flow-apps). None of that is possible today.

**What it could offer institutions.** One integration point for institutions already using Overledger [S05](https://docs.overledger.dev/docs/start-here), and workflows that tie a step on Redbelly to steps elsewhere [S12](https://docs.overledger.dev/docs/flow-apps) [S14](https://docs.overledger.dev/reference/subscribeevent). Redbelly's own properties, such as verified counterparties, fast deterministic finality and fees fixed in US dollar terms, would stay the same [S22](https://vine.redbelly.network/consensus/) [S24](https://vine.redbelly.network/network-fees/) [S25](https://vine.redbelly.network/identity/).

**The big caveat: compliance does not travel by default.** Receptor credentials and Tokeniser's rules are checked on Redbelly, at the moment of transfer [S17](https://docs.redbelly.network/pages/methods/proof-by-query/) [S40](https://tokeniser.com/technology). A copy of an asset on another chain follows that chain's rules unless a connection is designed to carry Redbelly's checks with it. The safest pattern is to keep the asset on Redbelly and move instructions, not tokens.

**Still unknown.** Whether Overledger's mainnet lists different networks, how Quant would classify Redbelly, whether Overledger's health check would accept a Redbelly node, whether TCH's bank network would connect to any public chain, and whether Receptor checks can run on other chains.

Full report, every source and the scripts to re-check every claim are in the repository.

## Sources

- S01: The Clearing House Partners with Quant to Advance the On-Chain Money Initiative. https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative
- S05: Start Here (Overledger documentation). https://docs.overledger.dev/docs/start-here
- S06: Overview (Overledger documentation). https://docs.overledger.dev/docs/overview
- S07: Connectors (Overledger documentation). https://docs.overledger.dev/docs/connectors
- S09: Signing (Overledger documentation). https://docs.overledger.dev/docs/signing
- S11: Fusion Rollup (Overledger documentation). https://docs.overledger.dev/docs/fusion-rollup
- S12: Flow Apps (Overledger documentation). https://docs.overledger.dev/docs/flow-apps
- S14: Subscribe to a specific contract event signature (Overledger API reference). https://docs.overledger.dev/reference/subscribeevent
- S17: Proof by Query (Redbelly documentation). https://docs.redbelly.network/pages/methods/proof-by-query/
- S21: Redbelly Network environments (Vine developer portal). https://vine.redbelly.network/environments/
- S22: DBFT and super block: security, finality and scalability (Vine). https://vine.redbelly.network/consensus/
- S23: EVM compatibility (Vine). https://vine.redbelly.network/consensus/evm-compatibility/
- S24: Network fees (Vine). https://vine.redbelly.network/network-fees/
- S25: Identity and participation on the network (Vine). https://vine.redbelly.network/identity/
- S40: Tokeniser technology. https://tokeniser.com/technology
- S48: TASK-29 brief: Quant Overledger and Redbelly Interoperability Research. https://taskboard.redbellydao.network/tasks/TASK-29
- S49: Live checks against Redbelly RPC and the Overledger gateway (this report). evidence/live-checks.json
- S50: Account-level checks through an Overledger account (this report). evidence/overledger-account-checks.json
