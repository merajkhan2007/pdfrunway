import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import WorkflowPageClient from './WorkflowPageClient';

export function generateStaticParams() {
  return locales.filter((locale) => locale !== 'en').map((locale) => ({ locale }));
}

interface WorkflowPageProps {
  params: Promise<{ locale: string }>;
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';

  // Enable static rendering
  setRequestLocale(validLocale);

  return <WorkflowPageClient locale={validLocale} />;
}
