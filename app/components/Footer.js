import Link from 'next/link';
import { LEGAL_PAGES, getLegalCopy } from '../lib/legalContent';

export default function Footer({ isDark = false, language = 'en' }) {
  const { common } = getLegalCopy(language);
  const linkClass = isDark
    ? 'text-stone-300 hover:text-white'
    : 'text-neutral-600 hover:text-neutral-950';
  const borderClass = isDark ? 'border-white/10' : 'border-black/10';
  const mutedClass = isDark ? 'text-stone-500' : 'text-neutral-500';

  return (
    <footer className={`border-t ${borderClass}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm sm:px-6 lg:px-8">
        <div>
          <p className="font-semibold">{common.appName}</p>
          <p className={`mt-2 max-w-2xl leading-6 ${mutedClass}`}>{common.intro}</p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          {Object.entries(LEGAL_PAGES).map(([pageKey, page]) => (
            <Link
              key={pageKey}
              href={`${page.path}?lang=${language}`}
              className={`transition ${linkClass}`}
            >
              {common[page.navKey]}
            </Link>
          ))}
        </nav>

        <p className={mutedClass}>
          (c) 2026 {common.appName}
        </p>
      </div>
    </footer>
  );
}
