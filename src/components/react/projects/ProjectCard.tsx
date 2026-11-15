// one project in the explorer. "feature" is the large layout, "row" the compact one.
// the image and the title both open the project page; the image link is hidden from
// screen readers and the tab order so the same link is not announced twice.
import { categoryLabels, pad } from '@/lib/projects';
import { ExternalLink } from '../ui/ExternalLink';
import { Icon } from '../ui/Icon';
import type { ProjectCardData } from './types';

interface Props {
  project: ProjectCardData;
  variant: 'feature' | 'row';
  composition?: 'a' | 'b' | 'c';
}

export function ProjectCard({ project, variant, composition = 'a' }: Props) {
  const titleId = `project-${project.slug}-title`;
  const classes = ['project-card', variant === 'feature' ? `project-feature feature-${composition}` : 'project-row'].join(' ');
  const { image } = project;

  return (
    <article id={`project-${project.slug}`} className={classes} data-category={project.category} aria-labelledby={titleId}>
      <a className="project-media" href={project.href} tabIndex={-1} aria-hidden="true">
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.sizes}
          width={image.width}
          height={image.height}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </a>

      <div className="project-info">
        <p className="project-index">
          <span>{pad(project.index)}</span> {categoryLabels[project.category]}
          {project.badge && <span className="project-badge">{project.badge}</span>}
        </p>
        <h3 className="project-title" id={titleId}>
          <a href={project.href} className="project-title-link">
            {project.name}
          </a>
          <span className="project-kind">{project.kind}</span>
        </h3>
        <p className="project-description">{project.summary}</p>
        {project.figure && variant === 'feature' && (
          <p className="project-figure">
            <strong>{project.figure.value}</strong> {project.figure.label}
          </p>
        )}
        <ul className="project-tech" aria-label="Technologies">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="project-actions">
          <a className={`btn btn-sm ${variant === 'feature' ? 'btn-primary' : 'btn-outline'}`} href={project.href}>
            Case study<span className="visually-hidden">: {project.name}</span> <Icon name="arrow-right" />
          </a>
          {project.demo && (
            <ExternalLink className="link-arrow" href={project.demo}>
              Live demo<span className="visually-hidden"> of {project.name}</span> <Icon name="arrow" />
            </ExternalLink>
          )}
          {project.code && (
            <ExternalLink className="link-arrow" href={project.code}>
              <Icon name="github" /> Code<span className="visually-hidden"> for {project.name}</span>
            </ExternalLink>
          )}
          {project.note && (
            <span className="project-note">
              {project.note.windows && <Icon name="windows" />} {project.note.text}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
