import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generateCookieMetadata } from '@/lib/seo';
import CookiePolicyPageClient from './CookiePolicyPageClient';

export function generateStaticParams() {
  return locales.filter((locale) => locale !== 'en').map((locale) => ({ locale }));
}

interface CookiePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CookiePageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'metadata' });

  return generateCookieMetadata(validLocale, {
    title: t('cookies.title') || 'Cookie Policy | PDFRunway',
    description: t('cookies.description') || 'PDFRunway cookie policy. Learn how we use cookies to provide, improve, and secure our online PDF tools.',
  });
}

export default async function CookiePage({ params }: CookiePageProps) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';

  // Enable static rendering
  setRequestLocale(validLocale);

  return <CookiePolicyPageClient locale={validLocale} />;
}
