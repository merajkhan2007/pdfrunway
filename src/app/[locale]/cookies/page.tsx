import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generateCookieMetadata } from '@/lib/seo';
import CookiePolicyPageClient from './CookiePolicyPageClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'metadata' });

  return generateCookieMetadata(validLocale, {
    title: t('cookies.title') || 'Cookie Policy | PDFRunway',
    description: t('cookies.description') || 'PDFRunway cookie policy. Learn how we use cookies to provide, improve, and secure our online PDF tools.',
  });
}

interface CookiePageProps {
  params: Promise<{ locale: string }>;
}

export default async function CookiePage({ params }: CookiePageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <CookiePolicyPageClient locale={locale as Locale} />;
}
