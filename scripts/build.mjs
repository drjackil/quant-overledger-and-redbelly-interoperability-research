// Builds the website (site/), the print layout used for the PDF (build/print.html) and the
// Markdown, text and CSV deliverables (deliverables/) from the files in content/.

import { writeFileSync, mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ROOT, read, readJson, parseDoc, makeMarked, loadSources, loadEvidence, tokens, fill, esc,
  PANEL_LABELS, DIAGRAMS, citedIds, parseThread, frontMatter
} from './lib/content.mjs';

const SITE = join(ROOT, 'site');
const BUILD = join(ROOT, 'build');
const OUT = join(ROOT, 'deliverables');
for (const d of [SITE, BUILD, OUT, join(SITE, 'evidence'), join(SITE, 'downloads')]) mkdirSync(d, { recursive: true });

const sources = loadSources();
const { live, src } = loadEvidence();
const T = tokens();
const reportRaw = read('content/report.md');
const report = parseDoc(reportRaw);
const summaryRaw = read('content/community-summary.md');
const summary = parseDoc(summaryRaw);
const thread = parseThread(read('content/x-thread.md'));
const svg = (name) => readFileSync(join(SITE, 'assets/diagrams', `${name}.svg`), 'utf8');

const DOWNLOADS = [
  { file: 'Overledger-Redbelly-Feasibility-Report.pdf', label: 'Report (PDF)', note: 'A4, linked citations' },
  { file: 'Overledger-Redbelly-Feasibility-Report.docx', label: 'Report (Word)', note: 'editable, linked citations' },
  { file: 'Overledger-Redbelly-Feasibility-Report.md', label: 'Report (Markdown)', note: 'plain text copy' },
  { file: 'Community-Summary.md', label: 'Community summary', note: 'a few paragraphs' },
  { file: 'X-Thread.txt', label: 'X thread', note: `${thread.posts.length} posts, each under 280` },
  { file: 'Sources.csv', label: 'Source list (CSV)', note: `${sources.sources.length} sources with quotes` }
];

// Where each source is cited in the report, by section heading
const usedIn = {};
{
  let current = '';
  for (const n of report.nodes) {
    if (n.type === 'heading' && n.level === 2) current = n.text;
    if (n.md) for (const id of citedIds(n.md)) (usedIn[id] ||= new Set()).add(current);
  }
}

const srcCheck = src ? Object.fromEntries(src.results.map((r) => [r.id, r])) : {};
const checkedLine = (id) => {
  const s = sources.byId[id];
  if (s.internal) return live ? `Re-run with npm run probe. Last run ${T.PROBE_DATE}.` : '';
  const r = srcCheck[id];
  return r && r.ok ? `Link and ${r.quotes.length} quoted phrase${r.quotes.length === 1 ? '' : 's'} checked ${T.SOURCE_CHECK_DATE}` : '';
};

// ---------- shared HTML pieces ----------

const ICONS = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>'
};

const PAGES = [
  { href: 'index.html', label: 'Report' },
  { href: 'community.html', label: 'Community summary' },
  { href: 'sources.html', label: 'Sources' },
  { href: 'evidence.html', label: 'Verification' },
  { href: 'index.html#downloads', label: 'Downloads' }
];

