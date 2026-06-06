'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import type { BlogPost } from '@/lib/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface BlogHomeClientProps {
  posts: BlogPost[];
  categories: string[];
  initialCategory?: string;
}

const POSTS_PER_PAGE = 6;

export default function BlogHomeClient({ posts, categories, initialCategory = '' }: BlogHomeClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);

  // Find the featured post (latest post with featured: true, fallback to latest post)
  const featuredPost = useMemo(() => {
    if (posts.length === 0) return null;
    const featured = posts.find(p => p.featured);
    return featured || posts[0];
  }, [posts]);

  // Filter posts based on search & category selection
  const filteredPosts = useMemo(() => {
    let result = posts;

    // If no search query and no category filter, we exclude the featured post from the grid
    if (!searchQuery && !selectedCategory && featuredPost) {
      result = result.filter(p => p.slug !== featuredPost.slug);
    }

    if (selectedCategory) {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          p.body.toLowerCase().includes(q)
      );
    }

    return result;
  }, [posts, searchQuery, selectedCategory, featuredPost]);

  // Calculate pagination details
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  // Format featured post date
  const featuredDate = featuredPost
    ? new Date(featuredPost.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header locale="en" />

      <main className="flex-1 pb-24">
        {/* Unified Navy Hero Header Section */}
        <section className="relative bg-[#1B2A4A] dark:bg-gray-950 overflow-hidden pt-36 pb-24 lg:pt-40 lg:pb-28" aria-labelledby="blog-title">
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          {/* Glowing Accents */}
          <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-[#E31E24] rounded-full opacity-[0.07] blur-[120px] pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <BlogHeader
              title="PDFRunway Guides & Articles"
              description="Learn expert strategies, workflow tips, and visual tutorials to make managing PDF documents efficient and secure."
              badge="Resources & Guides"
              searchValue={searchQuery}
              onSearchChange={handleSearchChange}
              categories={categories}
              activeCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>
          
          {/* Bottom layout curve */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white dark:bg-gray-950" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
        </section>

        {/* Featured Post Area */}
        {!searchQuery && !selectedCategory && featuredPost && (
          <section className="container mx-auto px-4 -mt-10 mb-20 relative z-20">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xs font-black text-[#E31E24] uppercase tracking-widest mb-4">
                Featured Article
              </h2>
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
                
                {/* Visual Image container */}
                <div className="lg:col-span-7 bg-gradient-to-br from-[#1B2A4A] to-red-950/40 relative min-h-[260px] flex items-center justify-center text-white/5 font-black text-5xl select-none">
                  {featuredPost.featuredImage ? (
                    <div className="absolute inset-0 bg-[#1B2A4A] flex items-center justify-center opacity-85">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#E31E24] rounded-full opacity-35 blur-3xl" />
                      <div className="text-white/20 select-none font-bold text-center px-4 tracking-widest text-2xl uppercase">
                        {featuredPost.category.replace(/-/g, ' ')}
                      </div>
                    </div>
                  ) : null}
                  <span className="absolute top-6 left-6 inline-flex items-center rounded-full bg-[#E31E24] text-white px-3.5 py-1.5 text-xs font-black uppercase tracking-widest shadow-md">
                    Featured
                  </span>
                </div>

                {/* Content details */}
                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    {/* Excerpt Meta tags */}
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#E31E24]" />
                        {featuredDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-blue-500" />
                        {featuredPost.readingTime} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-[#1B2A4A] dark:text-white leading-tight tracking-tight mb-4 hover:text-[#E31E24] transition-colors">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h3>

                    {/* Text description */}
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                      {featuredPost.description}
                    </p>
                  </div>

                  {/* Footer CTA & Author */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1B2A4A] dark:bg-gray-800 text-white flex items-center justify-center text-sm font-bold border border-white/10">
                        {featuredPost.author.avatar}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#1B2A4A] dark:text-gray-300">
                          {featuredPost.author.name}
                        </span>
                        <span className="block text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                          {featuredPost.author.role}
                        </span>
                      </div>
                    </div>

                    <Link href={`/blog/${featuredPost.slug}`}>
                      <span className="inline-flex items-center gap-1 text-xs font-black text-[#E31E24] hover:underline cursor-pointer">
                        Read Article <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* Blog Post Grid */}
        <section className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {filteredPosts.length > 0 ? (
              <>
                <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#E31E24]" />
                  {searchQuery || selectedCategory ? 'Search Results' : 'Latest Articles'} ({filteredPosts.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>

                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-2">No articles matched your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="text-xs font-bold text-[#E31E24] hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer locale="en" />
    </div>
  );
}
