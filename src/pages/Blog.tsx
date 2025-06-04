import { useRef } from 'react';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import styles from '../styles/Blog.module.css';

// Sample blog data - you can replace this with real data
export const blogPosts = [
  {
    title: "Hello World",
    date: "2024-04-21",
    category: "Blog",
    description: "Welcome to Hexo! This is your very first post. Check documentation for more info. If you get any problems when using Hexo, you can find the answer in troubleshooting...",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "/blog/hello-world",
    tags: ["Introduction", "Hexo", "Blog"]
  },
  {
    title: "Beautify Post by Tag Plugins",
    date: "2022-04-16",
    category: "Blog",
    description: "Why I Create This Post Using Markdown can help us get a clear website without the knowledge of HTML. There's still several shortages that Markdown's functions are...",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "/blog/beautify-post",
    tags: ["Markdown", "Plugins", "Web Design"]
  },
  {
    title: "Getting Started with React Hooks",
    date: "2024-03-15",
    category: "Tutorial",
    description: "A comprehensive guide to understanding and using React Hooks in modern web development. Learn useState, useEffect, and custom hooks with practical examples.",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "/blog/react-hooks-guide",
    tags: ["React", "JavaScript", "Frontend", "Tutorial"]
  },
  {
    title: "Building Scalable APIs with Node.js",
    date: "2024-02-28",
    category: "Backend",
    description: "Best practices for designing and implementing scalable REST APIs using Node.js, Express, and modern development patterns. Includes performance optimization tips.",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "/blog/scalable-apis-nodejs",
    tags: ["Node.js", "API", "Backend", "Performance"]
  },
  {
    title: "Machine Learning in Web Development",
    date: "2024-01-20",
    category: "AI/ML",
    description: "Exploring how machine learning can enhance user experiences in web applications. From recommendation systems to intelligent search and personalization.",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "/blog/ml-web-development",
    tags: ["Machine Learning", "Web Development", "AI", "UX"]
  },
  {
    title: "TypeScript Best Practices",
    date: "2024-01-05",
    category: "Programming",
    description: "Essential TypeScript patterns and best practices for writing maintainable, type-safe code. Tips for effective use of interfaces, generics, and utility types.",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "/blog/typescript-best-practices",
    tags: ["TypeScript", "JavaScript", "Best Practices", "Code Quality"]
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
      </div>
    </Layout>
  );
}