function layout({ title, description, page, body, sourcesJson = false }) {
  const nav = PAGES.map((p) => `<a href="${p.href}"${p.href === page ? ' aria-current="page"' : ''}>${p.label}</a>`).join('');
  const srcData = sourcesJson ? `<script>window.__SOURCES__=${JSON.stringify(Object.fromEntries(sources.sources.map((s) => [s.id, {
    id: s.id, title: s.title, publisher: s.publisher, date: s.date, url: s.url, supports: s.supports, internal: !!s.internal,
    quote: (s.quotes || [])[0] || '', checked: checkedLine(s.id)
  }]))).replace(/</g, '\\u003c')};</script>` : '';
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#0c1317">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/brand/icon.png" type="image/png">
<link rel="preload" href="assets/fonts/be-vietnam-pro-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/be-vietnam-pro-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/site.css">
<script>try{if(localStorage.getItem('theme')==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <a class="brand" href="index.html" aria-label="Report home">
    <img class="logo-dark" src="assets/brand/dao-logo-on-dark.png" alt="Redbelly DAO" width="50" height="36">
    <img class="logo-light" src="assets/brand/dao-logo-on-light.png" alt="Redbelly DAO" width="50" height="36">
    <span class="brand-name">Overledger and Redbelly<small>TASK-29 RESEARCH</small></span>
  </a>
  <nav class="nav" id="nav" aria-label="Main">${nav}</nav>
  <button class="icon-btn" type="button" data-theme-toggle aria-label="Switch to light theme">${ICONS.sun}</button>
  <button class="icon-btn menu-btn" type="button" data-menu aria-controls="nav" aria-expanded="false" aria-label="Menu">${ICONS.menu}</button>
</header>
<div class="progress" aria-hidden="true"></div>
${body}
<footer class="site-footer">
  <div class="inner">
    <div>
      <img class="logo-dark" src="assets/brand/dao-logo-on-dark.png" alt="Redbelly DAO" width="56" height="40">
      <img class="logo-light" src="assets/brand/dao-logo-on-light.png" alt="Redbelly DAO" width="56" height="40">
      <p>Feasibility research for the Redbelly DAO Community Task Board, TASK-29. Redbelly and Quant have no announced partnership or talks. No price talk, no investment advice.</p>
      <p class="verified-line">Last verified ${esc(T.SOURCE_CHECK_DATE)}: ${esc(T.SOURCE_COUNT)} links, ${esc(T.QUOTE_COUNT)} quoted phrases, ${esc(T.PROBE_COUNT)} live checks.</p>
    </div>
    <nav aria-label="Footer">${PAGES.map((p) => `<a href="${p.href}">${p.label}</a>`).join('')}</nav>
  </div>
</footer>
<button class="icon-btn back-top" type="button" onclick="window.scrollTo({top:0})" aria-label="Back to top">${ICONS.up}</button>
${srcData}
<script src="assets/js/site.js" defer></script>
</body>
</html>
`;
}

const HERO_ART = `<svg class="hero-art" viewBox="0 0 560 380" role="img" aria-labelledby="hx-t">
  <title id="hx-t">Redbelly's leaderless node mesh on the left, Overledger's gateway on the right with chains attached, and a dashed, unconfirmed link between them.</title>
  <g class="hx-mesh">
    ${(() => {
      const pts = [[110, 120], [190, 90], [230, 170], [180, 250], [95, 230], [60, 170], [145, 175]];
      const lines = [];
      let k = 0;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) lines.push(`<line style="--i:${k++ % 7}" x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}"/>`);
      return lines.join('') + pts.map((p, i) => `<circle class="hx-node" style="--i:${i}" cx="${p[0]}" cy="${p[1]}" r="${i === 6 ? 11 : 9}"/>`).join('') + `<circle class="hx-node-core" cx="145" cy="175" r="4"/>`;
    })()}
  </g>
  <text class="hx-label" x="145" y="300" text-anchor="middle">REDBELLY</text>
  <text class="hx-small" x="145" y="318" text-anchor="middle">DBFT, LEADERLESS</text>
  <path id="hx-gap-path" class="hx-gap" d="M240 172 C 300 140, 340 140, 392 168"/>
  <g class="hx-q-g"><circle class="hx-q" cx="318" cy="150" r="16"/><text class="hx-q-t" x="318" y="156" text-anchor="middle">?</text></g>
  <circle class="hx-packet" r="5"><animateMotion dur="4.8s" repeatCount="indefinite" keyPoints="0;0.42;0.42;0" keyTimes="0;0.4;0.75;1" calcMode="spline" keySplines="0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1" path="M240 172 C 300 140, 340 140, 392 168"/></circle>
  ${[[440, 40], [528, 84], [548, 168], [524, 252]].map((p, i) => `<path class="hx-link" d="M440 168 L ${p[0]} ${p[1]}"/><circle class="hx-chain" cx="${p[0]}" cy="${p[1]}" r="13"/><circle class="hx-packet-out" r="3.5"><animateMotion dur="2.8s" begin="${(i * 0.6).toFixed(1)}s" repeatCount="indefinite" path="M440 168 L ${p[0]} ${p[1]}"/></circle>`).join('')}
  <polygon class="hx-gw" points="440,120 482,144 482,192 440,216 398,192 398,144"/>
  <polygon class="hx-link" points="440,146 459,157 459,179 440,190 421,179 421,157"/>
  <text class="hx-label" x="430" y="248" text-anchor="middle">OVERLEDGER</text>
  <text class="hx-small" x="430" y="266" text-anchor="middle">CHAINS IT REACHES</text>
</svg>`;

// ---------- report page ----------

function renderReportWeb() {
  const marked = makeMarked({ mode: 'web', sources });
  const sections = [];
  let cur = null;
  let n2 = 0;
  const toc = [];
  for (const node of report.nodes) {
    if (node.type === 'heading' && node.level === 2) {
      n2++;
      cur = { id: node.id, html: [] };
      sections.push(cur);
      toc.push({ id: node.id, text: node.text, n: n2 });
      cur.html.push(`<h2 id="${node.id}"><span class="sec-num">${String(n2).padStart(2, '0')}</span>${esc(node.text)}<a class="anchor" href="#${node.id}" aria-label="Link to this section">#</a></h2>`);
      continue;
    }
    if (!cur) continue;
    if (node.type === 'heading') cur.html.push(`<h3 id="${node.id}">${esc(node.text)}<a class="anchor" href="#${node.id}" aria-label="Link to this section">#</a></h3>`);
    else if (node.type === 'md') cur.html.push(marked.parse(node.md));
    else if (node.type === 'panel') cur.html.push(`<div class="panel panel-${node.kind} reveal" data-kind="${node.kind === 'live' ? 'confirmed' : node.kind}"><div class="panel-label"><span class="dot" aria-hidden="true"></span>${PANEL_LABELS[node.kind]}</div>${marked.parse(node.md)}</div>`);
    else if (node.type === 'diagram') cur.html.push(`<figure class="diagram" id="fig-${node.name}">${svg(node.name)}<figcaption>${esc(DIAGRAMS[node.name])}</figcaption></figure>`);
  }
  const wideIds = new Set(['answer', 'live-checks', 'connect-now', 'the-work', 'compliance', 'overledger', 'redbelly']);

  const srcList = sources.groups.map((g) => {
    const items = sources.sources.filter((s) => s.group === g.id).map((s) => `<div class="src" id="src-${s.id}">
      <div class="src-id">${s.id}</div>
      <div><p class="src-title">${esc(s.title)}</p>
      <p class="src-meta">${esc(s.publisher)}, ${esc(s.date)}</p>
      <a class="src-url" href="${esc(s.url)}"${s.internal ? '' : ' target="_blank" rel="noopener"'}>${esc(s.url)}</a></div></div>`).join('');
    return `<h3 class="src-group">${esc(g.title)}</h3>${items}`;
  }).join('');

  const downloads = DOWNLOADS.map((d) => `<a class="dl" href="downloads/${d.file}" download><b>${esc(d.label)}</b><span>${esc(d.note)}</span></a>`).join('');

  const body = `
<section class="hero">
  <div class="hero-inner">
    <div>
      <p class="eyebrow">Feasibility research, TASK-29</p>
      <h1>${esc(report.meta.title)}</h1>
      <p class="lede">${esc(report.meta.subtitle)}. Built only on public sources, with every claim linked and re-checked.</p>
      <div class="hero-meta"><span>CUT-OFF ${esc(report.meta.cutoff).toUpperCase()}</span><span>VERSION ${esc(report.meta.version)}</span><span>READ TIME ABOUT 30 MIN</span></div>
      <div class="actions">
        <a class="btn btn-primary" href="#answer">Read the answer ${ICONS.arrow}</a>
        <a class="btn btn-ghost" href="downloads/Overledger-Redbelly-Feasibility-Report.pdf" download>${ICONS.down} PDF</a>
        <a class="btn btn-ghost" href="community.html">Community summary</a>
      </div>
    </div>
    ${HERO_ART}
  </div>
</section>
<div class="notice-bar" style="margin-top:24px"><p><strong>No partnership, talks or plans.</strong> Redbelly and Quant have no announced partnership or talks. This is independent feasibility research, not news, and it contains no price talk or investment advice.</p></div>
<div class="layout">
  <aside class="toc" aria-label="Contents">
    <h2>Contents</h2>
    <ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}<li><a href="#sources">Source list</a></li><li><a href="#downloads">Downloads</a></li></ol>
  </aside>
  <main id="main">
    <div class="stats reveal">
      <div class="stat"><b data-count="${T.SOURCE_COUNT}">${T.SOURCE_COUNT}</b><span>public sources, every link checked</span></div>
      <div class="stat"><b data-count="${T.QUOTE_COUNT}">${T.QUOTE_COUNT}</b><span>quoted phrases re-found on live pages</span></div>
      <div class="stat"><b data-count="${T.PROBE_COUNT}">${T.PROBE_COUNT}</b><span>live checks against Redbelly and Overledger</span></div>
      <div class="stat"><b data-count="0">0</b><span>claims about talks or plans</span></div>
    </div>
    <div class="filters" role="group" aria-label="Highlight panels by label">
      <span class="filters-label">Highlight</span>
      <button class="filter f-confirmed" type="button" aria-pressed="false" data-kinds="confirmed"><span class="dot"></span>Confirmed</button>
      <button class="filter f-analysis" type="button" aria-pressed="false" data-kinds="analysis"><span class="dot"></span>Analysis</button>
      <button class="filter f-unknown" type="button" aria-pressed="false" data-kinds="unknown"><span class="dot"></span>Unknown</button>
    </div>
    <article class="report">
      ${sections.map((s) => `<section class="${wideIds.has(s.id) ? 'wide' : ''}" aria-labelledby="${s.id}">${s.html.join('\n')}</section>`).join('\n')}
      <section class="wide" aria-labelledby="sources">
        <h2 id="sources"><span class="sec-num">${String(n2 + 1).padStart(2, '0')}</span>Source list</h2>
        <p>Every citation chip in this report links here. Hover or tap a chip to see the quoted phrase from the source. The <a href="sources.html">full source list</a> shows every quoted phrase and where each source is used.</p>
        ${srcList}
      </section>
      <section class="wide" aria-labelledby="downloads">
        <h2 id="downloads"><span class="sec-num">${String(n2 + 2).padStart(2, '0')}</span>Downloads</h2>
        <p>The same report in other formats. All are generated from one source file, so they say the same thing.</p>
        <div class="downloads">${downloads}</div>
      </section>
    </article>
  </main>
</div>`;
  return layout({
    title: 'Overledger and Redbelly: feasibility research',
    description: 'Could Redbelly Network connect to Quant\'s Overledger, what would it take, and what could it offer institutions? A fully sourced feasibility report.',
    page: 'index.html', body, sourcesJson: true
  });
}

