'use client';

import * as React from 'react';
import { animate, useMotionValue } from 'framer-motion';

export function useCounter(target: number, duration = 1.6) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = React.useState('0');
  const ref = React.useRef<HTMLDivElement>(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          const controls = animate(mv, target, {
            duration,
            ease: [0.21, 0.47, 0.32, 0.98],
            onUpdate: (v) => setDisplay(Math.round(v).toString()),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [mv, target, duration]);

  return { ref, display };
}
