import { FC } from 'react';
import { Link } from 'react-router-dom';

export const Logo: FC = () => {
  return (
    <Link to="/" className="flex-shrink-0">
      <div className="text-center">
        <div className="text-2xl font-display font-bold text-primary-main tracking-wider glow-text">
          KAWAII
        </div>
        <div className="text-xs font-light text-primary-main/80 mt-0.5">
          PANDAS
        </div>
      </div>
    </Link>
  );
};