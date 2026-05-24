import { DEFAULT_LANGUAGE, normalizeLanguage } from './i18n';

export const LEGAL_PAGES = {
  privacy: {
    path: '/privacy',
    navKey: 'privacy',
  },
  terms: {
    path: '/terms',
    navKey: 'terms',
  },
  contact: {
    path: '/contact',
    navKey: 'contact',
  },
  about: {
    path: '/about',
    navKey: 'about',
  },
};

export const LEGAL_COPY = {
  ko: {
    common: {
      appName: 'Global Market Cap',
      home: '홈',
      privacy: '개인정보처리방침',
      terms: '이용약관',
      contact: '문의처',
      about: '소개',
      lastUpdated: '최종 업데이트',
      lastUpdatedDate: '2026년 5월 25일',
      intro: '세계 주요 기업의 시가총액을 통화별로 비교할 수 있는 정보 서비스입니다.',
    },
    privacy: {
      title: '개인정보처리방침',
      description: 'Global Market Cap은 서비스 제공, 보안, 광고 운영을 위해 필요한 최소한의 정보만 처리합니다.',
      sections: [
        {
          heading: '수집하는 정보',
          body: [
            '서비스는 별도의 회원가입을 요구하지 않습니다.',
            '접속 로그, 브라우저 정보, 기기 정보, IP 주소, 쿠키와 같은 기술 정보가 보안, 오류 분석, 서비스 개선을 위해 처리될 수 있습니다.',
            '문의 시 사용자가 제공한 이메일 주소와 문의 내용이 답변 목적으로 처리될 수 있습니다.',
          ],
        },
        {
          heading: '쿠키 및 광고',
          body: [
            '서비스는 언어 설정 저장, 트래픽 분석, 광고 제공을 위해 쿠키 또는 유사 기술을 사용할 수 있습니다.',
            'Google AdSense를 포함한 제3자 광고 사업자는 사용자의 이전 방문 기록 등을 바탕으로 맞춤형 광고를 제공할 수 있습니다.',
            '사용자는 브라우저 설정 또는 Google 광고 설정에서 쿠키 사용과 맞춤형 광고를 관리할 수 있습니다.',
          ],
        },
        {
          heading: '정보 이용 목적',
          body: [
            '서비스 운영, 장애 대응, 보안 유지, 사용자 경험 개선, 문의 응대, 법적 의무 준수를 위해 정보를 이용합니다.',
          ],
        },
        {
          heading: '보관 및 제3자 제공',
          body: [
            '문의 정보는 답변과 분쟁 대응에 필요한 기간 동안 보관 후 삭제합니다.',
            '법령상 요구되거나 서비스 운영에 필요한 위탁, 광고, 분석 도구 사용을 제외하고 개인정보를 판매하지 않습니다.',
          ],
        },
        {
          heading: '사용자의 권리',
          body: [
            '사용자는 본인의 개인정보 열람, 정정, 삭제, 처리 제한을 요청할 수 있습니다.',
            '요청은 문의처 페이지의 이메일로 접수할 수 있습니다.',
          ],
        },
      ],
    },
    terms: {
      title: '이용약관',
      description: 'Global Market Cap 이용 시 적용되는 기본 조건입니다.',
      sections: [
        {
          heading: '서비스 목적',
          body: [
            '본 서비스는 공개 금융 데이터와 환율 정보를 바탕으로 주요 기업의 시가총액 비교 정보를 제공합니다.',
            '제공 정보는 참고용이며 투자 조언, 매수 또는 매도 권유가 아닙니다.',
          ],
        },
        {
          heading: '정보의 정확성',
          body: [
            '데이터는 지연되거나 오류가 있을 수 있으며, 서비스는 정보의 완전성, 정확성, 최신성을 보장하지 않습니다.',
            '투자 등 중요한 의사결정은 공식 공시, 거래소, 금융 전문가를 통해 별도로 확인해야 합니다.',
          ],
        },
        {
          heading: '금지 행위',
          body: [
            '서비스의 정상 운영을 방해하거나 과도한 요청, 무단 수집, 역공학, 보안 우회 행위를 해서는 안 됩니다.',
            '불법적 목적 또는 제3자의 권리를 침해하는 방식으로 서비스를 이용할 수 없습니다.',
          ],
        },
        {
          heading: '책임 제한',
          body: [
            '서비스 이용 또는 정보 의존으로 발생한 손실에 대해 법이 허용하는 범위 내에서 책임을 제한합니다.',
          ],
        },
        {
          heading: '약관 변경',
          body: [
            '운영상 필요하거나 법령 변경이 있는 경우 약관을 수정할 수 있으며, 변경 사항은 이 페이지에 게시됩니다.',
          ],
        },
      ],
    },
    contact: {
      title: '문의처',
      description: '서비스, 개인정보, 광고, 오류 제보와 관련된 문의를 받을 수 있습니다.',
      sections: [
        {
          heading: '이메일',
          body: [
            '문의 이메일: contact@example.com',
            '개인정보 관련 요청, 데이터 오류 제보, 광고 문의를 보낼 수 있습니다.',
          ],
        },
        {
          heading: '문의 시 포함하면 좋은 정보',
          body: [
            '문제가 발생한 페이지 주소, 사용 중인 브라우저, 발생 시각, 화면 캡처 또는 재현 방법을 함께 보내주시면 더 빠르게 확인할 수 있습니다.',
          ],
        },
      ],
    },
    about: {
      title: '소개',
      description: 'Global Market Cap은 글로벌 기업의 규모를 직관적으로 비교하기 위한 대시보드입니다.',
      sections: [
        {
          heading: '서비스가 하는 일',
          body: [
            '주요 상장 기업의 시가총액, 주가, 일일 변동률을 한 화면에서 확인할 수 있습니다.',
            'USD, KRW, JPY 등 선택한 통화 기준으로 시가총액을 비교할 수 있습니다.',
          ],
        },
        {
          heading: '데이터 안내',
          body: [
            '금융 데이터와 환율은 외부 데이터 제공처를 통해 수집되며, 시장 상황이나 제공처 사정에 따라 지연 또는 누락될 수 있습니다.',
            '본 서비스는 학습과 정보 확인을 위한 도구이며 투자 판단의 최종 근거로 사용해서는 안 됩니다.',
          ],
        },
      ],
    },
  },
  en: {
    common: {
      appName: 'Global Market Cap',
      home: 'Home',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact',
      about: 'About',
      lastUpdated: 'Last updated',
      lastUpdatedDate: 'May 25, 2026',
      intro: 'An information service for comparing major global companies by market cap and currency.',
    },
    privacy: {
      title: 'Privacy Policy',
      description: 'Global Market Cap processes only the information needed to operate the service, improve security, and support advertising.',
      sections: [
        {
          heading: 'Information We Collect',
          body: [
            'The service does not require account registration.',
            'Technical information such as access logs, browser details, device data, IP address, and cookies may be processed for security, error analysis, and service improvement.',
            'If you contact us, your email address and message may be processed to respond to your inquiry.',
          ],
        },
        {
          heading: 'Cookies and Advertising',
          body: [
            'The service may use cookies or similar technologies to save language settings, analyze traffic, and serve ads.',
            'Third-party advertising providers, including Google AdSense, may use prior visits and similar signals to provide personalized ads.',
            'You can manage cookies and personalized ads through your browser settings or Google ad settings.',
          ],
        },
        {
          heading: 'How We Use Information',
          body: [
            'Information is used to operate the service, respond to issues, maintain security, improve user experience, answer inquiries, and comply with legal obligations.',
          ],
        },
        {
          heading: 'Retention and Sharing',
          body: [
            'Inquiry information is retained only as long as needed for responses and dispute handling, then deleted.',
            'We do not sell personal information, except where required by law or where service operations, advertising, analytics, or processors are involved.',
          ],
        },
        {
          heading: 'Your Rights',
          body: [
            'You may request access, correction, deletion, or restriction of your personal information.',
            'Requests can be sent to the email address listed on the Contact page.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      description: 'These terms describe the basic conditions for using Global Market Cap.',
      sections: [
        {
          heading: 'Purpose of the Service',
          body: [
            'The service provides market cap comparison information for major companies using public financial data and exchange rates.',
            'The information is for reference only and is not investment advice or a recommendation to buy or sell securities.',
          ],
        },
        {
          heading: 'Accuracy of Information',
          body: [
            'Data may be delayed or contain errors. The service does not guarantee completeness, accuracy, or timeliness.',
            'Important decisions, including investment decisions, should be verified through official filings, exchanges, and qualified financial professionals.',
          ],
        },
        {
          heading: 'Prohibited Conduct',
          body: [
            'You may not disrupt the service, make excessive requests, scrape without authorization, reverse engineer, or bypass security measures.',
            'You may not use the service for unlawful purposes or in a way that infringes third-party rights.',
          ],
        },
        {
          heading: 'Limitation of Liability',
          body: [
            'To the extent permitted by law, liability is limited for losses arising from use of the service or reliance on its information.',
          ],
        },
        {
          heading: 'Changes to Terms',
          body: [
            'The terms may be updated for operational needs or legal changes. Updates will be posted on this page.',
          ],
        },
      ],
    },
    contact: {
      title: 'Contact',
      description: 'Reach us for service questions, privacy requests, advertising, or error reports.',
      sections: [
        {
          heading: 'Email',
          body: [
            'Contact email: contact@example.com',
            'You can send privacy requests, data error reports, and advertising inquiries.',
          ],
        },
        {
          heading: 'Helpful Details',
          body: [
            'Please include the page URL, browser, time of issue, screenshots, or steps to reproduce when reporting a problem.',
          ],
        },
      ],
    },
    about: {
      title: 'About',
      description: 'Global Market Cap is a dashboard for comparing the scale of global companies at a glance.',
      sections: [
        {
          heading: 'What the Service Does',
          body: [
            'You can view market cap, stock price, and daily movement for major listed companies in one place.',
            'You can compare market caps in the selected currency, including USD, KRW, and JPY.',
          ],
        },
        {
          heading: 'Data Notice',
          body: [
            'Financial data and exchange rates are collected from external providers and may be delayed or unavailable depending on market conditions or provider availability.',
            'This service is an informational and learning tool and should not be used as the sole basis for investment decisions.',
          ],
        },
      ],
    },
  },
  ja: {
    common: {
      appName: 'Global Market Cap',
      home: 'ホーム',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      contact: 'お問い合わせ',
      about: '概要',
      lastUpdated: '最終更新日',
      lastUpdatedDate: '2026年5月25日',
      intro: '世界の主要企業の時価総額を通貨別に比較できる情報サービスです。',
    },
    privacy: {
      title: 'プライバシーポリシー',
      description: 'Global Market Capは、サービス提供、セキュリティ、広告運用に必要な最小限の情報を処理します。',
      sections: [
        {
          heading: '収集する情報',
          body: [
            '本サービスはアカウント登録を必要としません。',
            'アクセスログ、ブラウザ情報、端末情報、IPアドレス、Cookieなどの技術情報が、セキュリティ、エラー分析、サービス改善のために処理される場合があります。',
            'お問い合わせ時に提供されたメールアドレスと内容は、回答のために処理される場合があります。',
          ],
        },
        {
          heading: 'Cookieと広告',
          body: [
            '本サービスは、言語設定の保存、トラフィック分析、広告配信のためにCookieまたは類似技術を使用する場合があります。',
            'Google AdSenseを含む第三者広告事業者は、過去の訪問履歴などに基づいてパーソナライズ広告を提供する場合があります。',
            'Cookieとパーソナライズ広告は、ブラウザ設定またはGoogleの広告設定で管理できます。',
          ],
        },
        {
          heading: '利用目的',
          body: [
            'サービス運営、障害対応、セキュリティ維持、ユーザー体験の改善、お問い合わせ対応、法令遵守のために情報を利用します。',
          ],
        },
        {
          heading: '保存と第三者提供',
          body: [
            'お問い合わせ情報は、回答および紛争対応に必要な期間保存した後、削除します。',
            '法令上必要な場合、またはサービス運営、広告、分析、委託先の利用を除き、個人情報を販売しません。',
          ],
        },
        {
          heading: 'ユーザーの権利',
          body: [
            'ユーザーは自身の個人情報の開示、訂正、削除、処理制限を求めることができます。',
            'リクエストはお問い合わせページのメールアドレスに送信できます。',
          ],
        },
      ],
    },
    terms: {
      title: '利用規約',
      description: 'Global Market Capの利用に適用される基本条件です。',
      sections: [
        {
          heading: 'サービスの目的',
          body: [
            '本サービスは、公開金融データと為替レートに基づき、主要企業の時価総額比較情報を提供します。',
            '提供情報は参考用であり、投資助言または売買の推奨ではありません。',
          ],
        },
        {
          heading: '情報の正確性',
          body: [
            'データは遅延したり誤りを含む場合があります。本サービスは完全性、正確性、最新性を保証しません。',
            '投資など重要な判断は、公式開示、取引所、金融専門家を通じて別途確認してください。',
          ],
        },
        {
          heading: '禁止事項',
          body: [
            'サービス運営の妨害、過度なリクエスト、無断収集、リバースエンジニアリング、セキュリティ回避を行ってはなりません。',
            '違法な目的または第三者の権利を侵害する方法でサービスを利用できません。',
          ],
        },
        {
          heading: '責任の制限',
          body: [
            'サービス利用または情報への依存により発生した損失について、法令で認められる範囲で責任を制限します。',
          ],
        },
        {
          heading: '規約の変更',
          body: [
            '運営上の必要または法令変更がある場合、規約を更新することがあります。変更内容はこのページに掲載されます。',
          ],
        },
      ],
    },
    contact: {
      title: 'お問い合わせ',
      description: 'サービス、個人情報、広告、エラー報告に関するお問い合わせを受け付けます。',
      sections: [
        {
          heading: 'メール',
          body: [
            'お問い合わせメール: contact@example.com',
            '個人情報に関するリクエスト、データ誤りの報告、広告のお問い合わせを送信できます。',
          ],
        },
        {
          heading: '含めるとよい情報',
          body: [
            '問題が発生したページURL、利用ブラウザ、発生時刻、スクリーンショット、再現手順を含めると確認がスムーズです。',
          ],
        },
      ],
    },
    about: {
      title: '概要',
      description: 'Global Market Capは、グローバル企業の規模を直感的に比較するためのダッシュボードです。',
      sections: [
        {
          heading: 'サービス内容',
          body: [
            '主要上場企業の時価総額、株価、日次変動率を一画面で確認できます。',
            'USD、KRW、JPYなど、選択した通貨で時価総額を比較できます。',
          ],
        },
        {
          heading: 'データについて',
          body: [
            '金融データと為替レートは外部データ提供元から取得され、市場状況や提供元の都合により遅延または欠落する場合があります。',
            '本サービスは学習と情報確認のためのツールであり、投資判断の唯一の根拠として使用しないでください。',
          ],
        },
      ],
    },
  },
};

export function getLegalCopy(language) {
  return LEGAL_COPY[normalizeLanguage(language)] || LEGAL_COPY[DEFAULT_LANGUAGE];
}

export function getLegalPageCopy(pageKey, language) {
  const copy = getLegalCopy(language);
  return {
    common: copy.common,
    page: copy[pageKey],
  };
}
