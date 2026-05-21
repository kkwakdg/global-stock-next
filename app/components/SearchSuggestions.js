export default function SearchSuggestions({ isDark, suggestions, onSuggestionSelect }) {
  if (suggestions.length === 0) return null;

  return (
    <div className={`${isDark ? 'border-white/10 bg-neutral-950 text-stone-100 shadow-black/30' : 'border-black/5 bg-white text-neutral-950 shadow-neutral-200/80'} search-suggestions absolute left-0 right-0 top-full z-50 -mt-px overflow-hidden border border-t-0 shadow-xl`}>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.ticker}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSuggestionSelect(suggestion.ticker)}
          className={`${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.015]'} flex w-full items-center justify-between gap-4 bg-transparent px-4 py-3 text-left`}
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              {suggestion.name}
            </span>
            <span className={`${isDark ? 'text-stone-400' : 'text-neutral-600'} mt-1 block text-xs`}>
              {suggestion.originalName}
            </span>
          </span>
          <span className={`${isDark ? 'bg-white/10 text-stone-300 ring-white/10' : 'bg-white text-neutral-700 ring-black/10'} apple-radius shrink-0 px-2.5 py-1 text-[11px] font-semibold ring-1`}>
            {suggestion.ticker}
          </span>
        </button>
      ))}
    </div>
  );
}
