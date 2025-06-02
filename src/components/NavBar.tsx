import { Link } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setMenuOpen(false);
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setAtTop(currentScrollPos <= 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  
  return (
    <nav className={`${styles.nav} ${visible ? styles.show : styles.hide} ${atTop ? styles.transparent : styles.solid}`}>
      <div className={styles.logo}>🌟 Jiabao Hu</div>

      <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ''}`}>
        <li><Link to="/my-portfolio/">Home</Link></li>
        <li><a href={`${import.meta.env.BASE_URL}Jiabao_Resume.pdf`} target="_blank" rel="noopener noreferrer">CV</a></li>
        <li><Link to="/my-portfolio/projects/">Project</Link></li>
        <li><Link to="/my-portfolio/blog/">Blog</Link></li>
        <li><Link to="/my-portfolio/archive/">Archive</Link></li>
      </ul>
    </nav>
  );
}
