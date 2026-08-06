'use client';

import * as React from 'react';

export function useIntersectionObserver(
  options?: IntersectionObserverInit & { once?: boolean }
) {
  const { once = true, root = null, rootMargin = '0px', threshold = 0.1 } = options ?? {};
  const ref = React.useRef<Element | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { root, rootMargin, threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once, root, rootMargin, threshold]);

  return { ref, inView };
}
