import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, MessageCircle, Github, ExternalLink } from 'lucide-react';

export const Footer: FC = () => {
  return (
    <footer className="border-t border-adaptive bg-adaptive-card backdrop-blur-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold text-primary-pink tracking-wider glow-text">
                KAWAII
              </div>
              <div className="text-xs font-light text-primary-pink/80 mt-0.5">
                PANDAS
              </div>
            </div>
            <p className="text-adaptive-secondary mt-4 text-sm">
              The Ultimate NFT Raiding Experience on Solana
            </p>
          </div>

          <div>
            <h3 className="text-adaptive-primary font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-adaptive-secondary hover:text-primary-pink transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-adaptive-secondary hover:text-primary-pink transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/raid" className="text-adaptive-secondary hover:text-primary-pink transition-colors text-sm">
                  Raid
                </Link>
              </li>
              <li>
                <Link to="/builder" className="text-adaptive-secondary hover:text-primary-pink transition-colors text-sm">
                  NFT Builder
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-adaptive-primary font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/info" className="text-adaptive-secondary hover:text-primary-pink transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="text-adaptive-secondary hover:text-primary-pink transition-colors text-sm flex items-center gap-1">
                  Documentation <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-adaptive-secondary hover:text-primary-pink transition-colors text-sm flex items-center gap-1">
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-adaptive-primary font-semibold mb-4">Community</h3>
            <div className="flex gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-pink/10 text-primary-pink rounded-lg hover:bg-primary-pink/20 transition-colors hover:scale-110 transform duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-pink/10 text-primary-pink rounded-lg hover:bg-primary-pink/20 transition-colors hover:scale-110 transform duration-300"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-pink/10 text-primary-pink rounded-lg hover:bg-primary-pink/20 transition-colors hover:scale-110 transform duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-adaptive mt-8 pt-8 text-center">
          <p className="text-sm text-adaptive-muted">
            © {new Date().getFullYear()} Kibalz.xyz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};