// ---------- community page ----------

function renderCommunity() {
  const marked = makeMarked({ mode: 'web', sources });
  const sumHtml = summary.nodes.map((n) => (n.md ? marked.parse(n.md) : '')).join('');
  const ids = [...citedIds(summaryRaw)].sort();
  const refs = ids.map((id) => { const s = sources.byId[id]; return `<li id="src-${id}"><span class="mono">${id}</span> ${esc(s.title)}. <a href="${esc(s.url)}"${s.internal ? '' : ' target="_blank" rel="noopener"'}>${esc(s.url)}</a></li>`; }).join('');
  const posts = thread.posts.map((p, i) => `<div class="post reveal"><div class="post-head"><span>POST ${i + 1} OF ${thread.posts.length}</span><button class="copy" type="button" data-copy="post-${i}">COPY</button></div><div id="post-${i}">${esc(p).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')}</div></div>`).join('');
  const body = `<main id="main" class="page">
  <p class="eyebrow">For the community</p>
  <h1>${esc(summary.meta.title)}</h1>
  <p class="lede">A plain language summary of the full report, ready to share. Every fact links to its source.</p>
  <div class="panel panel-notice"><div class="panel-label"><span class="dot"></span>Notice</div><p>Feasibility research only. Redbelly and Quant have no announced partnership or talks. No price talk, no investment advice.</p></div>
  <div class="prose">${sumHtml}</div>
  <h2>Sources for this summary</h2>
  <ul class="prose">${refs}</ul>
  <h2 id="thread">X thread</h2>
  <p class="lede">${thread.posts.length} posts. Each fits in 280 characters, counting links the way X does.</p>
  <div class="thread">${posts}</div>
  <h2>Share cards</h2>
  <p>1600 by 900 images for X, in the DAO brand, each carrying a dated "last verified" line.</p>
  <div class="cards">
    <img src="assets/img/x-card-1.png" alt="Card: Could Redbelly plug into Quant's Overledger? Not connected today. A thin link looks possible on paper. Anything deeper needs Quant." loading="lazy" width="1600" height="900">
    <img src="assets/img/x-card-2.png" alt="Card: four levels of connection, two untested, two not possible yet." loading="lazy" width="1600" height="900">
    <img src="assets/img/x-card-3.png" alt="Card: compliance does not travel by default." loading="lazy" width="1600" height="900">
  </div>
</main>`;
  return layout({ title: 'Community summary: Overledger and Redbelly', description: 'Plain language summary and X thread for the Overledger and Redbelly feasibility research.', page: 'community.html', body, sourcesJson: true });
}

