import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generateFaqMetadata } from '@/lib/seo';
import FAQPageClient from './FAQPageClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ localeOrTool: locale }));
}

interface FAQPageProps {
  params: Promise<{ localeOrTool: string }>;
}

export async function generateMetadata({
  params,
}: FAQPageProps): Promise<Metadata> {
  const { localeOrTool } = await params;
  const validLocale = locales.includes(localeOrTool as Locale) ? (localeOrTool as Locale) : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'metadata' });

  return generateFaqMetadata(validLocale, {
    title: t('faq.title'),
    description: t('faq.description'),
  });
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { localeOrTool } = await params;
  const validLocale = locales.includes(localeOrTool as Locale) ? (localeOrTool as Locale) : 'en';

  // Enable static rendering
  setRequestLocale(validLocale);

  return <FAQPageClient locale={validLocale} />;
}
