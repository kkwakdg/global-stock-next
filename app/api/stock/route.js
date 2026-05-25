import YahooFinance from 'yahoo-finance2';
import { resolveCompanyTicker } from '../../lib/companyNames';
import {
  STOCK_BATCH_SIZE,
  chunkArray,
  formatStock,
  isValidStock,
  noStoreJson,
  normalizeQuoteResult,
  rankStocksByMarketCap,
  withTimeout,
} from '../../lib/stockApiFormatters';
import { GLOBAL_MARKET_CAP_TICKERS, TOP_COMPANIES_LIMIT } from '../../lib/stockUniverse';

export const dynamic = 'force-dynamic';

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey'],
});

const DEFAULT_EXCHANGE_RATES = {
  KRW: 1380,
  JPY: 155,
  CNY: 7.2,
  HKD: 7.8,
};

async function quoteWithFallback(symbols, label) {
  try {
    const result = await withTimeout(yahooFinance.quote(symbols), label);
    return normalizeQuoteResult(symbols, result);
  } catch (error) {
    console.error(`${label} 실패:`, error);
    return Array.isArray(symbols) ? [] : null;
  }
}

async function searchTickerByCompanyName(query) {
  try {
    const searchResult = await withTimeout(
      yahooFinance.search(query, {
        quotesCount: 8,
        newsCount: 0,
        enableFuzzyQuery: true,
      }),
      '기업명 검색'
    );
    const quote = searchResult?.quotes?.find((item) =>
      item?.isYahooFinance &&
      item?.symbol &&
      (item.quoteType === 'EQUITY' || item.typeDisp === 'equity')
    ) || searchResult?.quotes?.find((item) => item?.isYahooFinance && item?.symbol);

    return quote?.symbol || '';
  } catch (error) {
    console.error('기업명 검색 실패:', error);
    return '';
  }
}

async function getExchangeRates() {
  const [
    krwExchangeRateResult,
    jpyExchangeRateResult,
    cnyExchangeRateResult,
    hkdExchangeRateResult,
  ] = await Promise.all([
    quoteWithFallback('USDKRW=X', '원/달러 환율 조회'),
    quoteWithFallback('USDJPY=X', '엔/달러 환율 조회'),
    quoteWithFallback('USDCNY=X', '위안/달러 환율 조회'),
    quoteWithFallback('USDHKD=X', '홍콩달러/달러 환율 조회'),
  ]);

  return {
    KRW: krwExchangeRateResult?.regularMarketPrice || DEFAULT_EXCHANGE_RATES.KRW,
    JPY: jpyExchangeRateResult?.regularMarketPrice || DEFAULT_EXCHANGE_RATES.JPY,
    CNY: cnyExchangeRateResult?.regularMarketPrice || DEFAULT_EXCHANGE_RATES.CNY,
    HKD: hkdExchangeRateResult?.regularMarketPrice || DEFAULT_EXCHANGE_RATES.HKD,
  };
}

async function findStockBySearchWord(searchWord) {
  const trimmedSearchWord = searchWord.trim();
  const localTicker = resolveCompanyTicker(trimmedSearchWord);
  const directQuery = localTicker || trimmedSearchWord.toUpperCase();
  let quoteResult = await quoteWithFallback(directQuery, '종목 검색');
  let stock = Array.isArray(quoteResult) ? quoteResult[0] : quoteResult;

  if (!stock && !localTicker) {
    const searchedTicker = await searchTickerByCompanyName(trimmedSearchWord);

    if (searchedTicker) {
      quoteResult = await quoteWithFallback(searchedTicker, '기업명 기반 종목 검색');
      stock = Array.isArray(quoteResult) ? quoteResult[0] : quoteResult;
    }
  }

  return stock;
}

async function getTopStocks(exchangeRates) {
  const stockResultGroups = await Promise.all(
    chunkArray(GLOBAL_MARKET_CAP_TICKERS, STOCK_BATCH_SIZE).map((tickers, index) =>
      quoteWithFallback(tickers, `야후 그룹 쿼리 ${index + 1}`)
    )
  );
  const validStocks = stockResultGroups
    .flat()
    .filter((stock) => isValidStock(stock, exchangeRates));

  if (validStocks.length === 0) {
    return null;
  }

  const formattedStocks = validStocks.map((stock) =>
    formatStock(stock, exchangeRates.KRW, exchangeRates)
  );

  return rankStocksByMarketCap(formattedStocks, TOP_COMPANIES_LIMIT);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const searchWord = searchParams.get('search');

  try {
    const exchangeRates = await getExchangeRates();

    if (searchWord) {
      const stock = await findStockBySearchWord(searchWord);

      if (!stock) {
        return noStoreJson({ error: '종목을 찾을 수 없습니다.' }, { status: 404 });
      }

      return noStoreJson(formatStock(stock, exchangeRates.KRW, exchangeRates));
    }

    const topStocks = await getTopStocks(exchangeRates);

    if (!topStocks) {
      return noStoreJson({ error: '불러온 주식 데이터가 없습니다.' }, { status: 502 });
    }

    return noStoreJson(topStocks);
  } catch (error) {
    console.error('서버 내부 에러:', error);
    return noStoreJson({ error: '서버 내부 에러가 발생했습니다.' }, { status: 500 });
  }
}
