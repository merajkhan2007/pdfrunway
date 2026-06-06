import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generateAboutMetadata } from '@/lib/seo';
import AboutPageClient from './AboutPageClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ localeOrTool: locale }));
}

interface AboutPageProps {
  params: Promise<{ localeOrTool: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { localeOrTool } = await params;
  const validLocale = locales.includes(localeOrTool as Locale) ? (localeOrTool as Locale) : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'metadata' });

  return generateAboutMetadata(validLocale, {
    title: t('about.title'),
    description: t('about.description'),
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { localeOrTool } = await params;
  const validLocale = locales.includes(localeOrTool as Locale) ? (localeOrTool as Locale) : 'en';

  // Enable static rendering
  setRequestLocale(validLocale);

  return <AboutPageClient locale={validLocale} />;
}
