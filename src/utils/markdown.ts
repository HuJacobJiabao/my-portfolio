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
import 'prismjs/components/prism-latex';

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



// Footnote processing functions
interface Footnote {
  id: string;
  content: string;
  originalId?: string;
}

async function processFootnotes(content: string): Promise<{ content: string; footnotes: Footnote[] }> {
  const footnoteDefinitions = new Map<string, string>();
  const footnoteOrder: string[] = [];
  
  // First pass: extract footnote definitions
  const footnoteDefRegex = /^\[\^([^\]]+)\]: (.+)$/gm;
  let match;
  
  while ((match = footnoteDefRegex.exec(content)) !== null) {
    const [_, id, definition] = match;
    footnoteDefinitions.set(id.trim(), definition.trim());
  }
  
  // Remove footnote definitions from content
  content = content.replace(footnoteDefRegex, '');
  
  // Second pass: find all footnote references in order of appearance
  const footnoteRefRegex = /\[\^([^\]]+)\]/g;
  let refMatch;
  
  while ((refMatch = footnoteRefRegex.exec(content)) !== null) {
    const id = refMatch[1].trim();
    if (footnoteDefinitions.has(id) && !footnoteOrder.includes(id)) {
      footnoteOrder.push(id);
    }
  }
  
  // Replace footnote references with clickable links using sequential numbers
  const footnoteIdToNumber = new Map<string, number>();
  footnoteOrder.forEach((id, index) => {
    footnoteIdToNumber.set(id, index + 1);
  });

  content = content.replace(/\[\^([^\]]+)\]/g, (_match, id) => {
    const trimmedId = id.trim();
    const footnoteExists = footnoteDefinitions.has(trimmedId);
    const footnoteNumber = footnoteIdToNumber.get(trimmedId);
    
    if (footnoteExists && footnoteNumber) {
      return `<sup><a href="#footnote-${footnoteNumber}" id="footnote-ref-${footnoteNumber}-${trimmedId}" class="footnote-ref" title="Go to footnote">${footnoteNumber}</a></sup>`;
    } else {
      return `<sup><span class="footnote-error" title="Footnote not found">${trimmedId}</span></sup>`;
    }
  });
  
  // Process footnote definitions in order of appearance
  const footnotes: Footnote[] = [];
  for (let i = 0; i < footnoteOrder.length; i++) {
    const id = footnoteOrder[i];
    const definition = footnoteDefinitions.get(id);
    const number = i + 1;
    
    if (definition) {
      // Process the footnote definition content to support markdown formatting
      let processedContent = definition;
      
      // Process math equations in footnote content
      processedContent = processedContent.replace(/\$\$([^$]+?)\$\$/g, (_, math) => {
        return renderMath(math.trim(), true);
      });
      processedContent = processedContent.replace(/\$([^$]+?)\$/g, (_, math) => {
        return renderMath(math.trim(), false);
      });
      
      // Process inline markdown formatting
      processedContent = await marked.parseInline(processedContent);
      
      footnotes.push({
        id: number.toString(),
        content: processedContent,
        originalId: id
      });
    }
  }
  
  return { content, footnotes };
}

