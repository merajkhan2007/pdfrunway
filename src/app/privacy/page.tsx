import PrivacyPage, { generateMetadata as localeGenerateMetadata } from '@/app/[localeOrTool]/privacy/page';
import type { Metadata } from 'next';
import { RootWrapper } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  return localeGenerateMetadata({
    params: Promise.resolve({ localeOrTool: 'en' }),
  });
}

export default async function RootPrivacyPage() {
  return (
    <RootWrapper>
      <PrivacyPage params={Promise.resolve({ localeOrTool: 'en' })} />
    </RootWrapper>
  );
}


