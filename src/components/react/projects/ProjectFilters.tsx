// the filter buttons. each one is a toggle, so screen readers hear "pressed" on the active one.
import { filterLabels, filterOrder, type ProjectFilter } from '@/lib/projects';

interface Props {
  active: ProjectFilter;
  counts: Record<ProjectFilter, number>;
  onChange: (filter: ProjectFilter) => void;
}

export function ProjectFilters({ active, counts, onChange }: Props) {
  return (
    <div className="project-filters" role="group" aria-label="Filter projects by type">
      {filterOrder.map((filter) => (
        <button
          key={filter}
          type="button"
          className={`filter-btn${filter === active ? ' active' : ''}`}
          data-filter={filter}
          aria-pressed={filter === active}
          onClick={() => onChange(filter)}
        >
          {filterLabels[filter]} <span>{counts[filter]}</span>
        </button>
      ))}
    </div>
  );
}
