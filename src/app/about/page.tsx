import AboutPage, { generateMetadata as localeGenerateMetadata } from '@/app/[localeOrTool]/about/page';
import type { Metadata } from 'next';
import { RootWrapper } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  return localeGenerateMetadata({
    params: Promise.resolve({ localeOrTool: 'en' }),
  });
}

export default async function RootAboutPage() {
  return (
    <RootWrapper>
      <AboutPage params={Promise.resolve({ localeOrTool: 'en' })} />
    </RootWrapper>
  );
}


