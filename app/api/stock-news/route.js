import YahooFinance from 'yahoo-finance2';
import { normalizeLanguage } from '../../lib/i18n';
import {
  generateFallbackNewsAnalysis,
  generateLlmNewsAnalysis,
  getAnalysisSectionLabels,
} from '../../lib/stockNewsAnalysis';
import { noStoreJson, withTimeout } from '../../lib/stockApiFormatters';

export const dynamic = 'force-dynamic';

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey'],
});

const NEWS_CANDIDATE_COUNT = 16;
const NEWS_DISPLAY_COUNT = 6;
const TRANSLATE_TIMEOUT_MS = 3500;

const LOCALE_BY_LANGUAGE = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
};

const THEME_RULES = [
  {
    key: 'earnings',
    match: /\b(earnings|revenue|profit|guidance|quarter|results|sales|margin)\b/i,
  },
  {
    key: 'analyst',
    match: /\b(analyst|rating|target|upgrade|downgrade|buy|sell|outperform|underperform)\b/i,
  },
  {
    key: 'ai',
    match: /\b(ai|artificial intelligence|chip|semiconductor|gpu|data center|cloud)\b/i,
  },
  {
    key: 'deal',
    match: /\b(acquisition|merger|deal|partnership|contract|investment|stake)\b/i,
  },
  {
    key: 'regulation',
    match: /\b(regulator|lawsuit|probe|tariff|ban|approval|policy|antitrust)\b/i,
  },
  {
    key: 'market',
    match: /\b(stock|shares|rally|falls|slumps|market|nasdaq|dow|s&p|futures)\b/i,
  },
];

