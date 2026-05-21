"use client";

import HeaderControls from './components/HeaderControls';
import SearchModal from './components/SearchModal';
import StockTable from './components/StockTable';
import useStockDashboard from './hooks/useStockDashboard';

export default function Home() {
  const {
    stockData,
    loading,
    loadErrorKey,
    searchQuery,
    searchLoading,
    searchSuggestions,
    modalOpen,
    modalData,
    isDark,
    language,
    currency,
    t,
    exchangeRates,
    setSearchQuery,
    setSelectedLanguage,
    setCurrency,
    toggleTheme,
    handleSearch,
    performSearch,
    closeModal,
  } = useStockDashboard();

  return (
    <div className={`${isDark ? 'bg-neutral-950 text-stone-100' : 'bg-[#f5f5f7] text-neutral-950'} min-h-screen relative transition-colors`}>
      <HeaderControls
        t={t}
        isDark={isDark}
        language={language}
        currency={currency}
        searchQuery={searchQuery}
        searchLoading={searchLoading}
        searchSuggestions={searchSuggestions}
        onThemeToggle={toggleTheme}
        onLanguageChange={setSelectedLanguage}
        onCurrencyChange={setCurrency}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        onSuggestionSelect={performSearch}
      />

      <main className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-6 lg:px-8">
        <section className="mb-6">
          <p className={`${isDark ? 'text-stone-400' : 'text-neutral-500'} max-w-2xl text-sm leading-6`}>
            {t.viewSubtitle}
          </p>
        </section>

        <StockTable
          t={t}
          isDark={isDark}
          stocks={stockData}
          loading={loading}
          loadErrorKey={loadErrorKey}
          currency={currency}
          language={language}
          exchangeRates={exchangeRates}
        />
      </main>

      {modalOpen && (
        <SearchModal
          t={t}
          isDark={isDark}
          modalData={modalData}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
