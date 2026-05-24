export default function ScrollToTopButton({ isDark }) {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={handleClick}
      className={`${isDark ? 'border-white/10 bg-stone-100/90 text-neutral-950 shadow-black/25 hover:bg-white' : 'border-black/10 bg-neutral-950/90 text-white shadow-neutral-400/30 hover:bg-neutral-800'} fixed bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur transition sm:bottom-8 sm:right-8`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      >
        <path d="M6 15l6-6 6 6" />
      </svg>
    </button>
  );
}
