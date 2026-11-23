// which of a list of elements is in the middle of the screen right now.
// used by the project contents list to mark the project you are reading.
import { useEffect, useState } from 'react';

export function useActiveItem(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // a thin band across the middle of the screen
      { rootMargin: '-45% 0px -50% 0px' },
    );

    for (const id of key.split('|')) {
      const element = id ? document.getElementById(id) : null;
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [key]);

  return active;
}
