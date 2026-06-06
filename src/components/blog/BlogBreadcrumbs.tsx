import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BlogBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function BlogBreadcrumbs({ items }: BlogBreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wide overflow-x-auto whitespace-nowrap pb-2 select-none mb-8" aria-label="Breadcrumb">
      {/* Root Home Item */}
      <Link
        href="/"
        className="flex items-center hover:text-[#E31E24] transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {/* Trailing Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center space-x-1.5 shrink-0">
            <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-700" />
            {isLast || !item.href ? (
              <span className="text-[#1B2A4A] dark:text-gray-300 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[#E31E24] transition-colors"
              >
                {item.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
