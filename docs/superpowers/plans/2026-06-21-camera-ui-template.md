# Camera UI Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a second, selectable "Camera UI" card-news template (5-card flow) to the existing One Prompt a Day card-news maker, while keeping the existing template intact.

**Architecture:** The maker is a single-file browser app (`card-news-maker.src.html`) built to `card-news-maker.html` by inlining two JS libraries. We add `state.template` ('classic' | 'camera'), a radio selector in the editor, a new CSS block for the camera cards, and a `buildCardsCamera()` builder that `buildCards()` dispatches to. The camera cover reuses the first uploaded image, cover-cropped to 1080×1350 via an offscreen canvas (html2canvas ignores `object-fit`, so we pre-crop — same technique the project already uses for plates).

**Tech Stack:** Vanilla HTML/CSS/JS, html2canvas + JSZip (inlined at build), Node for the build step, Inter + IBM Plex Mono (Google Fonts). No automated test framework — verification is visual in a browser (load built HTML, render, export PNG/ZIP).

**Spec:** `새-카드뉴스-템플릿-방향정리.md` (design system source: `C:\Users\jasonbae\Downloads\카메라 UI 카드뉴스 템플릿\카드뉴스 템플릿.dc.html`).

**Key decisions (locked):**
- Add as a selectable template; keep classic.
- Cover reuses the **first plate image** (cover-crop); plates show **all** images (contain-fit). First image therefore appears as cropped cover (slide 1) and full plate (slide 2).
- Camera readouts (`f/1.8 · 1/250 · ISO 100`, `● REC · AI-GEN`) are **fixed decorative defaults** — no input fields.
- Camera deck is fixed **1080×1350** (4:5) regardless of image ratio.

---

## File Structure

- **Modify:** `card-news-maker.src.html` — all source changes (state, editor UI, CSS, builders, wiring).
- **Create:** `_build-maker.js` — Node build script that inlines the libraries into `card-news-maker.html`.
- **Generate (build output):** `card-news-maker.html` — never hand-edit; produced by `_build-maker.js`.

All work happens in `card-news-maker.src.html`; every task ends by rebuilding and verifying in the browser.

---

## Task 0: Establish the build loop

**Files:**
- Create: `_build-maker.js`

- [ ] **Step 1: Create the build script**

Create `_build-maker.js`:

```js
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
console.log('built card-news-maker.html', out.length, 'bytes');
```

- [ ] **Step 2: Run the build**

Run (from project root): `node _build-maker.js`
Expected: `built card-news-maker.html <number> bytes` (number ~320000+), no error.

- [ ] **Step 3: Verify the built file runs**

Open `card-news-maker.html` in a browser. Drop 2–3 images, type a headline.
Expected: the existing classic deck renders on the right (cover + image cards + steps + insight + outro), and "↓ PNG" on a card downloads an image. This confirms the build loop works before we change anything.

- [ ] **Step 4: Commit**

```bash
git init 2>/dev/null; git add _build-maker.js card-news-maker.html
git commit -m "build: add node build script for card-news maker"
```
(If `git` is unavailable / not a repo and init fails, skip the commit steps throughout — this project may not be under git.)

---

## Task 1: Add template state + selector UI + dispatch

**Files:**
- Modify: `card-news-maker.src.html` (state object ~line 185; editor "기본" section ~line 138; `buildCards` ~line 304; `render`/wiring ~line 444)

- [ ] **Step 1: Add `template` to state**

In the `state` object, add the field (keep other fields unchanged):

```js
var state = {
  template: "classic",     // "classic" | "camera"
  handle: "@ssuperwasabi",
  date: "",
  headline: "",
  chain: "",
  imgcap: "",
  images: [],
  steps: [{tool:"",act:""}],
  insight: "",
  tags: ""
};
```

- [ ] **Step 2: Add the selector UI**

In the editor, immediately after `<div class="section-h">기본</div>` (before the 핸들 field), insert:

