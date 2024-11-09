import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Star, TrendingUp, User } from 'lucide-react';
import { playerService } from '../../services/playerService';
import { Link } from 'react-router-dom';
import { LevelDisplay } from '../LevelDisplay';
import { Player } from '../../types/player';

export const UserProfile: FC = () => {
  const { publicKey } = useWallet();
  const [playerStats, setPlayerStats] = useState<Player | null>(null);

  useEffect(() => {
    if (!publicKey) return;

    // Initialize player stats
    const stats = playerService.getPlayer(publicKey.toString());
    if (!stats) {
      playerService.enrollPlayer(publicKey.toString());
    }
    setPlayerStats(stats || playerService.getPlayer(publicKey.toString()));

    // Set up listener for updates
    const updateStats = () => {
      setPlayerStats(playerService.getPlayer(publicKey.toString()));
    };

    playerService.addListener(publicKey.toString(), updateStats);
    return () => playerService.removeListener(publicKey.toString(), updateStats);
  }, [publicKey]);

  if (!playerStats) return null;

  return (
    <div className="gradient-box p-8">
      <div className="flex items-center gap-2 mb-6">
        <User className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2" />
        <h2 className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2">User Profile</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link to="/profile" className="relative group">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-pink/20">
              {playerStats.profilePicture ? (
                <img
                  src={playerStats.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/assets/defaultpfp.png"
                  alt="Default Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </Link>

          <div>
            <Link 
              to="/profile"
              className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2"
            >
              {playerStats.showWallet 
                ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
                : playerStats.username || 'Set Username'}
            </Link>
            <div className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2">
              Click name or PFP to edit profile
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-primary-pink/20 rounded-lg">
          <Star className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2" />
          <span className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2">
            {playerStats.experience.toLocaleString()} XP
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="gradient-box p-8">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-primary-main" />
            <h3 className="text-lg font-semibold text-text-light-primary dark:text-white">Level & XP</h3>
          </div>
          <div className="space-y-2">
            <LevelDisplay xp={playerStats.experience} showProgress />
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
              Total XP: {playerStats.experience.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="gradient-box p-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2" />
            <h3 className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2">Global Rank</h3>
          </div>
          <p className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2">
            #{playerService.getLeaderboard().findIndex(p => p.wallet === publicKey?.toString()) + 1}
          </p>
        </div>
      </div>
    </div>
  );
};