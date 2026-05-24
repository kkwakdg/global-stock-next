"use client";

import { memo, useMemo, useState } from 'react';
import StockTableDesktop from './StockTableDesktop';
import StockTableMobile from './StockTableMobile';
import { getCompanyDisplayName } from '../lib/companyNames';

const DEFAULT_SORT = {
  key: 'rank',
  direction: 'asc',
};

function parsePriceValue(stock) {
  if (Number.isFinite(stock?.priceNumber)) return stock.priceNumber;

  const value = Number(String(stock?.price || '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(value) ? value : 0;
}

function getSortValue(stock, sortKey, language) {
  if (sortKey === 'rank') return Number(stock.rank) || 0;
  if (sortKey === 'company') return getCompanyDisplayName(stock, language).toLocaleLowerCase();
  if (sortKey === 'price') return parsePriceValue(stock);
  if (sortKey === 'marketCap') return Number(stock.marketCapUsdTrillions) || 0;
  return 0;
}

function StockTable(props) {
  const { isDark, language, stocks } = props;
  const [sortConfig, setSortConfig] = useState(DEFAULT_SORT);

  const sortedStocks = useMemo(() => {
    if (!Array.isArray(stocks)) return stocks;

    return [...stocks].sort((a, b) => {
      const aValue = getSortValue(a, sortConfig.key, language);
      const bValue = getSortValue(b, sortConfig.key, language);
      const direction = sortConfig.direction === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' || typeof bValue === 'string') {
        return String(aValue).localeCompare(String(bValue), language) * direction;
      }

      return (aValue - bValue) * direction;
    });
  }, [language, sortConfig, stocks]);

  const handleSort = (sortKey) => {
    setSortConfig((current) => ({
      key: sortKey,
      direction: current.key === sortKey && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className={`${isDark ? 'border-white/10 bg-stone-900 shadow-black/20' : 'border-black/5 bg-white shadow-neutral-200/70'} overflow-visible rounded-lg border shadow-lg sm:mx-auto sm:max-w-5xl`}>
      <StockTableMobile
        {...props}
        stocks={sortedStocks}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
      <StockTableDesktop
        {...props}
        stocks={sortedStocks}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </div>
  );
}

export default memo(StockTable);
