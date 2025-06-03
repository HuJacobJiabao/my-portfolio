import Layout from '../components/Layout';
import Card from '../components/Card';
import styles from '../styles/Archive.module.css';

// Sample archive data - you can replace this with real data
const archiveItems = [
  {
    title: "Blender-Python API Meshing (1)",
    date: "2022-04-15",
    category: "Blender",
    description: "Blender-Python API Meshing ⚡ Introduction Blender is a free and open-source 3D computer graphics software toolset used for creating animated films, visual effects...",
    image: "/background/hero.jpg",
    link: "/archive/blender-python-api",
    tags: ["Python", "Blender", "3D Graphics", "API"]
  },
  {
    title: "Music List 1",
    date: "2022-04-16",
    category: "Music",
    description: "At the Beginning Welcome to my music sharing channel ( ´ ∀ ` ), it is the first blog for introducing my music list in the player on my website. Staring from April 16, 2022, th...",
    image: "/background/about.jpg",
    link: "/archive/music-list-1",
    tags: ["Music", "Playlist", "Entertainment"]
  },
  {
    title: "Learning React Fundamentals",
    date: "2023-06-10",
    category: "Learning",
    description: "My journey learning React fundamentals including components, props, state management, and the component lifecycle. Notes and examples from my study sessions.",
    image: "/background/hero.jpg",
    link: "/archive/learning-react",
    tags: ["React", "Learning", "JavaScript", "Frontend"]
  },
  {
    title: "CSS Animation Experiments",
    date: "2023-05-22",
    category: "Experiments",
    description: "A collection of CSS animation experiments and interactive effects. Exploring keyframes, transitions, and modern CSS features for engaging user interfaces.",
    image: "/background/about.jpg",
    link: "/archive/css-animations",
    tags: ["CSS", "Animation", "UI/UX", "Web Design"]
  },
  {
    title: "Python Data Analysis Scripts",
    date: "2023-03-08",
    category: "Code Snippets",
    description: "Useful Python scripts for data analysis, visualization, and processing. Includes pandas, matplotlib, and numpy examples for common data science tasks.",
    image: "/background/hero.jpg",
    link: "/archive/python-data-scripts",
    tags: ["Python", "Data Science", "Pandas", "Visualization"]
  },
  {
    title: "Useful VS Code Extensions",
    date: "2023-02-14",
    category: "Resources",
    description: "A curated list of VS Code extensions that boost productivity for web development, including themes, debugging tools, and code formatting utilities.",
    image: "/background/about.jpg",
    link: "/archive/vscode-extensions",
    tags: ["VS Code", "Productivity", "Tools", "Development"]
  }
];

export default function Archive() {
  return (
    <Layout title="Archive">
      <div className={styles.archiveContainer}>
        <p className={styles.description}>
          Welcome to my archive! This is a collection of my past work, experiments, 
          learning projects, and various resources I've created over time. 
          A digital museum of my development journey.
        </p>
        
        <div className={styles.archiveGrid}>
          {archiveItems.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              date={item.date}
              category={item.category}
              description={item.description}
              image={item.image}
              link={item.link}
              tags={item.tags}
              type="archive"
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
