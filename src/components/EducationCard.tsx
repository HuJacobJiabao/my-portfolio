import styles from '../styles/EducationCard.module.css';

interface EducationCardProps {
  schoolName: string;
  degree: string;
  duration: string;
  location: string;
  logoSrc: string;
  logoAlt: string;
  highlights: string[];
}

const EducationCard = ({
  schoolName,
  degree,
  duration,
  location,
  logoSrc,
  logoAlt,
  highlights,
}: EducationCardProps) => {
  return (
    <div className={styles.educationCard}>
      <div className={styles.schoolLogo}>
        <img src={logoSrc} alt={logoAlt} className={styles.logoImage} />
      </div>
      <div className={styles.educationContent}>
        <div className={styles.schoolInfo}>
          <h3 className={styles.schoolName}>{schoolName}</h3>
          <p className={styles.degree}>{degree}</p>
          <p className={styles.duration}>{duration}</p>
          <p className={styles.location}>{location}</p>
        </div>
        <div className={styles.educationDetails}>
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

export default EducationCard;
