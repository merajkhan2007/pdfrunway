import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { getAllTools } from '@/config/tools';
import { getToolContent } from '@/config/tool-content';
import HomePageClient from './HomePageClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Generate static params for all non-English localized homepages
 */
export async function generateStaticParams() {
  return locales
    .filter((locale) => locale !== 'en')
    .map((locale) => ({ locale }));
}

/**
 * Localized homepage route
 */
export default async function LocalePage({ params }: PageProps) {
  const { locale } = await params;
  const resolvedLocale = locale as Locale;
  
  // Enable static rendering
  setRequestLocale(resolvedLocale);

  // Get localized content for tools
  const tools = getAllTools();
  const localizedToolContent = tools.reduce((acc, t) => {
    const content = getToolContent(resolvedLocale, t.id);
    if (content) {
      acc[t.id] = {
        title: content.title,
        description: content.metaDescription,
      };
    }
    return acc;
  }, {} as Record<string, { title: string; description: string }>);

  return <HomePageClient locale={resolvedLocale} localizedToolContent={localizedToolContent} />;
}
