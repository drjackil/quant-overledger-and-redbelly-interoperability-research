// Renders the binary deliverables with headless Chromium and the docx library:
//   site/downloads/*.pdf and *.docx (copied to deliverables/), figure PNGs, the Open Graph
//   image and the three X share cards. Run after scripts/build.mjs.

import { writeFileSync, mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, ImageRun, AlignmentType, Footer, PageNumber, LevelFormat, TableLayoutType, LineRuleType
} from 'docx';
import { ROOT, read, parseDoc, makeMarked, loadSources, tokens, PANEL_LABELS, DIAGRAMS } from './lib/content.mjs';

const SITE = join(ROOT, 'site');
const OUT = join(ROOT, 'deliverables');
const FIG = join(OUT, 'figures');
for (const d of [FIG, join(SITE, 'downloads/figures'), join(SITE, 'assets/img')]) mkdirSync(d, { recursive: true });

const sources = loadSources();
const T = tokens();
const report = parseDoc(read('content/report.md'));
const PDF_NAME = 'Overledger-Redbelly-Feasibility-Report.pdf';
const DOCX_NAME = 'Overledger-Redbelly-Feasibility-Report.docx';
const css = readFileSync(join(SITE, 'assets/css/site.css'), 'utf8').replace(/url\("\.\.\/fonts\//g, `url("${pathToFileURL(join(SITE, 'assets/fonts')).href}/`);
const logo = (v) => pathToFileURL(join(SITE, `assets/brand/dao-logo-on-${v}.png`)).href;

const browser = await chromium.launch();

// ---------- PDF ----------
{
  const page = await browser.newPage();
  await page.goto(pathToFileURL(join(ROOT, 'build/print.html')).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: join(SITE, 'downloads', PDF_NAME),
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `<div style="width:100%;font:7.5pt 'JetBrains Mono',monospace;color:#596975;padding:0 18mm;display:flex;justify-content:space-between;"><span>Overledger and Redbelly: feasibility research. Cut-off ${T.SOURCE_CHECK_DATE}.</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    outline: true,
    tagged: true
  });
  await page.close();
  copyFileSync(join(SITE, 'downloads', PDF_NAME), join(OUT, PDF_NAME));
}

// ---------- figure PNGs (light theme, for Word and Markdown) ----------
for (const name of Object.keys(DIAGRAMS)) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
  const svg = readFileSync(join(SITE, 'assets/diagrams', `${name}.svg`), 'utf8');
  await page.setContent(`<!doctype html><html data-theme="light"><head><style>${css}</style><style>body{background:#fff;margin:0;padding:24px}.dg *{animation:none!important;transition:none!important;opacity:1!important}.dg .dg-token{transform:translate(480px,171px)!important}</style></head><body><figure class="diagram in" style="margin:0;background:#fff">${svg}</figure></body></html>`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('figure').screenshot({ path: join(FIG, `${name}.png`) });
  copyFileSync(join(FIG, `${name}.png`), join(SITE, 'downloads/figures', `${name}.png`));
  await page.close();
}