```html
<div class="field">
  <label>템플릿</label>
  <div class="tpl-pick">
    <label class="tpl-opt"><input type="radio" name="tpl" value="classic" checked> 기존 컨셉</label>
    <label class="tpl-opt"><input type="radio" name="tpl" value="camera"> 카메라 UI</label>
  </div>
</div>
```

- [ ] **Step 3: Add minimal styles for the selector**

In the `<style>` block (near `.field` rules), add:

```css
.tpl-pick{display:flex;gap:8px;}
.tpl-opt{display:flex;align-items:center;gap:6px;flex:1;border:1px solid var(--sb-stone-200);
  padding:8px 10px;font-size:13px;cursor:pointer;}
.tpl-opt input{accent-color:var(--sb-ink);}
```

- [ ] **Step 4: Make `buildCards` dispatch on template**

Rename the existing `buildCards` body to `buildCardsClassic`, then add a dispatcher. At the top of the existing `function buildCards(){`:

Change `function buildCards(){` to `function buildCardsClassic(){`, and add this new function right above it:

```js
function buildCards(){
  return state.template === "camera" ? buildCardsCamera() : buildCardsClassic();
}
```

- [ ] **Step 5: Add a temporary camera stub (replaced in later tasks)**

Add this stub (it will be fully implemented in Tasks 3–7):

```js
function buildCardsCamera(){
  return '<div class="empty">카메라 UI 템플릿 — 빌드 예정</div>';
}
```

- [ ] **Step 6: Wire the radio to state + re-render**

In the wiring section (after the other `bind(...)` calls), add:

```js
Array.prototype.forEach.call(document.querySelectorAll('input[name=tpl]'), function(r){
  r.onchange = function(){ if(this.checked){ state.template = this.value; render(); } };
});
```

- [ ] **Step 7: Build and verify the toggle**

Run: `node _build-maker.js`
Open `card-news-maker.html`. Add a couple images.
Expected:
- "기존 컨셉" selected → classic deck shows (unchanged).
- Click "카메라 UI" → deck area shows the stub text "카메라 UI 템플릿 — 빌드 예정".
- Switch back → classic deck returns.

- [ ] **Step 8: Commit**

```bash
git add card-news-maker.src.html card-news-maker.html
git commit -m "feat: add template selector (classic/camera) with dispatch"
```

---

## Task 2: Add the camera-template CSS

**Files:**
- Modify: `card-news-maker.src.html` (`<style>` block, after the `.empty` rule ~line 127)

- [ ] **Step 1: Append the camera CSS block**

Add this entire block at the end of the `<style>` section. All coordinates are at the production 1080×1350 size (the existing `.frame`/`.scaler` preview-scaling and html2canvas capture both operate on the full-size `.card`):

