/**
 * Site configuration
 */
export const siteConfig = {
  name: 'PDFRunway',
  description: 'Everything Your PDF Needs, Ready for Takeoff. Free, private & browser-based PDF tools. Merge, split, compress, convert, and edit PDF files online without uploading to servers.',
  url: 'https://pdfrunway.com',
  ogImage: '/images/og-image.png',
  links: {
    github: 'https://github.com/PDFRunway',
    twitter: 'https://twitter.com/PDFRunway',
  },
  creator: 'PDFRunway Team',
  keywords: [
    'PDF tools',
    'PDF editor',
    'merge PDF',
    'split PDF',
    'compress PDF',
    'convert PDF',
    'free PDF tools',
    'online PDF editor',
    'browser-based PDF',
    'private PDF processing',
    'PDFRunway',
  ],
  // SEO-related settings
  seo: {
    titleTemplate: '%s | PDFRunway',
    defaultTitle: 'Free PDF Tools Online – Edit, Convert, Merge & Compress PDFs | PDFRunway',
    twitterHandle: '@PDFRunway',
    locale: 'en_US',
  },
};

/**
 * Navigation configuration
 */
export const navConfig = {
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'Tools', href: '/tools' },
    { title: 'About', href: '/about' },
    { title: 'FAQ', href: '/faq' },
  ],
  footerNav: [
    { title: 'Privacy', href: '/privacy' },
    { title: 'Terms', href: '/terms' },
    { title: 'Contact', href: '/contact' },
  ],
};
