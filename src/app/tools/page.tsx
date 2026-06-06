import ToolsPage, { generateMetadata as localeGenerateMetadata } from '@/app/[locale]/tools/page';
import type { Metadata } from 'next';
import { RootWrapper } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  return localeGenerateMetadata({
    params: Promise.resolve({ locale: 'en' }),
  });
}

export default async function RootToolsPage() {
  return (
    <RootWrapper>
      <ToolsPage params={Promise.resolve({ locale: 'en' })} />
    </RootWrapper>
  );
}
