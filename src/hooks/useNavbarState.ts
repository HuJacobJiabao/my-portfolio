import { useState, useEffect, useRef } from 'react';

export const useNavbarState = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const prevScrollPosRef = useRef(0);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      setVisible(prevScrollPosRef.current > currentScrollPos || currentScrollPos < 10);
      setAtTop(currentScrollPos <= 10);
      prevScrollPosRef.current = currentScrollPos;
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { visible, atTop, prevScrollPos };
};