// ---------- sources page ----------

function renderSources() {
  const groups = sources.groups.map((g) => {
    const items = sources.sources.filter((s) => s.group === g.id).map((s) => {
      const used = usedIn[s.id] ? [...usedIn[s.id]] : [];
      const quotes = (s.quotes || []).map((q) => `<li>${esc(q)}</li>`).join('');
      const r = srcCheck[s.id];
      const st = s.internal ? `<span class="status status-ok"><span class="dot"></span>reproducible: npm run probe</span>`
        : r ? `<span class="status status-${r.ok ? 'ok' : 'no'}"><span class="dot"></span>${r.ok ? `HTTP ${r.status}, ${r.quotes.length}/${r.quotes.length} phrases found` : 'check failed'}</span>` : '';
      return `<div class="src" id="src-${s.id}">
        <div class="src-id">${s.id}</div>
        <div>
          <p class="src-title">${esc(s.title)}</p>
          <p class="src-meta">${esc(s.publisher)}, ${esc(s.date)}</p>
          <a class="src-url" href="${esc(s.url)}"${s.internal ? '' : ' target="_blank" rel="noopener"'}>${esc(s.url)}</a>
          <p class="src-supports">${esc(s.supports)}</p>
          ${st}
          ${quotes ? `<details><summary>${s.quotes.length} quoted phrase${s.quotes.length === 1 ? '' : 's'} checked on the live page</summary><ul>${quotes}</ul></details>` : ''}
          ${used.length ? `<p class="used">Cited in: ${used.map(esc).join(' | ')}</p>` : ''}
        </div>
      </div>`;
    }).join('');
    return `<h2 class="src-group">${esc(g.title)}</h2>${items}`;
  }).join('');
  const body = `<main id="main" class="page">
  <p class="eyebrow">Deliverable 3</p>
  <h1>Source list</h1>
  <p class="lede">${sources.sources.length} sources. For each one: what it supports, the exact phrases we rely on, whether the link and phrases were still live at the last check, and where the report cites it.</p>
  <div class="src-tools"><input id="src-search" type="search" placeholder="Search sources, publishers or quoted phrases" aria-label="Search sources"><span id="src-count" class="mono">${sources.sources.length} shown</span></div>
  ${groups}
</main>`;
  return layout({ title: 'Source list: Overledger and Redbelly', description: 'Every source behind the Overledger and Redbelly feasibility report, with quoted phrases and check results.', page: 'sources.html', body });
}

