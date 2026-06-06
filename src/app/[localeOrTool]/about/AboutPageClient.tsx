'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Shield, Zap, Globe, Heart, Code, Users, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { type Locale } from '@/lib/i18n/config';
import { getAllTools } from '@/config/tools';

interface AboutPageClientProps {
  locale: Locale;
}

export default function AboutPageClient({ locale }: AboutPageClientProps) {
  const t = useTranslations('aboutPage');
  const tCommon = useTranslations('common');
  const allTools = getAllTools();

  const values = [
    {
      icon: Shield,
      title: t('values.privacy.title') || 'Privacy First',
      description: t('values.privacy.description') || 'All file processing runs locally in your browser. Files never leave your device.',
      color: 'text-green-600 bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30',
    },
    {
      icon: Zap,
      title: t('values.fast.title') || 'Lightning Fast',
      description: t('values.fast.description') || 'Powered by WebAssembly for near-native file conversion speed.',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
    },
    {
      icon: Globe,
      title: t('values.accessible.title') || 'Universal Access',
      description: t('values.accessible.description') || 'Runs on any device, operating system, and modern browser with no setup.',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30',
    },
    {
      icon: Heart,
      title: t('values.free.title') || '100% Free',
      description: t('values.free.description') || 'No limits, no subscriptions, no registration required. Open to everyone.',
      color: 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30',
    },
    {
      icon: Code,
      title: t('values.openSource.title') || 'Open Standards',
      description: t('values.openSource.description') || 'Built with open-source technologies, ensuring transparency and standard protocols.',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30',
    },
    {
      icon: Users,
      title: t('values.community.title') || 'Community Focused',
      description: t('values.community.description') || 'Designed to give power back to users by removing data monetization.',
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/30',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header locale={locale} />

      <main className="flex-1">
        {/* Unified Navy Hero Section */}
        <section className="relative bg-[#1B2A4A] dark:bg-gray-950 overflow-hidden pt-36 pb-24 lg:pt-40 lg:pb-28" aria-labelledby="about-title">
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          {/* Glowing Accents */}
          <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-[#E31E24] rounded-full opacity-[0.07] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500 rounded-full opacity-[0.05] blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 dark:bg-gray-900/60 text-white/90 text-xs font-semibold backdrop-blur-md shadow-md">
              <Users className="h-3.5 w-3.5 text-[#E31E24]" />
              Our Story
            </div>
            <h1 id="about-title" className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              {t('title', { brand: tCommon('brand') }) || 'About PDFRunway'}
            </h1>
            <p className="text-lg text-white/75 dark:text-gray-300 leading-relaxed">
              {t('description', { brand: tCommon('brand'), count: allTools.length }) || 'Providing professional, secure, and private PDF tools online for free.'}
            </p>
          </div>
          {/* Bottom layout curve */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white dark:bg-gray-950" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-white dark:bg-gray-950 border-b border-gray-50 dark:border-gray-900">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E31E24]/5 rounded-full blur-xl pointer-events-none" />
              <h2 className="text-3xl font-extrabold text-[#1B2A4A] dark:text-white mb-6 text-center tracking-tight">
                {t('mission.title') || 'Our Mission'}
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-6 text-sm sm:text-base">
                <p>
                  {t('mission.p1', { brand: tCommon('brand') }) || 'Our mission is to democratize document processing by building high-quality, professional, and accessible tools that run completely within the browser. We believe that document security and privacy should be a standard, not a premium luxury.'}
                </p>
                <p>
                  {t('mission.p2', { brand: tCommon('brand') }) || 'By compiling heavy backend frameworks into WebAssembly binaries that load directly in your browser, we eliminate the need to upload files to cloud servers. This radically shifts data security back to the user, making document editing safe for sensitive fields.'}
                </p>
                <p>
                  {t('mission.p3', { brand: tCommon('brand') }) || 'PDFRunway runs 100% client-side, requiring no registration, fee tiers, or page limitations. We are dedicated to providing a premium document processing utility suite open to everyone.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-[#1B2A4A] dark:text-white mb-16 text-center tracking-tight">
              {t('values.title') || 'Core Principles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon;
                const colors = value.color.split(' ');
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/80 p-6 hover:border-[#E31E24]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`shrink-0 w-12 h-12 rounded-xl ${colors[1]} ${colors[2]} border ${colors[3]} flex items-center justify-center shadow-sm`}>
                        <Icon className={`h-5.5 w-5.5 ${colors[0]}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[#1B2A4A] dark:text-white mb-2">
                          {value.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-24 bg-white dark:bg-gray-950 border-t border-b border-gray-50 dark:border-gray-900">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold text-[#1B2A4A] dark:text-white mb-6 tracking-tight text-center md:text-left">
                  {t('technology.title') || 'How It Works Behind the Scenes'}
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 space-y-4">
                  <p>
                    {t('technology.description', { brand: tCommon('brand') }) || 'PDFRunway runs entirely in your web browser, using advanced client-side technologies to deliver near-native application speeds without server lag.'}
                  </p>
                  <p>
                    {t('technology.summary') || 'By leveraging WebAssembly (WASM), we load pre-compiled rendering engines right inside your browser session, running localized rendering nodes without cloud storage constraints.'}
                  </p>
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-inner">
                  <h3 className="font-bold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Technology Stack</h3>
                  <ul className="space-y-3">
                    {[
                      { name: 'Next.js & React', desc: 'SaaS framework structure' },
                      { name: 'WebAssembly (WASM)', desc: 'High performance engine modules' },
                      { name: 'Web Workers', desc: 'Background thread processing' },
                      { name: 'pdf-lib & PDF.js', desc: 'Binary manipulation and parsing' },
                      { name: 'IndexedDB', desc: 'Secure local browser storage' }
                    ].map((tech, idx) => (
                      <li key={idx} className="flex items-center gap-3 bg-white dark:bg-gray-850 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="w-6 h-6 rounded-lg bg-[#E31E24]/10 flex items-center justify-center shrink-0">
                          <Check className="h-3.5 w-3.5 text-[#E31E24]" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 dark:text-white">{tech.name}</div>
                          <div className="text-[10px] text-gray-400 dark:text-gray-500">{tech.desc}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-[#1B2A4A] dark:text-white mb-4 tracking-tight">
              {t('cta.title') || 'Ready to try PDFRunway?'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              {t('cta.description', { brand: tCommon('brand'), count: allTools.length }) || 'Start using our free browser-based tools immediately. Safe, fast, and no account required.'}
            </p>
            <Link href={`/${locale}/tools`}>
              <Button variant="primary" className="px-8 py-4 rounded-xl bg-[#E31E24] text-white font-bold cursor-pointer hover:bg-red-700 transition-all shadow-lg hover:-translate-y-0.5">
                {t('cta.button') || 'Explore PDF Tools'}
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

// Dummy helper component just in case check icon is missing
function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
