import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { resolveCompanyTicker } from '../../lib/companyNames';
import { GLOBAL_MARKET_CAP_TICKERS, TOP_COMPANIES_LIMIT } from '../../lib/stockUniverse';

export const dynamic = 'force-dynamic';

const yahooFinance = new YahooFinance({
    suppressNotices: ['yahooSurvey'],
});

const YAHOO_TIMEOUT_MS = 9000;
const BATCH_SIZE = 20;

function json(data, init = {}) {
    return NextResponse.json(data, {
        ...init,
        headers: {
            'Cache-Control': 'no-store, max-age=0',
            ...init.headers,
        },
    });
}

function withTimeout(promise, label, timeoutMs = YAHOO_TIMEOUT_MS) {
    let timeoutId;
    const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(`${label} 요청 시간이 초과되었습니다.`));
        }, timeoutMs);
    });

    return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

function chunkArray(items, size) {
    const chunks = [];
    for (let index = 0; index < items.length; index += size) {
        chunks.push(items.slice(index, index + size));
    }
    return chunks;
}

function formatPrice(value, currency = 'USD') {
    if (!Number.isFinite(value)) return '데이터 없음';

    if (currency === 'KRW') {
        return `₩${Math.round(value).toLocaleString('ko-KR')}`;
    }

    return `$${value.toFixed(2)}`;
}

function formatTrillion(value) {
    if (!Number.isFinite(value) || value <= 0) return '데이터 없음';
    return `$${(value / 1e12).toFixed(2)} T`;
}

function formatChangePercent(value) {
    if (!Number.isFinite(value)) return '데이터 없음';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function getMarketCapInUsd(stock, krwExchangeRate) {
    if (!stock) return 0;

    const rawMarketCap = Number(stock.marketCap);
    if (!Number.isFinite(rawMarketCap) || rawMarketCap <= 0) return 0;

    if (stock.symbol?.endsWith('.KS')) return rawMarketCap / krwExchangeRate;

    return rawMarketCap;
}

function formatStock(stock, krwExchangeRate, exchangeRates) {
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

async function quoteWithFallback(symbols, label) {
    try {
        const result = await withTimeout(yahooFinance.quote(symbols), label);
        return Array.isArray(symbols) && !Array.isArray(result) ? [result] : result;
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

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const searchWord = searchParams.get('search');

    try {
        const [krwExchangeRateResult, jpyExchangeRateResult] = await Promise.all([
            quoteWithFallback('USDKRW=X', '원/달러 환율 조회'),
            quoteWithFallback('USDJPY=X', '엔/달러 환율 조회'),
        ]);
        const currentExchangeRate = krwExchangeRateResult?.regularMarketPrice || 1380;
        const currentJpyExchangeRate = jpyExchangeRateResult?.regularMarketPrice || 155;
        const exchangeRates = {
            KRW: currentExchangeRate,
            JPY: currentJpyExchangeRate,
        };

        if (searchWord) {
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

            if (!stock) {
                return json({ error: "종목을 찾을 수 없습니다." }, { status: 404 });
            }

            return json(formatStock(stock, currentExchangeRate, exchangeRates));
        }

        // 모바일 Safari가 기다리다 연결을 끊지 않도록 큰 요청을 작은 묶음으로 나눠 시간 제한을 둡니다.
        const stockResultGroups = await Promise.all(
            chunkArray(GLOBAL_MARKET_CAP_TICKERS, BATCH_SIZE).map((tickers, index) =>
                quoteWithFallback(tickers, `야후 그룹 쿼리 ${index + 1}`)
            )
        );
        const stockResults = stockResultGroups.flat();

        // 배열 형태 보장 및 유효한 데이터 필터링
        const validStocks = Array.isArray(stockResults)
            ? stockResults.filter((stock) =>
                stock &&
                getMarketCapInUsd(stock, currentExchangeRate) > 0 &&
                Number.isFinite(stock.regularMarketPrice)
            )
            : [];

        if (validStocks.length === 0) {
            console.log("불러온 주식 데이터가 없습니다.");
            return json({ error: "불러온 주식 데이터가 없습니다." }, { status: 502 });
        }

        const formattedData = validStocks.map((stock) =>
            formatStock(stock, currentExchangeRate, exchangeRates)
        );

        // 실시간 시총 기준 정렬 및 순위 매기기
        const sortedData = formattedData.sort((a, b) => b.marketCapUsdTrillions - a.marketCapUsdTrillions);
        const finalData = sortedData.slice(0, TOP_COMPANIES_LIMIT).map((stock, index) => ({
            rank: index + 1,
            ...stock
        }));

        return json(finalData);

    } catch (error) {
        console.error("서버 내부 에러:", error);
        return json({ error: "서버 내부 에러가 발생했습니다." }, { status: 500 });
    }
}
