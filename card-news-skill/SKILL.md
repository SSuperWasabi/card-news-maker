---
name: card-news
description: Turn a "One Prompt a Day" (1pd) post — or any short AI-workflow writeup — into a swipeable StudioBlank-style card news deck (1080×1080 square cards) as a self-contained HTML file with built-in per-card and bulk PNG download. Use whenever Jason wants to visualize a 1pd post as card news, make Instagram/Threads carousel cards, or "카드뉴스" from an AI workflow. Trigger on: "카드뉴스", "카드 뉴스", "card news", "1pd 카드", "카드뉴스 만들어", "카드로 만들어", "carousel", "캐러셀", "슬라이드 만들어", or any request to turn a 1pd post / AI workflow into square social cards. Often runs right after the 1pd skill produces a post.
user-invocable: true
---

# One Prompt a Day — Card News Generator

Turn a **1pd post** into a **StudioBlank-styled card news deck**: a sequence of
1080×1080 square cards, output as one self-contained HTML file that previews every
card and exports each (or all) to PNG client-side. Built for @ssuperwasabi's
Instagram/Threads carousels.

The visual language is **StudioBlank** — ultra-minimal, monochrome, sharp-edged,
type-driven. The text does the work; nothing decorative survives.

## Files in this skill

- `card-news.css` — self-contained StudioBlank token system tuned for 1080² cards. No external dependency.
- `template.html` — a complete, working 7-card reference deck (the niji7 example post, with an image-showcase card) and the PNG export engine already wired. **Clone this structure** for every new deck.
- `html2canvas.min.js` + `jszip.min.js` — **bundled locally**; copy BOTH next to every generated HTML. html2canvas rasterizes each card; JSZip bundles a full deck into one ZIP download.

## How to produce a deck

1. **Get the post.** Use the 1pd post the user just wrote, or ask them to paste one.
   If they only give raw workflow notes, write the 1pd post first (or invoke the `1pd` skill), then proceed.
2. **Decompose** the post into a card sequence (see mapping below).
3. **Generate the HTML.** Copy `card-news.css` next to a new HTML file in the user's
   working directory (default: their current folder, e.g. the "Card news" folder).
   Build the HTML by cloning `template.html`'s structure and swapping in the new content —
   keep the `<script>` export engine and `.frame/.scaler/.card` wrapping **exactly** as-is.
4. **Tell the user to open it** in a browser, hover any card for its `↓ PNG` button, or
   click **Download all PNG** in the toolbar. Files save as `1pd-card-01.png` … `-NN.png`.

Name the output file after the post, e.g. `1pd-2026-02-28-niji7.html`.

## 1pd post → card mapping

A standard deck is **5–7 cards**. Map the post like this:

| Card | Type | Source line(s) from the post | Notes |
|------|------|------------------------------|-------|
| 1 | **Cover** (`.card.ink`) | Date + core description (the one-line achievement) + tool chain | Headline = the transformation ("2D art → 3D animated video."). Chain in mono below. |
| 2…k | **Image showcase** (`.card.image`) | The actual generated image(s) from the inbox | **One image per card, always — swipe-style. Never grid / contact-sheet.** Each generation gets its own full-bleed `<img class="media">` with a mono caption below (`tool · subject · medium`). Render every image supplied, in order. These are the heart of the deck. |
| k+1…N | **Step** (`.card`) | One per `Workflow:` item | `tool` = tool name (big), `action` = the action phrase. `stepno` = `01 / N`. |
| N+1 | **Insight** (`.card`) | The insight / reflection line | Quiet, large, weight-300. Bold the punchy clause with `<strong>`. |
| last | **Outro** (`.card.ink`) | Hashtags + closing line | "One Prompt a Day" wordmark, the 5 hashtags, the warm closer as the topline date slot. |

Deck order: **Cover → Image showcase (1 per image) → Steps → Insight → Outro.**
Card count is flexible and scales with the number of images — Jason regularly posts up
to ~10 generations, each on its own card. Stay within the platform carousel limit
(**Instagram / Threads: 20 images max**). If a gallery is large, keep the workflow lean
(merge trivial steps) so the images get the room — but **never compress images into a grid.**
A text-only deck (no media supplied) runs **5–7 cards** and skips the showcase.

Rules of thumb:
- **One workflow step = one card.** If a post has 1–2 trivial steps, you may merge into a single step card, but prefer one-per-step — swiping is the format.
- Keep the **cover headline to ≤ 6 words across ≤ 3 lines.** Break lines deliberately with `<br>`; arrows (`→`) get `<em>` (light weight).
- Tool names stay in English. Body language follows the post's language (English default; Korean only if the post is Korean).
- Every card's footer is **text-only**: `@ssuperwasabi` + `NN / total` page number. Keep page numbers correct and sequential.
- **Never use the StudioBlank square mark** (the ink square with a cut corner). It belongs to the original design-system author, not Jason. Jason has no personal logo yet — keep the footer purely typographic until he does. If/when a personal mark exists, swap it into the `.foot` slot.
- `#SSUPERWASABI` is always present on the outro card, last.

## Working with media & the inbox

New (unposted) content is the common case. Preferred input is **one folder per post**:

