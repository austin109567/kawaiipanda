import { FC, useState, useEffect } from 'react';
import { Home, Image, Info as InfoIcon, Settings, Wallet, Swords, Palette, Trophy, User, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Logo } from '../Logo';
import { MobileMenu } from './MobileMenu';

interface NavigationProps {}

export const Navigation: FC<NavigationProps> = () => {
  const { connected, publicKey } = useWallet();
  const location = useLocation();
  const isAdmin = publicKey?.toString() === "8jN1XtgiuWeyNjzysYVqGZ1mPAG37sjmuCTnENz66wrs";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const publicRoutes = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: InfoIcon, label: 'Info', path: '/info' },
    { icon: Palette, label: 'NFT Builder', path: '/builder' },
    { icon: Trophy, label: 'Leaderboards', path: '/leaderboards' },
  ];

  const protectedRoutes = [
    { icon: Wallet, label: 'My NFTs', path: '/dashboard' },
    { icon: Image, label: 'Gallery', path: '/gallery' },
    { icon: Swords, label: 'Raid', path: '/raid' },
    { icon: User, label: 'Raid Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const adminRoutes = [
    { icon: Settings, label: 'Admin Panel', path: '/admin' },
  ];

  const menuItems = [
    ...publicRoutes,
    ...(connected ? protectedRoutes : []),
    ...(isAdmin ? adminRoutes : []),
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return path !== '/' && location.pathname.startsWith(path);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <Logo />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="lg:hidden p-2 text-primary-main hover:bg-primary-main/10 rounded-lg transition-colors"
        aria-label="Open menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-4" aria-label="Main navigation">
        {menuItems.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-300 whitespace-nowrap ${
                active
                  ? 'bg-primary-main text-white shadow-glow'
                  : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-primary-main hover:bg-primary-main/10'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="font-medium text-sm">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuItems={menuItems}
      />
    </div>
  );
};