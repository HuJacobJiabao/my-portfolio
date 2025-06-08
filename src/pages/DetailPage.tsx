import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import MarkdownContent from '../components/MarkdownContent';
import { loadStaticProjects, loadStaticBlogPosts, loadMarkdownContent, type Project, type BlogPost } from '../utils/staticDataLoader';
import { parseMarkdown, type ParsedMarkdown } from '../utils/markdown';
import { createAssetMapFromCache } from '../utils/assetResolver';
import styles from '../styles/DetailPage.module.css';

type ContentType = 'project' | 'blog';

interface ContentItem {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string; // Make image optional to match blog posts
  link: string;
  tags: string[];
  contentPath: string; // Add contentPath for markdown loading
}

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [markdownData, setMarkdownData] = useState<ParsedMarkdown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string>('');
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load blog posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await loadStaticBlogPosts();
        setBlogPosts(posts);
        console.log('Blog posts loaded in DetailPage:', posts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
      }
    };

    loadPosts();
  }, []);

  // Load projects on component mount
  useEffect(() => {
    const loadProjectsData = async () => {
      try {
        const projectsData = await loadStaticProjects();
        setProjects(projectsData);
        console.log('Projects loaded in DetailPage:', projectsData);
      } catch (err) {
        console.error('Error loading projects:', err);
      }
    };

    loadProjectsData();
  }, []);

  // Determine if this is a project or blog based on the URL path
  const contentType: ContentType = location.pathname.includes('/projects/') ? 'project' : 'blog';
  
  // Find the content item (project or blog post)
  const contentItem: ContentItem | undefined = useMemo(() => {
    if (contentType === 'project') {
      const found = projects.find(p => p.id === id);
      console.log('Looking for project with id:', id, 'Found:', found, 'Available projects:', projects.map(p => p.id));
      return found;
    } else {
      const found = blogPosts.find(b => b.id === id);
      console.log('Looking for blog post with id:', id, 'Found:', found, 'Available posts:', blogPosts.map(p => p.id));
      return found;
    }
  }, [contentType, id, blogPosts, projects]);

  // Create sidebar items from table of contents (memoized)
  const sidebarItems = useMemo(() => {
    return markdownData?.toc.map(item => ({
      title: item.title,
      id: item.id,
      level: item.level
    })) || [];
  }, [markdownData?.toc]);

  // Memoized callback for sidebar item clicks
  const handleSidebarItemClick = useCallback((index: number) => {
    const item = sidebarItems[index];
    if (item?.id) {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [sidebarItems]);

  // Function to check which section is currently in view
  const updateActiveSection = useCallback(() => {
    if (!markdownData?.toc.length) return;

    const sections = markdownData.toc.map(item => item.id).filter(Boolean);
    const offset = 100; // Offset from top to account for header

    for (let i = sections.length - 1; i >= 0; i--) {
      const element = document.getElementById(sections[i]);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= offset) {
          setActiveItemId(sections[i]);
          return;
        }
      }
    }

    // If no section is in view, set to first section
    if (sections.length > 0) {
      setActiveItemId(sections[0]);
    }
  }, [markdownData?.toc]);

  // Set up scroll listener for active section tracking with throttling
  useEffect(() => {
    if (!markdownData?.toc.length) return;

    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveSection(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateActiveSection, markdownData?.toc]);

  useEffect(() => {
    if (!contentItem) return;

    const loadContent = async () => {
      try {
        setError(null);
        
        console.log('Loading markdown content for:', {
          contentType,
          contentItemId: contentItem.id,
          contentPath: contentItem.contentPath
        });
        
        // Load the markdown content from the file
        const markdownContent = await loadMarkdownContent(contentItem.contentPath);
        
        if (!markdownContent) {
          throw new Error('Markdown content not found');
        }
        
        // Create asset map for proper image resolution
        const assetMap = await createAssetMapFromCache(contentItem.contentPath);
        
        // Parse the markdown content at runtime with asset map
        const parsedMarkdown = await parseMarkdown(markdownContent, true, assetMap);
        
        setMarkdownData(parsedMarkdown);
        setLastUpdateTime(new Date().toLocaleDateString());
        
      } catch (err) {
        console.error('Error loading markdown content:', err);
        setError('Failed to load content');
      }
    };

    loadContent();
  }, [contentItem, contentType]);

  // If content not found, redirect to appropriate page
  if (!contentItem && blogPosts.length > 0 && projects.length > 0) {
    const redirectPath = contentType === 'project' ? '/my-portfolio/projects/' : '/my-portfolio/blogs/';
    console.log('Content item not found, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Error Loading Content</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Ensure contentItem and markdownData are available before rendering
  if (!contentItem || !markdownData) {
    return null; // Return null instead of loading UI
  }

  // Determine the appropriate header background
  const getHeaderBackground = () => {
    // If contentItem.image is empty/undefined or contains default_cover.jpg, use content-type-specific background
    if (!contentItem.image || contentItem.image.includes('default_cover.jpg')) {
      return contentType === 'project' 
        ? `${import.meta.env.BASE_URL}background/default_proj.jpg`
        : `${import.meta.env.BASE_URL}background/default_blog.png`;
    }
    // Otherwise use the contentItem.image as is
    return contentItem.image;
  };

  // Only render Layout when all data is ready
  return (
    <Layout
      title={contentItem.title}
      headerBackground={getHeaderBackground()}
      sidebarItems={sidebarItems}
      sidebarItemType="toc"
      onSidebarItemClick={handleSidebarItemClick}
      activeItemId={activeItemId}
      contentItemDate={new Date(contentItem.date).toLocaleDateString()}
      contentItemTags={contentItem.tags}
      contentType={contentType}
      contentItemCategory={contentItem.category}
      contentItemLastUpdate={lastUpdateTime || undefined}
    >
      <div className={styles.detailPage}>
        <div className={styles.content}>
          <MarkdownContent
            markdownData={markdownData}
          />
        </div>
      </div>
    </Layout>
  );
}