```
inbox/<YYYY-MM-DD-slug>/
  post.md          # workflow text / draft caption / tool chain / notes
  cover.png        # hero generated image
  01.png 02.png …  # additional generated images
  video-still.png  # a representative FRAME pulled from a video
  notes.txt        # anything extra (optional)
```

The user gives a folder path; read everything in it and build the deck. A `post.md`
template lives at `inbox/_TEMPLATE/post.md`.

Media handling rules:
- **Images → embed as base64 on a background-image div** (NOT `<img>`):
  `<div class="media" style="background-image:url('data:image/<type>;base64,…')"></div>`.
  Two reasons: (1) html2canvas ignores `object-fit` and stretches `<img>` to the box,
  distorting aspect ratio — `background-size:cover` is rendered correctly; (2) a local
  `file://` image path taints the canvas and breaks export. Base64 also keeps the HTML
  self-contained and offline-safe.
- **Video → still + words.** This skill cannot watch video. Use the supplied
  `video-still.png` (or ask for a frame) as an image-showcase card, and describe the
  motion in the caption / a step card. Never claim to have viewed the video.
- **One image = one card, always.** Render every image in the folder as its own
  full-bleed card, in order. Never merge images into a grid or contact sheet — each piece
  is crafted and deserves its own slide. The user curates by what they place in the inbox,
  not by you dropping images. (If the count would blow past the 20-image carousel limit,
  flag it and ask which to cut — don't silently drop or grid them.)
- Image-card caption format: `tool · subject · medium` in mono, e.g.
  `Midjourney v7 · foggy harbor · 35mm`. Keep it short and factual.
- If no media is supplied, build a clean text-only deck and tell the user they can add
  a folder of images next time to get showcase cards.

Image-card markup (clone from `template.html` card 02; swap the placeholder for the img):
```html
<div class="card image" id="cN">
  <div class="media" style="background-image:url('data:image/jpeg;base64,…')"></div>
  <div class="cap-bar">
    <span class="cap-line">Plate 01 / 12 · GPT Image2 → Magnific</span>
    <span class="cap-sig">@ssuperwasabi · 02 / 18</span>
  </div>
</div>
```

## Non-negotiables (StudioBlank — break these and the brand breaks)

1. **`border-radius: 0` everywhere.** No rounded corners, ever.
2. **No shadows.** Depth = whitespace + 1px borders only.
3. **One typeface + mono.** Inter for everything; IBM Plex Mono for dates, page numbers, chain, hashtags. **No second color** — ink `#0A0A0A` on paper `#FAFAFA`, plus the ink-card inverse.
4. **No emoji, no decorative icons, no illustrations, no gradients, no patterns.** (The post's `:)` closer is allowed as literal text — it is copy, not an emoji graphic.)
5. **Generous whitespace.** Cards use 96px padding and `.grow` spacers to push content apart. Let them breathe.
6. **Weight contrast before size.** Inter 300 vs 700 builds the hierarchy.
7. **Editorial voice.** No exclamation marks, no marketing adjectives, no "Welcome to…".
8. Alternate rhythm: **ink cover → paper steps/insight → ink outro** reads as a clean open/close.

## Mechanics you must preserve

- The `.card` is the **only** thing exported. The `↓ PNG` button lives in `.frame` (outside `.card`) so it never appears in the image.
- Each card sits inside `.scaler` (CSS transform for on-screen preview). The export
  **clones the card off-screen with transform removed**, so PNGs are always exact
  1080×1080 — do not change this in the `<script>`.
- `html2canvas` is bundled **locally** — ship `html2canvas.min.js` (in this skill folder)
  next to every generated HTML and reference it with `<script src="html2canvas.min.js">`.
  Do NOT rely on a CDN: ad-blockers / corporate networks silently block it, which kills
  every download button. The deck guards with an `alert()` if the library is missing.
- Save PNGs via `canvas.toBlob()` + `URL.createObjectURL()` (see `saveBlob` in the
  template) — **never `toDataURL()`**. Multi-MB PNG data URLs are silently dropped by
  Chrome's programmatic download, which looks like a dead button.
- **Download-all = ONE ZIP** (JSZip), not a loop of N saves. A loop of separate downloads
  trips Chrome's "multiple automatic downloads" block. `dlAll()` renders every card, adds
  each PNG to a `JSZip`, then `saveBlob`s a single `.zip`.
- Before capture, `await img.decode()` on every `<img>` in the cloned card, or image
  cards may rasterize blank.
- **Generator-script gotcha:** if you build a deck via a PowerShell `.ps1`, keep the
  script **ASCII-only** — Windows PowerShell 5.1 reads a no-BOM UTF-8 script in the local
  ANSI codepage and mangles literal `…`/`→`/`↓`/`·`/`—`, which corrupts the inline JS into
  a `SyntaxError` that kills every button. Use HTML entities (`&mdash; &rarr; &darr;
  &middot;`) for display glyphs and plain ASCII in JS strings. Sanity-check with
  `node --check` on the extracted `<script>` before shipping.

## When invoked with no post

Ask for the 1pd post (or the raw workflow + any attached media description), confirm the
card count and language, then generate. Default to the StudioBlank look and 1080² unless
the user asks otherwise.