```css
/* ================= Camera UI template ================= */
/* shared 4:5 camera card baseline */
.card.cam{padding:0;border:1px solid var(--sb-border);}

/* --- 01 cover: viewfinder --- */
.card.cam-cover{background:#1c1c1e;border-color:#1c1c1e;}
.cam-cover .cam-img{position:absolute;inset:0;z-index:0;overflow:hidden;}
.cam-cover .cam-img img{width:1080px;height:1350px;display:block;}
.cam-cover .cam-scrim{position:absolute;inset:0;z-index:1;background:rgba(12,12,14,0.34);}
.cam-cover .cam-hud{position:absolute;inset:0;z-index:2;color:#FAFAFA;}
.cam-gv{position:absolute;top:0;bottom:0;width:1px;background:rgba(255,255,255,.26);}
.cam-gh{position:absolute;left:0;right:0;height:1px;background:rgba(255,255,255,.26);}
.cam-br{position:absolute;width:74px;height:74px;}
.cam-br.tl{top:48px;left:48px;border-top:3px solid #fff;border-left:3px solid #fff;}
.cam-br.tr{top:48px;right:48px;border-top:3px solid #fff;border-right:3px solid #fff;}
.cam-br.bl{bottom:48px;left:48px;border-bottom:3px solid #fff;border-left:3px solid #fff;}
.cam-br.brr{bottom:48px;right:48px;border-bottom:3px solid #fff;border-right:3px solid #fff;}
.cam-af{position:absolute;left:50%;top:360px;transform:translateX(-50%);width:360px;height:360px;}
.cam-af .c{position:absolute;width:46px;height:46px;}
.cam-af .c.tl{top:0;left:0;border-top:4px solid #fff;border-left:4px solid #fff;}
.cam-af .c.tr{top:0;right:0;border-top:4px solid #fff;border-right:4px solid #fff;}
.cam-af .c.bl{bottom:0;left:0;border-bottom:4px solid #fff;border-left:4px solid #fff;}
.cam-af .c.brr{bottom:0;right:0;border-bottom:4px solid #fff;border-right:4px solid #fff;}
.cam-af .cx{position:absolute;left:50%;top:50%;background:rgba(255,255,255,.92);}
.cam-af .cx.h{transform:translate(-50%,-50%);width:38px;height:2px;}
.cam-af .cx.v{transform:translate(-50%,-50%);width:2px;height:38px;}
.cam-af .aflabel{position:absolute;top:-48px;left:0;font-family:var(--sb-font-mono);font-size:24px;letter-spacing:.1em;color:#fff;}
.cam-top{position:absolute;top:84px;left:96px;right:96px;display:flex;align-items:center;justify-content:space-between;}
.cam-top .eb{font-weight:500;font-size:24px;letter-spacing:.16em;text-transform:uppercase;}
.cam-rec{font-family:var(--sb-font-mono);font-size:24px;letter-spacing:.08em;display:flex;align-items:center;gap:12px;}
.cam-rec .dot{width:16px;height:16px;border-radius:50%;background:#fff;display:inline-block;}
.cam-bottom{position:absolute;left:96px;right:96px;bottom:92px;}
.cam-readout{font-family:var(--sb-font-mono);font-size:24px;letter-spacing:.06em;color:rgba(255,255,255,.78);margin-bottom:22px;}
.cam-headline{font-weight:800;font-size:96px;line-height:1.0;letter-spacing:-0.04em;margin:0;}
.cam-headline .lt{font-weight:300;color:rgba(255,255,255,.85);}
.cam-chain{font-family:var(--sb-font-mono);font-size:30px;letter-spacing:.04em;margin-top:26px;}
.cam-cover .cam-rule{height:1px;background:rgba(255,255,255,.28);margin:30px 0 22px;border:0;}
.cam-cover .cam-foot{display:flex;align-items:center;justify-content:space-between;font-size:24px;color:rgba(255,255,255,.8);}
.cam-cover .cam-foot .handle{font-weight:500;}
.cam-cover .cam-foot .pageno{font-family:var(--sb-font-mono);letter-spacing:.06em;}

/* --- 03 workflow (1 card) --- */
.card.cam-wf{background:var(--sb-paper);color:var(--sb-ink);padding:96px;}
.cam-wf .topline{display:flex;align-items:baseline;justify-content:space-between;}
.cam-wf .eb{font-weight:500;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:var(--sb-stone-500);}
.cam-wf .pg{font-family:var(--sb-font-mono);font-size:24px;color:var(--sb-stone-500);}
.cam-wf .list{flex:1;display:flex;flex-direction:column;justify-content:center;gap:60px;}
.cam-wf .stepno{font-family:var(--sb-font-mono);font-size:26px;letter-spacing:.06em;color:var(--sb-stone-300);margin-bottom:10px;}
.cam-wf .tool{font-weight:700;font-size:66px;letter-spacing:-0.03em;line-height:1.0;}
.cam-wf .desc{font-weight:300;font-size:32px;line-height:1.45;color:#3f3f46;margin-top:12px;}
.cam-wf .wfrule{height:1px;background:var(--sb-stone-100);border:0;}
.cam-wf .foot{display:flex;align-items:center;justify-content:space-between;font-size:24px;color:var(--sb-stone-500);border-top:1px solid var(--sb-stone-100);padding-top:22px;}
.cam-wf .foot .handle{font-weight:500;}.cam-wf .foot .pageno{font-family:var(--sb-font-mono);}

/* --- 04 main body --- */
.card.cam-body{background:var(--sb-paper);color:var(--sb-ink);padding:96px;}
.cam-body .eb{font-weight:500;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:var(--sb-stone-500);}
.cam-body .pt{flex:1;display:flex;align-items:center;}
.cam-body .pt p{font-weight:300;font-size:66px;line-height:1.32;letter-spacing:-0.02em;margin:0;}
.cam-body .pt strong{font-weight:700;}
.cam-body .brule{height:1px;background:var(--sb-stone-100);border:0;margin-bottom:22px;}
.cam-body .foot{display:flex;align-items:center;justify-content:space-between;font-size:24px;color:var(--sb-stone-500);}
.cam-body .foot .handle{font-weight:500;}.cam-body .foot .pageno{font-family:var(--sb-font-mono);}

/* --- 05 outro / CTA --- */
.card.cam-cta{background:var(--sb-ink);color:var(--sb-paper);border-color:var(--sb-ink);padding:96px;}
.cam-cta .topline{display:flex;align-items:baseline;justify-content:space-between;}
.cam-cta .eb{font-weight:500;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:var(--sb-stone-300);}
.cam-cta .pg{font-family:var(--sb-font-mono);font-size:24px;color:var(--sb-stone-300);}
.cam-cta .mid{flex:1;display:flex;flex-direction:column;justify-content:center;}
.cam-cta .h{font-weight:800;font-size:84px;line-height:1.04;letter-spacing:-0.04em;margin:0 0 48px;}
.cam-cta .chips{display:flex;gap:20px;}
.cam-cta .chip{font-family:var(--sb-font-mono);font-size:30px;letter-spacing:.06em;border:2px solid var(--sb-paper);padding:16px 30px;}
.cam-cta .chip.fill{background:var(--sb-paper);color:var(--sb-ink);}
.cam-cta .tags{font-family:var(--sb-font-mono);font-size:26px;line-height:1.7;color:var(--sb-stone-300);margin-bottom:26px;}
.cam-cta .crule{height:1px;background:rgba(250,250,250,.2);border:0;margin-bottom:22px;}
.cam-cta .foot{display:flex;align-items:center;justify-content:space-between;font-size:30px;}
.cam-cta .foot .handle{font-weight:700;letter-spacing:-0.03em;}
.cam-cta .foot .mark{font-family:var(--sb-font-mono);font-size:24px;color:var(--sb-stone-300);}
```

