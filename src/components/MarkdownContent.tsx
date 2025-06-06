// Memoized Markdown Content Component
// Prevents re-rendering when sidebar state changes

import React, { useEffect } from 'react';
import type { ParsedMarkdown } from '../utils/markdown';
import { initializeCodeBlocks } from '../utils/codeBlock';
import { renderMermaidDiagrams } from '../utils/mermaidRenderer';
import styles from '../styles/DetailPage.module.css';

interface MarkdownContentProps {
  markdownData: ParsedMarkdown;
}

// Memoized component that only re-renders when markdown data actually changes
const MarkdownContent = React.memo<MarkdownContentProps>(({ 
  markdownData
}) => {
  // Initialize code blocks and mermaid diagrams whenever the markdown content changes
  useEffect(() => {
    console.log('MarkdownContent useEffect triggered');

    let rafId: number;

    const run = async () => {
      console.log('Initializing code blocks and mermaid diagrams...');
      initializeCodeBlocks();

      try {
        await renderMermaidDiagrams();
        console.log('Mermaid diagrams rendering completed');
      } catch (error) {
        console.error('Error rendering mermaid diagrams:', error);
      }
    };

    rafId = requestAnimationFrame(run);

    return () => cancelAnimationFrame(rafId);
  }, [markdownData.html]);

  return (
    <div 
      className={styles.markdownContent}
      dangerouslySetInnerHTML={{ __html: markdownData.html }}
    />
  );
});

MarkdownContent.displayName = 'MarkdownContent';

export default MarkdownContent;
