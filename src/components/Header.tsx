import { FC, useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { WalletConnect } from './WalletConnect';
import { useTheme } from '../contexts/ThemeContext';

export const Header: FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    let ticking = false;
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show header when scrolling up or at top
          setIsVisible(currentScrollY <= 0 || currentScrollY < lastScrollY);
          setLastScrollY(currentScrollY);
          
          ticking = false;
        });

        ticking = true;
      }

      // Reset timeout on each scroll
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[var(--z-sticky)] transition-all duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        theme === 'dark'
          ? 'bg-background-dark/95 border-b border-primary-main/20'
          : 'bg-background-light/95 border-b border-primary-main/10'
      } backdrop-blur-xl shadow-lg shadow-primary-main/5`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Navigation />
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
};