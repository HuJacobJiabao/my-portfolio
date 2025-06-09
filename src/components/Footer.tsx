import styles from '../styles/Footer.module.css';
import config from '../config/config';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Fixed Background Layer for Footer */}
      <div className={styles.backgroundFixed}></div>
      
      <div className={styles.footerText}>
        <p>{config.footer.copyright}</p>
        <p>{config.footer.message}</p>
      </div>
    </footer>
  );
};

export default Footer;
