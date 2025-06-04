import { useRef } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import styles from '../styles/Projects.module.css';

// Project data - add your real projects here
export const projects: Array<{
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}> = [
  {
    id: "portfolio-website",
    title: "Modern Portfolio Website",
    date: "2024-12-15",
    category: "Web Development",
    description: "A modern, responsive portfolio website built with React, TypeScript, and Vite. Features include smooth animations, responsive design, and dynamic content management with markdown support.",
    image: import.meta.env.BASE_URL + "background/hero.jpg",
    link: "/my-portfolio/project/portfolio-website",
    tags: ["React", "TypeScript", "Vite", "CSS Modules", "Markdown"]
  },
  {
    id: "react-dashboard",
    title: "React Analytics Dashboard",
    date: "2024-11-20",
    category: "Data Visualization",
    description: "A comprehensive analytics dashboard built with React, TypeScript, and modern data visualization libraries. Features interactive charts, real-time updates, and responsive design.",
    image: import.meta.env.BASE_URL + "background/about.jpg",
    link: "/my-portfolio/project/react-dashboard",
    tags: ["React", "TypeScript", "Chart.js", "D3.js", "Redux Toolkit"]
  }
];

export default function Projects() {
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

  const sidebarItems = projects.map(project => ({ title: project.title }));

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
                key={index}
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
