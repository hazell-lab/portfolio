// helpers for reading the project list. pure functions, so they are easy to test.
import type { Project, ProjectCategory } from '@/types/content';

export type ProjectFilter = ProjectCategory | 'all';

export const categoryLabels: Record<ProjectCategory, string> = {
  web: 'Web app',
  desktop: 'Windows app',
  mobile: 'Mobile app',
};

export const filterLabels: Record<ProjectFilter, string> = {
  all: 'All',
  web: 'Web',
  desktop: 'Desktop',
  mobile: 'Mobile',
};

export const filterOrder: ProjectFilter[] = ['all', 'web', 'desktop', 'mobile'];

export function projectPath(slug: string): string {
  return `/projects/${slug}/`;
}

export function findProject(list: readonly Project[], slug: string): Project | undefined {
  return list.find((project) => project.slug === slug);
}

/** like findProject, but a missing slug is a bug in the data, so fail loudly at build time */
export function getProject(list: readonly Project[], slug: string): Project {
  const project = findProject(list, slug);
  if (!project) {
    throw new Error(`unknown project slug: ${slug}`);
  }
  return project;
}

export function countByFilter(list: readonly { category: ProjectCategory }[]): Record<ProjectFilter, number> {
  const counts: Record<ProjectFilter, number> = { all: list.length, web: 0, desktop: 0, mobile: 0 };
  for (const project of list) {
    counts[project.category] += 1;
  }
  return counts;
}

/** reads ?filter= from a url query, anything unknown means all */
export function parseFilter(value: string | null | undefined): ProjectFilter {
  return filterOrder.find((filter) => filter === value) ?? 'all';
}

export function matchesFilter(category: ProjectCategory, filter: ProjectFilter): boolean {
  return filter === 'all' || category === filter;
}

/** the projects before and after this one, wrapping around the ends */
export function neighbours(list: readonly Project[], slug: string): { previous: Project; next: Project } {
  const index = list.findIndex((project) => project.slug === slug);
  if (index === -1 || list.length < 2) {
    throw new Error(`cannot find neighbours for ${slug}`);
  }
  const previous = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  if (!previous || !next) {
    throw new Error(`cannot find neighbours for ${slug}`);
  }
  return { previous, next };
}

/**
 * related projects: same category first, then the ones that share the most technologies.
 * the current project and its direct neighbours are left out, since they are already linked.
 */
export function relatedProjects(list: readonly Project[], slug: string, limit = 2): Project[] {
  const current = getProject(list, slug);
  const { previous, next } = neighbours(list, slug);
  const skip = new Set([current.slug, previous.slug, next.slug]);
  const stack = new Set(current.stack);

  return list
    .filter((project) => !skip.has(project.slug))
    .map((project, order) => ({
      project,
      order,
      score:
        (project.category === current.category ? 10 : 0) +
        project.stack.filter((tech) => stack.has(tech)).length,
    }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit)
    .map((entry) => entry.project);
}

export interface Totals {
  projects: number;
  liveDemos: number;
  openSource: number;
  vitest: number;
  dotnet: number;
  checks: number;
}

/** the numbers in the hero, worked out from the data so they never drift */
export function totals(list: readonly Project[]): Totals {
  const sumTests = (tool: string) =>
    list.reduce((sum, project) => sum + (project.tests?.tool === tool ? project.tests.count : 0), 0);

  return {
    projects: list.length,
    liveDemos: list.filter((project) => project.links.demo).length,
    openSource: list.filter((project) => project.links.code).length,
    vitest: sumTests('Vitest'),
    dotnet: sumTests('xUnit'),
    checks: sumTests('custom checks'),
  };
}

/** a two digit index like 01 */
export function pad(index: number): string {
  return String(index).padStart(2, '0');
}
