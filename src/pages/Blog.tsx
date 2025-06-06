import { useRef, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import styles from '../styles/Blog.module.css';
import matter from 'gray-matter';

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

// Function to generate ID from title
export function generateIdFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
}

// Function to load blog posts dynamically with asset resolution
export async function loadBlogPosts(): Promise<BlogPost[]> {
  // Load all markdown files
  const blogModules = import.meta.glob('../content/blogs/**/index.md', { query: '?raw', import: 'default' });
  // Load ALL assets from entire content directory (global scope)
  const assetModules = import.meta.glob('../content/**/*.{png,jpg,jpeg,gif,svg,webp}', { query: '?url', import: 'default' });
  
  const posts: BlogPost[] = [];

  for (const [path, moduleLoader] of Object.entries(blogModules)) {
    try {
      const content = await moduleLoader() as string;
      const parsed = matter(content);
      const frontmatter = parsed.data;

      // Extract folder name from path for the link
      const pathParts = path.split('/');
      const folderName = pathParts[pathParts.length - 2]; // Get the folder name before index.md
      const folderPath = pathParts.slice(0, -1).join('/'); // Get the folder path

      // Resolve the cover image path
      let resolvedImagePath: string | undefined;
      
      if (frontmatter.coverImage && frontmatter.coverImage !== 'default') {
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

      const post: BlogPost = {
        id: generateIdFromTitle(frontmatter.title || folderName),
        title: frontmatter.title || 'Untitled',
        date: frontmatter.createTime || new Date().toISOString(),
        category: frontmatter.category || 'Uncategorized',
        description: frontmatter.description || 'No description available.',
        image: resolvedImagePath,
        link: `/my-portfolio/blog/${generateIdFromTitle(frontmatter.title || folderName)}`,
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

export default function Blog() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load blog posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const posts = await loadBlogPosts();
        setBlogPosts(posts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
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

  const sidebarItems = blogPosts.map(post => ({ title: post.title }));

  if (loading) {
    return (
      <Layout title="Blog">
        <div className={styles.blogContainer}>
          <div className={styles.loadingState}>
            <div className={styles.loadingIcon}>⏳</div>
            <h2>Loading Blog Posts...</h2>
            <p>Please wait while we fetch the latest content.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Blog">
        <div className={styles.blogContainer}>
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>❌</div>
            <h2>Error Loading Blog Posts</h2>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Blog"
      sidebarItems={sidebarItems}
      sidebarItemType="blog"
      onSidebarItemClick={handleSidebarItemClick}
    >
      <div className={styles.blogContainer}>
        {blogPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h2>No Blog Posts Yet</h2>
            <p>Blog posts will be displayed here once they are published.</p>
          </div>
        ) : (
          <div className={styles.blogGrid}>
            {blogPosts.map((post, index) => (
              <div 
                key={post.id}
                ref={el => { cardRefs.current[index] = el; }}
                className={styles.blogCardWrapper}
              >
                <BlogCard
                  title={post.title}
                  date={post.date}
                  category={post.category}
                  description={post.description}
                  image={post.image}
                  link={post.link}
                  tags={post.tags}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
