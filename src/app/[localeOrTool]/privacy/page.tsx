import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generatePrivacyMetadata } from '@/lib/seo';
import PrivacyPageClient from './PrivacyPageClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ localeOrTool: locale }));
}

interface PrivacyPageProps {
  params: Promise<{ localeOrTool: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { localeOrTool } = await params;
  const validLocale = locales.includes(localeOrTool as Locale) ? (localeOrTool as Locale) : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'metadata' });

  return generatePrivacyMetadata(validLocale, {
    title: t('privacy.title'),
    description: t('privacy.description'),
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { localeOrTool } = await params;
  const validLocale = locales.includes(localeOrTool as Locale) ? (localeOrTool as Locale) : 'en';

  // Enable static rendering
  setRequestLocale(validLocale);

  return <PrivacyPageClient locale={validLocale} />;
}
