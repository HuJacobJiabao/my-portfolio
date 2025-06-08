import styles from '../styles/Footer.module.css';
import config from '../config/config';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Fixed Background Layer for Footer */}
      <div className={styles.backgroundFixed}></div>
      
      <div className={styles.footerText}>
        <p>{config.site.footer.copyright}</p>
        <p>{config.site.footer.message}</p>
      </div>
    </footer>
  );
};

export default Footer;
