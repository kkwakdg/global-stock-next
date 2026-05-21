import SearchSuggestions from './SearchSuggestions';

export default function SearchBox({
  t,
  isDark,
  searchQuery,
  searchLoading,
  searchSuggestions,
  onSearchChange,
  onSearchSubmit,
  onSuggestionSelect,
}) {
  const hasSuggestions = searchSuggestions.length > 0;

  return (
    <form onSubmit={onSearchSubmit} className="relative w-full sm:w-[25rem]">
      <div className={`${isDark ? 'liquid-surface-dark bg-white/10 ring-white/10' : 'liquid-surface bg-white/[0.82] ring-white/80'} ${hasSuggestions ? 'search-shell-open' : 'search-shell'} flex h-11 w-full min-w-0 items-center px-2 ring-1`}>
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-neutral-400 sm:text-sm"
        />
        <button
          type="submit"
          className={`${isDark ? 'bg-stone-100 text-neutral-950 hover:bg-white' : 'bg-neutral-950 text-white hover:bg-neutral-800'} apple-radius h-8 shrink-0 px-4 text-sm font-semibold transition`}
        >
          {searchLoading ? t.searching : t.search}
        </button>
      </div>

      <SearchSuggestions
        isDark={isDark}
        suggestions={searchSuggestions}
        onSuggestionSelect={onSuggestionSelect}
      />
    </form>
  );
}
