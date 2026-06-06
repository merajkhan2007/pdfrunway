import CookiePage, { generateMetadata as localeGenerateMetadata } from '@/app/[locale]/cookies/page';
import type { Metadata } from 'next';
import { RootWrapper } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  return localeGenerateMetadata({
    params: Promise.resolve({ locale: 'en' }),
  });
}

export default async function RootCookiePage() {
  return (
    <RootWrapper>
      <CookiePage params={Promise.resolve({ locale: 'en' })} />
    </RootWrapper>
  );
}
