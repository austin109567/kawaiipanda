import { FC } from 'react';
import { Shield, Zap, Code, Sword, Trophy, Users, Wallet2, ArrowRight, Gamepad, Star, Twitter, MessageCircle, Github } from 'lucide-react';

export const Info: FC = () => {
  return (
    <div className="space-y-24 px-4 sm:px-6 lg:px-8">
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
                src="src/assets/pandas/sittingpanda.PNG"
                alt="Gaming Platform"
                className="rounded-xl shadow-glow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="gradient-box max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-title text-text-light-primary dark:text-white mb-8 text-center">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300">
            <Shield className="w-10 h-10 text-primary-main mb-6" />
            <h3 className="text-xl font-semibold text-text-light-primary dark:text-white mb-4">Secure Platform</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Built with military-grade security. Your assets remain in your wallet, always under your control.
            </p>
          </div>

          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300">
            <Zap className="w-10 h-10 text-primary-main mb-6" />
            <h3 className="text-xl font-semibold text-text-light-primary dark:text-white mb-4">Lightning Fast</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Powered by Solana for instant transactions and seamless gameplay experience.
            </p>
          </div>

          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300">
            <Code className="w-10 h-10 text-primary-main mb-6" />
            <h3 className="text-xl font-semibold text-text-light-primary dark:text-white mb-4">Open Source</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Transparent and community-driven development. Contribute and help shape the future.
            </p>
          </div>
        </div>
      </div>

      {/* Raid System Guide */}
      <div className="gradient-box max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-title text-text-light-primary dark:text-white mb-8">Raid System Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Sword className="w-6 h-6 text-primary-main flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-text-light-primary dark:text-white mb-2">Raid Boss Mechanics</h3>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-4">
                  Raid bosses are powerful enemies that require community cooperation to defeat. Each boss has unique abilities and rewards.
                </p>
                <ul className="space-y-2 text-text-light-secondary dark:text-text-dark-secondary">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary-main" />
                    Complete quests to deal damage to the raid boss
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary-main" />
                    Higher defense means more HP for the raid boss
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary-main" />
                    Earn bonus XP when the community defeats the boss
                  </li>
                </ul>
                
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Star className="w-6 h-6 text-primary-main flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-text-light-primary dark:text-white mb-2">Quest System</h3>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mb-4">
                  Complete daily, weekly, and monthly quests to earn rewards and contribute to raid boss battles.
                </p>
                <ul className="space-y-2 text-text-light-secondary dark:text-text-dark-secondary">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary-main" />
                    Submit proof of quest completion
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary-main" />
                    Track your progress on the leaderboard
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary-main" />
                    Earn XP and special rewards
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300">
            <Shield className="w-10 h-10 text-primary-main mb-6" />
            <h3 className="text-xl font-semibold text-text-light-primary dark:text-white mb-4">Secure Platform</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Built with military-grade security. Your assets remain in your wallet, always under your control.
            </p>
          </div>

          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300">
            <Zap className="w-10 h-10 text-primary-main mb-6" />
            <h3 className="text-xl font-semibold text-text-light-primary dark:text-white mb-4">Lightning Fast</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Powered by Solana for instant transactions and seamless gameplay experience.
            </p>
          </div>

          <div className="glass-panel p-8 hover:shadow-glow transition-all duration-300">
            <Code className="w-10 h-10 text-primary-main mb-6" />
            <h3 className="text-xl font-semibold text-text-light-primary dark:text-white mb-4">Open Source</h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Transparent and community-driven development. Contribute and help shape the future.
            </p>
          </div>
        
        </div>
      </div>

      {/* How It Works */}
      <div className="gradient-box max-w-6xl mx-auto p-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img 
              src="src/assets/pandas/lookingpanda.PNG"
              alt="How It Works"
              className="rounded-xl shadow-glow"
            />
          </div>
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-3xl font-title text-text-light-primary dark:text-white">How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-main/20 flex items-center justify-center">
                  <Wallet2 className="w-6 h-6 text-primary-main" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-light-primary dark:text-white mb-2">1. Connect Your Wallet</h3>
                  <p className="text-text-light-secondary dark:text-text-dark-secondary">
                    Link your Solana wallet to access your NFT collection and start playing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-main/20 flex items-center justify-center">
                  <Sword className="w-6 h-6 text-primary-main" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-light-primary dark:text-white mb-2">2. Enter Raids</h3>
                  <p className="text-text-light-secondary dark:text-text-dark-secondary">
                    Join epic raid battles with your NFTs and compete against other players.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-main/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary-main" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-light-primary dark:text-white mb-2">3. Earn Rewards</h3>
                  <p className="text-text-light-secondary dark:text-text-dark-secondary">
                    Complete quests and win battles to earn XP and exclusive rewards.
                  </p>
                </div>
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