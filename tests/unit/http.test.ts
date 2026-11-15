import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWithTimeout, isAbortError, TimeoutError } from '@/services/http';
import { sendContactMessage } from '@/services/contact';

// a fetch that only finishes when its signal aborts, like a server that never answers
const hangingFetch = () =>
  vi.spyOn(globalThis, 'fetch').mockImplementation(
    (_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      }),
  );

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('fetchWithTimeout', () => {
  it('gives up after the time limit with a TimeoutError', async () => {
    vi.useFakeTimers();
    hangingFetch();
    const request = fetchWithTimeout('/slow', { timeoutMs: 1000 });
    const check = expect(request).rejects.toBeInstanceOf(TimeoutError);
    await vi.advanceTimersByTimeAsync(1000);
    await check;
  });

  it('stops when the caller aborts, and that is not a timeout', async () => {
    hangingFetch();
    const controller = new AbortController();
    const request = fetchWithTimeout('/slow', { signal: controller.signal });
    controller.abort();
    const error = await request.catch((caught: unknown) => caught);
    expect(isAbortError(error)).toBe(true);
    expect(error).not.toBeInstanceOf(TimeoutError);
  });
});

describe('sendContactMessage', () => {
  const values = { name: ' Aina ', email: 'aina@example.com', subject: 'Hello', message: 'A message long enough.' };

  it('posts the form the way netlify expects', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 200 }));
    const result = await sendContactMessage(values, { honeypot: '' });
    expect(result).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/');
    expect(init?.method).toBe('POST');
    const body = new URLSearchParams(String(init?.body));
    expect(body.get('form-name')).toBe('contact');
    expect(body.get('bot-field')).toBe('');
    expect(body.get('name')).toBe('Aina');
  });

  it('never reports success when netlify does not answer ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 404 }));
    expect(await sendContactMessage(values)).toEqual({ ok: false, reason: 'server', status: 404 });
  });

  it('reports a lost connection as a network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('offline'));
    expect(await sendContactMessage(values)).toEqual({ ok: false, reason: 'network' });
  });
});
