import LegalPage from '../components/LegalPage';

export const metadata = {
  title: 'Privacy Policy | Global Market Cap',
  description: 'Privacy Policy for Global Market Cap.',
};

export default async function PrivacyPage({ searchParams }) {
  const params = await searchParams;
  const lang = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;

  return <LegalPage pageKey="privacy" initialLanguage={lang || ''} />;
}
