'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight, Search, Shield, Zap, Lock, Globe,
  Edit, FileImage, FolderOpen, Settings, ShieldCheck,
  ChevronRight, Star, CheckCircle2, Merge, Scissors,
  Minimize2, FileText, ScanText, PenTool, KeyRound,
  FileOutput, Clock, BookOpen, Users, X, TrendingUp,
  Sparkles, Trash2, ArrowUp, Check
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllTools, getToolsByCategory, getPopularTools } from '@/config/tools';
import { type Locale, getLocalizedPath } from '@/lib/i18n/config';
import { type ToolCategory } from '@/types/tool';

interface HomePageClientProps {
  locale: Locale;
  localizedToolContent?: Record<string, { title: string; description: string }>;
}

/* ─── Animated Counter ─────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = Math.ceil(to / 60) || 1;
      const timer = setInterval(() => {
        start += step;
        if (start >= to) {
          setCount(to);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePageClient({ locale, localizedToolContent }: HomePageClientProps) {
  const t = useTranslations();
  const allTools = getAllTools();
  const popularToolsList = getPopularTools();

  // Core search and filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [searchResults, setSearchResults] = useState<typeof allTools>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Custom tool recommendation logic state
  const [recommendationType, setRecommendationType] = useState('merge');

  const searchRef = useRef<HTMLInputElement>(null);

  // Set up states on mount
  useEffect(() => {
    setMounted(true);
    
    // Load local storage items
    const savedRecent = localStorage.getItem('pdfrunway_recent_searches');
    if (savedRecent) {
      try { setRecentSearches(JSON.parse(savedRecent)); } catch (e) { console.error(e); }
    }
    const savedUsed = localStorage.getItem('pdfrunway_recently_used');
    if (savedUsed) {
      try { setRecentlyUsed(JSON.parse(savedUsed)); } catch (e) { console.error(e); }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track tool click to populate recently used tools
  const trackToolClick = (toolId: string) => {
    if (typeof window === 'undefined') return;
    const current = [...recentlyUsed];
    const filtered = current.filter(id => id !== toolId);
    filtered.unshift(toolId);
    const updated = filtered.slice(0, 4);
    setRecentlyUsed(updated);
    localStorage.setItem('pdfrunway_recently_used', JSON.stringify(updated));
  };

  // Save search queries
  const saveSearchQuery = (query: string) => {
    if (!query.trim() || typeof window === 'undefined') return;
    const current = [...recentSearches];
    const filtered = current.filter(q => q.toLowerCase() !== query.toLowerCase());
    filtered.unshift(query);
    const updated = filtered.slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('pdfrunway_recent_searches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('pdfrunway_recent_searches');
  };

  /* ── Search logic ── */
  const handleSearch = useCallback((q: string, category: ToolCategory | 'all' = 'all') => {
    setSearchQuery(q);
    const filterCat = category === 'all' ? activeCategory : category;

    if (!q.trim() && filterCat === 'all') {
      setSearchResults([]);
      return;
    }

    const lower = q.toLowerCase();
    const results = allTools.filter(tool => {
      const matchesCategory = filterCat === 'all' || tool.category === filterCat;
      const localized = localizedToolContent?.[tool.id];
      const matchesSearch = !q.trim() || (
        tool.id.replace(/-/g, ' ').includes(lower) ||
        (localized?.title.toLowerCase().includes(lower)) ||
        (localized?.description.toLowerCase().includes(lower)) ||
        tool.features.some(f => f.includes(lower))
      );
      return matchesCategory && matchesSearch;
    });

    setSearchResults(results);
  }, [allTools, localizedToolContent, activeCategory]);

  // Handle category change from filter buttons
  const handleCategoryChange = (cat: ToolCategory | 'all') => {
    setActiveCategory(cat);
    handleSearch(searchQuery, cat);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        setShowSearch(true);
        // Scroll to search area smoothly
        document.getElementById('tool-search-section')?.scrollIntoView({ behavior: 'smooth' });
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── Category Configuration ── */
  const categoryIcons: Record<ToolCategory, typeof Edit> = {
    'edit-annotate': Edit,
    'convert-to-pdf': FileImage,
    'convert-from-pdf': FileOutput,
    'organize-manage': FolderOpen,
    'optimize-repair': Settings,
    'secure-pdf': ShieldCheck,
  };

  const categoryColors: Record<ToolCategory, { bg: string; text: string; border: string; accent: string }> = {
    'edit-annotate':    { bg: 'bg-red-50 dark:bg-red-950/20',     text: 'text-red-600 dark:text-red-400',       border: 'border-red-100 dark:border-red-900/30', accent: 'bg-red-500' },
    'convert-to-pdf':  { bg: 'bg-blue-50 dark:bg-blue-950/20',   text: 'text-blue-600 dark:text-blue-400',     border: 'border-blue-100 dark:border-blue-900/30', accent: 'bg-blue-500' },
    'convert-from-pdf':{ bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/30', accent: 'bg-purple-500' },
    'organize-manage': { bg: 'bg-amber-50 dark:bg-amber-950/20',  text: 'text-amber-600 dark:text-amber-400',   border: 'border-amber-100 dark:border-amber-900/30', accent: 'bg-amber-500' },
    'optimize-repair': { bg: 'bg-green-50 dark:bg-green-950/20',  text: 'text-green-600 dark:text-green-400',   border: 'border-green-100 dark:border-green-900/30', accent: 'bg-green-500' },
    'secure-pdf':      { bg: 'bg-slate-100 dark:bg-slate-800/30', text: 'text-slate-700 dark:text-slate-300',   border: 'border-slate-200 dark:border-slate-800', accent: 'bg-slate-500' },
  };

  const categoryKeys: Record<ToolCategory, string> = {
    'edit-annotate': 'editAnnotate',
    'convert-to-pdf': 'convertToPdf',
    'convert-from-pdf': 'convertFromPdf',
    'organize-manage': 'organizeManage',
    'optimize-repair': 'optimizeRepair',
    'secure-pdf': 'securePdf',
  };

  const categoryOrder: ToolCategory[] = [
    'edit-annotate',
    'convert-to-pdf',
    'convert-from-pdf',
    'organize-manage',
    'optimize-repair',
    'secure-pdf',
  ];

  /* ── Featured tools for hero chips ── */
  const heroChips = [
    { id: 'merge-pdf', label: 'Merge PDF', icon: Merge },
    { id: 'compress-pdf', label: 'Compress PDF', icon: Minimize2 },
    { id: 'pdf-to-docx', label: 'PDF to Word', icon: FileText },
    { id: 'ocr-pdf', label: 'OCR PDF', icon: ScanText },
    { id: 'sign-pdf', label: 'Sign PDF', icon: PenTool },
  ];

  /* ── Popular tools list ── */
  const popularToolsKeys = [
    'merge-pdf',
    'compress-pdf',
    'pdf-to-docx',
    'word-to-pdf',
    'ocr-pdf',
    'sign-pdf',
    'edit-pdf',
    'jpg-to-pdf',
  ];

  const popularTools = popularToolsKeys
    .map(id => allTools.find(t => t.id === id))
    .filter(Boolean) as typeof allTools;

  /* ── Blog posts ── */
  const blogPosts = [
    { title: 'How to Merge PDF Files Online', cat: 'Guide', read: '3 min', slug: 'how-to-merge-pdf-files-online', color: 'from-red-500 to-amber-500' },
    { title: 'How to Compress PDF Without Losing Quality', cat: 'Guide', read: '4 min', slug: 'how-to-compress-pdf-without-losing-quality', color: 'from-blue-500 to-indigo-500' },
    { title: 'PDF to Word Conversion Guide', cat: 'Tutorial', read: '5 min', slug: 'pdf-to-word-conversion-guide', color: 'from-purple-500 to-pink-500' },
    { title: 'How to Sign PDF Documents', cat: 'Guide', read: '3 min', slug: 'how-to-sign-pdf-documents', color: 'from-green-500 to-teal-500' },
  ];

  /* ── Tool Recommendation Mapping ── */
  const recommendedToolsMapping: Record<string, { id: string; title: string; desc: string; tip: string }> = {
    'merge': {
      id: 'merge-pdf',
      title: 'Merge PDF',
      desc: 'Combine multiple PDF files into a single document in your preferred page order, losslessly retaining layouts.',
      tip: 'Perfect for combining invoices, legal documents, or portfolio pages.',
    },
    'compress': {
      id: 'compress-pdf',
      title: 'Compress PDF',
      desc: 'Reduce the file size of your PDF documents while preserving text clarity and image resolution dynamically.',
      tip: 'Great for files too large to attach to emails or upload to applications.',
    },
    'ocr': {
      id: 'ocr-pdf',
      title: 'OCR PDF',
      desc: 'Recognize characters and extract editable text layers from scanned paper sheets or image-based PDFs.',
      tip: 'Converts locked scanned images into fully searchable and highlightable PDFs.',
    },
    'sign': {
      id: 'sign-pdf',
      title: 'Sign PDF',
      desc: 'Easily draw, type, or upload signature files and stamp them securely onto any contract layout.',
      tip: 'E-sign agreements in seconds, fully in-browser with zero uploads.',
    },
    'encrypt': {
      id: 'encrypt-pdf',
      title: 'Encrypt PDF',
      desc: 'Protect sensitive files with powerful AES-256 password security and custom access permission filters.',
      tip: 'Secure legal contracts, financial sheets, or private data before distribution.',
    },
    'word': {
      id: 'pdf-to-docx',
      title: 'PDF to Word',
      desc: 'Extract text layers and convert layout templates into fully editable DOCX Word files.',
      tip: 'Quickly modify textual content of a PDF inside Microsoft Word or Google Docs.',
    }
  };

  const selectedRec = recommendedToolsMapping[recommendationType] || recommendedToolsMapping['merge'];
  const selectedRecTool = allTools.find(t => t.id === selectedRec.id);
  const recColors = selectedRecTool ? categoryColors[selectedRecTool.category] : categoryColors['organize-manage'];

  /* ── SEO JSON-LD Schemas ── */
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'PDFRunway',
    'url': locale === 'en' ? 'https://pdfrunway.com' : `https://pdfrunway.com/${locale}`,
    'logo': 'https://pdfrunway.com/images/pdfrunway.png',
    'description': 'Free, secure, browser-based PDF tools that run 100% client-side.',
    'sameAs': [
      'https://github.com/PDFRunway',
      'https://x.com/PDFRunway'
    ]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'PDFRunway',
    'url': locale === 'en' ? 'https://pdfrunway.com' : `https://pdfrunway.com/${locale}`,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': locale === 'en' ? 'https://pdfrunway.com/tools?search={search_term_string}' : `https://pdfrunway.com/${locale}/tools?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': locale === 'en' ? 'https://pdfrunway.com' : `https://pdfrunway.com/${locale}`
      }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Is PDFRunway free?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, PDFRunway is 100% free. You can use all 131+ PDF tools without paying, signing up, or experiencing watermark restrictions. Every feature is fully available to all users.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Are my PDF files secure?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Absolutely. PDFRunway processes all files client-side in your browser using WebAssembly. Your files are never uploaded to our servers, keeping your private data 100% secure.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Do I need to install software?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'No installation is required. PDFRunway is an entirely browser-based application that works directly in Chrome, Firefox, Safari, Edge, or mobile browsers.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I convert PDF to Word?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, you can convert PDF to Word (DOCX) files easily. Our converter runs fully in-browser, extracting text and tables while maintaining original formatting.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I merge PDF files online?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, you can merge multiple PDF documents into a single consolidated file instantly, reordering pages as needed.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Does PDFRunway support OCR?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes. PDFRunway features browser-based OCR (Optical Character Recognition) to extract editable text layers from scanned PDFs or images.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I sign PDF documents online?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes. You can digitally draw, type, or upload your signature to place it securely onto any contract layout, completely offline in your browser.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is PDFRunway mobile friendly?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, PDFRunway is optimized for mobile-first responsiveness. It runs fast on any iPhone, iPad, or Android browser using localized hardware acceleration.'
        }
      }
    ]
  };

  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'PDFRunway Free PDF Tools Suite',
    'operatingSystem': 'Windows, macOS, Linux, iOS, Android',
    'applicationCategory': 'BusinessApplication, UtilityApplication',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'featureList': 'Merge PDF, Compress PDF, PDF to Word, OCR PDF, Edit PDF, Sign PDF, Encrypt PDF'
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      
      {/* Dynamic SEO schemas */}
      {mounted && (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
        </>
      )}

      <Header locale={locale} />

      <main id="main-content" className="flex-1" tabIndex={-1}>

        {/* ════════════════════════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════════════════════ */}
        <section className="relative bg-[#1B2A4A] dark:bg-gray-950 overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32" aria-labelledby="hero-title">
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          
          {/* Glowing Orbs */}
          <div className="absolute -top-40 right-0 w-[800px] h-[800px] bg-[#E31E24] rounded-full opacity-[0.08] dark:opacity-[0.04] blur-[140px] pointer-events-none animate-pulse duration-[8000ms]" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-600 rounded-full opacity-[0.06] dark:opacity-[0.03] blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">

              {/* Pulsing Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/20 dark:border-gray-800 bg-white/10 dark:bg-gray-900/60 text-white text-sm font-semibold backdrop-blur-md shadow-md animate-fade-in">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E31E24] animate-ping shrink-0" />
                131+ Free PDF Tools
              </div>

              {/* Headline (H1) */}
              <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
                Free PDF Tools Online – <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E31E24] via-red-500 to-amber-400">Edit, Convert, Merge &amp; Secure</span> PDFs
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-white/75 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Everything your PDF needs. 100% private, browser-based processing with no uploads to our servers.
              </p>

              {/* Instant Search Bar */}
              <div id="tool-search-section" className="relative max-w-2xl mx-auto mb-10 group">
                <div className="flex items-center bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-white/10 dark:border-gray-800 overflow-hidden focus-within:ring-2 focus-within:ring-[#E31E24] transition-all duration-300">
                  <Search className="ml-5 h-6.5 w-6.5 text-gray-400 shrink-0" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    onFocus={() => setShowSearch(true)}
                    placeholder="Search PDF tools..."
                    className="flex-1 px-4 py-5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base bg-transparent outline-none border-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                    aria-label="Search PDF tools"
                    autoComplete="off"
                  />
                  {searchQuery ? (
                    <button onClick={() => { setSearchQuery(''); handleSearch(''); }} className="mr-3 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  ) : (
                    <span className="mr-5 text-xs text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-800 rounded px-2 py-1 select-none hidden sm:inline font-mono">Ctrl K</span>
                  )}
                </div>

                {/* Instant Search Dropdown UI */}
                {showSearch && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    {/* Category quick selectors inside search */}
                    <div className="bg-gray-50 dark:bg-gray-800/40 px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-2 items-center">
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mr-1">Filter:</span>
                      <button
                        onClick={() => handleCategoryChange('all')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${activeCategory === 'all' ? 'bg-[#E31E24] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
                      >
                        All
                      </button>
                      {categoryOrder.map(cat => (
                        <button
                          key={cat}
                          onClick={() => handleCategoryChange(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${activeCategory === cat ? 'bg-[#E31E24] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#E31E24]/10 hover:text-[#E31E24]'}`}
                        >
                          {t(`home.categories.${categoryKeys[cat]}`)}
                        </button>
                      ))}
                    </div>

                    {/* Searches lists */}
                    <div className="p-2 max-h-[350px] overflow-y-auto">
                      {searchResults.length > 0 ? (
                        <div>
                          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matched Tools</div>
                          {searchResults.map(tool => {
                            const loc = localizedToolContent?.[tool.id];
                            const name = loc?.title || tool.id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
                            const colors = categoryColors[tool.category];
                            return (
                              <Link key={tool.id} href={getLocalizedPath(`/tools/${tool.slug}`, locale)}
                                onClick={() => {
                                  setShowSearch(false);
                                  saveSearchQuery(name);
                                  trackToolClick(tool.id);
                                }}
                                className="flex items-center gap-3.5 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/20 text-left group transition-colors border-b border-gray-50 dark:border-gray-800/40 last:border-0 rounded-xl"
                              >
                                <div className={`w-9 h-9 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center shrink-0`}>
                                  <FileText className={`h-4.5 w-4.5 ${colors.text}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#E31E24] transition-colors">{name}</div>
                                  <div className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 truncate">{loc?.description || tool.features.join(' • ')}</div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#E31E24] group-hover:translate-x-0.5 transition-all ml-auto shrink-0" />
                              </Link>
                            );
                          })}
                        </div>
                      ) : searchQuery.trim() ? (
                        <div className="py-8 text-center text-gray-400">
                          <X className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No tools found matching &quot;{searchQuery}&quot;</p>
                          <p className="text-xs mt-1">Try searching for other keywords like merge, compress, word, jpg.</p>
                        </div>
                      ) : (
                        <div>
                          {/* Recent Searches (from localstorage) */}
                          {mounted && recentSearches.length > 0 && (
                            <div className="p-3 border-b border-gray-50 dark:border-gray-800">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Searches</span>
                                <button
                                  onClick={clearRecentSearches}
                                  className="text-[10px] font-semibold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="h-3 w-3" /> Clear
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {recentSearches.map((q, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSearch(q)}
                                    className="px-2.5 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                                  >
                                    {q}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Default Suggestions */}
                          <div className="p-3">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Search Suggestions</div>
                            <div className="flex flex-wrap gap-2">
                              {['merge', 'compress', 'word to pdf', 'ocr', 'edit', 'sign', 'protect'].map((q, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSearch(q)}
                                  className="px-3 py-1.5 text-xs rounded-xl bg-red-50/50 dark:bg-red-950/10 border border-red-100/50 dark:border-red-900/20 text-[#E31E24] hover:bg-red-100/50 cursor-pointer font-medium"
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Close search clicking backdrop when open */}
              {showSearch && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowSearch(false)} />
              )}

              {/* Popular Tool Chips */}
              <div className="flex flex-wrap justify-center items-center gap-2.5 mb-12">
                <span className="text-white/40 text-xs font-semibold uppercase tracking-wider mr-1 select-none">Popular:</span>
                {heroChips.map(chip => {
                  const tool = allTools.find(t => t.id === chip.id);
                  const slug = tool?.slug || chip.id;
                  return (
                    <Link key={chip.id} href={getLocalizedPath(`/tools/${slug}`, locale)}
                      onClick={() => trackToolClick(chip.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 dark:bg-gray-900/60 hover:bg-white/20 border border-white/15 hover:border-white/30 text-white/90 hover:text-white text-xs font-semibold transition-all shadow-sm">
                      <chip.icon className="h-3.5 w-3.5" />
                      {chip.label}
                    </Link>
                  );
                })}
              </div>

              {/* Call-to-Actions (CTAs) */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
                <Link href={getLocalizedPath('/tools', locale)}>
                  <button className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#E31E24] text-white font-bold text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-900/50 hover:-translate-y-0.5 cursor-pointer">
                    Explore All Tools <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </Link>
                <Link href="#popular-tools">
                  <button className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 dark:bg-gray-900 hover:bg-white/15 dark:hover:bg-gray-800 text-white font-bold text-sm border border-white/20 dark:border-gray-800 transition-all hover:-translate-y-0.5 cursor-pointer">
                    <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" /> Most Popular Tools
                  </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3.5 pt-4 border-t border-white/10 dark:border-gray-900/50">
                {[
                  { label: 'Browser-Based' },
                  { label: 'No Installation' },
                  { label: 'Fast Processing' },
                  { label: 'Privacy Focused' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-white/70 text-xs font-medium">
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    {item.label}
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Bottom wave layout curve */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white dark:bg-gray-950" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
        </section>


        {/* ════════════════════════════════════════════════════════
            SOCIAL PROOF (STATS) SECTION
        ════════════════════════════════════════════════════════ */}
        <section className="relative py-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900" aria-label="Statistics">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
              {[
                { value: allTools.length, suffix: '+', label: 'PDF Tools', icon: Settings, color: 'text-[#E31E24]', bg: 'bg-red-50 dark:bg-red-950/20' },
                { value: 500, suffix: 'K+', label: 'Files Processed', icon: TrendingUp, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                { value: 100, suffix: '%', label: 'Private', icon: Shield, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/20' },
                { value: 9, suffix: '+', label: 'Languages', icon: Globe, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20' },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100/70 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-sm`}>
                      <Icon className="h-6.5 w-6.5" />
                    </div>
                    <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${stat.color}`}>
                      <Counter to={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════
            RECENTLY USED TOOLS (CONDITIONAL)
        ════════════════════════════════════════════════════════ */}
        {mounted && recentlyUsed.length > 0 && (
          <section className="py-12 bg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-150 dark:border-gray-900">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/30 text-[#E31E24]">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white">Recently Used Tools</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentlyUsed.map(id => {
                    const tool = allTools.find(t => t.id === id);
                    if (!tool) return null;
                    const loc = localizedToolContent?.[tool.id];
                    const name = loc?.title || tool.id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
                    const colors = categoryColors[tool.category];
                    return (
                      <Link key={tool.id} href={getLocalizedPath(`/tools/${tool.slug}`, locale)}
                        onClick={() => trackToolClick(tool.id)}
                        className="group flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-150 dark:border-gray-700 hover:border-[#E31E24]/30 hover:shadow-md transition-all duration-200"
                      >
                        <div className={`w-9 h-9 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                          <FileText className={`h-4.5 w-4.5 ${colors.text}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-[#E31E24] transition-colors">{name}</h3>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 capitalize">{tool.category.replace(/-/g, ' ')}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#E31E24] ml-auto shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}


        {/* ════════════════════════════════════════════════════════
            MOST POPULAR TOOLS SECTION
        ════════════════════════════════════════════════════════ */}
        <section id="popular-tools" className="py-24 bg-gray-50 dark:bg-gray-900" aria-labelledby="popular-heading">
          <div className="container mx-auto px-4">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 max-w-5xl mx-auto">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-[#E31E24]/10 text-[#E31E24] text-xs font-bold uppercase tracking-wider">
                  <Star className="h-3.5 w-3.5 fill-[#E31E24]" /> Most Popular
                </div>
                <h2 id="popular-heading" className="text-3xl sm:text-4xl font-extrabold text-[#1B2A4A] dark:text-white tracking-tight">
                  Most Used PDF Tools
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">Quick access to the utility features our users reach for every day</p>
              </div>
              <Link href={getLocalizedPath('/tools', locale)} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E31E24] hover:underline shrink-0 group">
                View all {allTools.length}+ tools <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {popularTools.map((tool, idx) => {
                const loc = localizedToolContent?.[tool.id];
                const name = loc?.title || tool.id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
                const desc = loc?.description || tool.features.slice(0, 2).join(', ');
                const colors = categoryColors[tool.category];
                
                return (
                  <Link key={tool.id} href={getLocalizedPath(`/tools/${tool.slug}`, locale)}
                    onClick={() => trackToolClick(tool.id)}
                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/80 p-6 flex flex-col hover:border-[#E31E24]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Popular Tag */}
                    <span className="absolute top-4 right-4 text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 px-2.5 py-0.5 rounded-full select-none">
                      Popular
                    </span>

                    {/* Icon */}
                    <div className={`w-13 h-13 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm`}>
                      <FileText className={`h-6 w-6 ${colors.text}`} />
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-[#1B2A4A] dark:text-white text-base mb-2 group-hover:text-[#E31E24] transition-colors line-clamp-1">
                      {name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 flex-1 mb-5 leading-relaxed">
                      {desc}
                    </p>

                    {/* CTA Button */}
                    <div className="w-full mt-auto pt-3 border-t border-gray-50 dark:border-gray-700/50">
                      <button className="w-full py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-gray-700 group-hover:bg-[#E31E24] text-gray-700 dark:text-gray-200 group-hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm">
                        Use Tool <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════
            INTERACTIVE RECOMMENDATIONS (CONVERSION ENGINE)
        ════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-white dark:bg-gray-950 border-t border-b border-gray-100 dark:border-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" /> Direct Helper
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] dark:text-white tracking-tight">
                  What are you looking to do today?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Select an objective below and let PDFRunway recommend the correct tools.</p>
              </div>

              {/* Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-8">
                {[
                  { type: 'merge', label: 'Merge Files' },
                  { type: 'compress', label: 'Reduce Size' },
                  { type: 'ocr', label: 'Extract Text' },
                  { type: 'sign', label: 'Sign PDF' },
                  { type: 'encrypt', label: 'Encrypt PDF' },
                  { type: 'word', label: 'Edit in Word' }
                ].map(item => (
                  <button
                    key={item.type}
                    onClick={() => setRecommendationType(item.type)}
                    className={`px-3 py-3 text-xs font-bold rounded-xl cursor-pointer border transition-all text-center ${
                      recommendationType === item.type
                        ? 'bg-[#1B2A4A] dark:bg-white text-white dark:text-gray-950 border-[#1B2A4A] dark:border-white shadow-md'
                        : 'bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Glowing Highlight Card */}
              {selectedRecTool && (
                <div className="relative p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 flex flex-col md:flex-row gap-6 items-center shadow-inner overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E31E24] opacity-[0.03] rounded-full blur-xl pointer-events-none" />
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${recColors.bg} ${recColors.border} border flex items-center justify-center shadow-sm shrink-0`}>
                    <FileText className={`h-8 w-8 ${recColors.text}`} />
                  </div>

                  {/* Recommendation Details */}
                  <div className="flex-1 text-center md:text-left min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2 mb-2">
                      <h3 className="font-extrabold text-xl text-[#1B2A4A] dark:text-white">{selectedRec.title}</h3>
                      <span className={`inline-block mx-auto sm:mx-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${recColors.bg} ${recColors.text}`}>
                        {t(`home.categories.${categoryKeys[selectedRecTool.category]}`)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                      {selectedRec.desc}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/20">
                      <Check className="h-3.5 w-3.5" />
                      <span>{selectedRec.tip}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href={getLocalizedPath(`/tools/${selectedRecTool.slug}`, locale)} className="shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => trackToolClick(selectedRecTool.id)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#E31E24] text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                    >
                      Use Tool Now <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                  </Link>

                </div>
              )}

            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════
            CATEGORIES SECTION
        ════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white dark:bg-gray-950" aria-labelledby="categories-heading">
          <div className="container mx-auto px-4">
            
            <div className="text-center mb-16">
              <h2 id="categories-heading" className="text-3xl sm:text-4xl font-extrabold text-[#1B2A4A] dark:text-white tracking-tight">
                Browse by Category
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mt-2 text-sm sm:text-base">
                Explore all {allTools.length}+ professional PDF tools organized into 6 easy-to-use categories
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {categoryOrder.map(category => {
                const categoryTools = getToolsByCategory(category);
                const Icon = categoryIcons[category];
                const colors = categoryColors[category];
                const name = t(`home.categories.${categoryKeys[category]}`);
                const desc = t(`home.categoriesDescription.${categoryKeys[category]}`);
                
                return (
                  <Link key={category} href={getLocalizedPath(`/tools?category=${category}`, locale)} className="group">
                    <div className="bg-white dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:border-[#E31E24]/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">
                      <div className="flex items-start gap-4">
                        {/* Styled Icon */}
                        <div className={`shrink-0 w-13 h-13 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm`}>
                          <Icon className={`h-6 w-6 ${colors.text}`} />
                        </div>
                        {/* Info details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-base text-[#1B2A4A] dark:text-white group-hover:text-[#E31E24] transition-colors">{name}</h3>
                            <ChevronRight className="h-4.5 w-4.5 text-gray-300 group-hover:text-[#E31E24] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">{desc}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${colors.bg} ${colors.text} uppercase tracking-wider`}>
                              {categoryTools.length} tools
                            </span>
                            <span className="text-xs font-bold text-[#E31E24] opacity-0 group-hover:opacity-100 transition-opacity">
                              Open Category →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>


        {/* ════════════════════════════════════════════════════════
            TRUST & SECURITY SECTION
        ════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-[#1B2A4A] dark:bg-gray-900/50 relative overflow-hidden" aria-labelledby="trust-heading">
          {/* Layout accents */}
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-[#E31E24] rounded-full opacity-[0.06] blur-[120px] pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 id="trust-heading" className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                Your Files Stay Private
              </h2>
              <p className="text-white/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                We built PDFRunway on a privacy-first, serverless architecture. Local rendering, absolute security.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Shield, title: 'Browser-Based Processing', desc: 'All processing happens locally in your web browser. No plugins, desktop installations, or configurations are required to run conversions.', color: 'text-green-400 bg-green-400/10 border-green-500/20' },
                { icon: Lock, title: 'No Unnecessary Uploads', desc: 'Documents never get transmitted over the internet to cloud infrastructure. Your private data remains safe on your device.', color: 'text-[#E31E24] bg-red-400/10 border-red-500/20' },
                { icon: CheckCircle2, title: 'Security-First Approach', desc: 'Engineered around browser-based WebAssembly logic to ensure medical records, contract drafts, and invoices are secure from leaks.', color: 'text-blue-400 bg-blue-400/10 border-blue-500/20' },
                { icon: KeyRound, title: 'Fast Processing', desc: 'Local execution eliminates files queue delays and network latency constraints. Operations process in milliseconds using local CPU resources.', color: 'text-purple-400 bg-purple-400/10 border-purple-500/20' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-white/5 dark:bg-gray-800/20 border border-white/10 dark:border-gray-800 rounded-2xl p-6 text-center hover:bg-white/10 dark:hover:bg-gray-800/40 transition-colors">
                    <div className={`inline-flex items-center justify-center w-13 h-13 rounded-2xl ${item.color.split(' ')[1]} ${item.color.split(' ')[0]} border ${item.color.split(' ')[2]} mb-5 shadow-sm`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-white text-base mb-3.5">{item.title}</h3>
                    <p className="text-xs text-white/50 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════
            SEO ARTICLE CONTENT SECTION
        ════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-b border-gray-100 dark:border-gray-955" aria-labelledby="why-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              <div className="text-center mb-16">
                <h2 id="why-heading" className="text-3xl sm:text-4xl font-extrabold text-[#1B2A4A] dark:text-white tracking-tight mb-4">
                  Why Choose PDFRunway?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                  Managing digital documents efficiently is critical for modern business workflows, yet traditional utilities often come with high subscription costs or security vulnerabilities. PDFRunway solves these challenges by providing a premium, browser-based ecosystem of over 131+ free online PDF tools.
                </p>
              </div>

              {/* 600+ Words SEO Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
                
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30 flex items-center justify-center mt-1 shadow-sm">
                    <Shield className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B2A4A] dark:text-white mb-2.5 text-base">Advanced PDF Editing and Markups</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      PDF editing shouldn&apos;t require complex software installations or premium licenses. Our suite features a robust inline PDF editor allowing you to write text annotations, draw custom shapes (rectangles, circles, arrows), highlight paragraphs, and redact sensitive entries in real time. Because all visual assets and content streams are rendered locally via WebAssembly, adjustments are instantaneous. You can edit contracts, add feedback comments, and stamp seals with lag-free performance that handles large booklets with ease.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/20 text-[#E31E24] border border-red-100 dark:border-red-900/30 flex items-center justify-center mt-1 shadow-sm">
                    <Lock className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B2A4A] dark:text-white mb-2.5 text-base">Lossless PDF Conversion &amp; Formatting</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      High-quality document conversion requires preserving layout layouts, vector paths, and original fonts. PDFRunway provides professional-grade converters to translate documents between formats, including PDF to Word (DOCX), Excel (XLSX), PowerPoint (PPTX), and various image formats like JPG, PNG, WebP, SVG, and HEIC. The conversion modules process formatting structures directly inside the browser. This ensures that tables, header structures, and margins stay intact, saving you time spent correcting formatting errors.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center mt-1 shadow-sm">
                    <Zap className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B2A4A] dark:text-white mb-2.5 text-base">Adaptive PDF Compression &amp; Size Reduction</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      Large files slow down email communications and exceed portal upload limits. PDFRunway offers smart PDF compression tools that reduce file sizes without sacrificing text clarity or visual quality. By optimizing embedded images, stripping obsolete metadata, and flattening layout layers on-device, you can shrink files by up to 80% in seconds. This local optimization maintains high-resolution readability for prints while ensuring compatibility with standard email attachment standards.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center mt-1 shadow-sm">
                    <Globe className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B2A4A] dark:text-white mb-2.5 text-base">Enterprise-Grade PDF Security and Redaction</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-405 leading-relaxed">
                      Data security is a primary concern when handling financial logs, legal agreements, and corporate records. PDFRunway lets you restrict user access by setting AES-256 open passwords and permission constraints. You can disable editing, printing, or copying permissions to protect your intellectual property. Additionally, our sanitization tools wipe PieceInfo metadata and invisible XMP properties, securing your file catalog before public distribution.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30 flex items-center justify-center mt-1 shadow-sm">
                    <Settings className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B2A4A] dark:text-white mb-2.5 text-base">In-Browser OCR &amp; Structured Text Extraction</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      Paper scans and photo-based documents are typically locked, making text indexing impossible. PDFRunway integrates client-side OCR (Optical Character Recognition) to extract editable text streams from scanned files. The system builds a searchable PDF with a structured text layer aligned over the image pixels. You can search, highlight, and copy text from physical documents directly, without sending private records to cloud engines.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30 flex items-center justify-center mt-1 shadow-sm">
                    <CheckCircle2 className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B2A4A] dark:text-white mb-2.5 text-base">Privacy-First Architecture and GDPR Compliance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      Unlike traditional cloud utilities, PDFRunway uses a serverless architecture where documents never leave your machine. Processing runs inside your web browser sandbox using compiled WebAssembly. This natural data enclosure ensures native compliance with regulations like GDPR, HIPAA, and corporate security guidelines. There are no temporary database caches, no log tracking, and no third-party processors—guaranteeing complete privacy.
                    </p>
                  </div>
                </div>

              </div>

              <div className="text-center max-w-2xl mx-auto mb-16 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                PDFRunway represents a significant shift in web-based document utilities. By combining compiled C++ and Rust engines with standard browser frameworks, we offer a safe, fast, and feature-rich alternative to expensive software. Explore our 131+ free tools today to experience the speed, accessibility, and peace of mind of 100% private, local document processing.
              </div>

              {/* Accordion FAQ Grid */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-700/60 shadow-sm max-w-3xl mx-auto overflow-hidden">
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-extrabold text-[#1B2A4A] dark:text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#E31E24]" /> Frequently Asked Questions
                  </h3>
                </div>
                {[
                  { q: 'Is PDFRunway free?', a: 'Yes, PDFRunway is 100% free. You can use all 131+ PDF tools without paying, signing up, or experiencing watermark restrictions. Every feature is fully available to all users.' },
                  { q: 'Are my PDF files secure?', a: 'Absolutely. PDFRunway processes all files client-side in your browser using WebAssembly. Your files are never uploaded to our servers, keeping your private data 100% secure.' },
                  { q: 'Do I need to install software?', a: 'No installation is required. PDFRunway is an entirely browser-based application that works directly in Chrome, Firefox, Safari, Edge, or mobile browsers.' },
                  { q: 'Can I convert PDF to Word?', a: 'Yes, you can convert PDF to Word (DOCX) files easily. Our converter runs fully in-browser, extracting text and tables while maintaining original formatting.' },
                  { q: 'Can I merge PDF files online?', a: 'Yes, you can merge multiple PDF documents into a single consolidated file instantly, reordering pages as needed.' },
                  { q: 'Does PDFRunway support OCR?', a: 'Yes. PDFRunway features browser-based OCR (Optical Character Recognition) to extract editable text layers from scanned PDFs or images.' },
                  { q: 'Can I sign PDF documents online?', a: 'Yes. You can digitally draw, type, or upload your signature to place it securely onto any contract layout, completely offline in your browser.' },
                  { q: 'Is PDFRunway mobile friendly?', a: 'Yes, PDFRunway is optimized for mobile-first responsiveness. It runs fast on any iPhone, iPad, or Android browser using localized hardware acceleration.' },
                ].map(faq => (
                  <details key={faq.q} className="group px-6 py-4.5 cursor-pointer">
                    <summary className="flex items-center justify-between font-semibold text-sm sm:text-base text-[#1B2A4A] dark:text-white list-none gap-4">
                      {faq.q}
                      <ChevronRight className="h-4.5 w-4.5 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <p className="mt-3.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed cursor-text">{faq.a}</p>
                  </details>
                ))}
              </div>

            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════
            BLOG PREVIEW SECTION
        ════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white dark:bg-gray-950" aria-labelledby="blog-heading">
          <div className="container mx-auto px-4">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 max-w-5xl mx-auto">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <BookOpen className="h-3.5 w-3.5" /> PDF Guides
                </div>
                <h2 id="blog-heading" className="text-3xl sm:text-4xl font-extrabold text-[#1B2A4A] dark:text-white tracking-tight">
                  Learn &amp; Get More From Your PDFs
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">Step-by-step instructions and reviews from our document processing experts</p>
              </div>
              <Link href={getLocalizedPath('/tools', locale)} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E31E24] hover:underline shrink-0 group">
                All guides <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Blogs list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {blogPosts.map(post => (
                <Link key={post.slug} href={getLocalizedPath(`/blog/${post.slug}`, locale)}
                  onClick={() => trackToolClick(post.slug)}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Decorative High-Quality Gradient Thumbnails */}
                  <div className={`h-40 bg-gradient-to-br ${post.color} p-6 flex flex-col justify-between relative overflow-hidden shrink-0`}>
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '16px 16px' }} />
                    <span className="self-start text-[10px] font-bold bg-white text-gray-900 px-3 py-1 rounded-full uppercase tracking-wider select-none shadow-sm">
                      {post.cat}
                    </span>
                    <FileText className="absolute bottom-4 right-4 h-16 w-16 text-white/20 transform rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                  </div>

                  {/* Body details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <h3 className="font-bold text-sm text-[#1B2A4A] dark:text-white mb-4 line-clamp-2 group-hover:text-[#E31E24] transition-colors leading-relaxed">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3.5 w-3.5" /> {post.read} read
                      </div>
                      <span className="text-xs font-bold text-[#E31E24] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read More <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>


        {/* ════════════════════════════════════════════════════════
            FINAL CALL-TO-ACTION (CTA) SECTION
        ════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-150 dark:border-gray-900">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-[#E31E24]/10 text-[#E31E24] text-xs font-bold uppercase tracking-wider">
              <Users className="h-3.5 w-3.5" /> Join 500K+ Users
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2A4A] dark:text-white tracking-tight mb-4">
              Ready to Process Your Files Securely?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Start using PDFRunway&apos;s {allTools.length}+ free PDF tools right now. No sign-up required. No server uploads. 100% private.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={getLocalizedPath('/tools', locale)}>
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#E31E24] text-white font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-950/20 hover:-translate-y-0.5 cursor-pointer">
                  Start Using Free Tools <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </Link>
              <Link href={getLocalizedPath('/tools?category=organize-manage', locale)}>
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-[#1B2A4A] dark:border-gray-600 text-[#1B2A4A] dark:text-gray-300 font-bold hover:bg-[#1B2A4A] hover:text-white dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5 cursor-pointer">
                  Browse Categories
                </button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Floating CTA triggers & Search shortcuts on scroll */}
      {scrolled && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Quick Search Shortcut Trigger */}
          <button
            onClick={() => {
              searchRef.current?.focus();
              setShowSearch(true);
              document.getElementById('tool-search-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:text-[#E31E24] border border-gray-150 dark:border-gray-700 shadow-xl cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-0.5"
            aria-label="Open search shortcut"
          >
            <Search className="h-4.5 w-4.5" />
            <span className="text-xs font-bold hidden sm:inline">Search (Ctrl+K)</span>
          </button>

          {/* Floating Action Button: Suggest Merge PDF (Top Tool) */}
          <Link href={getLocalizedPath('/tools/merge-pdf', locale)} onClick={() => trackToolClick('merge-pdf')}>
            <button className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#E31E24] text-white hover:bg-red-700 font-bold text-xs shadow-xl cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-0.5">
              <Sparkles className="h-4 w-4 fill-white animate-pulse" />
              <span>Use Most Popular Tool (Merge)</span>
            </button>
          </Link>

          {/* Scroll back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-300 hover:text-[#E31E24] border border-gray-150 dark:border-gray-700 shadow-lg cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      <Footer locale={locale} />
    </div>
  );
}
