---
name: studioblank-design
description: Use this skill to generate well-branded interfaces and assets for studioblank, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping a photographer/artist portfolio aesthetic — ultra-minimal, monochrome, sharp-edged, type-driven.
user-invocable: true
---

# studioblank Design Skill

Read `README.md` within this skill, then explore the other files:

- `colors_and_type.css` — drop into any HTML page to inherit the full token system
- `preview/` — every design-system card (colors, type, components) as a working HTML reference
- `assets/` — `logo-mark.svg`, `logo-wordmark.svg`
- `ui_kits/portfolio/` — a complete portfolio site recreation (React) with Header, Footer, Gallery, ProjectDetail, About, Contact components — copy these patterns

## When invoked

If creating visual artifacts (slides, mocks, throwaway prototypes), copy the relevant assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without other guidance, ask what they want to build (portfolio site, exhibition microsite, edition catalogue, journal layout, etc.), ask a few questions about tone and content, then act as an expert designer who outputs HTML artifacts *or* production code.

## Non-negotiables (the brand will break if you ignore these)

1. **`border-radius: 0` everywhere.** No rounded corners on anything — buttons, cards, inputs, chips, tooltips, images.
2. **No shadows. Anywhere.** Depth comes from spacing and 1px borders only.
3. **One typeface, one accent.** Inter (+ IBM Plex Mono for data). Monochrome ink-on-paper. No second color.
4. **No emoji, no decorative icons, no illustrations, no gradients, no patterns.**
5. **Minimum 64px between major sections.** Whitespace is the design.
6. **Weight contrast before size.** Inter 300 vs 700 to build hierarchy.
7. **Animations ≤ 200ms.** Only `background-color`, `color`, `border-color`, and `opacity` animate.
8. **Image cards have 0 padding** — images bleed to the edge, captions sit beneath.
9. **Editorial voice.** No exclamation marks, no marketing adjectives, no "Welcome to…".
