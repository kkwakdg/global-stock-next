import LegalPage from '../components/LegalPage';

export const metadata = {
  title: 'About | Global Market Cap',
  description: 'About Global Market Cap.',
};

export default async function AboutPage({ searchParams }) {
  const params = await searchParams;
  const lang = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;

  return <LegalPage pageKey="about" initialLanguage={lang || ''} />;
}
