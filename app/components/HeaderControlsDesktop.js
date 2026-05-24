import QuickSettings from './QuickSettings';
import SearchBox from './SearchBox';

export default function HeaderControlsDesktop({
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
    <div className="hidden sm:block">
      <nav
        className={`${isDark ? 'border-white/10 bg-neutral-950/90' : 'border-white/80 bg-white/[0.88]'} liquid-header relative border-b px-6 py-3 lg:px-8`}
      >
        <div className="absolute right-8 top-4 z-10">
          <QuickSettings
            t={t}
            isDark={isDark}
            idPrefix="desktop-header"
            language={language}
            currency={currency}
            onThemeToggle={onThemeToggle}
            onLanguageChange={onLanguageChange}
            onCurrencyChange={onCurrencyChange}
          />
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          <div className="flex flex-col gap-3 pr-36 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className={`${isDark ? 'text-stone-500' : 'text-neutral-500'} text-xs font-medium uppercase`}>
                {t.appName}
              </p>
              <h1 className="mt-1 text-4xl font-semibold leading-tight">
                {t.viewTitle}
              </h1>
            </div>

            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
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
