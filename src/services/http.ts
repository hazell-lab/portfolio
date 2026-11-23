// small helpers shared by the services that talk to the network

/** a request that took too long, so it was stopped */
export class TimeoutError extends Error {
  constructor(milliseconds: number) {
    super(`request took longer than ${milliseconds}ms`);
    this.name = 'TimeoutError';
  }
}

/** true when the error comes from an abort, so callers can ignore it quietly */
export function isAbortError(error: unknown): boolean {
  // checked by name: the error can come from different DOMException classes (browser, node, jsdom)
  return typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError';
}

/**
 * fetch with a time limit. the caller's signal still works, for example when a component unmounts,
 * and either one stops the request.
 */
export async function fetchWithTimeout(
  input: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = 10_000, signal, ...rest } = init;
  const controller = new AbortController();
  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onCallerAbort = () => controller.abort();
  signal?.addEventListener('abort', onCallerAbort, { once: true });
  if (signal?.aborted) controller.abort();

  try {
    return await fetch(input, { ...rest, signal: controller.signal });
  } catch (error) {
    if (timedOut) throw new TimeoutError(timeoutMs);
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onCallerAbort);
  }
}