- [ ] **Step 2: Build and verify CSS loads without breaking anything**

Run: `node _build-maker.js`
Open `card-news-maker.html`. Classic template must still render normally (the new CSS only defines new classes, so nothing existing changes).
Expected: classic deck unchanged; no console errors.

- [ ] **Step 3: Commit**

```bash
git add card-news-maker.src.html card-news-maker.html
git commit -m "feat: add camera template CSS (cover/workflow/body/cta)"
```

---

## Task 3: Cover-crop helper + camera cover card

**Files:**
- Modify: `card-news-maker.src.html` (add helper near `loadImage` ~line 215; `recomputeCardSize` ~line 239; replace `buildCardsCamera` stub)

- [ ] **Step 1: Force 1080×1350 for the camera template**

In `recomputeCardSize()`, add an early branch at the very top of the function body (before the existing `if(!state.images.length)` logic):

```js
function recomputeCardSize(){
  if(state.template === "camera"){
    CARD_H = 1350;
    document.documentElement.style.setProperty("--card-h", "1350px");
    return;
  }
  var W = 1080, CAP = 120, MIN = 566, MAX = 1350, cardH;
  // ... existing body unchanged ...
}
```

- [ ] **Step 2: Add the cover-crop cache + helper**

After `loadImage(...)` add:

