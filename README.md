# Quant Overledger and Redbelly Interoperability Research

Submission for **TASK-29** on the Redbelly DAO Community Task Board. Using public evidence it asks three things: could Redbelly Network connect to Quant's Overledger, what would that take, and what could it offer institutions that use Redbelly. It also explains how Receptor credentials and Tokeniser assets would behave across chains, and where compliance could break.

> **Notice.** No partnership or talks between Redbelly and Quant have been announced, and nothing here implies any. Redbelly has no public stance on bridging, so points without a public source are marked unknown. No price talk, no investment advice.

## The answer in brief

- **No connection today.** Overledger's documentation never mentions Redbelly. Read with an account on 25 October 2026, Overledger's live network list held 59 networks (all but one of them test networks) and none of them is Redbelly.
- **A thin link looks possible on paper, and is untested.** Overledger lets accounts add new EVM networks through self-serve. Redbelly is EVM compatible, and Ankr, a provider on Overledger's approved list, already serves Redbelly Mainnet. Quant decides whether a chain that anyone can read but only verified accounts can write belongs on that route.
- **Anything deeper needs Quant.** Quant-held signing, Flow App workflows and moving assets through Fusion Rollup are not possible yet.
- **The rules stay on Redbelly.** Receptor and Tokeniser enforce their checks on Redbelly. A copy on another chain obeys that chain instead, unless the link carries the checks across.
- **Small, concrete gaps found by live checks:** Redbelly does not serve `net_version`, its `safe` block tag lags `finalized`, Permit2 is not deployed, and an unverified sender is refused as designed.

The report and the source list link each of these points to its evidence.

## Deliverables

| Required by the task | Where it is |
|---|---|
| 1. The report (Word file or PDF) | [`deliverables/Overledger-Redbelly-Feasibility-Report.pdf`](deliverables/Overledger-Redbelly-Feasibility-Report.pdf) and [`.docx`](deliverables/Overledger-Redbelly-Feasibility-Report.docx), plus a [Markdown copy](deliverables/Overledger-Redbelly-Feasibility-Report.md). Also published as the website in `site/`. |
| 2. A short community summary | [`deliverables/Community-Summary.md`](deliverables/Community-Summary.md) (a few paragraphs) and [`deliverables/X-Thread.txt`](deliverables/X-Thread.txt) (8 posts, each within 280 characters), with three 1600 by 900 share cards in `site/assets/img/`. |
| 3. A source list with a link for every factual claim | [`deliverables/Sources.md`](deliverables/Sources.md) and [`deliverables/Sources.csv`](deliverables/Sources.csv): 49 sources, the exact phrases each one supports, and where each is cited. |

## How the claims are verified

Every external source has the exact phrases we rely on recorded in `content/sources.json`. Three commands re-check the work:

| Command | What it does | Network |
|---|---|---|
| `npm run lint` | Every Confirmed statement cites a source, every citation resolves, every source is used, the thread fits X, and the text has no partnership wording, price talk, personal credit, dashes or emoji. | offline |
| `npm run verify:sources` | Loads all 48 external links and confirms each recorded phrase is still on the page. Writes `evidence/source-check.json`. | online |
| `npm run probe` | Repeats 22 live checks against Redbelly's public RPC and Overledger's gateway. No credentials. The only write is a zero-value transaction from a new, unfunded key, which Redbelly refuses. Writes `evidence/live-checks.json`. | online |
| `npm test` | Runs the lint plus checks on the built site: every internal link and anchor resolves, every asset exists, every citation chip points at a listed source, the downloads exist. | offline |

Last results are shown on the website's Verification page and stored in `evidence/`.

## Account-level checks (optional, needs access)

Three checks cannot be made with public access, so they are packaged separately. Run them from the repository folder.

| Command | What it does | Needs |
|---|---|---|
| `OVERLEDGER_API_KEY=fk_... npm run probe:account` | Stage 1, read-only: the live Overledger network list, whether Redbelly is in it, and Fusion's connected networks | An Overledger API key from Quant Connect |
| `... npm run probe:account -- --node-test` | Stage 2: sends test calls through Overledger to a Redbelly Testnet node, then deletes the node. Prefer a node made private in the Quant Connect form, passed as `NODE_ID=...` | Same key |
| `... REDBELLY_TESTNET_PRIVATE_KEY=0x... npm run probe:account -- --node-test --write` | Stage 3: one zero-value self-transfer on Redbelly Testnet through Overledger | A Redbelly-verified testnet address |

Keys are never written to disk. Results go to `evidence/overledger-account-checks.json`; `npm run build` then turns them into the report's "Account-level checks" section. Without that file the section says the checks have not been run.

## Repository layout

```
content/          single source of truth
  report.md       the report, with Confirmed / Analysis / Unknown panels and [Sxx] citations
  community-summary.md
  x-thread.md
  sources.json    49 sources, what each supports, and the phrases checked on the live page
scripts/          build, render, lint, verify-sources, probe, test-site
evidence/         results of the last source check and live checks
deliverables/     PDF, Word, Markdown, thread, source list (generated)
site/             static website, ready to deploy (generated pages plus assets)
```

## Build

Requires Node.js 20 or later.

```bash
npm install
npm run build        # site pages, Markdown, CSV, then PDF, Word file, figures and share cards
npm test             # offline checks
npm run test:online  # re-check every source link and phrase, and repeat the live checks
```

The PDF, figures and cards are rendered with headless Chromium through Playwright. If Chromium is not installed, run `npx playwright install chromium` once.

## Deploy

`site/` is a plain static site with no build step at request time.

- **Vercel:** import the repository. `vercel.json` sets the output directory to `site` and adds security headers. No build command is needed because the generated files are committed.
- **Any static host:** serve the `site/` folder. Locally: `npm run serve` and open http://localhost:8080.

## Design

The website, PDF and cards follow the Redbelly DAO Task Board brand kit ("Kinetic Consensus"): slate surfaces, the single brand red `#EF5350`, Be Vietnam Pro for prose and JetBrains Mono only for machine values, 4px and 8px radii, tonal depth with no drop shadows, status shown as a dot plus a monospace label, a dark theme by default with the light counterpart, and a dated "last verified" line on graphics that carry facts which expire. Motion is limited to the hero and the figures, and switches off for print and for anyone who prefers reduced motion. Fonts are self-hosted under the SIL Open Font License.

## Rights

Submitted under the Redbelly DAO Community Task Board participation terms. Third-party marks and quoted material belong to their owners and are cited to their sources.