// ---------- Open Graph image and X cards ----------
async function card(file, w, h, inner) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html data-theme="dark"><head><style>${css}</style><style>
    body{margin:0;width:${w}px;height:${h}px;background:#1d3140;color:#f1f5f8;font-family:var(--font-sans);overflow:hidden}
    .c{position:absolute;inset:${Math.round(h * 0.07)}px ${Math.round(w * 0.06)}px;display:flex;flex-direction:column}
    .k{font:600 ${Math.round(h * 0.026)}px var(--font-mono);letter-spacing:.1em;color:#ffb3ae;text-transform:uppercase}
    h1{font-size:${Math.round(h * 0.085)}px;line-height:1.08;letter-spacing:-.02em;margin:${Math.round(h * 0.03)}px 0 ${Math.round(h * 0.025)}px;max-width:88%}
    p{font-size:${Math.round(h * 0.036)}px;line-height:1.45;color:#c2ced6;margin:0;max-width:80%}
    .row{display:flex;gap:${Math.round(w * 0.02)}px;margin-top:${Math.round(h * 0.04)}px}
    .box{flex:1;background:#141f26;border:1px solid #263641;border-radius:8px;padding:${Math.round(h * 0.03)}px}
    .box b{display:block;font-size:${Math.round(h * 0.034)}px;margin:${Math.round(h * 0.012)}px 0}
    .box span{font:500 ${Math.round(h * 0.022)}px var(--font-mono);letter-spacing:.06em;color:#8fa1ad}
    .s{display:inline-flex;align-items:center;gap:10px;font:600 ${Math.round(h * 0.022)}px var(--font-mono);letter-spacing:.06em}
    .s i{width:12px;height:12px;border-radius:50%;display:inline-block}
    .foot{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end}
    .foot img{height:${Math.round(h * 0.11)}px}
    .v{font:500 ${Math.round(h * 0.021)}px var(--font-mono);color:#8fa1ad;letter-spacing:.04em}
  </style></head><body><div class="c">${inner}<div class="foot"><span class="v">LAST VERIFIED ${T.SOURCE_CHECK_DATE.toUpperCase()}. FEASIBILITY RESEARCH. NO PARTNERSHIP OR TALKS ANNOUNCED.</span><img src="${logo('dark')}" alt=""></div></div></body></html>`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(SITE, 'assets/img', file) });
  await page.close();
}
await card('og.png', 1200, 630, `<div class="k">Feasibility research, TASK-29</div><h1>Could Redbelly connect to Quant's Overledger?</h1><p>Technical fit, the work involved, value for institutions and compliance risks. Every claim linked and re-checked.</p>`);
await card('x-card-1.png', 1600, 900, `<div class="k">The verdict</div><h1>Redbelly and Quant's Overledger</h1>
  <div class="row"><div class="box"><span class="s"><i style="background:#EF5350"></i>TODAY</span><b>No connection</b><span>ABSENT FROM THE LIVE LIST OF 59</span></div>
  <div class="box"><span class="s"><i style="background:#FCD34D"></i>ON PAPER</span><b>A minimal link is plausible</b><span>SELF-SERVICE EVM ROUTE, NOT TESTED</span></div>
  <div class="box"><span class="s"><i style="background:#8fa1ad"></i>DEEPER</span><b>Deeper needs Quant</b><span>CUSTODY, WORKFLOWS, FUSION</span></div></div>`);
await card('x-card-2.png', 1600, 900, `<div class="k">The connection ladder</div><h1>Two rungs plausible. Two only Quant can unlock.</h1>
  <div class="row"><div class="box"><span class="s"><i style="background:#FCD34D"></i>RUNG 1</span><b>Observe</b><span>NOT TESTED</span></div><div class="box"><span class="s"><i style="background:#FCD34D"></i>RUNG 2</span><b>Relay</b><span>NOT TESTED</span></div>
  <div class="box"><span class="s"><i style="background:#EF5350"></i>RUNG 3</span><b>Automate</b><span>NOT AVAILABLE</span></div><div class="box"><span class="s"><i style="background:#EF5350"></i>RUNG 4</span><b>Transfer value</b><span>NOT AVAILABLE</span></div></div>`);
await card('x-card-3.png', 1600, 900, `<div class="k">The main warning</div><h1>The rules stay on Redbelly.</h1><p>Receptor and Tokeniser enforce their checks on Redbelly. A copy on another chain obeys that chain instead, unless the link carries the checks across.</p>
  <div class="row"><div class="box"><span class="s"><i style="background:#86EFAC"></i>SAFEST PATTERN</span><b>Keep the asset on Redbelly. Move instructions, not tokens.</b></div></div>`);
await browser.close();

// ---------- Word file ----------
const FONT = 'Arial';
const MONO = 'Consolas';
const RED = 'B3272A';
const KIND_COLOR = { confirmed: '15803D', live: '15803D', analysis: RED, unknown: 'A16207', notice: 'EF5350' };
const STATUS_COLOR = { ok: '15803D', part: 'A16207', no: 'EF5350', unk: '596975' };
const marked = makeMarked({ mode: 'print', sources });

function inline(tokens, style = {}) {
  const out = [];
  for (const t of tokens || []) {
    if (t.type === 'cite') {
      out.push(new TextRun({ text: ' [', size: 16, color: '596975', font: MONO }));
      t.ids.forEach((id, i) => {
        const s = sources.byId[id];
        if (i) out.push(new TextRun({ text: ', ', size: 16, color: '596975', font: MONO }));
        const run = new TextRun({ text: id, size: 16, color: RED, font: MONO, underline: {} });
        out.push(s.internal ? run : new ExternalHyperlink({ link: s.url, children: [run] }));
      });
      out.push(new TextRun({ text: ']', size: 16, color: '596975', font: MONO }));
    } else if (t.type === 'status') {
      out.push(new TextRun({ text: '● ', color: STATUS_COLOR[t.kind], font: FONT }));
      out.push(new TextRun({ text: t.text, font: MONO, size: 18 }));
    } else if (t.type === 'strong') out.push(...inline(t.tokens, { ...style, bold: true }));
    else if (t.type === 'em') out.push(...inline(t.tokens, { ...style, italics: true }));
    else if (t.type === 'codespan') out.push(new TextRun({ text: decode(t.text), font: MONO, size: 18, ...style }));
    else if (t.type === 'link') {
      if (/^https?:/.test(t.href)) out.push(new ExternalHyperlink({ link: t.href, children: [new TextRun({ text: plain(t.tokens), color: RED, underline: {}, font: FONT, ...style })] }));
      else out.push(new TextRun({ text: plain(t.tokens), font: FONT, ...style }));
    } else if (t.type === 'br') out.push(new TextRun({ break: 1 }));
    else if (t.tokens) out.push(...inline(t.tokens, style));
    else if (t.text !== undefined) out.push(new TextRun({ text: decode(t.text), font: FONT, ...style }));
  }
  return out;
}
const decode = (s) => String(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const plain = (tokens) => (tokens || []).map((t) => (t.tokens ? plain(t.tokens) : decode(t.text ?? ''))).join('');

const thin = { style: BorderStyle.SINGLE, size: 4, color: 'D3DBE1' };
function table(tok, widthPct = 100) {
  const cols = tok.header.length;
  const mk = (cells, head) => new TableRow({
    tableHeader: head,
    cantSplit: true,
    children: cells.map((c) => new TableCell({
      shading: head ? { type: ShadingType.CLEAR, color: 'auto', fill: 'E6EBEF' } : undefined,
      margins: { top: 60, bottom: 60, left: 90, right: 90 },
      borders: { top: thin, bottom: thin, left: thin, right: thin },
      children: [new Paragraph({ spacing: { after: 0 }, children: head ? [new TextRun({ text: plain(c.tokens).toUpperCase(), bold: true, size: 15, font: MONO, color: '394853' })] : inline(c.tokens).map((r) => r) })]
    }))
  });
  return new Table({
    width: { size: widthPct * 50, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    columnWidths: Array(cols).fill(Math.floor(9000 / cols)),
    rows: [mk(tok.header, true), ...tok.rows.map((r) => mk(r, false))]
  });
}

function blocks(md, inPanel = false) {
  const out = [];
  for (const t of marked.lexer(md)) {
    if (t.type === 'paragraph') out.push(new Paragraph({ spacing: { after: 120, line: 300, lineRule: LineRuleType.AUTO }, children: inline(t.tokens) }));
    else if (t.type === 'list') {
      t.items.forEach((it) => {
        const kids = it.tokens.flatMap((x) => (x.type === 'text' || x.type === 'paragraph' ? inline(x.tokens || [{ type: 'text', text: x.text }]) : []));
        out.push(new Paragraph({ numbering: t.ordered ? { reference: 'num', level: 0, instance: numInstance } : { reference: 'bullet', level: 0 }, spacing: { after: 80, line: 290, lineRule: LineRuleType.AUTO }, children: kids }));
      });
      if (t.ordered) numInstance++;
    } else if (t.type === 'table') { out.push(table(t)); out.push(new Paragraph({ spacing: { after: 80 }, children: [] })); }
    else if (t.type === 'heading') out.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: inline(t.tokens) }));
    else if (t.type === 'code') out.push(new Paragraph({ children: [new TextRun({ text: t.text, font: MONO, size: 18 })] }));
  }
  return out;
}
let numInstance = 1;

function panel(kind, md) {
  const color = KIND_COLOR[kind];
  return new Table({
    width: { size: 5000, type: WidthType.PERCENTAGE },
    rows: [new TableRow({
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: kind === 'notice' ? 'E6EBEF' : 'F4F6F8' },
        margins: { top: 120, bottom: 60, left: 200, right: 160 },
        borders: { left: { style: BorderStyle.SINGLE, size: 24, color }, top: thin, bottom: thin, right: thin },
        children: [
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: '● ', color, font: FONT, size: 16 }), new TextRun({ text: PANEL_LABELS[kind].toUpperCase(), bold: true, color, font: MONO, size: 16 })] }),
          ...blocks(md, true)
        ]
      })]
    })]
  });
}

