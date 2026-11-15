// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fetchRepo, parseRepoUrl, RepoError, toRepoSummary, type RepoErrorReason } from '@/services/github';

const raw = {
  full_name: 'hazell-lab/Streamix',
  html_url: 'https://github.com/hazell-lab/Streamix',
  description: 'a streaming app',
  language: 'TypeScript',
  pushed_at: '2026-10-20T10:00:00Z',
  default_branch: 'main',
  archived: false,
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('parseRepoUrl', () => {
  it('reads owner and name from a github url', () => {
    expect(parseRepoUrl('https://github.com/hazell-lab/Streamix')).toEqual({ owner: 'hazell-lab', name: 'Streamix' });
    expect(parseRepoUrl('https://github.com/hazell-lab/kite.git')).toEqual({ owner: 'hazell-lab', name: 'kite' });
  });

  it('refuses other hosts and broken urls', () => {
    expect(parseRepoUrl('https://gitlab.com/a/b')).toBeNull();
    expect(parseRepoUrl('https://github.com/only-owner')).toBeNull();
    expect(parseRepoUrl('not a url')).toBeNull();
  });
});

describe('toRepoSummary', () => {
  it('keeps the fields the page uses', () => {
    expect(toRepoSummary(raw)).toEqual({
      fullName: 'hazell-lab/Streamix',
      url: 'https://github.com/hazell-lab/Streamix',
      description: 'a streaming app',
      language: 'TypeScript',
      pushedAt: '2026-10-20T10:00:00Z',
      defaultBranch: 'main',
      archived: false,
    });
  });

  it('rejects answers that do not look right', () => {
    expect(toRepoSummary(null)).toBeNull();
    expect(toRepoSummary({ ...raw, html_url: 'https://evil.example/x' })).toBeNull();
    expect(toRepoSummary({ ...raw, pushed_at: 'yesterday' })).toBeNull();
    expect(toRepoSummary({ ...raw, archived: 'no' })).toBeNull();
  });
});

describe('fetchRepo', () => {
  it('loads a repository once and then serves it from the session cache', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => json(raw));
    const first = await fetchRepo('hazell-lab', 'Streamix', { now: 1_000 });
    const second = await fetchRepo('hazell-lab', 'Streamix', { now: 2_000 });
    expect(first.fullName).toBe('hazell-lab/Streamix');
    expect(second).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.github.com/repos/hazell-lab/Streamix');
  });

  it('asks again once the cache is older than 30 minutes', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => json(raw));
    await fetchRepo('hazell-lab', 'Streamix', { now: 0 });
    await fetchRepo('hazell-lab', 'Streamix', { now: 31 * 60 * 1000 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each<[number, RepoErrorReason]>([
    [404, 'not-found'],
    [403, 'rate-limited'],
    [429, 'rate-limited'],
    [500, 'network'],
  ])('turns status %i into a %s error', async (status, reason) => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => json({ message: 'no' }, status));
    const error = await fetchRepo('a', 'b').catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(RepoError);
    expect(error).toMatchObject({ reason });
  });

  it('reports a broken answer as invalid and does not cache it', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => json({ hello: 'world' }));
    await expect(fetchRepo('a', 'b')).rejects.toMatchObject({ reason: 'invalid' });
    await expect(fetchRepo('a', 'b')).rejects.toMatchObject({ reason: 'invalid' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('reports a failed connection as a network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('failed to fetch'));
    await expect(fetchRepo('a', 'b')).rejects.toMatchObject({ reason: 'network' });
  });
});
