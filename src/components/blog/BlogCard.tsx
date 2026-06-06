import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-750 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Featured Image placeholder */}
      <div className="relative aspect-video bg-gradient-to-br from-[#1B2A4A] to-red-900 overflow-hidden shrink-0 flex items-center justify-center text-white/10 font-black text-4xl select-none">
        {post.featuredImage ? (
          <div className="absolute inset-0 bg-[#1B2A4A] flex items-center justify-center opacity-70 group-hover:scale-105 transition-transform duration-500">
            {/* Visual representation of PDFRunway brand */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#E31E24] rounded-full opacity-30 blur-2xl group-hover:opacity-40 transition-opacity" />
            <div className="text-white/20 select-none font-bold text-center px-4 tracking-wider text-xl uppercase">
              {post.category.replace(/-/g, ' ')}
            </div>
          </div>
        ) : null}
        
        {/* Category Badge */}
        <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white/15 dark:bg-gray-950/40 text-white border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          {post.category.replace(/-/g, ' ')}
        </span>
      </div>

      {/* Card Info */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-4 text-[10px] sm:text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[#E31E24]/80" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-blue-500/80" />
              {post.readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-extrabold text-[#1B2A4A] dark:text-white line-clamp-2 mb-3 group-hover:text-[#E31E24] transition-colors leading-tight">
            <Link href={`/blog/${post.slug}`} className="focus:outline-none">
              {post.title}
            </Link>
          </h3>

          {/* Description Excerpt */}
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-6">
            {post.description}
          </p>
        </div>

        {/* Author Footer */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-50 dark:border-gray-750">
          <div className="w-8 h-8 rounded-full bg-[#1B2A4A] dark:bg-gray-700 text-white flex items-center justify-center text-xs font-bold select-none border border-white/10">
            {post.author.avatar}
          </div>
          <div>
            <span className="block text-xs font-bold text-[#1B2A4A] dark:text-gray-300">
              {post.author.name}
            </span>
            <span className="block text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
              {post.author.role}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
