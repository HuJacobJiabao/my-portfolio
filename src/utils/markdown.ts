import { marked } from 'marked';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface ParsedMarkdown {
  html: string;
  toc: TocItem[];
}

export async function parseMarkdown(content: string): Promise<ParsedMarkdown> {
  const toc: TocItem[] = [];
  
  // Configure marked with custom renderer
  const renderer = {
    heading({ tokens, depth }: { tokens: any[]; depth: number }) {
      const text = tokens.map(token => token.raw || token.text || '').join('');
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      toc.push({
        id,
        title: text,
        level: depth
      });

      return `<h${depth} id="${id}">${text}</h${depth}>`;
    }
  };

  // Configure marked options
  marked.use({
    renderer,
    gfm: true,
    breaks: true
  });

  try {
    const html = await marked.parse(content);
    
    return {
      html: typeof html === 'string' ? html : '',
      toc
    };
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return {
      html: '<p>Error parsing markdown content</p>',
      toc: []
    };
  }
}

export async function fetchMarkdownContent(path: string): Promise<string> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching markdown content:', error);
    return '# Content Not Found\n\nThe requested content could not be loaded.';
  }
}
