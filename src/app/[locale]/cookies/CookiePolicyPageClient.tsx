'use client';

import { useTranslations } from 'next-intl';
import { Cookie, Database, Lock, Settings, ShieldCheck, EyeOff } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { type Locale } from '@/lib/i18n/config';

interface CookiePolicyPageClientProps {
  locale: Locale;
}

export default function CookiePolicyPageClient({ locale }: CookiePolicyPageClientProps) {
  const t = useTranslations();

  const cookieHighlights = [
    {
      icon: ShieldCheck,
      title: 'Essential Cookies',
      description: 'Used solely for core features, such as preserving your active language selection and session preferences.',
      color: 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
    },
    {
      icon: Database,
      title: 'Local Storage',
      description: 'We utilize your browser local storage to save your recent PDF tools and searches locally on your computer.',
      color: 'text-green-600 bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30'
    },
    {
      icon: EyeOff,
      title: 'Zero Ad Tracking',
      description: 'We never deploy third-party advertising tracking scripts or user profiling cookies. Your data remains anonymous.',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30'
    },
    {
      icon: Settings,
      title: 'User Control',
      description: 'You are in full command. You can wipe all cookies and local storage state directly in your browser settings.',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header locale={locale} />
      
      <main className="flex-1">
        
        {/* Navy SaaS Hero Section */}
        <section className="relative bg-[#1B2A4A] dark:bg-gray-950 overflow-hidden pt-36 pb-24 lg:pt-40 lg:pb-28" aria-labelledby="cookies-title">
          {/* Grid background overlay */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          {/* Glowing accents */}
          <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-[#E31E24] rounded-full opacity-[0.07] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500 rounded-full opacity-[0.05] blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 dark:bg-gray-900/60 text-white/90 text-xs font-semibold backdrop-blur-md shadow-md">
              <Cookie className="h-3.5 w-3.5 text-[#E31E24]" />
              Cookie Center
            </div>
            <h1 id="cookies-title" className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Cookie Policy
            </h1>
            <p className="text-lg text-white/75 dark:text-gray-300 leading-relaxed">
              Transparent details about how we use cookies and local storage to provide a seamless, private, and secure experience.
            </p>
          </div>
          {/* Bottom layout curve */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white dark:bg-gray-950" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
        </section>

        {/* Highlight Cards */}
        <section className="py-20 bg-white dark:bg-gray-950 border-b border-gray-50 dark:border-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {cookieHighlights.map((item, index) => {
                const Icon = item.icon;
                const colors = item.color.split(' ');
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/80 p-6 text-center hover:border-[#E31E24]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-xl ${colors[1]} ${colors[2]} border ${colors[3]} flex items-center justify-center mb-4 shadow-sm`}>
                      <Icon className={`h-5.5 w-5.5 ${colors[0]}`} />
                    </div>
                    <h3 className="font-bold text-base text-[#1B2A4A] dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cookie Policy Detailed Content */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-750/80 p-8 sm:p-12 shadow-sm">
              <p className="text-xs text-gray-450 dark:text-gray-500 mb-8 border-b border-gray-50 dark:border-gray-700 pb-4">
                Last updated: June 2026
              </p>

              <div className="space-y-8 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                
                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    1. What Are Cookies?
                  </h2>
                  <p>
                    Cookies are small text files placed on your device by websites that you visit. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site. At {t('common.brand') || 'PDFRunway'}, we believe in extreme transparency regarding any data we store in your browser.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    2. How We Use Cookies
                  </h2>
                  <p className="mb-3">
                    We use minimal cookies exclusively for functional and preference-based services. These cookies fall under the category of **Essential Cookies**:
                  </p>
                  <ul className="list-disc pl-5 space-y-2.5">
                    <li><strong>Language Settings:</strong> Storing your preferred site language so you don&apos;t have to toggle it on subsequent visits.</li>
                    <li><strong>Session Security:</strong> Protecting request authentication configurations during active client sessions.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    3. Local Storage &amp; Local Database
                  </h2>
                  <p className="mb-3">
                    In addition to browser cookies, {t('common.brand') || 'PDFRunway'} leverages HTML5 local storage to make your workflow much smoother without transmitting any files or history details to external servers. This storage is used to:
                  </p>
                  <ul className="list-disc pl-5 space-y-2.5">
                    <li><strong>Recent Searches:</strong> Save your recent searches inside tool libraries to offer quick access.</li>
                    <li><strong>Tool History:</strong> Maintain a local list of recently-used tools on your homepage panel so you can jump back into action.</li>
                    <li><strong>Project Workflows:</strong> Store workflow builder maps and tool nodes on your local client cache.</li>
                  </ul>
                  <p className="mt-3">
                    All local storage variables reside strictly on your device and are never sent to our servers.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    4. Third-Party Cookies
                  </h2>
                  <p>
                    <strong>We do not deploy third-party tracking cookies.</strong> We do not use Facebook pixel tags, Google Ads remarketing cookies, or complex cross-site advertising scripts. We prioritize user privacy and document confidentiality above all else. Any analytics used on the website are strictly anonymous, general page views, and do not track individual identity or document processing files.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    5. How to Control and Delete Cookies
                  </h2>
                  <p className="mb-3">
                    You can restrict or block cookies set by our website through your browser settings. You can do this through the browser help function:
                  </p>
                  <ul className="list-disc pl-5 space-y-2.5">
                    <li><strong>Chrome:</strong> Go to Settings &gt; Privacy and Security &gt; Cookies and other site data.</li>
                    <li><strong>Firefox:</strong> Go to Options &gt; Privacy &amp; Security &gt; Cookies and Site Data.</li>
                    <li><strong>Safari:</strong> Go to Preferences &gt; Privacy &gt; Block all cookies.</li>
                  </ul>
                  <p className="mt-3">
                    To wipe all preferences, search history, and favorite tools saved by {t('common.brand') || 'PDFRunway'}, you can clear your browser&apos;s site storage/cache or local storage.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    6. Updates to this Policy
                  </h2>
                  <p>
                    We may update this Cookie Policy from time to time. We encourage users to check this page periodically to remain informed about how we safeguard their privacy online.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    7. Contact Us
                  </h2>
                  <p>
                    If you have any questions or queries regarding this policy, feel free to visit our contact page to reach out.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer locale={locale} />
    </div>
  );
}
