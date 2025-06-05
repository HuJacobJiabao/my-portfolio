import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';
import { useState, useEffect } from 'react';
import config from '../config/config';
import { useNavbarState } from '../hooks/useNavbarState';

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { visible, atTop } = useNavbarState();
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to handle navigation clicks
  const handleNavClick = (to: string, event: React.MouseEvent) => {
    // If we're already on this page, force re-navigation with a timestamp
    if (location.pathname === to) {
      event.preventDefault();
      // Add a timestamp to force navigation even to the same route
      navigate(`${to}?refresh=${Date.now()}`, { replace: true });
      setMenuOpen(false);
      return;
    }
    // Otherwise, let React Router handle it normally
    setMenuOpen(false);
  };

  // Clear any residual inline styles on component mount
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar instanceof HTMLElement) {
      navbar.style.transform = '';
      navbar.style.transition = '';
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setMenuOpen(false);
      
      // Clear any inline styles that might have been applied
      const navbar = document.querySelector('nav');
      if (navbar instanceof HTMLElement) {
        navbar.style.transform = '';
        navbar.style.transition = '';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  return (
    <nav className={`${styles.nav} ${visible ? styles.show : styles.hide} ${atTop ? styles.transparent : styles.solid}`}>
      <div className={styles.logo}>🌟 {config.site.hero.name}</div>

      <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ''}`}>
        <li><Link to="/my-portfolio/" onClick={(e) => handleNavClick('/my-portfolio/', e)}>Home</Link></li>
        <li><a href={`${import.meta.env.BASE_URL}${config.site.contact.resume}`} target="_blank" rel="noopener noreferrer">CV</a></li>
        <li><Link to="/my-portfolio/project/" onClick={(e) => handleNavClick('/my-portfolio/project/', e)}>Project</Link></li>
        <li><Link to="/my-portfolio/blog/" onClick={(e) => handleNavClick('/my-portfolio/blog/', e)}>Blog</Link></li>
        <li><Link to="/my-portfolio/archive/" onClick={(e) => handleNavClick('/my-portfolio/archive/', e)}>Archive</Link></li>
      </ul>
    </nav>
  );
}
