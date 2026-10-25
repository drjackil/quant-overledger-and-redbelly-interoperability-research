// Online source check. For every external source in content/sources.json:
//   1. the link must load (HTTP 200 after redirects), and
//   2. every quote recorded for it must still appear on the page.
// Pages are first fetched as plain HTML. If that fails or a quote is missing (pages that render
// with JavaScript or sit behind a bot check), the page is rendered in headless Chromium instead.
// Results go to evidence/source-check.json. Exit code is non-zero if any source fails.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { sources } = JSON.parse(readFileSync(join(ROOT, 'content/sources.json'), 'utf8'));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export const normalise = (s) => s
  .replace(/[‘’‛′]/g, "'")
  .replace(/[“”‟″]/g, '"')
  .replace(/ /g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&rsquo;|&lsquo;/g, "'").replace(/&reg;/g, '®')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

async function plain(url) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
    return { status: res.status, finalUrl: res.url, text: normalise(htmlToText(await res.text())) };
  } catch (e) {
    return { status: 0, finalUrl: url, text: '', error: String(e.message || e) };
  }
}

let browser;
async function rendered(url) {
  if (!browser) {
    const { chromium } = await import('playwright');
    browser = await chromium.launch();
  }
  const ctx = await browser.newContext({ userAgent: UA });
  const page = await ctx.newPage();
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const text = await page.evaluate(() => document.body ? document.body.innerText : '');
    return { status: res ? res.status() : 0, finalUrl: page.url(), text: normalise(text) };
  } catch (e) {
    return { status: 0, finalUrl: url, text: '', error: String(e.message || e) };
  } finally {
    await ctx.close();
  }
}

const check = (text, quotes) => quotes.map((q) => ({ quote: q, found: text.includes(normalise(q)) }));

async function main() {
  const results = [];
  for (const s of sources) {
    if (s.internal) continue;
    const quotes = s.quotes || [];
    let r = await plain(s.url);
    let method = 'http';
    let found = check(r.text, quotes);
    if (r.status !== 200 || found.some((f) => !f.found)) {
      const rr = await rendered(s.url);
      const ff = check(rr.text, quotes);
      if (rr.status === 200 && ff.filter((f) => f.found).length >= found.filter((f) => f.found).length) {
        r = rr; found = ff; method = 'browser';
      } else if (r.status !== 200 && rr.status === 200) {
        r = rr; found = ff; method = 'browser';
      }
    }
    const ok = r.status === 200 && found.every((f) => f.found);
    results.push({ id: s.id, url: s.url, finalUrl: r.finalUrl, status: r.status, method, ok, quotes: found });
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${s.id}  ${r.status}  ${found.filter((f) => f.found).length}/${found.length} quotes  ${s.url}`);
    for (const f of found) if (!f.found) console.log(`        missing: ${f.quote}`);
  }
  if (browser) await browser.close();
  const passed = results.filter((r) => r.ok).length;
  const out = { checkedAt: new Date().toISOString(), passed, total: results.length, results };
  writeFileSync(join(ROOT, 'evidence/source-check.json'), JSON.stringify(out, null, 2) + '\n');
  console.log(`\n${passed}/${results.length} sources load and still contain every recorded quote`);
  if (passed !== results.length) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
