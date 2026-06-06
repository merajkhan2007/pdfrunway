import PrivacyPage, { generateMetadata as localeGenerateMetadata } from '@/app/[locale]/privacy/page';
import type { Metadata } from 'next';
import { RootWrapper } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  return localeGenerateMetadata({
    params: Promise.resolve({ locale: 'en' }),
  });
}

export default async function RootPrivacyPage() {
  return (
    <RootWrapper>
      <PrivacyPage params={Promise.resolve({ locale: 'en' })} />
    </RootWrapper>
  );
}
