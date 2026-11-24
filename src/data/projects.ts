// every project on the site, in display order.
// the home page cards, the filters, the project pages and the skill links all read from here.
// every fact comes from the project's own readme, docs or source code, or from my resume.
// test counts are the ones i ran myself on 14 november 2026.
import type { Project } from '@/types/content';

import streamixCover from '@/assets/images/projects/streamix.webp';
import wavemusicCover from '@/assets/images/projects/wavemusic.webp';
import yesHalalCover from '@/assets/images/projects/yes-halal.webp';
import clipnestCover from '@/assets/images/projects/clipnest.webp';
import hazstoreCover from '@/assets/images/projects/hazstore.webp';
import hazcastCover from '@/assets/images/projects/hazcast.webp';
import hazfocusCover from '@/assets/images/projects/hazfocus.webp';
import kiteCover from '@/assets/images/projects/kite.webp';
import islandbarCover from '@/assets/images/projects/islandbar.webp';

import streamixSearch from '@/assets/images/case/streamix-search.webp';
import streamixMovies from '@/assets/images/case/streamix-movies.webp';
import streamixMobile from '@/assets/images/case/streamix-mobile.webp';
import waveAlbum from '@/assets/images/case/wave-album.webp';
import waveMobile from '@/assets/images/case/wave-mobile.webp';
import clipnestWindow from '@/assets/images/case/clipnest-window.webp';
import hazstoreProduct from '@/assets/images/case/hazstore-product.webp';
import hazstorePhoneBag from '@/assets/images/case/hazstore-phone-bag.webp';
import hazcastDesktopDark from '@/assets/images/case/hazcast-desktop-dark.webp';
import hazcastPhone from '@/assets/images/case/hazcast-phone.webp';
import hazfocusBoard from '@/assets/images/case/hazfocus-board.webp';
import hazfocusPhoneFocus from '@/assets/images/case/hazfocus-phone-focus.webp';
import kiteWindow from '@/assets/images/case/kite-window.webp';
import islandbarWindow from '@/assets/images/case/islandbar-window.webp';

