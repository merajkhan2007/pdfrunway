import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { getAllTools } from '@/config/tools';
import { getToolContent } from '@/config/tool-content';
import HomePageClient from './HomePageClient';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateFAQPageSchema,
  generateBreadcrumbSchema
} from '@/lib/seo/structured-data';
import { HOMEPAGE_FAQS } from '@/config/homepage-faqs';

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

  // Generate server-side schemas
  const organizationStructuredData = generateOrganizationSchema();
  const websiteStructuredData = generateWebSiteSchema(resolvedLocale);
  const breadcrumbStructuredData = generateBreadcrumbSchema(
    [
      { name: 'Home', path: '' }
    ],
    resolvedLocale
  );
  const faqStructuredData = generateFAQPageSchema(HOMEPAGE_FAQS);

  return (
    <>
      <JsonLd data={organizationStructuredData} />
      <JsonLd data={websiteStructuredData} />
      <JsonLd data={breadcrumbStructuredData} />
      <JsonLd data={faqStructuredData} />
      <HomePageClient locale={resolvedLocale} localizedToolContent={localizedToolContent} />
    </>
  );
}
