/**
 * Sitemap Generation
 * Generates sitemap.xml for all pages across all locales
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { locales, type Locale } from '@/lib/i18n/config';
import { getAllTools } from '@/config/tools';
import { getAllPosts, getCategories, getTags } from '@/lib/blog';

// Required for static export
export const dynamic = 'force-static';

/**
 * Priority values for different page types
 */
const PRIORITY = {
  home: 1.0,
  tools: 0.9,
  toolPage: 0.8,
  static: 0.6,
} as const;

/**
 * Change frequency for different page types
 */
const CHANGE_FREQUENCY = {
  home: 'daily',
  tools: 'weekly',
  toolPage: 'weekly',
  static: 'monthly',
} as const;

/**
 * Static pages that exist for all locales
 */
const STATIC_PAGES = [
  { path: '', priority: PRIORITY.home, changeFrequency: CHANGE_FREQUENCY.home },
  { path: '/tools', priority: PRIORITY.tools, changeFrequency: CHANGE_FREQUENCY.tools },
  { path: '/about', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/faq', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/privacy', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/contact', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
];

/**
 * Generate sitemap entries for a specific locale
 */
function generateLocaleEntries(locale: Locale, lastModified: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  
  // Add static pages
  for (const page of STATIC_PAGES) {
    const url = locale === 'en'
      ? `${siteConfig.url}${page.path}`
      : `${siteConfig.url}/${locale}${page.path}`;

    entries.push({
      url,
      lastModified,
      changeFrequency: page.changeFrequency as 'daily' | 'weekly' | 'monthly',
      priority: page.priority,
    });
  }
  
  // Add tool pages
  const tools = getAllTools();
  for (const tool of tools) {
    const url = locale === 'en'
      ? `${siteConfig.url}/tools/${tool.slug}`
      : `${siteConfig.url}/${locale}/tools/${tool.slug}`;

    entries.push({
      url,
      lastModified,
      changeFrequency: CHANGE_FREQUENCY.toolPage,
      priority: PRIORITY.toolPage,
    });
  }
  
  return entries;
}

/**
 * Generate sitemap entries for the blog section
 */
function generateBlogEntries(lastModified: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // 1. Blog Home
  entries.push({
    url: `${siteConfig.url}/blog`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.8,
  });

  // 2. Blog posts
  const posts = getAllPosts();
  for (const post of posts) {
    entries.push({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // 3. Blog categories
  const categories = Object.keys(getCategories());
  for (const category of categories) {
    entries.push({
      url: `${siteConfig.url}/blog/category/${category}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  }

  // 4. Blog tags
  const tags = Object.keys(getTags());
  for (const tag of tags) {
    entries.push({
      url: `${siteConfig.url}/blog/tag/${tag}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  }

  return entries;
}

/**
 * Generate the complete sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const allEntries: MetadataRoute.Sitemap = [];
  
  // Generate entries for each locale
  for (const locale of locales) {
    const localeEntries = generateLocaleEntries(locale, lastModified);
    allEntries.push(...localeEntries);
  }

  // Add blog entries
  const blogEntries = generateBlogEntries(lastModified);
  allEntries.push(...blogEntries);
  
  return allEntries;
}

/**
 * Get total number of URLs in sitemap
 * Useful for testing and validation
 */
export function getSitemapUrlCount(): number {
  const tools = getAllTools();
  const staticPagesCount = STATIC_PAGES.length;
  const toolPagesCount = tools.length;
  const localesCount = locales.length;
  
  // Include blog entries
  const blogPostsCount = getAllPosts().length;
  const blogCategoriesCount = Object.keys(getCategories()).length;
  const blogTagsCount = Object.keys(getTags()).length;
  const blogHomeCount = 1;

  const blogTotal = blogHomeCount + blogPostsCount + blogCategoriesCount + blogTagsCount;
  
  return (staticPagesCount + toolPagesCount) * localesCount + blogTotal;
}
