'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search, ArrowRight, HelpCircle, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { type Locale } from '@/lib/i18n/config';

interface FAQPageClientProps {
  locale: Locale;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  categoryLabel: string;
}

export default function FAQPageClient({ locale }: FAQPageClientProps) {
  const t = useTranslations('faqPage');
  const tCommon = useTranslations('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Helper to get FAQs for a category
  const getCategoryFaqs = (categoryKey: string, categoryLabel: string): FAQItem[] => {
    const items = ['whatIs', 'isFree', 'account', 'uploaded', 'safe', 'storage', 'operations', 'merge', 'images', 'edit', 'browsers', 'sizeLimit', 'slow', 'offline', 'supported', 'change'];
    const categoryMapping: Record<string, string[]> = {
      'general': ['whatIs', 'isFree', 'account'],
      'privacy': ['uploaded', 'safe', 'storage'],
      'features': ['operations', 'merge', 'images', 'edit'],
      'technical': ['browsers', 'sizeLimit', 'slow', 'offline'],
      'languages': ['supported', 'change']
    };

    const keys = categoryMapping[categoryKey] || [];

    return keys.map(key => ({
      category: categoryKey,
      categoryLabel: categoryLabel,
      question: t(`sections.${categoryKey}.${key}.question`),
      answer: t(`sections.${categoryKey}.${key}.answer`)
    }));
  };

  // Construct FAQ data dynamically
  const faqs: FAQItem[] = [
    ...getCategoryFaqs('general', t('categories.general') || 'General'),
    ...getCategoryFaqs('privacy', t('categories.privacy') || 'Privacy & Security'),
    ...getCategoryFaqs('features', t('categories.features') || 'Tools & Features'),
    ...getCategoryFaqs('technical', t('categories.technical') || 'Technical Specifications'),
    ...getCategoryFaqs('languages', t('categories.languages') || 'Languages'),
  ];

  // Get unique categories for filter buttons
  const categories = [
    { key: 'all', label: t('categories.all') || 'All FAQs' },
    { key: 'general', label: t('categories.general') || 'General' },
    { key: 'privacy', label: t('categories.privacy') || 'Privacy & Security' },
    { key: 'features', label: t('categories.features') || 'Tools & Features' },
    { key: 'technical', label: t('categories.technical') || 'Technical' },
    { key: 'languages', label: t('categories.languages') || 'Languages' },
  ];

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    setExpandedItems(new Set(filteredFaqs.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header locale={locale} />

      <main className="flex-1">
        
        {/* Unified Navy Hero Section */}
        <section className="relative bg-[#1B2A4A] dark:bg-gray-950 overflow-hidden pt-36 pb-24 lg:pt-40 lg:pb-28" aria-labelledby="faq-title">
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          {/* Glowing Accents */}
          <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-[#E31E24] rounded-full opacity-[0.07] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500 rounded-full opacity-[0.05] blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 dark:bg-gray-900/60 text-white/90 text-xs font-semibold backdrop-blur-md shadow-md">
              <HelpCircle className="h-3.5 w-3.5 text-[#E31E24]" />
              FAQ Center
            </div>
            <h1 id="faq-title" className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              {t('title') || 'Frequently Asked Questions'}
            </h1>
            <p className="text-lg text-white/75 dark:text-gray-300 leading-relaxed mb-10">
              {t('subtitle', { brand: tCommon('brand') }) || 'Find answers to common questions about our free browser-based PDF tools.'}
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto group">
              <div className="flex items-center bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-white/15 dark:border-gray-800 overflow-hidden focus-within:ring-2 focus-within:ring-[#E31E24] transition-all duration-300">
                <Search className="ml-5 h-5.5 w-5.5 text-gray-400 shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder') || 'Search questions or keywords...'}
                  className="flex-1 px-4 py-4.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 bg-transparent outline-none border-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                  aria-label="Search FAQs"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="mr-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                    <X className="h-4.5 w-4.5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Bottom layout curve */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white dark:bg-gray-950" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
        </section>

        {/* FAQ Content Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900/30">
          <div className="container mx-auto px-4 max-w-4xl">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm ${
                    selectedCategory === cat.key
                      ? 'bg-[#1B2A4A] dark:bg-white text-white dark:text-gray-950 shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-150 dark:border-gray-750 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Expand/Collapse Buttons */}
            <div className="flex justify-end gap-3 mb-6">
              <button
                onClick={expandAll}
                className="text-xs font-semibold text-gray-500 hover:text-[#E31E24] cursor-pointer"
              >
                {t('expandAll') || 'Expand All'}
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={collapseAll}
                className="text-xs font-semibold text-gray-500 hover:text-[#E31E24] cursor-pointer"
              >
                {t('collapseAll') || 'Collapse All'}
              </button>
            </div>

            {/* FAQ List Accordions */}
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = expandedItems.has(index);
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-750/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-red-50/20 dark:hover:bg-red-950/5 cursor-pointer transition-colors"
                        onClick={() => toggleItem(index)}
                        aria-expanded={isOpen}
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#E31E24] uppercase tracking-wider mb-1 block">
                            {faq.categoryLabel}
                          </span>
                          <span className="font-bold text-sm sm:text-base text-[#1B2A4A] dark:text-white leading-snug block">
                            {faq.question}
                          </span>
                        </div>
                        <div className={`p-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700/60 text-gray-400 group-hover:text-[#E31E24] transition-all ${isOpen ? 'rotate-180 text-[#E31E24]' : ''}`}>
                          <ChevronDown className="h-4.5 w-4.5" />
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-6 pt-1 border-t border-gray-50 dark:border-gray-750/30 animate-in fade-in slide-in-from-top-1 duration-200">
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl border border-gray-100 dark:border-gray-850 text-center shadow-sm">
                <Search className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                <p className="text-sm font-bold text-[#1B2A4A] dark:text-white mb-1">
                  {t('noResults') || 'No FAQ results found'}
                </p>
                <p className="text-xs text-gray-400">
                  Try searching for different terms or reset your active category filter.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] dark:text-white tracking-tight mb-4">
              {t('cta.title') || 'Still Have Questions?'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-md mx-auto">
              {t('cta.description') || 'Can’t find the answer you’re looking for? Contact our support team and we will get back to you shortly.'}
            </p>
            <Link href={`/${locale}/contact`}>
              <Button variant="primary" className="px-8 py-4 rounded-xl bg-[#E31E24] text-white font-bold cursor-pointer hover:bg-red-700 transition-all shadow-md hover:-translate-y-0.5">
                {t('cta.button') || 'Contact Us'}
                <ArrowRight className="ml-2 h-4.5 w-4.5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
