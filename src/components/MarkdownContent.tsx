// Memoized Markdown Content Component
// Prevents re-rendering when sidebar state changes

import React, { useEffect } from 'react';
import type { ParsedMarkdown } from '../utils/markdown';
import { initializeCodeBlocks } from '../utils/codeBlock';
import styles from '../styles/DetailPage.module.css';

interface MarkdownContentProps {
  markdownData: ParsedMarkdown;
}

// Memoized component that only re-renders when markdown data actually changes
const MarkdownContent = React.memo<MarkdownContentProps>(({ 
  markdownData
}) => {
  // Initialize code blocks whenever the markdown content changes
  useEffect(() => {
    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      initializeCodeBlocks();
    }, 50);
    
    return () => clearTimeout(timeoutId);
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
