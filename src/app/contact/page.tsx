import ContactPage, { generateMetadata as localeGenerateMetadata } from '@/app/[localeOrTool]/contact/page';
import type { Metadata } from 'next';
import { RootWrapper } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  return localeGenerateMetadata({
    params: Promise.resolve({ localeOrTool: 'en' }),
  });
}

export default async function RootContactPage() {
  return (
    <RootWrapper>
      <ContactPage params={Promise.resolve({ localeOrTool: 'en' })} />
    </RootWrapper>
  );
}


