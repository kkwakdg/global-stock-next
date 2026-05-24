import LegalPage from '../components/LegalPage';

export const metadata = {
  title: 'Contact | Global Market Cap',
  description: 'Contact Global Market Cap.',
};

export default async function ContactPage({ searchParams }) {
  const params = await searchParams;
  const lang = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;

  return <LegalPage pageKey="contact" initialLanguage={lang || ''} />;
}
