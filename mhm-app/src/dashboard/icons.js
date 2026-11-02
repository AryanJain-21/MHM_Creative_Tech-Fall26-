// Inline icons used across the dashboard. All inherit `currentColor`.

// Stand-in for the MHM mark. Replace with the exported SVG from Figma.
export function LogoMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path
        fill="var(--crimson)"
        d="M13 3h8v10c0 5 3 8 8 8h9v8H21v9h-8v-9H2v-8h11z"
      />
      <path
        fill="none"
        stroke="var(--teal)"
        strokeWidth="2"
        strokeDasharray="3 2.5"
        d="M24 5v6c0 4 2.5 6.5 6.5 6.5H38"
      />
      <path
        fill="none"
        stroke="var(--crimson)"
        strokeWidth="2.5"
        d="M29 3v6c0 1.5 1 2.5 2.5 2.5H38"
      />
    </svg>
  );
}

export function UserIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="9.5" r="3.5" fill="currentColor" />
      <path fill="currentColor" d="M5.5 18.5c1.5-2.5 4-3.8 6.5-3.8s5 1.3 6.5 3.8A9 9 0 0 1 12 21a9 9 0 0 1-6.5-2.5z" />
    </svg>
  );
}

export function PlusIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" d="M12 7v10M7 12h10" />
    </svg>
  );
}

export function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" d="M15 15l6 6" />
    </svg>
  );
}

export function ShareIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="2" d="M17.5 5.5l-11 6.5 11 6.5" fill="none" />
      <circle cx="18" cy="5" r="3" fill="currentColor" />
      <circle cx="6" cy="12" r="3" fill="currentColor" />
      <circle cx="18" cy="19" r="3" fill="currentColor" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 12H5M11 6l-6 6 6 6"
      />
    </svg>
  );
}
