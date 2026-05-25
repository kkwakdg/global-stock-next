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

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: ['JPY', 'KRW'].includes(currency) ? 0 : 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }
}

export function formatTrillion(value) {
  if (!Number.isFinite(value) || value <= 0) return '데이터 없음';
  return `$${(value / 1e12).toFixed(2)} T`;
}

export function formatChangePercent(value) {
  if (!Number.isFinite(value)) return '데이터 없음';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

const EXCHANGE_COUNTRY_CODES = {
  ASE: 'US',
  BATS: 'US',
  NCM: 'US',
  NGM: 'US',
  NMS: 'US',
  NYQ: 'US',
  NYS: 'US',
  PCX: 'US',
  KSC: 'KR',
  KOS: 'KR',
  KRX: 'KR',
  KOQ: 'KR',
  JPX: 'JP',
  TYO: 'JP',
  HKG: 'HK',
  SHH: 'CN',
  SHZ: 'CN',
  LSE: 'GB',
  LSEIOB: 'GB',
  TOR: 'CA',
  TWO: 'TW',
  TAI: 'TW',
  GER: 'DE',
  XETRA: 'DE',
  AMS: 'NL',
  PAR: 'FR',
  SWX: 'CH',
  STO: 'SE',
  ASX: 'AU',
  NSE: 'IN',
  BSE: 'IN',
  SAO: 'BR',
  MEX: 'MX',
};

const SYMBOL_SUFFIX_COUNTRY_CODES = {
  AS: 'NL',
  AX: 'AU',
  BR: 'BE',
  DE: 'DE',
  F: 'DE',
  HK: 'HK',
  JO: 'ZA',
  KS: 'KR',
  KQ: 'KR',
  L: 'GB',
  MI: 'IT',
  MX: 'MX',
  NS: 'IN',
  PA: 'FR',
  SA: 'BR',
  SS: 'CN',
  SZ: 'CN',
  SW: 'CH',
  TO: 'CA',
  TW: 'TW',
  T: 'JP',
};

const CURRENCY_COUNTRY_CODES = {
  AUD: 'AU',
  BRL: 'BR',
  CAD: 'CA',
  CHF: 'CH',
  CNY: 'CN',
  EUR: 'EU',
  GBP: 'GB',
  HKD: 'HK',
  INR: 'IN',
  JPY: 'JP',
  KRW: 'KR',
  MXN: 'MX',
  SEK: 'SE',
  TWD: 'TW',
  USD: 'US',
};

const COUNTRY_NAMES = {
  AU: 'Australia',
  BE: 'Belgium',
  BR: 'Brazil',
  CA: 'Canada',
  CH: 'Switzerland',
  CN: 'China',
  DE: 'Germany',
  EU: 'European Union',
  FR: 'France',
  GB: 'United Kingdom',
  HK: 'Hong Kong',
  IN: 'India',
  IT: 'Italy',
  JP: 'Japan',
  KR: 'South Korea',
  MX: 'Mexico',
  NL: 'Netherlands',
  SE: 'Sweden',
  TW: 'Taiwan',
  US: 'United States',
  ZA: 'South Africa',
};

export function getFlagEmoji(countryCode) {
  if (countryCode === 'EU') return '🇪🇺';
  if (!/^[A-Z]{2}$/.test(countryCode || '')) return '';

  return [...countryCode]
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join('');
}

export function getListingCountry(stock) {
  const exchange = String(stock?.exchange || '').toUpperCase();
  const symbolSuffix = String(stock?.symbol || '').split('.').pop()?.toUpperCase();
  const currency = String(stock?.currency || '').toUpperCase();
  const countryCode =
    EXCHANGE_COUNTRY_CODES[exchange] ||
    SYMBOL_SUFFIX_COUNTRY_CODES[symbolSuffix] ||
    CURRENCY_COUNTRY_CODES[currency] ||
    '';

  return {
    code: countryCode,
    name: COUNTRY_NAMES[countryCode] || '',
    flag: getFlagEmoji(countryCode),
  };
}

function getUsdExchangeRate(currency, exchangeRates) {
  if (currency === 'USD') return 1;
  if (Number.isFinite(exchangeRates)) return currency === 'KRW' ? exchangeRates : 0;

  return Number(exchangeRates?.[currency]) || 0;
}

export function getMarketCapInUsd(stock, exchangeRates) {
  if (!stock) return 0;

  const rawMarketCap = Number(stock.marketCap);
  if (!Number.isFinite(rawMarketCap) || rawMarketCap <= 0) return 0;

  const currency = String(stock.currency || 'USD').toUpperCase();
  const usdExchangeRate = getUsdExchangeRate(currency, exchangeRates);

  return usdExchangeRate > 0 ? rawMarketCap / usdExchangeRate : rawMarketCap;
}

export function formatStock(stock, krwExchangeRate, exchangeRates) {
  const marketCapUsd = getMarketCapInUsd(stock, exchangeRates || krwExchangeRate);
  const changePercent = Number(stock.regularMarketChangePercent);
  const listingCountry = getListingCountry(stock);

  return {
    name: stock.longName || stock.shortName || stock.symbol,
    ticker: stock.symbol,
    listingCountry,
    listingFlag: listingCountry.flag,
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
