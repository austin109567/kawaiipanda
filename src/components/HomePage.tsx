import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ArrowRight, Wallet, Sparkles, Zap, Shield, Sword, Users, Trophy, Gamepad, Twitter, MessageCircle, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: FC = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-[80vh] space-y-16 px-4">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 scale-105 transform hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,158,205,0.1)_0%,transparent_100%)]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-8 py-24 px-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="text-primary-main glow-text">
              The Ultimate NFT Raiding Experience
            </span>
          </h1>
          <p className="text-lg md:text-xl text-text-light-primary dark:text-white/90 max-w-2xl mx-auto leading-relaxed">
            Embark on Epic Quests to become the Ultimate NFT Raider. Quest, Raid, and Battle to Earn Rewards in our Immersive Gaming Ecosystem.
          </p>
          {connected ? (
            <Link
              to="/raid"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-main text-white rounded-xl text-lg font-semibold transition-all transform hover:scale-105 hover:bg-primary-main/90 shadow-glow"
            >
              <Sword className="w-5 h-5" />
              Enter the Raid
            </Link>
          ) : (
            <button
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white/60 rounded-xl text-lg font-semibold cursor-not-allowed backdrop-blur-sm"
            >
              Connect Wallet to Play
            </button>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="gradient-box p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-title text-text-light-primary dark:text-white mb-8 text-center">
          Epic Gaming Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300 border border-primary-main/20 hover:border-primary-main/40">
            <Wallet className="w-12 h-12 text-primary-main mb-6" />
            <h3 className="text-xl font-heading text-text-light-primary dark:text-white mb-4">NFT Integration</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Your NFTs become powerful characters in our gaming universe. Each with unique abilities and traits.
            </p>
          </div>
          
          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300 border border-primary-main/20 hover:border-primary-main/40">
            <Sparkles className="w-12 h-12 text-primary-main mb-6" />
            <h3 className="text-xl font-heading text-text-light-primary dark:text-white mb-4">Daily Rewards</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Complete daily quests and challenges to earn XP, tokens, and exclusive rewards.
            </p>
          </div>
          
          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300 border border-primary-main/20 hover:border-primary-main/40">
            <Shield className="w-12 h-12 text-primary-main mb-6" />
            <h3 className="text-xl font-heading text-text-light-primary dark:text-white mb-4">Secure Gaming</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Built on Solana for lightning-fast, secure gameplay with minimal transaction fees.
            </p>
          </div>
        </div>
      </div>

      {/* Rest of the HomePage content */}
      {/* NFT Builder Section */}
      {/* Community Section */}
      {/* Statistics Section */}
    </div>
  );
};