export function Logo() {
  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-soft">
      <span className="absolute inset-0 bg-grid-sm opacity-30" />
      <svg viewBox="0 0 24 24" className="relative h-4 w-4" fill="none" aria-hidden>
        <path
          d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="12" cy="12" r="3.4" fill="currentColor" />
      </svg>
    </span>
  );
}