// ---------- evidence page ----------

function renderEvidence() {
  const checks = (live?.checks || []).map((c) => `<li class="check"><span class="status status-${c.pass ? 'ok' : 'no'}"><span class="dot"></span>${c.pass ? 'PASS' : 'FAIL'}</span><b>${esc(c.title)}</b><small>${esc(c.request)} on ${esc(c.endpoint.replace(/^https:\/\//, ''))}. Expected: ${esc(c.expectation)}. ${esc(c.meaning)}</small><pre>${esc(JSON.stringify(c.response).slice(0, 320))}</pre></li>`).join('');
  const srcRows = (src?.results || []).map((r) => `<tr><td><a href="sources.html#src-${r.id}">${r.id}</a></td><td><span class="status status-${r.ok ? 'ok' : 'no'}"><span class="dot"></span>${r.ok ? 'PASS' : 'FAIL'}</span></td><td class="mono">${r.status}</td><td class="mono">${r.quotes.filter((q) => q.found).length}/${r.quotes.length}</td><td class="mono">${esc(r.method)}</td><td><a href="${esc(r.url)}" target="_blank" rel="noopener" class="mono" style="overflow-wrap:anywhere">${esc(r.url.replace(/^https:\/\//, ''))}</a></td></tr>`).join('');
  const body = `<main id="main" class="page">
  <p class="eyebrow">Verification</p>
  <h1>How every claim can be re-checked</h1>
  <p class="lede">The report is backed by three automated checks. Anyone can run them from the repository with Node.js 20 or later.</p>
  <div class="table-wrap"><table><thead><tr><th>Command</th><th>What it checks</th><th>Last result</th></tr></thead><tbody>
    <tr><td class="mono">npm run lint</td><td>Every confirmed panel cites a source, every citation exists, every source is used, the thread fits X, and the text has no partnership wording, price talk, personal credit, dashes or emoji.</td><td><span class="status status-ok"><span class="dot"></span>runs offline</span></td></tr>
    <tr><td class="mono">npm run verify:sources</td><td>Loads all ${T.SOURCE_COUNT} external links and confirms each of the ${T.QUOTE_COUNT} recorded phrases is still on the page.</td><td><span class="status status-${src && src.passed === src.total ? 'ok' : 'no'}"><span class="dot"></span>${src ? `${src.passed}/${src.total} on ${esc(T.SOURCE_CHECK_DATE)}` : 'not run'}</span></td></tr>
    <tr><td class="mono">npm run probe</td><td>Repeats the live checks against Redbelly's public RPC and Overledger's gateway. No credentials, cannot move funds.</td><td><span class="status status-${live && live.passed === live.total ? 'ok' : 'no'}"><span class="dot"></span>${live ? `${live.passed}/${live.total} on ${esc(T.PROBE_DATE)}` : 'not run'}</span></td></tr>
  </tbody></table></div>
  <h2 id="live">Live checks</h2>
  <p>Raw output: <a href="evidence/live-checks.json">evidence/live-checks.json</a>. The only write attempted is a zero-value transaction signed by a freshly generated, unfunded key, which Redbelly is expected to refuse.</p>
  <ul class="check-list">${checks}</ul>
  <h2 id="links">Source link and quote check</h2>
  <p>Raw output: <a href="evidence/source-check.json">evidence/source-check.json</a>. Pages are fetched as HTML first, then rendered in a headless browser if they need JavaScript.</p>
  <div class="table-wrap"><table><thead><tr><th>Source</th><th>Result</th><th>HTTP</th><th>Phrases</th><th>Method</th><th>Link</th></tr></thead><tbody>${srcRows}</tbody></table></div>
  <h2 id="limits">What was not tested</h2>
  <p>We did not open an Overledger account, call authenticated Overledger endpoints, register a node or complete any transaction. Statements about how Overledger would behave with Redbelly are labelled as analysis in the report.</p>
</main>`;
  return layout({ title: 'Verification: Overledger and Redbelly', description: 'Automated checks behind the Overledger and Redbelly feasibility report.', page: 'evidence.html', body });
}

