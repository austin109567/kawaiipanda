import { FC } from 'react';
import { Star, TrendingUp, Trophy, Sword, X } from 'lucide-react';
import { Player } from '../../types/player';

interface ProfileModalProps {
  player: Player;
  rank: number;
  onClose: () => void;
}

export const ProfileModal: FC<ProfileModalProps> = ({ player, rank, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-neutral-charcoal/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="gradient-box p-8">
        {/* Header */}
        <div className="gradient-box p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-primary-pink/20">
              {player.profilePicture ? (
                <img
                  src={player.profilePicture}
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
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white truncate">
                {player.showWallet 
                  ? `${player.wallet.slice(0, 4)}...${player.wallet.slice(-4)}`
                  : player.username || player.handle || `${player.wallet.slice(0, 4)}...${player.wallet.slice(-4)}`}
              </h3>
              <p className="text-sm text-neutral-lightGray">
                Joined {new Date(player.dateJoined).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-primary-pink/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Rank */}
          <div className="gradient-box p-8">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary-pink flex-shrink-0" />
              <h4 className="text-white font-medium truncate">Global Rank</h4>
            </div>
            <p className="text-2xl font-bold text-primary-pink">#{rank}</p>
          </div>

          {/* Experience */}
          <div className="gradient-box p-8">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-primary-pink flex-shrink-0" />
              <h4 className="text-white font-medium truncate">Experience</h4>
            </div>
            <p className="text-2xl font-bold text-primary-pink">
              {player.experience.toLocaleString()}
            </p>
          </div>

          {/* Quests Completed */}
          <div className="gradient-box p-8">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-primary-pink flex-shrink-0" />
              <h4 className="text-white font-medium truncate">Quests</h4>
            </div>
            <p className="text-2xl font-bold text-primary-pink">
              {player.questsCompleted}
            </p>
          </div>

          {/* Raid Bosses */}
          <div className="gradient-box p-8">
            <div className="flex items-center gap-2 mb-2">
              <Sword className="w-4 h-4 text-primary-pink flex-shrink-0" />
              <h4 className="text-white font-medium truncate">Raid Bosses</h4>
            </div>
            <p className="text-2xl font-bold text-primary-pink">
              {player.raidBossesDefeated}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};