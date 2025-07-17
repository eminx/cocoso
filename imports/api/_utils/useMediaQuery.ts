import { useState, useEffect } from 'react';

export default function useMediaQuery(query: string): boolean {
  const getMatches = (q: string): boolean => {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function'
    ) {
      return window.matchMedia(q).matches;
    }
    return false; // Default for SSR
  };

  const [matches, setMatches] = useState(() => getMatches(query));

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function'
    ) {
      const mediaQueryList = window.matchMedia(query);
      const listener = (event: MediaQueryListEvent) =>
        setMatches(event.matches);
      setMatches(mediaQueryList.matches); // Update immediately on mount
      mediaQueryList.addEventListener('change', listener);
      return () => mediaQueryList.removeEventListener('change', listener);
    }
    return undefined;
  }, [query]);

  return matches;
}
