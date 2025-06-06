import { marked } from 'marked';
import Prism from 'prismjs';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import katex from 'katex';

// Make Buffer available globally for gray-matter
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

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
// Import KaTeX CSS for math rendering
import 'katex/dist/katex.min.css';

// We'll be using the mermaidRenderer.ts file for runtime rendering

// Math rendering function using KaTeX
function renderMath(text: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(text, {
      displayMode,
      throwOnError: false,
      errorColor: '#cc0000',
      strict: 'warn',
      trust: false
    });
  } catch (error) {
    console.warn('KaTeX rendering error:', error);
    return `<span class="katex-error" title="Math rendering error">${text}</span>`;
  }
}

// Process math equations in markdown content
function processMathEquations(content: string): string {
  // Process display math ($$...$$)
  content = content.replace(/\$\$([^$]+?)\$\$/g, (_match, equation) => {
    return renderMath(equation.trim(), true);
  });
  
  // Process inline math ($...$) - but avoid already processed display math
  content = content.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, (_match, equation) => {
    return renderMath(equation.trim(), false);
  });
  
  return content;
}

// Process highlighted text (==text==)
function processHighlightedText(content: string): string {
  // Replace ==highlighted text== with <mark>highlighted text</mark>
  return content.replace(/==([^=]+?)==/g, (_match, text) => {
    return `<mark class="highlighted-text">${text.trim()}</mark>`;
  });
}

// Footnote processing functions
interface Footnote {
  id: string;
  content: string;
}

function processFootnotes(content: string): { content: string; footnotes: Footnote[] } {
  const footnotes: Footnote[] = [];
  const footnoteRefs = new Set<string>();
  
  // First pass: extract footnote definitions and collect references
  const footnoteDefRegex = /^\[\^([^\]]+)\]: (.+)$/gm;
  let match;
  
  while ((match = footnoteDefRegex.exec(content)) !== null) {
    const [_, id, definition] = match;
    footnotes.push({
      id: id.trim(),
      content: definition.trim()
    });
  }
  
  // Remove footnote definitions from content
  content = content.replace(footnoteDefRegex, '');
  
  // Second pass: find all footnote references in the content
  const footnoteRefRegex = /\[\^([^\]]+)\]/g;
  let refMatch;
  
  while ((refMatch = footnoteRefRegex.exec(content)) !== null) {
    const id = refMatch[1].trim();
    footnoteRefs.add(id);
  }
  
  // Replace footnote references with clickable links
  content = content.replace(/\[\^([^\]]+)\]/g, (_match, id) => {
    const trimmedId = id.trim();
    const footnoteExists = footnotes.some(fn => fn.id === trimmedId);
    
    if (footnoteExists) {
      return `<sup><a href="#footnote-${trimmedId}" id="footnote-ref-${trimmedId}" class="footnote-ref" title="Go to footnote">${trimmedId}</a></sup>`;
    } else {
      return `<sup><span class="footnote-error" title="Footnote not found">${trimmedId}</span></sup>`;
    }
  });
  
  // Filter footnotes to only include those that are referenced
  const referencedFootnotes = footnotes.filter(fn => footnoteRefs.has(fn.id));
  
  return { content, footnotes: referencedFootnotes };
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface ParsedMarkdown {
  html: string;
  toc: TocItem[];
}

