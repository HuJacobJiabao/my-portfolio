---
title: "Building an Advanced Table of Contents Navigation with Nested Hierarchy and Sticky Behavior"
date: "2025-06-04"
description: "A deep dive into implementing a sophisticated TOC navigation component with nested hierarchy, visual connection lines, progressive indentation, and sticky positioning in React and CSS."
author: "Jiabao Hu"
tags: ["React", "CSS", "UI/UX", "Navigation", "Frontend Development"]
category: "Frontend Development"
readTime: "12 min"
cover: "/default_cover.jpg"
---

# Building an Advanced Table of Contents Navigation with Nested Hierarchy and Sticky Behavior

When building a portfolio website with extensive documentation and blog posts, having an intuitive and visually appealing Table of Contents (TOC) navigation becomes crucial for user experience. Recently, I implemented a sophisticated TOC component that transforms from a flat structure to a nested hierarchical system with visual parent-child relationships, progressive indentation, and sticky positioning. Here's how I solved the challenges and built this advanced navigation system.

## The Challenge: From Flat to Hierarchical

Initially, my TOC was a simple flat list that showed all headings in a linear fashion. While functional, it lacked visual hierarchy and made it difficult for users to understand the document structure. The main challenges I needed to address were:

1. **Visual Hierarchy**: Create clear parent-child relationships between headings
2. **Progressive Indentation**: Implement different indentation levels for various heading depths
3. **Smart Expansion**: Show children only when browsing within a parent section
4. **Sticky Behavior**: Keep the navigation accessible while scrolling
5. **Visual Connections**: Add subtle lines to connect related items

## Solution Overview

The solution involved three main components:
- **React Component Logic**: Transforming flat TOC data into nested structure
- **CSS Design System**: Creating visual hierarchy with progressive indentation
- **Sticky Positioning**: Implementing dynamic positioning with preserved width

## 1. Transforming the TOC Structure

### Before: Flat Structure
```typescript
// Original flat rendering
{tocItems.map((item) => (
  <button
    key={item.id}
    className={`${styles.tocItem} ${styles[`tocLevel${item.level}`]} ${
      activeItemId === item.id ? styles.active : ''
    }`}
    onClick={() => scrollToElement(item.id)}
  >
    {item.title}
  </button>
))}
```

### After: Nested Hierarchical Structure
```typescript
const renderNestedTOC = () => {
  const level2Groups: { [key: string]: TocItem[] } = {};
  const level1Items: TocItem[] = [];
  
  // Group items by level 2 sections
  tocItems.forEach(item => {
    if (item.level === 1) {
      level1Items.push(item);
    } else if (item.level === 2) {
      level2Groups[item.id] = [item];
    } else {
      // Find parent level 2 section for children
      const parentLevel2 = findParentLevel2(item);
      if (parentLevel2 && level2Groups[parentLevel2.id]) {
        level2Groups[parentLevel2.id].push(item);
      }
    }
  });

  return (
    <div className={styles.tocNestedContainer}>
      {/* Render level 1 items */}
      {level1Items.map(renderTocItem)}
      
      {/* Render level 2 groups with their children */}
      {Object.entries(level2Groups).map(([level2Id, items]) => {
        const level2Item = items[0];
        const childItems = items.slice(1);
        const isExpanded = shouldExpandLevel2Group(level2Id, childItems);
        
        return (
          <div key={level2Id} className={styles.tocLevel2Container}>
            {renderTocItem(level2Item)}
            {isExpanded && childItems.length > 0 && (
              <div className={`${styles.tocLevel2Container} ${styles.expanded}`}>
                <div className={styles.tocChildContainer}>
                  <div className={styles.tocConnectionLine}></div>
                  <div className={styles.tocChildItems}>
                    {childItems.map(renderTocItem)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
```

### Key Algorithm: Smart Expansion Logic
The most crucial part was implementing smart expansion that shows children only when the user is browsing within that section:
中文字体test
```typescript
const shouldExpandLevel2Group = (level2Id: string, childItems: TocItem[]): boolean => { dsadsa dsads 哈哈哈哈
  if (!activeItemId) return false;
  
  // Expand if the level 2 item itself is active
  if (activeItemId === level2Id) return true;
  
  // Expand if any child under this level 2 section is active
  return childItems.some(child => child.id === activeItemId);
};
```

## 2. CSS Design System: Visual Hierarchy

### Progressive Indentation System
I implemented a carefully designed indentation system that creates clear visual levels:

```css
/* Level 1: Top-level sections */
.tocLevel1 {
  padding: 10px 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a202c;
}

/* Level 2: Main sections */
.tocLevel2 {
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #2d3748;
}

/* Level 3: First indentation level */
.tocLevel3 {
  padding: 6px 12px 6px 24px; /* 24px left padding */
  font-size: 0.8rem;
  color: #4a5568;
  font-weight: 400;
}

/* Level 4: Second indentation level */
.tocLevel4 {
  padding: 5px 12px 5px 36px; /* 36px left padding */
  font-size: 0.78rem;
  color: #718096;
  font-weight: 400;
}

/* Level 5-6: Third indentation level */
.tocLevel5,
.tocLevel6 {
  padding: 4px 12px 4px 48px; /* 48px left padding */
  font-size: 0.75rem;
  color: #a0aec0;
  font-weight: 400;
}
```

### Visual Connection Lines
To show parent-child relationships, I added subtle connection lines:

