import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generateContactMetadata } from '@/lib/seo';
import ContactPageClient from './ContactPageClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ localeOrTool: locale }));
}

interface ContactPageProps {
  params: Promise<{ localeOrTool: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { localeOrTool } = await params;
  const validLocale = locales.includes(localeOrTool as Locale) ? (localeOrTool as Locale) : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'metadata' });

  return generateContactMetadata(validLocale, {
    title: t('contact.title'),
    description: t('contact.description'),
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { localeOrTool } = await params;
  const validLocale = locales.includes(localeOrTool as Locale) ? (localeOrTool as Locale) : 'en';

  // Enable static rendering
  setRequestLocale(validLocale);

  return <ContactPageClient locale={validLocale} />;
}
