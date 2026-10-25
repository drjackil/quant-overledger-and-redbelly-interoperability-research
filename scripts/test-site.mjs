// Offline checks on the built output: links, anchors, assets, citations and downloads.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadSources } from './lib/content.mjs';

const SITE = join(ROOT, 'site');
const pages = ['index.html', 'community.html', 'sources.html', 'evidence.html', '404.html'];
const sources = loadSources();
const problems = [];
const ok = [];
const html = Object.fromEntries(pages.map((p) => [p, readFileSync(join(SITE, p), 'utf8')]));
const ids = Object.fromEntries(pages.map((p) => [p, new Set([...html[p].matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));

for (const p of pages) {
  const h = html[p];
  // internal links and anchors
  for (const m of h.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|data:)/.test(url)) continue;
    const [file, hash] = url.split('#');
    const target = file || p;
    if (file && !existsSync(join(SITE, file))) problems.push(`${p}: missing file ${file}`);
    else if (hash && pages.includes(target) && !ids[target].has(hash)) problems.push(`${p}: missing anchor #${hash} in ${target}`);
  }
  // citation chips
  for (const m of h.matchAll(/data-src="(S\d{2})"/g)) if (!sources.byId[m[1]]) problems.push(`${p}: chip for unknown source ${m[1]}`);
  // brand voice in the rendered output
  if (/[\u2013\u2014]/.test(h)) problems.push(`${p}: contains an em or en dash`);
  if (!/<title>[^<]+<\/title>/.test(h)) problems.push(`${p}: no title`);
  if (!/name="viewport"/.test(h)) problems.push(`${p}: no viewport meta`);
  if (/<img(?![^>]*\salt=)/.test(h)) problems.push(`${p}: image without alt text`);
}
ok.push('internal links, anchors, assets and alt text');

// every chip on the report page has a matching source entry on the same page
const chipIds = new Set([...html['index.html'].matchAll(/data-src="(S\d{2})"/g)].map((m) => m[1]));
for (const id of chipIds) if (!ids['index.html'].has(`src-${id}`)) problems.push(`index.html: chip ${id} has no source entry on the page`);
ok.push(`${chipIds.size} distinct sources cited on the report page, each with an entry`);

// downloads
for (const f of ['Overledger-Redbelly-Feasibility-Report.pdf', 'Overledger-Redbelly-Feasibility-Report.docx', 'Overledger-Redbelly-Feasibility-Report.md', 'Community-Summary.md', 'X-Thread.txt', 'Sources.csv', 'Sources.md']) {
  for (const dir of ['site/downloads', 'deliverables']) {
    const p = join(ROOT, dir, f);
    if (!existsSync(p) || statSync(p).size < 1000) problems.push(`missing or empty ${dir}/${f}`);
  }
}
const pdf = readFileSync(join(ROOT, 'deliverables/Overledger-Redbelly-Feasibility-Report.pdf'));
if (pdf.subarray(0, 5).toString() !== '%PDF-') problems.push('PDF does not start with a PDF header');
const docx = readFileSync(join(ROOT, 'deliverables/Overledger-Redbelly-Feasibility-Report.docx'));
if (docx.subarray(0, 2).toString() !== 'PK') problems.push('Word file is not a valid package');
ok.push('PDF, Word, Markdown, thread and source list present in site/downloads and deliverables');

// evidence
for (const f of ['evidence/live-checks.json', 'evidence/source-check.json']) {
  if (!existsSync(join(ROOT, f))) { problems.push(`missing ${f}`); continue; }
  const j = JSON.parse(readFileSync(join(ROOT, f), 'utf8'));
  if (j.passed !== j.total) problems.push(`${f}: ${j.passed}/${j.total} passed at last run`);
}
ok.push('evidence files present and passing at last run');

for (const o of ok) console.log(`PASS  ${o}`);
for (const p of problems) console.log(`FAIL  ${p}`);
console.log(problems.length ? `\n${problems.length} problem(s)` : '\nbuilt site checks pass');
if (problems.length) process.exitCode = 1;
