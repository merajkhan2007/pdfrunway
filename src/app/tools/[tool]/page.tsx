import ToolPage, { generateMetadata as localeGenerateMetadata } from '@/app/[locale]/tools/[tool]/page';
import type { Metadata } from 'next';
import { RootWrapper } from '@/components/layout';
import { getAllTools } from '@/config/tools';

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    tool: tool.slug,
  }));
}

interface ToolPageProps {
  params: Promise<{ tool: string }>;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { tool } = await params;
  return localeGenerateMetadata({
    params: Promise.resolve({ locale: 'en', tool }),
  });
}

export default async function RootToolPage({ params }: ToolPageProps) {
  const { tool } = await params;
  return (
    <RootWrapper>
      <ToolPage params={Promise.resolve({ locale: 'en', tool })} />
    </RootWrapper>
  );
}
