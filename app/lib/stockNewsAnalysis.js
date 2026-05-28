export const HEDGE_FUND_SYSTEM_PROMPT = `[Role & Tone]
You are a senior hedge fund strategist with 20 years of experience on Wall Street, known for delivering brutally honest, realistic, and cynical investment insights. 
Your job is to filter out the marketing fluff and media noise from the provided Yahoo Finance news data and deliver razor-sharp, actionable insights for retail investors.

[Output Constraints]
1. Ban Cliches & Obvious Statements: Never output generic phrases like "Revenue increased, which is positive" or "Increased competition is a risk." Dive straight into the structural core.
2. Fact & Data-Driven: You must prioritize hard numbers (%, $, multiples, timeframes) extracted from the news. If a news article lacks concrete data, explicitly question its credibility.
3. Cynical & Direct Tone: Use cold, professional, yet blunt market terminology (~임, ~했음, ~가 관건 in Korean). Do not use soft or comforting language. Call out market hypes, overvaluations, and manipulative press releases without hesitation.
4. Maximum Scannability: Use bold markdown (**), clear bullet points, and concise sentences. Investors must grab the core thesis within 3 seconds of opening the modal.`;

export const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'market_impact',
    'hidden_agenda',
    'triggers',
    'risks',
    'actionable_checklist',
  ],
  properties: {
    market_impact: {
      type: 'object',
      additionalProperties: false,
      required: ['status', 'bullets'],
      properties: {
        status: { type: 'string' },
        bullets: {
          type: 'array',
          minItems: 2,
          maxItems: 3,
          items: { type: 'string' },
        },
      },
    },
    hidden_agenda: sectionSchema(),
    triggers: sectionSchema(),
    risks: sectionSchema(),
    actionable_checklist: sectionSchema(),
  },
};

const SECTION_LABELS = {
  ko: {
    market_impact: '마켓 임팩트',
    hidden_agenda: '시장이 숨기고 있는 본질',
    triggers: '돈이 몰릴 진짜 이유',
    risks: '치명적인 지뢰밭',
    actionable_checklist: '트레이딩 데드라인',
  },
  en: {
    market_impact: 'Market Impact',
    hidden_agenda: 'Hidden Agenda',
    triggers: 'Real Triggers',
    risks: 'Fatal Minefield',
    actionable_checklist: 'Trading Deadline',
  },
  ja: {
    market_impact: 'マーケットインパクト',
    hidden_agenda: '市場が隠す本質',
    triggers: '資金が集まる本当の理由',
    risks: '致命的な地雷原',
    actionable_checklist: 'トレーディング期限',
  },
};

const NUMBER_PATTERN = /(?:[$₩¥€£]\s?\d+(?:\.\d+)?\s?(?:B|M|T|bn|mn|trillion|billion|million)?|\d+(?:\.\d+)?\s?(?:%|배|x|X|달러|억원|조|B|M|T|bn|mn|trillion|billion|million)|YoY|QoQ|YTD|120일|52주|10b5-1)/g;

function sectionSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['bullets'],
    properties: {
      bullets: {
        type: 'array',
        minItems: 2,
        maxItems: 3,
        items: { type: 'string' },
      },
    },
  };
}

function getLanguageInstruction(language) {
  if (language === 'ko') {
    return 'Write in Korean. Use blunt institutional market language ending with forms like "~임", "~했음", "~가 관건". Keep it scannable and technical.';
  }

  if (language === 'ja') {
    return 'Write in Japanese with a cold, blunt hedge-fund strategist tone. Keep section meaning equivalent to the Korean schema and preserve hard numbers.';
  }

  return 'Write in English with a cold, blunt hedge-fund strategist tone. Keep it technical, concise, and number-first.';
}

