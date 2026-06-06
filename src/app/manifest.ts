/**
 * Web App Manifest Generation
 * Configures PWA settings for the application
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */

import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { withBasePath } from '@/lib/utils/path';

// Required for static export
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'PDFRunway',
    description: siteConfig.description,
    start_url: withBasePath('/'),
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E31E24',
    orientation: 'portrait-primary',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: withBasePath('/images/favicon.ico?v=1'),
        sizes: 'any',
        type: 'image/x-icon',
        purpose: 'any',
      },
      {
        src: withBasePath('/icon-192.png'),
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: withBasePath('/icon-512.png'),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: withBasePath('/screenshots/home.png'),
        sizes: '1280x720',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Merge PDF',
        short_name: 'Merge',
        description: 'Combine multiple PDF files',
        url: withBasePath('/en/tools/merge-pdf'),
        icons: [{ src: withBasePath('/icons/merge.png'), sizes: '96x96' }],
      },
      {
        name: 'Split PDF',
        short_name: 'Split',
        description: 'Split PDF into multiple files',
        url: withBasePath('/en/tools/split-pdf'),
        icons: [{ src: withBasePath('/icons/split.png'), sizes: '96x96' }],
      },
      {
        name: 'Compress PDF',
        short_name: 'Compress',
        description: 'Reduce PDF file size',
        url: withBasePath('/en/tools/compress-pdf'),
        icons: [{ src: withBasePath('/icons/compress.png'), sizes: '96x96' }],
      },
    ],
  };
}
