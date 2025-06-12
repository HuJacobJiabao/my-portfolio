import styles from '../styles/WorkCard.module.css';

interface WorkCardProps {
  companyName: string;
  position: string;
  duration: string;
  location: string;
  highlights: string[];
  logoSrc?: string;
  logoAlt?: string;
  borderColor?: string;
  borderHoverColor?: string;
  logoBackgroundColor?: string;
  highlightColor?: string; // For li::before color
}

const WorkCard = ({
  companyName,
  position,
  duration,
  location,
  highlights,
  logoSrc,
  logoAlt,
  borderColor,
  borderHoverColor,
  logoBackgroundColor,
  highlightColor,
}: WorkCardProps) => {
  // Create style object with CSS variables for dynamic colors
  const cardStyle = {
    '--border-color': borderColor || '#e74c3c',
    '--border-hover-color': borderHoverColor || '#c0392b',
    '--logo-background-color': logoBackgroundColor || 'transparent',
    '--highlight-color': highlightColor || '#e74c3c',
  } as React.CSSProperties;

  return (
    <div className={styles.workCard} style={cardStyle}>
      {logoSrc && (
        <div className={styles.companyLogo}>
          <img src={logoSrc} alt={logoAlt} className={styles.logoImage} />
        </div>
      )}
      <div className={styles.workContent}>
        <h3 className={styles.companyName}>{companyName}</h3>
        <p className={styles.position}>{position}</p>
        <p className={styles.workDuration}>{duration}</p>
        <p className={styles.location}>{location}</p>
        <ul className={styles.workHighlights}>
          {highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkCard;
