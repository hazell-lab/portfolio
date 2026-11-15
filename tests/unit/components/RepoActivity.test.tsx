// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepoActivity, timeAgo } from '@/components/react/projects/RepoActivity';

const url = 'https://github.com/hazell-lab/Streamix';

const answer = (status: number, body: unknown) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  );

describe('timeAgo', () => {
  const now = Date.parse('2026-11-16T12:00:00Z');

  it('writes short relative times', () => {
    expect(timeAgo('2026-11-15T12:00:00Z', now)).toBe('yesterday');
    expect(timeAgo('2026-10-26T12:00:00Z', now)).toBe('3 weeks ago');
    expect(timeAgo('2026-11-16T11:59:30Z', now)).toBe('just now');
  });
});

describe('RepoActivity', () => {
  it('starts with a plain link and a loading note, then shows the live details', async () => {
    answer(200, {
      full_name: 'hazell-lab/Streamix',
      html_url: url,
      description: null,
      language: 'TypeScript',
      pushed_at: new Date().toISOString(),
      default_branch: 'main',
      archived: false,
    });
    render(<RepoActivity url={url} projectName="Streamix" />);

    expect(screen.getByRole('link', { name: /source code for streamix/i })).toHaveAttribute('href', url);
    expect(screen.getByText(/loading the latest activity/i)).toBeInTheDocument();

    expect(await screen.findByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /hazell-lab\/streamix/i })).toHaveAttribute('href', url);
    expect(screen.getByRole('link', { name: /commit history/i })).toHaveAttribute('href', `${url}/commits/main`);
    expect(screen.getByRole('complementary')).toHaveAttribute('aria-busy', 'false');
  });

  it('explains a rate limit and keeps the link to the code', async () => {
    answer(403, { message: 'rate limit' });
    render(<RepoActivity url={url} projectName="Streamix" />);

    expect(await screen.findByText(/github is limiting requests/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /source code for streamix/i })).toBeInTheDocument();
  });

  it('cancels the request when it leaves the page', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => undefined));
    const { unmount } = render(<RepoActivity url={url} projectName="Streamix" />);
    const signal = fetchMock.mock.calls[0]?.[1]?.signal;
    expect(signal?.aborted).toBe(false);
    unmount();
    expect(signal?.aborted).toBe(true);
  });
});
