$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$proj  = "C:\Users\sodad\Downloads\One Prompt a Day Card news"
$indir = "$proj\inbox\2026-05-30-post1"
$out   = "$proj\1pd-2026-05-30-portraits.html"
$skill = "C:\Users\sodad\.claude\skills\card-news"

# bring css + local libs next to the deck
Copy-Item "$skill\card-news.css"      "$proj\card-news.css"      -Force
Copy-Item "$skill\html2canvas.min.js" "$proj\html2canvas.min.js" -Force
Copy-Item "$skill\jszip.min.js"       "$proj\jszip.min.js"       -Force

# images sorted by trailing number (drop / generation order)
$imgs = Get-ChildItem $indir -Filter *.png | Sort-Object {
  if ($_.BaseName -match '(\d+)\s*$') { [int]$Matches[1] } else { 0 }
}

# Center-cover crop to EXACTLY $bw x $bh, then JPEG-encode to base64.
# Pre-cropping to the media box aspect is what prevents html2canvas from
# distorting the image (it stretches any image to its box; a pre-cropped
# image already matches the box, so the stretch is a 1:1 no-op).
function To-Base64JpegCover($path, $bw, $bh, $quality) {
  $img = [System.Drawing.Image]::FromFile($path)
  try {
    $sw = $img.Width; $sh = $img.Height
    $scale = [Math]::Max($bw / $sw, $bh / $sh)
    $tw = [int][Math]::Ceiling($sw * $scale); $th = [int][Math]::Ceiling($sh * $scale)
    $ox = [int](($bw - $tw) / 2); $oy = [int](($bh - $th) / 2)
    $bmp = New-Object System.Drawing.Bitmap $bw, $bh
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, $ox, $oy, $tw, $th)   # scaled to cover; bitmap bounds crop it
    $g.Dispose()
    $ms = New-Object System.IO.MemoryStream
    $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $ep = New-Object System.Drawing.Imaging.EncoderParameters 1
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
    $bmp.Save($ms, $enc, $ep)
    $bytes = $ms.ToArray()
    $ms.Dispose(); $bmp.Dispose()
    return [Convert]::ToBase64String($bytes)
  } finally { $img.Dispose() }
}

$nImg  = $imgs.Count
$total = 1 + $nImg + 3 + 1 + 1   # cover + images + 3 steps + insight + outro
$pp = { param($n) ('{0:00} / {1:00}' -f $n, $total) }
$pad = { param($n) ('{0:00}' -f $n) }

$sb = New-Object System.Text.StringBuilder
$page = 0
function Add-Card($html) { [void]$script:sb.Append($html) }

# ---- 01 COVER ----
$page++
Add-Card @"
    <div class="frame"><div class="scaler">
      <div class="card ink" id="c$page">
        <div class="topline"><span class="eyebrow">One Prompt a Day</span><span class="date mono">2026.05.30</span></div>
        <div class="grow"></div>
        <h2 class="headline">Close-up<br>portraits &mdash;<br><em>every</em> detail.</h2>
        <div class="chain mt-4">Gemini &rarr; GPT Image2 &rarr; Magnific</div>
        <div class="grow"></div>
        <hr class="rule mb-4">
        <div class="foot"><span class="handle">@ssuperwasabi</span><span class="pageno">$(& $pp $page)</span></div>
      </div>
    </div><button class="dl" onclick="dl('c$page','1pd-card-$(& $pad $page).png')">&darr; PNG</button>
    <span class="cap">$(& $pad $page) &middot; cover</span></div>
"@