function buildUserPrompt({ ticker, displayName, language, articles }) {
  const compactArticles = articles.map((article, index) => ({
    rank: index + 1,
    title: article.originalTitle || article.title,
    translatedTitle: article.title,
    publisher: article.publisher,
    publishedAt: article.publishedAt,
    relatedTickers: article.relatedTickers || [],
  }));

  return [
    getLanguageInstruction(language),
    '',
    'Analyze only the provided Yahoo Finance news data. Do not invent facts, prices, dates, multiples, or events not present in the data.',
    'If the provided titles are vague or PR-like, explicitly call that out as weak signal/noise.',
    '',
    'Required section logic:',
    '1. market_impact: Do not summarize article plots. Define net impact on tonight/near-term stock price immediately and explain institutional narrative.',
    '2. hidden_agenda: Look past the headline. Identify PR pump, systematic macro reaction, or real fundamental shift.',
    '3. triggers: Exclude vague predictions. Identify exact quantitative/event-driven thresholds visible or inferable from provided data.',
    '4. risks: Avoid generic risks. Target the company-specific vulnerability exposed by the current news flow.',
    '5. actionable_checklist: Provide immediate price levels if provided; otherwise give concrete calendar/newsflow deadlines and what confirms/invalidates the thesis.',
    '',
    `Ticker: ${ticker}`,
    `Company: ${displayName || ticker}`,
    `Current language: ${language}`,
    `Yahoo Finance articles JSON:\n${JSON.stringify(compactArticles, null, 2)}`,
  ].join('\n');
}

function parseOpenAiJson(response) {
  const outputText = response?.output_text;
  if (outputText) return JSON.parse(outputText);

  const text = response?.output
    ?.flatMap((item) => item?.content || [])
    ?.map((content) => content?.text || '')
    ?.join('');

  if (!text) throw new Error('OpenAI response did not include output text.');
  return JSON.parse(text);
}

function validateAnalysis(value) {
  const sectionKeys = [
    'market_impact',
    'hidden_agenda',
    'triggers',
    'risks',
    'actionable_checklist',
  ];

  if (!value || typeof value !== 'object') return null;

  const normalized = {};

  for (const key of sectionKeys) {
    const section = value[key];
    const bullets = Array.isArray(section?.bullets)
      ? section.bullets.filter((bullet) => typeof bullet === 'string' && bullet.trim())
      : [];

    if (key === 'market_impact') {
      const status = typeof section?.status === 'string' ? section.status.trim() : '';
      if (!status || bullets.length === 0) return null;
      normalized[key] = { status, bullets };
    } else {
      if (bullets.length === 0) return null;
      normalized[key] = { bullets };
    }
  }

  return normalized;
}

