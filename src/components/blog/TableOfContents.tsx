'use client';

import { useEffect, useState } from 'react';
import type { HeadingItem } from '@/lib/blog';

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px', // Trigger when heading is near the top of viewport
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => {
      headings.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-4" aria-label="Table of Contents">
      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
        Table of Contents
      </h4>
      <ul className="space-y-3 border-l border-gray-100 dark:border-gray-800 text-xs">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 0.75 + 1}rem` }}
              className="relative"
            >
              {isActive && (
                <span className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#E31E24]" />
              )}
              <a
                href={`#${heading.id}`}
                className={`block truncate transition-colors duration-250 cursor-pointer ${
                  isActive
                    ? 'text-[#E31E24] font-bold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#1B2A4A] dark:hover:text-white font-medium'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                  setActiveId(heading.id);
                }}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
