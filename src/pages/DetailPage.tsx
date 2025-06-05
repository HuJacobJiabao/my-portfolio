import { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { projects } from './Projects';
import { blogPosts } from './Blog';
import { fetchMarkdownContent, parseMarkdown, type ParsedMarkdown } from '../utils/markdown';
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

  // Determine if this is a project or blog based on the URL path
  const contentType: ContentType = location.pathname.includes('/project/') ? 'project' : 'blog';
  
  // Find the content item (project or blog post)
  const contentItem: ContentItem | undefined = contentType === 'project' 
    ? projects.find(p => p.id === id)
    : blogPosts.find(b => b.id === id);

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

  // Set up scroll listener for active section tracking
  useEffect(() => {
    if (!markdownData?.toc.length) return;

    const handleScroll = () => {
      requestAnimationFrame(updateActiveSection);
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
        
        const markdownPath = `${import.meta.env.BASE_URL}content/${contentType}s/${contentItem.id}.md`;
        const content = await fetchMarkdownContent(markdownPath);
        const parsed = await parseMarkdown(content, true); // Remove main title
        
        setMarkdownData(parsed);
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentItem, contentType]);

  // If content not found, redirect to appropriate page
  if (!contentItem) {
    const redirectPath = contentType === 'project' ? '/my-portfolio/project/' : '/my-portfolio/blog/';
    return <Navigate to={redirectPath} replace />;
  }

  // Create sidebar items from table of contents
  const sidebarItems = markdownData?.toc.map(item => ({
    title: item.title,
    id: item.id,
    level: item.level
  })) || [];

  const handleSidebarItemClick = (index: number) => {
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
  };

  return (
    <Layout
      title={contentItem.title}
      headerBackground={contentItem.image}
      sidebarItems={sidebarItems}
      sidebarItemType="toc"
      onSidebarItemClick={handleSidebarItemClick}
      activeItemId={activeItemId}
    >
      <div className={styles.detailPage}>
        {loading && (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}>⏳</div>
            <p>Loading {contentType} content...</p>
          </div>
        )}
        
        {error && (
          <div className={styles.error}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2>Error Loading Content</h2>
            <p>{error}</p>
          </div>
        )}
        
        {markdownData && !loading && !error && (
          <div className={styles.content}>
            <div className={styles.contentHeader}>
              <h1 className={styles.contentTitle}>{contentItem.title}</h1>
              <div className={styles.contentMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Type:</span>
                  <span className={styles.metaValue}>{contentType === 'project' ? '💻 Project' : '📝 Blog Post'}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Category:</span>
                  <span className={styles.metaValue}>{contentItem.category}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Created:</span>
                  <span className={styles.metaValue}>{new Date(contentItem.date).toLocaleDateString()}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Tags:</span>
                  <div className={styles.tags}>
                    {contentItem.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              className={styles.markdownContent}
              dangerouslySetInnerHTML={{ __html: markdownData.html }}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
