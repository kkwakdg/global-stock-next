export const LANGUAGES = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
};

export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_STORAGE_KEY = 'global-market-cap-language';

export function isSupportedLanguage(language) {
  return Boolean(LANGUAGES[language]);
}

export function normalizeLanguage(language) {
  return isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;
}

export function getStoredLanguagePreference() {
  if (typeof window === 'undefined') return '';

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(storedLanguage) ? storedLanguage : '';
  } catch {
    return '';
  }
}

export function saveLanguagePreference(language) {
  if (typeof window === 'undefined' || !isSupportedLanguage(language)) return;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    window.dispatchEvent(new CustomEvent('language-preference-change'));
  } catch {
  }
}

export function detectBrowserLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const storedLanguage = getStoredLanguagePreference();
  if (storedLanguage) return storedLanguage;

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  const localeText = browserLanguages.filter(Boolean).join(' ').toLowerCase();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (localeText.includes('ko') || timeZone === 'Asia/Seoul') return 'ko';
  if (localeText.includes('ja') || timeZone === 'Asia/Tokyo') return 'ja';

  return DEFAULT_LANGUAGE;
}

export function subscribeToLanguagePreference(onStoreChange) {
  if (typeof window === 'undefined') return () => {};

  const notify = () => onStoreChange();
  window.addEventListener('storage', notify);
  window.addEventListener('language-preference-change', notify);

  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener('language-preference-change', notify);
  };
}

export const TRANSLATIONS = {
  ko: {
    appName: 'GlobalMarketCap 플랫폼',
    viewTitle: 'Global Market Cap',
    viewSubtitle: '세계 주요 기업의 시가총액을 통화별로 비교합니다.',
    searchPlaceholder: '예) 엔비디아, 애플, TSLA',
    search: '검색',
    searching: '조회중..',
    themeLight: '화이트모드',
    themeDark: '다크모드',
    language: '언어',
    currency: '표시 통화',
    rank: '순위',
    company: '기업명',
    marketCap: '시가총액',
    dayChange: '하루 변동률',
    loading: '글로벌 금융 데이터 수집 및 정렬 중...',
    empty: '실시간 금융 데이터를 불러오는 데 실패했습니다. 잠시 후 새로고침 해주세요.',
    timeout: '요청 시간이 초과되었습니다. 네트워크 상태를 확인한 뒤 새로고침 해주세요.',
    searchTimeout: '검색 요청 시간이 초과되었습니다.',
    searchError: '검색 중 에러가 발생했습니다.',
    resultLabel: '실시간 검색결과',
    price: '현재 주가',
    modalMarketCap: '선택 통화 기준 시가총액',
    exchangeRateNote: '현재 주가와 시가총액은 실시간 환율을 기준으로 선택 통화로 환산됩니다.',
    close: '닫기',
    noData: '데이터 없음',
  },
  en: {
    appName: 'GlobalMarketCap Platform',
    viewTitle: 'Global Market Cap',
    viewSubtitle: 'Compare the world’s leading companies by market cap and currency.',
    searchPlaceholder: 'Ex) Apple, NVIDIA, TSLA',
    search: 'Search',
    searching: 'Searching..',
    themeLight: 'Light mode',
    themeDark: 'Dark mode',
    language: 'Language',
    currency: 'Display currency',
    rank: 'Rank',
    company: 'Company',
    marketCap: 'Market cap',
    dayChange: 'Day change',
    loading: 'Collecting and sorting global market data...',
    empty: 'Failed to load live market data. Please refresh again later.',
    timeout: 'The request timed out. Please check your network and refresh.',
    searchTimeout: 'The search request timed out.',
    searchError: 'An error occurred while searching.',
    resultLabel: 'Live Search Result',
    price: 'Current price',
    modalMarketCap: 'Market cap in selected currency',
    exchangeRateNote: 'Current prices and market caps are converted to the selected currency with live exchange rates.',
    close: 'Close',
    noData: 'No data',
  },
  ja: {
    appName: 'GlobalMarketCap プラットフォーム',
    viewTitle: 'Global Market Cap',
    viewSubtitle: '世界の主要企業の時価総額を通貨別に比較できます。',
    searchPlaceholder: '例) Apple, NVIDIA, TSLA',
    search: '検索',
    searching: '検索中..',
    themeLight: 'ライトモード',
    themeDark: 'ダークモード',
    language: '言語',
    currency: '表示通貨',
    rank: '順位',
    company: '企業名',
    marketCap: '時価総額',
    dayChange: '1日変動率',
    loading: 'グローバル金融データを取得して並べ替えています...',
    empty: 'リアルタイム金融データの読み込みに失敗しました。しばらくしてから更新してください。',
    timeout: 'リクエストがタイムアウトしました。ネットワークを確認して更新してください。',
    searchTimeout: '検索リクエストがタイムアウトしました。',
    searchError: '検索中にエラーが発生しました。',
    resultLabel: 'リアルタイム検索結果',
    price: '現在価格',
    modalMarketCap: '選択通貨での時価総額',
    exchangeRateNote: '現在価格と時価総額はリアルタイム為替レートで選択通貨に換算されます。',
    close: '閉じる',
    noData: 'データなし',
  },
};
