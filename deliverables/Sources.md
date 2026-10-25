# Source list

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
