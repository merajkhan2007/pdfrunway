import CookiePage, { generateMetadata as localeGenerateMetadata } from '@/app/[localeOrTool]/cookies/page';
import type { Metadata } from 'next';
import { RootWrapper } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  return localeGenerateMetadata({
    params: Promise.resolve({ localeOrTool: 'en' }),
  });
}

export default async function RootCookiePage() {
  return (
    <RootWrapper>
      <CookiePage params={Promise.resolve({ localeOrTool: 'en' })} />
    </RootWrapper>
  );
}


