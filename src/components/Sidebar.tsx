import React from 'react';
import styles from '../styles/Sidebar.module.css';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'intro', title: 'About Me', icon: '👤' },
    { id: 'education', title: 'Education', icon: '🎓' },
    { id: 'experience', title: 'Work Experience', icon: '💼' },
    { id: 'projects', title: 'Projects', icon: '💻' }
  ];

  return (
    <div className={styles.leftSidebar}>
      {/* Profile Card with Integrated Contact Info */}
      <div className={styles.profileCard}>
        <div className={styles.photoWrapper}>
          <img src={`${import.meta.env.BASE_URL}favicon.png`} alt="Jiabao Hu" className={styles.photo} />
        </div>
        <h3 className={styles.profileName}>Jiabao Hu</h3>
        <p className={styles.profileTitle}>Full-stack Developer</p>
        <p className={styles.profileTitle}>MSCS at USC</p>
        <div className={styles.contactCard}>
          <div className={styles.contactList}>
            <a href="mailto:hujiabao1224@gmail.com" className={styles.contactItem}>
              <i className="fas fa-envelope"></i>
            </a>
            <a href="https://github.com/HuJacobJiabao" className={styles.contactItem}>
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/jiabao-hu-920664221/" className={styles.contactItem}>
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className={styles.navigationCard}>
        <h4>Navigation</h4>
        <nav className={styles.navList}>
          {sections.map(section => (
            <button
              key={section.id}
              className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
              onClick={() => onSectionChange(section.id)}
            >
              <span className={styles.navIcon}>{section.icon}</span>
              <span>{section.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
