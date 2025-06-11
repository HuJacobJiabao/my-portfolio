import React from 'react';
import styles from '../styles/ProfileCard.module.css';
import config from '../config/config';

const ProfileCard: React.FC = () => {
  // Get contact data directly from navigation
  const contactData = config.home.navigation.contact;

  return (
    <div className={styles.profileCard}>
      <div className={styles.photoWrapper}>
        <img src={`${import.meta.env.BASE_URL}favicon.png`} alt={config.home.hero.name} className={styles.photo} />
      </div>
      <h3 className={styles.profileName}>{config.home.hero.name}</h3>
      <p className={styles.profileTitle}>{config.home.hero.title}</p>
      <p className={styles.profileTitle}>{config.home.hero.subtitle}</p>
      <div className={styles.contactCard}>
        <div className={styles.contactList}>
          <a href={`mailto:${contactData?.email || ''}`} className={styles.contactItem}>
            <i className="fas fa-envelope"></i>
          </a>
          <a href={contactData?.github || ''} className={styles.contactItem}>
            <i className="fab fa-github"></i>
          </a>
          <a href={contactData?.linkedin || ''} className={styles.contactItem}>
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
