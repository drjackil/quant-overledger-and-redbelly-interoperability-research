// Shared content model. content/report.md is the single source for the website, the PDF,
// the Word file and the Markdown exports, so every output says exactly the same thing.
//
// Syntax on top of Markdown:
//   ## Heading {#id}            section with a stable anchor
//   ::: confirmed|analysis|unknown|live|notice   labelled panel, closed by :::
//   [S07] or [S07, S11]         citation of a source in content/sources.json
//   [[ok:text]] [[part:text]] [[no:text]] [[unk:text]]   status marker (dot plus label)
//   @diagram(name)              figure from site/assets/diagrams/name.svg
//   {{TOKEN}}                   value filled in from the evidence files

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const read = (p) => readFileSync(join(ROOT, p), 'utf8');
export const readJson = (p) => JSON.parse(read(p));

export const PANEL_LABELS = {
  confirmed: 'Confirmed',
  live: 'Confirmed by live check',
  analysis: 'Analysis',
  unknown: 'Unknown',
  notice: 'Notice'
};

export const STATUS_LABELS = { ok: 'meets', part: 'partial', no: 'no', unk: 'unknown' };

export const DIAGRAMS = {
  levels: 'Figure 1. The connection ladder: four rungs, and who can unlock each one.',
  stack: 'Figure 2. How Overledger is put together, from its public documentation. Redbelly is not a listed network.',
  routes: 'Figure 3. The three documented ways a chain reaches Overledger, and how Redbelly fits each one.',
  journey: 'Figure 4. Where Redbelly\'s compliance checks run, and where they could break once an asset leaves.'
};

export const ACCOUNT_FILE = 'evidence/overledger-account-checks.json';
export const hasAccountChecks = () => existsSync(join(ROOT, ACCOUNT_FILE));

export function loadSources() {
  const data = readJson('content/sources.json');
  // S50 exists only once the account-level checks have been run, so it is never a dead link.
  if (hasAccountChecks()) {
    const a = readJson(ACCOUNT_FILE);
    data.sources.push({
      id: 'S50', group: 'live',
      title: 'Account-level checks through an Overledger account (this report)',
      publisher: 'This report, scripts/overledger-account-probe.mjs', date: a.ranAt.slice(0, 10),
      url: ACCOUNT_FILE, internal: true,
      supports: `Results of ${a.checks.length} checks made with an Overledger API key, stages ${a.stages.join(', ')}: the live network list, and where run, a Redbelly Testnet node used through Overledger.`
    });
  }
  const byId = Object.fromEntries(data.sources.map((s) => [s.id, s]));
  return { ...data, byId };
}

export function loadEvidence() {
  const live = existsSync(join(ROOT, 'evidence/live-checks.json')) ? readJson('evidence/live-checks.json') : null;
  const src = existsSync(join(ROOT, 'evidence/source-check.json')) ? readJson('evidence/source-check.json') : null;
  return { live, src };
}

export function tokens() {
  const { sources } = loadSources();
  const { live, src } = loadEvidence();
  const ext = sources.filter((s) => !s.internal);
  const fmt = (iso) => new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const safe = live?.checks.find((c) => c.id === 'tag-safe');
  return {
    QUOTE_COUNT: String(ext.reduce((n, s) => n + (s.quotes || []).length, 0)),
    SOURCE_COUNT: String(ext.length),
    SOURCE_CHECK_DATE: src ? fmt(src.checkedAt) : '25 October 2026',
    PROBE_COUNT: String(live ? live.total : 22),
    PROBE_DATE: live ? fmt(live.ranAt) : '25 October 2026',
    SAFE_LAG: safe ? Number(safe.response.blocksBehindFinalized).toLocaleString('en-AU') : 'several thousand'
  };
}

export function fill(text) {
  const t = tokens();
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in t ? t[k] : m));
}

export function frontMatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { meta: {}, body: raw };
  const meta = Object.fromEntries(m[1].split('\n').filter(Boolean).map((l) => {
    const i = l.indexOf(':');
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  }));
  return { meta, body: raw.slice(m[0].length) };
}

