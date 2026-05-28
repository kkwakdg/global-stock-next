import { getStockDetail } from "../lib/stockDetailData";

interface StockDetailContentProps {
  stockId: string;
  isModal: boolean;
}

interface NewsArticle {
  id: string;
  title: string;
  link: string;
  sourceLine: string;
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = String(text || "").split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function AnalysisSection({
  title,
  status,
  bullets,
  tone,
}: {
  title: string;
  status?: string;
  bullets?: string[];
  tone: string;
}) {
  if (!bullets?.length) return null;

  return (
    <section className="space-y-3">
      <h2 className={`text-xl font-semibold ${tone}`}>
        {title}
        {status ? <span className="text-neutral-500">: {status}</span> : null}
      </h2>
      <ul className="list-disc space-y-2 pl-5 text-neutral-700">
        {bullets.map((bullet) => (
          <li key={bullet} className="leading-7">
            <InlineMarkdown text={bullet} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function StockDetailContent({
  stockId,
  isModal,
}: StockDetailContentProps) {
  const detail = await getStockDetail(stockId, "ko");

  if (!detail) {
    const ticker = stockId.toUpperCase();

    return (
      <article className="space-y-4">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold text-neutral-950">
            {ticker} 주식 상세 리서치 보고서
          </h1>
          <p className="mt-2 text-neutral-600">
            현재 해당 종목 데이터를 불러오지 못했습니다. 티커를 확인한 뒤 다시 시도해 주세요.
          </p>
        </header>
      </article>
    );
  }

  const { stock, displayName, news } = detail;
  const ticker = stock.ticker.toUpperCase();
  const labels = news.sectionLabels;
  const analysis = news.analysis;
  const articles = news.articles as NewsArticle[];

  return (
    <article className="space-y-6">
      <header className="border-b pb-4">
        <p className="text-sm font-semibold uppercase tracking-normal text-neutral-500">
          {ticker}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-neutral-950">
          {displayName} 주식 상세 리서치 보고서
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          야후 파이낸스 최신 데이터 연동 · 현재가 {stock.price} · 시가총액 {stock.marketCap}
        </p>
      </header>

      {!isModal && (
        <aside className="flex h-24 w-full items-center justify-center border bg-neutral-50 text-xs text-neutral-400">
          상단 구글 애드센스 광고 영역
        </aside>
      )}

      <section className="grid gap-4 rounded-lg bg-neutral-950/[0.035] p-4 sm:grid-cols-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-500">현재 주가</h2>
          <p className="mt-1 text-xl font-bold tabular-nums text-neutral-950">{stock.price}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-500">하루 변동률</h2>
          <p className={`mt-1 text-xl font-bold tabular-nums ${stock.isPositive ? "text-emerald-600" : "text-rose-600"}`}>
            {stock.chg}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-500">시가총액</h2>
          <p className="mt-1 text-xl font-bold tabular-nums text-neutral-950">{stock.marketCap}</p>
        </div>
      </section>

      <AnalysisSection
        title={labels.market_impact}
        status={analysis.market_impact?.status}
        bullets={analysis.market_impact?.bullets}
        tone="text-rose-600"
      />

      <AnalysisSection
        title={labels.hidden_agenda}
        bullets={analysis.hidden_agenda?.bullets}
        tone="text-neutral-950"
      />

      {!isModal && (
        <aside className="my-4 flex h-24 w-full items-center justify-center border bg-neutral-50 text-xs text-neutral-400">
          콘텐츠 중간 광고 영역
        </aside>
      )}

      <AnalysisSection
        title={labels.triggers}
        bullets={analysis.triggers?.bullets}
        tone="text-blue-600"
      />

      <AnalysisSection
        title={labels.risks}
        bullets={analysis.risks?.bullets}
        tone="text-amber-600"
      />

      <footer className="border-t pt-4">
        <AnalysisSection
          title={labels.actionable_checklist}
          bullets={analysis.actionable_checklist?.bullets}
          tone="text-emerald-600"
        />
      </footer>

      {articles.length > 0 && (
        <section className="border-t pt-4">
          <h2 className="text-xl font-semibold text-neutral-950">주요 기사</h2>
          <div className="mt-3 grid gap-3">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-black/10 p-3 transition hover:bg-neutral-950/[0.03]"
              >
                <h3 className="text-sm font-semibold leading-6 text-neutral-950">
                  {article.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">{article.sourceLine}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
