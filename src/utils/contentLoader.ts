/**
 * Content loading utilities for blogs and projects
 */
import { safeMatter } from './safeMatter';
import { generateIdFromTitle } from './contentUtils';
import { createAssetMapFromCache } from './assetResolver';

// Blog post interface
export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
  link: string;
  tags: string[];
}

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

/**
 * Load blog posts dynamically with asset resolution
 */
export async function loadBlogPosts(): Promise<BlogPost[]> {
  // Load all markdown files
  const blogModules = import.meta.glob('../content/blogs/**/index.md', { query: '?raw', import: 'default' });
  // Load ALL assets from entire content directory (global scope)
  const assetModules = import.meta.glob('../content/**/*.{png,jpg,jpeg,gif,svg,webp}', { query: '?url', import: 'default' });
  
  const posts: BlogPost[] = [];

  for (const [path, moduleLoader] of Object.entries(blogModules)) {
    try {
      const content = await moduleLoader() as string;
      const parsed = safeMatter(content);
      const frontmatter = parsed.data;

      // Extract folder name from path for the link
      const pathParts = path.split('/');
      const folderName = pathParts[pathParts.length - 2]; // Get the folder name before index.md
      const folderPath = pathParts.slice(0, -1).join('/'); // Get the folder path

      // Resolve the cover image path
      let resolvedImagePath: string | undefined;
      
      if (frontmatter.coverImage) {
        if (frontmatter.coverImage === 'default') {
          // Use the default cover image
          resolvedImagePath = `${import.meta.env.BASE_URL}default_cover.jpg`;
        } else {
          const imagePath = frontmatter.coverImage;
        
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

      const post: BlogPost = {
        id: generateIdFromTitle(frontmatter.title || folderName),
        title: frontmatter.title || 'Untitled',
        date: frontmatter.createTime || new Date().toISOString(),
        category: frontmatter.category || 'Uncategorized',
        description: frontmatter.description || 'No description available.',
        image: resolvedImagePath,
        link: `/my-portfolio/blogs/${generateIdFromTitle(frontmatter.title || folderName)}`,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : []
      };

      console.log('Created blog post:', {
        path,
        folderName,
        title: frontmatter.title,
        generatedId: generateIdFromTitle(frontmatter.title || folderName),
        link: post.link,
        post
      });

      posts.push(post);
    } catch (error) {
      console.error(`Error loading blog post from ${path}:`, error);
    }
  }

  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Load projects dynamically with asset resolution
 */
export async function loadProjects(): Promise<Project[]> {
  // Load all markdown files
  const projectModules = import.meta.glob('../content/projects/**/index.md', { query: '?raw', import: 'default' });
  // Load ALL assets from entire content directory (global scope)
  const assetModules = import.meta.glob('../content/**/*.{png,jpg,jpeg,gif,svg,webp}', { query: '?url', import: 'default' });
  
  const projects: Project[] = [];

  for (const [path, moduleLoader] of Object.entries(projectModules)) {
    try {
      const content = await moduleLoader() as string;
      const parsed = safeMatter(content);
      const frontmatter = parsed.data;

      // Extract folder name from path for the link
      const pathParts = path.split('/');
      const folderName = pathParts[pathParts.length - 2]; // Get the folder name before index.md
      const folderPath = pathParts.slice(0, -1).join('/'); // Get the folder path

      // Create asset map for this project to handle cross-folder references
      const assetMap = await createAssetMapFromCache(path);

      // Resolve the cover image path
      let resolvedImagePath: string | undefined;
      
      if (frontmatter.coverImage) {
        if (frontmatter.coverImage === 'default') {
          // Use the default cover image
          resolvedImagePath = `${import.meta.env.BASE_URL}default_cover.jpg`;
        } else {
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
      }

      const project: Project = {
        id: generateIdFromTitle(frontmatter.title || folderName),
        title: frontmatter.title || 'Untitled',
        date: frontmatter.createTime || new Date().toISOString(), // Store precise timestamp
        category: frontmatter.category || 'Uncategorized',
        description: frontmatter.description || 'No description available.',
        image: resolvedImagePath,
        link: `/my-portfolio/projects/${generateIdFromTitle(frontmatter.title || folderName)}`,
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
