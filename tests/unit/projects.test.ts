import { describe, expect, it } from 'vitest';
import type { Project } from '@/types/content';
import {
  countByFilter,
  findProject,
  getProject,
  matchesFilter,
  neighbours,
  pad,
  parseFilter,
  projectPath,
  relatedProjects,
  totals,
} from '@/lib/projects';

// small fake projects, only the fields the helpers read matter
function make(slug: string, category: Project['category'], stack: string[], extra: Partial<Project> = {}): Project {
  return {
    slug,
    name: slug.toUpperCase(),
    kind: 'Test',
    category,
    featured: false,
    summary: '',
    lede: '',
    role: '',
    type: '',
    stack,
    links: {},
    cover: { src: { src: '', width: 1, height: 1, format: 'webp' }, alt: '' },
    overview: [],
    features: [],
    testing: { intro: [] },
    learned: [],
    ...extra,
  };
}

const list: Project[] = [
  make('a', 'web', ['React', 'TypeScript'], { links: { demo: 'https://a', code: 'https://a' }, tests: { count: 10, tool: 'Vitest' } }),
  make('b', 'web', ['HTML', 'CSS'], { links: { demo: 'https://b' } }),
  make('c', 'desktop', ['C#', 'WPF'], { links: { code: 'https://c' }, tests: { count: 5, tool: 'xUnit' } }),
  make('d', 'mobile', ['Flutter']),
  make('e', 'web', ['React', 'CSS'], { tests: { count: 3, tool: 'custom checks' } }),
  make('f', 'desktop', ['C#']),
];

describe('project lookups', () => {
  it('builds clean urls with a trailing slash', () => {
    expect(projectPath('kite')).toBe('/projects/kite/');
  });

  it('finds a project, and fails loudly for an unknown slug', () => {
    expect(findProject(list, 'c')?.name).toBe('C');
    expect(findProject(list, 'zzz')).toBeUndefined();
    expect(() => getProject(list, 'zzz')).toThrow(/unknown project slug/);
  });
});

describe('filters', () => {
  it('counts projects per category', () => {
    expect(countByFilter(list)).toEqual({ all: 6, web: 3, desktop: 2, mobile: 1 });
  });

  it('reads ?filter= safely, anything unknown means all', () => {
    expect(parseFilter('desktop')).toBe('desktop');
    expect(parseFilter('nope')).toBe('all');
    expect(parseFilter(null)).toBe('all');
    expect(parseFilter('<script>')).toBe('all');
  });

  it('matches by category', () => {
    expect(matchesFilter('web', 'all')).toBe(true);
    expect(matchesFilter('web', 'web')).toBe(true);
    expect(matchesFilter('web', 'mobile')).toBe(false);
  });
});

describe('neighbours', () => {
  it('returns the previous and next project', () => {
    const { previous, next } = neighbours(list, 'c');
    expect(previous.slug).toBe('b');
    expect(next.slug).toBe('d');
  });

  it('wraps around at both ends', () => {
    expect(neighbours(list, 'a').previous.slug).toBe('f');
    expect(neighbours(list, 'f').next.slug).toBe('a');
  });
});

describe('relatedProjects', () => {
  it('prefers the same category, then shared technologies, and skips self and neighbours', () => {
    // neighbours of a are f and b, so they are left out
    const related = relatedProjects(list, 'a').map((project) => project.slug);
    expect(related).toEqual(['e', 'c']);
  });

  it('never returns the project itself or a duplicate', () => {
    for (const project of list) {
      const related = relatedProjects(list, project.slug, 3).map((item) => item.slug);
      expect(related).not.toContain(project.slug);
      expect(new Set(related).size).toBe(related.length);
    }
  });
});

describe('totals', () => {
  it('adds up demos, repositories and tests per tool', () => {
    expect(totals(list)).toEqual({ projects: 6, liveDemos: 2, openSource: 2, vitest: 10, dotnet: 5, checks: 3 });
  });
});

describe('pad', () => {
  it('pads to two digits', () => {
    expect(pad(3)).toBe('03');
    expect(pad(12)).toBe('12');
  });
});
