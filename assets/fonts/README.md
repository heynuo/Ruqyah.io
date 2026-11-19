# Self-hosted fonts

## `material-symbols-outlined.woff2`

Icon font used by `css/shared-layout.css` for the header, footer, and page icons.

- **Family:** Material Symbols Outlined
- **Source:** Google Fonts (`fonts.gstatic.com`), v385
- **Axes:** `opsz 20`, `wght 300`, `FILL 0..1`, `GRAD 0`
- **License:** Apache License 2.0 — see `LICENSE-MaterialSymbols.txt`

To refresh it, request the CSS from Google Fonts with a modern browser User-Agent:

```text
https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,300,0..1,0&display=block
```

Download the `.woff2` URL from that response over this file. The font is
pre-cached by `sw.js`, so the interface keeps its icons offline and never
falls back to rendering ligature names such as `history_edu` as text.
