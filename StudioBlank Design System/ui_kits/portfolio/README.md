# Portfolio UI Kit

A click-through recreation of a studioblank photographer portfolio site, built on the design system's primitives.

## Screens
- **Work** (`Gallery.jsx`) — hero, filter chips, 3-up image grid
- **Project** (`ProjectDetail.jsx`) — title block, hero plate, EXIF sidebar, plate grid navigator
- **About** (`About.jsx`) — editorial bio + CV table
- **Contact** (`Contact.jsx`) — inquiry form with subject chips

## Components
- `Header.jsx` — sticky nav with wordmark, route links, studio meta
- `Footer.jsx` — ink section with index columns
- `components.jsx` — `Button`, `Input`, `Chip`, `Eyebrow`, `Mono`, `PhotoTile`

## Image placeholders
`PhotoTile` is a flat geometric stand-in. **Real photography belongs in the
final design.** The placeholder is here so the layout reads correctly without
shipping fake content as if it were real.

## Behavior
All state lives in `index.html`'s `App` component. Routing is a `useState`
string; click thumbnails to enter project detail, hit the back link or the
**Work** nav item to return.