function render404() {
  return layout({ title: 'Page not found', description: 'Page not found.', page: '', body: `<main id="main" class="page"><p class="eyebrow">404</p><h1>That page does not exist</h1><p class="lede">The link may be out of date. The report starts on the <a href="index.html">home page</a>.</p></main>` });
}

// ---------- print layout for the PDF ----------

function renderPrint() {
  const marked = makeMarked({ mode: 'print', sources });
  let n2 = 0;
  const toc = [];
  const parts = [];
  for (const node of report.nodes) {
    if (node.type === 'heading' && node.level === 2) {
      n2++;
      toc.push({ id: node.id, text: node.text, n: n2 });
      parts.push(`<h2 id="${node.id}"><span class="num">${String(n2).padStart(2, '0')}</span> ${esc(node.text)}</h2>`);
    } else if (node.type === 'heading') parts.push(`<h3 id="${node.id}">${esc(node.text)}</h3>`);
    else if (node.type === 'md') parts.push(marked.parse(node.md));
    else if (node.type === 'panel') parts.push(`<div class="panel panel-${node.kind}"><div class="panel-label"><span class="dot"></span>${PANEL_LABELS[node.kind]}</div>${marked.parse(node.md)}</div>`);
    else if (node.type === 'diagram') parts.push(`<figure class="diagram in">${svg(node.name)}<figcaption>${esc(DIAGRAMS[node.name])}</figcaption></figure>`);
  }
  const srcList = sources.groups.map((g) => `<h3>${esc(g.title)}</h3><ol class="srclist">${sources.sources.filter((s) => s.group === g.id).map((s) => `<li id="src-${s.id}"><b>${s.id}</b> ${esc(s.title)}. ${esc(s.publisher)}, ${esc(s.date)}.<br>${s.internal
    ? `Included with this report as ${esc(s.url)}. Reproduce with <code>npm run probe</code>. Endpoints queried: <a href="https://governors.mainnet.redbelly.network">governors.mainnet.redbelly.network</a>, <a href="https://governors.testnet.redbelly.network">governors.testnet.redbelly.network</a>, <a href="https://rpc.ankr.com/redbelly_mainnet">rpc.ankr.com/redbelly_mainnet</a>, <a href="https://fusion-rollup.quant.dev/health">fusion-rollup.quant.dev</a>.`
    : `<a href="${esc(s.url)}">${esc(s.url)}</a>`}<br><span class="supports">Supports: ${esc(s.supports)}</span></li>`).join('')}</ol>`).join('');
  return `<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><title>${esc(report.meta.title)}</title>
<link rel="stylesheet" href="../site/assets/css/site.css"><link rel="stylesheet" href="../scripts/print.css"></head>
<body data-theme="light">
<section class="cover">
  <img class="cover-logo" src="../site/assets/brand/dao-logo-on-dark.png" alt="Redbelly DAO">
  <p class="eyebrow">Feasibility research, Redbelly DAO Community Task Board, TASK-29</p>
  <h1>${esc(report.meta.title)}</h1>
  <p class="cover-sub">${esc(report.meta.subtitle)}.</p>
  <div class="cover-notice"><b>No partnership, talks or plans.</b> Redbelly and Quant have no announced partnership or talks. This report is independent feasibility research built on public sources. It contains no price talk and no investment advice.</div>
  <dl class="cover-meta">
    <div><dt>Research cut-off</dt><dd>${esc(report.meta.cutoff)}</dd></div>
    <div><dt>Version</dt><dd>${esc(report.meta.version)}</dd></div>
    <div><dt>Sources</dt><dd>${T.SOURCE_COUNT} links, ${T.QUOTE_COUNT} phrases checked</dd></div>
    <div><dt>Live checks</dt><dd>${T.PROBE_COUNT}, run ${esc(T.PROBE_DATE)}</dd></div>
  </dl>
  <div class="legend"><span class="lg lg-c">Confirmed</span><span class="lg lg-a">Analysis</span><span class="lg lg-u">Unknown</span></div>
</section>
<section class="contents"><h2 class="contents-h">Contents</h2><ol>${toc.map((t) => `<li><a href="#${t.id}"><span>${String(t.n).padStart(2, '0')}</span> ${esc(t.text)}</a></li>`).join('')}<li><a href="#sources"><span>${String(n2 + 1).padStart(2, '0')}</span> Source list</a></li></ol></section>
<main class="print-body">${parts.join('\n')}
<h2 id="sources"><span class="num">${String(n2 + 1).padStart(2, '0')}</span> Source list</h2>
<p>Each citation in the text links to the source below. Every external link and the quoted phrases it supports were checked on ${esc(T.SOURCE_CHECK_DATE)}.</p>
${srcList}
</main></body></html>`;
}

