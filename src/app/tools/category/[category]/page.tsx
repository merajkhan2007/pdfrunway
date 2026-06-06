import CategoryPage, { generateMetadata as localeGenerateMetadata } from '@/app/[locale]/tools/category/[category]/page';
import { RootWrapper } from '@/components/layout';
import { TOOL_CATEGORIES } from '@/types/tool';

export async function generateStaticParams() {
  return TOOL_CATEGORIES.map((category) => ({
    category,
  }));
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  return localeGenerateMetadata({
    params: Promise.resolve({ locale: 'en', category }),
  });
}

export default async function RootCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  return (
    <RootWrapper>
      <CategoryPage params={Promise.resolve({ locale: 'en', category })} />
    </RootWrapper>
  );
}
