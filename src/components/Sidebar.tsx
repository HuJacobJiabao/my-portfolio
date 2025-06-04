import React, { useState, useEffect } from 'react';
import styles from '../styles/Sidebar.module.css';
import config from '../config/config';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  items?: { title: string; id?: string; level?: number }[];
  itemType?: 'project' | 'blog' | 'archive' | 'toc';
  onItemClick?: (index: number) => void;
  activeItemId?: string; // For tracking which TOC item is currently active
}

interface NavigationSection {
  id: string;
  title: string;
  icon: string;
  type: string;
  contentType?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  items = [], 
  itemType,
  onItemClick,
  activeItemId
}) => {
  // State for tracking expanded sections in TOC
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Get all sections and visible sections from config (for Home page)
  const allSections = config.site.navigation.sections as NavigationSection[];
  const visibleSectionIds = config.site.navigation.visibleSections as string[];
  
  // Filter sections to only show the ones listed in visibleSections
  const sections = allSections.filter(section => 
    visibleSectionIds.includes(section.id)
  );

  // Helper function to prepare TOC items without adding numbers
  const prepareTocItems = (items: any[]) => {
    return items.map(item => ({
      ...item,
      level: item.level || 1
    }));
  };

  // Function to find parent sections of a given item
  const findParentSections = (items: any[], targetIndex: number): string[] => {
    const parents: string[] = [];
    const targetLevel = items[targetIndex]?.level || 1;
    
    // Look backwards from the target item to find parents
    for (let i = targetIndex - 1; i >= 0; i--) {
      const item = items[i];
      if (item.level < targetLevel) {
        parents.unshift(item.id || `item-${i}`);
        // Continue looking for higher-level parents
        if (item.level === 1) break;
      }
    }
    
    return parents;
  };

  // Auto-expand sections when activeItemId changes
  useEffect(() => {
    if (activeItemId && itemType === 'toc' && items.length > 0) {
      const preparedItems = prepareTocItems(items);
      const activeIndex = preparedItems.findIndex(item => item.id === activeItemId);
      
      if (activeIndex !== -1) {
        const parents = findParentSections(preparedItems, activeIndex);
        const newExpanded = new Set([...parents, activeItemId]);
        setExpandedSections(newExpanded);
      }
    }
  }, [activeItemId, itemType, items]);

  // Function to check if an item should be visible
  const isItemVisible = (item: any, index: number): boolean => {
    if (itemType !== 'toc') return true;
    if (item.level === 1) return true; // Top-level items always visible
    
    const preparedItems = prepareTocItems(items);
    const parents = findParentSections(preparedItems, index);
    
    // Item is visible if all its parents are expanded
    return parents.every(parentId => expandedSections.has(parentId));
  };

  // Determine what to show in navigation based on context
  const showItems = items.length > 0 && itemType;

  // Prepare TOC items without automatic numbering
  const preparedItems = itemType === 'toc' && items ? prepareTocItems(items) : items;

  return (
    <div className={styles.leftSidebar}>
      {/* Profile Card with Integrated Contact Info */}
      <div className={styles.profileCard}>
        <div className={styles.photoWrapper}>
          <img src={`${import.meta.env.BASE_URL}favicon.png`} alt={config.site.hero.name} className={styles.photo} />
        </div>
        <h3 className={styles.profileName}>{config.site.hero.name}</h3>
        <p className={styles.profileTitle}>{config.site.hero.title}</p>
        <p className={styles.profileTitle}>{config.site.hero.subtitle}</p>
        <div className={styles.contactCard}>
          <div className={styles.contactList}>
            <a href={`mailto:${config.site.contactInfo.email}`} className={styles.contactItem}>
              <i className="fas fa-envelope"></i>
            </a>
            <a href={config.site.contactInfo.github} className={styles.contactItem}>
              <i className="fab fa-github"></i>
            </a>
            <a href={config.site.contactInfo.linkedin} className={styles.contactItem}>
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className={styles.navigationCard}>
        {showItems ? (
          <>
            <h4>{itemType === 'project' ? 'Projects' : itemType === 'blog' ? 'Blog Posts' : itemType === 'toc' ? 'Catalog' : 'Archive Items'}</h4>
            <nav className={styles.navList}>
              {itemType === 'toc' ? (
                // Special rendering for TOC with tree structure, nesting and expand/collapse
                preparedItems?.map((item: any, index: number) => {
                  const itemId = item.id || `item-${index}`;
                  const isActive = activeItemId === itemId;
                  const isVisible = isItemVisible(item, index);
                  
                  if (!isVisible) return null;
                  
                  return (
                    <div key={index} className={styles.tocItemContainer}>
                      <button
                        className={`${styles.navItem} ${styles.tocItem} ${styles[`tocLevel${item.level}`]} ${isActive ? styles.active : ''}`}
                        onClick={() => onItemClick && onItemClick(index)}
                        title={item.title}
                      >
                        <div className={styles.tocItemContent}>
                          <span className={styles.tocTitle}>{item.title}</span>
                        </div>
                      </button>
                    </div>
                  );
                })
              ) : (
                // Default rendering for other item types
                items?.map((item, index) => (
                  <button
                    key={index}
                    className={`${styles.navItem} ${styles.itemNavItem}`}
                    onClick={() => onItemClick && onItemClick(index)}
                    title={item.title}
                  >
                    <span className={styles.navIcon}>
                      {itemType === 'project' ? '💻' : itemType === 'blog' ? '📝' : '📁'}
                    </span>
                    <span className={styles.itemTitle}>{item.title}</span>
                  </button>
                ))
              )}
            </nav>
          </>
        ) : (
          <>
            <h4>Navigation</h4>
            <nav className={styles.navList}>
              {sections.map(section => (
                <button
                  key={section.id}
                  className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                  onClick={() => onSectionChange(section.id)}
                >
                  <span className={styles.navIcon}>{section.icon}</span>
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
