import { getAllPosts, getCategories, type BlogPost } from '@/lib/blog';
import { RootWrapper } from '@/components/layout';
import BlogHomeClient from './BlogHomeClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDFRunway Blog - Expert PDF Guides, Tutorials & Tips',
  description: 'Learn how to optimize, convert, merge, compress, and edit PDF documents. Read expert guides, tutorials, and productivity tips to improve your office workflow.',
};

export default async function BlogPage() {
  const posts = getAllPosts();
  const categoriesMap = getCategories();
  const categories = Object.keys(categoriesMap);

  return (
    <RootWrapper>
      <BlogHomeClient posts={posts} categories={categories} />
    </RootWrapper>
  );
}
