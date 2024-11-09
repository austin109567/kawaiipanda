import { FC, ReactNode } from 'react';

interface GlassContainerProps {
  children: ReactNode;
}

export const GlassContainer: FC<GlassContainerProps> = ({ children }) => {
  return (
    <div className="bg-neutral-charcoal/40 backdrop-blur-sm rounded-xl p-6 border border-mystical-violet/20">
      {children}
    </div>
  );
};