This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## v0.4 Update Notes

Global Market Cap v0.4는 사용자가 더 빠르고 자연스럽게 세계 주요 기업 정보를 확인할 수 있도록 다듬은 업데이트입니다.

- 주식 목록에서 원하는 기업 행을 클릭하면 상세 정보 모달이 바로 열립니다. 별도로 검색하지 않아도 현재가, 변동률, 선택한 통화 기준 시가총액을 빠르게 확인할 수 있습니다.
- 모바일과 데스크톱 화면의 표 사용 경험을 더 일관되게 정리했습니다. 화면 크기와 관계없이 순위, 기업명, 현재가, 시가총액 정보를 같은 흐름으로 살펴볼 수 있습니다.
- 검색과 목록 조회 과정이 더 안정적으로 동작하도록 내부 데이터 처리 방식을 정리했습니다. 사용자는 기존과 같은 화면에서 더 매끄러운 응답을 기대할 수 있습니다.
- 환율과 시가총액 표시 방식의 예외 처리를 보강해, 데이터가 부족한 상황에서도 안내가 더 자연스럽게 표시됩니다.
- 화면 디자인과 주요 사용 흐름은 그대로 유지하면서 내부 구조를 가볍게 정돈했습니다. 앞으로 새로운 기능을 더 빠르고 안정적으로 추가할 수 있는 기반을 마련했습니다.

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
