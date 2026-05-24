import { getCompanyDisplayName } from '../lib/companyNames';
import { formatMarketCap } from '../lib/formatters';
import SortHeaderButton from './SortHeaderButton';

function MobileTableHeader({ t, isDark, sortConfig, onSort }) {
  return (
    <div className={`${isDark ? 'border-white/10 bg-stone-900 text-stone-400' : 'border-black/10 bg-white text-neutral-500'} stock-table-head grid min-h-14 grid-cols-[15%_32%_26%_27%] border-b text-xs font-semibold uppercase shadow-sm`}>
      <div className="flex h-full items-center whitespace-nowrap px-2">
        <SortHeaderButton label={t.rank} sortKey="rank" sortConfig={sortConfig} onSort={onSort} align="right" className="gap-1" />
      </div>
      <div className="flex h-full items-center whitespace-nowrap px-3">
        <SortHeaderButton label={t.company} sortKey="company" sortConfig={sortConfig} onSort={onSort} className="gap-1" />
      </div>
      <div className="flex h-full items-center px-3 leading-tight">
        <SortHeaderButton label={t.price} sortKey="price" sortConfig={sortConfig} onSort={onSort} align="center" className="gap-1" />
      </div>
      <div className="flex h-full items-center px-3 leading-tight">
        <SortHeaderButton label={t.marketCap} sortKey="marketCap" sortConfig={sortConfig} onSort={onSort} align="center" className="gap-1" />
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
  exchangeRates,
  sortConfig,
  onSort,
}) {
  return (
    <div className="sm:hidden">
      <MobileTableHeader t={t} isDark={isDark} sortConfig={sortConfig} onSort={onSort} />

      <table className="w-full min-w-0 table-fixed border-separate border-spacing-0 text-left">
        <colgroup>
          <col className="w-[15%]" />
          <col className="w-[32%]" />
          <col className="w-[26%]" />
          <col className="w-[27%]" />
        </colgroup>
        <tbody className={`${isDark ? 'divide-white/10' : 'divide-black/10'} divide-y text-sm`}>
          {loading ? (
            <tr>
              <td colSpan="4" className={`${isDark ? 'text-stone-400' : 'text-neutral-500'} p-16 text-center font-medium`}>
                {t.loading}
              </td>
            </tr>
          ) : (
            Array.isArray(stocks) && stocks.length > 0 ? (
              stocks.map((stock) => (
                <tr key={stock.ticker} className={isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-neutral-950/[0.03]'}>
                  <td className={`${isDark ? 'text-stone-500' : 'text-neutral-400'} px-2 py-4 text-right align-middle text-sm font-semibold tabular-nums`}>
                    {stock.rank}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <span className={`${isDark ? 'text-stone-100' : 'text-neutral-950'} truncate text-sm font-semibold leading-tight`}>
                        {getCompanyDisplayName(stock, language)}
                      </span>
                      <span className={`${isDark ? 'bg-white/10 text-stone-300 ring-white/10' : 'bg-neutral-950/[0.06] text-neutral-600 ring-black/5'} apple-radius w-fit px-2 py-0.5 text-[10px] font-semibold ring-1`}>
                        {stock.ticker}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="whitespace-nowrap text-sm font-semibold tabular-nums">
                        {stock.price || t.noData}
                      </span>
                      <span className={`${stock.isPositive ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/15' : 'bg-rose-500/10 text-rose-500 ring-rose-500/15'} apple-radius w-fit px-2 py-0.5 text-[10px] font-semibold tabular-nums ring-1`}>
                        {stock.chg}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center text-sm font-semibold tabular-nums">
                    {formatMarketCap(Number(stock.marketCapUsdTrillions), currency, stock.exchangeRates || exchangeRates, language)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-16 text-center text-rose-500 font-medium">
                  {loadErrorKey === 'timeout' ? t.timeout : t.empty}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
