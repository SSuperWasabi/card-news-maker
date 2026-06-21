# StudioBlank Design System

> **Whitespace is the design.** An ultra-minimal system for photographer and visual artist portfolios. Every UI element recedes so the work commands attention.

---

## Index

| Path | Purpose |
|------|---------|
| `colors_and_type.css` | Color & typography CSS variables — drop into any page |
| `preview/` | Design-system preview cards (one per token/component cluster) |
| `assets/` | Logo mark + wordmark SVGs |
| `ui_kits/portfolio/` | High-fidelity portfolio site recreation (React/JSX) |
| `SKILL.md` | Skill manifest — makes this folder usable as an Agent Skill |
| `uploads/studioblank-DESIGN.md` | Original brief from the user |

### UI kits
- **`ui_kits/portfolio/`** — photographer/artist portfolio site. Open `index.html` for a click-through prototype with Work, Project Detail, About, Contact screens.

### Sources
The system was authored from the single brief at `uploads/studioblank-DESIGN.md`. No external Figma/codebase was provided. Components were synthesized from the brief's tables and Do's & Don'ts.

---

## Brand at a Glance

StudioBlank is a fictional/template practice — a photography studio publishing under its own imprint. The voice is editorial, restrained, and confident. Typography and white space carry every job that ornament would carry elsewhere. **One typeface (Inter), one accent (ink), zero radius, zero shadow.**

---

## Content Fundamentals

**Tone.** Editorial, quiet, declarative. Curatorial — the way a museum wall label reads. Never marketing-speak; never exclamation marks; never emoji.

**Voice.** Third-person about the studio ("the studio publishes…"); second-person sparingly when speaking *to* the visitor ("Tell us about your project."). Avoid the corporate "we" except where the studio is clearly a collective. First-person singular is acceptable on About / artist statements.

**Casing.**
- Sentence case for headlines and body
- `UPPERCASE` only for eyebrow labels with `0.14em` tracking
- Lowercase for the wordmark itself: `studioblank`
- Title Case for proper nouns and exhibition titles

**Sentence shape.** Short, fragmentary, comma-spliced. Lists of nouns are common ("Quiet landscapes, long exposures, the slow geometry of glaciated terrain."). Avoid adjective stacking.

**Numbers.** Always rendered in IBM Plex Mono for EXIF, edition counts, years, and tabular data. Year ranges use en-dashes: `2019–2024`. Mono numbers in body copy when they're "data" (`24 photographs`); proportional otherwise.

**Specific examples.**
| Use | Example |
|---|---|
| Hero headline | `Photographs of quiet landscapes, slow geometry, and the spaces between.` |
| Eyebrow | `SELECTED WORK · 2019 — 2024` |
| Project meta | `Silver gelatin print · Edition of 12 · 24 × 30 in` |
| CTA, primary | `View Project` · `Inquire` · `Download PDF` |
| CTA, secondary | `Read more` · `All work` · `Next →` |
| Form confirm | `Message queued · we'll reply within 48 hours.` |
| Empty state | `No works in this series yet.` |
| Status copy | `Published` · `Draft` · `Archived` · `Featured` |

**Don'ts.** No emoji. No exclamation marks. No "Welcome to…". No sales adjectives ("amazing", "stunning"). No icon-bullets in body copy.

---

## Visual Foundations

### Color
- **Ink** `#0A0A0A` and **Paper** `#FAFAFA` are the system. Everything else is restraint.
- **One accent.** Monochrome is the identity — no purple, no blue, no gradient backgrounds anywhere, ever.
- **Stone neutrals** (50/100/200/300/500) for dividers, captions, disabled states. Reach for the lightest one that still works.
- **Semantic colors** (Success/Warning/Error/Info) exist only for *system messages* — validation, upload state, storage warnings. They never tint backgrounds, chips outside their semantic role, or borders on resting components.

### Type
- **Inter only** for everything except mono. Weight contrast (300 vs 700) builds hierarchy *before* size does.
- **IBM Plex Mono** for EXIF, edition numbers, dates, code-like metadata, file paths.
- **Tight tracking** at display sizes (`-0.02em` to `-0.04em`).
- **Wide tracking + uppercase** is reserved for eyebrows at 11px / 500. Never for body or buttons.

### Spacing
- Base 16. Scale: 4 / 8 / 16 / 32 / 48 / 64 / 96 / 128.
- **Minimum 64px between major sections.** Hero blocks frequently use 128px top/bottom.
- Image card padding is `0` — the image bleeds to the card edge; caption sits *below* with 16px gap.

