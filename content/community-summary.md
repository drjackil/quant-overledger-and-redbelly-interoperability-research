---
title: Could Redbelly plug into Quant's Overledger? The short version
---

**This is feasibility research, not news.** Redbelly and Quant have no announced partnership or talks [S48]. Redbelly has not published a position on bridging [S48]. Nothing here is a plan, a prediction or investment advice.

**Why people are asking.** On 24 September 2026 The Clearing House picked Quant to power its On-Chain Money Initiative, a network for US banks to settle tokenised deposits, expected in the first half of 2027 [S01]. Quant's Overledger is the platform its documentation describes for connecting blockchains [S05].

**Is Redbelly connected today?** No. Redbelly is not named in the Overledger documentation we reviewed [S07, S11]. We also read Overledger's live network list with an account: 59 networks, all but one of them test networks, and Redbelly is not among them [S50].

**Could it connect?** A thin link looks possible on paper. Overledger lets accounts add new EVM networks themselves [S07]. Redbelly is EVM compatible [S23], and a Redbelly endpoint is already offered by Ankr, a provider on Overledger's approved list [S07, S21]. That would let Overledger read Redbelly and carry transactions that verified Redbelly accounts have signed. It is untested, and Quant decides whether a chain that anyone can read but only verified accounts can write belongs on that self-serve route [S06, S07].

**What we found when we tested.** Redbelly refused a transaction from a new, unverified wallet, as designed [S49]. It does not support `net_version`, a method Overledger keeps for older wallets and tools [S11], and Permit2, which Overledger's payment feature relies on, is not deployed on Redbelly [S49, S12]. These are small, concrete items an engineer would need to check.

**What would take Quant's involvement.** Quant-held signing, Overledger workflows and moving assets through Quant's Fusion Rollup all need Quant to support Redbelly [S09, S11, S12]. None of that is possible today.

**What it could offer institutions.** One integration point for institutions already using Overledger [S05], and workflows that tie a step on Redbelly to steps elsewhere [S12, S14]. Redbelly's own properties, such as verified counterparties, fast deterministic finality and fees fixed in US dollar terms, would stay the same [S22, S24, S25].

**The big caveat: compliance does not travel by default.** Receptor credentials and Tokeniser's rules are checked on Redbelly, at the moment of transfer [S17, S40]. A copy of an asset on another chain follows that chain's rules unless a connection is designed to carry Redbelly's checks with it. The safest pattern is to keep the asset on Redbelly and move instructions, not tokens.

**Still unknown.** Whether Overledger's mainnet lists different networks, how Quant would classify Redbelly, whether Overledger's health check would accept a Redbelly node, whether TCH's bank network would connect to any public chain, and whether Receptor checks can run on other chains.

Full report, every source and the scripts to re-check every claim are in the repository.
