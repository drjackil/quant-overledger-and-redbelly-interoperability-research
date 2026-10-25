---
title: X thread
note: Eight posts. Links count as 23 characters on X. Checked by npm run lint.
---

1/ Could Redbelly plug into Quant's Overledger?

Not connected today: Overledger's live network list, read with an account, has 59 networks and no Redbelly. A thin link looks possible on paper.

Feasibility research only. No partnership or talks announced.

2/ Why now: The Clearing House picked Quant to power its On-Chain Money Initiative, a tokenised deposit network for US banks expected in the first half of 2027.

https://www.theclearinghouse.org/payment-systems/Articles/2026/09/The-Clearing-House-Partners-with-Quant-to-Advance-the--On-Chain-Money-Initiative

3/ How chains join Overledger: public EVM networks can be added self-serve with one API call. Gated or permissioned networks go through Quant's team.

Redbelly is EVM, but only verified accounts can write. Which route it fits is Quant's call.

https://docs.overledger.dev/docs/connectors

4/ One detail that helps: Overledger only accepts shared nodes from approved providers, and Ankr is on that list. Redbelly's developer portal lists an Ankr mainnet endpoint.

https://vine.redbelly.network/environments/

5/ What our live checks found:
Unverified wallet: write refused, as designed.
net_version: not supported.
Permit2: not deployed.
Overledger network list, read with an account: no Redbelly.

Small items, but an engineer would need to check each.

6/ The big caveat: compliance does not travel by default. Receptor proofs and Tokeniser transfer rules run on Redbelly. A wrapped copy elsewhere follows that chain's rules.

Safest pattern: keep the asset on Redbelly, move instructions.

https://tokeniser.com/technology

7/ Still unknown: how Quant would classify Redbelly, whether Overledger's health check accepts a Redbelly node, whether the bank network would touch any public chain, and whether Receptor checks can run elsewhere.

8/ Every claim in the report links to its source, and the repository includes scripts that re-check every link, every quoted phrase and every live test.

No price talk, no predictions. Just what is confirmed, what is analysis and what is unknown.
