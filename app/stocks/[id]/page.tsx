import type { Metadata } from "next";
import StockDetailContent from "../../components/StockDetailContent";
import { getStockDetail } from "../../lib/stockDetailData";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = await getStockDetail(id, "ko");
  const ticker = detail?.stock?.ticker?.toUpperCase() || id.toUpperCase();
  const name = detail?.displayName || ticker;

  return {
    title: `${name}(${ticker}) 실시간 시가총액, 최신 뉴스 및 AI 투자 분석 리포트`,
    description: `야후 파이낸스 데이터 기반 ${name} ${ticker}의 실시간 주가, 시가총액, 상승 촉매, 치명적 리스크, 투자 체크포인트를 분석합니다.`,
    openGraph: {
      title: `${name} 주가 및 AI 심층 분석 요약`,
      description: `${ticker}의 시장 내러티브와 마켓 임팩트 진단`,
      type: "article",
    },
  };
}

export default async function StockDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <StockDetailContent stockId={id} isModal={false} />
    </div>
  );
}
