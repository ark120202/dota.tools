import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function RouterHashScroll() {
  const { hash } = useLocation();
  useLayoutEffect(() => {
    if (hash === '' || hash === '#') return;

    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView();
    }
  }, [hash]);

  return null;
}
