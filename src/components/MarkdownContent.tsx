// Memoized Markdown Content Component
// Prevents re-rendering when sidebar state changes

import React from 'react';
import type { ParsedMarkdown } from '../utils/markdown';
import styles from '../styles/DetailPage.module.css';

interface MarkdownContentProps {
  markdownData: ParsedMarkdown;
  contentItemTitle: string;
  contentItemDate: string;
  contentItemTags: string[];
  contentType: 'project' | 'blog';
  contentItemCategory: string;
}

// Memoized component that only re-renders when markdown data actually changes
const MarkdownContent = React.memo<MarkdownContentProps>(({ 
  markdownData, 
  contentItemTitle,
  contentItemDate,
  contentItemTags,
  contentType,
  contentItemCategory
}) => {
  return (
    <>
      <header className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>{contentItemTitle}</h1>
        <div className={styles.contentMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Type:</span>
            <span className={styles.metaValue}>{contentType === 'project' ? '💻 Project' : '📝 Blog Post'}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Category:</span>
            <span className={styles.metaValue}>{contentItemCategory}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Created:</span>
            <span className={styles.metaValue}>{contentItemDate}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Tags:</span>
            <div className={styles.tags}>
              {contentItemTags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </header>
      <div 
        className={styles.markdownContent}
        dangerouslySetInnerHTML={{ __html: markdownData.html }}
      />
    </>
  );
});

MarkdownContent.displayName = 'MarkdownContent';

export default MarkdownContent;
