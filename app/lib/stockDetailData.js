import YahooFinance from 'yahoo-finance2';
import { getCompanyDisplayName, resolveCompanyTicker } from './companyNames';
import { normalizeLanguage } from './i18n';
import { formatStock, withTimeout } from './stockApiFormatters';
import {
  generateFallbackNewsAnalysis,
  getAnalysisSectionLabels,
} from './stockNewsAnalysis';

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey'],
});

const DEFAULT_EXCHANGE_RATES = {
  KRW: 1380,
  JPY: 155,
  CNY: 7.2,
  HKD: 7.8,
};

const NEWS_DISPLAY_COUNT = 6;

async function quoteWithFallback(symbols, label) {
  try {
    return await withTimeout(yahooFinance.quote(symbols), label);
  } catch (error) {
    console.error(`${label} 실패:`, error);
    return null;
  }
}

async function getExchangeRates() {
  const [krw, jpy, cny, hkd] = await Promise.all([
    quoteWithFallback('USDKRW=X', '원/달러 환율 조회'),
    quoteWithFallback('USDJPY=X', '엔/달러 환율 조회'),
    quoteWithFallback('USDCNY=X', '위안/달러 환율 조회'),
    quoteWithFallback('USDHKD=X', '홍콩달러/달러 환율 조회'),
  ]);

  return {
    KRW: krw?.regularMarketPrice || DEFAULT_EXCHANGE_RATES.KRW,
    JPY: jpy?.regularMarketPrice || DEFAULT_EXCHANGE_RATES.JPY,
    CNY: cny?.regularMarketPrice || DEFAULT_EXCHANGE_RATES.CNY,
    HKD: hkd?.regularMarketPrice || DEFAULT_EXCHANGE_RATES.HKD,
  };
}

function normalizeTicker(rawTicker) {
  return decodeURIComponent(String(rawTicker || ''))
    .trim()
    .toUpperCase()
    .replace(/_/g, '.');
}

async function getQuoteByTicker(rawTicker) {
  const ticker = resolveCompanyTicker(rawTicker) || normalizeTicker(rawTicker);
  if (!ticker) return null;

  const quote = await quoteWithFallback(ticker, '종목 상세 조회');
  return Array.isArray(quote) ? quote[0] : quote;
}

function formatNewsArticle(item, language) {
  const publishedAt = item?.providerPublishTime
    ? new Date(item.providerPublishTime).toISOString()
    : '';

  return {
    id: item?.uuid || item?.link || item?.title,
    title: String(item?.title || '').trim(),
    originalTitle: String(item?.title || '').trim(),
    publisher: String(item?.publisher || '').trim(),
    link: item?.link || '',
    publishedAt,
    sourceLine: [item?.publisher, publishedAt ? new Intl.DateTimeFormat(language).format(new Date(publishedAt)) : '']
      .filter(Boolean)
      .join(' · '),
    relatedTickers: item?.relatedTickers || [],
  };
}

async function getStockNews({ ticker, displayName, language }) {
  try {
    const result = await withTimeout(
      yahooFinance.search(ticker, {
        newsCount: NEWS_DISPLAY_COUNT,
        quotesCount: 0,
      }),
      '종목 뉴스 조회'
    );
    const articles = (result?.news || [])
      .map((item) => formatNewsArticle(item, language))
      .filter((article) => article.title)
      .slice(0, NEWS_DISPLAY_COUNT);

    return {
      title: language === 'ko' ? 'AI 뉴스 분석 리포트' : 'AI News Analysis',
      articles,
      analysis: generateFallbackNewsAnalysis({
        ticker,
        displayName,
        language,
        articles,
      }),
      sectionLabels: getAnalysisSectionLabels(language),
    };
  } catch (error) {
    console.error('종목 뉴스 조회 실패:', error);
    return {
      title: language === 'ko' ? 'AI 뉴스 분석 리포트' : 'AI News Analysis',
      articles: [],
      analysis: generateFallbackNewsAnalysis({
        ticker,
        displayName,
        language,
        articles: [],
      }),
      sectionLabels: getAnalysisSectionLabels(language),
    };
  }
}

export async function getStockDetail(rawTicker, language = 'ko') {
  const normalizedLanguage = normalizeLanguage(language);
  const [quote, exchangeRates] = await Promise.all([
    getQuoteByTicker(rawTicker),
    getExchangeRates(),
  ]);

  if (!quote) return null;

  const stock = formatStock(quote, exchangeRates.KRW, exchangeRates);
  const displayName = getCompanyDisplayName(stock, normalizedLanguage) || stock.ticker;
  const news = await getStockNews({
    ticker: stock.ticker,
    displayName,
    language: normalizedLanguage,
  });

  return {
    stock,
    displayName,
    language: normalizedLanguage,
    news,
  };
}
