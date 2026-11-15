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

**An editorial catalogue with immersive details.** Warm off-white paper and charcoal ink, one restrained cobalt accent, numbered sections, hairline rules, and real product screenshots set like plates in a magazine.

The signature element is the **name set across the full width with the portrait sitting inside it** (`Hazim [photo] Aqil`). The same wordmark closes the page in the footer.

## Tokens

All tokens live at the top of `css/style.css`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f3f1ec` | `#141416` | page |
| `--bg-band` | `#eae7e0` | `#1b1b1e` | skills and education bands |
| `--surface` | `#fbfaf7` | `#202024` | form fields, raised bits, case study cards |
| `--ink` | `#1b1b1d` | `#ece9e3` | headings, primary text |
| `--ink-2` | `#45444a` | `#bdbab3` | body text |
| `--ink-3` | `#5f5d63` | `#94918b` | labels, meta |
| `--accent` | `#2a44c4` | `#8fa0ff` | numbers, active states, links in use, field errors |
| `--on-accent` | `#ffffff` | `#0d1340` | text on the accent (selection) |
| `--plate` | `#18181b` | `#1e1e22` | backdrop behind screenshots |
| `--portrait-bg` | `#e2ded6` | `#d3cec5` | plain backdrop behind the hero portrait cut-out |
| `--rule` / `--rule-strong` | 13% / 85% ink | 12% / 80% ink | hairlines and section rules |

Contrast (WCAG 2.1): every text colour above passes AA (4.5:1) on `--bg`, `--bg-band` and `--surface` in both themes, including the accent.

The contact section inverts the theme (charcoal `#1b1b1d` with the lighter cobalt `#8fa0ff` in light mode; warm white `#ece9e3` with the deeper `#2a44c4` in dark mode) as a full stop at the end of the page. It also overrides `--success` so the form status stays readable on the flipped background.

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
| Header hides on scroll down | more room for content; returns on scroll up or keyboard focus |
| Progress ring on back-to-top | shows where you are in a long page |
| Circular theme wipe | connects the change to the button you pressed |
| Filter cross-fade (view transitions) | the list changes without a jump |
| Contents list follows your scroll | shows which project you are reading and lets you jump to any of the nine |

All of it is disabled under `prefers-reduced-motion: reduce`.

## Round two (November 2026)

What changed after a second pass:

- the hero buttons became an A/B/C list of actions, set in the display face, instead of a pair of pill buttons
- the four stat boxes became one sentence ("9 projects shipped… 262 automated tests…"); dashboards use stat tiles, a portfolio should read like a page
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

Update, later in November 2026: the cool blue-black palette above was replaced by warm off-white and charcoal with a restrained cobalt (see the token table). The layout, type and motion did not change.

## Case studies (November 2026)

Originally four projects had their own page; since 2.0 every project has one, built from `src/data/projects.ts` (see the 2.0 notes below).

- **Shared shell**: the same layout, header, footer and scripts as the home page (`src/layouts/BaseLayout.astro`). "Projects" stays marked as the current page. The reading layout lives in `src/styles/case-study.css`.
- **Structure**: intro with a facts table (role, type, stack, one honest number), a screenshot plate, then a sticky "on this page" list beside numbered sections: overview, features, architecture, challenges and decisions (as pairs), testing, screenshots, what I learned.
- **Content rules**: every fact comes from the project's README, docs or source code, or from my resume. Test counts are the ones I ran on 14 November 2026. Yes, Halal says which parts were mine, and says plainly that it has no automated test suite. Screenshots are real captures of the apps (`src/assets/images/case/`).
- **Links back**: each featured card on the home page has a "Case study" link, each skill group lists the projects it was used in, and single-project experience cards link straight to the case study.

## Contact form

The form validates each field on submit, marks bad fields with `aria-invalid` and an error message linked through `aria-describedby`, moves focus to the first problem, and clears the error as soon as it is fixed. While sending, the button is disabled and reads "Sending...". It only says the message was sent when the server answers with a success status; anything else shows an error with my email address.

## Portfolio 2.0 (November 2026)

The site moved from hand-written HTML to Astro with typed data, without changing the look.

- **Removed motion**: the rotating role line, screenshot parallax, the cursor label and the pointer lean on the name. They moved all the time or only decorated, and the brief asked for purposeful motion only. The hero title is now two fixed lines: "Software Engineering Student" and, in the accent italic, "Aspiring Front-End Developer".
- **Kept motion**: the name intro, the section reveals, the header tuck, the back-to-top ring, the circular theme wipe and the filter cross-fade. All of them still switch off under reduced motion.
- **A broken rule fixed**: the old stylesheet had a stray character inside the hero fade-in rule, so browsers dropped the whole rule and the hero meta, grid and ledger never faded in. It is fixed in `src/styles/motion.css`.
- **Every project has a page**: the case study layout now comes from one template, so the five projects that only had a card also get a page. Sections without real content are left out, and the numbering follows.
- **New parts, same tokens**: the previous/next pager, related projects, the screenshot lightbox and the 404 page only use the existing colours, type scale and hairlines.
- **Contact form**: errors appear on submit and clear as each field is fixed. There is deliberately no check when a field loses focus, because an error appearing there pushed the send button away mid-click (found by the end to end tests).
- **Logo link name**: the visible name now starts the link's accessible name, with the extra words as hidden text, so voice control users can say what they see.

## Front-end focus (November 2026)

- **Hero motion trimmed**: the name still rises out of its mask, but the intro text and the three actions are no longer faded in. They are the main content, and hiding them delayed the largest paint on phones.
- **Hero actions**: Explore my work, View resume (opens the PDF in a new tab; the header button still downloads it) and Contact me.
- **Skills as footnotes**: each skill carries small mono numbers that match the project numbers (01 to 09), plus a boxed `site` tag when this portfolio uses it. The supporting tier is set a step smaller so the front-end tier reads first.
- **Project groups**: featured cards keep the large three-composition layout. The rest are split into "More projects" and "Supporting desktop work", each with a short note that hides while a filter is on.
- **Repository panel**: a quiet band-coloured box under the overview, using the existing hairline, mono labels and link style. It never shows a spinner, only a short line of text while loading.
- **Islands keep the markup**: the React components render the same classes as the old Astro markup, so the CSS did not need a rewrite. `astro-island` is set to `display: contents` so the wrapper never affects layout.

