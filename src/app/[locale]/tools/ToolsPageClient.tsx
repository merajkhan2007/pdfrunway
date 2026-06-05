'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Search, X, Filter, Star, Wrench, Shield } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAllTools, getToolsByCategory, getToolById } from '@/config/tools';
import { toolMatchesQuery } from '@/lib/utils/search';
import { type Locale } from '@/lib/i18n/config';
import { type ToolCategory } from '@/types/tool';
import { useFavorites } from '@/hooks/useFavorites';

type CategoryFilter = ToolCategory | 'all' | 'favorites';

interface ToolsPageClientProps {
  locale: Locale;
  localizedToolContent?: Record<string, { title: string; description: string }>;
}

export default function ToolsPageClient({ locale, localizedToolContent }: ToolsPageClientProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const allTools = getAllTools();
  const { favorites, isLoaded: favoritesLoaded, favoritesCount } = useFavorites();

  const categoryTranslationKeys: Record<ToolCategory, string> = {
    'edit-annotate': 'editAnnotate',
    'convert-to-pdf': 'convertToPdf',
    'convert-from-pdf': 'convertFromPdf',
    'organize-manage': 'organizeManage',
    'optimize-repair': 'optimizeRepair',
    'secure-pdf': 'securePdf',
  };

  // Read initial values from URL search params (client-side)
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(
    (initialCategory as ToolCategory) || 'all'
  );

  // Sync state with URL params when they change
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const query = searchParams.get('q') || '';
    setSelectedCategory(category as CategoryFilter);
    setSearchQuery(query);
  }, [searchParams]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    let tools = allTools;

    // Filter by category
    if (selectedCategory === 'favorites') {
      tools = favorites
        .map(id => getToolById(id))
        .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined);
    } else if (selectedCategory !== 'all') {
      tools = getToolsByCategory(selectedCategory as ToolCategory);
    }

    // Filter by search query (supports current language search)
    if (searchQuery.trim()) {
      tools = tools.filter(tool =>
        toolMatchesQuery(tool, searchQuery, localizedToolContent?.[tool.id])
      );
    }

    return tools;
  }, [allTools, selectedCategory, searchQuery, favorites, localizedToolContent]);

  // Category options colors mapping
  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    'edit-annotate':    { bg: 'bg-red-50 dark:bg-red-950/20',     text: 'text-red-650 dark:text-red-400',       border: 'border-red-100 dark:border-red-900/30' },
    'convert-to-pdf':  { bg: 'bg-blue-50 dark:bg-blue-950/20',   text: 'text-blue-650 dark:text-blue-400',     border: 'border-blue-100 dark:border-blue-900/30' },
    'convert-from-pdf':{ bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-650 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/30' },
    'organize-manage': { bg: 'bg-amber-50 dark:bg-amber-950/20',  text: 'text-amber-650 dark:text-amber-400',   border: 'border-amber-100 dark:border-amber-900/30' },
    'optimize-repair': { bg: 'bg-green-50 dark:bg-green-950/20',  text: 'text-green-650 dark:text-green-400',   border: 'border-green-100 dark:border-green-900/30' },
    'secure-pdf':      { bg: 'bg-slate-100 dark:bg-slate-800/30', text: 'text-slate-700 dark:text-slate-300',   border: 'border-slate-200 dark:border-slate-800' },
    'favorites':       { bg: 'bg-amber-50 dark:bg-amber-950/20',  text: 'text-amber-600 dark:text-amber-400',   border: 'border-amber-100 dark:border-amber-900/30' },
    'all':             { bg: 'bg-red-50 dark:bg-red-950/20',     text: 'text-[#E31E24]',                       border: 'border-red-100 dark:border-red-900/30' }
  };

  const categoriesList: { value: CategoryFilter; label: string; icon?: React.ReactNode }[] = [
    { value: 'all', label: t('toolsPage.allTools') || 'All Tools' },
    {
      value: 'favorites',
      label: t('tools.favorite.title') || 'Favorites',
      icon: <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
    },
    { value: 'edit-annotate', label: t('home.categories.editAnnotate') || 'Edit & Annotate' },
    { value: 'convert-to-pdf', label: t('home.categories.convertToPdf') || 'Convert to PDF' },
    { value: 'convert-from-pdf', label: t('home.categories.convertFromPdf') || 'Convert from PDF' },
    { value: 'organize-manage', label: t('home.categories.organizeManage') || 'Organize & Manage' },
    { value: 'optimize-repair', label: t('home.categories.optimizeRepair') || 'Optimize & Repair' },
    { value: 'secure-pdf', label: t('home.categories.securePdf') || 'Secure PDF' },
  ];

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header locale={locale} />

      <main className="flex-1">
        
        {/* Unified Navy Hero Section */}
        <section className="relative bg-[#1B2A4A] dark:bg-gray-950 overflow-hidden pt-36 pb-24 lg:pt-40 lg:pb-28" aria-labelledby="tools-title">
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          {/* Glowing Accents */}
          <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-[#E31E24] rounded-full opacity-[0.07] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500 rounded-full opacity-[0.05] blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 dark:bg-gray-900/60 text-white/90 text-xs font-semibold backdrop-blur-md shadow-md">
              <Wrench className="h-3.5 w-3.5 text-[#E31E24]" />
              Tool Box
            </div>
            <h1 id="tools-title" className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              {t('toolsPage.title') || 'All PDF Tools'}
            </h1>
            <p className="text-lg text-white/75 dark:text-gray-300 leading-relaxed mb-10">
              {t('toolsPage.subtitle', { count: allTools.length }) || 'Explore over 131+ free tools processed entirely in your web browser.'}
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto group">
              <div className="flex items-center bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-white/15 dark:border-gray-800 overflow-hidden focus-within:ring-2 focus-within:ring-[#E31E24] transition-all duration-300">
                <Search className="ml-5 h-5.5 w-5.5 text-gray-400 shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('tools.search.placeholder') || 'Search tools...'}
                  className="flex-1 px-4 py-4.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 bg-transparent outline-none border-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                  aria-label="Search tools"
                />
                {searchQuery && (
                  <button onClick={handleClearSearch} className="mr-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                    <X className="h-4.5 w-4.5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Bottom layout curve */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white dark:bg-gray-950" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
        </section>

        {/* Filters and Tools Grid */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900/30 min-h-[500px]">
          <div className="container mx-auto px-4 max-w-5xl">
            
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-10 sticky top-22 z-35 py-3.5 px-5 rounded-2xl bg-white/75 dark:bg-gray-850/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-sm transition-all">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="md:hidden w-full"
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-controls="category-filters"
              >
                <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                {t('toolsPage.filters') || 'Categories'}
              </Button>

              {/* Category Filter Buttons */}
              <div
                id="category-filters"
                className={`flex-wrap gap-2 ${showFilters ? 'flex w-full' : 'hidden md:flex flex-1'}`}
                role="group"
                aria-label="Filter by category"
              >
                {categoriesList.map((cat) => {
                  const isActive = selectedCategory === cat.value;
                  const colors = categoryColors[cat.value] || categoryColors['all'];
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      aria-pressed={isActive}
                      className={`
                        px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm
                        ${isActive
                          ? cat.value === 'favorites'
                            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200'
                            : 'bg-[#1B2A4A] dark:bg-white text-white dark:text-gray-950 shadow-md'
                          : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-150 dark:border-gray-750 hover:bg-gray-100'
                        }
                      `}
                    >
                      {cat.icon}
                      {cat.label}
                      {cat.value === 'favorites' && favoritesLoaded && (
                        <span className={`ml-0.5 text-[10px] ${isActive ? 'opacity-100' : 'opacity-65'}`}>
                          ({favoritesCount})
                        </span>
                      )}
                      {cat.value !== 'all' && cat.value !== 'favorites' && (
                        <span className={`ml-0.5 text-[10px] ${isActive ? 'opacity-100' : 'opacity-65'}`}>
                          ({getToolsByCategory(cat.value as ToolCategory).length})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Clear Filters Button */}
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-red-500 hover:underline cursor-pointer ml-auto"
                >
                  {t('toolsPage.clearAll') || 'Reset Filters'}
                </button>
              )}
            </div>

            {/* Results Count Text */}
            <div className="mb-6 px-2 flex justify-between items-center">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {selectedCategory === 'favorites'
                  ? `${filteredTools.length} ${t('tools.favorite.title') || 'Favorites'}`
                  : filteredTools.length === allTools.length
                    ? t('toolsPage.showingAll', { count: allTools.length }) || `Showing all ${allTools.length} tools`
                    : t('toolsPage.showingFiltered', { filtered: filteredTools.length, total: allTools.length }) || `Showing ${filteredTools.length} of ${allTools.length} tools`}
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'all' && selectedCategory !== 'favorites' && ` in ${t(`home.categories.${categoryTranslationKeys[selectedCategory as ToolCategory]}`)}`}
              </p>
            </div>

            {/* Tools Grid Area */}
            {filteredTools.length > 0 ? (
              selectedCategory === 'all' && !searchQuery ? (
                <ToolGrid
                  tools={filteredTools}
                  locale={locale}
                  localizedToolContent={localizedToolContent}
                  showCategoryHeaders
                />
              ) : (
                <ToolGrid
                  tools={filteredTools}
                  locale={locale}
                  localizedToolContent={localizedToolContent}
                />
              )
            ) : selectedCategory === 'favorites' ? (
              <div className="bg-white dark:bg-gray-800 p-16 rounded-3xl border border-gray-150 dark:border-gray-800 text-center max-w-lg mx-auto shadow-sm">
                <Star className="h-10 w-10 text-amber-400 fill-amber-400 mx-auto mb-5" />
                <h3 className="text-lg font-bold text-[#1B2A4A] dark:text-white mb-2">
                  {t('tools.favorite.empty') || 'No Favorite Tools Yet'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  {t('tools.favorite.hint') || 'Click the star icon on any tool card to add it to your favorites list for quick access.'}
                </p>
                <Button variant="outline" onClick={() => setSelectedCategory('all')} className="px-6 py-2.5 rounded-xl border-[#1B2A4A] dark:border-gray-600 text-[#1B2A4A] dark:text-gray-300 font-bold hover:bg-[#1B2A4A] hover:text-white dark:hover:bg-gray-800 cursor-pointer">
                  {t('toolsPage.allTools') || 'Browse All Tools'}
                </Button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-16 rounded-3xl border border-gray-150 dark:border-gray-800 text-center max-w-lg mx-auto shadow-sm">
                <Search className="h-10 w-10 text-gray-300 mx-auto mb-5" />
                <h3 className="text-lg font-bold text-[#1B2A4A] dark:text-white mb-2">
                  {t('toolsPage.noToolsFound') || 'No Tools Match Your Search'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  {t('tools.search.noResults', { query: searchQuery }) || `We couldn't find any tools matching your keyword.`}
                </p>
                <Button variant="outline" onClick={handleClearFilters} className="px-6 py-2.5 rounded-xl border-[#1B2A4A] dark:border-gray-600 text-[#1B2A4A] dark:text-gray-300 font-bold hover:bg-[#1B2A4A] hover:text-white dark:hover:bg-gray-800 cursor-pointer">
                  {t('toolsPage.clearFilters') || 'Clear Search Filters'}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
