import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ArrowRight, Wallet, Sparkles, Zap, Shield, Sword, Users, Trophy, Gamepad, Twitter, MessageCircle, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS } from '../../config/constants';

export const HomePage: FC = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-[80vh] space-y-16 px-4">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 scale-105 transform hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-main/20 via-primary-main/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,130,95,0.2)_0%,transparent_100%)]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-8 py-24 px-6">
          <h1 className="text-4xl md:text-6xl font-title">
            <span className="text-primary-main glow-text">
              The Ultimate NFT Raiding Experience
            </span>
          </h1>
          <p className="text-lg md:text-xl text-text-light-secondary dark:text-text-dark-secondary max-w-2xl mx-auto leading-relaxed">
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-main/20 text-text-light-primary dark:text-white/60 rounded-xl text-lg font-semibold cursor-not-allowed backdrop-blur-sm"
            >
              Connect Wallet to Play
            </button>
          )}
        </div>
      </div>

{/* Statistics Section */}
<div className="gradient-box p-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-title text-text-light-primary dark:text-white mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-text-light-secondary dark:text-text-dark-secondary max-w-2xl mx-auto">
            Be part of an ever-expanding universe of players, creators, and collectors. Our community is growing rapidly, with new adventures and opportunities emerging every day.
          </p>
        </div>
        
        <div className="gradient-box p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-main mb-2 glow-text">10K+</div>
              <div className="text-text-light-secondary dark:text-text-dark-secondary">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-main mb-2 glow-text">100K+</div>
              <div className="text-text-light-secondary dark:text-text-dark-secondary">NFTs in Play</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-main mb-2 glow-text">500K+</div>
              <div className="text-text-light-secondary dark:text-text-dark-secondary">Quests Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="gradient-box p-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        <div className="gradient-box p-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-title">
                About <span className="text-primary-main glow-text">Our Platform</span>
              </h1>
              <p className="text-lg text-text-light-secondary dark:text-text-dark-secondary">
                A revolutionary NFT gaming platform where your digital collectibles come to life in epic battles and quests. Experience the future of gaming on Solana.
              </p>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="src/assets/pandas/chillingpanda.PNG"
                alt="Gaming Platform"
                className="rounded-xl shadow-glow"
              />
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Features Grid */}
      <div className="gradient-box p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-title text-text-light-primary dark:text-white mb-8 text-center">
          Epic Gaming Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300">
            <Wallet className="w-12 h-12 text-primary-main mb-6" />
            <h3 className="text-xl font-heading text-text-light-primary dark:text-white mb-4">NFT Integration</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Your NFTs become powerful characters in our gaming universe. Each with unique abilities and traits.
            </p>
          </div>
          
          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300">
            <Sparkles className="w-12 h-12 text-primary-main mb-6" />
            <h3 className="text-xl font-heading text-text-light-primary dark:text-white mb-4">Daily Rewards</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Complete daily quests and challenges to earn XP, tokens, and exclusive rewards.
            </p>
          </div>
          
          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300">
            <Shield className="w-12 h-12 text-primary-main mb-6" />
            <h3 className="text-xl font-heading text-text-light-primary dark:text-white mb-4">Secure Gaming</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Built on Solana for lightning-fast, secure gameplay with minimal transaction fees.
            </p>
          </div>
        </div>
      </div>

      {/* NFT Builder Section */}
      <div className="gradient-box max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 p-8">
          <div className="lg:w-1/2">
            <img 
              src="public/assets/pandas/happypanda.PNG"
              alt="NFT Builder"
              className="rounded-xl shadow-glow transform hover:scale-105 transition-all duration-500"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-title text-text-light-primary dark:text-white mb-6">
              Create Your Own NFTs
            </h2>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6 leading-relaxed">
              Our intuitive NFT Builder lets you create unique characters by combining different traits. Mix and match elements to create the perfect warrior for your gaming adventures.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4">
                <h3 className="text-text-light-primary dark:text-white font-medium mb-2">Custom Traits</h3>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                  Choose from hundreds of unique traits to create your character.
                </p>
              </div>
              <div className="glass-panel p-4">
                <h3 className="text-text-light-primary dark:text-white font-medium mb-2">Easy Export</h3>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                  Download your creation instantly in high resolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Community Section */}
      <div className="gradient-box max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Image */}
          <div className="relative h-full min-h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1920&q=80"
              alt="Gaming Community"
              className="absolute inset-0 w-full h-full object-cover rounded-l-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-main/60 to-transparent" />
          </div>

          {/* Right side - Content */}
          <div className="p-8 lg:p-12">
            <h2 className="text-3xl font-title text-text-light-primary dark:text-white mb-6">Join Our Community</h2>
            <p className="text-lg text-text-light-secondary dark:text-text-dark-secondary mb-8">
              Connect with thousands of players, share strategies, and stay updated on the latest features and events. Be part of an ever-growing universe of raiders.
            </p>

            <div className="grid grid-cols-1 gap-4">
              <a 
                href="#" 
                className="social-link-card"
              >
                <Twitter className="w-8 h-8 text-primary-main" />
                <div>
                  <div className="font-semibold text-text-light-primary dark:text-white mb-1">Follow on Twitter</div>
                  <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Get the latest updates and announcements</div>
                </div>
              </a>

              <a 
                href="#" 
                className="social-link-card"
              >
                <MessageCircle className="w-8 h-8 text-primary-main" />
                <div>
                  <div className="font-semibold text-text-light-primary dark:text-white mb-1">Join Discord</div>
                  <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Chat with players and share strategies</div>
                </div>
              </a>

              <a 
                href="#" 
                className="social-link-card"
              >
                <Github className="w-8 h-8 text-primary-main" />
                <div>
                  <div className="font-semibold text-text-light-primary dark:text-white mb-1">Contribute on GitHub</div>
                  <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Help shape the future of the platform</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};