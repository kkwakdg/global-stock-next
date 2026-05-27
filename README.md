This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## v0.4.4 Update Notes

[현재 주가 선택 통화 환산 및 표시 개선 업데이트]

선택 통화 기준 현재 주가 표시: 달러(USD), 원화(KRW), 엔화(JPY) 중 어떤 통화를 선택하더라도 모든 현재 주가가 실시간 환율을 기준으로 선택 통화에 맞춰 환산되어 표시되도록 개선했습니다.

검색 결과 모달 가격 표시 개선: 테이블뿐 아니라 검색 결과 모달의 현재 주가도 선택 통화 기준으로 동일하게 환산되어 보이도록 변경했습니다.

가격 정렬 기준 개선: 현재 주가 컬럼을 정렬할 때 화면에 표시되는 환산 가격 기준으로 정렬되도록 맞췄습니다.

한국어 화면 통화 기호 표시 개선: 한국어 선택 상태에서 달러나 엔화를 선택했을 때 현재 주가 앞에 `US`, `JP`가 붙지 않고 `$`, `¥` 기호만 표시되도록 정리했습니다.

표시 문구 개선: 통화 선택 메뉴와 안내 문구를 현재 주가와 시가총액 모두 선택 통화 기준으로 환산된다는 의미에 맞게 다듬었습니다.

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
