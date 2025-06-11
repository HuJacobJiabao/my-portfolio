import React, { useState, useEffect } from 'react';
import styles from '../styles/MobileTabs.module.css';
import config from '../config/config';

interface MobileTabsProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

interface NavigationSection {
  title: string;
  icon: string;
  type: string;
  content?: string;
  items?: any[];
}

const MobileTabs: React.FC<MobileTabsProps> = ({ activeSection, onSectionChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  // Get navigation sections from config
  const navigationSections = Object.entries(config.home.navigation) as [string, NavigationSection][];

  useEffect(() => {
    // Show tabs when page is scrolled up to given distance (same as ScrollToTop)
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        if (!shouldRender) {
          setShouldRender(true);
        }
      } else {
        if (shouldRender) {
          setIsExpanded(false); // Reset expanded state when hiding
          setTimeout(() => setShouldRender(false), 300); // Wait for animation to complete
        }
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [shouldRender]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Only show when scrolled down enough (same condition as ScrollToTop button)
  if (!shouldRender) {
    return null;
  }

  return (
    <div className={styles.mobileTabsContainer}>
      {/* Toggle Button */}
      <button
        className={`${styles.toggleButton} ${isExpanded ? styles.expanded : ''}`}
        onClick={toggleExpanded}
        aria-label={isExpanded ? "Collapse navigation tabs" : "Expand navigation tabs"}
        title={isExpanded ? "Collapse tabs" : "Expand tabs"}
      >
        <span className={styles.toggleIcon}>
          {isExpanded ? '✕' : '☰'}
        </span>
      </button>

      {/* Navigation Tabs */}
      {isExpanded && (
        <div className={styles.tabsWrapper}>
          {navigationSections.map(([sectionId, section], index) => (
            <button
              key={sectionId}
              className={`${styles.tabIcon} ${activeSection === sectionId ? styles.active : ''}`}
              onClick={() => onSectionChange(sectionId)}
              aria-label={`Switch to ${section.title} section`}
              style={{ 
                top: `${45 + index * 5}%`,
                animationDelay: `${0.1 + index * 0.1}s`
              }}
              title={section.title}
            >
              {section.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileTabs;
