import { NextResponse } from 'next/server';

export const YAHOO_TIMEOUT_MS = 9000;
export const STOCK_BATCH_SIZE = 20;

export function noStoreJson(data, init = {}) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      ...init.headers,
    },
  });
}

export function withTimeout(promise, label, timeoutMs = YAHOO_TIMEOUT_MS) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} 요청 시간이 초과되었습니다.`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

export function chunkArray(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export function normalizeQuoteResult(symbols, result) {
  return Array.isArray(symbols) && !Array.isArray(result) ? [result] : result;
}

export function formatPrice(value, currency = 'USD') {
  if (!Number.isFinite(value)) return '데이터 없음';

  if (currency === 'KRW') {
    return `₩${Math.round(value).toLocaleString('ko-KR')}`;
  }

  return `$${value.toFixed(2)}`;
}

export function formatTrillion(value) {
  if (!Number.isFinite(value) || value <= 0) return '데이터 없음';
  return `$${(value / 1e12).toFixed(2)} T`;
}

export function formatChangePercent(value) {
  if (!Number.isFinite(value)) return '데이터 없음';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function getMarketCapInUsd(stock, krwExchangeRate) {
  if (!stock) return 0;

  const rawMarketCap = Number(stock.marketCap);
  if (!Number.isFinite(rawMarketCap) || rawMarketCap <= 0) return 0;

  return stock.symbol?.endsWith('.KS') ? rawMarketCap / krwExchangeRate : rawMarketCap;
}

export function formatStock(stock, krwExchangeRate, exchangeRates) {
  const marketCapUsd = getMarketCapInUsd(stock, krwExchangeRate);
  const changePercent = Number(stock.regularMarketChangePercent);

  return {
    name: stock.longName || stock.shortName || stock.symbol,
    ticker: stock.symbol,
    marketCapUsdTrillions: marketCapUsd / 1e12,
    marketCap: formatTrillion(marketCapUsd),
    priceNumber: stock.regularMarketPrice,
    price: formatPrice(stock.regularMarketPrice, stock.currency),
    chg: formatChangePercent(changePercent),
    isPositive: Number.isFinite(changePercent) ? changePercent >= 0 : true,
    exchangeRate: krwExchangeRate.toFixed(1),
    exchangeRates,
  };
}

export function isValidStock(stock, krwExchangeRate) {
  return (
    stock &&
    getMarketCapInUsd(stock, krwExchangeRate) > 0 &&
    Number.isFinite(stock.regularMarketPrice)
  );
}

export function rankStocksByMarketCap(stocks, limit) {
  return stocks
    .sort((a, b) => b.marketCapUsdTrillions - a.marketCapUsdTrillions)
    .slice(0, limit)
    .map((stock, index) => ({
      rank: index + 1,
      ...stock,
    }));
}
