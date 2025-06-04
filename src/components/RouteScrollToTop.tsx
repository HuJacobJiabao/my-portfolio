import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to ensure the route change is complete
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
