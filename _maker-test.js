const puppeteer = require('puppeteer-core');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');

const PROJ = 'C:\\Users\\sodad\\Downloads\\One Prompt a Day Card news';
const PAGE = path.join(PROJ, 'card-news-maker.html');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DL = path.join(PROJ, '_maker-dl');

function waitFile(pred, ms) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    const iv = setInterval(() => {
      const hit = fs.existsSync(DL) ? fs.readdirSync(DL).filter(f => !f.endsWith('.crdownload') && pred(f)) : [];
      if (hit.length) { clearInterval(iv); resolve(hit); }
      else if (Date.now() - t0 > ms) { clearInterval(iv); reject(new Error('timeout')); }
    }, 400);
  });
}

(async () => {
  if (fs.existsSync(DL)) fs.rmSync(DL, { recursive: true, force: true });
  fs.mkdirSync(DL);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('  [pageerror]', e.message));
  const client = await page.target().createCDPSession();
  await client.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: DL, eventsEnabled: true });

  await page.goto(pathToFileURL(PAGE).href, { waitUntil: 'load', timeout: 60000 });
  const libs = await page.evaluate(() => ({ h2c: typeof html2canvas !== 'undefined', jszip: typeof JSZip !== 'undefined' }));
  console.log('libs inlined -> html2canvas:', libs.h2c, '| JSZip:', libs.jszip);

  // fill inputs + add two test images via the real addFiles() path (cover-crop)
  const info = await page.evaluate(async () => {
    state.handle = '@teammate'; state.date = '2026.05.31';
    state.headline = 'Test\nportraits.'; state.chain = 'A -> B -> C';
    state.imgcap = 'ToolX'; state.tags = '#alpha #beta';
    state.steps = [{ tool: 'A', act: 'do a' }, { tool: 'B', act: 'do b' }];
    async function mkImg(w, h) {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d'); x.fillStyle = '#222'; x.fillRect(0, 0, w, h);
      x.fillStyle = '#fff'; x.beginPath(); x.arc(w / 2, h / 2, Math.min(w, h) / 4, 0, 7); x.fill();
      const b = await new Promise(r => c.toBlob(r, 'image/png'));
      return new File([b], 'test.png', { type: 'image/png' });
    }
    await addFiles([await mkImg(600, 1000), await mkImg(1400, 800)]);
    return { images: state.images.length, cards: document.querySelectorAll('.card').length, imageCards: document.querySelectorAll('.card.image').length };
  });
  console.log('images added:', info.images, '| total cards:', info.cards, '| image cards:', info.imageCards);

  // trigger ZIP download
  await page.click('#dl-all');
  const zips = await waitFile(f => f.endsWith('.zip'), 60000);
  const zipPath = path.join(DL, zips[0]);
  const names = await page.evaluate(async (b64) => {
    const bin = atob(b64), arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const z = await JSZip.loadAsync(arr); return Object.keys(z.files).sort();
  }, fs.readFileSync(zipPath).toString('base64'));
  console.log('ZIP saved:', zips[0], '->', names.length, 'png (' + names[0] + ' .. ' + names[names.length - 1] + ')');

  const status = await page.evaluate(() => document.getElementById('status').textContent);
  console.log('status:', status);
  await browser.close();

  const expect = 1 + 2 + 2 + 1 + 1;
  const ok = info.cards === expect && names.length === expect && info.imageCards === 2;
  console.log('\nRESULT:', ok ? 'PASS - maker builds + downloads correctly' : 'CHECK (expected ' + expect + ' cards)');
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAILED:', e.message); process.exit(2); });
