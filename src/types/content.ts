// shared types for every piece of portfolio content.
// text fields marked "rich" may use **bold** and `code`, see src/lib/inline.ts.
import type { ImageMetadata } from 'astro';

/** a link that leaves the site, or an internal anchor */
export interface Link {
  label: string;
  href: string;
}

export interface SocialLink extends Link {
  /** id of the icon in the svg sprite */
  icon: 'github' | 'linkedin' | 'mail';
  /** short value shown in the contact list, like github.com/hazell-lab */
  display: string;
}

export interface Person {
  name: string;
  /** the name split for the hero wordmark */
  firstName: string;
  lastName: string;
  title: string;
  location: string;
  timeZone: string;
  email: string;
  /** one sentence used for meta descriptions */
  summary: string;
  availability: {
    label: string;
    /** iso dates, used for structured data and the countdown text */
    from: string;
    to: string;
    weeks: number;
  };
  resume: {
    href: string;
    fileName: string;
  };
}

export interface NavItem {
  /** id of the section on the home page */
  id: string;
  label: string;
}

export type ProjectCategory = 'web' | 'desktop' | 'mobile';

export interface ProjectImage {
  src: ImageMetadata;
  alt: string;
  caption?: string;
  /** how the image is framed: wide app window, phone or small desktop window */
  frame?: 'wide' | 'phone' | 'window';
}

export interface Feature {
  title: string;
  /** rich text */
  text: string;
}

export interface Decision {
  /** rich text */
  challenge: string;
  /** rich text */
  decision: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  name: string;
  /** short descriptor shown next to the name, like "Streaming Web App" */
  kind: string;
  category: ProjectCategory;
  /** featured projects get the large layout on the home page */
  featured: boolean;
  badge?: string;
  /** one paragraph for the home page card */
  summary: string;
  /** opening paragraph of the project page */
  lede: string;
  /** one real number for the card, only when it has been checked */
  figure?: Stat;
  /** automated tests i ran myself, used for the totals in the hero */
  tests?: {
    count: number;
    tool: 'Vitest' | 'xUnit' | 'node:test' | 'custom checks';
  };
  role: string;
  type: string;
  team?: {
    size: number;
    /** rich text items: what i was responsible for */
    contribution: string[];
  };
  stack: string[];
  links: {
    demo?: string;
    code?: string;
  };
  /** shown when there is no demo or code link, like "Windows 11 app" */
  platformNote?: string;
  cover: ProjectImage;
  /** rich text paragraphs */
  overview: string[];
  /** rich text paragraphs, only where the reason is documented */
  motivation?: string[];
  features: Feature[];
  /** rich text: how the front end is built, checked against the source code */
  frontEnd?: string[];
  architecture?: {
    /** rich text paragraphs */
    intro: string[];
    tree?: string;
    table?: { label: string; value: string }[];
  };
  decisions?: Decision[];
  /** rich text: known limits written in the project's own docs */
  limits?: string;
  testing: {
    /** rich text paragraphs */
    intro: string[];
    stats?: Stat[];
    notes?: string[];
  };
  gallery?: {
    /** where the screenshots came from */
    source: string;
    images: ProjectImage[];
  };
  learned: string[];
  next?: string[];
}

export interface SkillItem {
  name: string;
  /** slugs of the projects where i used it, only where the code shows it */
  projects?: string[];
  /** true when this portfolio's own code uses it */
  here?: boolean;
}

export interface SkillGroup {
  id: string;
  label: string;
  /** core groups are my front-end focus, supporting ones are shown smaller */
  tier: 'core' | 'supporting';
  /** one line on what the group covers */
  note: string;
  items: SkillItem[];
}

export interface EducationEntry {
  period: string;
  expected?: boolean;
  title: string;
  place: string;
  text: string;
  list: string[];
  badge: {
    label: string;
    value: string;
    note?: string;
  };
}

export interface Course {
  title: string;
  text: string;
}

export interface ExperienceArea {
  title: string;
  text: string;
  /** slugs of the projects that show this skill */
  projects: string[];
}

export interface Job {
  period: string;
  title: string;
  place: string;
  text: string;
}
