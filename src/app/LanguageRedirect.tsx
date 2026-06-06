'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locales } from '@/lib/i18n/config';

export default function LanguageRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      // Check if user language preference has already been set
      const savedLocale = localStorage.getItem('NEXT_LOCALE');
      if (savedLocale && savedLocale !== 'en' && (locales as readonly string[]).includes(savedLocale)) {
        router.replace(`/${savedLocale}`);
        return;
      }

      // Get browser language
      const browserLang = navigator.language;
      const primaryLang = browserLang.split('-')[0];

      // Redirect if browser language is supported and not English
      if (primaryLang !== 'en' && (locales as readonly string[]).includes(primaryLang)) {
        router.replace(`/${primaryLang}`);
      }
    } catch (_) {
      // Ignore redirection errors on client
    }
  }, [router]);

  return null;
}
