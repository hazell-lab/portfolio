// reads public details of a repository from the github rest api.
// no token: the public api needs none for this, and a token must never ship in browser code.
// answers are checked before use, and kept for 30 minutes in sessionStorage to save the
// 60 requests an hour that github allows each visitor without a token.
import { fetchWithTimeout, isAbortError } from './http';

export interface RepoSummary {
  fullName: string;
  url: string;
  description: string | null;
  language: string | null;
  pushedAt: string;
  defaultBranch: string;
  archived: boolean;
}

export type RepoErrorReason = 'not-found' | 'rate-limited' | 'network' | 'invalid';

export class RepoError extends Error {
  constructor(public readonly reason: RepoErrorReason) {
    super(`could not load repository: ${reason}`);
    this.name = 'RepoError';
  }
}

const cacheTtlMs = 30 * 60 * 1000;
const cachePrefix = 'repo:';

/** owner and name from a github url, or null for anything else */
export function parseRepoUrl(url: string): { owner: string; name: string } | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'github.com') return null;
    const [owner, name] = parsed.pathname.split('/').filter(Boolean);
    if (!owner || !name) return null;
    return { owner, name: name.replace(/\.git$/, '') };
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

const isNullableString = (value: unknown): value is string | null => value === null || typeof value === 'string';

/** turns the raw api answer into a RepoSummary, or null when it does not look right */
export function toRepoSummary(data: unknown): RepoSummary | null {
  if (!isRecord(data)) return null;
  const { full_name, html_url, description, language, pushed_at, default_branch, archived } = data;
  if (
    typeof full_name !== 'string' ||
    typeof html_url !== 'string' ||
    !html_url.startsWith('https://github.com/') ||
    !isNullableString(description) ||
    !isNullableString(language) ||
    typeof pushed_at !== 'string' ||
    Number.isNaN(Date.parse(pushed_at)) ||
    typeof default_branch !== 'string' ||
    typeof archived !== 'boolean'
  ) {
    return null;
  }
  return {
    fullName: full_name,
    url: html_url,
    description,
    language,
    pushedAt: pushed_at,
    defaultBranch: default_branch,
    archived,
  };
}

function readCache(key: string, now: number): RepoSummary | null {
  try {
    const raw = sessionStorage.getItem(cachePrefix + key);
    if (!raw) return null;
    const entry: unknown = JSON.parse(raw);
    if (!isRecord(entry) || typeof entry['savedAt'] !== 'number' || now - entry['savedAt'] > cacheTtlMs) return null;
    return toRepoSummary(entry['data']);
  } catch {
    return null;
  }
}

function writeCache(key: string, raw: unknown, now: number): void {
  try {
    sessionStorage.setItem(cachePrefix + key, JSON.stringify({ savedAt: now, data: raw }));
  } catch {
    // storage full or blocked, the next visit simply asks github again
  }
}

export async function fetchRepo(
  owner: string,
  name: string,
  options: { signal?: AbortSignal; now?: number } = {},
): Promise<RepoSummary> {
  const key = `${owner}/${name}`.toLowerCase();
  const now = options.now ?? Date.now();
  const cached = readCache(key, now);
  if (cached) return cached;

  let response: Response;
  try {
    response = await fetchWithTimeout(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`, {
      headers: { Accept: 'application/vnd.github+json' },
      timeoutMs: 8_000,
      ...(options.signal && { signal: options.signal }),
    });
  } catch (error) {
    // an abort is passed on as it is, so the caller can tell it apart
    if (isAbortError(error)) throw error;
    throw new RepoError('network');
  }

  if (response.status === 404) throw new RepoError('not-found');
  if (response.status === 403 || response.status === 429) throw new RepoError('rate-limited');
  if (!response.ok) throw new RepoError('network');

  const raw: unknown = await response.json().catch(() => null);
  const summary = toRepoSummary(raw);
  if (!summary) throw new RepoError('invalid');

  writeCache(key, raw, now);
  return summary;
}
