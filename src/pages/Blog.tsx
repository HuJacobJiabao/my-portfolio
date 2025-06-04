import { useRef } from 'react';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import styles from '../styles/Blog.module.css';

// Blog data - add your real blog posts here
export const blogPosts: Array<{
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string; // Make image optional
  link: string;
  tags: string[];
}> = [
  {
    id: 'building-advanced-toc-navigation',
    title: 'Building an Advanced Table of Contents Navigation with Nested Hierarchy and Sticky Behavior',
    date: '2025-06-04',
    category: 'Frontend Development',
    description: 'When building a portfolio website with extensive documentation and blog posts, having an intuitive and visually appealing Table of Contents navigation becomes crucial...',
    // image: undefined, // Will use default_cover.jpg
    link: '/my-portfolio/blog/building-advanced-toc-navigation',
    tags: ['React', 'CSS', 'UI/UX', 'Navigation', 'Frontend Development']
  },
  {
    id: 'my-journey-into-web-development',
    title: 'My Journey into Web Development',
    date: '2024-01-15',
    category: 'Personal',
    description: 'Sharing my experience learning web development, from HTML basics to modern React applications.',
    image: import.meta.env.BASE_URL + "default_cover.jpg", // Will use default_cover.jpg
    link: '/my-portfolio/blog/my-journey-into-web-development',
    tags: ['web development', 'career', 'learning', 'react']
  },
  {
    id: 'understanding-react-hooks',
    title: 'Understanding React Hooks',
    date: '2024-01-22',
    category: 'Tutorial',
    description: 'A comprehensive guide to React Hooks, covering useState, useEffect, custom hooks, and best practices.',
    // image: undefined, // Will use default_cover.jpg
    link: '/my-portfolio/blog/understanding-react-hooks',
    tags: ['react', 'hooks', 'javascript', 'tutorial']
  },
  {
    id: 'building-responsive-layouts-css-grid',
    title: 'Building Responsive Layouts with CSS Grid',
    date: '2024-01-29',
    category: 'Tutorial',
    description: 'Learn how to create flexible, responsive layouts using CSS Grid with practical examples and techniques.',
    // image: undefined, // Will use default_cover.jpg
    link: '/my-portfolio/blog/building-responsive-layouts-css-grid',
    tags: ['css', 'grid', 'responsive design', 'layout']
  }
];

export default function Blog() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
                key={index}
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
