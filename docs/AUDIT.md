# Front-end upgrade: audit and changes

Written on 16 November 2026. The goal was to present the portfolio as the work of an aspiring front-end developer, keep what already worked, and only add technology that I actually use.

## Starting point

The site was already an Astro 7 static build with TypeScript, a typed data layer, a page per project, light and dark themes, Netlify Forms, axe-checked accessibility, and unit and end to end tests. Lighthouse scored it 99 to 100 locally.

What held it back for a front-end role:

| Area | Finding |
|---|---|
| Positioning | Projects were ordered by date and type, so Windows tools sat between the web apps. Only Streamix was marked as featured. |
| Skills | Six flat groups. Each group linked to projects as a whole, so you could not tell which project used which skill. Back end and desktop skills had the same weight as front-end ones. |
| Evidence | The site claimed React, hooks and component testing, but its own interactive parts were vanilla scripts. A reviewer could not see those skills in the portfolio itself. |
| Project pages | Features were described, but not *how* each front end is built (state, rendering, data flow). |
| Hero | The intro text and buttons stayed hidden until fonts loaded, which delayed the largest paint on phones. |
| API work | Nothing on the site fetched live data, so loading, error and cancellation handling were not shown. |

## What changed

1. **Content order.** The four front-end web apps (Streamix, WaveMusic, HazStore, HazFocus) are featured first. HazCast and Yes, Halal follow. The three Windows tools are in a separate "Supporting desktop work" group.
2. **Skills.** There are now two tiers: front-end skills, then tools and supporting knowledge. Each skill lists the numbers of the projects that use it and marks the ones this site uses. Mappings were taken from each project's source and README.
3. **"How the front end works".** Featured web projects have a new section, checked against their source code. Two examples of what the check caught:
   - WaveMusic's Media Session support sets metadata only, with no action handlers, so the section says only that.
   - HazStore's filters run as `filterProducts` → `sortProducts` → `renderShop`.
4. **React islands.** Five interactive parts moved from vanilla scripts to React components with hooks:
   - the theme switch
   - the project explorer
   - the screenshot gallery
   - the contact form
   - a new repository panel

   The static content is still plain HTML. Menu, scroll, reveal and clock stay vanilla, because they need no state.
5. **Services layer.** All network code is in `src/services/`:
   - Every request has a time limit and can be cancelled.
   - GitHub answers are validated and cached for 30 minutes.
   - The contact form only reports success when Netlify answers ok.
6. **Repository panel.** It shows real, checkable data from the public GitHub API, with no key. If the request fails or is rate limited, it stays a plain link.
7. **Hero.** The name still rises out of its mask, but the intro and the three actions (explore work, view resume, contact) paint immediately. On phones, LCP went from about 2–3 s to about 1 s in local Lighthouse runs.
8. **Tests.**
   - Added component and hook tests with React Testing Library, plus service tests with mocked `fetch` and fake timers.
   - Updated the end to end tests for the islands, adding checks for the Netlify detection form, the repository panel and the featured order.

## Kept on purpose

- Netlify Forms, its honeypot and the existing resume file.
- The editorial design, fonts, colours and section layout.
- Every project and every existing fact. No figures, features or screenshots were added that the projects do not have.

## Known limits

- Netlify Forms delivery can only be confirmed on the deployed site.
- The GitHub API allows 60 requests an hour per visitor without a token. Past that, the panel shows a short note and a link.
- The Streamix live demo needs `VITE_TMDB_API_KEY` set in its own Netlify site. That is outside this repository.
