import React from 'react';
import styles from '../styles/BlogCard.module.css';

interface BlogCardProps {
  title: string;
  date?: string;
  category?: string;
  description: string;
  image?: string;
  link?: string;
  tags?: string[];
}

export default function BlogCard({ 
  title, 
  date, 
  category, 
  description, 
  image, 
  link, 
  tags = []
}: BlogCardProps) {
  const handleClick = () => {
    if (link) {
      window.open(link, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <div 
      className={`${styles.blogCard} ${link ? styles.clickable : ''}`}
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
      </div>
    </div>
  );
}
