import React from 'react';
import styles from '../styles/ProjectCard.module.css';

interface ProjectCardProps {
  projectName: string;
  description: string;
  technologies: string[];
  duration: string;
  projectUrl?: string;
  githubUrl?: string;
  imageSrc: string;
  imageAlt: string;
  highlights: React.ReactNode[];
}

const ProjectCard = ({
  projectName,
  description,
  technologies,
  duration,
  projectUrl,
  githubUrl,
  imageSrc,
  imageAlt,
  highlights,
}: ProjectCardProps) => {
  return (
    <div className={styles.projectCard}>
      <div className={styles.projectImageSection}>
        <div className={styles.projectImage}>
          <img src={imageSrc} alt={imageAlt} className={styles.image} />
        </div>
        {(projectUrl || githubUrl) && (
          <div className={styles.projectActions}>
            {projectUrl && (
              <a href={projectUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                <span className={styles.linkText}>Click to view →</span>
              </a>
            )}
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                <i className="fab fa-github" style={{ marginRight: '0.5em', fontSize: '1.1em' }}></i>
                <span className={styles.linkText}>View on GitHub</span>
              </a>
            )}
          </div>
        )}
      </div>
      <div className={styles.projectContent}>
        <div className={styles.projectInfo}>
          <h3 className={styles.projectName}>{projectName}</h3>
          <p className={styles.description}>{description}</p>
          <p className={styles.duration}>{duration}</p>
          <div className={styles.technologies}>
            {technologies.map((tech, index) => (
              <span key={index} className={styles.techTag}>{tech}</span>
            ))}
          </div>
        </div>
        <div className={styles.projectDetails}>
          <ul className={styles.highlights}>
            {highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