// ---------- Markdown, text and CSV deliverables ----------

function toMarkdown(doc, { numbered = true } = {}) {
  const cite = (txt) => txt
    .replace(/\[(S\d{2}(?:\s*,\s*S\d{2})*)\]/g, (m, ids) => ids.split(/\s*,\s*/).map((id) => {
      const s = sources.byId[id];
      return `[${id}](${s.internal ? s.url : s.url})`;
    }).join(' '))
    .replace(/\[\[(ok|part|no|unk):([^\]]+)\]\]/g, (m, k, t) => `**${t}**`);
  let n2 = 0;
  const out = [];
  for (const node of doc.nodes) {
    if (node.type === 'heading') {
      if (node.level === 2) n2++;
      out.push(`${'#'.repeat(node.level)} ${node.level === 2 && numbered ? `${n2}. ` : ''}${node.text}`);
    } else if (node.type === 'md') out.push(cite(node.md));
    else if (node.type === 'panel') out.push(`> **${PANEL_LABELS[node.kind]}**\n>\n${cite(node.md).split('\n').map((l) => `> ${l}`.trimEnd()).join('\n')}`);
    else if (node.type === 'diagram') out.push(`![${DIAGRAMS[node.name]}](figures/${node.name}.png)\n\n*${DIAGRAMS[node.name]}*`);
  }
  return out.join('\n\n');
}

