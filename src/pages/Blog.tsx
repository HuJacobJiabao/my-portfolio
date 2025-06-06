import { useRef, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import styles from '../styles/Blog.module.css';
import { loadBlogPosts, type BlogPost } from '../utils/contentLoader';

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