function processDefinitionLists(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];

  let i = 0;
  while (i < lines.length) {
    const termLine = lines[i];
    const nextLine = lines[i + 1] || '';

    // 检测 Definition List 的起始格式
    if (termLine.trim() !== '' && nextLine.trim().startsWith(':')) {
      const dt = marked.parseInline(termLine.trim());
      const ddList: string[] = [];

      // 向下收集连续的定义项
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith(':')) {
        const raw = lines[i + 1].trim().replace(/^:\s*/, '');
        const parsed = marked.parseInline(raw);
        ddList.push(`<dd>${parsed}</dd>`);
        i++;
      }

      result.push('<dl class="definition-list">');
      result.push(`<dt>${dt}</dt>`);
      result.push(...ddList);
      result.push('</dl>');
      i++;
    } else {
      result.push(termLine);
      i++;
    }
  }

  return result.join('\n');
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface ParsedMarkdown {
  html: string;
  toc: TocItem[];
  createTime?: string;
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
    // Skip createTime as we'll handle it separately in the component
    if (key === 'createTime') {
      return;
    }
    
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    processedContent = processedContent.replace(regex, String(value));
  });

  // STEP 1: Process definition lists first
  processedContent = processDefinitionLists(processedContent);
  
  // STEP 2: Process math equations with placeholders, avoiding code blocks
  const mathPlaceholders: Map<string, string> = new Map();
  
  // Create a more sophisticated math processing that avoids code blocks
  function processMathOutsideCodeBlocks(content: string): string {
    // Split content by code blocks and inline code to avoid processing math inside them
    const parts: Array<{content: string, isCode: boolean}> = [];
    
    // First, split by fenced code blocks
    const codeBlockRegex = /```[\s\S]*?```/g;
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add content before code block
      if (match.index > lastIndex) {
        parts.push({
          content: content.slice(lastIndex, match.index),
          isCode: false
        });
      }
      // Add code block
      parts.push({
        content: match[0],
        isCode: true
      });
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining content
    if (lastIndex < content.length) {
      parts.push({
        content: content.slice(lastIndex),
        isCode: false
      });
    }
    
    // Now process each non-code part for inline code and math
    return parts.map(part => {
      if (part.isCode) {
        return part.content; // Don't process math in code blocks
      }
      
      // For non-code parts, split by inline code and process math
      const inlineCodeRegex = /`([^`\n]+?)`/g;
      const subParts: Array<{content: string, isCode: boolean}> = [];
      let subLastIndex = 0;
      let subMatch;
      
      while ((subMatch = inlineCodeRegex.exec(part.content)) !== null) {
        // Add content before inline code
        if (subMatch.index > subLastIndex) {
          subParts.push({
            content: part.content.slice(subLastIndex, subMatch.index),
            isCode: false
          });
        }
        // Add inline code
        subParts.push({
          content: subMatch[0],
          isCode: true
        });
        subLastIndex = subMatch.index + subMatch[0].length;
      }
      
      // Add remaining content
      if (subLastIndex < part.content.length) {
        subParts.push({
          content: part.content.slice(subLastIndex),
          isCode: false
        });
      }
      
      // Process math only in non-code subparts
      return subParts.map(subPart => {
        if (subPart.isCode) {
          return subPart.content; // Don't process math in inline code
        }
        
        // Process math in this non-code content
        let mathProcessedContent = subPart.content;
        
        // Process display math ($$...$$)
        mathProcessedContent = mathProcessedContent.replace(/\$\$([\s\S]*?)\$\$/g, (_match, equation) => {
          const placeholderId = `MATH_DISPLAY_${Math.random().toString(36).substring(2, 11)}`;
          mathPlaceholders.set(placeholderId, renderMath(equation.trim(), true));
          return `<!-- ${placeholderId} -->`;
        });
        
        // Process inline math ($...$) - avoid already processed display math
        mathProcessedContent = mathProcessedContent.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, (_match, equation) => {
          const placeholderId = `MATH_INLINE_${Math.random().toString(36).substring(2, 11)}`;
          mathPlaceholders.set(placeholderId, renderMath(equation.trim(), false));
          return `<!-- ${placeholderId} -->`;
        });
        
        return mathProcessedContent;
      }).join('');
    }).join('');
  }
  
  processedContent = processMathOutsideCodeBlocks(processedContent);
  
  // STEP 3: Process highlighted text with placeholders to avoid interference with marked.js
  const highlightPlaceholders: Map<string, string> = new Map();
  let highlightCounter = 0;
  
  // First collect all highlight matches
  const highlightMatches: Array<{ match: string; text: string; placeholderId: string }> = [];
  const highlightRegex = /==([^=]+?)==/g;
  let match;
  
  while ((match = highlightRegex.exec(processedContent)) !== null) {
    const placeholderId = `HIGHLIGHT_${highlightCounter++}_${Math.random().toString(36).substr(2, 9)}`;
    highlightMatches.push({
      match: match[0],
      text: match[1].trim(),
      placeholderId
    });
  }
  
  // Process each highlight text as inline markdown and store in placeholders
  for (const { match, text, placeholderId } of highlightMatches) {
    const processedText = await marked.parseInline(text);
    const highlightHtml = `<mark class="highlighted-text">${processedText}</mark>`;
    highlightPlaceholders.set(placeholderId, highlightHtml);
    processedContent = processedContent.replace(match, `<!-- ${placeholderId} -->`);
  }
  
  // STEP 4: Process footnotes
  const { content: contentWithFootnotes, footnotes } = await processFootnotes(processedContent);
  processedContent = contentWithFootnotes;
  
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
        'golang': 'go',
        'latex': 'latex',
        'tex': 'latex'
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
    
    // STEP 2: Restore math equations
    finalHtml = finalHtml.replace(/<!-- (MATH_(?:DISPLAY|INLINE)_[a-z0-9]+) -->/g, (match, placeholderId) => {
      const mathHtml = mathPlaceholders.get(placeholderId);
      if (mathHtml) {
        return mathHtml;
      }
      console.warn('Math placeholder not found:', match, placeholderId);
      return match; // fallback to original placeholder if not found
    });
    
    // STEP 3: Restore highlight text
    finalHtml = finalHtml.replace(/<!-- (HIGHLIGHT_[a-z0-9_]+) -->/g, (match, placeholderId) => {
      const highlightHtml = highlightPlaceholders.get(placeholderId);
      if (highlightHtml) {
        return highlightHtml;
      }
      console.warn('Highlight placeholder not found:', match, placeholderId);
      return match; // fallback to original placeholder if not found
    });
    
    // Append footnotes to the end of content if there are any
    if (footnotes && footnotes.length > 0) {
      const footnotesSection = `
        <hr class="footnote-divider">
        <section class="footnotes">
          <h3 class="footnotes-title">Footnotes</h3>
          <ol class="footnotes-list">
            ${footnotes.map(fn => `
              <li id="footnote-${fn.id}" class="footnote-item">
                <p>${fn.content} <a href="#footnote-ref-${fn.id}-${fn.originalId || fn.id}" class="footnote-backref" title="Go back to text">↩</a></p>
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
      toc,
      createTime: frontmatter.createTime
    };
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return {
      html: '<p>Error parsing markdown content</p>',
      toc: [],
      createTime: undefined
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
