import type { ReactNode } from 'react';
import { useState } from 'react';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  sidebarItems?: { title: string; id?: string }[];
  sidebarItemType?: 'project' | 'blog' | 'archive';
  onSidebarItemClick?: (index: number) => void;
}

export default function Layout({ 
  children, 
  title, 
  sidebarItems, 
  sidebarItemType, 
  onSidebarItemClick 
}: LayoutProps) {
  const [activeSection, setActiveSection] = useState('about');

  return (
    <div className={styles.wrapper}>
      <NavBar />
      
      {title && (
        <header className={styles.pageHeader}>
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

      <footer className={styles.footer}>
        <div className={styles.footerText}>
          <p>© 2024 Made with ❤️ by Jiabao</p>
          <p>Built with React + TypeScript + Vite</p>
        </div>
      </footer>
    </div>
  );
}
