import styles from '../styles/WorkCard.module.css';

interface WorkCardProps {
  companyName: string;
  position: string;
  duration: string;
  location: string;
  highlights: string[];
  logoSrc?: string;
  logoAlt?: string;
}

const WorkCard = ({
  companyName,
  position,
  duration,
  location,
  highlights,
  logoSrc,
  logoAlt,
}: WorkCardProps) => {
  return (
    <div className={styles.workCard}>
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
