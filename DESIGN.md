# Design notes

How the portfolio is designed, and why. Read this before changing colours, type or layout.

## Audit of the previous design (November 2026)

The old site worked well, but it looked like a template:

- **Generic palette**: navy background, sky-blue accent, radial glows and a glowing primary button. This is the most common "developer portfolio" look.
- **Everything was a card**: info cards, skill cards, project cards, cert cards, experience cards and contact cards all used the same rounded box with the same hover lift. Every section had the same rhythm.
- **Same section structure every time**: centred pill eyebrow, centred title, centred subtitle, then a grid of cards.
- **Weak typography**: one sans-serif (Inter) at similar sizes everywhere; the name was a gradient-filled heading; no typographic personality.
- **Decorative clichés**: a fake code editor window, a floating "9 projects shipped" badge, a waving emoji, and a typewriter effect.
- **Projects felt like tiles**: nine identical cards with small screenshots and long rows of chips.
- **Dark only**: there was no light theme and no theme toggle.
- **Technical issues found**: `wavemusic.webp` was 594 KB (now 55 KB), the off-canvas mobile menu widened the mobile layout viewport, and the profile photo had the wrong `width`/`height` for its aspect ratio.

Kept on purpose: all copy, every link, the project filter, the Netlify form and its validation, the skip link, reveal-on-scroll, active nav highlighting, back-to-top, and the section IDs.

## Concept

**An editorial catalogue with immersive details.** Cool paper white and blue-black ink, one ultramarine accent, numbered sections, hairline rules, and real product screenshots set like plates in a magazine.

The signature element is the **name set across the full width with the portrait sitting inside it** (`Hazim [photo] Aqil`). The same wordmark closes the page in the footer.

## Tokens

All tokens live at the top of `css/style.css`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f6f7f9` | `#0c0f16` | page |
| `--bg-band` | `#eceef3` | `#121621` | skills and education bands |
| `--surface` | `#fdfdfe` | `#161b26` | form fields, raised bits |
| `--ink` | `#0e1120` | `#e9ebf1` | headings, primary text |
| `--ink-2` | `#3b4052` | `#b4b9c7` | body text |
| `--ink-3` | `#585e70` | `#8b91a2` | labels, meta |
| `--accent` | `#2a3fd9` | `#8796ff` | numbers, active states, role rotator, one figure per project |
| `--on-accent` | `#ffffff` | `#0a0e2e` | text on the accent (selection) |
| `--plate` | `#12151f` | `#171c28` | backdrop behind screenshots |
| `--rule` / `--rule-strong` | 13% / 85% ink | 12% / 80% ink | hairlines and section rules |

Contrast (WCAG 2.1), checked on `--bg`, `--bg-band` and `--surface`: ink-3 is at least 5.5:1, accent at least 6.4:1 in both themes, white on the light accent is 7.5:1. The lowest pair is `--success` on the light band at 4.5:1.

The contact section inverts the theme (blue-black `#0e1120` with the light-mode accent `#8796ff` in light mode; `#e9ebf1` with a deeper `#2236c4` accent in dark mode) as a full stop at the end of the page. It also overrides `--success` so the form status stays readable on the flipped background.

### Type

- **Display**: Instrument Serif (name, section titles, project titles, numbers). Italic is used for the second half of a title.
- **Text**: Schibsted Grotesk (body, buttons, navigation).
- **Meta**: JetBrains Mono, uppercase, `0.08em` tracking (labels, indexes, stacks).
- Scale: `--fs-meta` 12px → `--fs-sm` → `--fs-base` 17px → `--fs-lg` → `--fs-xl` → `--fs-2xl` → `--fs-3xl`, all fluid with `clamp()`. The hero name and footer wordmark are sized from the container width so they always fill it.

### Space, borders, motion

- Spacing scale on a 4px base: `--space-1` (4) to `--space-10` (144). Sections use `--section-pad` (88–168px).
- Layout: 12-column grid inside a 1360px container with a 16–48px gutter.
- Borders: hairlines rather than boxes. Radius is 3px on images, pill on buttons, nothing else is rounded.
- Easing: `--ease-out` `cubic-bezier(0.22, 1, 0.36, 1)`. Durations: `--dur-1` 0.18s (colour), `--dur-2` 0.45s (UI), `--dur-3` 0.9s (reveals).
- Breakpoints: 1200 (laptop), 960 (menu becomes full screen), 700 (name breaks onto two lines), 640 (phone), 380 (small phone).

## Motion, and why each one exists

| Motion | Purpose |
|---|---|
| Name rises out of a mask on load | introduces the signature element once |
| Section rule draws in from the left | marks the start of each chapter |
| Reveal on scroll | paces long content |
| About photo turns from grey to colour | pulls attention to the one personal image |
| Screenshot parallax (≥768px) | gives depth to product plates without 3D |
| Cursor label over screenshots (fine pointers) | tells you the image is a link; the same links are always visible as buttons |
| Header hides on scroll down | more room for content; returns on scroll up or keyboard focus |
| Progress ring on back-to-top | shows where you are in a long page |
| Circular theme wipe | connects the change to the button you pressed |
| Name words lean apart with the pointer (fine pointers) | a small sign of life in the hero, no more than 10px |
| Filter cross-fade (view transitions) | the list changes without a jump |
| Contents list follows your scroll | shows which project you are reading and lets you jump to any of the nine |

All of it is disabled under `prefers-reduced-motion: reduce`.

## Round two (November 2026)

What changed after a second pass:

- the hero buttons became an A/B/C list of actions, set in the display face, instead of a pair of pill buttons
- the four stat boxes became one sentence ("9 projects shipped… 159 automated tests…"); dashboards use stat tiles, a portfolio should read like a page
- the made-up "edition" label in the masthead became a live local time (Malaysia, GMT+8)
- about paragraphs carry margin labels: now, practice, next, so they read as a short development story
- a numbered contents list under the project filters, with a highlight for the project in view
- experience cards step down in three columns on wide screens, instead of a flat grid

## Keeping it apart from my other projects

Compared against screenshots of HazStore and HazFocus, and the HazFocus app as it runs locally (November 2026):

| | Portfolio | HazStore | HazFocus |
|---|---|---|---|
| Role | an editorial page to read | a shop to browse | a tool to use daily |
| Layout | 12-column page, big type, hairline rules | product grid of rounded cards | sidebar, stat tiles, kanban board |
| Hero | the name as a wordmark with a portrait set into it | headline with two buttons | greeting plus task stats |
| Numbers | one sentence | none | stat tiles and a progress bar |
| Actions | A/B/C list rows | rounded buttons | filled pill buttons and dropdowns |

The portfolio avoids stat tiles, progress bars, rounded card grids and the two-button hero.

## Re-skin: cool paper and ultramarine (November 2026)

All three projects had drifted into the same look: warm off-white or brown-black, a serif display with italic accents, mono labels and a red/orange accent. They were split apart:

- **Portfolio** keeps the serif wordmark (it is now the only one of the three with a serif display), the 12-column grid and hairline rules, and moves to a cool, neutral paper white (`#f6f7f9`), blue-black ink and a single ultramarine accent. Dark mode is a blue-grey near-black, not brown-black.
- HazStore goes bold commercial grotesk with black/white and a signal yellow.
- HazFocus goes sans-only tool UI with cool slate and teal.

Text faces stay Schibsted Grotesk and JetBrains Mono; neither is used by the other two. Avoid Inter, Geist, Space Grotesk, Archivo, IBM Plex Sans and condensed display faces here, and keep away from yellow and teal accents.