```css
.tocChildContainer {
  position: relative;
  margin-top: 4px;
  padding-left: 16px; /* Space for connection line */
}

.tocConnectionLine {
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #000000;
  opacity: 0.3; /* Subtle, not intrusive */
}
```

### Level-Specific Color Theming
Each heading level has its own color theme for better visual distinction:

```css
/* Level 1: Dark theme */
.tocLevel1:hover {
  background: rgba(26, 32, 44, 0.1);
  color: #1a202c;
}

.tocLevel1.active {
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  color: white;
}

/* Level 2: Blue theme */
.tocLevel2:hover {
  background: rgba(49, 130, 206, 0.1);
  color: #3182ce;
}

.tocLevel2.active {
  background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
  color: white;
}

/* Level 3: Teal theme */
.tocLevel3:hover {
  background: rgba(56, 178, 172, 0.1);
  color: #38b2ac;
}

/* And so on for other levels... */
```

## 3. Sticky Positioning with Dynamic Width

One of the trickiest parts was implementing sticky positioning while preserving the original width of the navigation card.

### The Problem
When an element becomes `position: sticky`, it can lose its original width context, especially in complex layouts with flexbox or grid.

### The Solution
I implemented a dynamic width preservation system:

```typescript
useEffect(() => {
  const handleScroll = () => {
    if (!navigationCardRef.current || !leftSidebarRef.current) return;

    const rect = leftSidebarRef.current.getBoundingClientRect();
    const shouldStick = rect.top <= 20;

    if (shouldStick !== isSticky) {
      setIsSticky(shouldStick);
      
      if (shouldStick) {
        // Preserve original width when becoming sticky
        const originalWidth = navigationCardRef.current.offsetWidth;
        setOriginalWidth(originalWidth);
        
        navigationCardRef.current.style.position = 'sticky';
        navigationCardRef.current.style.top = '20px';
        navigationCardRef.current.style.width = `${originalWidth}px`;
        navigationCardRef.current.style.zIndex = '100';
      } else {
        // Reset to natural width when not sticky
        navigationCardRef.current.style.position = 'relative';
        navigationCardRef.current.style.top = 'auto';
        navigationCardRef.current.style.width = 'auto';
        navigationCardRef.current.style.zIndex = 'auto';
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [isSticky]);
```

### CSS Support for Sticky Behavior
```css
.stickyNavigationCard {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2) !important;
  transition: box-shadow 0.3s ease;
  box-sizing: border-box;
}

/* Mobile responsive: disable sticky on small screens */
@media (max-width: 768px) {
  .stickyNavigationCard {
    position: relative;
    top: auto;
    width: 100%;
    z-index: auto;
  }
}
```

## 4. Code Cleanup and Type Safety

### Removing Unused Code
Part of the refactoring involved removing obsolete functions and state:

```typescript
// Removed unused functions:
// - isItemVisible
// - findDirectParent
// - findAllParentSections
// - findAllChildrenUnderSection

// Removed unused state:
// - expandedSections
// - Related useEffect hooks

// Fixed TypeScript type errors with proper assertions
const level2Item = items[0] as TocItem;
```

### Performance Optimization
The new nested structure is more efficient because:
1. **Reduced DOM nodes**: Only renders visible children
2. **Smart re-rendering**: Expansion state changes only affect relevant sections
3. **Efficient grouping**: One-time processing of TOC structure

## 5. User Experience Improvements

### Visual Feedback
- **Hover effects**: Subtle color changes and micro-animations
- **Active states**: Clear highlighting of current section
- **Progressive disclosure**: Children appear only when relevant
- **Smooth transitions**: CSS transitions for all state changes

### Accessibility
- **Keyboard navigation**: Proper focus management
- **Screen reader support**: Semantic HTML structure
- **Color contrast**: Sufficient contrast ratios for all text
- **Mobile responsiveness**: Adapted behavior for touch devices

## Results and Benefits

The new TOC navigation system provides several key benefits:

1. **Improved Navigation**: Users can quickly understand document structure
2. **Reduced Cognitive Load**: Only relevant sections are visible
3. **Better Visual Hierarchy**: Clear parent-child relationships
4. **Enhanced Accessibility**: Better support for assistive technologies
5. **Modern UI**: Polished, professional appearance

## Lessons Learned

### 1. Start with Data Structure
The most important step was transforming the flat TOC data into a hierarchical structure. Getting this right made everything else easier.

### 2. CSS Grid vs Flexbox
For this type of nested layout, flexbox proved more suitable than CSS Grid due to the dynamic nature of the content.

### 3. Progressive Enhancement
Building the basic functionality first, then adding visual enhancements, made debugging much easier.

### 4. Mobile-First Approach
Considering mobile constraints early prevented many responsive design issues.

## Conclusion

Building an advanced TOC navigation required careful consideration of data structure, visual design, and user experience. The key was breaking down the problem into manageable pieces:

1. **Data transformation**: Converting flat structure to nested hierarchy
2. **Visual design**: Creating clear hierarchy with progressive indentation
3. **Dynamic behavior**: Implementing smart expansion and sticky positioning
4. **Performance**: Optimizing rendering and state management

The result is a navigation system that not only looks professional but also significantly improves the user experience when browsing through long-form content.

The implementation demonstrates how thoughtful UI design can transform a simple feature into a powerful navigation tool that enhances the overall user experience of a portfolio website.

---

*This blog post covers the technical implementation of the advanced TOC navigation. The complete source code and live demo can be found in my portfolio repository.*
