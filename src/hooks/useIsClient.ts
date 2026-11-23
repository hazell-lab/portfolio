// false while rendering on the server and during hydration, true once react runs in the browser.
// used to show controls that only work with javascript, so no dead buttons are ever shown.
import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;

export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
