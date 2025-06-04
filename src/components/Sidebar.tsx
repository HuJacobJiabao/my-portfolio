import React from 'react';
import styles from '../styles/Sidebar.module.css';
import config from '../config/config';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  items?: { title: string; id?: string }[];
  itemType?: 'project' | 'blog' | 'archive';
  onItemClick?: (index: number) => void;
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
  onItemClick 
}) => {
  // Get all sections and visible sections from config (for Home page)
  const allSections = config.site.navigation.sections as NavigationSection[];
  const visibleSectionIds = config.site.navigation.visibleSections as string[];
  
  // Filter sections to only show the ones listed in visibleSections
  const sections = allSections.filter(section => 
    visibleSectionIds.includes(section.id)
  );

  // Determine what to show in navigation based on context
  const showItems = items.length > 0 && itemType;

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
            <h4>{itemType === 'project' ? 'Projects' : itemType === 'blog' ? 'Blog Posts' : 'Archive Items'}</h4>
            <nav className={styles.navList}>
              {items.map((item, index) => (
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
              ))}
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
