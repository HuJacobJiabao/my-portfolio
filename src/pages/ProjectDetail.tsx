import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { projects } from './Projects';
import { fetchMarkdownContent, parseMarkdown, type ParsedMarkdown } from '../utils/markdown';
import styles from '../styles/ProjectDetail.module.css';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [markdownData, setMarkdownData] = useState<ParsedMarkdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find the project
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    if (!project) return;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const markdownPath = `${import.meta.env.BASE_URL}content/projects/${project.id}.md`;
        const content = await fetchMarkdownContent(markdownPath);
        const parsed = await parseMarkdown(content);
        
        setMarkdownData(parsed);
      } catch (err) {
        console.error('Error loading project content:', err);
        setError('Failed to load project content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [project]);

  // If project not found, redirect to projects page
  if (!project) {
    return <Navigate to="/my-portfolio/project/" replace />;
  }

  // Create sidebar items from table of contents
  const sidebarItems = markdownData?.toc.map(item => ({
    title: item.title,
    id: item.id
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
      title={project.title}
      headerBackground={project.image}
      sidebarItems={sidebarItems}
      sidebarItemType="toc"
      onSidebarItemClick={handleSidebarItemClick}
    >
      <div className={styles.projectDetail}>
        {loading && (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}>⏳</div>
            <p>Loading project content...</p>
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
            <div className={styles.projectMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Category:</span>
                <span className={styles.metaValue}>{project.category}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Date:</span>
                <span className={styles.metaValue}>{new Date(project.date).toLocaleDateString()}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Tags:</span>
                <div className={styles.tags}>
                  {project.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
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