const children = [];
// Cover
children.push(
  new Paragraph({ spacing: { after: 400 }, children: [new ImageRun({ type: 'png', data: readFileSync(join(SITE, 'assets/brand/dao-logo-on-light.png')), transformation: { width: 140, height: 100 } })] }),
  new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: 'FEASIBILITY RESEARCH, REDBELLY DAO COMMUNITY TASK BOARD, TASK-29', font: MONO, size: 16, bold: true, color: RED })] }),
  new Paragraph({ spacing: { before: 120, after: 200, line: 264, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: report.meta.title, font: FONT, bold: true, size: 52 })] }),
  new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: report.meta.subtitle + '.', font: FONT, size: 26, color: '394853' })] }),
  panel('notice', '**Research, not news.** No partnership or talks between Redbelly and Quant have been announced, and nothing in this study implies any. It relies on public sources only and contains no price talk or investment advice.'),
  new Paragraph({ spacing: { before: 300, after: 60 }, children: [new TextRun({ text: `Research cut-off: ${report.meta.cutoff}. Version ${report.meta.version}.`, font: FONT, size: 20 })] }),
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: `${T.SOURCE_COUNT} sources with ${T.QUOTE_COUNT} quoted phrases re-checked on ${T.SOURCE_CHECK_DATE}. ${T.PROBE_COUNT} live checks run ${T.PROBE_DATE}.`, font: FONT, size: 20 })] }),
  new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: 'Labels: Confirmed (stated in a linked source), Analysis (our reasoning), Unknown (not answered by any public source).', font: FONT, size: 20, color: '394853' })] })
);
// Contents
let n = 0;
children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun({ text: 'Contents', font: FONT })] }));
for (const node of report.nodes) if (node.type === 'heading' && node.level === 2) children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: `${String(++n).padStart(2, '0')}  `, font: MONO, color: RED, size: 20 }), new TextRun({ text: node.text, font: FONT, size: 22 })] }));
children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: `${String(n + 1).padStart(2, '0')}  `, font: MONO, color: RED, size: 20 }), new TextRun({ text: 'Source list', font: FONT, size: 22 })] }));
// Body
n = 0;
for (const node of report.nodes) {
  if (node.type === 'heading' && node.level === 2) children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun({ text: `${String(++n).padStart(2, '0')}  `, font: MONO, color: RED }), new TextRun({ text: node.text, font: FONT })] }));
  else if (node.type === 'heading') children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: node.text, font: FONT })] }));
  else if (node.type === 'md') children.push(...blocks(node.md));
  else if (node.type === 'panel') { children.push(panel(node.kind, node.md)); children.push(new Paragraph({ spacing: { after: 60 }, children: [] })); }
  else if (node.type === 'diagram') {
    const png = readFileSync(join(FIG, `${node.name}.png`));
    const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
    const width = 600;
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [new ImageRun({ type: 'png', data: png, transformation: { width, height: Math.round((h / w) * width) } })] }));
    children.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: DIAGRAMS[node.name], italics: true, size: 18, color: '596975', font: FONT })] }));
  }
}
// Sources
children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun({ text: `${String(n + 1).padStart(2, '0')}  `, font: MONO, color: RED }), new TextRun({ text: 'Source list', font: FONT })] }));
children.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: `Each citation in the text links to the source below. Every external link and its quoted phrases were checked on ${T.SOURCE_CHECK_DATE}.`, font: FONT })] }));
for (const g of sources.groups) {
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: g.title, font: FONT })] }));
  for (const s of sources.sources.filter((x) => x.group === g.id)) {
    children.push(new Paragraph({ keepNext: true, spacing: { after: 20 }, children: [new TextRun({ text: `${s.id}  `, font: MONO, bold: true, color: RED, size: 18 }), new TextRun({ text: `${s.title}. `, bold: true, font: FONT, size: 20 }), new TextRun({ text: `${s.publisher}, ${s.date}.`, font: FONT, size: 20 })] }));
    children.push(new Paragraph({ keepNext: true, spacing: { after: 20 }, children: s.internal
      ? [new TextRun({ text: `Included with this report as ${s.url}. Reproduce with npm run probe. Endpoints queried: governors.mainnet.redbelly.network, governors.testnet.redbelly.network, rpc.ankr.com/redbelly_mainnet, fusion-rollup.quant.dev.`, font: FONT, size: 18 })]
      : [new ExternalHyperlink({ link: s.url, children: [new TextRun({ text: s.url, font: MONO, size: 16, color: RED, underline: {} })] })] }));
    children.push(new Paragraph({ spacing: { after: 140 }, children: [new TextRun({ text: `Supports: ${s.supports}`, font: FONT, size: 18, color: '394853' })] }));
  }
}

