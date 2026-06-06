import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Tag, Share2 } from 'lucide-react';
import { getPostBySlugSync, getAllPosts, type BlogPost } from '@/lib/blog';
import { RootWrapper } from '@/components/layout';
import { BlogBreadcrumbs } from '@/components/blog/BlogBreadcrumbs';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { BlogCTA } from '@/components/blog/BlogCTA';
import { BlogCard } from '@/components/blog/BlogCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/config/site';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlugSync(slug);
  if (!post) return {};

  return {
    title: `${post.title} | PDFRunway Blog`,
    description: post.description,
    alternates: {
      canonical: `${siteConfig.url}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${siteConfig.url}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = getPostBySlugSync(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  
  // Get related posts (posts in the same category, up to 3, excluding current)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  // If we don't have enough, fill with other latest posts
  if (relatedPosts.length < 3) {
    const fallbackPosts = allPosts.filter(
      (p) => p.slug !== post.slug && !relatedPosts.some((r) => r.slug === p.slug)
    );
    relatedPosts.push(...fallbackPosts.slice(0, 3 - relatedPosts.length));
  }

  const breadcrumbItems = [
    { name: 'Blog', href: '/blog' },
    { name: post.category.replace(/-/g, ' '), href: `/blog/category/${post.category}` },
    { name: post.title },
  ];

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Render content with CTA replacement
  const ctaRegex = /\[CTA:\s*([a-zA-Z0-9-]+)\]/;
  const contentParts = post.contentHtml.split(/(\[CTA:\s*[a-zA-Z0-9-]+\])/);

  // JSON-LD Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: [`${siteConfig.url}${post.featuredImage}`],
    datePublished: post.date,
    dateModified: post.date,
    author: [
      {
        '@type': 'Person',
        name: post.author.name,
        url: `${siteConfig.url}/blog`,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${post.slug}`,
    },
  };

  return (
    <RootWrapper>
      <JsonLd data={articleSchema} />

      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
        <Header locale="en" />

        <main className="flex-1 pt-32 pb-24">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Back to Blog */}
            <div className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-[#E31E24] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </div>

            {/* Breadcrumbs */}
            <BlogBreadcrumbs items={breadcrumbItems} />

            {/* Grid Layout: Main Article Column & Sidebar Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
              
              {/* Left Column: Post Details and Content */}
              <div className="lg:col-span-8 flex flex-col">
                <header className="mb-10">
                  <span className="inline-block px-3 py-1 mb-4 rounded-full bg-red-50 dark:bg-red-950/20 text-[#E31E24] text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                    {post.category.replace(/-/g, ' ')}
                  </span>
                  
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B2A4A] dark:text-white leading-tight tracking-tight mb-6">
                    {post.title}
                  </h1>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#E31E24]" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                      {post.readingTime} min read
                    </span>
                  </div>
                </header>

                {/* Article Body */}
                <article className="prose dark:prose-invert max-w-none text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed space-y-6">
                  {contentParts.map((part, index) => {
                    const match = part.match(ctaRegex);
                    if (match) {
                      const toolId = match[1];
                      return <BlogCTA key={index} toolId={toolId} />;
                    }
                    return (
                      <div
                        key={index}
                        dangerouslySetInnerHTML={{ __html: part }}
                        className="blog-content-block"
                      />
                    );
                  })}
                </article>

                {/* Tags Footer */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <Tag className="h-4 w-4 text-gray-400 shrink-0" />
                    {post.tags.map((tag) => (
                      <Link key={tag} href={`/blog/tag/${tag}`}>
                        <span className="inline-flex items-center rounded-xl bg-gray-50 dark:bg-gray-850 hover:bg-[#E31E24]/10 hover:text-[#E31E24] text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-150 dark:border-gray-750 px-3 py-1 cursor-pointer transition-all">
                          #{tag}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Sticky Sidebar with TOC & Author */}
              <aside className="lg:col-span-4 space-y-10">
                <div className="sticky top-28 space-y-10">
                  {/* Table of Contents */}
                  {post.headings.length > 0 && (
                    <div className="bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                      <TableOfContents headings={post.headings} />
                    </div>
                  )}

                  {/* Author Bio Card */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 shadow-md text-center">
                    <div className="w-14 h-14 rounded-full bg-[#1B2A4A] dark:bg-gray-700 text-white flex items-center justify-center text-lg font-black mx-auto mb-4 border-2 border-[#E31E24]/30 shadow-md">
                      {post.author.avatar}
                    </div>
                    <h4 className="font-extrabold text-base text-[#1B2A4A] dark:text-white mb-1">
                      {post.author.name}
                    </h4>
                    <span className="block text-[10px] font-bold text-[#E31E24] uppercase tracking-widest mb-3">
                      {post.author.role}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 px-2">
                      {post.author.bio}
                    </p>
                  </div>

                  {/* Share Card */}
                  <div className="bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 text-center shadow-sm">
                    <Share2 className="h-5 w-5 text-gray-400 mx-auto mb-3" />
                    <h5 className="font-bold text-xs text-[#1B2A4A] dark:text-white uppercase tracking-wider mb-2">Share this article</h5>
                    <div className="flex justify-center gap-3 pt-1">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${siteConfig.url}/blog/${post.slug}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-750 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-[#E31E24] hover:shadow-md transition-all"
                      >
                        𝕏
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteConfig.url}/blog/${post.slug}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-750 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-[#E31E24] hover:shadow-md transition-all"
                      >
                        f
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteConfig.url}/blog/${post.slug}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-750 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-[#E31E24] hover:shadow-md transition-all"
                      >
                        in
                      </a>
                    </div>
                  </div>
                </div>
              </aside>

            </div>

            {/* Related Articles Section */}
            {relatedPosts.length > 0 && (
              <section className="mt-24 pt-16 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-extrabold text-[#1B2A4A] dark:text-white tracking-tight mb-8">
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.slug} post={relatedPost} />
                  ))}
                </div>
              </section>
            )}

          </div>
        </main>

        <Footer locale="en" />
      </div>
    </RootWrapper>
  );
}
