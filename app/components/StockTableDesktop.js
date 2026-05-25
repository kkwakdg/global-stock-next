import StockTableHeader from './StockTableHeader';
import StockTableBody from './StockTableBody';

export default function StockTableDesktop({
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
    <div className="hidden sm:block">
      <StockTableHeader
        t={t}
        isDark={isDark}
        sortConfig={sortConfig}
        onSort={onSort}
        variant="desktop"
      />

      <table className="w-full min-w-[680px] table-fixed border-separate border-spacing-0 text-left">
        <colgroup>
          <col className="w-[12%]" />
          <col className="w-[30%]" />
          <col className="w-[29%]" />
          <col className="w-[29%]" />
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
          variant="desktop"
          onStockSelect={onStockSelect}
        />
      </table>
    </div>
  );
}
