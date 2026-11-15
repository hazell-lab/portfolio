// personal details, links and navigation. change things here, not in the components.
import type { NavItem, Person, SocialLink } from '@/types/content';

export const person: Person = {
  name: 'Hazim Aqil',
  firstName: 'Hazim',
  lastName: 'Aqil',
  title: 'Software Engineering Student / Aspiring Front-End Developer',
  location: 'Melaka, Malaysia',
  timeZone: 'Asia/Kuala_Lumpur',
  email: 'mdhazim.aqil@gmail.com',
  summary:
    'Software Engineering student at German-Malaysian Institute and aspiring front-end developer who builds responsive, accessible web apps with React and TypeScript.',
  availability: {
    label: '11 January – 14 May 2027',
    from: '2027-01-11',
    to: '2027-05-14',
    weeks: 18,
  },
  resume: {
    href: '/assets/resume/resume.pdf',
    fileName: 'Hazim-Aqil-Resume.pdf',
  },
};

export const socials: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/hazell-lab/',
    icon: 'github',
    display: 'github.com/hazell-lab',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mdhazimaqil/',
    icon: 'linkedin',
    display: 'linkedin.com/in/mdhazimaqil',
  },
  {
    label: 'Email',
    href: `mailto:${person.email}`,
    icon: 'mail',
    display: person.email,
  },
];

/** sections of the home page, in page order */
export const navigation: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];
