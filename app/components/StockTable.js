import { memo } from 'react';
import { getCompanyDisplayName } from '../lib/companyNames';
import { formatMarketCap } from '../lib/formatters';

function StockTable({
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
    <div className={`${isDark ? 'border-white/10 bg-stone-900 shadow-black/20' : 'border-black/5 bg-white shadow-neutral-200/70'} overflow-hidden rounded-lg border shadow-lg`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-0 table-fixed text-left border-collapse sm:min-w-[680px]">
          <colgroup>
            <col className="w-[11%] sm:w-[72px]" />
            <col className="w-[35%] sm:w-[42%]" />
            <col className="w-[27%] sm:w-[26%]" />
            <col className="w-[27%] sm:w-[24%]" />
          </colgroup>
          <thead>
            <tr className={`${isDark ? 'border-white/10 text-stone-400' : 'border-black/10 text-neutral-500'} border-b text-xs font-semibold uppercase`}>
              <th className="px-2 py-4 sm:px-5 sm:py-5">{t.rank}</th>
              <th className="px-2 py-4 sm:px-4 sm:py-5">{t.company}</th>
              <th className="px-2 py-4 text-right sm:px-4 sm:py-5">{t.price}</th>
              <th className="px-2 py-4 text-right sm:px-5 sm:py-5">{t.marketCap}</th>
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
                    <td className={`${isDark ? 'text-stone-500' : 'text-neutral-400'} px-2 py-4 align-middle text-sm font-semibold tabular-nums sm:px-5 sm:py-5 sm:text-lg`}>
                      {stock.rank}
                    </td>
                    <td className="px-2 py-4 sm:px-4 sm:py-5">
                      <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
                        <span className={`${isDark ? 'text-stone-100' : 'text-neutral-950'} truncate text-sm font-semibold leading-tight sm:text-base`}>
                          {getCompanyDisplayName(stock, language)}
                        </span>
                        <span className={`${isDark ? 'bg-white/10 text-stone-300 ring-white/10' : 'bg-neutral-950/[0.06] text-neutral-600 ring-black/5'} apple-radius w-fit px-2 py-0.5 text-[10px] font-semibold ring-1 sm:px-2.5 sm:py-1 sm:text-[11px]`}>
                          {stock.ticker}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-4 text-right sm:px-4 sm:py-5">
                      <div className="flex flex-col items-end gap-1.5 sm:gap-2">
                        <span className="whitespace-nowrap text-sm font-semibold tabular-nums sm:text-base">
                          {stock.price || t.noData}
                        </span>
                        <span className={`${stock.isPositive ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/15' : 'bg-rose-500/10 text-rose-500 ring-rose-500/15'} apple-radius w-fit px-2 py-0.5 text-[10px] font-semibold tabular-nums ring-1 sm:px-2.5 sm:py-1 sm:text-[11px]`}>
                          {stock.chg}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-2 py-4 text-right text-sm font-semibold tabular-nums sm:px-5 sm:py-5 sm:text-base">
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
    </div>
  );
}

export default memo(StockTable);
