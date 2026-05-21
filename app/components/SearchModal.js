export default function SearchModal({ t, isDark, modalData, onClose }) {
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
        className={`${isDark ? 'border-white/10 bg-neutral-950 text-stone-100 shadow-black/40' : 'border-black/5 bg-white text-neutral-950 shadow-neutral-900/15'} max-w-md w-full rounded-lg border p-6 shadow-xl`}
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
