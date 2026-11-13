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

**An editorial catalogue with immersive details.** Warm paper and ink, one vermilion accent, numbered sections, hairline rules, and real product screenshots set like plates in a magazine.

The signature element is the **name set across the full width with the portrait sitting inside it** (`Hazim [photo] Aqil`). The same wordmark closes the page in the footer.

## Tokens

All tokens live at the top of `css/style.css`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f2f0ea` | `#11110f` | page |
| `--bg-band` | `#e9e6de` | `#171715` | skills and education bands |
| `--ink` | `#191917` | `#ece9e1` | headings, primary text |
| `--ink-2` | `#48463f` | `#b9b5ab` | body text |
| `--ink-3` | `#625f57` | `#8f8b81` | labels, meta |
| `--accent` | `#b9381a` | `#ff6b3d` | numbers, active states, one figure per project |
| `--rule` / `--rule-strong` | 14% / 85% ink | 12% / 80% ink | hairlines and section rules |

The contact section inverts the theme (ink background in light mode, paper in dark mode) as a full stop at the end of the page.

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

All of it is disabled under `prefers-reduced-motion: reduce`.
