import QuickSettings from './QuickSettings';
import SearchBox from './SearchBox';

export default function HeaderControlsMobile({
  t,
  isDark,
  language,
  currency,
  searchQuery,
  searchLoading,
  searchSuggestions,
  onThemeToggle,
  onLanguageChange,
  onCurrencyChange,
  onSearchChange,
  onSearchSubmit,
  onSuggestionSelect,
}) {
  return (
    <div className="sm:hidden">
      <nav
        className={`${isDark ? 'border-white/10 bg-neutral-950/90' : 'border-white/80 bg-white/[0.88]'} liquid-header relative border-b px-5 py-3`}
      >
        <div className="absolute right-5 top-3 z-10">
          <QuickSettings
            t={t}
            isDark={isDark}
            idPrefix="mobile-header"
            language={language}
            currency={currency}
            onThemeToggle={onThemeToggle}
            onLanguageChange={onLanguageChange}
            onCurrencyChange={onCurrencyChange}
          />
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          <div className="flex flex-col gap-3">
            <div className="pr-44">
              <h1 className="mt-1 text-3xl font-semibold leading-tight">
                {t.viewTitle}
              </h1>
            </div>

            <div className="flex w-full flex-col gap-2">
              <SearchBox
                t={t}
                isDark={isDark}
                searchQuery={searchQuery}
                searchLoading={searchLoading}
                searchSuggestions={searchSuggestions}
                onSearchChange={onSearchChange}
                onSearchSubmit={onSearchSubmit}
                onSuggestionSelect={onSuggestionSelect}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
