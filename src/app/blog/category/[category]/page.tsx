import { getAllPosts, getCategories } from '@/lib/blog';
import { RootWrapper } from '@/components/layout';
import BlogHomeClient from '../../BlogHomeClient';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categoriesMap = getCategories();
  return Object.keys(categoriesMap).map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const formattedCategory = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  return {
    title: `${formattedCategory} Articles & Guides - PDFRunway Blog`,
    description: `Browse all PDFRunway articles, guides, and tutorials under the ${formattedCategory} category.`,
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getAllPosts();
  const categoriesMap = getCategories();
  const categories = Object.keys(categoriesMap);

  return (
    <RootWrapper>
      <BlogHomeClient posts={posts} categories={categories} initialCategory={category} />
    </RootWrapper>
  );
}
