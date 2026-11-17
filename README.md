# Nick – Portfolio

Static portfolio site (HTML + CSS + vanilla JS, no build step, no dependencies).

## Run it in VS Code
1. Open this folder in VS Code (`File > Open Folder…`).
2. Install the **Live Server** extension (Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.

(You can also double-click `index.html`; a local server is just more reliable for the videos.)

## Structure
```
index.html          all 5 sections, in order
css/style.css       styles, one commented block per section (scoped by section class)
js/main.js          image trail, mouse-driven row scroll, video modal, scroll-in animation
assets/images/      hero photo + the 5 portfolio pieces
assets/videos/
  previews/         short muted loops shown on the cards
  full/             the videos opened in the player (compressed, see below)
```

## Sections
| Section | Selector | Notes |
|---|---|---|
| Hero | `.hero` | "Drag me" button is visual only (no drag behavior yet) |
| Turning Ideas Into Reality | `.works` | image trail; edit the `imgs` list in `js/main.js` |
| Let's See My Work | `.pf` | 5 cards, zigzag layout |
| And some videos… | `.vd` | 7 cards, click opens the full video |
| Let's Build Something Great | `.ct` | email, phone, Instagram + social icons |

## Common edits
- **Titles / categories:** edit the text inside each `<article class="card">` in `index.html`.
- **Add a video card:** copy a `<article class="card" …>` in the `.vd` section, change `data-full`, the preview `<video src>`, title and category. Set `--dy` (`0px` odd / `56px` even) and `--d0` / `--d` (animation delays) to follow the pattern.
- **Colors:** the palette is repeated in `css/style.css` (violet `#5b1a7a`, `#b026c9`, `#7c3aed`; lilac text `#c4b5fd`; dark `#06030d`). Search and replace.
- **Font:** Inter, `letter-spacing: -0.05em` on every section.

## Video files
The original videos were too large for the preview tool, so the files in `assets/videos/full/` are compressed
(≈ 9–17 MB each; the "Segredo do Sayajin" and "Henry Cavill" cards use only the first 1:40 at 1080p).
To use your originals, drop them into `assets/videos/full/` and update each card's `data-full` path.
For hosting, consider YouTube/Vimeo or a CDN for the big files.