const doc = new Document({
  title: report.meta.title,
  description: 'TASK-29 submission, Redbelly DAO Community Task Board.',
  creator: 'TASK-29',
  lastModifiedBy: 'TASK-29',
  styles: {
    default: { document: { run: { font: FONT, size: 21, color: '0F1A22' }, paragraph: { spacing: { line: 300, lineRule: LineRuleType.AUTO } } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 34, bold: true, font: FONT, color: '0F1A22' }, paragraph: { spacing: { before: 240, after: 160 }, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: FONT, color: '0F1A22' }, paragraph: { spacing: { before: 280, after: 120 }, keepNext: true } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 22, bold: true, font: FONT }, paragraph: { spacing: { before: 200, after: 80 }, keepNext: true } }
    ]
  },
  numbering: {
    config: [
      { reference: 'bullet', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] },
      { reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 300 } } } }] }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1100, bottom: 1100, left: 1100, right: 1100 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Overledger and Redbelly: feasibility research    ', font: MONO, size: 14, color: '596975' }), new TextRun({ children: [PageNumber.CURRENT], font: MONO, size: 14, color: '596975' })] })] }) },
    children
  }]
});
const buf = await Packer.toBuffer(doc);
writeFileSync(join(SITE, 'downloads', DOCX_NAME), buf);
writeFileSync(join(OUT, DOCX_NAME), buf);
console.log('rendered PDF, Word file, 4 figures, Open Graph image and 3 X cards');
