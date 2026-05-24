import { getCompanyDisplayName } from '../lib/companyNames';
import { formatMarketCap } from '../lib/formatters';

const BODY_STYLES = {
  desktop: {
    rank: 'py-5 pl-0 pr-6 text-right align-middle text-lg font-semibold tabular-nums lg:pr-8',
    company: 'px-6 py-5 lg:px-8',
    companyGap: 'gap-2',
    companyName: 'truncate text-base font-semibold leading-tight',
    ticker: 'apple-radius w-fit px-2.5 py-1 text-[11px] font-semibold ring-1',
    priceCell: 'px-6 py-5 text-right lg:px-8',
    priceWrap: 'items-end gap-2',
    price: 'text-base font-semibold tabular-nums',
    change: 'apple-radius w-fit px-2.5 py-1 text-[11px] font-semibold tabular-nums ring-1',
    marketCap: 'py-5 pl-6 pr-0 text-center text-base font-semibold tabular-nums lg:pl-8',
  },
  mobile: {
    rank: 'px-2 py-4 text-right align-middle text-sm font-semibold tabular-nums',
    company: 'px-3 py-4',
    companyGap: 'gap-1.5',
    companyName: 'truncate text-sm font-semibold leading-tight',
    ticker: 'apple-radius w-fit px-2 py-0.5 text-[10px] font-semibold ring-1',
    priceCell: 'px-3 py-4 text-center',
    priceWrap: 'items-center gap-1.5',
    price: 'whitespace-nowrap text-sm font-semibold tabular-nums',
    change: 'apple-radius w-fit px-2 py-0.5 text-[10px] font-semibold tabular-nums ring-1',
    marketCap: 'whitespace-nowrap px-3 py-4 text-center text-sm font-semibold tabular-nums',
  },
};

function StateRow({ children, className = '' }) {
  return (
    <tr>
      <td colSpan="4" className={`p-16 text-center font-medium ${className}`}>
        {children}
      </td>
    </tr>
  );
}

export default function StockTableBody({
  t,
  isDark,
  stocks,
  loading,
  loadErrorKey,
  currency,
  language,
  exchangeRates,
  variant,
}) {
  const styles = BODY_STYLES[variant];

  if (loading) {
    return (
      <tbody className={`${isDark ? 'divide-white/10' : 'divide-black/10'} divide-y text-sm`}>
        <StateRow className={isDark ? 'text-stone-400' : 'text-neutral-500'}>
          {t.loading}
        </StateRow>
      </tbody>
    );
  }

  if (!Array.isArray(stocks) || stocks.length === 0) {
    return (
      <tbody className={`${isDark ? 'divide-white/10' : 'divide-black/10'} divide-y text-sm`}>
        <StateRow className="text-rose-500">
          {loadErrorKey === 'timeout' ? t.timeout : t.empty}
        </StateRow>
      </tbody>
    );
  }

  return (
    <tbody className={`${isDark ? 'divide-white/10' : 'divide-black/10'} divide-y text-sm`}>
      {stocks.map((stock) => (
        <tr key={stock.ticker} className={isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-neutral-950/[0.03]'}>
          <td className={`${isDark ? 'text-stone-500' : 'text-neutral-400'} ${styles.rank}`}>
            {stock.rank}
          </td>
          <td className={styles.company}>
            <div className={`flex min-w-0 flex-col ${styles.companyGap}`}>
              <span className={`${isDark ? 'text-stone-100' : 'text-neutral-950'} ${styles.companyName}`}>
                {getCompanyDisplayName(stock, language)}
              </span>
              <span className={`${isDark ? 'bg-white/10 text-stone-300 ring-white/10' : 'bg-neutral-950/[0.06] text-neutral-600 ring-black/5'} ${styles.ticker}`}>
                {stock.ticker}
              </span>
            </div>
          </td>
          <td className={styles.priceCell}>
            <div className={`flex flex-col ${styles.priceWrap}`}>
              <span className={styles.price}>
                {stock.price || t.noData}
              </span>
              <span className={`${stock.isPositive ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/15' : 'bg-rose-500/10 text-rose-500 ring-rose-500/15'} ${styles.change}`}>
                {stock.chg}
              </span>
            </div>
          </td>
          <td className={styles.marketCap}>
            {formatMarketCap(Number(stock.marketCapUsdTrillions), currency, stock.exchangeRates || exchangeRates, language)}
          </td>
        </tr>
      ))}
    </tbody>
  );
}
