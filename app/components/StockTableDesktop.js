import { getCompanyDisplayName } from '../lib/companyNames';
import { formatMarketCap } from '../lib/formatters';

export default function StockTableDesktop({
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
    <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[680px] table-fixed text-left border-collapse">
          <colgroup>
          <col className="w-[12%]" />
          <col className="w-[30%]" />
          <col className="w-[29%]" />
          <col className="w-[29%]" />
        </colgroup>
        <thead>
          <tr className={`${isDark ? 'border-white/10 text-stone-400' : 'border-black/10 text-neutral-500'} border-b text-xs font-semibold uppercase`}>
            <th className="py-5 pl-0 pr-6 text-right lg:pr-8">{t.rank}</th>
            <th className="px-6 py-5 lg:px-8">{t.company}</th>
            <th className="px-6 py-5 text-right lg:px-8">{t.price}</th>
            <th className="py-5 pl-6 pr-0 text-center lg:pl-8">{t.marketCap}</th>
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
                  <td className={`${isDark ? 'text-stone-500' : 'text-neutral-400'} py-5 pl-0 pr-6 text-right align-middle text-lg font-semibold tabular-nums lg:pr-8`}>
                    {stock.rank}
                  </td>
                  <td className="px-6 py-5 lg:px-8">
                    <div className="flex min-w-0 flex-col gap-2">
                      <span className={`${isDark ? 'text-stone-100' : 'text-neutral-950'} truncate text-base font-semibold leading-tight`}>
                        {getCompanyDisplayName(stock, language)}
                      </span>
                      <span className={`${isDark ? 'bg-white/10 text-stone-300 ring-white/10' : 'bg-neutral-950/[0.06] text-neutral-600 ring-black/5'} apple-radius w-fit px-2.5 py-1 text-[11px] font-semibold ring-1`}>
                        {stock.ticker}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right lg:px-8">
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-base font-semibold tabular-nums">
                        {stock.price || t.noData}
                      </span>
                      <span className={`${stock.isPositive ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/15' : 'bg-rose-500/10 text-rose-500 ring-rose-500/15'} apple-radius w-fit px-2.5 py-1 text-[11px] font-semibold tabular-nums ring-1`}>
                        {stock.chg}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 pl-6 pr-0 text-center text-base font-semibold tabular-nums lg:pl-8">
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
