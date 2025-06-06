import { useRef, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import styles from '../styles/Projects.module.css';
import matter from 'gray-matter';
import { createAssetMapFromCache } from '../utils/assetResolver';

// Project interface
export interface Project {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
  link: string;
  tags: string[];
  assetMap?: Map<string, string>;
}

// Function to generate ID from title
export function generateIdFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
}

// Function to load projects dynamically with asset resolution
export async function loadProjects(): Promise<Project[]> {
  // Load all markdown files
  const projectModules = import.meta.glob('../content/projects/**/index.md', { query: '?raw', import: 'default' });
  // Load ALL assets from entire content directory (global scope)
  const assetModules = import.meta.glob('../content/**/*.{png,jpg,jpeg,gif,svg,webp}', { query: '?url', import: 'default' });
  
  const projects: Project[] = [];

  for (const [path, moduleLoader] of Object.entries(projectModules)) {
    try {
      const content = await moduleLoader() as string;
      const parsed = matter(content);
      const frontmatter = parsed.data;

      // Extract folder name from path for the link
      const pathParts = path.split('/');
      const folderName = pathParts[pathParts.length - 2]; // Get the folder name before index.md
      const folderPath = pathParts.slice(0, -1).join('/'); // Get the folder path

      // Create asset map for this project to handle cross-folder references
      const assetMap = await createAssetMapFromCache(path);

      // Resolve the cover image path
      let resolvedImagePath: string | undefined;
      
      if (frontmatter.coverImage && frontmatter.coverImage !== 'default') {
        const imagePath = frontmatter.coverImage;
        
        // Try to resolve using the asset map first (for cross-folder references)
        resolvedImagePath = assetMap.get(imagePath);
        
        // If not found in asset map, fall back to manual resolution
        if (!resolvedImagePath) {
          // Handle relative paths
          let fullImagePath: string;
        if (imagePath.startsWith('./')) {
          // Same directory
          fullImagePath = folderPath + '/' + imagePath.slice(2);
        } else if (imagePath.startsWith('../')) {
          // Parent directory - resolve relative path
          const relativeParts = imagePath.split('/');
          const baseParts = folderPath.split('/');
          
          let upLevels = 0;
          const remainingParts: string[] = [];
          
          for (const part of relativeParts) {
            if (part === '..') {
              upLevels++;
            } else if (part !== '.') {
              remainingParts.push(part);
            }
          }
          
          const resolvedBaseParts = baseParts.slice(0, -upLevels);
          fullImagePath = resolvedBaseParts.concat(remainingParts).join('/');
        } else if (imagePath.startsWith('/')) {
          // Absolute path from src root
          fullImagePath = '../' + imagePath.slice(1);
        } else {
          // Relative to current folder
          fullImagePath = folderPath + '/' + imagePath;
        }

        // Find matching asset module
        const assetKey = Object.keys(assetModules).find(key => key === fullImagePath);
        if (assetKey && assetModules[assetKey]) {
          try {
            resolvedImagePath = await assetModules[assetKey]() as string;
          } catch (error) {
            console.warn(`Could not load asset: ${fullImagePath}`, error);
          }
        }
        }
      }

      const project: Project = {
        id: generateIdFromTitle(frontmatter.title || folderName),
        title: frontmatter.title || 'Untitled',
        date: frontmatter.createTime || new Date().toISOString(), // Store precise timestamp
        category: frontmatter.category || 'Uncategorized',
        description: frontmatter.description || 'No description available.',
        image: resolvedImagePath,
        link: `/my-portfolio/project/${generateIdFromTitle(frontmatter.title || folderName)}`,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        assetMap: assetMap
      };

      console.log('Created project:', {
        path,
        folderName,
        title: frontmatter.title,
        generatedId: generateIdFromTitle(frontmatter.title || folderName),
        link: project.link,
        assetMapSize: assetMap.size,
        project
      });

      projects.push(project);
    } catch (error) {
      console.error(`Error loading project from ${path}:`, error);
    }
  }

  // Sort projects by date (newest first)
  return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function Projects() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects on component mount
  useEffect(() => {
    const loadProjectsData = async () => {
      try {
        setLoading(true);
        const projectsData = await loadProjects();
        setProjects(projectsData);
        console.log('Projects loaded:', projectsData);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjectsData();
  }, []);

  const handleSidebarItemClick = (index: number) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const sidebarItems = projects.map(project => ({ title: project.title }));

  if (loading) {
    return (
      <Layout 
        title="Projects"
        sidebarItems={[]}
        sidebarItemType="project"
        onSidebarItemClick={() => {}}
      >
        <div className={styles.projectsContainer}>
          <div className={styles.loadingState}>
            <div className={styles.loadingIcon}>⏳</div>
            <h2>Loading Projects...</h2>
            <p>Please wait while we load the project content.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout 
        title="Projects"
        sidebarItems={[]}
        sidebarItemType="project"
        onSidebarItemClick={() => {}}
      >
        <div className={styles.projectsContainer}>
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>❌</div>
            <h2>Error Loading Projects</h2>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Projects"
      sidebarItems={sidebarItems}
      sidebarItemType="project"
      onSidebarItemClick={handleSidebarItemClick}
    >
      <div className={styles.projectsContainer}>
        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💻</div>
            <h2>No Projects Yet</h2>
            <p>Projects will be displayed here once they are added.</p>
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <div 
                key={project.id}
                ref={el => { cardRefs.current[index] = el; }}
                className={styles.projectCardWrapper}
              >
                <Card
                  title={project.title}
                  date={project.date}
                  category={project.category}
                  description={project.description}
                  image={project.image}
                  id={project.id}
                  tags={project.tags}
                  type="project"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