```js
// Cover-crop the first image to WxH via canvas (html2canvas ignores object-fit,
// so we bake the crop into the pixels — same idea as the classic plate Fit).
var coverCropCache = { srcUrl: null, out: null };
function ensureCoverCrop(){
  if(state.template !== "camera" || !state.images.length){ return; }
  var src = state.images[0].url;
  if(coverCropCache.srcUrl === src && coverCropCache.out){ return; }   // already done
  var img = new Image();
  img.onload = function(){
    var W = 1080, H = 1350;
    var s = Math.max(W/img.width, H/img.height);
    var tw = Math.ceil(img.width*s), th = Math.ceil(img.height*s);
    var c = document.createElement("canvas"); c.width = W; c.height = H;
    var ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, Math.round((W-tw)/2), Math.round((H-th)/2), tw, th);
    coverCropCache = { srcUrl: src, out: c.toDataURL("image/jpeg", 0.9) };
    render();   // re-render now that the cropped cover is ready
  };
  img.src = src;
}
```

- [ ] **Step 3: Call `ensureCoverCrop()` from `render`**

At the top of `render()` (before `recomputeCardSize()`), add:

```js
function render(){
  ensureCoverCrop();
  recomputeCardSize();
  // ... existing body ...
}
```

- [ ] **Step 4: Add camera builder scaffolding + cover card**

Replace the `buildCardsCamera` stub with this (workflow/body/cta cards are added in Tasks 5–7; for now they are placeholders so the deck renders):

```js
function camHeadline(){
  // first line -> weight 800; following lines -> light (300). Empty -> placeholder.
  var lines = (state.headline||"Close-up\nportraits.").split("\n");
  var first = esc(lines.shift());
  var rest = lines.length ? '<br><span class="lt">'+esc(lines.join(" "))+'</span>' : '';
  return first + rest;
}

function buildCardsCamera(){
  var imgs = state.images;
  var steps = state.steps.filter(function(s){ return (s.tool||s.act); });
  var total = 1 + imgs.length + 1 + 1 + 1;   // cover + plates + workflow + body + cta
  var page = 0, html = "", id = 0;
  var date = esc(state.date||""), handle = esc(state.handle||"@ssuperwasabi");
  function frame(inner, capLabel){
    return '<div class="frame"><div class="scaler">'+inner+'</div>'+
      '<button class="dl" data-card="card'+id+'" data-name="1pd-card-'+("0"+page).slice(-2)+'.png">&#8595; PNG</button>'+
      '<span class="cap">'+("0"+page).slice(-2)+' &middot; '+capLabel+'</span></div>';
  }

  // ---- 01 cover (viewfinder) ----
  page++; id=page;
  var coverImg = coverCropCache.out
    ? '<div class="cam-img"><img src="'+coverCropCache.out+'" alt=""></div>'
    : (imgs.length ? '<div class="cam-img"><img src="'+imgs[0].url+'" style="object-fit:cover" alt=""></div>' : '');
  html += frame(
    '<div class="card cam cam-cover" id="card'+id+'">'+
      coverImg +
      '<div class="cam-scrim"></div>'+
      '<div class="cam-hud">'+
        '<div class="cam-gv" style="left:33.33%"></div><div class="cam-gv" style="left:66.66%"></div>'+
        '<div class="cam-gh" style="top:33.33%"></div><div class="cam-gh" style="top:66.66%"></div>'+
        '<div class="cam-br tl"></div><div class="cam-br tr"></div><div class="cam-br bl"></div><div class="cam-br brr"></div>'+
        '<div class="cam-af"><div class="aflabel">AF &middot; FACE</div>'+
          '<div class="c tl"></div><div class="c tr"></div><div class="c bl"></div><div class="c brr"></div>'+
          '<div class="cx h"></div><div class="cx v"></div></div>'+
        '<div class="cam-top"><span class="eb">One Prompt a Day</span>'+
          '<span class="cam-rec"><span class="dot"></span>REC &middot; AI-GEN</span></div>'+
        '<div class="cam-bottom">'+
          '<div class="cam-readout">f/1.8 &nbsp; 1/250 &nbsp; ISO 100</div>'+
          '<h2 class="cam-headline">'+camHeadline()+'</h2>'+
          (state.chain ? '<div class="cam-chain">'+nl2br(state.chain)+'</div>' : '')+
          '<hr class="cam-rule">'+
          '<div class="cam-foot"><span class="handle">'+handle+'</span><span class="pageno">'+pp(page,total)+'</span></div>'+
        '</div>'+
      '</div>'+
    '</div>', 'cover');

  // ---- plates (placeholder until Task 4) ----
  // ---- workflow / body / cta (placeholder until Tasks 5-7) ----
  return html;
}
```

