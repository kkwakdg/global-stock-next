import LegalPage from '../components/LegalPage';

export const metadata = {
  title: 'Terms of Service | Global Market Cap',
  description: 'Terms of Service for Global Market Cap.',
};

export default async function TermsPage({ searchParams }) {
  const params = await searchParams;
  const lang = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;

  return <LegalPage pageKey="terms" initialLanguage={lang || ''} />;
}
