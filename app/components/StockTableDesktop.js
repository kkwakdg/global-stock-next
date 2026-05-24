import SortHeaderButton from './SortHeaderButton';
import StockTableBody from './StockTableBody';

function DesktopTableHeader({ t, isDark, sortConfig, onSort, languageReady }) {
  return (
    <div className={`${isDark ? 'border-white/10 bg-stone-900 text-stone-400' : 'border-black/10 bg-white text-neutral-500'} stock-table-head grid min-h-14 min-w-[680px] grid-cols-[12%_30%_29%_29%] border-b text-xs font-semibold uppercase shadow-sm`}>
      <div className="flex h-full items-center pl-0 pr-6 lg:pr-8">
        <SortHeaderButton label={t.rank} sortKey="rank" sortConfig={sortConfig} onSort={onSort} align="right" labelReady={languageReady} />
      </div>
      <div className="flex h-full items-center px-6 lg:px-8">
        <SortHeaderButton label={t.company} sortKey="company" sortConfig={sortConfig} onSort={onSort} labelReady={languageReady} />
      </div>
      <div className="flex h-full items-center px-6 lg:px-8">
        <SortHeaderButton label={t.price} sortKey="price" sortConfig={sortConfig} onSort={onSort} align="right" labelReady={languageReady} />
      </div>
      <div className="flex h-full items-center pl-6 pr-0 lg:pl-8">
        <SortHeaderButton label={t.marketCap} sortKey="marketCap" sortConfig={sortConfig} onSort={onSort} align="center" labelReady={languageReady} />
      </div>
    </div>
  );
}

export default function StockTableDesktop({
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
    <div className="hidden sm:block">
      <DesktopTableHeader t={t} isDark={isDark} sortConfig={sortConfig} onSort={onSort} languageReady={languageReady} />

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
        />
      </table>
    </div>
  );
}
