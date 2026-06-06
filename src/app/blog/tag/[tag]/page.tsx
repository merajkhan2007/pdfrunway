import { getPostsByTag, getTags } from '@/lib/blog';
import { RootWrapper } from '@/components/layout';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogBreadcrumbs } from '@/components/blog/BlogBreadcrumbs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Tag } from 'lucide-react';
import type { Metadata } from 'next';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tagsMap = getTags();
  return Object.keys(tagsMap).map((tag) => ({
    tag,
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Articles Tagged with #${tag} - PDFRunway Blog`,
    description: `Read all articles, guides, and tutorials tagged with #${tag} on PDFRunway.`,
  };
}

export default async function BlogTagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  const breadcrumbItems = [
    { name: 'Blog', href: '/blog' },
    { name: `Tag: #${tag}` },
  ];

  return (
    <RootWrapper>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
        <Header locale="en" />

        <main className="flex-1 pt-32 pb-24">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Breadcrumbs */}
            <BlogBreadcrumbs items={breadcrumbItems} />

            {/* Header Title */}
            <div className="flex items-center gap-3 mb-12 border-b border-gray-150 dark:border-gray-800 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/20 text-[#E31E24] border border-red-100 dark:border-red-900/30 flex items-center justify-center shadow-sm">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#1B2A4A] dark:text-white tracking-tight">
                  Tag: <span className="text-[#E31E24]">#{tag}</span>
                </h1>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
                  Found {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                </p>
              </div>
            </div>

            {/* Grid of tagged posts */}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">No articles found with this tag.</p>
              </div>
            )}
          </div>
        </main>

        <Footer locale="en" />
      </div>
    </RootWrapper>
  );
}