// Splits the Markdown into a flat list of nodes: headings, panels, plain Markdown and diagrams.
export function parseDoc(raw) {
  const { meta, body } = frontMatter(fill(raw));
  const nodes = [];
  let buf = [];
  let panel = null;
  const flush = () => {
    const md = buf.join('\n').trim();
    if (md) nodes.push({ type: 'md', md });
    buf = [];
  };
  for (const line of body.split('\n')) {
    if (panel) {
      if (line.trim() === ':::') { nodes.push({ type: 'panel', kind: panel.kind, md: panel.lines.join('\n').trim() }); panel = null; }
      else panel.lines.push(line);
      continue;
    }
    const open = line.match(/^:::\s*(confirmed|analysis|unknown|live|notice)\s*$/);
    const head = line.match(/^(#{2,3})\s+(.+?)\s*(?:\{#([\w-]+)\})?\s*$/);
    const diag = line.match(/^@diagram\((\w+)\)\s*$/);
    const inc = line.match(/^@include\(account-checks\)\s*$/);
    if (inc) { flush(); nodes.push(...accountCheckNodes()); continue; }
    if (open) { flush(); panel = { kind: open[1], lines: [] }; }
    else if (head) { flush(); nodes.push({ type: 'heading', level: head[1].length, text: head[2], id: head[3] || slug(head[2]) }); }
    else if (diag) { flush(); nodes.push({ type: 'diagram', name: diag[1] }); }
    else buf.push(line);
  }
  if (panel) throw new Error(`Unclosed ::: ${panel.kind} panel`);
  flush();
  return { meta, nodes };
}

export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// A Marked instance that understands citations and status markers.
// mode 'web': citations open a popover and link to the source list on the page.
// mode 'print': citations link straight to the source URL, so they work inside a PDF.
export function makeMarked({ mode = 'web', sources }) {
  const marked = new Marked({ gfm: true });
  marked.use({
    extensions: [
      {
        name: 'cite', level: 'inline',
        start: (src) => src.match(/\[S\d{2}/)?.index,
        tokenizer(src) {
          const m = src.match(/^\[(S\d{2}(?:\s*,\s*S\d{2})*)\]/);
          if (m) return { type: 'cite', raw: m[0], ids: m[1].split(/\s*,\s*/) };
        },
        renderer(tok) {
          const parts = tok.ids.map((id) => {
            const s = sources.byId[id];
            if (!s) throw new Error(`Unknown source ${id}`);
            const href = mode === 'print' ? (s.internal ? `#src-${id}` : s.url) : `#src-${id}`;
            return `<a class="cite" href="${esc(href)}" data-src="${id}" aria-label="Source ${id}: ${esc(s.title)}">${id}</a>`;
          });
          return `<span class="cites">${parts.join('')}</span>`;
        }
      },
      {
        name: 'status', level: 'inline',
        start: (src) => src.indexOf('[['),
        tokenizer(src) {
          const m = src.match(/^\[\[(ok|part|no|unk):([^\]]+)\]\]/);
          if (m) return { type: 'status', raw: m[0], kind: m[1], text: m[2] };
        },
        renderer(tok) {
          return `<span class="status status-${tok.kind}"><span class="dot" aria-hidden="true"></span>${esc(tok.text)}</span>`;
        }
      }
    ],
    renderer: {
      table(token) {
        // wrap tables so they scroll sideways on phones instead of breaking the layout
        const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join('');
        const rows = token.rows.map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`).join('');
        return `<div class="table-wrap" tabindex="0"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const ext = /^https?:/.test(href);
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${ext ? ' rel="noopener" target="_blank"' : ''}>${text}</a>`;
      }
    }
  });
  return marked;
}

export function citedIds(text) {
  const ids = new Set();
  for (const m of text.matchAll(/\[(S\d{2}(?:\s*,\s*S\d{2})*)\]/g)) m[1].split(/\s*,\s*/).forEach((i) => ids.add(i));
  return ids;
}

export function parseThread(raw) {
  const { meta, body } = frontMatter(raw);
  const posts = body.trim().split(/\n(?=\d+\/ )/).map((p) => p.trim());
  return { meta, posts };
}

// X counts every link as 23 characters.
export const xLength = (post) => [...post.replace(/https?:\/\/\S+/g, 'x'.repeat(23))].length;

// Report panels for the account-level checks: results when they exist, otherwise a plain "not run yet".
export function accountCheckNodes() {
  if (!hasAccountChecks()) {
    return [{ type: 'panel', kind: 'unknown', md: [
      '**Not run yet.** The account-level checks below have not been run for this version of the report, so their results are unknown. Anyone with an Overledger API key can run them:',
      '',
      '1. `OVERLEDGER_API_KEY=... npm run probe:account` reads the live network list and shows whether Redbelly is in it. Read-only.',
      '2. Adding `-- --node-test` registers a Redbelly Testnet node, sends test calls through Overledger, then deletes the node.',
      '3. Adding `--write` with a Redbelly-verified testnet key sends one zero-value transfer through Overledger.',
      '',
      'When the results file exists, the next build replaces this panel with the results.'
    ].join('\n') }];
  }
  const a = readJson(ACCOUNT_FILE);
  const date = new Date(a.ranAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const cell = (s) => String(s).replace(/\|/g, '/').replace(/\n/g, ' ');
  const rows = a.checks.map((c) => {
    const st = c.pass === null ? '[[unk:Observed]]' : c.pass ? '[[ok:As expected]]' : '[[no:Not as expected]]';
    return `| ${c.stage} | ${cell(c.title)} | ${st} | ${cell(c.meaning)} [S50] |`;
  });
  const stages = { 1: 'stage 1 (read-only)', 2: 'stage 2 (Testnet node)', 3: 'stage 3 (verified write)' };
  return [{ type: 'panel', kind: 'live', md: [
    `Run on ${date} through \`${a.gateway}\`, covering ${a.stages.map((s) => stages[s]).join(', ')}. ${a.passed} of ${a.total} graded checks behaved as expected [S50].`,
    '',
    '| Stage | Check | Result | What it shows |',
    '|---|---|---|---|',
    ...rows
  ].join('\n') }];
}
