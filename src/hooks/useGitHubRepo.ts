// loads a repository's public details once the component is on screen.
// the request is cancelled if the component goes away before it finishes.
import { useEffect, useState } from 'react';
import { fetchRepo, parseRepoUrl, RepoError, type RepoErrorReason, type RepoSummary } from '@/services/github';
import { isAbortError } from '@/services/http';

export type RepoState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; repo: RepoSummary }
  | { status: 'error'; reason: RepoErrorReason };

export function useGitHubRepo(url: string | undefined): RepoState {
  const [state, setState] = useState<RepoState>({ status: 'idle' });

  useEffect(() => {
    const repo = url ? parseRepoUrl(url) : null;
    if (!repo) {
      setState({ status: 'error', reason: 'not-found' });
      return undefined;
    }

    const controller = new AbortController();
    setState({ status: 'loading' });

    fetchRepo(repo.owner, repo.name, { signal: controller.signal })
      .then((summary) => setState({ status: 'success', repo: summary }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setState({ status: 'error', reason: error instanceof RepoError ? error.reason : 'network' });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}
