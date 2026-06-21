const puppeteer = require('puppeteer-core');
const { pathToFileURL } = require('url');
const path = require('path');

const PROJ = 'C:\\Users\\sodad\\Downloads\\One Prompt a Day Card news';
const PAGE = path.join(PROJ, '_aspect-test.html');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const analyze = async (id) => {
  const canvas = await captureCard(document.getElementById(id));
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const Ymax = 950; // media region only (exclude bottom cap-bar)
  const d = ctx.getImageData(0, 0, W, Ymax).data;
  let minx = 1e9, miny = 1e9, maxx = -1, maxy = -1, white = 0, black = 0, stone = 0;
  for (let y = 0; y < Ymax; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
      if (r > 245 && g > 245 && b > 245) { white++; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
      else if (r < 40 && g < 40 && b < 40 && a > 200) black++;
      else if (r >= 215 && r <= 238) stone++;
    }
  }
  return { w: maxx - minx, h: maxy - miny, ratio: +((maxx - minx) / (maxy - miny)).toFixed(3), white, black, stone };
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('  [pageerror]', e.message));
  await page.goto(pathToFileURL(PAGE).href, { waitUntil: 'load', timeout: 60000 });

  const bg = await page.evaluate(analyze, 'bg');

  console.log('Source circle is perfectly round. ratio 1.0 = preserved, >1 = stretched.\n');
  console.log('PRE-CROP + <img> ->', JSON.stringify(bg));

  const ok = bg.black > 50000 && Math.abs(bg.ratio - 1) <= 0.06;
  console.log('\nVERDICT: ' + (ok ? 'PASS - aspect preserved (circle stays round)' : 'CHECK') +
    ' | circle ratio=' + bg.ratio + ' w=' + bg.w + ' h=' + bg.h + ' (black px=' + bg.black + ')');

  await browser.close();
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAILED:', e.message); process.exit(2); });