const SIGNAL_RULES = [
  {
    key: 'positive',
    weight: 2,
    match: /\b(gain|gains|rally|rises|surges|jumps|beats|raises|raised|upgrade|strong buy|record|growth|wins|expands|bullish)\b/i,
  },
  {
    key: 'negative',
    weight: 2,
    match: /\b(fall|falls|down|drops|slumps|misses|cuts|cut|downgrade|lawsuit|probe|warning|weak|risk|tariff|ban|bearish|concern|boring|doesn't like|do not like)\b/i,
  },
  {
    key: 'catalyst',
    weight: 1,
    match: /\b(ai|data center|chip|gpu|earnings|revenue|guidance|target|rating|investment|partnership|contract|approval)\b/i,
  },
  {
    key: 'risk',
    weight: 1,
    match: /\b(lawsuit|probe|regulator|tariff|ban|competition|margin|valuation|sell-off|volatility|smuggling|china)\b/i,
  },
];

const COPY = {
  ko: {
    title: 'AI 뉴스 요약',
    noNews: '현재 확인 가능한 주요 뉴스가 없습니다. 잠시 후 다시 확인해 주세요.',
    separator: ', ',
    overview: ({ company, direction, themes, latestTitle, latestTime }) =>
      `${company}의 최신 뉴스 흐름은 ${direction}입니다. 가장 최근 이슈는 ${latestTime ? `${latestTime} 기준 ` : ''}"${latestTitle}"이며, 현재 시장은 ${themes}를 중심으로 반응하고 있습니다.`,
    direction: {
      positive: '긍정 쪽으로 기울어진 상태',
      negative: '경계감이 더 크게 반영된 상태',
      mixed: '호재와 부담 요인이 혼재된 상태',
    },
    themes: {
      earnings: '실적과 가이던스',
      analyst: '애널리스트 평가와 목표가',
      ai: 'AI, 반도체, 데이터센터 수요',
      deal: '투자, 제휴, 인수합병',
      regulation: '규제와 정책 리스크',
      market: '주가 흐름과 시장 심리',
      general: '기업 뉴스와 시장 반응',
    },
    takeaway: {
      positive: 'AI 관점에서는 단기 기대감이 살아 있지만, 기사 흐름이 실제 실적과 가이던스로 이어지는지 확인하는 것이 핵심입니다.',
      negative: 'AI 관점에서는 리스크 헤드라인이 주가 반응을 압박할 수 있어, 추가 악재와 변동성 확대 여부를 먼저 봐야 합니다.',
      mixed: 'AI 관점에서는 방향성이 아직 확정되지 않았습니다. 최신 기사에서 반복되는 촉매와 리스크 중 어느 쪽이 강해지는지 추적해야 합니다.',
    },
    insightLabels: {
      latest: '최신 이슈',
      catalyst: '상승 촉매',
      risk: '리스크',
      watch: '체크포인트',
    },
    insightText: {
      latest: (title) => `가장 최근 기사는 "${title}" 이슈를 다루고 있습니다.`,
      catalyst: (themes) => `긍정 재료는 ${themes}에 집중되어 있습니다.`,
      risk: '규제, 밸류에이션, 경쟁, 지역 리스크 관련 표현이 늘면 투자심리가 빠르게 식을 수 있습니다.',
      watch: '같은 주제가 여러 매체에서 반복되는지, 그리고 주가 반응이 기사 방향과 일치하는지 확인하세요.',
    },
    source: (publisher, time) => `${publisher} · ${time}`,
  },
  en: {
    title: 'AI News Brief',
    noNews: 'No major live news is available right now. Please check again shortly.',
    separator: ', ',
    overview: ({ company, direction, themes, latestTitle, latestTime }) =>
      `The latest news flow around ${company} looks ${direction}. The newest item${latestTime ? ` as of ${latestTime}` : ''} is "${latestTitle}", and the market narrative is centered on ${themes}.`,
    direction: {
      positive: 'constructive',
      negative: 'cautious',
      mixed: 'mixed',
    },
    themes: {
      earnings: 'earnings and guidance',
      analyst: 'analyst ratings and price targets',
      ai: 'AI, semiconductors, and data center demand',
      deal: 'investment, partnerships, and M&A',
      regulation: 'regulatory and policy risk',
      market: 'share-price momentum and market sentiment',
      general: 'company news and market reaction',
    },
    takeaway: {
      positive: 'From an AI-read perspective, near-term expectations look supportive, but the key is whether headlines translate into fundamentals and guidance.',
      negative: 'From an AI-read perspective, risk headlines can pressure sentiment, so watch for follow-through and wider volatility.',
      mixed: 'From an AI-read perspective, direction is not settled yet. Track whether repeated catalysts or repeated risks gain more weight.',
    },
    insightLabels: {
      latest: 'Latest issue',
      catalyst: 'Bullish driver',
      risk: 'Risk',
      watch: 'Watch point',
    },
    insightText: {
      latest: (title) => `The newest article is focused on "${title}".`,
      catalyst: (themes) => `Positive drivers are concentrated around ${themes}.`,
      risk: 'More headlines around regulation, valuation, competition, or regional exposure could cool sentiment quickly.',
      watch: 'Check whether the same topic repeats across publishers and whether price action confirms the news direction.',
    },
    source: (publisher, time) => `${publisher} · ${time}`,
  },
  ja: {
    title: 'AIニュース要約',
    noNews: '現在確認できる主要ニュースはありません。しばらくしてから再度ご確認ください。',
    separator: '、',
    overview: ({ company, direction, themes, latestTitle, latestTime }) =>
      `${company}の最新ニュースの流れは${direction}状態です。直近の材料は${latestTime ? `${latestTime}時点で` : ''}「${latestTitle}」で、市場の焦点は${themes}に集まっています。`,
    direction: {
      positive: '前向きな',
      negative: '警戒感を含む',
      mixed: 'まちまちな',
    },
    themes: {
      earnings: '決算とガイダンス',
      analyst: 'アナリスト評価と目標株価',
      ai: 'AI、半導体、データセンター需要',
      deal: '投資、提携、M&A',
      regulation: '規制と政策リスク',
      market: '株価動向と市場心理',
      general: '企業ニュースと市場反応',
    },
    takeaway: {
      positive: 'AI分析では短期的な期待感が残っていますが、ニュースが実際の業績やガイダンスに結びつくかが重要です。',
      negative: 'AI分析ではリスク材料が投資心理を圧迫しやすく、続報とボラティリティ拡大に注意が必要です。',
      mixed: 'AI分析では方向感はまだ固まっていません。繰り返し出る好材料とリスクのどちらが強まるかを追跡する必要があります。',
    },
    insightLabels: {
      latest: '最新材料',
      catalyst: '上昇要因',
      risk: 'リスク',
      watch: '確認ポイント',
    },
    insightText: {
      latest: (title) => `直近の記事は「${title}」を扱っています。`,
      catalyst: (themes) => `ポジティブ材料は${themes}に集中しています。`,
      risk: '規制、バリュエーション、競争、地域エクスポージャーに関する記事が増えると、投資心理が冷えやすくなります。',
      watch: '同じテーマが複数メディアで繰り返されるか、株価反応がニュースの方向性と一致するかを確認してください。',
    },
    source: (publisher, time) => `${publisher} · ${time}`,
  },
};

function sanitizeText(value, maxLength = 120) {
  return String(value || '').trim().slice(0, maxLength);
}

function getDirection(titles) {
  const scores = titles.reduce((totals, title, index) => {
    const recencyWeight = index === 0 ? 1.8 : index === 1 ? 1.3 : 1;

    SIGNAL_RULES.forEach((rule) => {
      if (rule.match.test(title)) {
        totals[rule.key] = (totals[rule.key] || 0) + (rule.weight * recencyWeight);
      }
    });

    return totals;
  }, {});
  const positiveCount = scores.positive || 0;
  const negativeCount = scores.negative || 0;
  const latestSignal = getTitleSignal(titles[0]);

  if (latestSignal === 'positive' && negativeCount > 0) return 'mixed';
  if (latestSignal === 'negative' && positiveCount > 0) return 'mixed';
  if (positiveCount > negativeCount * 1.25) return 'positive';
  if (negativeCount > positiveCount * 1.25) return 'negative';
  return 'mixed';
}

function getTitleSignal(title) {
  const scores = SIGNAL_RULES.reduce((totals, rule) => {
    if (rule.match.test(title || '')) {
      totals[rule.key] = (totals[rule.key] || 0) + rule.weight;
    }

    return totals;
  }, {});

  if ((scores.positive || 0) > (scores.negative || 0)) return 'positive';
  if ((scores.negative || 0) > (scores.positive || 0)) return 'negative';
  return 'mixed';
}

function getPublishedTime(item) {
  const value = item?.providerPublishTime;
  const time = value ? new Date(value).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function getThemes(titles, language) {
  const joinedTitles = titles.join(' ');
  const themeKeys = THEME_RULES
    .filter((rule) => rule.match.test(joinedTitles))
    .map((rule) => rule.key)
    .slice(0, 3);
  const keys = themeKeys.length ? themeKeys : ['general'];

  return keys.map((key) => COPY[language].themes[key]).join(COPY[language].separator);
}

function formatPublishedAt(value, language) {
  if (!value) return '';

  try {
    return new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return '';
  }
}

function fallbackHeadline(title, language) {
  if (language === 'en') return title;

  const replacements = language === 'ko'
    ? [
      [/\bshares?\b/gi, '주가'],
      [/\bstock\b/gi, '주식'],
      [/\bearnings\b/gi, '실적'],
      [/\brevenue\b/gi, '매출'],
      [/\banalyst\b/gi, '애널리스트'],
      [/\bprice target\b/gi, '목표가'],
      [/\bupgrade\b/gi, '상향'],
      [/\bdowngrade\b/gi, '하향'],
      [/\brally\b/gi, '상승세'],
      [/\bgains?\b/gi, '상승'],
      [/\bfalls?\b/gi, '하락'],
    ]
    : [
      [/\bshares?\b/gi, '株価'],
      [/\bstock\b/gi, '株式'],
      [/\bearnings\b/gi, '決算'],
      [/\brevenue\b/gi, '売上高'],
      [/\banalyst\b/gi, 'アナリスト'],
      [/\bprice target\b/gi, '目標株価'],
      [/\bupgrade\b/gi, '格上げ'],
      [/\bdowngrade\b/gi, '格下げ'],
      [/\brally\b/gi, '上昇基調'],
      [/\bgains?\b/gi, '上昇'],
      [/\bfalls?\b/gi, '下落'],
    ];

  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), title);
}

