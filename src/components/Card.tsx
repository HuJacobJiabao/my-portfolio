import React from 'react';
import styles from '../styles/Card.module.css';

interface CardProps {
  title: string;
  date?: string;
  category?: string;
  description: string;
  image?: string;
  link?: string;
  tags?: string[];
  type?: 'project' | 'blog' | 'archive';
}

export default function Card({ 
  title, 
  date, 
  category, 
  description, 
  image, 
  link, 
  tags = [],
  type = 'project' 
}: CardProps) {
  const handleClick = () => {
    if (link) {
      window.open(link, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <div 
      className={`${styles.card} ${styles[type]} ${link ? styles.clickable : ''}`}
      onClick={handleClick}
    >
      {image && (
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.cardImage} />
        </div>
      )}
      
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <div className={styles.cardMeta}>
            {date && (
              <span className={styles.cardDate}>
                <i className="fas fa-calendar"></i>
                {date}
              </span>
            )}
            {category && (
              <span className={styles.cardCategory}>
                <i className="fas fa-tag"></i>
                {category}
              </span>
            )}
          </div>
        </div>
        
        <p className={styles.cardDescription}>{description}</p>
        
        {tags.length > 0 && (
          <div className={styles.cardTags}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {link && (
          <div className={styles.cardFooter}>
            <span className={styles.readMore}>
              Read More <i className="fas fa-arrow-right"></i>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
