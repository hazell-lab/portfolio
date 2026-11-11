# Hazim Aqil — Developer Portfolio

My personal portfolio website: a responsive, dark-themed single page that presents my projects, skills, education and internship availability.

**Live site:** https://hazimaqil-portfolio.netlify.app

> Software Engineering student at German-Malaysian Institute (GMI), building React/TypeScript web apps and C#/.NET Windows apps.
> **Available for internship: 11 January – 14 May 2027.**

---

## Features

- **Responsive layout** for phones, tablets and desktops, built with CSS Grid and Flexbox
- **Project filter** to show All, Web, Desktop or Mobile projects (9 projects)
- **Working contact form** using Netlify Forms, with a spam honeypot and clear success/error messages
- **Scroll-based active navigation**, a mobile hamburger menu and a back-to-top button
- **Scroll-reveal animations** and a typing effect in the hero, both turned off for users who prefer reduced motion
- **Accessibility**: skip link, semantic landmarks, alt text on every image, keyboard-friendly controls and `aria-pressed` filter buttons
- **Performance**: compressed WebP screenshots, lazy-loaded images, no framework and no build step
- **Link previews**: Open Graph tags so the site shows a proper card when shared on LinkedIn or WhatsApp

## Tech stack

| Area | Tools |
|---|---|
| Markup & styling | HTML5, CSS3 (custom properties, Grid, Flexbox, media queries) |
| Behaviour | Vanilla JavaScript (ES6+), Intersection Observer, Fetch API |
| Icons & fonts | Font Awesome, Google Fonts |
| Forms | Netlify Forms |
| Hosting | Netlify |

## Projects featured

| Project | Type | Stack | Links |
|---|---|---|---|
| Streamix | Web | React, TypeScript, Vite, Tailwind, Vitest | [Demo](https://streamix-hazim.netlify.app) · [Code](https://github.com/hazell-lab/Streamix) |
| WaveMusic | Web | HTML, CSS, JavaScript, Media Session API | [Demo](https://hazell-lab.github.io/WaveMusic/) · [Code](https://github.com/hazell-lab/WaveMusic) |
| Yes, Halal | Mobile (team FYP) | Flutter, Dart, Node.js, Firestore | — |
| ClipNest | Desktop | C#, .NET 10, WPF, SQLite | [Code](https://github.com/hazell-lab/ClipNest) |
| HazStore | Web | HTML, CSS, JavaScript | [Demo](https://hazstore-ecommerce.netlify.app) · [Code](https://github.com/hazell-lab/haz-store) |
| HazCast | Web | HTML, CSS, JavaScript, Open-Meteo API | [Demo](https://hazcast-weatherdashboard.netlify.app) · [Code](https://github.com/hazell-lab/Haz-Cast) |
| HazFocus | Web | HTML, CSS, JavaScript | [Demo](https://productivity-app-hazim.netlify.app) · [Code](https://github.com/hazell-lab/Haz-Focus) |
| Kite | Desktop | C#, .NET 10, WPF | [Code](https://github.com/hazell-lab/kite) |
| IslandBar | Desktop | C#, .NET 8, WPF, NAudio | [Code](https://github.com/hazell-lab/IslandBar) |

## Folder structure

```
portfolio/
├── index.html            # all page content and sections
├── css/
│   └── style.css         # theme variables, layout, components, media queries
├── js/
│   └── script.js         # menu, nav, animations, typing, project filter, contact form
├── assets/
│   ├── images/           # profile photo and project screenshots (.webp)
│   ├── icons/
│   │   └── favicon.svg
│   └── resume/
│       └── resume.pdf    # downloadable CV
└── README.md
```

## Run locally

1. Clone the repo:
   ```bash
   git clone https://github.com/hazell-lab/portfolio.git
   ```
2. Open the folder in VS Code.
3. Install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**.

No `npm install` or build step is needed.

> The contact form only sends messages on the live Netlify site. Locally it shows an error message with my email address instead.

## Deployment

The site is hosted on **Netlify**. Netlify Forms collects contact form messages and emails them to me.

## Contact

- **Email:** mdhazim.aqil@gmail.com
- **LinkedIn:** [linkedin.com/in/mdhazimaqil](https://www.linkedin.com/in/mdhazimaqil/)
- **GitHub:** [github.com/hazell-lab](https://github.com/hazell-lab)

---

© 2026 Hazim Aqil
