import Layout from '../components/Layout';
import Card from '../components/Card';
import styles from '../styles/Projects.module.css';

// Sample project data - you can replace this with real data
const projects = [
  {
    title: "Portfolio Website",
    date: "2024-12-15",
    category: "Web Development",
    description: "A modern, responsive portfolio website built with React, TypeScript, and Vite. Features include smooth animations, responsive design, and dynamic content management.",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "https://github.com/yourusername/portfolio",
    tags: ["React", "TypeScript", "Vite", "CSS Modules"]
  },
  {
    title: "E-commerce Platform",
    date: "2024-11-20",
    category: "Full Stack",
    description: "A complete e-commerce solution with user authentication, payment processing, and admin dashboard. Built with modern web technologies and cloud deployment.",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "https://github.com/yourusername/ecommerce",
    tags: ["Next.js", "Node.js", "MongoDB", "Stripe"]
  },
  {
    title: "Machine Learning Dashboard",
    date: "2024-10-05",
    category: "Data Science",
    description: "An interactive dashboard for visualizing machine learning model performance with real-time data processing and advanced analytics capabilities.",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "https://github.com/yourusername/ml-dashboard",
    tags: ["Python", "TensorFlow", "React", "D3.js"]
  },
  {
    title: "Mobile Task Manager",
    date: "2024-09-12",
    category: "Mobile Development",
    description: "A cross-platform mobile application for task management with offline capabilities, push notifications, and team collaboration features.",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "https://github.com/yourusername/task-manager",
    tags: ["React Native", "Firebase", "Redux", "TypeScript"]
  },
  {
    title: "API Gateway Service",
    date: "2024-08-18",
    category: "Backend",
    description: "A scalable API gateway service with rate limiting, authentication, and monitoring capabilities. Designed for microservices architecture.",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "https://github.com/yourusername/api-gateway",
    tags: ["Go", "Docker", "Kubernetes", "Redis"]
  },
  {
    title: "Real-time Chat Application",
    date: "2024-07-25",
    category: "Web Development",
    description: "A real-time chat application with multiple rooms, file sharing, and message encryption. Features modern UI and responsive design.",
    image: import.meta.env.BASE_URL + "/default_cover.jpg",
    link: "https://github.com/yourusername/chat-app",
    tags: ["Socket.io", "Express", "React", "MongoDB"]
  }
];

export default function Projects() {
  return (
    <Layout title="Projects">
      <div className={styles.projectsContainer}>
        <p className={styles.description}>
          Welcome to my projects showcase! Here you'll find a collection of my work spanning 
          web development, machine learning, and software engineering. Each project represents 
          a journey of learning and innovation.
        </p>
        
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <Card
              key={index}
              title={project.title}
              date={project.date}
              category={project.category}
              description={project.description}
              image={project.image}
              link={project.link}
              tags={project.tags}
              type="project"
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
