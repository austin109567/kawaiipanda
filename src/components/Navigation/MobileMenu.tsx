import { FC, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon, X } from 'lucide-react';
import { Logo } from '../Logo';
import { useTheme } from '../../contexts/ThemeContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: {
    icon: LucideIcon;
    label: string;
    path: string;
  }[];
}

export const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose, menuItems }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return path !== '/' && location.pathname.startsWith(path);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          theme === 'dark' 
            ? 'bg-background-dark/95' 
            : 'bg-background-light/95'
        } backdrop-blur-md`}
        aria-hidden="true"
      />
      
      {/* Menu Content */}
      <div 
        ref={menuRef}
        className="relative flex flex-col h-full max-h-screen animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="sticky top-0 z-10">
          <div className={`flex justify-between items-center w-full px-6 py-4 border-b ${
            theme === 'dark'
              ? 'border-primary-main/20 bg-background-dark/95'
              : 'border-primary-main/10 bg-background-light/95'
          } backdrop-blur-md`}>
            <Logo />
            <button
              onClick={onClose}
              className="p-2 text-primary-main hover:bg-primary-main/10 rounded-lg transition-all active:scale-95"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav 
          className="flex-1 overflow-y-auto overscroll-contain px-6 py-4"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col space-y-2 animate-in fade-in duration-500 delay-150">
            {menuItems.map(({ icon: Icon, label, path }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all active:scale-[0.98] ${
                    active
                      ? 'bg-primary-main text-white shadow-glow font-medium'
                      : `${
                          theme === 'dark'
                            ? 'text-white/90 hover:text-white'
                            : 'text-gray-800 hover:text-primary-main'
                        } hover:bg-primary-main/10 hover:translate-x-1`
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span className={active ? 'font-medium' : ''}>{label}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Safe Area Padding */}
          <div className="h-safe-area-bottom" />
        </nav>
      </div>
    </div>
  );
};