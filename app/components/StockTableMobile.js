import StockTableHeader from './StockTableHeader';
import StockTableBody from './StockTableBody';

export default function StockTableMobile({
  t,
  isDark,
  stocks,
  loading,
  loadErrorKey,
  currency,
  language,
  exchangeRates,
  sortConfig,
  onSort,
  onStockSelect,
}) {
  return (
    <div className="sm:hidden">
      <StockTableHeader
        t={t}
        isDark={isDark}
        sortConfig={sortConfig}
        onSort={onSort}
        variant="mobile"
        language={language}
      />

      <table className="w-full min-w-0 table-fixed border-separate border-spacing-0 text-left">
        <colgroup>
          <col className="w-[15%]" />
          <col className="w-[32%]" />
          <col className="w-[26%]" />
          <col className="w-[27%]" />
        </colgroup>
        <StockTableBody
          t={t}
          isDark={isDark}
          stocks={stocks}
          loading={loading}
          loadErrorKey={loadErrorKey}
          currency={currency}
          language={language}
          exchangeRates={exchangeRates}
          variant="mobile"
          onStockSelect={onStockSelect}
        />
      </table>
    </div>
  );
}
