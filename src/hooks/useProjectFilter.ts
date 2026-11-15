// the project filter: the chosen type lives in ?filter=, the lists are worked out from it.
import { useCallback, useMemo } from 'react';
import { countByFilter, matchesFilter, parseFilter, type ProjectFilter } from '@/lib/projects';
import type { ProjectCategory } from '@/types/content';
import { useQueryParam } from './useQueryParam';

export interface Filterable {
  slug: string;
  category: ProjectCategory;
}

export function useProjectFilter<T extends Filterable>(projects: readonly T[]) {
  const [raw, setRaw] = useQueryParam('filter');
  const filter = parseFilter(raw);

  const visible = useMemo(() => projects.filter((project) => matchesFilter(project.category, filter)), [projects, filter]);
  const counts = useMemo(() => countByFilter(projects), [projects]);

  const setFilter = useCallback((next: ProjectFilter) => setRaw(next === 'all' ? null : next), [setRaw]);

  return { filter, setFilter, visible, counts };
}
