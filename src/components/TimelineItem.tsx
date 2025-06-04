import { useNavigate } from 'react-router-dom';
import styles from '../styles/TimelineItem.module.css';

interface TimelineItemProps {
  title: string;
  date: string;
  image: string;
  type: 'project' | 'blog';
  link?: string;
  category?: string;
  id?: string; // Add id for project navigation
}

export default function TimelineItem({ 
  title, 
  date, 
  image, 
  type,
  link,
  category,
  id
}: TimelineItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === 'project' && id) {
      // Navigate to project detail page
      navigate(`/my-portfolio/project/${id}`);
    } else if (link) {
      // External link
      window.open(link, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <div className={styles.timelineItem} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img 
          src={image || `${import.meta.env.BASE_URL}default_cover.jpg`} 
          alt={title} 
          className={styles.itemImage}
        />
        <div className={styles.typeIndicator}>
          <span className={styles.typeIcon}>
            {type === 'project' ? '💻' : '📝'}
          </span>
        </div>
      </div>
      
      <div className={styles.itemInfo}>
        <h3 className={styles.itemTitle}>{title}</h3>
        <div className={styles.itemMeta}>
          <span className={styles.itemDate}>
            <i className="fas fa-calendar"></i>
            {date}
          </span>
          {category && (
            <span className={styles.itemCategory}>
              <i className="fas fa-tag"></i>
              {category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
