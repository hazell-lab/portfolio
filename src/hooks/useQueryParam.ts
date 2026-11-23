// one value in the address bar, like ?filter=desktop, as react state.
// writing uses history.replaceState, so it does not add a history entry for every click,
// and every component reading the same key stays in sync.
import { useCallback, useSyncExternalStore } from 'react';

const changeEvent = 'querychange';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function readQueryParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key);
}

/** writes the value, or removes the key when value is null */
export function writeQueryParam(key: string, value: string | null): void {
  const url = new URL(window.location.href);
  if (value === null) url.searchParams.delete(key);
  else url.searchParams.set(key, value);
  history.replaceState(history.state, '', url);
  window.dispatchEvent(new Event(changeEvent));
}

export function useQueryParam(key: string): [string | null, (value: string | null) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => readQueryParam(key),
    // the static html is built without a query, so the server always sees none
    () => null,
  );

  const setValue = useCallback((next: string | null) => writeQueryParam(key, next), [key]);

  return [value, setValue];
}
