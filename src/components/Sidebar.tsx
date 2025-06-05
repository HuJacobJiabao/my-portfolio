import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Sidebar.module.css';
import config from '../config/config';
import { useNavbarState } from '../hooks/useNavbarState';

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

const Sidebar: React.FC<SidebarProps> = React.memo(({ 
  activeSection, 
  onSectionChange, 
  items = [], 
  itemType,
  onItemClick,
  activeItemId
}) => {
  // Get navbar state for synchronized positioning
  const { visible: navbarVisible } = useNavbarState();
  
  // State for sticky navigation card
  const [isSticky, setIsSticky] = useState(false);
  const [originalCardTop, setOriginalCardTop] = useState<number | null>(null); // D: original absolute position (constant)
  const [currentCardTop, setCurrentCardTop] = useState<number | null>(null); // d1: current absolute position (changes with animation)
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  const [cardLeft, setCardLeft] = useState<number | null>(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0); // Track previous scroll position
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigationCardRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  
  // Throttling variable for scroll events
  let scrollTicking = false;

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

  // Sticky navigation card effect
  useEffect(() => {
    const measureCardPosition = () => {
      if (!navigationCardRef.current || !sidebarRef.current) return;
      
      // Only measure when card is in its natural (non-sticky) position
      if (isSticky) return;
      
      const cardRect = navigationCardRef.current.getBoundingClientRect();
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // D: original absolute position from page top (constant)
      const absoluteTop = cardRect.top + scrollTop;
      
      // Get computed style to ensure we capture the actual rendered width
      const actualWidth = navigationCardRef.current.offsetWidth;
      
      // Use sidebar's left position as the base reference for more stable positioning
      // This ensures the sticky card aligns perfectly with the sidebar
      const leftPosition = sidebarRect.left;
      
      if (originalCardTop === null) {
        setOriginalCardTop(absoluteTop); // D: 只设置一次，作为常量
      }
      setCurrentCardTop(absoluteTop); // d1: 当前绝对位置，会因动画而改变
      setCardWidth(actualWidth);
      setCardLeft(leftPosition);
    };

    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        // Disable sticky on mobile
        if (isSticky) {
          setIsSticky(false);
        }
        return;
      }

      if (!navigationCardRef.current || !sidebarRef.current) return;

      // If we don't have the original measurements yet, try to measure them now
      if (originalCardTop === null || cardLeft === null) {
        // Only try to measure if we're not in sticky mode
        if (!isSticky) {
          measureCardPosition();
        }
        return;
      }

      // Throttle scroll events using requestAnimationFrame
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
          
          // Detect scroll direction
          const scrollingUp = currentScrollPos < prevScrollPos;
          setPrevScrollPos(currentScrollPos);

          // 重新测量当前card的位置（d1），因为动画会改变位置
          if (isSticky && navigationCardRef.current) {
            const rect = navigationCardRef.current.getBoundingClientRect();
            const newCurrentTop = rect.top + currentScrollPos;
            setCurrentCardTop(newCurrentTop);
          }

          // 使用最新的currentCardTop或初始测量值
          const cardTopToUse = currentCardTop || originalCardTop;
          if (!cardTopToUse) return;

          // d2: current distance from viewport top
          const d2 = cardTopToUse - currentScrollPos;
          
          // Required minimum distances
          const minDistanceDown = 20; // 下拉时最小距离
          const minDistanceUp = 80;   // 上拉时最小距离（为navbar预留空间）
          
          const requiredDistance = scrollingUp ? minDistanceUp : minDistanceDown;
          
          // Should be sticky when d2 becomes less than required distance
          const shouldBeSticky = d2 <= requiredDistance;
          
          // Should stop being sticky when scrolled back to original position
          // 检查是否回到了原始位置（D）附近
          const distanceFromOriginal = originalCardTop - currentScrollPos;
          const shouldStopSticky = distanceFromOriginal > requiredDistance;

          if (!isSticky && shouldBeSticky) {
            setIsSticky(true);
          } else if (isSticky && shouldStopSticky) {
            setIsSticky(false);
          }
          
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    const handleResize = () => {
      // Reset sticky state and remeasure on resize
      setIsSticky(false);
      setOriginalCardTop(null);
      setCurrentCardTop(null);
      setCardWidth(null);
      setCardLeft(null);
      
      // Remeasure after a short delay to allow layout to stabilize
      setTimeout(measureCardPosition, 100);
    };

    // Initial measurement with better timing
    // Use multiple attempts to ensure we get the correct measurement
    const performInitialMeasurement = () => {
      // Wait for layout to stabilize, then measure multiple times
      setTimeout(() => {
        measureCardPosition();
        // Second measurement to ensure consistency
        setTimeout(measureCardPosition, 50);
        // Third measurement after a longer delay for complex layouts
        setTimeout(measureCardPosition, 200);
      }, 50);
    };

    performInitialMeasurement();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    // Also listen for DOMContentLoaded and load events to ensure proper measurement
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', performInitialMeasurement);
    }
    window.addEventListener('load', performInitialMeasurement);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('DOMContentLoaded', performInitialMeasurement);
      window.removeEventListener('load', performInitialMeasurement);
    };
  }, [isSticky, originalCardTop, currentCardTop, prevScrollPos, navbarVisible]);

  // Function to render nested TOC with visual hierarchy and connection lines
  const renderNestedTOC = (items: any[]): React.ReactElement | null => {
    if (!items || items.length === 0) return null;

    // Group items by level 2 sections
    const groupedItems: { [key: string]: any[] } = {};
    let currentLevel2: string | null = null;

    items.forEach((item, index) => {
      if (item.level === 1) {
        // Level 1 items are always shown independently
        const key = `level1-${index}`;
        groupedItems[key] = [{ ...item, originalIndex: index }];
      } else if (item.level === 2) {
        // Start a new level 2 group
        currentLevel2 = item.id || `item-${index}`;
        groupedItems[currentLevel2!] = [{ ...item, originalIndex: index }];
      } else if (item.level > 2 && currentLevel2) {
        // Add to current level 2 group
        groupedItems[currentLevel2!].push({ ...item, originalIndex: index });
      }
    });

    // Find which level 2 section should be expanded based on activeItemId
    let expandedLevel2: string | null = null;
    if (activeItemId) {
      const activeItem = items.find(item => item.id === activeItemId);
      if (activeItem) {
        if (activeItem.level === 2) {
          expandedLevel2 = activeItemId;
        } else if (activeItem.level > 2) {
          // Find the parent level 2 section
          const activeIndex = items.findIndex(item => item.id === activeItemId);
          for (let i = activeIndex - 1; i >= 0; i--) {
            if (items[i].level === 2) {
              expandedLevel2 = items[i].id || `item-${i}`;
              break;
            } else if (items[i].level === 1) {
              break;
            }
          }
        }
      }
    }

    return (
      <div className={styles.tocNestedContainer}>
        {Object.entries(groupedItems).map(([groupKey, groupItems]) => {
          const isLevel1Group = groupKey.startsWith('level1-');
          const isExpanded = !isLevel1Group && groupKey === expandedLevel2;
          
          if (isLevel1Group) {
            // Render level 1 items independently
            const item = groupItems[0];
            const isActive = activeItemId === item.id;
            
            return (
              <div key={groupKey} className={styles.tocLevel1Container}>
                <button
                  className={`${styles.navItem} ${styles.tocItem} ${styles.tocLevel1} ${isActive ? styles.active : ''}`}
                  onClick={() => onItemClick && onItemClick(item.originalIndex)}
                  title={item.title}
                >
                  <div className={styles.tocItemContent}>
                    <span className={styles.tocTitle}>{item.title}</span>
                  </div>
                </button>
              </div>
            );
          } else {
            // Render level 2 groups with potential expansion
            const level2Item = groupItems.find(item => item.level === 2);
            const childItems = groupItems.filter(item => item.level > 2);
            const isLevel2Active = activeItemId === level2Item?.id;
            
            return (
              <div key={groupKey} className={`${styles.tocLevel2Container} ${isExpanded ? styles.expanded : ''}`}>
                {/* Level 2 heading */}
                <button
                  className={`${styles.navItem} ${styles.tocItem} ${styles.tocLevel2} ${isLevel2Active ? styles.active : ''}`}
                  onClick={() => level2Item && onItemClick && onItemClick(level2Item.originalIndex)}
                  title={level2Item?.title}
                >
                  <div className={styles.tocItemContent}>
                    <span className={styles.tocTitle}>{level2Item?.title}</span>
                  </div>
                </button>
                
                {/* Child items (level 3+) with connection line */}
                {isExpanded && childItems.length > 0 && (
                  <div className={styles.tocChildContainer}>
                    <div className={styles.tocConnectionLine}></div>
                    <div className={styles.tocChildItems}>
                      {childItems.map((childItem) => {
                        const isChildActive = activeItemId === childItem.id;
                        return (
                          <button
                            key={childItem.originalIndex}
                            className={`${styles.navItem} ${styles.tocItem} ${styles[`tocLevel${childItem.level}`]} ${isChildActive ? styles.active : ''}`}
                            onClick={() => onItemClick && onItemClick(childItem.originalIndex)}
                            title={childItem.title}
                          >
                            <div className={styles.tocItemContent}>
                              <span className={styles.tocTitle}>{childItem.title}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    );
  };

  // Determine what to show in navigation based on context
  const showItems = items.length > 0 && itemType;

  // Prepare TOC items without automatic numbering
  const preparedItems = itemType === 'toc' && items ? prepareTocItems(items) : items;

  return (
    <div ref={sidebarRef} className={styles.leftSidebar}>
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

      {/* Navigation Card with sticky behavior */}
      <div style={{ position: 'relative' }}>
        {/* Placeholder to maintain layout when sticky */}
        {isSticky && cardWidth && (
          <div 
            ref={placeholderRef}
            style={{ 
              height: '250px', // Approximate height to maintain layout
              width: `${cardWidth}px`
            }} 
          />
        )}
        
        <div 
          ref={navigationCardRef}
          className={`${styles.navigationCard} ${isSticky ? styles.stickyNavigationCard : ''}`}
          style={isSticky && cardWidth && cardLeft !== null ? {
            position: 'fixed',
            top: (() => {
              // More precise positioning based on navbar visibility
              if (navbarVisible) {
                // Navbar is visible, leave space for it
                return '80px';
              } else {
                // Navbar is hidden, use minimal top space
                return '20px';
              }
            })(),
            left: `${cardLeft}px`,
            width: `${cardWidth}px`,
            zIndex: 1001, // Higher than navbar to avoid conflicts
            boxSizing: 'border-box',
            transition: 'top 0.3s ease' // Smooth transition synchronized with navbar
          } : undefined}
        >
        {showItems ? (
          <>
            <h4>{itemType === 'project' ? 'Projects' : itemType === 'blog' ? 'Blog Posts' : itemType === 'toc' ? 'Catalog' : 'Archive Items'}</h4>
            <nav className={styles.navList}>
              {itemType === 'toc' ? (
                // Enhanced TOC with nested structure and visual hierarchy
                <div className={styles.tocContainer}>
                  {renderNestedTOC(preparedItems || [])}
                </div>
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
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
