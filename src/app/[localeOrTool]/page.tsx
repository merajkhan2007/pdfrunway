import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { getAllTools, getToolById } from '@/config/tools';
import { getToolContent } from '@/config/tool-content';
import HomePageClient from './HomePageClient';
import ToolPageRoute, { generateMetadata as toolGenerateMetadata } from './[tool]/page';
import NotFoundComponent from './not-found';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ localeOrTool: string }>;
}

/**
 * Generate static params for all localized homepages and root English tool pages
 */
export async function generateStaticParams() {
  // 1. Non-English locales for homepages (English homepage is at root /)
  const localeParams = locales
    .filter((locale) => locale !== 'en')
    .map((locale) => ({ localeOrTool: locale }));

  // 2. All tool slugs for root English tool pages
  const toolParams = getAllTools().map((tool) => ({ localeOrTool: tool.slug }));

  return [...localeParams, ...toolParams];
}

/**
 * Generate metadata dynamically based on path type
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { localeOrTool } = await params;

  if (localeOrTool === '404') {
    return {
      title: 'Page Not Found | PDFRunway',
    };
  }

  // If it's a valid tool slug, delegate metadata generation to the tool page route
  if (getToolById(localeOrTool)) {
    return toolGenerateMetadata({
      params: Promise.resolve({ localeOrTool: 'en', tool: localeOrTool }),
    });
  }

  // Otherwise (homepage locales), metadata is generated in layout.tsx
  return {};
}

/**
 * Dual router page component
 */
export default async function LocaleOrToolPage({ params }: PageProps) {
  const { localeOrTool } = await params;

  // Handle fallback 404 page prerendering
  if (localeOrTool === '404') {
    return <NotFoundComponent />;
  }

  // Check if it's a valid tool slug (English tool page at root)
  const tool = getToolById(localeOrTool);
  if (tool) {
    // Render English tool page route directly
    return <ToolPageRoute params={Promise.resolve({ localeOrTool: 'en', tool: localeOrTool })} />;
  }

  // Check if it's a valid locale (localized homepage, including English default)
  const isLocale = locales.includes(localeOrTool as Locale);
  if (isLocale) {
    const locale = localeOrTool as Locale;
    
    // Enable static rendering
    setRequestLocale(locale);

    // Get localized content for tools
    const tools = getAllTools();
    const localizedToolContent = tools.reduce((acc, t) => {
      const content = getToolContent(locale, t.id);
      if (content) {
        acc[t.id] = {
          title: content.title,
          description: content.metaDescription,
        };
      }
      return acc;
    }, {} as Record<string, { title: string; description: string }>);

    return <HomePageClient locale={locale} localizedToolContent={localizedToolContent} />;
  }

  // Otherwise, not found
  notFound();
}
