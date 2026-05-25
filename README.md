This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## v0.4.2 Update Notes

[검색 추천 및 검색 결과 모달 사용성 개선 업데이트]

현재 테이블 기준 검색: 검색 결과는 현재 화면의 테이블에 노출된 종목 데이터 안에서만 찾아 보여주도록 변경했습니다. 외부 검색 결과가 섞여 들어오지 않아 화면에서 확인 가능한 데이터와 검색 결과가 일관되게 맞습니다.

더 똑똑해진 추천 리스트: 유저가 입력한 단어의 순서와 일치율을 함께 확인해, 더 정확히 맞는 종목이 추천 리스트 상단에 노출됩니다.

- 예: `sk` 검색 시, 이름 중간에 `sk`가 포함된 노보 노디스크보다 `SK하이닉스`가 더 위에 노출됩니다.
- 입력어가 종목명, 표시명, 티커의 시작 부분과 일치하면 우선 노출됩니다.
- 일치율이 비슷한 경우에는 단어 오름차순으로 정렬됩니다.

일부 단어 검색 개선: 검색어를 일부만 입력하고 Enter를 눌러도 추천 리스트 최상단에 있는 종목이 검색 결과 모달로 바로 열립니다.

모달 사용성 개선: 검색 결과 모달이 열린 상태에서는 배경 스크롤이 잠기며, 데스크톱에서는 `Esc` 키로 모달을 닫을 수 있습니다.

## v0.4.1 Update Notes

[화면 깔끔함 개선 및 다국어·통화 자동 연동 업데이트]

더 깔끔해진 화면 구성: 마우스를 올릴 때 뜨던 불필요한 노란색 설명 상자(title 속성)를 없애고, 언어 버튼은 '아이콘'으로, 통화 버튼은 현재 선택된 '화폐 기호($, ₩, ¥)'만 보이도록 정리하여 화면이 한결 단순하고 쾌적해졌습니다. 상세 메뉴는 기존처럼 클릭해서 언제든 바꿀 수 있어요.

언어 바꾸면 화폐도 알아서 척척!: 언어를 선택하면 그 나라에 맞는 화폐 단위가 자동으로 연결됩니다.

- 한국어 선택 시 → 원화(KRW)로 자동 변경
- 영어 선택 시 → 달러(USD)로 자동 변경
- 일본어 선택 시 → 엔화(JPY)로 자동 변경

내 입맛에 맞는 정확한 시가총액 표시: 기존에는 한국어 화면을 보면 무조건 원화로만 금액이 나와 답답하셨죠? 이제는 내가 선택한 통화 기준으로 금액이 정확하게 바뀝니다.

보기에 더 편해진 글로벌 금액 단위: 글로벌 유저분들의 눈높이에 맞춰 금액 단위를 읽기 쉽게 다듬었습니다.

- 엔화: 어색했던 '조 엔' 표기를 일본 현지 표현인 **'兆円'**로 매끄럽게 수정했습니다.
- 달러: 조 단위 이상의 큰 금액은 $1.23 T(Trillion), 그 미만은 $850.00 B(Billion)로 구분하여 규모감을 직관적으로 파악할 수 있습니다.

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