async function translateText(text, language) {
  if (language === 'en' || !text) return text;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(text)}`,
      { signal: controller.signal }
    );

    if (!response.ok) throw new Error('Translation failed');

    const result = await response.json();
    const translated = result?.[0]?.map((segment) => segment?.[0] || '').join('').trim();
    return translated || fallbackHeadline(text, language);
  } catch {
    return fallbackHeadline(text, language);
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeNews(news) {
  return (Array.isArray(news) ? news : [])
    .filter((item) => item?.title && item?.link)
    .sort((a, b) => getPublishedTime(b) - getPublishedTime(a));
}

function normalizeIdentityText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getCompanyTokens(companyName) {
  return String(companyName || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) =>
      token.length > 2 &&
      !['inc', 'corp', 'corporation', 'company', 'class', 'limited', 'ltd', 'plc', 'adr'].includes(token)
    );
}

function newsTitleMatchesStock(item, ticker, companyName) {
  const normalizedTicker = normalizeIdentityText(ticker);
  const normalizedTitle = normalizeIdentityText(item.title);
  const titleTickerMatch = normalizedTicker && normalizedTitle.includes(normalizedTicker);
  const companyTokenMatch = getCompanyTokens(companyName).some((token) =>
    normalizedTitle.includes(token)
  );

  return titleTickerMatch || companyTokenMatch;
}

function newsRelatedTickersMatch(item, ticker) {
  const normalizedTicker = normalizeIdentityText(ticker);
  const relatedTickers = Array.isArray(item.relatedTickers) ? item.relatedTickers : [];

  return relatedTickers.some((relatedTicker) =>
    normalizeIdentityText(relatedTicker) === normalizedTicker
  );
}

async function getNews(ticker, companyName) {
  const searchYahooNews = (query) => withTimeout(
    yahooFinance.search(query, {
      quotesCount: 0,
      newsCount: NEWS_CANDIDATE_COUNT,
      enableFuzzyQuery: true,
    }),
    '뉴스 검색'
  );
  let result = await searchYahooNews(ticker);
  let news = normalizeNews(result?.news);

  if (news.length === 0 && companyName) {
    result = await searchYahooNews(companyName);
    news = normalizeNews(result?.news);
  }

  const titleMatchedNews = news.filter((item) => newsTitleMatchesStock(item, ticker, companyName));
  const relevantNews = titleMatchedNews.length > 0
    ? titleMatchedNews
    : news.filter((item) => newsRelatedTickersMatch(item, ticker));

  return (relevantNews.length > 0 ? relevantNews : news)
    .sort((a, b) => getPublishedTime(b) - getPublishedTime(a))
    .slice(0, NEWS_DISPLAY_COUNT);
}

function buildInsights({ copy, direction, themes, latestTitle }) {
  const insights = [
    {
      label: copy.insightLabels.latest,
      text: copy.insightText.latest(latestTitle),
    },
    {
      label: copy.insightLabels.catalyst,
      text: copy.insightText.catalyst(themes),
    },
  ];

  if (direction !== 'positive') {
    insights.push({
      label: copy.insightLabels.risk,
      text: copy.insightText.risk,
    });
  }

  insights.push({
    label: copy.insightLabels.watch,
    text: copy.insightText.watch,
  });

  return insights.slice(0, 4);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticker = sanitizeText(searchParams.get('ticker'), 24).toUpperCase();
  const companyName = sanitizeText(searchParams.get('name'), 100);
  const displayNameParam = sanitizeText(searchParams.get('displayName'), 100);
  const language = normalizeLanguage(searchParams.get('language'));

  if (!ticker) {
    return noStoreJson({ error: 'Ticker is required.' }, { status: 400 });
  }

  try {
    const news = await getNews(ticker, companyName);
    const copy = COPY[language];
    const displayName = displayNameParam || companyName || ticker;

    if (news.length === 0) {
      return noStoreJson({
        title: copy.title,
        summary: copy.noNews,
        takeaway: '',
        articles: [],
      });
    }

    const titles = news.map((item) => item.title);
    const direction = getDirection(titles);
    const themes = getThemes(titles, language);
    const translatedTitles = await Promise.all(
      news.map((item) => translateText(item.title, language))
    );
    const latestArticle = news[0];
    const latestTitle = translatedTitles[0] || latestArticle.title;
    const latestTime = formatPublishedAt(latestArticle.providerPublishTime, language);
    const articles = news.map((item, index) => ({
      id: item.uuid || item.link,
      title: translatedTitles[index],
      originalTitle: item.title,
      publisher: item.publisher || 'Yahoo Finance',
      publishedAt: item.providerPublishTime || '',
      relatedTickers: Array.isArray(item.relatedTickers) ? item.relatedTickers : [],
      sourceLine: copy.source(
        item.publisher || 'Yahoo Finance',
        formatPublishedAt(item.providerPublishTime, language)
      ),
      link: item.link,
    }));
    let analysis = null;

    try {
      analysis = await generateLlmNewsAnalysis({
        ticker,
        displayName,
        language,
        articles,
      });
    } catch (analysisError) {
      console.error('LLM 뉴스 분석 실패, 로컬 분석기로 대체:', analysisError);
    }

    if (!analysis) {
      analysis = generateFallbackNewsAnalysis({
        ticker,
        displayName,
        language,
        articles,
      });
    }

    return noStoreJson({
      title: copy.title,
      sectionLabels: getAnalysisSectionLabels(language),
      analysis,
      summary: copy.overview({
        company: displayName,
        direction: copy.direction[direction],
        themes,
        latestTitle,
        latestTime,
      }),
      insights: buildInsights({ copy, direction, themes, latestTitle }),
      takeaway: copy.takeaway[direction],
      articles,
    });
  } catch (error) {
    console.error('뉴스 요약 실패:', error);
    return noStoreJson({ error: 'Failed to load stock news.' }, { status: 502 });
  }
}
