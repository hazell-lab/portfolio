// live details of the project's public repository, read from the github api.
// the server renders a plain link, so the panel is useful even if the request never runs or fails.
import { useGitHubRepo } from '@/hooks/useGitHubRepo';
import { ExternalLink } from '../ui/ExternalLink';
import { Icon } from '../ui/Icon';

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

/** "3 weeks ago", "yesterday" and so on */
export function timeAgo(iso: string, now = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const format = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return 'just now';
}

const errorText = {
  'not-found': 'The repository details could not be found.',
  'rate-limited': 'GitHub is limiting requests right now, so the details are not shown.',
  network: 'The repository details could not be loaded.',
  invalid: 'GitHub sent an answer this page could not read.',
} as const;

export function RepoActivity({ url, projectName }: { url: string; projectName: string }) {
  const state = useGitHubRepo(url);

  return (
    <aside className="repo-panel" aria-labelledby="repo-title" aria-busy={state.status === 'loading'}>
      <p className="repo-title meta-key" id="repo-title">
        Repository
      </p>

      {state.status === 'success' ? (
        <>
          <p className="repo-name">
            <Icon name="github" />
            <ExternalLink href={state.repo.url}>{state.repo.fullName}</ExternalLink>
          </p>
          <dl className="repo-facts">
            <div>
              <dt>Last push</dt>
              <dd>
                <time dateTime={state.repo.pushedAt}>{timeAgo(state.repo.pushedAt)}</time>
              </dd>
            </div>
            {state.repo.language && (
              <div>
                <dt>Main language</dt>
                <dd>{state.repo.language}</dd>
              </div>
            )}
            {state.repo.archived && (
              <div>
                <dt>Status</dt>
                <dd>Archived</dd>
              </div>
            )}
          </dl>
          <ExternalLink className="link-arrow" href={`${state.repo.url}/commits/${state.repo.defaultBranch}`}>
            Commit history<span className="visually-hidden"> for {projectName}</span> <Icon name="arrow" />
          </ExternalLink>
        </>
      ) : (
        <>
          <p className="repo-name">
            <Icon name="github" />
            <ExternalLink href={url}>Source code for {projectName}</ExternalLink>
          </p>
          {state.status === 'loading' && <p className="repo-note">Loading the latest activity from GitHub...</p>}
          {state.status === 'error' && <p className="repo-note">{errorText[state.reason]}</p>}
        </>
      )}
    </aside>
  );
}
