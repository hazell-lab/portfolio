// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectExplorer } from '@/components/react/projects/ProjectExplorer';
import type { ProjectCardData } from '@/components/react/projects/types';

const image = { src: '/a.webp', srcSet: '/a.webp 400w', sizes: '400px', width: 400, height: 250, alt: '' };

const card = (slug: string, category: ProjectCardData['category'], group: ProjectCardData['group'], index: number) =>
  ({
    slug,
    name: slug.toUpperCase(),
    kind: 'App',
    category,
    group,
    index,
    summary: `${slug} summary`,
    stack: ['HTML'],
    href: `/projects/${slug}/`,
    image,
  }) satisfies ProjectCardData;

const projects = [
  card('alpha', 'web', 'featured', 1),
  card('beta', 'web', 'more', 2),
  card('gamma', 'mobile', 'more', 3),
  card('delta', 'desktop', 'supporting', 4),
];

const filterButton = (name: RegExp) => within(screen.getByRole('group', { name: /filter projects/i })).getByRole('button', { name });

describe('ProjectExplorer', () => {
  it('shows every project with counts on the filters', () => {
    render(<ProjectExplorer projects={projects} />);
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(filterButton(/all/i)).toHaveAttribute('aria-pressed', 'true');
    expect(filterButton(/all/i)).toHaveTextContent('4');
    expect(filterButton(/web/i)).toHaveTextContent('2');
  });

  it('filters by type, keeps the choice in the url and announces the result', async () => {
    const user = userEvent.setup();
    render(<ProjectExplorer projects={projects} />);

    await user.click(filterButton(/web/i));

    expect(screen.getAllByRole('article').map((article) => article.id)).toEqual(['project-alpha', 'project-beta']);
    expect(filterButton(/web/i)).toHaveAttribute('aria-pressed', 'true');
    expect(filterButton(/all/i)).toHaveAttribute('aria-pressed', 'false');
    expect(window.location.search).toBe('?filter=web');
    expect(screen.getByRole('status')).toHaveTextContent('Showing 2 projects');
    expect(screen.queryByRole('heading', { name: /supporting desktop work/i })).not.toBeInTheDocument();
  });

  it('starts from the filter already in the url, and "all" removes it again', async () => {
    window.history.replaceState(null, '', '/?filter=desktop');
    const user = userEvent.setup();
    render(<ProjectExplorer projects={projects} />);
    expect(screen.getAllByRole('article')).toHaveLength(1);

    await user.click(filterButton(/all/i));
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(window.location.search).toBe('');
  });

  it('treats an unknown filter in the url as all', () => {
    window.history.replaceState(null, '', '/?filter=games');
    render(<ProjectExplorer projects={projects} />);
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });

  it('lists the shown projects in the contents list with links to them', () => {
    render(<ProjectExplorer projects={projects} />);
    const list = screen.getByRole('navigation', { name: 'Project list' });
    const links = within(list).getAllByRole('link');
    expect(links).toHaveLength(4);
    expect(links[0]).toHaveAttribute('href', '#project-alpha');
  });

  it('gives each card one case study link that names the project', () => {
    render(<ProjectExplorer projects={projects} />);
    expect(screen.getByRole('link', { name: /case study: alpha/i })).toHaveAttribute('href', '/projects/alpha/');
  });
});
