import AboutPage, { generateMetadata as localeGenerateMetadata } from '@/app/[locale]/about/page';
import type { Metadata } from 'next';
import { RootWrapper } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  return localeGenerateMetadata({
    params: Promise.resolve({ locale: 'en' }),
  });
}

export default async function RootAboutPage() {
  return (
    <RootWrapper>
      <AboutPage params={Promise.resolve({ locale: 'en' })} />
    </RootWrapper>
  );
}