export async function generateLlmNewsAnalysis({ ticker, displayName, language, articles }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || !Array.isArray(articles) || articles.length === 0) {
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: HEDGE_FUND_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: buildUserPrompt({ ticker, displayName, language, articles }),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'stock_news_analysis',
          strict: true,
          schema: ANALYSIS_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI analysis failed: ${response.status}`);
  }

  return validateAnalysis(parseOpenAiJson(await response.json()));
}

function extractNumbers(articles) {
  return [...new Set(
    articles
      .flatMap((article) => String(article.originalTitle || article.title || '').match(NUMBER_PATTERN) || [])
      .map((value) => value.trim())
      .filter(Boolean)
  )].slice(0, 5);
}

function getLatestArticle(articles) {
  return articles[0] || {};
}

function getStatus({ titles, numbers, language }) {
  const joinedTitles = titles.join(' ').toLowerCase();
  const hasNegative = /\b(fall|falls|down|drops|slumps|downgrade|probe|warning|risk|bearish|boring|doesn't like|misses)\b/i.test(joinedTitles);
  const hasPositive = /\b(gain|gains|rally|raises|raised|upgrade|strong buy|record|growth|expands|bullish)\b/i.test(joinedTitles);
  const dataSignal = numbers.length ? ` / data: ${numbers.slice(0, 3).join(', ')}` : '';

  if (language === 'ko') {
    if (hasNegative && hasPositive) return `단기 변동성 확대 (롱/숏 내러티브 충돌${dataSignal})`;
    if (hasNegative) return `베어리시 압력 우위${dataSignal}`;
    if (hasPositive) return `불리시 모멘텀 우위${dataSignal}`;
    return `순수 노이즈 가능성 높음${dataSignal}`;
  }

  if (language === 'ja') {
    if (hasNegative && hasPositive) return `短期ボラティリティ拡大（ロング/ショートの物語が衝突${dataSignal}）`;
    if (hasNegative) return `ベアリッシュ圧力が優勢${dataSignal}`;
    if (hasPositive) return `ブルリッシュ・モメンタム優勢${dataSignal}`;
    return `純粋なノイズの可能性が高い${dataSignal}`;
  }

  if (hasNegative && hasPositive) return `Short-term volatility expansion (long/short narrative clash${dataSignal})`;
  if (hasNegative) return `Bearish pressure dominant${dataSignal}`;
  if (hasPositive) return `Bullish momentum dominant${dataSignal}`;
  return `Likely pure noise${dataSignal}`;
}

function fallbackKo({ displayName, ticker, articles, numbers }) {
  const latest = getLatestArticle(articles);
  const dataLine = numbers.length
    ? `뉴스에 박힌 숫자는 **${numbers.join(', ')}**임. 이 숫자 외의 장밋빛 해석은 전부 할인해야 함.`
    : '제공 기사에 검증 가능한 숫자가 거의 없음. 이건 분석 재료라기보다 헤드라인 장사에 가까움.';

  return {
    market_impact: {
      status: getStatus({ titles: articles.map((article) => article.originalTitle || article.title), numbers, language: 'ko' }),
      bullets: [
        `**핵심 팩트:** ${dataLine}`,
        `**시장 내러티브:** ${displayName || ticker} 뉴스 플로우는 펀더멘탈 재평가보다 단기 포지셔닝을 흔드는 재료에 가까움.`,
      ],
    },
    hidden_agenda: {
      bullets: [
        `**언론 플레이 판별:** "${latest.title}" 자체는 강한 회계 데이터가 아니라 내러티브성 헤드라인임. 숫자 없는 기사는 기관 매수 근거가 아니라 클릭 유도용 노이즈임.`,
        '**실질적 맥락:** 여러 매체가 같은 테마를 반복해야 수급이 붙음. 단발성 기사면 장중 변동성만 만들고 종가에는 증발할 가능성이 큼.',
      ],
    },
    triggers: {
      bullets: [
        numbers[0]
          ? `**컨센서스 트리거:** 시장은 **${numbers[0]}** 같은 하드 넘버에만 반응할 가능성이 큼. 후속 기사에서 이 숫자가 상향 반복되면 숏커버링 명분이 생김.`
          : '**컨센서스 트리거:** 지금 기사 세트에는 강제 매수 트리거가 부족함. 다음 실적/가이던스 숫자가 나오기 전까지는 추격 매수 근거 약함.',
        `**수급 트리거:** ${ticker} 관련 기사가 최신순으로 연속 노출되는지 봐야 함. 같은 키워드가 24시간 안에 반복되면 알고리즘성 매수/매도 반응이 붙을 수 있음.`,
      ],
    },
    risks: {
      bullets: [
        '**치명적 약점:** 숫자 없는 낙관론은 밸류에이션을 정당화하지 못함. 기대치가 이미 가격에 박혀 있으면 좋은 뉴스에도 매도 나올 수 있음.',
        '**헤드라인 리스크:** 최신 기사가 부정적 톤인데 과거 호재가 섞이면 방향성 착시가 생김. 이 구간에서 늦은 롱 진입은 변동성에 털릴 확률이 높음.',
      ],
    },
    actionable_checklist: {
      bullets: [
        '**[뉴스 데드라인]** 다음 24시간 안에 같은 이슈가 2개 이상 주요 매체에서 반복되는지 확인. 반복 없으면 단발 노이즈로 처리.',
        '**[가격 반응]** 기사 공개 후 첫 정규장 종가가 핵심임. 장중 급등보다 종가 유지 실패가 나오면 기관은 이 뉴스를 안 산다는 뜻임.',
      ],
    },
  };
}

function fallbackEn({ displayName, ticker, articles, numbers }) {
  const latest = getLatestArticle(articles);
  const dataLine = numbers.length
    ? `The only hard numbers in the feed are **${numbers.join(', ')}**. Everything beyond those numbers should be discounted.`
    : 'The feed carries almost no verifiable numbers. That is media noise, not an institutional underwriting case.';

  return {
    market_impact: {
      status: getStatus({ titles: articles.map((article) => article.originalTitle || article.title), numbers, language: 'en' }),
      bullets: [
        `**Core fact:** ${dataLine}`,
        `**Market narrative:** ${displayName || ticker} is being traded on positioning and headline velocity, not a clean fundamental reset.`,
      ],
    },
    hidden_agenda: {
      bullets: [
        `**PR filter:** "${latest.title}" is not hard accounting data. If the article has no numbers, institutions will treat it as weak signal.`,
        '**Macro context:** Repetition across publishers matters more than a single headline. One-off stories create intraday volatility, then usually decay.',
      ],
    },
    triggers: {
      bullets: [
        numbers[0]
          ? `**Consensus trigger:** The market will care about **${numbers[0]}** only if follow-up coverage repeats or upgrades that number. That is where forced buying can start.`
          : '**Consensus trigger:** There is no clean forced-buying trigger in this news set. Chasing before the next earnings/guidance print is weak process.',
        `**Flow trigger:** Watch whether ${ticker} headlines keep clustering over the next 24 hours. Clustering is what wakes up systematic flows.`,
      ],
    },
    risks: {
      bullets: [
        '**Fatal weakness:** Narrative without numbers cannot defend valuation. If expectations are already priced in, good headlines can still be sold.',
        '**Headline risk:** Mixed positive and negative headlines create direction illusion. Late longs can get chopped up before the thesis even forms.',
      ],
    },
    actionable_checklist: {
      bullets: [
        '**[News deadline]** Demand at least two repeat headlines from major publishers within 24 hours. No repetition means noise.',
        '**[Price reaction]** The first regular-session close after the headline matters. If the close fades, institutions did not buy the story.',
      ],
    },
  };
}

function fallbackJa({ displayName, ticker, articles, numbers }) {
  const latest = getLatestArticle(articles);
  const dataLine = numbers.length
    ? `ニュース内のハードデータは**${numbers.join(', ')}**のみ。この数字以外の強気解釈は割り引くべき。`
    : '検証可能な数字がほぼない。これは投資判断材料ではなく、ヘッドライン主導のノイズに近い。';

  return {
    market_impact: {
      status: getStatus({ titles: articles.map((article) => article.originalTitle || article.title), numbers, language: 'ja' }),
      bullets: [
        `**核心ファクト:** ${dataLine}`,
        `**市場ナラティブ:** ${displayName || ticker}はファンダメンタル再評価より、短期ポジショニングで動いている局面。`,
      ],
    },
    hidden_agenda: {
      bullets: [
        `**メディア演出判定:** 「${latest.title}」は強い会計データではない。数字のない記事は機関投資家の買い根拠になりにくい。`,
        '**実質的文脈:** 複数メディアで同じテーマが反復されるかが重要。単発なら日中の変動だけ作って消える可能性が高い。',
      ],
    },
    triggers: {
      bullets: [
        numbers[0]
          ? `**コンセンサストリガー:** 市場が反応するのは**${numbers[0]}**のような数字が続報で反復・上方修正される時。そこからショートカバーが始まる。`
          : '**コンセンサストリガー:** このニュース群には強制買いの明確な条件がない。次の決算・ガイダンス前の追随買いは弱い。',
        `**需給トリガー:** ${ticker}関連ヘッドラインが24時間以内に連続するか確認。集中すればシステム売買が反応しやすい。`,
      ],
    },
    risks: {
      bullets: [
        '**致命的な弱点:** 数字のないナラティブはバリュエーションを守れない。期待が織り込み済みなら好材料でも売られる。',
        '**ヘッドラインリスク:** 好悪材料が混在すると方向感の錯覚が起きる。遅いロングは thesis 形成前に振り落とされる。',
      ],
    },
    actionable_checklist: {
      bullets: [
        '**[ニュース期限]** 24時間以内に主要メディアで同じ材料が2本以上反復されるか確認。反復なしならノイズ扱い。',
        '**[価格反応]** ヘッドライン後の最初の通常取引終値が重要。終値で失速すれば機関投資家はその材料を買っていない。',
      ],
    },
  };
}

export function generateFallbackNewsAnalysis({ ticker, displayName, language, articles }) {
  const numbers = extractNumbers(articles);
  const args = { ticker, displayName, articles, numbers };

  if (language === 'ko') return fallbackKo(args);
  if (language === 'ja') return fallbackJa(args);
  return fallbackEn(args);
}

export function getAnalysisSectionLabels(language) {
  return SECTION_LABELS[language] || SECTION_LABELS.en;
}
