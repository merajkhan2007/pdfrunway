import ContactPage, { generateMetadata as localeGenerateMetadata } from '@/app/[locale]/contact/page';
import type { Metadata } from 'next';
import { RootWrapper } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  return localeGenerateMetadata({
    params: Promise.resolve({ locale: 'en' }),
  });
}

export default async function RootContactPage() {
  return (
    <RootWrapper>
      <ContactPage params={Promise.resolve({ locale: 'en' })} />
    </RootWrapper>
  );
}
