import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import MarkdownContent from '../components/MarkdownContent';
import { loadProjects, generateIdFromTitle as generateProjectIdFromTitle, type Project } from './Projects';
import { loadBlogPosts, generateIdFromTitle as generateBlogIdFromTitle, type BlogPost } from './Blog';
import { fetchMarkdownContent, parseMarkdown, type ParsedMarkdown } from '../utils/markdown';
import { createAssetMapFromCache } from '../utils/assetResolver';
import matter from 'gray-matter';
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
}

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [markdownData, setMarkdownData] = useState<ParsedMarkdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string>('');
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogPostsLoading, setBlogPostsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Load blog posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setBlogPostsLoading(true);
        const posts = await loadBlogPosts();
        setBlogPosts(posts);
        console.log('Blog posts loaded in DetailPage:', posts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
      } finally {
        setBlogPostsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Load projects on component mount
  useEffect(() => {
    const loadProjectsData = async () => {
      try {
        setProjectsLoading(true);
        const projectsData = await loadProjects();
        setProjects(projectsData);
        console.log('Projects loaded in DetailPage:', projectsData);
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjectsData();
  }, []);

  // Determine if this is a project or blog based on the URL path
  const contentType: ContentType = location.pathname.includes('/project/') ? 'project' : 'blog';
  
  // Find the content item (project or blog post) - but only after both blog posts and projects are loaded
  const contentItem: ContentItem | undefined = useMemo(() => {
    if (contentType === 'project') {
      // For projects, wait until they're loaded
      if (projectsLoading) return undefined;
      const found = projects.find(p => p.id === id);
      console.log('Looking for project with id:', id, 'Found:', found, 'Available projects:', projects.map(p => p.id));
      return found;
    } else {
      // For blog posts, wait until they're loaded
      if (blogPostsLoading) return undefined;
      const found = blogPosts.find(b => b.id === id);
      console.log('Looking for blog post with id:', id, 'Found:', found, 'Available posts:', blogPosts.map(p => p.id));
      return found;
    }
  }, [contentType, id, blogPosts, blogPostsLoading, projects, projectsLoading]);

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
        setLoading(true);
        setError(null);
        
        console.log('Loading content for:', {
          contentType,
          contentItemId: contentItem.id,
          contentItem
        });
        
        // For blog posts, we need to find the folder and load index.md
        // For projects, we also use dynamic loading now
        let markdownPath: string | null = null;
        
        if (contentType === 'blog') {
          // Try to load from src/content/blogs folder structure first
          const srcContentModules = import.meta.glob('../content/blogs/**/index.md', { query: '?raw', import: 'default' });
          
          console.log('Available blog modules:', Object.keys(srcContentModules));
          
          // Find the matching blog post content
          let content: string | null = null;
          for (const [path, moduleLoader] of Object.entries(srcContentModules)) {
            try {
              const moduleContent = await moduleLoader() as string;
              const parsed = matter(moduleContent);
              const frontmatter = parsed.data;
              
              const generatedId = generateBlogIdFromTitle(frontmatter.title);
              console.log('Checking blog post:', {
                path,
                title: frontmatter.title,
                generatedId,
                targetId: contentItem.id,
                matches: generatedId === contentItem.id
              });
              
              // Check if this is the blog post we're looking for
              if (generatedId === contentItem.id) {
                content = moduleContent;
                markdownPath = path;
                console.log('Found matching blog post:', path);
                break;
              }
            } catch (error) {
              console.warn(`Error checking blog post ${path}:`, error);
            }
          }
          
          if (content && markdownPath) {
            // Create asset map for this markdown file
            const assetMap = await createAssetMapFromCache(markdownPath);
            const parsed = await parseMarkdown(content, true, assetMap); // Remove main title, include asset map
            setMarkdownData(parsed);
            setLastUpdateTime(new Date().toLocaleDateString()); // Use current date as fallback
            return;
          } else {
            // Fallback to public content path
            markdownPath = `${import.meta.env.BASE_URL}content/${contentType}s/${contentItem.id}.md`;
          }
        } else {
          // For projects, try to load from src/content/projects folder structure first
          const srcProjectModules = import.meta.glob('../content/projects/**/index.md', { query: '?raw', import: 'default' });
          
          console.log('Available project modules:', Object.keys(srcProjectModules));
          
          // Find the matching project content
          let content: string | null = null;
          let markdownPath: string | null = null;
          for (const [path, moduleLoader] of Object.entries(srcProjectModules)) {
            try {
              const moduleContent = await moduleLoader() as string;
              const parsed = matter(moduleContent);
              const frontmatter = parsed.data;
              
              // Extract folder name from path for ID generation
              const pathParts = path.split('/');
              const folderName = pathParts[pathParts.length - 2];
              const generatedId = generateProjectIdFromTitle(frontmatter.title || folderName);
              
              console.log('Checking project:', {
                path,
                title: frontmatter.title,
                folderName,
                generatedId,
                targetId: contentItem.id,
                matches: generatedId === contentItem.id
              });
              
              // Check if this is the project we're looking for
              if (generatedId === contentItem.id) {
                content = moduleContent;
                markdownPath = path;
                console.log('Found matching project:', path);
                break;
              }
            } catch (error) {
              console.warn(`Error checking project ${path}:`, error);
            }
          }
          
          if (content && markdownPath) {
            // Create asset map for this markdown file
            const assetMap = await createAssetMapFromCache(markdownPath);
            const parsed = await parseMarkdown(content, true, assetMap); // Remove main title, include asset map
            setMarkdownData(parsed);
            setLastUpdateTime(new Date().toLocaleDateString()); // Use current date as fallback
            return;
          } else {
            // Fallback to public content path
            markdownPath = `${import.meta.env.BASE_URL}content/${contentType}s/${contentItem.id}.md`;
          }
        }
        
        // Load from public folder (fallback or projects)
        if (markdownPath) {
          // Get file last modified time
          try {
            const headResponse = await fetch(markdownPath, { method: 'HEAD' });
            const lastModified = headResponse.headers.get('Last-Modified');
            if (lastModified) {
              setLastUpdateTime(new Date(lastModified).toLocaleDateString());
            }
          } catch (headError) {
            console.warn('Could not get last modified time:', headError);
            setLastUpdateTime(null);
          }
          
          const content = await fetchMarkdownContent(markdownPath);
          // For public folder content, we can't resolve assets dynamically, so use empty asset map
          const parsed = await parseMarkdown(content, true, new Map()); // Remove main title
          setMarkdownData(parsed);
        }
        
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentItem, contentType]);

  // If content not found, redirect to appropriate page (but wait for content to load first)
  const isContentLoading = contentType === 'project' ? projectsLoading : blogPostsLoading;
  if (!isContentLoading && !contentItem) {
    const redirectPath = contentType === 'project' ? '/my-portfolio/project/' : '/my-portfolio/blog/';
    console.log('Content item not found, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Show loading state until all data is ready
  if (loading || !markdownData || isContentLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>⏳</div>
        <p>Loading {contentType} content...</p>
      </div>
    );
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

  // Ensure contentItem is available before rendering
  if (!contentItem) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>⏳</div>
        <p>Loading {contentType} content...</p>
      </div>
    );
  }

  // Only render Layout when all data is ready
  return (
    <Layout
      title={contentItem.title}
      headerBackground={contentItem.image}
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
