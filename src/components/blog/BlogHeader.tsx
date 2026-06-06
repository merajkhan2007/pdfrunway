import { Search } from 'lucide-react';

interface BlogHeaderProps {
  title: string;
  description: string;
  badge?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  categories?: string[];
  activeCategory?: string;
  onCategorySelect?: (category: string) => void;
}

export function BlogHeader({
  title,
  description,
  badge = 'Blog',
  searchValue,
  onSearchChange,
  categories = [],
  activeCategory,
  onCategorySelect
}: BlogHeaderProps) {
  return (
    <div className="text-center max-w-4xl mx-auto mb-16">
      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 dark:bg-white/5 border border-white/25 dark:border-gray-800 text-white dark:text-gray-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
        {badge}
      </span>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
        {title}
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-gray-300 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>

      {/* Search & Categories Bar */}
      {onSearchChange !== undefined && (
        <div className="flex flex-col gap-6 max-w-xl mx-auto items-center">
          {/* Search bar */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 dark:text-gray-500" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search articles, tutorials, guides..."
              className="w-full pl-12 pr-4 py-3.5 text-sm rounded-2xl border border-white/20 dark:border-gray-800 bg-white/10 dark:bg-gray-900 text-white dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all shadow-sm backdrop-blur-md"
            />
          </div>

          {/* Category Quick Filters */}
          {categories.length > 0 && onCategorySelect && (
            <div className="flex flex-wrap justify-center gap-2 pt-2 select-none">
              <button
                onClick={() => onCategorySelect('')}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  !activeCategory
                    ? 'bg-[#E31E24] text-white border-transparent shadow-md'
                    : 'bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 text-white dark:text-gray-300 border-white/20 dark:border-gray-750'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategorySelect(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    activeCategory?.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#E31E24] text-white border-transparent shadow-md'
                      : 'bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 text-white dark:text-gray-300 border-white/20 dark:border-gray-750'
                  }`}
                >
                  {cat.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
