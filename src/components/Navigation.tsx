import { FC } from 'react';
import { Home, Image, Info as InfoIcon, Settings, Wallet, Swords, Palette, Trophy, User, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Logo } from './Logo';

interface NavigationProps {}

export const Navigation: FC<NavigationProps> = () => {
  const { connected, publicKey } = useWallet();
  const location = useLocation();
  const isAdmin = publicKey?.toString() === "8jN1XtgiuWeyNjzysYVqGZ1mPAG37sjmuCTnENz66wrs";

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
    <div className="flex flex-col lg:flex-row lg:items-center w-full gap-4">
      {/* Logo and Desktop Nav */}
      <div className="flex items-center justify-between lg:w-auto w-full">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-4">
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
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-medium text-sm">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation */}
      <nav className="lg:hidden w-full overflow-x-auto scrollbar-none">
        <div className="flex flex-wrap gap-2 pb-2">
          {menuItems.map(({ icon: Icon, label, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                  active
                    ? 'bg-primary-main text-white shadow-glow'
                    : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-primary-main hover:bg-primary-main/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};