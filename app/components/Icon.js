export default function Icon({ name, className = 'h-4 w-4' }) {
  const paths = {
    moon: (
      <path d="M19.2 14.4A7.4 7.4 0 0 1 9.6 4.8 7.5 7.5 0 1 0 19.2 14.4Z" />
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    currency: (
      <path d="M12 3v18M16.5 7.5A4.2 4.2 0 0 0 12.7 6H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-2.7a4.2 4.2 0 0 1-3.8-1.5" />
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}