# ---- IMAGE CARDS (one per image, swipe-style) ----
$plate = 0
foreach ($f in $imgs) {
  $page++; $plate++
  Write-Host "embedding $plate/$nImg : $($f.Name)"
  $b64 = To-Base64JpegCover $f.FullName 1080 960 88
  $plateLbl = 'Plate {0:00} / {1:00} &middot; GPT Image2 &rarr; Magnific' -f $plate, $nImg
  Add-Card @"
    <div class="frame"><div class="scaler">
      <div class="card image" id="c$page">
        <img class="media" src="data:image/jpeg;base64,$b64" alt="">

        <div class="cap-bar"><span class="cap-line">$plateLbl</span><span class="cap-sig">@ssuperwasabi &middot; $(& $pp $page)</span></div>
      </div>
    </div><button class="dl" onclick="dl('c$page','1pd-card-$(& $pad $page).png')">&darr; PNG</button>
    <span class="cap">$(& $pad $page) &middot; plate $plate</span></div>
"@
}

# ---- WORKFLOW STEPS ----
$steps = @(
  @{ tool = 'Gemini';     act = 'Prompt crafting' },
  @{ tool = 'GPT Image2'; act = 'Close-up model shot generation' },
  @{ tool = 'Magnific';   act = 'Skin texture &amp; detail enhancement' }
)
$si = 0
foreach ($s in $steps) {
  $page++; $si++
  $stepLbl = '{0:00} / {1:00}' -f $si, $steps.Count
  Add-Card @"
    <div class="frame"><div class="scaler">
      <div class="card" id="c$page">
        <div class="topline"><span class="eyebrow">Workflow</span><span class="stepno mono">$stepLbl</span></div>
        <div class="grow"></div>
        <h2 class="tool">$($s.tool)</h2>
        <p class="action mt-3">$($s.act)</p>
        <div class="grow"></div>
        <hr class="rule mb-4">
        <div class="foot"><span class="handle">@ssuperwasabi</span><span class="pageno">$(& $pp $page)</span></div>
      </div>
    </div><button class="dl" onclick="dl('c$page','1pd-card-$(& $pad $page).png')">&darr; PNG</button>
    <span class="cap">$(& $pad $page) &middot; step</span></div>
"@
}

# ---- INSIGHT ----
$page++
Add-Card @"
    <div class="frame"><div class="scaler">
      <div class="card" id="c$page">
        <span class="eyebrow">Takeaway</span>
        <div class="grow"></div>
        <p class="insight">The close-up is the hardest shot to get right with AI. Skin, eyes, fabric detail &mdash; everything is exposed at this range. <strong>GPT Image2 keeps holding up.</strong></p>
        <div class="grow"></div>
        <hr class="rule mb-4">
        <div class="foot"><span class="handle">@ssuperwasabi</span><span class="pageno">$(& $pp $page)</span></div>
      </div>
    </div><button class="dl" onclick="dl('c$page','1pd-card-$(& $pad $page).png')">&darr; PNG</button>
    <span class="cap">$(& $pad $page) &middot; insight</span></div>
"@

# ---- OUTRO ----
$page++
Add-Card @"
    <div class="frame"><div class="scaler">
      <div class="card ink" id="c$page">
        <div class="topline"><span class="eyebrow">One Prompt a Day</span><span class="date mono">2026.05.30</span></div>
        <div class="grow"></div>
        <div class="wordmark">One Prompt<br>a Day<em>.</em></div>
        <div class="tags mt-5">#gptimage2 #magnific<br>#AIphotography #portraitAI<br>#SSUPERWASABI</div>
        <div class="grow"></div>
        <hr class="rule mb-4">
        <div class="foot"><span class="handle">@ssuperwasabi</span><span class="pageno">$(& $pp $page)</span></div>
      </div>
    </div><button class="dl" onclick="dl('c$page','1pd-card-$(& $pad $page).png')">&darr; PNG</button>
    <span class="cap">$(& $pad $page) &middot; outro</span></div>
"@

$cards = $sb.ToString()

