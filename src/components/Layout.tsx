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
}

export default function Layout({ 
  children, 
  title, 
  headerBackground,
  sidebarItems, 
  sidebarItemType, 
  onSidebarItemClick,
  activeItemId
}: LayoutProps) {
  const [activeSection, setActiveSection] = useState('about');

  const headerStyle = headerBackground ? {
    backgroundImage: `url('${headerBackground}')`
  } : undefined;

  return (
    <div className={styles.wrapper}>
      <NavBar />
      
      {title && (
        <header className={styles.pageHeader} style={headerStyle}>
          <h1>{title}</h1>
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
