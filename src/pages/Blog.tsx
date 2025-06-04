import { useRef } from 'react';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import styles from '../styles/Blog.module.css';

// Blog data - add your real blog posts here
export const blogPosts: Array<{
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}> = [];

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