function sourcesMarkdown() {
  const lines = [`# Source list`, '', `Quant Overledger and Redbelly Interoperability Research. ${sources.sources.length} sources, accessed ${sources.accessed}. Every external link and the quoted phrases below were re-checked on ${T.SOURCE_CHECK_DATE} with \`npm run verify:sources\`.`, ''];
  for (const g of sources.groups) {
    lines.push(`## ${g.title}`, '');
    for (const s of sources.sources.filter((x) => x.group === g.id)) {
      lines.push(`**${s.id}. ${s.title}**  `, `${s.publisher}, ${s.date}  `, `${s.url}  `, `Supports: ${s.supports}`);
      if (s.quotes?.length) { lines.push('', 'Quoted phrases checked on the live page:'); for (const q of s.quotes) lines.push(`- "${q}"`); }
      if (usedIn[s.id]) lines.push('', `Cited in: ${[...usedIn[s.id]].join('; ')}`);
      lines.push('');
    }
  }
  return lines.join('\n');
}

function sourcesCsv() {
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [['id', 'group', 'title', 'publisher', 'date', 'url', 'supports', 'quoted_phrases', 'cited_in', 'last_check']];
  for (const s of sources.sources) {
    const r = srcCheck[s.id];
    rows.push([s.id, sources.groups.find((g) => g.id === s.group).title, s.title, s.publisher, s.date, s.url, s.supports, (s.quotes || []).join(' | '), usedIn[s.id] ? [...usedIn[s.id]].join(' | ') : '', s.internal ? 'npm run probe' : r ? `${r.ok ? 'PASS' : 'FAIL'} ${src.checkedAt.slice(0, 10)}` : '']);
  }
  return rows.map((r) => r.map(q).join(',')).join('\n') + '\n';
}

function summaryMarkdown() {
  const { body } = frontMatter(fill(summaryRaw));
  const ids = [...citedIds(summaryRaw)].sort();
  const linked = body.replace(/\[(S\d{2}(?:\s*,\s*S\d{2})*)\]/g, (m, s) => s.split(/\s*,\s*/).map((id) => `[${id}](${sources.byId[id].url})`).join(' '));
  return `# ${summary.meta.title}\n\n${linked.trim()}\n\n## Sources\n\n${ids.map((id) => `- ${id}: ${sources.byId[id].title}. ${sources.byId[id].url}`).join('\n')}\n`;
}

// ---------- write everything ----------

writeFileSync(join(SITE, 'index.html'), renderReportWeb());
writeFileSync(join(SITE, 'community.html'), renderCommunity());
writeFileSync(join(SITE, 'sources.html'), renderSources());
writeFileSync(join(SITE, 'evidence.html'), renderEvidence());
writeFileSync(join(SITE, '404.html'), render404());
writeFileSync(join(BUILD, 'print.html'), renderPrint());
for (const f of ['live-checks.json', 'source-check.json']) {
  try { copyFileSync(join(ROOT, 'evidence', f), join(SITE, 'evidence', f)); } catch {}
}

const reportMd = `# ${report.meta.title}\n\n*${report.meta.subtitle}.*\n\nFeasibility research for the Redbelly DAO Community Task Board, TASK-29. Research cut-off ${report.meta.cutoff}. Version ${report.meta.version}.\n\n${toMarkdown(report)}\n\n---\n\n${sourcesMarkdown().replace(/^# Source list/, '## Source list')}`;
const files = {
  'Overledger-Redbelly-Feasibility-Report.md': reportMd,
  'Community-Summary.md': summaryMarkdown(),
  'X-Thread.txt': thread.posts.join('\n\n---\n\n') + '\n',
  'Sources.md': sourcesMarkdown(),
  'Sources.csv': sourcesCsv()
};
for (const [name, text] of Object.entries(files)) {
  writeFileSync(join(OUT, name), text);
  writeFileSync(join(SITE, 'downloads', name), text);
}
console.log(`built site/ (5 pages), build/print.html and ${Object.keys(files).length} text deliverables`);
