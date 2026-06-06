export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string; // Will use inline icons or initials fallback
  twitter?: string;
  github?: string;
}

export const authors: Record<string, Author> = {
  editor: {
    id: 'editor',
    name: 'PDFRunway Editor',
    role: 'Lead Content Editor',
    bio: 'Tech specialist and document workflow expert. Helping users maximize efficiency and security in document handling.',
    avatar: 'PE',
    twitter: 'PDFRunway',
  },
  admin: {
    id: 'admin',
    name: 'PDFRunway Admin',
    role: 'Technical Director',
    bio: 'Developer and systems architect behind PDFRunway. Focused on bringing high-performance web assembly tools to the browser.',
    avatar: 'PA',
    github: 'PDFRunway',
  }
};

export function getAuthor(id: string): Author {
  return authors[id] || authors.editor;
}
