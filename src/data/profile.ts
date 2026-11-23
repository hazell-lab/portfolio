// skills, education and experience. every skill group links to the projects that use it.
import type { Course, EducationEntry, ExperienceArea, Job, SkillGroup } from '@/types/content';

// web projects, used below so the lists stay short
const vanillaWeb = ['wavemusic', 'hazstore', 'hazcast', 'hazfocus'];
const allWeb = ['streamix', ...vanillaWeb];

/**
 * skills grouped the way i work. core groups are front end, my main focus.
 * a skill only links to a project when that project's code really uses it.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: 'core',
    label: 'Core front end',
    tier: 'core',
    note: 'The languages every interface I build starts from.',
    items: [
      { name: 'HTML5', projects: vanillaWeb, here: true },
      { name: 'CSS3', projects: vanillaWeb, here: true },
      { name: 'JavaScript', projects: vanillaWeb },
      { name: 'TypeScript', projects: ['streamix'], here: true },
      { name: 'React', projects: ['streamix'], here: true },
    ],
  },
  {
    id: 'styling',
    label: 'Styling and UI',
    tier: 'core',
    note: 'Turning a design into layouts that hold up on every screen.',
    items: [
      { name: 'Tailwind CSS', projects: ['streamix'] },
      { name: 'Responsive Design', projects: allWeb, here: true },
      { name: 'CSS Grid', projects: vanillaWeb, here: true },
      { name: 'Flexbox', projects: vanillaWeb, here: true },
      { name: 'UI/UX Implementation', projects: allWeb, here: true },
      { name: 'Figma' },
    ],
  },
  {
    id: 'engineering',
    label: 'Front-end engineering',
    tier: 'core',
    note: 'How the app behind the interface is put together.',
    items: [
      { name: 'Component Architecture', projects: ['streamix'], here: true },
      { name: 'React Hooks', projects: ['streamix'], here: true },
      { name: 'State Management', projects: ['streamix', 'wavemusic', 'hazfocus'], here: true },
      { name: 'React Router', projects: ['streamix'] },
      { name: 'REST API Integration', projects: ['streamix', 'hazcast'], here: true },
      { name: 'Asynchronous JavaScript', projects: ['streamix', 'hazcast', 'wavemusic'], here: true },
      { name: 'Form Handling', projects: ['hazstore', 'hazfocus'], here: true },
      { name: 'Error Handling', projects: ['streamix', 'hazcast'], here: true },
      { name: 'Data Fetching', projects: ['streamix', 'hazcast', 'wavemusic'], here: true },
      { name: 'Browser APIs', projects: ['wavemusic', 'hazcast', 'hazfocus', 'hazstore'], here: true },
    ],
  },
  {
    id: 'quality',
    label: 'Testing and quality',
    tier: 'core',
    note: 'Checking that it works, for everyone, and stays fast.',
    items: [
      { name: 'Vitest', projects: ['streamix'], here: true },
      { name: 'React Testing Library', projects: ['streamix'], here: true },
      { name: 'Unit Testing', projects: ['streamix', 'clipnest', 'kite'], here: true },
      { name: 'Component Testing', projects: ['streamix'], here: true },
      { name: 'ESLint', projects: ['streamix'], here: true },
      { name: 'Accessibility', projects: ['streamix', 'hazstore'], here: true },
      { name: 'Performance Optimization', projects: ['streamix'], here: true },
    ],
  },
  {
    id: 'tools',
    label: 'Development tools',
    tier: 'supporting',
    note: 'What I use every day to write, test and ship code.',
    items: [{ name: 'Git' }, { name: 'GitHub' }, { name: 'VS Code' }, { name: 'Postman', projects: ['yes-halal'] }, { name: 'npm' }],
  },
  {
    id: 'supporting',
    label: 'Supporting knowledge',
    tier: 'supporting',
    note: 'Outside the browser: back end, data, desktop and mobile work from my studies and projects.',
    items: [
      { name: 'Node.js', projects: ['yes-halal'] },
      { name: 'Firebase', projects: ['yes-halal'] },
      { name: 'SQL', projects: ['clipnest'] },
      { name: 'C#', projects: ['clipnest', 'kite', 'islandbar'] },
      { name: '.NET', projects: ['clipnest', 'kite', 'islandbar'] },
      { name: 'Flutter', projects: ['yes-halal'] },
      { name: 'Dart', projects: ['yes-halal'] },
    ],
  },
];

export const coursework = ['Java', 'Python', 'C++', 'PHP', 'Kotlin', 'MySQL'];

export const spokenLanguages = ['Malay (native)', 'English (intermediate)', 'German (basic)'];

export const education: EducationEntry[] = [
  {
    period: '2024 – 2027',
    expected: true,
    title: 'Diploma in Software Engineering',
    place: 'German-Malaysian Institute',
    text: 'Currently studying software engineering with a focus on programming fundamentals and practical software development. My coursework includes:',
    list: ['Programming', 'Software development', 'Database systems', 'Mobile development', 'Web development'],
    badge: { label: 'CGPA', value: '3.70' },
  },
  {
    period: '2019 – 2024',
    title: 'Secondary Education — SPM',
    place: 'SMK KEM Terendak',
    text: 'Completed secondary education with an interest in science, mathematics, and computer-related subjects, which led me to study software engineering. Awards:',
    list: ['Pelajar Target SPM', 'Anugerah Cemerlang (SPM Trial)'],
    badge: { label: 'SPM results', value: '7A', note: '5A, 2A−, 1B+' },
  },
];

export const courses: Course[] = [
  { title: 'AWS AI & Cloud Skills Day', text: 'Mini hackathons on AI and cloud services, run by the AWS Student Builder Group.' },
  { title: 'Cisco Networking Academy — IT Essentials', text: 'Computer hardware, networking and IT support basics.' },
  { title: 'Cisco CCNA — Introduction to Networks', text: 'Network basics, addressing and how devices communicate.' },
  { title: 'Cisco — Introduction to IoT', text: 'How connected devices, sensors and data work together.' },
];

/** practical skills from projects, each one pointing at the projects that show it */
export const experienceAreas: ExperienceArea[] = [
  {
    title: 'React + TypeScript',
    text: 'Migrated Streamix to strict TypeScript, with React Router, Context API, custom hooks, code splitting with React.lazy, and debounced search synced to the URL.',
    projects: ['streamix'],
  },
  {
    title: 'Working with REST APIs',
    text: 'Fetched and displayed live data from TMDB (Streamix) and Open-Meteo (HazCast), with request caching, loading states and clear error messages.',
    projects: ['streamix', 'hazcast'],
  },
  {
    title: 'Interfaces without a framework',
    text: 'Built WaveMusic, HazStore, HazCast and HazFocus in plain HTML, CSS and JavaScript: one state object or list as the source of truth, small render functions, saved data checked before it is used, and keyboard-friendly drawers and dialogs.',
    projects: ['wavemusic', 'hazstore', 'hazcast', 'hazfocus'],
  },
  {
    title: 'Backend and databases',
    text: 'Wrote the Node.js API and Firestore data layer for Yes, Halal, added Firebase Authentication, and tested endpoints with Postman.',
    projects: ['yes-halal'],
  },
  {
    title: 'Native Windows apps',
    text: 'Built ClipNest, Kite and IslandBar in C# with WPF, calling Win32 clipboard, hotkey, tray and audio APIs directly, with per-monitor DPI and keyboard support.',
    projects: ['clipnest', 'kite', 'islandbar'],
  },
  {
    title: 'Automated testing',
    text: 'Wrote 34 Vitest + React Testing Library tests for Streamix, plus 125 unit tests for ClipNest and 103 for Kite, keeping core logic in separate, testable libraries.',
    projects: ['streamix', 'clipnest', 'kite'],
  },
  {
    title: 'Leading a team',
    text: 'Led a four-member team on my final year project: deciding how the app is built, guiding each teammate on what to implement, and connecting front end to back end.',
    projects: ['yes-halal'],
  },
];