### Backgrounds
- Paper (`#FAFAFA`) for primary surfaces; ink (`#0A0A0A`) for the footer and rare full-bleed sections.
- **No** patterns, textures, illustrations, gradients, blob shapes, or "decorative" elements. The work is the only background.
- Full-bleed photos exist but never have text overlaid on them unless absolutely necessary; captions sit below the frame.

### Geometry
- **`border-radius: 0` everywhere.** Buttons, cards, inputs, chips, tooltips, dropdowns — all sharp.
- **No shadows.** Anywhere. Depth is communicated by spacing, contrast, and 1px borders only.
- **1px borders.** Either hairline (`#E5E5E5` / `#F4F4F5`) for resting state, or full ink for focus/active.
- Focus rings use a **2px ink border** that pushes content in by 1px — *not* a `box-shadow` halo.

### Animation
- **160–200ms maximum** for any transition. Motion should be barely perceptible.
- Only `background-color`, `color`, `border-color`, and `opacity` animate. **No scale, no translate, no spring, no bounce.**
- Tooltips: 200ms in, 0ms out.
- Page entry: fade gallery images in at 200ms; everything else is instant.

### Interaction states
- **Buttons.** Hover inverts background (primary's hover *darkens* slightly via a subtle internal shift; secondary's hover fills with ink). No transform, no scale.
- **Cards.** Hover shifts the 1px border from `#E5E5E5` to `#0A0A0A`. Nothing else.
- **Links.** Underline on hover, color stays ink. Active links carry a 1px bottom border.
- **Press.** No shrink, no flash. The state change *is* the feedback.
- **Disabled.** `opacity: 0.3`, `cursor: not-allowed`. Disabled chips/inputs additionally swap to `#F4F4F5` ground.

### Imagery
- B&W or near-monochrome preferred; warm-neutral acceptable.
- Grain is welcome; saturated color is not. Editorial photography only — no stock, no illustration.
- Image cards bleed to edge; ratios are typically `4:5` for portrait grids and `3:2` for hero plates.

### Layout rules
- Strict 12-column grid is *not* required — the system favours **two- or three-column editorial layouts** with generous outer gutters (64px at desktop).
- Sticky header only; nothing else sticks.
- No fixed CTAs, no banner bars, no cookie modals occupying viewport real estate (when present, they are full-page sheets, not floaters).
- **Transparency & blur:** never. The system does not use frosted glass effects.

### Cards
- Background `#FFFFFF`, border `1px #E5E5E5`, radius `0`, no padding on image cards.
- Hover border shifts to ink. No lift, no shadow, no scale.

---

## Iconography

**Approach: avoid icons.** StudioBlank is text-first. Most places that would use an icon in a typical design system use words instead — `All work` instead of a back-arrow icon; `Plate 03 / 06` instead of pagination chevrons. When direction is unavoidable, use **hairline arrow characters** in Inter or Plex Mono:

| Use | Glyph | Notes |
|---|---|---|
| Back / previous | `←` | U+2190, in body text |
| Next | `→` | U+2192 |
| External link | `↗` | U+2197, after the link text |
| Drill-in | `↳` | U+21B3, in lists, rare |
| Divider in metadata | `·` | U+00B7, middle dot, between mono fields |

**No icon font is bundled.** If a checkmark, close, or chevron is genuinely needed inside a button or chip, draw it as a 1.5px-stroke `<svg>` inline — **black, no fill, sharp corners.** A single example lives in `preview/checkboxes-radios.html` (the checkmark SVG).

**No emoji. Ever.** Including in microcopy, empty states, success messages, or chat-style affordances.

**No CDN icon set is linked by default.** If a future surface needs a true icon library, pair with **Lucide** (1.5px stroke, sharp endpoints) — it matches the system's geometry. Avoid Font Awesome (filled aesthetic) and Heroicons "solid" (too heavy).

**Logo.** `assets/logo-mark.svg` (48×48 square mark — solid ink square with paper-coloured corner cut) and `assets/logo-wordmark.svg` (mark + `studio`*blank* lockup, weight-contrast within Inter).

---

## Font substitution flag

The brief specifies **Inter** and **IBM Plex Mono**. Both are loaded from Google Fonts (`fonts.googleapis.com`) in `colors_and_type.css` — these are the canonical sources, so no substitution is needed. If you need offline font files, download from rsms.me/inter and ibm.com/plex and place into `fonts/`.
