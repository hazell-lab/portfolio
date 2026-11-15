// the projects section on the home page: filters, a contents list and the project cards.
// the filter is kept in ?filter=, so a filtered view can be shared or restored.
// the server renders every project, so the list is complete even before javascript runs.
import { useCallback, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { pad, type ProjectFilter } from '@/lib/projects';
import { useProjectFilter } from '@/hooks/useProjectFilter';
import { useActiveItem } from '@/hooks/useActiveItem';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { ProjectCard } from './ProjectCard';
import { ProjectFilters } from './ProjectFilters';
import type { ProjectCardData, ProjectGroup } from './types';

const groupTitles: Record<Exclude<ProjectGroup, 'featured'>, { key: string; title: string; note: string }> = {
  more: { key: 'Index', title: 'More projects', note: 'A weather dashboard and my final year team project.' },
  supporting: {
    key: 'Beyond the browser',
    title: 'Supporting desktop work',
    note: 'Native Windows tools built with C# and WPF, outside my main front-end focus.',
  },
};

const compositions = ['a', 'b', 'c'] as const;

export function ProjectExplorer({ projects }: { projects: ProjectCardData[] }) {
  const { filter, setFilter, visible, counts } = useProjectFilter(projects);
  const reducedMotion = usePrefersReducedMotion();
  const ids = useMemo(() => visible.map((project) => `project-${project.slug}`), [visible]);
  const current = useActiveItem(ids);

  const changeFilter = useCallback(
    (next: ProjectFilter) => {
      if (next === filter) return;
      const canAnimate = typeof document.startViewTransition === 'function' && !reducedMotion && !document.hidden;
      if (!canAnimate || document.documentElement.classList.contains('theme-switching')) {
        setFilter(next);
        return;
      }
      // a short cross-fade while the cards swap. flushSync makes react update the page inside the transition
      const root = document.documentElement;
      root.classList.add('filtering');
      const transition = document.startViewTransition(() => flushSync(() => setFilter(next)));
      transition.ready.catch(() => undefined);
      void transition.finished.catch(() => undefined).then(() => root.classList.remove('filtering'));
    },
    [filter, reducedMotion, setFilter],
  );

  const byGroup = (group: ProjectGroup) => visible.filter((project) => project.group === group);
  const featured = byGroup('featured');
  const shown = visible.length;

  return (
    <div className="project-explorer">
      <ProjectFilters active={filter} counts={counts} onChange={changeFilter} />

      <nav className="project-contents" aria-label="Project list">
        <ol>
          {visible.map((project) => (
            <li key={project.slug} data-category={project.category}>
              <a
                href={`#project-${project.slug}`}
                className={current === `project-${project.slug}` ? 'current' : undefined}
                aria-current={current === `project-${project.slug}` ? 'true' : undefined}
              >
                <span aria-hidden="true">{pad(project.index)}</span>
                {project.name}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {featured.length > 0 && (
        <div className="project-group projects-featured">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} variant="feature" composition={compositions[i % 3] ?? 'a'} />
          ))}
        </div>
      )}

      {(['more', 'supporting'] as const).map((group) => {
        const list = byGroup(group);
        if (list.length === 0) return null;
        const heading = groupTitles[group];
        return (
          <section key={group} className={`project-group projects-index projects-${group}`} aria-labelledby={`group-${group}`}>
            <h3 className="index-title" id={`group-${group}`}>
              <span className="meta-key">{heading.key}</span> {heading.title}
            </h3>
            {/* the note describes the whole group, so it only shows when nothing is filtered out */}
            {filter === 'all' && <p className="index-note">{heading.note}</p>}
            {list.map((project) => (
              <ProjectCard key={project.slug} project={project} variant="row" />
            ))}
          </section>
        );
      })}

      <p className="filter-status visually-hidden" id="filter-status" role="status" aria-live="polite">
        {filter === 'all' ? '' : `Showing ${shown} ${shown === 1 ? 'project' : 'projects'}`}
      </p>
    </div>
  );
}
