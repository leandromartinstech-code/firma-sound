import { useEffect, useState } from 'react';

function match(query) {
  return typeof window !== 'undefined' && window.matchMedia(query).matches;
}

// Acompanha uma media query (ex.: preferência por movimento reduzido).
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => match(query));
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
