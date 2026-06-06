import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { localeConfig, type Locale, locales } from '@/lib/i18n/config';
import { generateHomeMetadata } from '@/lib/seo';
import { fontVariables } from '@/lib/fonts';
import { SkipLink } from '@/components/common/SkipLink';
import { getToolById } from '@/config/tools';
import '@/app/globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ localeOrTool: locale }));
}

/**
 * Viewport configuration for performance
 * Requirements: 8.1 - Lighthouse performance score 90+
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E31E24' },
    { media: '(prefers-color-scheme: dark)', color: '#1B2A4A' },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ localeOrTool: string }>;
}): Promise<Metadata> {
  const { localeOrTool } = await params;
  
  // Resolve locale
  const isLocale = locales.includes(localeOrTool as Locale);
  const locale = isLocale ? (localeOrTool as Locale) : 'en';

  // Get localized SEO translations
  const t = await getTranslations({ locale, namespace: 'metadata' });

  // Generate metadata using the SEO module with translations
  return generateHomeMetadata(locale, {
    title: t('home.title'),
    description: t('home.description'),
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ localeOrTool: string }>;
}) {
  const { localeOrTool } = await params;

  // Resolve locale
  const isLocale = locales.includes(localeOrTool as Locale);
  
  // If it's not a valid locale, verify it is a valid tool slug
  if (!isLocale && !getToolById(localeOrTool)) {
    notFound();
  }

  const locale = isLocale ? (localeOrTool as Locale) : 'en';

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  // Get direction for the locale
  const direction = localeConfig[locale]?.direction || 'ltr';

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale} dir={direction} className={`${fontVariables} min-h-screen bg-background text-foreground antialiased font-sans`}>
        <SkipLink targetId="main-content">Skip to main content</SkipLink>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