# ---- page template (ASCII only; display glyphs via HTML entities) ----
$tpl = @'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>One Prompt a Day &mdash; 2026.05.30 &middot; Close-up portraits</title>
<link rel="stylesheet" href="card-news.css">
<script src="html2canvas.min.js"></script>
<script src="jszip.min.js"></script>
</head>
<body>
  <div class="page-head">
    <h1>One Prompt a Day &mdash; 2026.05.30 &middot; Close-up portraits</h1>
    <p>StudioBlank system &middot; 1080&times;1080 &middot; __NCARDS__ cards &middot; hover a card for its PNG button</p>
  </div>
  <div class="toolbar">
    <button class="btn" onclick="dlAll()">&darr; Download all (ZIP)</button>
    <button class="btn secondary" onclick="window.print()">Print / PDF</button>
    <div class="spacer"></div>
    <div class="status mono" id="status">ready &middot; __NCARDS__ cards</div>
  </div>
  <div class="deck" id="deck">
__CARDS__
  </div>
<script>
  const statusEl = document.getElementById('status');
  const setStatus = (t) => { statusEl.textContent = t; };

  async function captureCard(card) {
    if (document.fonts && document.fonts.ready) { await document.fonts.ready; }
    const holder = document.createElement('div');
    holder.style.cssText = 'position:fixed;left:-99999px;top:0;width:1080px;height:1080px;margin:0;padding:0;';
    const clone = card.cloneNode(true);
    clone.style.transform = 'none';
    holder.appendChild(clone);
    document.body.appendChild(holder);
    const imgs = clone.querySelectorAll('img');
    await Promise.all(Array.prototype.map.call(imgs, function (img) {
      return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    }));
    try {
      return await html2canvas(clone, { scale: 1, backgroundColor: null, useCORS: true, logging: false, width: 1080, height: 1080 });
    } finally { document.body.removeChild(holder); }
  }

  // Save via Blob + objectURL (not toDataURL): large data URLs are dropped by Chrome.
  function saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  }

  async function dl(id, filename) {
    try {
      if (typeof html2canvas === 'undefined') { setStatus('error: html2canvas not loaded'); alert('html2canvas.min.js not loaded. Keep it next to this HTML file.'); return; }
      setStatus('rendering ' + filename + ' ...');
      const canvas = await captureCard(document.getElementById(id));
      const blob = await new Promise(function (res, rej) {
        canvas.toBlob(function (b) { b ? res(b) : rej(new Error('toBlob returned null')); }, 'image/png');
      });
      saveBlob(blob, filename);
      setStatus('saved ' + filename);
    } catch (e) { setStatus('error: ' + e.message); console.error(e); }
  }

  // Bundle every card into ONE zip = a single download. Avoids Chrome's
  // "multiple automatic downloads" block that kills a loop of separate saves.
  async function dlAll() {
    try {
      if (typeof html2canvas === 'undefined') { setStatus('error: html2canvas not loaded'); alert('html2canvas.min.js not loaded.'); return; }
      if (typeof JSZip === 'undefined') { setStatus('error: JSZip not loaded'); alert('jszip.min.js not loaded.'); return; }
      const cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
      const zip = new JSZip();
      for (let i = 0; i < cards.length; i++) {
        setStatus('rendering ' + (i + 1) + ' / ' + cards.length + ' ...');
        const canvas = await captureCard(cards[i]);
        const blob = await new Promise(function (res, rej) {
          canvas.toBlob(function (b) { b ? res(b) : rej(new Error('toBlob returned null')); }, 'image/png');
        });
        zip.file('1pd-card-' + String(i + 1).padStart(2, '0') + '.png', blob);
      }
      setStatus('zipping ' + cards.length + ' cards ...');
      const out = await zip.generateAsync({ type: 'blob' });
      saveBlob(out, '1pd-2026-05-30-portraits.zip');
      setStatus('done: zip saved (' + cards.length + ' cards)');
    } catch (e) { setStatus('error: ' + e.message); console.error(e); }
  }
</script>
</body>
</html>
'@

$html = $tpl.Replace('__CARDS__', $cards).Replace('__NCARDS__', "$total")
[System.IO.File]::WriteAllText($out, $html, (New-Object System.Text.UTF8Encoding($false)))
"OK - $total cards - {0:N1} MB" -f ((Get-Item $out).Length / 1MB)
