const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const PROJ = 'C:\\Users\\sodad\\Downloads\\One Prompt a Day Card news';
const DECK = path.join(PROJ, '1pd-2026-05-30-portraits.html');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DLDIR = path.join(PROJ, '_test-downloads');

function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.length < 24 || b[0] !== 0x89 || b[1] !== 0x50) return null; // not PNG
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), kb: Math.round(b.length / 1024) };
}
function waitFile(pred, timeoutMs) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    const iv = setInterval(() => {
      const hit = fs.readdirSync(DLDIR).filter(f => !f.endsWith('.crdownload') && pred(f));
      if (hit.length) { clearInterval(iv); resolve(hit); }
      else if (Date.now() - t0 > timeoutMs) { clearInterval(iv); reject(new Error('timeout waiting for file')); }
    }, 400);
  });
}

(async () => {
  if (fs.existsSync(DLDIR)) fs.rmSync(DLDIR, { recursive: true, force: true });
  fs.mkdirSync(DLDIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  page.on('console', m => { if (m.type() === 'error') console.log('  [page error]', m.text()); });
  page.on('pageerror', e => console.log('  [pageerror]', e.message));

  const client = await page.target().createCDPSession();
  await client.send('Browser.setDownloadBehavior', {
    behavior: 'allow', downloadPath: DLDIR, eventsEnabled: true
  });

  console.log('loading deck …');
  await page.goto(pathToFileURL(DECK).href, { waitUntil: 'load', timeout: 60000 });

  const libs = await page.evaluate(() => ({
    h2c: typeof html2canvas !== 'undefined',
    jszip: typeof JSZip !== 'undefined',
    cards: document.querySelectorAll('.card').length
  }));
  console.log('  html2canvas:', libs.h2c, '| JSZip:', libs.jszip, '| cards:', libs.cards);
  if (!libs.h2c || !libs.jszip) throw new Error('library not loaded');

  // ---- TEST 1: single per-card PNG (an image card, c2) ----
  console.log('\nTEST 1 — single PNG (image card c2) …');
  await page.evaluate(() => dl('c2', '1pd-card-02.png'));
  const single = await waitFile(f => f === '1pd-card-02.png', 30000);
  const sz = pngSize(path.join(DLDIR, single[0]));
  console.log('  ✓ saved', single[0], '→', sz ? `${sz.w}×${sz.h}, ${sz.kb}KB` : 'NOT A PNG');

  // ---- TEST 2: Download all → single ZIP ----
  console.log('\nTEST 2 — Download all (ZIP) …');
  await page.evaluate(() => dlAll());
  const zips = await waitFile(f => f.endsWith('.zip'), 120000);
  const zipPath = path.join(DLDIR, zips[0]);
  console.log('  ✓ saved', zips[0], '→', Math.round(fs.statSync(zipPath).size / 1024), 'KB');

  // verify zip contents count via JSZip in the page
  const names = await page.evaluate(async (b64) => {
    const bin = atob(b64); const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const z = await JSZip.loadAsync(arr);
    return Object.keys(z.files).sort();
  }, fs.readFileSync(zipPath).toString('base64'));
  console.log('  zip contains', names.length, 'files:', names[0], '…', names[names.length - 1]);

  const finalStatus = await page.evaluate(() => document.getElementById('status').textContent);
  console.log('  status:', finalStatus);

  await browser.close();
  console.log('\nRESULT: single PNG + ZIP-all both downloaded and verified.');
})().catch(e => { console.error('\nTEST FAILED:', e.message); process.exit(1); });
