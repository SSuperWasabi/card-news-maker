// Inlines html2canvas + jszip into card-news-maker.src.html -> card-news-maker.html
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const src = fs.readFileSync(path.join(dir, 'card-news-maker.src.html'), 'utf8');
const h2c = fs.readFileSync(path.join(dir, 'html2canvas.min.js'), 'utf8');
const jsz = fs.readFileSync(path.join(dir, 'jszip.min.js'), 'utf8');
// Use replacement *functions* so '$' sequences inside the libs are not treated as special.
const out = src
  .replace('__HTML2CANVAS__', () => h2c)
  .replace('__JSZIP__', () => jsz);
if (out.indexOf('__HTML2CANVAS__') !== -1 || out.indexOf('__JSZIP__') !== -1) {
  throw new Error('A placeholder was not replaced — check the script tags in .src.html');
}
fs.writeFileSync(path.join(dir, 'card-news-maker.html'), out);
// Also emit index.html so GitHub Pages serves the tool at the repo root URL.
fs.writeFileSync(path.join(dir, 'index.html'), out);
console.log('built card-news-maker.html + index.html', out.length, 'bytes');
