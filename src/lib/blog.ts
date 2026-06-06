import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { getAuthor, type Author } from '@/config/authors';

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  author: Author;
  featuredImage?: string;
  featured: boolean;
  contentHtml: string;
  readingTime: number;
  body: string;
  headings: HeadingItem[];
}

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export function getPostBySlugSync(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      // Fallback to .md
      const fullPathMd = path.join(postsDirectory, `${slug}.md`);
      if (!fs.existsSync(fullPathMd)) return null;
      return parseFile(slug, fullPathMd);
    }
    return parseFile(slug, fullPath);
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

function parseFile(slug: string, fullPath: string): BlogPost | null {
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Split front-matter and content
  const parts = fileContents.split('---\n');
  if (parts.length < 3) {
    // Try with carriage returns (Windows style)
    const partsWin = fileContents.split('---\r\n');
    if (partsWin.length >= 3) {
      return parsePostParts(slug, partsWin[1], partsWin.slice(2).join('---\r\n'));
    }
    return null;
  }

  return parsePostParts(slug, parts[1], parts.slice(2).join('---\n'));
}

export function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim().replace(/[**_`]/g, ''); // Clean markdown formatting
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      headings.push({ id, text, level });
    }
  }
  return headings;
}

function addHeadingIds(html: string): string {
  // Add matching IDs to <h2> and <h3> tags
  return html.replace(/<h([23])>([^<]+)<\/h\1>/g, (match, level, text) => {
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}

function parsePostParts(slug: string, frontMatter: string, body: string): BlogPost {
  const metadata: Record<string, any> = {};
  const lines = frontMatter.split(/\r?\n/);
  
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      
      // Clean string quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }

      if (value.startsWith('[') && value.endsWith(']')) {
        metadata[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      } else if (key === 'tags') {
        metadata[key] = value.split(',').map(s => s.trim());
      } else if (key === 'featured') {
        metadata[key] = value === 'true';
      } else {
        metadata[key] = value;
      }
    }
  }

  // Calculate reading time (200 words per minute average)
  const wordsPerMinute = 200;
  const wordCount = body.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  // Parse HTML markdown and inject heading IDs
  const rawHtml = marked.parse(body) as string;
  const contentHtml = addHeadingIds(rawHtml);

  // Extract headings list
  const headings = extractHeadings(body);

  const authorId = metadata.author || 'editor';
  const author = getAuthor(authorId);

  return {
    slug,
    title: metadata.title || 'Untitled Post',
    description: metadata.description || '',
    date: metadata.date || new Date().toISOString().slice(0, 10),
    category: metadata.category || 'general',
    tags: metadata.tags || [],
    author,
    featuredImage: metadata.featuredImage || '/images/blog/default.jpg',
    featured: !!metadata.featured,
    contentHtml,
    readingTime,
    body,
    headings,
  };
}

export function getAllPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.mdx$/, '').replace(/\.md$/, '');
        return getPostBySlugSync(slug);
      })
      .filter((post): post is BlogPost => post !== null);

    // Sort posts by date descending
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(post => post.category.toLowerCase() === category.toLowerCase());
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
}

export function getCategories(): Record<string, number> {
  const categories: Record<string, number> = {};
  getAllPosts().forEach(post => {
    const cat = post.category;
    categories[cat] = (categories[cat] || 0) + 1;
  });
  return categories;
}

export function getTags(): Record<string, number> {
  const tags: Record<string, number> = {};
  getAllPosts().forEach(post => {
    post.tags.forEach(tag => {
      tags[tag] = (tags[tag] || 0) + 1;
    });
  });
  return tags;
}
