// the plain data the project islands receive from astro.
// images are already optimised at build time, so react only gets their urls.
import type { ProjectCategory } from '@/types/content';

export interface ResponsiveImage {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
}

export type ProjectGroup = 'featured' | 'more' | 'supporting';

export interface ProjectCardData {
  slug: string;
  name: string;
  kind: string;
  category: ProjectCategory;
  group: ProjectGroup;
  /** position in the full list, shown as 01, 02 ... */
  index: number;
  badge?: string;
  summary: string;
  figure?: { value: string; label: string };
  stack: string[];
  href: string;
  demo?: string;
  code?: string;
  /** a short platform note when there is no demo, like "Windows 11 app" */
  note?: { text: string; windows: boolean };
  image: ResponsiveImage;
}

export interface GalleryImage extends ResponsiveImage {
  /** a bigger copy for the lightbox */
  large: string;
  caption?: string;
  frame: 'wide' | 'phone' | 'window';
}
