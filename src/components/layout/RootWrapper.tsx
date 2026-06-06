import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { fontVariables } from '@/lib/fonts';
import { SkipLink } from '@/components/common/SkipLink';

interface RootWrapperProps {
  children: React.ReactNode;
}

export default async function RootWrapper({ children }: RootWrapperProps) {
  // Enable static rendering for English
  setRequestLocale('en');

  // Get messages for English
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale="en">
      <div lang="en" dir="ltr" className={`${fontVariables} min-h-screen bg-background text-foreground antialiased font-sans`}>
        <SkipLink targetId="main-content">Skip to main content</SkipLink>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