export async function parseMarkdown(
  content: string, 
  removeMainTitle: boolean = false,
  assetMap?: Map<string, string> // Map of original paths to resolved asset URLs
): Promise<ParsedMarkdown> {
  const toc: TocItem[] = [];
  let isFirstH1 = true;
  
  // Parse frontmatter and body using gray-matter
  const parsed = matter(content);
  const frontmatter = parsed.data;
  const bodyContent = parsed.content;
  
  // Process template variables in body content using frontmatter values
  let processedContent = bodyContent;
  Object.entries(frontmatter).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    
    // Special handling for createTime - format as yyyy-mm-dd for display
    if (key === 'createTime' && value) {
      const formattedDate = new Date(value as string).toISOString().split('T')[0];
      processedContent = processedContent.replace(regex, formattedDate);
    } else {
      processedContent = processedContent.replace(regex, String(value));
    }
  });

  // Process math equations before markdown parsing
  processedContent = processMathEquations(processedContent);
  
  // Process highlighted text (must be done before footnotes to avoid interference)
  processedContent = processHighlightedText(processedContent);
  
  // Process footnotes
  const { content: contentWithFootnotes, footnotes } = processFootnotes(processedContent);
  processedContent = contentWithFootnotes;
  
  // Store footnotes for later use when rendering the final HTML
  
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
    image(token: any) {
      const { href, title, text } = token;
      // If we have an asset map and the href is in it, use the resolved URL
      const resolvedHref = assetMap?.get(href) || href;
      
      const titleAttr = title ? ` title="${title}"` : '';
      return `<img src="${resolvedHref}" alt="${text}"${titleAttr} loading="lazy" />`;
    },
    code({ text, lang }: { text: string; lang?: string }) {
      // Special handling for mermaid diagrams
      if (typeof lang === 'string' && lang.trim().toLowerCase() === 'mermaid') {
          const cleanedText = (text || '').trim();
          if (!cleanedText) {
            return `<div class="mermaid-container"><div class="mermaid-error">Empty mermaid diagram.</div></div>`;
          }

          // debugger;
          const diagramId = `mermaid-diagram-${Math.random().toString(36).substring(2, 11)}`;
          return `
            <div class="mermaid-container">
              <div class="mermaid-diagram" id="${diagramId}">
                <pre class="mermaid">${cleanedText}</pre>
              </div>
              <div class="mermaid-loading">Loading diagram...</div>
            </div>
          `;
      }
      
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
    const html = await marked.parse(processedContent);
    
    // Post-process the HTML to resolve all relative asset paths
    let finalHtml = typeof html === 'string' ? html : '';
    
    // Append footnotes to the end of content if there are any
    if (footnotes && footnotes.length > 0) {
      const footnotesSection = `
        <hr class="footnote-divider">
        <section class="footnotes">
          <h3 class="footnotes-title">Footnotes</h3>
          <ol class="footnotes-list">
            ${footnotes.map(fn => `
              <li id="footnote-${fn.id}" class="footnote-item">
                <p>${fn.content} <a href="#footnote-ref-${fn.id}" class="footnote-backref" title="Go back to text">↩</a></p>
              </li>
            `).join('')}
          </ol>
        </section>
      `;
      finalHtml += footnotesSection;
    }
    
    if (assetMap && assetMap.size > 0) {
      // Replace all relative paths in HTML img src attributes
      finalHtml = finalHtml.replace(
        /<img([^>]*)\ssrc=["']([^"']*?)["']([^>]*)>/gi,
        (_fullMatch, before, src, after) => {
          const resolvedSrc = assetMap.get(src) || src;
          return `<img${before} src="${resolvedSrc}"${after}>`;
        }
      );
      
      // Replace all relative paths in HTML a href attributes (for downloads, etc.)
      finalHtml = finalHtml.replace(
        /<a([^>]*)\shref=["']([^"']*?)["']([^>]*)>/gi,
        (fullMatch, before, href, after) => {
          // Only replace if it's a relative path that exists in our asset map
          if (assetMap.has(href)) {
            const resolvedHref = assetMap.get(href);
            return `<a${before} href="${resolvedHref}"${after}>`;
          }
          return fullMatch;
        }
      );
      
      // Replace all relative paths in CSS url() functions within style attributes
      finalHtml = finalHtml.replace(
        /style=["']([^"']*?)["']/gi,
        (_fullMatch, styleContent) => {
          const updatedStyle = styleContent.replace(
            /url\(["']?([^"')]*?)["']?\)/gi,
            (_urlMatch: string, urlPath: string) => {
              const resolvedUrl = assetMap.get(urlPath) || urlPath;
              return `url("${resolvedUrl}")`;
            }
          );
          return `style="${updatedStyle}"`;
        }
      );
    }
    
    return {
      html: finalHtml,
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
