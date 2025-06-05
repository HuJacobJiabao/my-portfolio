import { marked } from 'marked';
import Prism from 'prismjs';

// Import essential language support (avoiding problematic dependencies)
import 'prismjs/components/prism-markup'; // Must be loaded first for HTML/XML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';

// Import custom Night Owl theme
import '../styles/prism-night-owl-theme.css';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface ParsedMarkdown {
  html: string;
  toc: TocItem[];
}

export async function parseMarkdown(content: string, removeMainTitle: boolean = false): Promise<ParsedMarkdown> {
  const toc: TocItem[] = [];
  let isFirstH1 = true;
  
  // Configure marked with custom renderer
  const renderer = {
    heading({ tokens, depth }: { tokens: any[]; depth: number }) {
      const text = tokens.map(token => token.raw || token.text || '').join('');
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      // Skip the first H1 if removeMainTitle is true
      if (removeMainTitle && depth === 1 && isFirstH1) {
        isFirstH1 = false;
        return '';
      }
      
      toc.push({
        id,
        title: text,
        level: depth
      });

      return `<h${depth} id="${id}">${text}</h${depth}>`;
    },
    code({ text, lang }: { text: string; lang?: string }) {
      // Map common language aliases (only for languages we've imported)
      const languageMap: { [key: string]: string } = {
        'js': 'javascript',
        'ts': 'typescript',
        'jsx': 'jsx',
        'tsx': 'tsx',
        'css': 'css',
        'json': 'json',
        'bash': 'bash',
        'shell': 'bash',
        'sh': 'bash',
        'md': 'markdown',
        'yaml': 'yaml',
        'yml': 'yaml',
        'html': 'markup',
        'xml': 'markup',
        'py': 'python',
        'c++': 'cpp',
        'sql': 'sql',
        'rust': 'rust',
        'rs': 'rust',
        'go': 'go',
        'golang': 'go'
      };

      const normalizedLang = lang ? languageMap[lang.toLowerCase()] || lang.toLowerCase() : 'text';
      const displayLang = lang || 'text';
      
      try {
        // Always try to highlight with Prism if language is available
        if (normalizedLang && Prism.languages[normalizedLang]) {
          const highlighted = Prism.highlight(text, Prism.languages[normalizedLang], normalizedLang);
          return `
            <div class="code-block-container">
              <div class="code-block-banner">
                <div class="code-block-controls">
                  <button class="code-block-toggle" title="Toggle code block">
                    <span class="toggle-icon">▼</span>
                  </button>
                  <span class="code-block-language">${displayLang}</span>
                </div>
                <button class="code-block-copy" title="Copy">
                  <span class="copy-icon">📄</span>
                </button>
              </div>
              <pre class="language-${normalizedLang} code-block-content"><code class="language-${normalizedLang}">${highlighted}</code></pre>
            </div>
          `;
        } else {
          // Fallback: escape HTML and return with basic styling
          const escapedText = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
          return `
            <div class="code-block-container">
              <div class="code-block-banner">
                <div class="code-block-controls">
                  <button class="code-block-toggle" title="Toggle code block">
                    <span class="toggle-icon">▼</span>
                  </button>
                  <span class="code-block-language">${displayLang}</span>
                </div>
                <button class="code-block-copy" title="Copy">
                  <span class="copy-icon">📄</span>
                </button>
              </div>
              <pre class="language-text code-block-content"><code class="language-text">${escapedText}</code></pre>
            </div>
          `;
        }
      } catch (error) {
        console.warn(`Failed to highlight code for language: ${normalizedLang}`, error);
        const escapedText = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
        return `
          <div class="code-block-container">
            <div class="code-block-banner">
              <div class="code-block-controls">
                <button class="code-block-toggle" title="Toggle code block">
                  <span class="toggle-icon">▼</span>
                </button>
                <span class="code-block-language">${displayLang}</span>
              </div>
              <button class="code-block-copy" title="Copy">
                <span class="copy-icon">📋</span>
              </button>
            </div>
            <pre class="language-text code-block-content"><code class="language-text">${escapedText}</code></pre>
          </div>
        `;
      }
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
