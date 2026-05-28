function InlineMarkdown({ text }) {
  const parts = String(text || '').split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function AnalysisSection({ isDark, title, status, bullets }) {
  if (!Array.isArray(bullets) || bullets.length === 0) return null;

  return (
    <div className={`${isDark ? 'bg-white/[0.05]' : 'bg-white/75'} rounded-md px-3 py-3`}>
      <h5 className={`${isDark ? 'text-sky-200' : 'text-sky-700'} text-xs font-bold leading-5`}>
        [{title}{status ? `: ${status}` : ''}]
      </h5>
      <ul className="mt-2 space-y-2">
        {bullets.map((bullet) => (
          <li key={bullet} className={`${isDark ? 'text-stone-300' : 'text-neutral-700'} text-xs leading-5`}>
            <span className={`${isDark ? 'text-stone-500' : 'text-neutral-400'} mr-1`}>*</span>
            <InlineMarkdown text={bullet} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function StockNewsAnalysis({ isDark, stockNews, fallbackText }) {
  const analysis = stockNews?.analysis;
  const labels = stockNews?.sectionLabels || {};

  if (!analysis) {
    return (
      <p className={`${isDark ? 'text-stone-300' : 'text-neutral-700'} mt-3 text-sm leading-6`}>
        {fallbackText}
      </p>
    );
  }

  return (
    <div className="mt-4 grid gap-2">
      <AnalysisSection
        isDark={isDark}
        title={labels.market_impact || 'Market Impact'}
        status={analysis.market_impact?.status}
        bullets={analysis.market_impact?.bullets}
      />
      <AnalysisSection
        isDark={isDark}
        title={labels.hidden_agenda || 'Hidden Agenda'}
        bullets={analysis.hidden_agenda?.bullets}
      />
      <AnalysisSection
        isDark={isDark}
        title={labels.triggers || 'Triggers'}
        bullets={analysis.triggers?.bullets}
      />
      <AnalysisSection
        isDark={isDark}
        title={labels.risks || 'Risks'}
        bullets={analysis.risks?.bullets}
      />
      <AnalysisSection
        isDark={isDark}
        title={labels.actionable_checklist || 'Actionable Checklist'}
        bullets={analysis.actionable_checklist?.bullets}
      />
    </div>
  );
}

export default function SearchModal({
  t,
  isDark,
  modalData,
  stockNews,
  stockNewsLoading,
  stockNewsError,
  onClose,
}) {
  if (!modalData) return null;

  return (
    <div
      className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      role="presentation"
    >
      <div
        className={`${isDark ? 'border-white/10 bg-neutral-950 text-stone-100 shadow-black/40' : 'border-black/5 bg-white text-neutral-950 shadow-neutral-900/15'} max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-lg border p-6 shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-5 mb-6">
          <div>
            <span className={`${isDark ? 'bg-white/10 text-stone-300 ring-white/10' : 'bg-neutral-950/[0.06] text-neutral-600 ring-black/5'} apple-radius px-3 py-1 text-[11px] font-semibold uppercase ring-1`}>
              {t.resultLabel}
            </span>
            <h3 className="mt-3 text-2xl font-semibold leading-tight">{modalData.name}</h3>
            <p className={`${isDark ? 'text-stone-400' : 'text-neutral-500'} apple-radius mt-2 w-fit text-sm font-mono`}>
              {modalData.ticker}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`${isDark ? 'bg-white/10 text-stone-300 hover:bg-white/15' : 'bg-neutral-950/[0.06] text-neutral-600 hover:bg-neutral-950/[0.1]'} apple-radius grid h-9 w-9 shrink-0 place-items-center text-xl font-medium transition`}
            aria-label={t.close}
          >
            &times;
          </button>
        </div>

        <div className={`${isDark ? 'bg-white/[0.06]' : 'bg-neutral-950/[0.035]'} grid grid-cols-2 gap-4 rounded-lg p-4`}>
          <div>
            <p className={`${isDark ? 'text-stone-500' : 'text-neutral-500'} text-xs font-medium`}>{t.price}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{modalData.price}</p>
          </div>
          <div>
            <p className={`${isDark ? 'text-stone-500' : 'text-neutral-500'} text-xs font-medium`}>{t.dayChange}</p>
            <p className={`mt-1 text-lg font-semibold tabular-nums ${modalData.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {modalData.chg}
            </p>
          </div>
          <div className={`${isDark ? 'border-white/10' : 'border-black/10'} col-span-2 border-t pt-4 mt-1`}>
            <p className={`${isDark ? 'text-stone-500' : 'text-neutral-500'} text-xs font-medium`}>{t.modalMarketCap}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{modalData.marketCap}</p>
          </div>
        </div>

        <p className={`${isDark ? 'text-stone-500' : 'text-neutral-500'} mt-5 text-center text-[11px] leading-normal`}>
          {t.exchangeRateNote}
        </p>

        <section className={`${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-black/10 bg-neutral-950/[0.025]'} mt-5 rounded-lg border p-4`}>
          {stockNewsLoading ? (
            <div className="flex items-center gap-3">
              <span className={`${isDark ? 'border-stone-500 border-t-stone-100' : 'border-neutral-300 border-t-neutral-950'} h-4 w-4 shrink-0 animate-spin rounded-full border-2`} />
              <p className={`${isDark ? 'text-stone-300' : 'text-neutral-700'} text-sm font-medium`}>
                {t.stockNewsLoading}
              </p>
            </div>
          ) : stockNewsError ? (
            <p className={`${isDark ? 'text-rose-300' : 'text-rose-600'} text-sm leading-6`}>
              {stockNewsError}
            </p>
          ) : stockNews ? (
            <div>
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold">{stockNews.title}</h4>
                <span className={`${isDark ? 'bg-sky-400/15 text-sky-200 ring-sky-300/15' : 'bg-sky-500/10 text-sky-700 ring-sky-500/15'} apple-radius px-2 py-1 text-[10px] font-bold uppercase ring-1`}>
                  AI
                </span>
              </div>
              <StockNewsAnalysis
                isDark={isDark}
                stockNews={stockNews}
                fallbackText={stockNews.summary || t.stockNewsEmpty}
              />

              {stockNews.articles?.length > 0 && (
                <div className={`${isDark ? 'border-white/10' : 'border-black/10'} mt-4 border-t pt-4`}>
                  <p className={`${isDark ? 'text-stone-500' : 'text-neutral-500'} text-xs font-semibold`}>
                    {t.stockNewsSources}
                  </p>
                  <div className="mt-3 space-y-3">
                    {stockNews.articles.slice(0, 5).map((article) => (
                      <a
                        key={article.id}
                        href={article.link}
                        target="_blank"
                        rel="noreferrer"
                        className={`${isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-neutral-950/[0.04]'} -mx-2 block rounded-md px-2 py-1.5 transition`}
                      >
                        <p className="line-clamp-2 text-sm font-medium leading-5">
                          {article.title}
                        </p>
                        <p className={`${isDark ? 'text-stone-500' : 'text-neutral-500'} mt-1 text-[11px] leading-4`}>
                          {article.sourceLine}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className={`${isDark ? 'text-stone-400' : 'text-neutral-600'} text-sm`}>
              {t.stockNewsEmpty}
            </p>
          )}
        </section>

        <button
          type="button"
          onClick={onClose}
          className={`${isDark ? 'bg-stone-100 hover:bg-white text-neutral-950' : 'bg-neutral-950 hover:bg-neutral-800 text-white'} apple-radius mt-5 w-full py-3 text-sm font-semibold transition`}
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}
