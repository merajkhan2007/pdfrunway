import FAQPage, { generateMetadata as localeGenerateMetadata } from '@/app/[locale]/faq/page';
import type { Metadata } from 'next';
import { RootWrapper } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  return localeGenerateMetadata({
    params: Promise.resolve({ locale: 'en' }),
  });
}

export default async function RootFAQPage() {
  return (
    <RootWrapper>
      <FAQPage params={Promise.resolve({ locale: 'en' })} />
    </RootWrapper>
  );
}