export const projects: Project[] = [
  /* =========================
     streamix
  ========================= */
  {
    slug: 'streamix',
    name: 'Streamix',
    kind: 'Streaming Web App',
    category: 'web',
    featured: true,
    summary:
      'A streaming-style UI on live TMDB data: debounced search with shareable URLs, genre filters and sorting stored in the URL, detail pages with cast and a focus-trapped trailer modal, and a My List synced across tabs. Written in strict TypeScript, code-split with React.lazy, and covered by 34 Vitest + React Testing Library tests.',
    lede:
      'A streaming-style interface built on real movie and TV data from the TMDB API. It started in JavaScript and I migrated it to strict TypeScript, then added a test suite that checks the app the way a user would use it.',
    figure: { value: '34', label: 'automated tests' },
    tests: { count: 34, tool: 'Vitest' },
    role: 'Solo project: design, front-end code, tests and deployment',
    type: 'Front-end portfolio project with a live API',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router', 'Axios', 'Vitest', 'TMDB API'],
    links: {
      demo: 'https://streamix-hazim.netlify.app',
      code: 'https://github.com/hazell-lab/Streamix',
    },
    cover: {
      src: streamixCover,
      alt: 'Streamix home page with a trending title banner and rows of movies',
      caption: 'Home page: a random trending title as the banner, then rows of real TMDB data.',
    },
    overview: [
      'Streamix lets you browse trending titles, watch trailers, search, filter movies and TV shows by genre, and keep a personal list that survives page refreshes. It does not host or stream any video: trailers are embedded from YouTube, and all titles, images and cast come from **The Movie Database (TMDB)**.',
    ],
    motivation: [
      'It is a front-end portfolio project, so the focus is on front-end work: a live API, loading, empty and error states on every screen, state kept in the URL, and code that a type checker and a test suite can protect.',
    ],
    features: [
      { title: 'Search', text: 'Debounced multi-search across movies and TV, loading skeletons, an empty state, error handling, "Load more", and shareable `?q=` URLs.' },
      { title: 'Movies and TV pages', text: 'Genre filtering and sorting stored in the URL, for example `/movies?genre=28&sort=vote_average.desc`, so a filtered view can be shared.' },
      { title: 'Detail pages', text: 'Backdrop, rating, runtime or seasons, genres, cast, trailer, and similar and recommended titles.' },
      { title: 'My List', text: 'Saved in localStorage and kept in sync across open browser tabs.' },
      { title: 'Trailer modal', text: 'Closes with the X button, a click outside or Esc, keeps keyboard focus inside while open, and returns focus to the button that opened it.' },
      { title: 'Accessibility', text: 'ARIA labels, visible focus states, Esc closes menus and dialogs, and animations switch off when the system asks for reduced motion.' },
      { title: 'Fast first load', text: 'Every page except Home is code-split with `React.lazy`, so it only downloads when you visit it.' },
    ],
    frontEnd: [
      'Filters, sort order and the search query live in the URL (`?q=`, `?genre=`, `?sort=`), so the back button, refresh and shared links all keep the view.',
      'Shared state sits in small Context providers (My List, Recently Viewed, Toast, Trailer) instead of being passed through every component.',
      'One generic `useFetch<T>` hook handles loading, error and data for every request, and ignores responses that arrive after the component has moved on.',
      'Every page except Home is loaded with `React.lazy`, and all API calls go through one typed service file.',
    ],
    architecture: {
      intro: [
        'The app is split into components, pages, hooks, context providers and one service layer. Every TMDB request lives in `src/services/tmdb.ts`, which is also the only file that reads the API key. Components never call the API directly.',
      ],
      tree: `src/
  components/   Navbar, Hero, MovieRow, MovieCard, TrailerModal, SearchBar, ...
  context/      My List, Recently Viewed, Toast and Trailer providers
  hooks/        useFetch, useDebounce, useLocalStorage, useDiscover, ...
  pages/        Home, Movies, TVShows, Details, Search, MyList, NotFound
  services/     tmdb.ts, every request to the API
  types/        shared TMDB types: MediaItem, MediaDetails, ListItem, ...
  utils/        image urls, formatting, small pure functions
tests/          Vitest tests for helpers, hooks and components`,
      table: [
        { label: 'React 18 + Vite', value: 'UI and dev tooling' },
        { label: 'TypeScript, strict mode', value: 'Type checking; the build runs `tsc --noEmit` before `vite build`' },
        { label: 'Tailwind CSS 3', value: 'Styling' },
        { label: 'React Router 7', value: 'Routes, query strings, 404 page, lazy routes' },
        { label: 'Axios', value: 'HTTP client inside the service layer' },
        { label: 'Vitest + React Testing Library', value: 'Unit, hook and component tests' },
      ],
    },
    decisions: [
      {
        challenge: 'Vite strips TypeScript types without checking them, so a type error would not stop a production build on its own.',
        decision: 'The build script is `tsc --noEmit && vite build`. Every file is type-checked first, and the build stops if anything fails.',
      },
      {
        challenge: 'localStorage can hold anything: old data, hand-edited values, or values from another app. Trusting it would crash My List.',
        decision: 'Stored data is read as `unknown` and checked with a type guard, `isListItem`. The same idea checks the `?sort=` value from the URL.',
      },
      {
        challenge: 'Fast typing or quick page changes can let an older request finish after a newer one and show the wrong results.',
        decision: 'A generic `useFetch<T>` hook uses cleanup flags so stale responses are ignored, and search input is debounced before any request is sent.',
      },
      {
        challenge: 'A caught error in TypeScript is `unknown`, so `error.message` is not guaranteed to exist.',
        decision: 'One helper narrows errors safely, and Axios errors become a small `TmdbError` class that keeps the HTTP status. The project uses no `any`.',
      },
    ],
    testing: {
      intro: [
        'The tests find elements by role and accessible name, the way a user or screen reader would, rather than by CSS class. The TMDB service is mocked, so tests are fast, need no API key and give the same answer every day.',
      ],
      stats: [
        { value: '34', label: 'tests across 8 files: helpers, hooks and components' },
        { value: '3', label: 'bugs planted on purpose to check the suite' },
        { value: '3 / 3', label: 'planted bugs caught by failing tests' },
      ],
      notes: [
        'The planted bugs were: the trailer modal ignoring Escape (1 test failed), adding to My List doing nothing (2 tests failed), and tabs no longer syncing My List (1 test failed).',
        'I last ran the full suite on 14 November 2026: 34 passed.',
      ],
    },
    gallery: {
      source: 'Captured from the app running locally with a real TMDB key.',
      images: [
        { src: streamixSearch, alt: 'Streamix search results for the word dune, showing posters, ratings and years', caption: 'Search for "dune": results from movies and TV in one grid.', frame: 'wide' },
        { src: streamixMobile, alt: 'Streamix home page on a phone, with a trending banner and a row of titles', caption: 'Home on a 390px wide phone.', frame: 'phone' },
        { src: streamixMovies, alt: 'Streamix movies page filtered to science fiction and sorted by rating', caption: 'Movies sorted by rating, with the filter and sort kept in the URL.', frame: 'wide' },
      ],
    },
    learned: [
      'Migrating a React codebase from JavaScript to strict TypeScript: typed props, generic hooks, typed context and type guards for data from outside the app.',
      'Writing custom hooks and handling race conditions with cleanup flags.',
      'Sharing state with the Context API without passing props through every layer.',
      'Testing components and hooks through user behaviour, with mocked network calls and fake timers.',
      'Designing loading, empty and error states for every async view.',
    ],
    next: ['Keyboard navigation inside the carousels', 'Infinite scroll instead of "Load more"', 'Actor pages'],
  },

  /* =========================
     wavemusic
  ========================= */
  {
    slug: 'wavemusic',
    name: 'WaveMusic',
    kind: 'Music Streaming App',
    category: 'web',
    featured: true,
    summary:
      'A music listening app in plain JavaScript modules with no framework and no dependencies. It plays real 30-second Apple Music previews, with an artwork-led editorial design, a player you can see at all times, an editable queue, playlists, search with filters and lock-screen controls. 50 unit tests cover the queue, audio engine, player, library and search.',
    lede:
      'A music listening app written in plain HTML, CSS and JavaScript modules, with no framework and no dependencies. It plays real 30-second previews of 63 songs, loaded live from Apple Music. Version 2.0 is a full rewrite: a new design, a modular codebase and real unit tests.',
    figure: { value: '50', label: 'unit tests' },
    tests: { count: 50, tool: 'node:test' },
    role: 'Solo project: design, code, tests and script-drawn artwork',
    type: 'Static front-end portfolio project',
    stack: ['HTML', 'CSS', 'JavaScript', 'ES modules', 'iTunes Search API', 'Media Session API', 'localStorage', 'Node.js test runner'],
    links: {
      demo: 'https://hazell-lab.github.io/wavemusic/',
      code: 'https://github.com/hazell-lab/wavemusic',
    },
    cover: {
      src: wavemusicCover,
      alt: 'WaveMusic Listen page with the number one song in large serif type and the player deck on the right, playing BIRDS OF A FEATHER',
      caption: 'Listen page with the player deck, which stays in view on desktop.',
    },
    overview: [
      'WaveMusic has a Listen page, Browse with search and genres, a Library, album, artist, collection and playlist pages, an editable queue and a player that is always in view. The design is led by artwork and set out like a magazine: large serif titles, a mono type for labels and one amber signal colour on near-black. It is meant to feel different from the big streaming apps, not copy them.',
      'Version 2.0 replaced one 1,895-line script with **small ES modules**, removed the fake offline demo mode, and added a real unit test suite that runs in Node with no dependencies.',
    ],
    features: [
      { title: 'Real previews', text: 'Each song plays its official 30-second preview with real album artwork. One lookup request loads all 63 and is cached for 24 hours.' },
      { title: 'Player', text: 'Play, pause, next, previous (which restarts after 3 seconds), seek, volume, mute, shuffle and repeat off, all or one, with a status lamp for loading, playing, paused and error.' },
      { title: 'Queue', text: 'An up-next list with play now, move up, move down, remove, play next, add to queue and clear. Turning shuffle off restores the original order.' },
      { title: 'Library and playlists', text: 'Like songs, follow artists, create, rename and delete playlists, reorder tracks, save a collection as your own and keep a play history.' },
      { title: 'Search', text: 'Accent- and case-insensitive search across songs, albums, artists and collections, with type and genre filters and clear empty, loading and error states.' },
      { title: 'Media Session', text: 'Title, artist, album and artwork on the lock screen and in the system media controls, with play, pause, next, previous and seek handlers.' },
      { title: 'Keyboard', text: '11 shortcuts, including Space or K to play, Shift + arrows for next and previous, arrows to seek, / to search and ? for the full list.' },
      { title: 'Phone layout', text: 'A bottom tab bar and a mini player that opens a full-screen player sheet, with the page behind it made inert.' },
    ],
    frontEnd: [
      'Three small observable stores hold the player, library and catalogue state. Views and the player UI subscribe to them, and the queue, library and search logic are **pure functions** that never touch the DOM.',
      'One `<audio>` element plays everything, so two songs can never overlap. Each load gets a token, so a slow `play()` promise from an earlier track cannot start or show the wrong song.',
      'The progress bar runs on `requestAnimationFrame` only while audio is playing and the tab is visible, and writes straight to the DOM, so playback never re-renders the page.',
      'Views are HTML strings built with an `html` tagged template that escapes every value, so a playlist named `<b>x</b>` shows as plain text.',
      'The session (queue, track, position, volume, shuffle, repeat) is saved and comes back **paused** after a reload, because browsers block autoplay without a click.',
    ],
    architecture: {
      intro: [
        '`index.html` is the shell: masthead, an empty `<main>`, the player deck, mini player, tab bar and dialogs. `main.js` wires the modules together and handles every click through one delegated listener and an `ACTIONS` map keyed by `data-action`.',
      ],
      tree: `index.html          the app shell
css/                base, layout, player and views
js/main.js          wiring and the single click handler
js/router.js        hash router
js/core/            store, storage, formatting, safe html
js/data/            catalogue and the apple music loader
js/player/          audio engine, queue, media session, player
js/library/         likes, follows, playlists, history
js/search/          weighted, accent-insensitive search
js/ui/, js/views/   player ui, track lists, dialogs, pages
scripts/            dev server, build check, cover art, zip
tests/              50 unit tests with a fake audio element`,
    },
    decisions: [
      {
        challenge: 'Version 1 had a profile menu, notifications, a devices picker, made-up dates and an offline "demo mode" that moved the progress bar with no audio.',
        decision: 'All of it was **removed**. If the catalogue cannot load, the app says so and offers a retry instead of pretending to play.',
      },
      {
        challenge: 'One broken preview should not end a listening session, but a dead network should not cause an endless skip loop.',
        decision: 'A failed track shows an error and a toast, then the player skips to the next playable track, and it **stops after one full pass** through the queue.',
      },
      {
        challenge: 'The audio code is the hardest part to get right and the hardest to check by hand.',
        decision: 'The audio engine takes the `<audio>` element as a parameter, so tests pass in a **fake audio element** whose `play()` can resolve, hang, fail or be blocked like a real browser.',
      },
      {
        challenge: 'The goal was better engineering without moving to a framework or adding dependencies.',
        decision: 'Native **ES modules** with no bundler. The same files run in the browser and in Node tests, and a build script copies the app and checks that all 100 local references resolve.',
      },
    ],
    testing: {
      intro: [
        "`npm test` runs 50 unit tests with Node's built-in test runner and no dependencies. A fake `<audio>` element, an in-memory storage and a seeded shuffle stand in for the browser.",
      ],
      stats: [
        { value: '50', label: 'unit tests for queue, audio, player, library and search' },
        { value: '0', label: 'runtime or dev dependencies' },
        { value: '100', label: 'local references checked by the build' },
      ],
      notes: [
        'I last ran them on 17 November 2026: 50 passed, 0 failed.',
        'The rest was checked by hand in Chromium at 1440, 1280, 820 and 390 pixels wide. Firefox, Safari and real phones were not tested yet.',
      ],
    },
    gallery: {
      source: 'Captured from the live GitHub Pages demo while a preview was playing.',
      images: [
        { src: waveAlbum, alt: 'WaveMusic album page for After Hours with the track list, the playing row marked and the player deck on the right', caption: 'Album page. The deck picks up a tint from the album artwork.', frame: 'wide' },
        { src: waveMobile, alt: 'WaveMusic full-screen player on a phone with artwork, seek bar, transport controls, volume and the up-next queue', caption: 'On a phone, the mini player opens a full-screen player with the queue.', frame: 'phone' },
      ],
    },
    learned: [
      'Splitting a large vanilla JavaScript app into small modules with clear jobs, and keeping logic pure so it can be tested without a browser.',
      'Handling the messy parts of audio in the browser: stale promises, blocked autoplay, media errors and listener cleanup.',
      'Testing code that depends on browser APIs by passing in fakes instead of mocking globals.',
      'Being honest in a portfolio project: removing features that only looked real.',
    ],
    next: ['Live search against the full iTunes catalogue', 'Testing in Firefox, Safari and on real phones', 'Offline caching with a service worker'],
  },

  /* =========================
     hazstore
  ========================= */
  {
    slug: 'hazstore',
    name: 'HazStore',
    kind: 'E-commerce Front End',
    category: 'web',
    featured: true,
    summary:
      'A responsive electronics store built as a React single page app, with routed shop, product, bag, wishlist and checkout pages. Search, filters and sorting live in the URL, the bag and wishlist stay in sync between tabs, and the demo checkout validates Malaysian phone numbers and postcodes. 72 Vitest and React Testing Library tests cover the logic and the main user flows.',
    lede:
      'A responsive e-commerce front end for a fictional electronics shop. I first built it in plain JavaScript, then rebuilt it in React and Vite with real routes, reusable components, custom hooks and an automated test suite.',
    figure: { value: '72', label: 'automated tests' },
    tests: { count: 72, tool: 'Vitest' },
    role: 'Solo project: design, front-end code and tests',
    type: 'React front-end portfolio project',
    stack: ['React', 'Vite', 'React Router', 'Context API', 'Vitest', 'React Testing Library', 'localStorage'],
    links: {
      demo: 'https://hazstore-ecommerce.netlify.app',
      code: 'https://github.com/hazell-lab/haz-store',
    },
    cover: {
      src: hazstoreCover,
      alt: 'HazStore home page with a bold black headline, a yellow Shop the collection button and featured wireless headphones',
    },
    overview: [
      'HazStore sells 20 fictional products loaded from a JSON catalog. It has a home page with a product spotlight and departments, a shop with search, filters and sorting, a page for every product, a bag drawer and bag page, a wishlist and a demo checkout.',
      'The first version was one HTML page with plain JavaScript. I rebuilt it in **React** to practise routing, components, hooks and testing on a real project, while keeping the same look and saved data.',
    ],
    features: [
      { title: 'Search, filters and sorting', text: 'Category, price, rating and availability filters that combine, five sort options, removable filter chips and "show more" paging. Filters live in the URL, so a filtered shop can be shared and survives the back button.' },
      { title: 'Header search', text: 'Live product suggestions in a keyboard-friendly combobox.' },
      { title: 'Product pages', text: 'A page for every product (`/product/:id`) with image zoom, quantity selector, stock, related products and recently viewed.' },
      { title: 'Bag and wishlist', text: 'A slide-in bag drawer and a full bag page, quantity limits based on stock, a free shipping bar (free from RM300) and a wishlist page.' },
      { title: 'Demo checkout', text: 'Validation for Malaysian phone numbers and 5-digit postcodes, a loading state and a confirmation. No card or bank details are ever asked for.' },
      { title: 'Saved in the browser', text: 'Bag, wishlist, recently viewed and theme are saved in localStorage and kept in sync between open tabs.' },
    ],
    frontEnd: [
      'Context providers hold the catalog, the bag and wishlist, toasts and UI state, and **custom hooks** (`useCart`, `useWishlist`, `useProductFilters`, `useLocalStorage`, `useDialog`) keep the components small.',
      'Filtering, sorting, cart totals, pricing and form validation are **pure functions** in `src/utils`, so they can be tested without rendering anything.',
      'The shop and product pages are code-split with `React.lazy`, so they only download when you visit them.',
      'After every route change, focus moves to the new page heading, and drawers keep the Tab key inside and close with Escape.',
    ],
    decisions: [
      {
        challenge: 'Saved bag data can go out of date: a product may be removed or out of stock when the visitor comes back.',
        decision: 'Saved items are checked against the catalog when it loads, quantities are capped at the stock, and storage reads are wrapped in `try/catch` so a blocked storage never breaks the app.',
      },
      {
        challenge: 'A filtered shop is hard to share if the filters only live in memory.',
        decision: 'The filters are read from and written to the URL query, so links, bookmarks and the back button all restore the same results.',
      },
      {
        challenge: 'A missing product image would make the shop look broken.',
        decision: 'A placeholder image is shown instead, so the page never shows a broken image.',
      },
    ],
    testing: {
      intro: [
        'The tests use **Vitest** and **React Testing Library**. They find elements by role and label, the way a user would, and cover the pure helpers as well as full flows: browsing the shop, adding to the bag, the product page and checking out.',
      ],
      stats: [
        { value: '72', label: 'tests across 12 files' },
      ],
    },
    gallery: {
      source: "Screenshots from the project's own design notes.",
      images: [
        { src: hazstoreProduct, alt: 'HazStore product details for Nova Wireless Headphones with price, quantity and add to bag button', caption: 'Product details with quantity, delivery and returns.', frame: 'wide' },
        { src: hazstorePhoneBag, alt: 'HazStore bag on a phone in the dark theme with three products and a checkout button', caption: 'The bag on a phone, dark theme.', frame: 'phone' },
      ],
    },
    learned: [
      'Routing with React Router, including URL query state for filters.',
      'Sharing state with the Context API and custom hooks.',
      'Testing components and user flows with React Testing Library.',
      'Focus management for drawers and route changes.',
    ],
  },

  /* =========================
     hazfocus
  ========================= */
  {
    slug: 'hazfocus',
    name: 'HazFocus',
    kind: 'Tasks & Focus Workspace',
    category: 'web',
    featured: true,
    summary:
      'A calm task and focus workspace. The dashboard plans your day with an agenda grouped by date, progress for each area and a 7-day chart of completed tasks and focus time. Includes a kanban board with mouse and touch drag and drop, a Pomodoro timer with a distraction-free mode, keyboard shortcuts and separately tuned light and dark themes, all saved with localStorage.',
    lede:
      'A kanban-style task and productivity app built with plain HTML, CSS and JavaScript. Everything is saved in the browser, so tasks are still there after a refresh.',
    role: 'Solo project: design and front-end code',
    type: 'Front-end practice project',
    stack: ['HTML', 'CSS', 'JavaScript', 'localStorage', 'Drag and Drop API'],
    links: {
      demo: 'https://productivity-app-hazim.netlify.app',
      code: 'https://github.com/hazell-lab/haz-focus',
    },
    cover: {
      src: hazfocusCover,
      alt: 'HazFocus dashboard with a day-by-day agenda, progress for each area and a chart of tasks completed over the last 7 days',
    },
    overview: [
      'You can create tasks with a category, priority and due date, move them across a kanban board, and track progress on a dashboard built from your own data.',
    ],
    motivation: ['It was built to practise core front-end skills without any framework or library.'],
    features: [
      { title: 'Kanban board', text: 'To do, In progress and Completed columns with drag and drop, using the HTML drag and drop events.' },
      { title: 'Dashboard', text: 'An agenda grouped by day, progress per category, and a last-7-days chart of completed tasks and focus minutes.' },
      { title: 'Focus timer', text: 'A Pomodoro timer with adjustable lengths, a long break after every fourth session, and a distraction-free mode.' },
      { title: 'Find things fast', text: 'Filtering by status, priority, category and due date, sorting, and search.' },
      { title: 'Keyboard shortcuts', text: '`N` new task, `/` search, `1`–`6` switch views, `Space` start or pause the timer, `Esc` close or clear.' },
    ],
    frontEnd: [
      'One task list is the source of truth. Every change saves it to localStorage and re-renders the current view from it.',
      'The visible tasks come from a short pipeline of functions: current view, then search, then filters, then sort.',
      'Saved tasks are checked on load, and any task with a missing or invalid field gets a safe default instead of breaking the app.',
      'Filters, the theme and a running focus timer are saved too, so a reload brings back exactly what you had.',
    ],
    decisions: [
      {
        challenge: 'Drag and drop does not work for everyone: keyboards, and touch screens without a long press.',
        decision: 'It works with a mouse and with a long press on touch screens, and the status dropdown on each card moves tasks too.',
      },
      {
        challenge: 'Reloading the page would lose a running focus session.',
        decision: 'The timer is saved in localStorage along with tasks, filters and theme, so a running timer survives a reload.',
      },
      {
        challenge: 'A new user opening an empty app has nothing to look at.',
        decision: 'Sample tasks appear only the first time; after that, only your own saved tasks are used.',
      },
    ],
    testing: {
      intro: ['This project has no automated test suite, so I do not list a test count for it.'],
    },
    gallery: {
      source: "Screenshots from the project's own design notes.",
      images: [
        { src: hazfocusBoard, alt: 'HazFocus kanban board in the light theme with To do, In progress and Completed columns', caption: 'The board in the light theme.', frame: 'wide' },
        { src: hazfocusPhoneFocus, alt: 'HazFocus focus timer on a phone in the dark theme showing 25 minutes', caption: 'The focus timer on a phone, dark theme.', frame: 'phone' },
      ],
    },
    learned: [
      'Working with the `Date` object for today, upcoming and overdue logic.',
      'The HTML drag and drop events, and a non-drag alternative.',
      'Custom form validation with `aria-invalid`.',
      'Designing light and dark themes separately instead of inverting colours.',
    ],
  },

  /* =========================
     hazcast
  ========================= */
  {
    slug: 'hazcast',
    name: 'HazCast',
    kind: 'Weather Dashboard',
    category: 'web',
    featured: false,
    summary:
      'A weather dashboard where the page itself is the forecast. The sky changes with live conditions and local time of day, and a horizon line shows where the sun is right now. Includes rain for the next two hours, a past-two-hours radar map, official US alerts, a 24-hour temperature curve, a 7-day range chart and air quality. Installable and works offline, with shareable place links and 13 unit tests, all in vanilla JavaScript with no API keys.',
    lede:
      'A weather dashboard built with HTML, CSS and vanilla JavaScript on the Open-Meteo API. Search any city and see its weather as an atmosphere rather than a grid of cards.',
    figure: { value: '13', label: 'unit tests' },
    tests: { count: 13, tool: 'node:test' },
    role: 'Solo project: design, front-end code and tests',
    type: 'Front-end project with a live API',
    stack: ['HTML', 'CSS', 'JavaScript', 'Open-Meteo API', 'RainViewer', 'Leaflet', 'NWS API', 'Service Worker', 'SVG', 'node:test'],
    links: {
      demo: 'https://hazcast-weatherdashboard.netlify.app',
      code: 'https://github.com/hazell-lab/Haz-Cast',
    },
    cover: {
      src: hazcastCover,
      alt: 'HazCast weather dashboard with a rainy sky, a horizon line tracing the sun and the current temperature',
    },
    overview: [
      'The top of the page is a sky that follows the real conditions and the time of day at that place, with a horizon line that shows where the sun is between sunrise and sunset. Under it are official alerts (US only), the readings, rain for the next two hours, a 24-hour temperature curve, a radar map, a 7-day range chart, air quality and daylight.',
    ],
    features: [
      { title: 'Live sky', text: 'Background, motion (rain, snow, drifting fog and cloud) and ink colour follow the current weather and time of day.' },
      { title: 'Charts', text: 'A 24-hour temperature curve with rain chance, readable by hover, tap or arrow keys, and seven days of highs and lows on one shared scale.' },
      { title: 'Next two hours', text: 'Rain in 15-minute steps from Open-Meteo, for example "light rain from around 4:30 PM", labelled as a model estimate rather than radar.' },
      { title: 'Radar', text: 'The past two hours of real radar from RainViewer on an OpenStreetMap map, with play, pause and a time slider. It loads only when you open it.' },
      { title: 'Official alerts', text: 'Alerts from the US National Weather Service for US places, with the full text. Elsewhere the page says plainly that it cannot show them.' },
      { title: 'Search and places', text: 'City search with autocomplete, arrow-key support and recent searches. Up to 8 saved places, reordered by drag or with Alt and the arrow keys, and shareable links to any place.' },
      { title: 'Units and themes', text: '°C and °F (wind, visibility and rain switch too), and light and dark modes refined separately.' },
      { title: 'Installable and offline', text: 'A service worker keeps the app itself available offline. The last data for each place is kept and shown with a clear "saved" or "live" label.' },
    ],
    frontEnd: [
      'Forecast, air quality and place data are requested in parallel with `Promise.all`, with `response.ok` checked before anything is shown.',
      'Only the response for the city you picked last is drawn, so a slow older request can never overwrite it.',
      'The last data for each place is saved, and the page labels it "saved" or "live" so you always know what you are looking at.',
      'Leaflet is loaded only when the radar is opened, pinned to one version with integrity hashes.',
      'The pure logic (unit conversion, weather codes, the rain nowcast, share links, reordering) lives in its own file that both the page and the tests use.',
    ],
    decisions: [
      {
        challenge: 'City names come from an API and are written into the page with `innerHTML`.',
        decision: 'Text is escaped before it is inserted, so a city name from the API cannot inject HTML.',
      },
      {
        challenge: 'Switching cities quickly can let an older response arrive after a newer one.',
        decision: 'Out-of-date responses are ignored, so the page always shows the city you picked last.',
      },
      {
        challenge: '"Use my location" sends a precise position.',
        decision: 'The position is rounded to about 1 km before it is sent or saved.',
      },
      {
        challenge: 'Open-Meteo has no official warnings and no radar tiles.',
        decision: 'Alerts come only from the US National Weather Service and say so; everywhere else the page says it cannot show them. Radar comes from RainViewer and is past data only, because no free radar forecast exists. Forecast notes are labelled as coming from the forecast.',
      },
      {
        challenge: 'A service worker could show old weather as if it were current.',
        decision: 'It only keeps the app files. Weather data is saved by the app itself and always labelled with its age.',
      },
    ],
    testing: {
      intro: [
        "`npm test` runs 13 unit tests with Node's built-in test runner and no dependencies. They cover unit conversion, weather codes, the two-hour rain nowcast, share links, reordering saved places and the US alert check.",
      ],
      stats: [
        { value: '13', label: 'unit tests for the pure logic' },
        { value: '0', label: 'runtime or dev dependencies' },
      ],
      notes: [
        'I last ran them on 24 November 2026: 13 passed, 0 failed.',
        'The page itself was checked by hand in Chrome on desktop and at phone width. Lighthouse on desktop: 98 performance, 100 accessibility, best practices and SEO.',
      ],
    },
    gallery: {
      source: "Screenshots from the project's own docs.",
      images: [
        { src: hazcastDesktopDark, alt: 'HazCast in the dark theme showing Kuala Lumpur with rain showers, 29 degrees and the sun on the horizon line', caption: 'Desktop, dark theme: the sky follows the live weather.', frame: 'wide' },
        { src: hazcastPhone, alt: 'HazCast on a phone in the light theme showing the current weather in Kuala Lumpur', caption: 'The same view on a phone.', frame: 'phone' },
      ],
    },
    learned: [
      '`fetch` with `async`/`await`, `response.ok` checks and `Promise.all` for parallel requests.',
      'Drawing charts and icons by hand with SVG.',
      'Handling stale responses, offline data and rate limits.',
      'Service workers, web app manifests and lazy-loading a map library.',
      'Testing plain JavaScript with `node:test` by keeping the logic away from the page.',
      'Being honest about what the data source does not provide.',
    ],
  },

  /* =========================
     yes, halal
  ========================= */
  {
    slug: 'yes-halal',
    name: 'Yes, Halal',
    kind: 'Full-Stack Mobile App',
    category: 'mobile',
    featured: false,
    badge: 'Final year project',
    summary:
      "A four-member final year project for checking halal status. Scan a barcode to see a product's halal certificate, check an ingredients list with the AI ingredient checker (ML Kit, Gemini and Groq) or ask the AI chatbot, and find certified restaurants on a map with directions. I led the team, built the Node.js API and Firestore data layer, improved Flutter screens and connected the front end to the back end.",
    lede:
      'A team final year project for checking halal status: scan a product barcode, check an ingredients list with the camera, ask an AI chatbot about ingredients, or find certified restaurants nearby.',
    figure: { value: '4', label: 'person team' },
    role: 'Team lead; Node.js API, Firestore data layer, Flutter UI work and front-end to back-end integration',
    type: 'Team final year project, Android app',
    team: {
      size: 4,
      contribution: [
        '**Leading the team** of four.',
        '**The Node.js REST API** that the app calls for the AI chatbot and the AI ingredient checker.',
        '**The Firestore data layer**: how products and premises are stored and read by the app.',
        '**Flutter interfaces**: improving screens in the app.',
        '**Integration**: connecting the Flutter front end to the back end, with Firebase Authentication and API testing in Postman.',
      ],
    },
    stack: ['Flutter', 'Dart', 'Node.js', 'Firebase Auth', 'Firestore', 'ML Kit', 'Gemini', 'Groq'],
    links: {},
    platformNote: "Android app · the code lives in the team's repository, so there is no public demo link",
    cover: {
      src: yesHalalCover,
      alt: 'Yes, Halal home screen with scan, find halal places and AI ingredient help',
      caption: 'Home screen with the three main paths: scan, find places, and ask about ingredients.',
    },
    overview: [
      'Yes, Halal brings three everyday checks into one app: is this product certified, is this ingredient a concern, and where is the nearest certified restaurant. It was built by a team of four as our final year project.',
    ],
    features: [
      { title: 'Barcode scanning', text: 'Look up a product and its halal certificate.' },
      { title: 'AI ingredient checker', text: "Photograph an ingredients list: ML Kit text recognition reads it on the phone, then Gemini and Groq check the ingredients through the team's API server." },
      { title: 'AI chatbot', text: "Ask questions about ingredients in a chat, answered by Gemini and Groq through the team's API server." },
      { title: 'Find halal places', text: 'Certified restaurants on a map, with directions handed to Google Maps or Waze.' },
      { title: 'Accounts', text: 'Email or Google sign-in through Firebase Authentication, plus scan history and favourites.' },
      { title: 'Two languages', text: 'English and Bahasa Melayu.' },
    ],
    architecture: {
      intro: ['The system has three parts: the Flutter app, a Node.js server, and Firebase.'],
      table: [
        { label: 'Flutter app', value: 'Pages for scanning, results, places, chat, history and settings, with separate service classes for each data source' },
        { label: 'Node.js API', value: 'Hosted on Render; sends the chatbot and ingredient checker requests to Gemini and Groq, so no AI keys live in the app' },
        { label: 'Firebase', value: 'Authentication for accounts, Cloud Firestore for products, premises and user data' },
        { label: 'On the phone', value: 'ML Kit text recognition, a barcode scanner, location, and a saved copy of the catalogue' },
      ],
    },
    decisions: [
      {
        challenge: 'The free Firebase plan allows 50,000 document reads a day, and one full download of products and premises from Firestore costs about 3,300 reads per phone.',
        decision: 'The app keeps the whole catalogue in a file on the phone. A fresh copy is used without downloading, an unchanged file is not downloaded again, and Firestore is read only as a last resort.',
      },
      {
        challenge: 'Users can be offline in a shop or restaurant, exactly when they want to check something.',
        decision: 'If every download fails, the app falls back to the older saved copy instead of showing an error.',
      },
      {
        challenge: 'An AI service key inside a mobile app can be extracted by anyone who downloads it.',
        decision: 'AI requests go through our own Node.js server instead, and the app sends a Firebase App Check token so the server can tell the request comes from the real app.',
      },
    ],
    testing: {
      intro: [
        'I tested the API endpoints with Postman while connecting the app to the back end. This project does not have an automated test suite, so I do not list a test count for it.',
      ],
    },
    learned: [
      'Leading a team of four and keeping the app, the API and the database working together.',
      'Designing an API and a data layer that a mobile front end depends on.',
      'Working within the limits of a free cloud plan, and planning for users who are offline.',
      "Building a bilingual interface with Flutter's localisation tools.",
    ],
  },

  /* =========================
     clipnest
  ========================= */
  {
    slug: 'clipnest',
    name: 'ClipNest',
    kind: 'Clipboard Manager for Windows',
    category: 'desktop',
    featured: false,
    summary:
      'A tray app that saves the text and images you copy and opens a searchable panel with Ctrl+Shift+V. Pinned snippets, code preview with syntax colours for 11 languages, history limits, excluded apps and pause controls. Uses Windows clipboard notifications (no polling), stores everything locally in SQLite, and passes 125 unit tests.',
    lede:
      'A clipboard history manager for Windows 11. It runs in the system tray, saves the text and images you copy, and opens a compact panel with Ctrl+Shift+V so you can search, pin, preview and copy anything again. Everything stays on your PC.',
    figure: { value: '125', label: 'unit tests' },
    tests: { count: 125, tool: 'xUnit' },
    role: 'Solo project: design, code and tests',
    type: 'Native Windows desktop app',
    stack: ['C#', '.NET 10', 'WPF', 'SQLite', 'Win32 API', 'xUnit'],
    links: { code: 'https://github.com/hazell-lab/ClipNest' },
    platformNote: 'Windows 11 app, no web demo',
    cover: {
      src: clipnestCover,
      alt: 'ClipNest clipboard panel with search, filters and recent items',
      caption: 'The history panel: search, filter chips, and recent text and image items.',
    },
    overview: [
      'ClipNest keeps a searchable history of what you copy, with pinned snippets that never expire. It has no accounts, no cloud sync, no analytics and makes no network calls. It is built with WPF, the native Windows desktop UI framework, so it can call the Windows clipboard, hotkey and tray APIs directly.',
    ],
    features: [
      { title: 'Clipboard history', text: 'Text and images, captured through Windows clipboard change notifications rather than polling.' },
      { title: 'Smart repeats', text: 'Consecutive repeats are ignored, older repeats move to the top, and items copied back from ClipNest are not captured again.' },
      { title: 'Floating panel', text: 'Search, filter chips (All, Text, Images, Pinned), previews, thumbnails, timestamps and the source app.' },
      { title: 'Pinned snippets', text: 'Optional titles, kept safe from automatic cleanup.' },
      { title: 'Code preview', text: 'Syntax colours for 11 languages.' },
      { title: 'Limits and privacy', text: 'Maximum item count, size and age, pause and resume, excluded apps, and full delete options.' },
      { title: 'Accessibility', text: 'Full keyboard use, screen reader names, per-monitor DPI scaling, and reduced motion when Windows animations are off.' },
    ],
    architecture: {
      intro: [
        'The solution is split in two. **ClipNest.Core** is a plain .NET library with no Windows UI code, so all the rules can be unit tested. **ClipNest.App** is the WPF app: Win32 interop, view models, views and themes. All database and file work runs on background threads.',
      ],
      tree: `src/ClipNest.Core/        plain .net library, unit tested
  Capture/                capture rules, privacy markers, size limits
  History/                capture, repeats, pin, delete, cleanup
  Storage/                sqlite database, search, image files
  Settings/  Code/  Text/ settings, syntax colours, previews
src/ClipNest.App/         the wpf app
  Platform/               clipboard listener, hotkey, tray, auto-paste
  ViewModels/  Views/     panel, settings and code preview
tests/ClipNest.Core.Tests xunit tests`,
    },
    decisions: [
      {
        challenge: 'A clipboard manager sees everything, including passwords copied from password managers.',
        decision: 'ClipNest honours the Windows clipboard privacy markers that password managers set, and never saves that data. Logs never contain clipboard text.',
      },
      {
        challenge: 'Windows blocks simulated key presses into apps that run as administrator, so auto-paste cannot always work.',
        decision: 'Auto-paste is off by default. ClipNest checks for this case and tells you to press Ctrl+V yourself; copying always works even if pasting fails.',
      },
      {
        challenge: 'Another app can hold the clipboard open, and settings or database files can be damaged.',
        decision: 'ClipNest retries the clipboard for about a second and then reports it was busy. A damaged file is backed up and replaced instead of crashing the app.',
      },
    ],
    limits:
      '**Honest limits:** excluded apps are best effort, because Windows does not reliably say which app put data on the clipboard, and ClipNest cannot reliably detect passwords on its own. The README says so, and recommends pausing capture before copying secrets.',
    testing: {
      intro: [
        'The tests cover the core rules: duplicates, search and filters, settings persistence and damaged files, retention with pinned items kept, image file cleanup, self-copy suppression, capture rules, bitmap headers and code colouring.',
      ],
      stats: [
        { value: '125', label: 'xUnit tests on the core library' },
        { value: '0', label: 'network calls made by the app' },
        { value: '11', label: 'languages in the code preview' },
      ],
      notes: ['I last ran them on Windows 11 on 16 November 2026: 125 passed, 0 failed.'],
    },
    gallery: {
      source: 'Taken on Windows 11 with the app running.',
      images: [
        { src: clipnestWindow, alt: 'ClipNest panel showing a capturing badge, search box, filters and four recent text and image items', caption: 'The panel at its real size, with capture on.', frame: 'window' },
      ],
    },
    learned: [
      'Calling Win32 APIs from C# for clipboard notifications, global hotkeys and the tray icon.',
      'Keeping logic in a UI-free core library so it can be tested properly.',
      'Storing and searching data with SQLite, and cleaning it up safely.',
      "Writing down a tool's limits clearly instead of hiding them.",
    ],
  },

  /* =========================
     kite
  ========================= */
  {
    slug: 'kite',
    name: 'Kite',
    kind: 'Quick Launcher for Windows',
    category: 'desktop',
    featured: false,
    summary:
      'A keyboard-first launcher: press Alt+Space, type, press Enter. Opens apps (including Microsoft Store apps), does quick maths, runs web searches with short prefixes, and supports bookmarks and custom aliases. All search logic lives in a separate core library with no Windows dependency, covered by 103 unit tests.',
    lede:
      'A fast, keyboard-first quick launcher for Windows 11. Press Alt+Space, type, press Enter. It runs quietly in the notification area, needs no account or internet connection, and keeps all data on your PC.',
    figure: { value: '103', label: 'unit tests' },
    tests: { count: 103, tool: 'xUnit' },
    role: 'Solo project: design, code and tests',
    type: 'Native Windows desktop app',
    stack: ['C#', '.NET 10', 'WPF', 'Win32 API', 'xUnit'],
    links: { code: 'https://github.com/hazell-lab/kite' },
    platformNote: 'Windows 11 app, no web demo',
    cover: {
      src: kiteCover,
      alt: 'Kite launcher search box with example commands',
    },
    overview: [
      'Kite opens apps, does quick maths, searches the web with short prefixes like `g` or `gh`, opens your bookmarks, and lets you create aliases such as `projects` for your projects folder.',
    ],
    features: [
      { title: 'App search', text: 'Finds apps from Start menu shortcuts and the Windows apps folder, including Microsoft Store apps, even with typos or initials.' },
      { title: 'Calculator', text: 'Operators, brackets, `pi`, `e` and functions like `sqrt` and `sin`; Enter copies the answer.' },
      { title: 'Web search prefixes', text: '`g`, `gh`, `ddg`, `yt` and `w` for Google, GitHub, DuckDuckGo, YouTube and Wikipedia.' },
      { title: 'Bookmarks and aliases', text: 'Targets are checked when saved and again when opened, with a clear message if they moved.' },
    ],
    architecture: {
      intro: ['All search logic lives in `Kite.Core`, a plain .NET library with no Windows dependency, so it can be unit tested anywhere.'],
      tree: `src/Kite.Core/          search engine, ranking, calculator, storage (no windows code)
src/Kite.App/           wpf app: windows, tray, hotkey, app discovery, icons
tests/Kite.Core.Tests/  xunit tests
scripts/publish.ps1     builds a distributable exe`,
    },
    decisions: [
      {
        challenge: 'A launcher that runs what you type could be dangerous.',
        decision: 'Text is never run as a command. Results open through the Windows shell directly, never through `cmd.exe` or PowerShell, and the calculator is a small custom parser, so it never runs code.',
      },
      {
        challenge: 'Search engines should not see what you type while you type it.',
        decision: 'Web searches are only sent when you open the result, and only `http://` and `https://` addresses can be opened.',
      },
      {
        challenge: 'A damaged settings file could stop the app from starting.',
        decision: 'Kite keeps a copy of the damaged file, uses defaults, and tells you once.',
      },
    ],
    testing: {
      intro: ['The tests cover search ranking, calculator parsing, settings persistence and repair, hotkey parsing and alias validation.'],
      stats: [{ value: '103', label: 'xUnit tests on the core library' }],
      notes: ['I last ran them on Windows 11 on 16 November 2026: 103 passed.'],
    },
    gallery: {
      source: 'Taken on Windows 11 with the app running.',
      images: [
        { src: kiteWindow, alt: 'Kite search box listing example commands: notepad, a sum, gh wpf launcher and kite', caption: 'The launcher at its real size.', frame: 'window' },
      ],
    },
    learned: [
      'Registering a global hotkey and reading the Windows app list.',
      'Writing a small expression parser instead of evaluating code.',
      'Designing for safety in a tool that opens things on your PC.',
    ],
  },

  /* =========================
     islandbar
  ========================= */
  {
    slug: 'islandbar',
    name: 'IslandBar',
    kind: 'Dynamic Island for Windows',
    category: 'desktop',
    featured: false,
    summary:
      'A floating animated pill at the top of the screen that shows what is playing, pops up on volume and battery changes, and has a countdown timer. Never steals keyboard focus, with settings for position, size, animation intensity and fullscreen behaviour.',
    lede:
      'A floating black pill at the top of the screen for Windows 11. It shows what is playing, pops up when the volume or battery changes, and has a countdown timer. Hover to peek, click to open, click outside or press Esc to close.',
    figure: { value: '38', label: 'logic checks' },
    tests: { count: 38, tool: 'custom checks' },
    role: 'Solo project: design, code and checks',
    type: 'Native Windows desktop app',
    stack: ['C#', '.NET 8', 'WPF', 'NAudio', 'Windows Media API'],
    links: { code: 'https://github.com/hazell-lab/IslandBar' },
    platformNote: 'Windows 11 app, no web demo',
    cover: {
      src: islandbarCover,
      alt: 'IslandBar island showing the song playing and battery level',
    },
    overview: [
      'IslandBar reads the Windows media session, system volume and battery events, and shows them in an animated island. Settings cover position, size, animation intensity, hover preview, fullscreen behaviour and start with Windows.',
    ],
    features: [
      { title: 'Media', text: 'Track, artwork and play, pause, next and previous for apps that publish to Windows media controls.' },
      { title: 'Pop-ups', text: 'Volume changes, plugging in or unplugging, and battery at 20% and 10%.' },
      { title: 'Timer', text: 'Start, pause, resume and cancel, with a "Timer finished" alert and a sound.' },
      { title: 'Keyboard mode', text: 'Ctrl+Alt+I opens the island with keyboard focus; Tab moves between buttons and Esc gives focus back.' },
    ],
    architecture: {
      intro: ['`IslandBar.Core` holds the logic with no Windows parts (timer states, settings, battery alert rules, placement maths), and the WPF app holds the windows, services and Windows API calls.'],
    },
    decisions: [
      {
        challenge: 'A floating window that takes focus would interrupt whatever you are typing.',
        decision: 'The window never activates on mouse clicks. Esc after a click works through a global hotkey that is only registered while the island is open.',
      },
      {
        challenge: 'Closing the island when you click elsewhere needs to see clicks in other apps.',
        decision: 'A low-level mouse hook runs only while the island is open, never blocks clicks, and only looks at where a click happened.',
      },
      {
        challenge: 'Windows has no event for "an app just went fullscreen".',
        decision: 'IslandBar reacts to foreground changes and also checks every 2 seconds while "Hide during fullscreen" is on, and the README lists the cases it can miss.',
      },
    ],
    testing: {
      intro: ['A dependency-free runner checks the core logic: timer states, settings limits and JSON, battery alert rules, placement and DPI maths, track position and fullscreen mapping.'],
      stats: [{ value: '38', label: 'logic checks on the core library' }],
      notes: ['I last ran them on Windows 11 on 16 November 2026: 38 passed, 0 failed.'],
    },
    gallery: {
      source: 'Taken on Windows 11 with the app running.',
      images: [
        { src: islandbarWindow, alt: 'IslandBar expanded island playing From The Start by Laufey with media controls and battery at 100 percent', caption: 'The open island with the Media tab.', frame: 'window' },
      ],
    },
    learned: [
      'Working with Windows media, Core Audio and battery APIs from C#.',
      'Windows that never take focus, and the trade-offs that come with that.',
      'Writing down known limits in the README.',
    ],
  },
];
