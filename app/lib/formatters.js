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

export function formatMarketCap(usdTrillions, currency, exchangeRates, language) {
  if (!Number.isFinite(usdTrillions) || usdTrillions <= 0) {
    return TRANSLATIONS[language].noData;
  }

  const locale = LOCALE_BY_LANGUAGE[language];

  if (currency === CURRENCIES.KRW) {
    const value = usdTrillions * (exchangeRates?.KRW || 0);
    return `${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value)}조`;
  }

  if (currency === CURRENCIES.JPY) {
    const value = usdTrillions * (exchangeRates?.JPY || 0);
    return `${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value)}兆円`;
  }

  return `$${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdTrillions)} T`;
}
