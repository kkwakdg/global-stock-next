export const KOREAN_COMPANY_NAMES = {
  NVDA: '엔비디아',
  AAPL: '애플',
  MSFT: '마이크로소프트',
  GOOGL: '알파벳',
  GOOG: '알파벳',
  AMZN: '아마존',
  META: '메타',
  TSM: 'TSMC',
  TSLA: '테슬라',
  AVGO: '브로드컴',
  NVO: '노보 노디스크',
  ASML: 'ASML',
  WMT: '월마트',
  UNH: '유나이티드헬스',
  LLY: '일라이 릴리',
  XOM: '엑슨모빌',
  V: '비자',
  ORCL: '오라클',
  MA: '마스터카드',
  JPM: 'JP모건 체이스',
  COST: '코스트코',
  HD: '홈디포',
  PG: '프록터앤드갬블',
  NFLX: '넷플릭스',
  JNJ: '존슨앤드존슨',
  BAC: '뱅크오브아메리카',
  CRM: '세일즈포스',
  PEP: '펩시코',
  KO: '코카콜라',
  ADBE: '어도비',
  CVX: '셰브론',
  TM: '토요타',
  TMUS: 'T-모바일',
  QCOM: '퀄컴',
  SHEL: '셸',
  ACN: '액센츄어',
  LIN: '린데',
  PDD: '핀둬둬',
  TTE: '토탈에너지스',
  BABA: '알리바바',
  NKE: '나이키',
  ABBV: '앱비',
  'BRK-B': '버크셔 해서웨이',
  MRK: '머크',
  DIS: '디즈니',
  ABT: '애보트',
  MS: '모건스탠리',
  WFC: '웰스파고',
  SAP: 'SAP',
  PLTR: '팔란티어',
  AMD: 'AMD',
  NOW: '서비스나우',
  BX: '블랙스톤',
  TMO: '써모 피셔 사이언티픽',
  ISRG: '인튜이티브 서지컬',
  AZN: '아스트라제네카',
  HSBC: 'HSBC',
  RY: '로열 뱅크 오브 캐나다',
  UBER: '우버',
  RTX: 'RTX',
  T: 'AT&T',
  SCHW: '찰스 슈왑',
  PGR: '프로그레시브',
  NEE: '넥스트에라 에너지',
  BSX: '보스턴 사이언티픽',
  DHR: '다나허',
  SHOP: '쇼피파이',
  ETN: '이튼',
  ARM: 'Arm',
  UL: '유니레버',
  BHP: 'BHP',
  MUFG: '미쓰비시 UFJ',
  HDB: 'HDFC 은행',
  SPOT: '스포티파이',
  LOW: '로우스',
  PFE: '화이자',
  MDT: '메드트로닉',
  GILD: '길리어드',
  ADP: 'ADP',
  AMAT: '어플라이드 머티어리얼즈',
  ANET: '아리스타 네트웍스',
  MELI: '메르카도리브레',
  SONY: '소니',
  NVS: '노바티스',
  RHHBY: '로슈',
  NSRGY: '네슬레',
  TCEHY: '텐센트',
  LVMUY: 'LVMH',
  IDCBY: '중국공상은행',
  CMWAY: '차이나모바일',
  SNY: '사노피',
  RIO: '리오 틴토',
  BP: 'BP',
  VZ: '버라이즌',
  CSCO: '시스코',
  INTC: '인텔',
  CMG: '치폴레',
  TXN: '텍사스 인스트루먼트',
  AMGN: '암젠',
  COP: '코노코필립스',
  MCD: '맥도날드',
  PM: '필립모리스',
  INTU: '인튜이트',
  IBM: 'IBM',
  SPGI: 'S&P 글로벌',
  GS: '골드만삭스',
  HON: '허니웰',
  AXP: '아메리칸 익스프레스',
  BKNG: '부킹홀딩스',
  GE: 'GE 에어로스페이스',
  LMT: '록히드 마틴',
  SYK: '스트라이커',
  BLK: '블랙록',
  MDLZ: '몬델리즈',
  TJX: 'TJX',
  ADI: '아날로그 디바이시스',
  C: '씨티그룹',
  CAT: '캐터필러',
  BA: '보잉',
  DE: '디어',
  UNP: '유니언 퍼시픽',
  LRCX: '램리서치',
  VRTX: '버텍스 파마슈티컬스',
  REGN: '리제네론',
  PANW: '팔로알토 네트웍스',
  SNPS: '시놉시스',
  '005930.KS': '삼성전자',
  '000660.KS': 'SK하이닉스',
  '207940.KS': '삼성바이오로직스',
  '005380.KS': '현대차',
  '000270.KS': '기아',
  '051910.KS': 'LG화학',
  '005490.KS': '포스코홀딩스',
  '035420.KS': '네이버',
  '035720.KS': '카카오',
  '068270.KS': '셀트리온',
  '028260.KS': '삼성물산',
  '105560.KS': 'KB금융',
};

function normalizeSearchText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[.,]/g, '')
    .replace(/\s+/g, ' ');
}

export function resolveCompanyTicker(query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return '';

  const exactMatch = Object.entries(KOREAN_COMPANY_NAMES).find(([ticker, name]) =>
    normalizeSearchText(ticker) === normalizedQuery ||
    normalizeSearchText(name) === normalizedQuery
  );

  return exactMatch?.[0] || '';
}

export function companyMatchesQuery(stock, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!stock || normalizedQuery.length < 1) return false;

  return [
    stock.ticker,
    stock.name,
    KOREAN_COMPANY_NAMES[stock.ticker],
  ].some((value) => normalizeSearchText(value).includes(normalizedQuery));
}

export function getCompanyDisplayName(stock, language) {
  if (!stock) return '';
  if (language !== 'ko') return stock.name;

  return KOREAN_COMPANY_NAMES[stock.ticker] || stock.name;
}