- [ ] **Step 5: Build and verify the cover**

Run: `node _build-maker.js`
Open `card-news-maker.html`, select **카메라 UI**, drop a portrait image, type a 2-line headline (e.g. `Close-up` then Enter then `portraits.`).
Expected: a 4:5 dark cover renders with the photo full-bleed, 3×3 grid lines, 4 corner brackets, center AF·FACE box with crosshair, `One Prompt a Day` / `● REC · AI-GEN` top row, `f/1.8 1/250 ISO 100` readout, headline (line 1 bold / line 2 light), and footer `@ssuperwasabi 01 / 05`.

- [ ] **Step 6: Verify cover PNG export (crop correctness)**

Hover the cover, click "↓ PNG". Open the downloaded PNG.
Expected: 1080×1350 PNG; the photo is cover-cropped (fills frame, not stretched); all HUD elements present and sharp. (If the image looks stretched, the crop cache didn't apply — confirm `ensureCoverCrop` ran and `render()` was called again.)

- [ ] **Step 7: Commit**

```bash
git add card-news-maker.src.html card-news-maker.html
git commit -m "feat: camera cover card (viewfinder) with cover-crop helper"
```

---

## Task 4: Camera image plates

**Files:**
- Modify: `card-news-maker.src.html` (`buildCardsCamera`, replace the plates placeholder)

- [ ] **Step 1: Add the plate loop**

Replace the `// ---- plates (placeholder until Task 4) ----` comment with (reuses the existing `.card.image` contain-fit logic and 120px caption bar):

```js
  var areaW = 1080, areaH = 1350 - 120;
  imgs.forEach(function(d, k){
    page++; id=page;
    var s = Math.min(areaW/d.w, areaH/d.h);
    var iw = Math.round(d.w*s), ih = Math.round(d.h*s);
    var cap = state.imgcap ? esc(state.imgcap) : ('Plate '+("0"+(k+1)).slice(-2)+' / '+("0"+imgs.length).slice(-2));
    html += frame(
      '<div class="card image" id="card'+id+'">'+
        '<div class="media-wrap"><img class="media" style="width:'+iw+'px;height:'+ih+'px" src="'+d.url+'" alt=""></div>'+
        '<div class="cap-bar"><span class="cap-line">'+cap+'</span>'+
        '<span class="cap-sig">'+handle+' &middot; '+pp(page,total)+'</span></div>'+
      '</div>', 'plate '+(k+1));
  });
```

- [ ] **Step 2: Build and verify plates**

Run: `node _build-maker.js`
Open, select 카메라 UI, drop 3 images.
Expected: after the cover, 3 plate cards render at 1080×1350 with the image contained (no crop, paper margins) and a bottom mono caption bar (`Plate 01 / 03` … or your common caption) + `@ssuperwasabi · NN / total`. Page numbers increment correctly.

- [ ] **Step 3: Commit**

```bash
git add card-news-maker.src.html card-news-maker.html
git commit -m "feat: camera image plates (contain-fit + caption bar)"
```

---

## Task 5: Workflow card (N steps → 1 card)

**Files:**
- Modify: `card-news-maker.src.html` (`buildCardsCamera`, add before the `return html;`)

- [ ] **Step 1: Add the workflow card builder**

Replace the `// ---- workflow / body / cta (placeholder until Tasks 5-7) ----` line with the workflow block (body + cta added in Tasks 6–7):

```js
  // ---- 03 workflow (single card, up to 3 steps) ----
  page++; id=page;
  var wfRows = "";
  var shown = steps.slice(0,3);
  if(!shown.length){ shown = [{tool:"",act:""}]; }
  shown.forEach(function(s, i){
    if(i>0){ wfRows += '<hr class="wfrule">'; }
    wfRows += '<div>'+
      '<div class="stepno">'+("0"+(i+1)).slice(-2)+'</div>'+
      '<div class="tool">'+(esc(s.tool)||'&nbsp;')+'</div>'+
      (s.act ? '<div class="desc">'+esc(s.act)+'</div>' : '')+
    '</div>';
  });
  html += frame(
    '<div class="card cam-wf" id="card'+id+'">'+
      '<div class="topline"><span class="eb">Workflow</span><span class="pg">'+pp(page,total)+'</span></div>'+
      '<div class="list">'+wfRows+'</div>'+
      '<div class="foot"><span class="handle">'+handle+'</span><span class="pageno">'+pp(page,total)+'</span></div>'+
    '</div>', 'workflow');
```

- [ ] **Step 2: Build and verify**

Run: `node _build-maker.js`
Open, select 카메라 UI, add images, and in 워크플로우 add up to 3 steps (e.g. `Gemini / 레퍼런스 & 컨셉`, `GPT Image2 / 인물 모델 생성`, `Magnific / 업스케일 & 디테일`).
Expected: one workflow card with `Workflow` eyebrow, the steps stacked (mono number + bold tool name + light description) separated by thin rules, vertically centered, footer present. A 4th+ step is ignored (only first 3 shown).

- [ ] **Step 3: Commit**

```bash
git add card-news-maker.src.html card-news-maker.html
git commit -m "feat: camera workflow card (steps consolidated to one card)"
```

---

## Task 6: Main body card

**Files:**
- Modify: `card-news-maker.src.html` (`buildCardsCamera`, add after the workflow block)

- [ ] **Step 1: Add the body card builder**

Add directly after the workflow block:

```js
  // ---- 04 main body ----
  page++; id=page;
  html += frame(
    '<div class="card cam-body" id="card'+id+'">'+
      '<span class="eb">The Point</span>'+
      '<div class="pt"><p>'+(mdBold(state.insight)||'&nbsp;')+'</p></div>'+
      '<hr class="brule">'+
      '<div class="foot"><span class="handle">'+handle+'</span><span class="pageno">'+pp(page,total)+'</span></div>'+
    '</div>', 'body');
```

- [ ] **Step 2: Build and verify**

Run: `node _build-maker.js`
Open, select 카메라 UI, type into 인사이트 / 한마디 with a `**bold**` keyword (e.g. `The close-up is the **hardest shot** to get right with AI.`).
Expected: a paper card with `The Point` eyebrow, large light (300) body text, the `**...**` portion bold (700), centered vertically, footer present.

- [ ] **Step 3: Commit**

```bash
git add card-news-maker.src.html card-news-maker.html
git commit -m "feat: camera main body card"
```

---

## Task 7: Outro / CTA card

**Files:**
- Modify: `card-news-maker.src.html` (`buildCardsCamera`, add after the body block, before `return html;`)

- [ ] **Step 1: Add the CTA card builder**

Add directly after the body block:

```js
  // ---- 05 outro / CTA ----
  page++; id=page;
  var tags = (state.tags||"").trim();
  if(tags && !/#SSUPERWASABI/i.test(tags)) tags += " #SSUPERWASABI";
  if(!tags) tags = "#SSUPERWASABI";
  html += frame(
    '<div class="card cam-cta" id="card'+id+'">'+
      '<div class="topline"><span class="eb">One Prompt a Day</span><span class="pg">'+pp(page,total)+'</span></div>'+
      '<div class="mid">'+
        '<h2 class="h">Save it for<br>your next<br>shoot.</h2>'+
        '<div class="chips"><span class="chip">&darr; SAVE</span><span class="chip fill">+ FOLLOW</span></div>'+
      '</div>'+
      '<div class="tags">'+esc(tags)+'</div>'+
      '<hr class="crule">'+
      '<div class="foot"><span class="handle">'+handle+'</span><span class="mark mono">1pd</span></div>'+
    '</div>', 'outro');
```

- [ ] **Step 2: Build and verify the full 5+ card deck**

Run: `node _build-maker.js`
Open, select 카메라 UI, fill everything (handle, date, headline 2 lines, chain, 3 images, 3 steps, insight, tags).
Expected, in order: **cover → 3 plates → workflow → body → CTA** (total `1+3+1+1+1 = 7`, page numbers `01/07`…`07/07`). CTA is a black card with the headline, `↓ SAVE` (outline) + `+ FOLLOW` (filled) chips, hashtags (with `#SSUPERWASABI` appended), footer `@ssuperwasabi` + `1pd`.

- [ ] **Step 3: Commit**

```bash
git add card-news-maker.src.html card-news-maker.html
git commit -m "feat: camera outro/CTA card — completes 5-card flow"
```

---

## Task 8: Full-deck export + cross-template regression

**Files:**
- Modify: none expected (verification task; fix only if a defect surfaces)

- [ ] **Step 1: Verify ZIP export for the camera deck**

In 카메라 UI mode with a full deck, click "↓ 전체 다운로드 (ZIP)".
Expected: a ZIP with one PNG per card (7 for the example), each 1080×1350, named `1pd-card-01.png`…. Open 2–3 PNGs: cover crop correct, plates uncropped, text sharp.

- [ ] **Step 2: Verify the classic template still works (regression)**

Switch to **기존 컨셉**. Confirm the classic deck builds and a card PNG downloads.
Expected: classic output identical to before this plan (cover ink + image cards + step cards + insight + outro, auto-height from image ratio).

- [ ] **Step 3: Verify empty-state safety**

In 카메라 UI mode with **no images**: expected the cover shows on the dark background with HUD/headline (no photo) and no JS error; deck still builds (cover + workflow + body + cta = 4 cards). Switching templates back and forth does not throw.

- [ ] **Step 4: (Optional) headless check**

If `puppeteer-core` is installed (`npm i puppeteer-core`), run the existing `node _test-download.js` against `card-news-maker.html` to confirm downloads work headless. Skip if not installed.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "test: verify camera deck export + classic regression"
```

---

## Task 9: Final build + spec sync

**Files:**
- Modify: `새-카드뉴스-템플릿-방향정리.md` (mark build items done)

- [ ] **Step 1: Final rebuild**

Run: `node _build-maker.js`
Expected: `built card-news-maker.html <bytes>`.

- [ ] **Step 2: Update the spec doc**

In `새-카드뉴스-템플릿-방향정리.md`, check off the items under "## 5. 다음 할 일" that are now complete (template selector, 5-card build, cover fields, html2canvas verified, build reflected).

- [ ] **Step 3: Commit**

```bash
git add card-news-maker.html 새-카드뉴스-템플릿-방향정리.md
git commit -m "docs: mark camera template implementation complete"
```

---

## Notes & risks for the implementer

- **html2canvas + object-fit:** never rely on `object-fit` for captured images. The cover uses a pre-cropped canvas dataURL (`ensureCoverCrop`); plates use pre-computed width/height (contain). The preview-only fallback (`style="object-fit:cover"`) is acceptable on screen but the crop cache must be ready before PNG export — `ensureCoverCrop()` calls `render()` again when the crop finishes.
- **Async crop timing:** `ensureCoverCrop` is async; the first render of a new first-image may briefly show the uncropped fallback, then re-render. This is expected and resolves in milliseconds.
- **Rounded REC dot:** the `border-radius:50%` REC dot is the one intentional curve, matching the user's design source; everything else stays radius 0.
- **Headline weight rule:** camera cover headline = line 1 weight 800, remaining lines weight 300 (light). Authors get the bold/light contrast by writing two lines. Document this in the editor hint if desired.
- **Fonts in capture:** `captureCard` already awaits `document.fonts.ready`; Inter/IBM Plex Mono weights (300/700/800) load via the existing Google Fonts link — no change needed.
```
