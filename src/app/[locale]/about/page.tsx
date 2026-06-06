import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generateAboutMetadata } from '@/lib/seo';
import AboutPageClient from './AboutPageClient';

export function generateStaticParams() {
  return locales.filter((locale) => locale !== 'en').map((locale) => ({ locale }));
}

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'metadata' });

  return generateAboutMetadata(validLocale, {
    title: t('about.title'),
    description: t('about.description'),
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';

  // Enable static rendering
  setRequestLocale(validLocale);

  return <AboutPageClient locale={validLocale} />;
}
