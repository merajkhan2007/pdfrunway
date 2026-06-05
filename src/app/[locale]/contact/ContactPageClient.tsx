'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Mail, MessageSquare, Github, Twitter, Send, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { type Locale } from '@/lib/i18n/config';

interface ContactPageClientProps {
  locale: Locale;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactPageClient({ locale }: ContactPageClientProps) {
  const t = useTranslations('contactPage');
  const tCommon = useTranslations('common');
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const contactMethods = [
    {
      icon: Mail,
      title: t('methods.email.title') || 'Email Support',
      description: t('methods.email.description') || 'Send us an email and we will get back to you within 24 hours.',
      action: t('methods.email.action') || 'Email hello@pdfrunway.com',
      href: 'mailto:hello@pdfrunway.com',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'
    },
    {
      icon: Github,
      title: t('methods.github.title') || 'GitHub Issues',
      description: t('methods.github.description') || 'Report bugs or request new features directly on our repository.',
      action: t('methods.github.action') || 'Open an issue',
      href: 'https://github.com/PDFRunway',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30'
    },
    {
      icon: Twitter,
      title: t('methods.twitter.title') || 'Twitter / X',
      description: t('methods.twitter.description') || 'Follow us for product updates, announcements, and quick help.',
      action: t('methods.twitter.action') || 'Send a DM',
      href: 'https://x.com/PDFRunway',
      color: 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, always succeed
    setFormStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header locale={locale} />

      <main className="flex-1">
        
        {/* Unified Navy Hero Section */}
        <section className="relative bg-[#1B2A4A] dark:bg-gray-950 overflow-hidden pt-36 pb-24 lg:pt-40 lg:pb-28" aria-labelledby="contact-title">
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          {/* Glowing Accents */}
          <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-[#E31E24] rounded-full opacity-[0.07] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500 rounded-full opacity-[0.05] blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 dark:bg-gray-900/60 text-white/90 text-xs font-semibold backdrop-blur-md shadow-md">
              <Mail className="h-3.5 w-3.5 text-[#E31E24]" />
              Help Center
            </div>
            <h1 id="contact-title" className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              {t('hero.title') || 'Get in Touch'}
            </h1>
            <p className="text-lg text-white/75 dark:text-gray-300 leading-relaxed">
              {t('hero.description') || 'Have questions or feedback? We would love to hear from you.'}
            </p>
          </div>
          {/* Bottom layout curve */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white dark:bg-gray-950" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
        </section>

        {/* Contact Methods */}
        <section className="py-20 bg-white dark:bg-gray-950 border-b border-gray-50 dark:border-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                const colors = method.color.split(' ');
                return (
                  <a
                    key={index}
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 p-6 h-full text-center hover:border-[#E31E24]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between">
                      <div className="flex flex-col items-center">
                        <div className={`w-13 h-13 rounded-2xl ${colors[1]} ${colors[2]} border ${colors[3]} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm`}>
                          <Icon className={`h-6 w-6 ${colors[0]}`} />
                        </div>
                        <h3 className="font-bold text-base text-[#1B2A4A] dark:text-white mb-2 group-hover:text-[#E31E24] transition-colors">
                          {method.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                          {method.description}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#E31E24] group-hover:underline mt-auto">
                        {method.action} →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-[#1B2A4A] dark:text-white tracking-tight mb-3">
                  {t('form.title') || 'Send a Message'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t('form.description') || 'Fill out the form below and our team will get back to you shortly.'}
                </p>
              </div>

              {formStatus === 'success' ? (
                <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl border border-gray-100 dark:border-gray-800 text-center shadow-lg animate-in fade-in zoom-in-95 duration-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 text-green-600 mb-6 shadow-sm">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1B2A4A] dark:text-white mb-3">
                    {t('form.success.title') || 'Message Sent Successfully!'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-md mx-auto">
                    {t('form.success.description') || 'Thank you for reaching out. We have received your message and will respond as soon as possible.'}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setFormStatus('idle')}
                    className="px-6 py-3 border-[#1B2A4A] dark:border-gray-650 text-[#1B2A4A] dark:text-gray-300 font-bold hover:bg-[#1B2A4A] hover:text-white dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-all"
                  >
                    {t('form.success.button') || 'Send Another Message'}
                  </Button>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-750/80 shadow-md">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5"
                        >
                          {t('form.fields.name.label') || 'Your Name'}
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                          placeholder={t('form.fields.name.placeholder') || 'e.g. John Doe'}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5"
                        >
                          {t('form.fields.email.label') || 'Your Email'}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                          placeholder={t('form.fields.email.placeholder') || 'e.g. john@example.com'}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5"
                      >
                        {t('form.fields.subject.label') || 'Subject Topic'}
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all cursor-pointer"
                      >
                        <option value="">{t('form.fields.subject.placeholder') || 'Select a topic...'}</option>
                        <option value="general">{t('form.fields.subject.options.general') || 'General Inquiry'}</option>
                        <option value="bug">{t('form.fields.subject.options.bug') || 'Report a Bug'}</option>
                        <option value="feature">{t('form.fields.subject.options.feature') || 'Feature Request'}</option>
                        <option value="feedback">{t('form.fields.subject.options.feedback') || 'Feedback'}</option>
                        <option value="other">{t('form.fields.subject.options.other') || 'Other'}</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5"
                      >
                        {t('form.fields.message.label') || 'Your Message'}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all resize-none"
                        placeholder={t('form.fields.message.placeholder') || 'Type your message details here...'}
                      />
                    </div>

                    {formStatus === 'error' && (
                      <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-700 dark:text-red-400">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-xs font-semibold">
                          {t('form.error') || 'Failed to submit the form. Please try again.'}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full py-4 rounded-xl bg-[#E31E24] text-white font-bold cursor-pointer hover:bg-red-700 transition-all shadow-md hover:-translate-y-0.5"
                      loading={formStatus === 'submitting'}
                      disabled={formStatus === 'submitting'}
                    >
                      {formStatus === 'submitting' ? (t('form.submit.loading') || 'Sending Message...') : (t('form.submit.default') || 'Send Message')}
                      {formStatus !== 'submitting' && <Send className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Link Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-5 text-gray-400" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] dark:text-white tracking-tight mb-4">
                {t('faq.title') || 'Looking for Quick Answers?'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                {t('faq.description', { brand: tCommon('brand') }) || 'Check our frequently asked questions first. We might have already answered your question.'}
              </p>
              <Link href={`/${locale}/faq`}>
                <Button variant="outline" className="px-6 py-3 border-[#1B2A4A] dark:border-gray-600 text-[#1B2A4A] dark:text-gray-300 font-bold hover:bg-[#1B2A4A] hover:text-white dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-all">
                  {t('faq.button') || 'Visit FAQ Center'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
