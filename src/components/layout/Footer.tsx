'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Shield, Lock, FileCheck, Github, Twitter, Mail, Globe } from 'lucide-react';
import { type Locale, locales, localeConfig, getLocalizedPath } from '@/lib/i18n/config';
import { saveLanguagePreference } from './LanguageSelector';

export interface FooterProps {
  locale: Locale;
}

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const t = useTranslations('common');
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: Locale) => {
    saveLanguagePreference(newLocale);
    const newPath = getLocalizedPath(pathname, newLocale);
    router.push(newPath);
  };

  // Tools Column links
  const toolsLinks = [
    { href: getLocalizedPath('/tools/merge-pdf', locale), label: 'Merge PDF' },
    { href: getLocalizedPath('/tools/compress-pdf', locale), label: 'Compress PDF' },
    { href: getLocalizedPath('/tools/split-pdf', locale), label: 'Split PDF' },
    { href: getLocalizedPath('/tools/ocr-pdf', locale), label: 'OCR PDF' },
    { href: getLocalizedPath('/tools/edit-pdf', locale), label: 'Edit PDF' },
    { href: getLocalizedPath('/tools/sign-pdf', locale), label: 'Sign PDF' },
    { href: getLocalizedPath('/tools/crop-pdf', locale), label: 'Crop PDF' },
  ];

  // Popular Tools Column links
  const popularToolsLinks = [
    { href: getLocalizedPath('/tools/pdf-to-docx', locale), label: 'PDF to Word' },
    { href: getLocalizedPath('/tools/word-to-pdf', locale), label: 'Word to PDF' },
    { href: getLocalizedPath('/tools/pdf-to-jpg', locale), label: 'PDF to JPG' },
    { href: getLocalizedPath('/tools/webp-to-pdf', locale), label: 'WebP to PDF' },
    { href: getLocalizedPath('/tools/jpg-to-pdf', locale), label: 'JPG to PDF' },
    { href: getLocalizedPath('/tools/png-to-pdf', locale), label: 'PNG to PDF' },
    { href: getLocalizedPath('/tools/encrypt-pdf', locale), label: 'Encrypt PDF' },
  ];

  // Resources Column links
  const resourcesLinks = [
    { href: getLocalizedPath('/blog', locale), label: 'Blog' },
    { href: getLocalizedPath('/faq', locale), label: t('navigation.faq') || 'FAQ' },
    { href: getLocalizedPath('/contact', locale), label: t('navigation.contact') || 'Contact' },
  ];

  // Company Column links
  const companyLinks = [
    { href: getLocalizedPath('/about', locale), label: t('navigation.about') || 'About Us' },
    { href: getLocalizedPath('/careers', locale), label: 'Careers' },
    { href: getLocalizedPath('/brand', locale), label: 'Brand Guidelines' },
  ];

  // Legal Column links
  const legalLinks = [
    { href: getLocalizedPath('/privacy', locale), label: t('navigation.privacy') || 'Privacy Policy' },
    { href: getLocalizedPath('/terms', locale), label: 'Terms of Service' },
    { href: getLocalizedPath('/cookies', locale), label: 'Cookie Policy' },
  ];

  return (
    <footer
      className="w-full border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] pt-20 pb-8"
      role="contentinfo"
    >
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          {/* Brand & Tagline Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link
              href={getLocalizedPath('/', locale)}
              className="group flex items-center hover:opacity-90 transition-opacity"
              aria-label={`${t('brand')} - ${t('navigation.home')}`}
            >
              <Image
                src="/images/pdfrunway.png"
                alt="PDFRunway"
                width={170}
                height={45}
                className="h-10 w-auto object-contain dark:hidden"
              />
              <Image
                src="/images/pdfrunway-dark.png"
                alt="PDFRunway"
                width={170}
                height={45}
                className="h-10 w-auto object-contain hidden dark:block"
              />
            </Link>
            <p className="text-sm text-[hsl(var(--color-muted-foreground))] leading-relaxed max-w-sm">
              {t('tagline') || 'Professional, secure, and free PDF tools for everyone. No installation required.'}
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/PDFRunway" className="p-2.5 rounded-xl bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-primary))] hover:text-white transition-all shadow-sm">
                <Github className="w-4.5 h-4.5" />
              </a>
              <a href="https://x.com/PDFRunway" className="p-2.5 rounded-xl bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-primary))] hover:text-white transition-all shadow-sm">
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a href="mailto:hello@pdfrunway.com" className="p-2.5 rounded-xl bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-primary))] hover:text-white transition-all shadow-sm">
                <Mail className="w-4.5 h-4.5" />
              </a>
            </div>
            
            {/* Quick trust metrics */}
            <div className="mt-2 flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-xs text-[hsl(var(--color-muted-foreground))]">
                <Shield className="w-4 h-4 text-[hsl(var(--color-success))]" />
                <span>Client-Side Local Processing</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[hsl(var(--color-muted-foreground))]">
                <Lock className="w-4 h-4 text-[hsl(var(--color-primary))]" />
                <span>No Server Uploads — 100% Private</span>
              </div>
            </div>
          </div>

          {/* Column 1: Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--color-foreground))] mb-6">
              Tools
            </h3>
            <ul className="flex flex-col gap-3">
              {toolsLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--color-border))] group-hover:bg-[hsl(var(--color-primary))] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Popular Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--color-foreground))] mb-6">
              Popular Tools
            </h3>
            <ul className="flex flex-col gap-3">
              {popularToolsLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--color-border))] group-hover:bg-[hsl(var(--color-primary))] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--color-foreground))] mb-6">
              Resources
            </h3>
            <ul className="flex flex-col gap-3">
              {resourcesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--color-border))] group-hover:bg-[hsl(var(--color-primary))] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 & 5: Company & Legal */}
          <div className="flex flex-col gap-8">
            {/* Company Block */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--color-foreground))] mb-5">
                Company
              </h3>
              <ul className="flex flex-col gap-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--color-border))] group-hover:bg-[hsl(var(--color-primary))] transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Block */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--color-foreground))] mb-5">
                Legal
              </h3>
              <ul className="flex flex-col gap-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--color-border))] group-hover:bg-[hsl(var(--color-primary))] transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="py-8 border-t border-[hsl(var(--color-border))]">
          <div className="flex items-center gap-3 mb-5">
            <Globe className="h-4.5 w-4.5 text-[hsl(var(--color-muted-foreground))]" />
            <span className="text-sm font-semibold text-[hsl(var(--color-foreground))]">
              {t('buttons.selectLanguage') || 'Select Language'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {locales.map((loc) => {
              const config = localeConfig[loc];
              const isActive = loc === locale;
              return (
                <button
                  key={loc}
                  onClick={() => handleLanguageChange(loc)}
                  className={`
                    px-3.5 py-1.5 text-xs rounded-full transition-all cursor-pointer font-medium
                    ${isActive
                      ? 'bg-[hsl(var(--color-primary))] text-white shadow-sm'
                      : 'bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-primary)/0.1)] hover:text-[hsl(var(--color-primary))]'
                    }
                  `}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {config.nativeName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[hsl(var(--color-border))] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
            &copy; {currentYear} {t('brand') || 'PDFRunway'}. {t('footer.copyright', { year: '' }).replace(/^\d{4}\s*/, '') || 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-6">
            <Link href={getLocalizedPath('/terms', locale)} className="text-xs text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))]">Terms of Service</Link>
            <Link href={getLocalizedPath('/privacy', locale)} className="text-xs text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))]">Privacy Policy</Link>
            <Link href={getLocalizedPath('/cookies', locale)} className="text-xs text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))]">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

