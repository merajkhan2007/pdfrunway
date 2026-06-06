import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlugSync, getCategories, getTags } from '../lib/blog';

describe('Blog Content Engine', () => {
  it('loads all three example blog posts', () => {
    const posts = getAllPosts();
    expect(posts.length).toBe(3);
    
    posts.forEach((post) => {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.description).toBeTruthy();
      expect(post.date).toBeTruthy();
      expect(post.category).toBeTruthy();
      expect(post.tags).toBeDefined();
      expect(post.author).toBeDefined();
      expect(post.contentHtml).toContain('<p>');
      expect(post.readingTime).toBeGreaterThan(0);
      expect(post.headings.length).toBeGreaterThan(0);
    });
  });

  it('retrieves specific posts by slug', () => {
    const post = getPostBySlugSync('how-to-merge-pdf');
    expect(post).not.toBeNull();
    expect(post?.title).toContain('Merge PDF Files');
  });

  it('extracts categories and tags map correctly', () => {
    const categories = getCategories();
    expect(Object.keys(categories)).toContain('pdf-guides');
    expect(Object.keys(categories)).toContain('optimization');
    expect(Object.keys(categories)).toContain('conversion');

    const tags = getTags();
    expect(Object.keys(tags)).toContain('merge');
    expect(Object.keys(tags)).toContain('compress');
    expect(Object.keys(tags)).toContain('pdf-to-word');
  });
});
