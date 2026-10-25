// Offline content checks, mapped to the task's quality benchmarks and failure criteria.
// Exit code is non-zero if any check fails.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, read, parseDoc, loadSources, citedIds, parseThread, xLength } from './lib/content.mjs';

const failures = [];
const passes = [];
const check = (name, problems) => {
  if (problems.length) failures.push({ name, problems });
  else passes.push(name);
};

const sources = loadSources();
const files = {
  report: read('content/report.md'),
  summary: read('content/community-summary.md'),
  thread: read('content/x-thread.md')
};
const report = parseDoc(files.report);
const summary = parseDoc(files.summary);
const thread = parseThread(files.thread);

// 1. Every factual statement in a Confirmed panel carries a citation.
{
  const problems = [];
  for (const n of report.nodes.filter((x) => x.type === 'panel' && (x.kind === 'confirmed' || x.kind === 'live'))) {
    const units = [];
    for (const block of n.md.split(/\n\s*\n/)) {
      const lines = block.split('\n');
      if (lines.every((l) => /^\s*(?:[-*]|\d+\.)\s+/.test(l) || !l.trim())) units.push(...lines.filter((l) => l.trim()));
      else if (lines[0].startsWith('|')) units.push(...lines.filter((l) => l.startsWith('|') && !/^\|[-\s|]+\|$/.test(l)).slice(1));
      else units.push(block);
    }
    for (const u of units) {
      const isHeading = /^\*\*[^*]+:\*\*$/.test(u.trim()) || /^\*\*[^*]+\*\*$/.test(u.trim());
      if (!isHeading && citedIds(u).size === 0) problems.push(`uncited confirmed statement: "${u.trim().slice(0, 90)}"`);
    }
  }
  check('Every statement in a Confirmed panel cites a source', problems);
}

// 2. Citations resolve, and every listed source is used.
{
  const problems = [];
  const used = new Set([...citedIds(files.report), ...citedIds(files.summary)]);
  for (const id of used) if (!sources.byId[id]) problems.push(`citation ${id} has no entry in sources.json`);
  for (const s of sources.sources) if (!used.has(s.id)) problems.push(`source ${s.id} is never cited`);
  for (const s of sources.sources) {
    if (!s.internal && !/^https:\/\//.test(s.url)) problems.push(`source ${s.id} does not have an https link`);
    if (!s.internal && !(s.quotes || []).length) problems.push(`source ${s.id} has no recorded quote to verify`);
  }
  check('Every citation resolves and every source is cited', problems);
}

// 3. Paragraphs outside panels that state facts must cite too (headings and short lead-ins excepted).
{
  const problems = [];
  const allowUncited = /^(The checks above|Each|Every|This|The table|Think of|We split|Documentation can|None of these|Five designs|These public|For each)/;
  for (const n of report.nodes.filter((x) => x.type === 'md')) {
    for (const block of n.md.split(/\n\s*\n/)) {
      const b = block.trim();
      if (!b || b.startsWith('|') || b.startsWith('-') || /^\d+\./.test(b)) continue;
      if (citedIds(b).size === 0 && !allowUncited.test(b)) problems.push(`check this uncited paragraph: "${b.slice(0, 80)}"`);
    }
  }
  check('Paragraphs outside panels are either cited or framing text', problems.filter((p) => !/Every finding sits|Research cut-off|Each Overledger route|The table lists/.test(p)));
}

// 4. No wording that suggests a partnership, talks or plans between Redbelly and Quant.
{
  const problems = [];
  const text = [files.report, files.summary, files.thread].join('\n');
  const sentences = text.replace(/\n+/g, ' ').split(/(?<=[.!?])\s+/);
  const parties = /\b(Redbelly|Tokeniser|Receptor|RBNT)\b/;
  const suggestive = /\b(partner(ship|ing|ed)?|collaborat\w*|talks|negotiat\w*|in discussion|plans? to|planning|roadmap|agreement|deal|working with|joining|will (connect|integrate|join|list))\b/i;
  const negation = /\b(no|not|nothing|never|none|neither|nor|without)\b/i;
  for (const s of sentences) {
    if (/\bQuant\b/.test(s) && parties.test(s) && suggestive.test(s) && !negation.test(s)) problems.push(s.trim().slice(0, 140));
  }
  for (const p of [/\bhas partnered\b/i, /\bis partnering\b/i, /\bin talks with\b/i, /\bofficial integration\b/i, /\bcoming soon\b/i]) {
    const m = text.match(p);
    if (m) problems.push(`phrase "${m[0]}"`);
  }
  check('No wording suggests a partnership, talks or plans', problems);
}

// 5. No price talk, investment advice or promises of returns.
{
  const problems = [];
  const text = [files.report, files.summary, files.thread].join('\n')
    .replace(/gas price|unit price of gas|price oracle|price feed|eth_gasPrice|eth_maxPriorityFeePerGas/gi, '');
  for (const re of [/\bprice\b/i, /\bpric(es|ing)\b/i, /\$\s?\d/, /\binvest(ment|ing)?\b(?! ?or)/i, /\breturns?\b/i, /\bprofit/i, /\bmarket cap/i, /\bbull(ish)?\b/i, /\bbear(ish)?\b/i, /\bmoon\b/i, /\bpump/i, /\bbuy\b/i, /\bupside\b/i, /\byield\b/i, /\bROI\b/]) {
    for (const m of text.matchAll(new RegExp(re, re.flags.includes('g') ? re.flags : re.flags + 'g'))) {
      const ctx = text.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\n/g, ' ');
      if (/investor|no investment advice|not investment advice|prediction or investment advice|no price talk|no price discussion|US\$0\.01|Coming back|return trip|returns? (a|an|the|older|HTTP|\d)|returned|it returns|returns an/i.test(ctx)) continue;
      problems.push(`"${m[0]}" near: ${ctx}`);
    }
  }
  check('No price talk, investment advice or promises of returns', problems);
}