export const jobs: Job[] = [
  {
    period: 'Mar – Jun 2024',
    title: 'Laptop & Printer Service Technician',
    place: 'Terra Tech Venture',
    text: 'Diagnosed and repaired laptop and printer faults, and explained technical issues clearly to non-technical customers.',
  },
  {
    period: 'Short-term',
    title: 'Part-Time Beverage Maker',
    place: 'PERAH Juices',
    text: 'Served customers in a fast-paced setting, building communication, teamwork and time-management skills.',
  },
];

/** the about section: a short development story, rich text allowed */
export const about = {
  lede: 'A student developer who builds for the web, and cares how it feels to use.',
  heading: "Hello! I'm Hazim Aqil.",
  notes: [
    {
      label: 'Now',
      text: 'I am a **Software Engineering student** at **German-Malaysian Institute** in Malaysia, and **front-end development** is where I want to build my career. What I enjoy most is the part people actually touch: layouts that hold up on any screen, controls that work with a keyboard, and pages that load quickly.',
    },
    {
      label: 'Practice',
      text: 'Most of what I know comes from **building things**. **Streamix** taught me React, strict TypeScript, routing, custom hooks and testing with React Testing Library. **WaveMusic**, **HazStore**, **HazCast** and **HazFocus** are plain JavaScript on purpose, so I understand the DOM, state and browser APIs without a framework doing it for me. This site is built the same way: Astro for the pages, React for the interactive parts, and tests for both.',
    },
    {
      label: 'Beyond',
      text: 'My studies and team work also took me outside the browser. I led a four-person team on **Yes, Halal**, a Flutter app where I wrote the Node.js API and connected the app to it, and I built three Windows tools in C# and WPF. That work helps me understand what sits behind an interface, though the interface is what I want to keep getting better at.',
    },
    {
      label: 'Next',
      text: 'I am still early, and I know it. I am looking for an **18-week front-end internship (11 January – 14 May 2027)** with a team where I can ship real work, get my code reviewed and learn how professional front ends are built and maintained.',
    },
  ],
  /** quick facts, each one backed by a project or my results */
  proof: [
    'Built a React + strict TypeScript app covered by 34 Vitest and React Testing Library tests',
    'Built 4 web apps in plain JavaScript, with no framework or library',
    'Fetched live data from REST APIs (TMDB, Open-Meteo) with loading, error and stale-response handling',
    'Built keyboard-friendly drawers, modals and dialogs with focus that returns where it started',
    '5 web projects with live demos, 8 projects with public code on GitHub',
    'CGPA 3.70 in Diploma in Software Engineering',
  ],
  facts: [
    { label: 'Location', value: 'Melaka, Malaysia' },
    { label: 'Education', value: 'Diploma in Software Engineering' },
    { label: 'Focus', value: 'Front-End Development' },
    { label: 'Internship availability', value: '11 January – 14 May 2027' },
  ],
};
