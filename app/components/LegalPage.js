"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Footer from './Footer';
import {
  detectBrowserLanguage,
  getStoredLanguagePreference,
  isSupportedLanguage,
  normalizeLanguage,
  saveLanguagePreference,
  subscribeToLanguagePreference,
} from '../lib/i18n';
import { getLegalPageCopy } from '../lib/legalContent';

function getCurrentLanguage(initialLanguage) {
  return normalizeLanguage(
    initialLanguage || getStoredLanguagePreference() || detectBrowserLanguage()
  );
}

export default function LegalPage({ pageKey, initialLanguage = 'en' }) {
  const [language, setLanguage] = useState(() => getCurrentLanguage(initialLanguage));
  const { common, page } = useMemo(
    () => getLegalPageCopy(pageKey, language),
    [language, pageKey]
  );

  useEffect(() => {
    if (isSupportedLanguage(initialLanguage)) {
      saveLanguagePreference(initialLanguage);
    }

    const updateLanguage = () => setLanguage(getCurrentLanguage(initialLanguage));
    updateLanguage();
    return subscribeToLanguagePreference(updateLanguage);
  }, [initialLanguage]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-neutral-950">
      <header className="border-b border-black/10 bg-white/[0.88]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <Link href={`/?lang=${language}`} className="text-sm font-semibold">
            {common.appName}
          </Link>
          <Link
            href={`/?lang=${language}`}
            className="rounded-full border border-black/10 px-4 py-2 text-sm text-neutral-700 transition hover:border-black/20 hover:text-neutral-950"
          >
            {common.home}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
        <p className="text-sm font-medium text-neutral-500">
          {common.lastUpdated}: {common.lastUpdatedDate}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
          {page.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
          {page.description}
        </p>

        <div className="mt-10 space-y-8">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold">{section.heading}</h2>
              <div className="mt-3 space-y-3 text-base leading-7 text-neutral-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