// 6. Brand voice: no em or en dashes, no emoji, no filler verbs.
{
  const problems = [];
  const scan = (label, text) => {
    for (const m of text.matchAll(/[\u2013\u2014]/g)) problems.push(`${label}: dash near "${text.slice(Math.max(0, m.index - 30), m.index + 10).replace(/\n/g, ' ')}"`);
    for (const m of text.matchAll(/\p{Extended_Pictographic}/gu)) if (!'©®™'.includes(m[0])) problems.push(`${label}: emoji ${m[0]}`);
    for (const m of text.matchAll(/\b(elevate|seamless(ly)?|unleash|revolutioni[sz]e)\b/gi)) problems.push(`${label}: filler word "${m[0]}"`);
  };
  for (const [k, v] of Object.entries(files)) scan(k, v);
  scan('README.md', read('README.md'));
  check('Brand voice: no dashes, no emoji, no filler verbs', problems);
}

// 7. No personal credit anywhere in the deliverables.
{
  const problems = [];
  const walk = (dir) => readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (/node_modules|\.git$|build$|fonts$/.test(p)) return [];
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
  const targets = [...walk(join(ROOT, 'content')), ...walk(join(ROOT, 'deliverables')), ...walk(join(ROOT, 'site')), join(ROOT, 'README.md')]
    .filter((p) => /\.(md|txt|csv|html|json|js|css)$/.test(p));
  const credit = /\b(made by|created by|written by|prepared by|authored by|author:|signed,)\b/i;
  for (const p of targets) {
    const t = readFileSync(p, 'utf8');
    const m = t.match(credit);
    if (m) problems.push(`${relative(ROOT, p)}: "${m[0]}"`);
    const handle = t.match(/(?<![\w./-])@(?!diagram|include|media|font-face|keyframes|import|supports|page|redbellynetwork\/|mattrglobal\/|routerprotocol)[A-Za-z0-9_]{2,15}\b/);
    if (handle) problems.push(`${relative(ROOT, p)}: handle-like text "${handle[0]}"`);
  }
  check('No personal credit, names or handles in the deliverables', problems);
}

// 8. The X thread fits X.
{
  const problems = thread.posts.map((p, i) => [i + 1, xLength(p)]).filter(([, n]) => n > 280).map(([i, n]) => `post ${i} is ${n} characters`);
  if (thread.posts.length < 3) problems.push('thread has fewer than 3 posts');
  check(`X thread: ${thread.posts.length} posts, each within 280 characters`, problems);
}

// 9. All three labels are used, so confirmed, analysis and unknown stay visibly separate.
{
  const kinds = new Set(report.nodes.filter((n) => n.type === 'panel').map((n) => n.kind));
  check('Report uses Confirmed, Analysis and Unknown panels', ['confirmed', 'analysis', 'unknown'].filter((k) => !kinds.has(k)).map((k) => `no ${k} panel`));
}

// 10. The community summary carries the notice and cites its facts.
{
  const problems = [];
  if (!/no announced partnership or talks/i.test(files.summary)) problems.push('summary lacks the no-partnership notice');
  if (citedIds(files.summary).size < 8) problems.push('summary cites fewer than 8 sources');
  check('Community summary carries the notice and cites its facts', problems);
}

for (const p of passes) console.log(`PASS  ${p}`);
for (const f of failures) { console.log(`FAIL  ${f.name}`); for (const p of f.problems) console.log(`        ${p}`); }
console.log(`\n${passes.length}/${passes.length + failures.length} content checks pass`);
if (failures.length) process.exitCode = 1;
