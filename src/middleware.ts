import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames.
  // We match:
  // - The root path '/'
  // - Prefixed paths starting with supported languages (except 'en')
  // - Non-prefixed paths (English default) while ignoring static assets and system files.
  matcher: [
    // Enable a redirect on a matching locale of the user's preference
    '/',
    
    // Set a cookie to remember the locale of the user
    '/(ja|ko|es|fr|de|zh|zh-TW|pt|ar|it|id|vi|ro)/:path*',
    
    // Non-prefixed paths that should match English (default locale).
    // Run the middleware on all paths except for static files/assets
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
