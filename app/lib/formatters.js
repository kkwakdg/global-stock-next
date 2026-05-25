import { TRANSLATIONS } from './i18n';

export const CURRENCIES = {
  USD: 'USD',
  KRW: 'KRW',
  JPY: 'JPY',
};

const LOCALE_BY_LANGUAGE = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
};

function getNoDataText(language) {
  return TRANSLATIONS[language]?.noData || TRANSLATIONS.en.noData;
}

function formatUsdMarketCap(usdTrillions, locale) {
  const value = usdTrillions < 1 ? usdTrillions * 1000 : usdTrillions;
  const unit = usdTrillions < 1 ? 'B' : 'T';
  const formattedValue = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `$${formattedValue} ${unit}`;
}

function formatKrwMarketCap(usdTrillions, exchangeRates, locale) {
  const krwTrillions = usdTrillions * Number(exchangeRates?.KRW);

  if (!Number.isFinite(krwTrillions) || krwTrillions <= 0) {
    return null;
  }

  if (krwTrillions >= 1) {
    return `${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(krwTrillions)}조`;
  }

  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(krwTrillions * 10000)}억`;
}

function formatJpyMarketCap(usdTrillions, exchangeRates, locale) {
  const jpyTrillions = usdTrillions * Number(exchangeRates?.JPY);

  if (!Number.isFinite(jpyTrillions) || jpyTrillions <= 0) {
    return null;
  }

  const formattedValue = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(jpyTrillions);

  return `${formattedValue}兆円`;
}

export function formatMarketCap(usdTrillions, currency, exchangeRates, language) {
  if (!Number.isFinite(usdTrillions) || usdTrillions <= 0) {
    return getNoDataText(language);
  }

  const locale = LOCALE_BY_LANGUAGE[language] || LOCALE_BY_LANGUAGE.en;

  if (currency === CURRENCIES.KRW) {
    return formatKrwMarketCap(usdTrillions, exchangeRates, locale) || getNoDataText(language);
  }

  if (currency === CURRENCIES.JPY) {
    return formatJpyMarketCap(usdTrillions, exchangeRates, locale) || getNoDataText(language);
  }

  return formatUsdMarketCap(usdTrillions, locale);
}
