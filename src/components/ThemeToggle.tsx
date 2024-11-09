import { FC } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-primary-main/5 dark:bg-primary-main/10 backdrop-blur-xl border border-primary-main/20 hover:border-primary-main/40 transition-all transform hover:scale-105 shadow-glow"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-primary-main" />
      ) : (
        <Moon className="w-5 h-5 text-primary-main" />
      )}
    </button>
  );
};