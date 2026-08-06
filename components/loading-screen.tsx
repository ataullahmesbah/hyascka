'use client';

import * as React from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';

const statusMessages = [
  'Initializing AI...',
  'Loading Intelligent Systems...',
  'Ready.',
];

export function LoadingScreen() {
  const [done, setDone] = React.useState(false);
  const [statusIndex, setStatusIndex] = React.useState(0);
  const progress = useMotionValue(0);
  const [displayProgress, setDisplayProgress] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(progress, 100, {
      duration: 1.6,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate: (v) => setDisplayProgress(Math.round(v)),
    });
    return () => controls.stop();
  }, [progress]);

  React.useEffect(() => {
    const timers = statusMessages.map((_, i) =>
      setTimeout(() => setStatusIndex(i), i * 550)
    );
    const doneTimer = setTimeout(() => setDone(true), 2000);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="flex w-72 flex-col items-center gap-7">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative flex h-16 w-16 items-center justify-center"
            >
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-20 blur-xl" />
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-primary border-r-accent"
              />
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
                  <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
                  <circle cx="12" cy="12" r="3.4" fill="currentColor" />
                </svg>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-sm font-semibold tracking-[0.3em] text-muted-foreground uppercase"
            >
              HYASCKA
            </motion.div>

            <div className="flex w-full flex-col gap-2.5">
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-border">
                <motion.div
                  style={{ width: `${displayProgress}%` }}
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={statusIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="font-mono"
                  >
                    {statusMessages[statusIndex]}
                  </motion.span>
                </AnimatePresence>
                <span className="font-mono tabular-nums">{displayProgress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
