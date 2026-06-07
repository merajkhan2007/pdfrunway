import type { Metadata } from 'next';
import '@/app/globals.css';
import { withBasePath } from '@/lib/utils/path';

export const metadata: Metadata = {
  title: 'Free PDF Tools Online – Edit, Convert, Merge & Compress PDFs | PDFRunway',
  description: 'Everything Your PDF Needs, Ready for Takeoff. Free online PDF tools for merging, splitting, compressing, and converting PDF files. All processing happens in your browser.',
  icons: {
    icon: withBasePath('/images/favicon.ico?v=1'),
    shortcut: withBasePath('/images/favicon.ico?v=1'),
    apple: withBasePath('/images/favicon.ico?v=1'),
  },
};

// Root layout - provides the basic HTML structure
// The actual layout with i18n is in [localeOrTool]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <style dangerouslySetInnerHTML={{ __html: 'html{scrollbar-gutter:stable}' }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VHF0VJXZBP"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VHF0VJXZBP');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
