import { getCompanyDisplayName } from '../lib/companyNames';
import { formatMarketCap } from '../lib/formatters';

export default function StockTableMobile({
  t,
  isDark,
  stocks,
  loading,
  loadErrorKey,
  currency,
  language,
  exchangeRates,
}) {
  return (
    <div className="sm:hidden">
      <table className="w-full min-w-0 table-fixed text-left border-collapse">
        <colgroup>
          <col className="w-[11%]" />
          <col className="w-[35%]" />
          <col className="w-[27%]" />
          <col className="w-[27%]" />
        </colgroup>
        <thead>
          <tr className={`${isDark ? 'border-white/10 text-stone-400' : 'border-black/10 text-neutral-500'} border-b text-xs font-semibold uppercase`}>
            <th className="px-3 py-4 text-right">{t.rank}</th>
            <th className="px-3 py-4">{t.company}</th>
            <th className="px-3 py-4 text-right">{t.price}</th>
            <th className="px-3 py-4 text-center">{t.marketCap}</th>
          </tr>
        </thead>
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
                  <td className={`${isDark ? 'text-stone-500' : 'text-neutral-400'} px-3 py-4 text-right align-middle text-sm font-semibold tabular-nums`}>
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
                  <td className="px-3 py-4 text-right">
                    <div className="flex flex-col items-end gap-1.5">
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
