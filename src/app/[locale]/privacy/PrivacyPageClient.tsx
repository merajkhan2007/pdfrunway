'use client';

import { useTranslations } from 'next-intl';
import { Shield, Lock, Eye, Server, Trash2, KeyRound } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { type Locale } from '@/lib/i18n/config';

interface PrivacyPageClientProps {
  locale: Locale;
}

export default function PrivacyPageClient({ locale }: PrivacyPageClientProps) {
  const t = useTranslations();

  const privacyHighlights = [
    {
      icon: Server,
      title: 'No Server Uploads',
      description: 'Your files are never uploaded to any server. All processing happens locally in your browser.',
      color: 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
    },
    {
      icon: Lock,
      title: 'Local Processing',
      description: 'PDF operations are performed using JavaScript and WebAssembly directly on your device.',
      color: 'text-green-600 bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30'
    },
    {
      icon: Trash2,
      title: 'Automatic Cleanup',
      description: 'All file data is automatically cleared when you close the browser tab or navigate away.',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30'
    },
    {
      icon: Eye,
      title: 'No Tracking',
      description: 'We don\'t track your file contents or personal information. Your documents remain private.',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header locale={locale} />
      
      <main className="flex-1">
        
        {/* Unified Navy Hero Section */}
        <section className="relative bg-[#1B2A4A] dark:bg-gray-950 overflow-hidden pt-36 pb-24 lg:pt-40 lg:pb-28" aria-labelledby="privacy-title">
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          {/* Glowing Accents */}
          <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-[#E31E24] rounded-full opacity-[0.07] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500 rounded-full opacity-[0.05] blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 dark:bg-gray-900/60 text-white/90 text-xs font-semibold backdrop-blur-md shadow-md">
              <Shield className="h-3.5 w-3.5 text-[#E31E24]" />
              Privacy Center
            </div>
            <h1 id="privacy-title" className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg text-white/75 dark:text-gray-300 leading-relaxed">
              Your privacy is our top priority. {t('common.brand') || 'PDFRunway'} is designed from the ground up to protect your documents.
            </p>
          </div>
          {/* Bottom layout curve */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white dark:bg-gray-950" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
        </section>

        {/* Privacy Highlights */}
        <section className="py-20 bg-white dark:bg-gray-950 border-b border-gray-50 dark:border-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {privacyHighlights.map((item, index) => {
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

        {/* Privacy Policy Content */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-750/80 p-8 sm:p-12 shadow-sm">
              <p className="text-xs text-gray-450 dark:text-gray-500 mb-8 border-b border-gray-50 dark:border-gray-700 pb-4">
                Last updated: June 2026
              </p>

              <div className="space-y-8 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                
                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    1. Introduction
                  </h2>
                  <p>
                    {t('common.brand') || 'PDFRunway'} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
                    This Privacy Policy explains how we handle your information when you use our PDF tools.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    2. How Our Service Works
                  </h2>
                  <p className="mb-3">
                    {t('common.brand') || 'PDFRunway'} is a client-side application. This means:
                  </p>
                  <ul className="list-disc pl-5 space-y-2.5">
                    <li>All PDF processing happens directly in your web browser utilizing WebAssembly.</li>
                    <li>Your files are never uploaded to our servers or any third-party servers.</li>
                    <li>We cannot see, access, or store your documents.</li>
                    <li>Your files remain on your device at all times.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    3. Information We Collect
                  </h2>
                  <h3 className="font-bold text-sm text-[#1B2A4A] dark:text-white mb-2">
                    3.1 Your Files
                  </h3>
                  <p className="mb-4">
                    <strong>We do not collect your files.</strong> When you use our PDF tools, your files 
                    are processed entirely within your browser. They are never transmitted to our servers.
                  </p>
                  <h3 className="font-bold text-sm text-[#1B2A4A] dark:text-white mb-2">
                    3.2 Usage Data
                  </h3>
                  <p className="mb-3">
                    We may collect anonymous usage statistics to improve our service, such as:
                  </p>
                  <ul className="list-disc pl-5 space-y-2.5">
                    <li>Which tools are most popular</li>
                    <li>General geographic region (country level)</li>
                    <li>Browser type and version</li>
                    <li>Device type (desktop, mobile, tablet)</li>
                  </ul>
                  <p className="mt-3">
                    This data is aggregated and anonymized. It cannot be used to identify you personally.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    4. Local Storage
                  </h2>
                  <p className="mb-3">
                    {t('common.brand') || 'PDFRunway'} may use your browser&apos;s local storage to:
                  </p>
                  <ul className="list-disc pl-5 space-y-2.5">
                    <li>Remember your language preference</li>
                    <li>Store your recent tool history and searches</li>
                    <li>Save work-in-progress for interrupted sessions</li>
                  </ul>
                  <p className="mt-3">
                    This data is stored only on your device and is not transmitted to us.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    5. Cookies
                  </h2>
                  <p className="mb-3">
                    We use minimal cookies for essential functionality:
                  </p>
                  <ul className="list-disc pl-5 space-y-2.5">
                    <li><strong>Essential cookies:</strong> Required for the website to function properly.</li>
                    <li><strong>Preference cookies:</strong> Remember your settings like language preference.</li>
                  </ul>
                  <p className="mt-3">
                    We do not use tracking cookies or advertising cookies.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    6. Third-Party Services
                  </h2>
                  <p className="mb-3">
                    {t('common.brand') || 'PDFRunway'} does not share your data with third parties. We do not use:
                  </p>
                  <ul className="list-disc pl-5 space-y-2.5">
                    <li>Third-party analytics that track individual users</li>
                    <li>Advertising networks</li>
                    <li>Social media tracking pixels</li>
                    <li>External file processing services</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    7. Data Security
                  </h2>
                  <p className="mb-3">
                    Since your files never leave your device, they are protected by your own device&apos;s 
                    security measures. We recommend:
                  </p>
                  <ul className="list-disc pl-5 space-y-2.5">
                    <li>Using an up-to-date web browser</li>
                    <li>Keeping your operating system updated</li>
                    <li>Using secure networks when handling sensitive documents</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    8. Your Rights
                  </h2>
                  <p>
                    Since we don&apos;t collect personal data, there is no personal data to access, correct, 
                    or delete. You can clear your browser&apos;s local storage at any time to remove any 
                    preferences stored by {t('common.brand') || 'PDFRunway'}.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1B2A4A] dark:text-white mb-3">
                    9. Contact Us
                  </h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us through our 
                    contact page.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Privacy Badge Block */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="inline-flex items-center gap-4 px-6 py-5 bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/20 rounded-2xl text-left shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/30 text-green-600 flex items-center justify-center shrink-0">
                <Shield className="h-6.5 w-6.5" />
              </div>
              <div>
                <p className="font-bold text-green-800 dark:text-green-400">
                  {t('common.footer.privacyBadge') || '100% Private — Files never leave your device'}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500/80">
                  Your documents are processed securely in your browser session.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer locale={locale} />
    </div>
  );
}
