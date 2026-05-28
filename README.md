This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## v0.4.5 Update Notes

[주식 상세 페이지 SEO 및 인터셉팅 라우트 업데이트]

주식 상세 URL 구조 추가: 종목별 상세 화면을 `/stocks/[id]` 경로로 분리해 외부 링크, 새로고침, 검색엔진 접근 시 고유 URL을 가진 독립 페이지로 렌더링되도록 개선했습니다.

인터셉팅 모달 전환 적용: `/stocks` 목록에서 종목을 선택하면 Next.js Intercepting Routes와 Parallel Routes 기반 모달이 열리고, URL은 `/stocks/[id]`로 갱신되도록 변경했습니다.

검색엔진 최적화 페이지 추가: 직접 접근한 상세 페이지에는 종목별 `title`, `description`, Open Graph 메타데이터를 동적으로 생성해 Googlebot과 AdSense 평가에 필요한 텍스트 페이지 구조를 강화했습니다.

시맨틱 상세 콘텐츠 개선: 주식 상세 분석 UI를 `article`, `header`, `section`, `h1`, `h2`, `h3` 중심 구조로 정리해 검색엔진이 마켓 임팩트, 상승 촉매, 리스크, 체크포인트를 명확히 해석할 수 있도록 개선했습니다.

광고 배치 영역 분리: 전용 상세 페이지에는 상단 및 본문 중간 광고 영역을 노출하고, 인터셉팅 모달에서는 광고 영역을 숨겨 사용자 경험과 AdSense 지면 구성을 분리했습니다.

상세 데이터 렌더링 공통화: 야후 파이낸스 기반 종목 시세, 시가총액, 뉴스 분석 데이터를 공통 상세 컴포넌트에서 렌더링하도록 정리해 모달과 SEO 페이지가 동일한 분석 콘텐츠를 공유하도록 변경했습니다.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
