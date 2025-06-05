import type { ReactNode } from 'react';
import { useState } from 'react';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import styles from '../styles/Layout.module.css';
import ScrollToTop from './ScrollToTop';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  headerBackground?: string;
  sidebarItems?: { title: string; id?: string }[];
  sidebarItemType?: 'project' | 'blog' | 'archive' | 'toc';
  onSidebarItemClick?: (index: number) => void;
  activeItemId?: string;
  contentType?: 'project' | 'blog';
  // Metadata props for project/blog pages
  contentItemDate?: string;
  contentItemTags?: string[];
  contentItemCategory?: string;
  contentItemLastUpdate?: string;
}

export default function Layout({ 
  children, 
  title, 
  headerBackground,
  sidebarItems, 
  sidebarItemType, 
  onSidebarItemClick,
  activeItemId,
  contentItemDate,
  contentItemTags,
  contentType,
  contentItemCategory,
  contentItemLastUpdate
}: LayoutProps) {
  const [activeSection, setActiveSection] = useState('about');

  const headerStyle = headerBackground ? {
    backgroundImage: `url('${headerBackground}')`
  } : undefined;

  // Function to get dynamic title class based on title length
  const getTitleClasses = () => {
    if (!title || !contentType) return `${styles.pageTitle}`;
    
    const baseClass = `${styles.pageTitle} ${styles.articleTitle}`;
    const titleLength = title.length;
    
    // 提高阈值，让标题更多时候保持大字体，优先分行显示
    if (titleLength > 120) return `${baseClass} ${styles.superLong}`;  // 从80提高到120
    if (titleLength > 100) return `${baseClass} ${styles.extraLong}`;  // 从60提高到100
    if (titleLength > 80) return `${baseClass} ${styles.veryLong}`;    // 从40提高到80
    
    return baseClass;
  };

  return (
    <div className={styles.wrapper}>
      <NavBar />
      
      {title && (
        <header className={styles.pageHeader} style={headerStyle}>
          <div className={styles.headerContent}>
            <div className={styles.titleArea}>
              <h1 className={getTitleClasses()}>{title}</h1>
            </div>
            {contentType && (
              <>
                <div className={styles.metadataArea}>
                  <div className={styles.headerMeta}>
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
                    {contentItemLastUpdate && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Last Update:</span>
                        <span className={styles.metaValue}>{contentItemLastUpdate}</span>
                      </div>
                    )}
                  </div>
                </div>
                {contentItemTags && contentItemTags.length > 0 && (
                  <div className={styles.tagsArea}>
                    <div className={styles.headerTags}>
                      {contentItemTags.map((tag, index) => (
                        <span key={index} className={styles.headerTag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </header>
      )}
      
      <main className={styles.main}>
        <div className={styles.aboutWrapper}>
          <div className={styles.aboutContainer}>
            <Sidebar 
              activeSection={activeSection} 
              onSectionChange={setActiveSection}
              items={sidebarItems}
              itemType={sidebarItemType}
              onItemClick={onSidebarItemClick}
              activeItemId={activeItemId}
            />
            
            <div className={styles.rightContentArea}>
              <div className={styles.rightContent}>
                <div className={styles.content}>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
