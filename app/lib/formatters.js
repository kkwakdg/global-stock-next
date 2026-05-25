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

export function formatMarketCap(usdTrillions, currency, exchangeRates, language) {
  if (!Number.isFinite(usdTrillions) || usdTrillions <= 0) {
    return getNoDataText(language);
  }

  const locale = LOCALE_BY_LANGUAGE[language] || LOCALE_BY_LANGUAGE.en;

  if (language === 'ko') {
    return formatKrwMarketCap(usdTrillions, exchangeRates, locale) || getNoDataText(language);
  }

  if (currency === CURRENCIES.KRW) {
    return formatKrwMarketCap(usdTrillions, exchangeRates, locale) || getNoDataText(language);
  }

  if (currency === CURRENCIES.JPY) {
    const value = usdTrillions * Number(exchangeRates?.JPY);

    if (!Number.isFinite(value) || value <= 0) {
      return getNoDataText(language);
    }

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
