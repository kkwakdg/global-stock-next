import SortHeaderButton from './SortHeaderButton';
import StockTableBody from './StockTableBody';

function MobileTableHeader({ t, isDark, sortConfig, onSort, languageReady }) {
  return (
    <div className={`${isDark ? 'border-white/10 bg-stone-900 text-stone-400' : 'border-black/10 bg-white text-neutral-500'} stock-table-head grid min-h-14 grid-cols-[15%_32%_26%_27%] border-b text-xs font-semibold uppercase shadow-sm`}>
      <div className="flex h-full items-center whitespace-nowrap px-2">
        <SortHeaderButton label={t.rank} sortKey="rank" sortConfig={sortConfig} onSort={onSort} align="right" className="gap-1" labelReady={languageReady} />
      </div>
      <div className="flex h-full items-center whitespace-nowrap px-3">
        <SortHeaderButton label={t.company} sortKey="company" sortConfig={sortConfig} onSort={onSort} className="gap-1" labelReady={languageReady} />
      </div>
      <div className="flex h-full items-center px-3 leading-tight">
        <SortHeaderButton label={t.price} sortKey="price" sortConfig={sortConfig} onSort={onSort} align="center" className="gap-1" labelReady={languageReady} />
      </div>
      <div className="flex h-full items-center px-3 leading-tight">
        <SortHeaderButton label={t.marketCap} sortKey="marketCap" sortConfig={sortConfig} onSort={onSort} align="center" className="gap-1" labelReady={languageReady} />
      </div>
    </div>
  );
}

export default function StockTableMobile({
  t,
  isDark,
  stocks,
  loading,
  loadErrorKey,
  currency,
  language,
  languageReady,
  exchangeRates,
  sortConfig,
  onSort,
}) {
  return (
    <div className="sm:hidden">
      <MobileTableHeader t={t} isDark={isDark} sortConfig={sortConfig} onSort={onSort} languageReady={languageReady} />

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
        />
      </table>
    </div>
  );
}
