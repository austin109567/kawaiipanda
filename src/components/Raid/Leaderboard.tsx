import { FC, useEffect, useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { LeaderboardEntry } from '../../types/player';
import { playerService } from '../../services/playerService';
import { ProfileModal } from '../RaidLeaderboards/ProfileModal';

export const Leaderboard: FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    // Update leaderboard initially
    const updateLeaderboard = () => {
      setLeaderboard(playerService.getLeaderboard().slice(0, 5));
    };

    updateLeaderboard();

    // Add global listener for any player updates
    playerService.addGlobalListener(updateLeaderboard);

    return () => {
      playerService.removeGlobalListener(updateLeaderboard);
    };
  }, []);

  const handleProfileClick = (entry: LeaderboardEntry) => {
    const player = playerService.getPlayer(entry.wallet);
    if (player) {
      setSelectedPlayer(entry);
    }
  };

  const getRankDisplay = (rank: number) => {
    if (rank <= 3) {
      return (
        <Medal className={`w-5 h-5 ${
          rank === 1 ? 'text-yellow-400' :
          rank === 2 ? 'text-gray-400' :
          'text-amber-700'
        }`} />
      );
    }
    return <span className="text-neutral-lightGray font-mono text-sm">#{rank}</span>;
  };

  return (
    <div className="gradient-box p-8">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2" />
        <h2 className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2">Top Raiders</h2>
      </div>

      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <button
            key={entry.wallet}
            onClick={() => handleProfileClick(entry)}
            className="w-full flex items-center gap-3 p-2 bg-black/40 rounded-lg border border-primary-pink/20 transition-colors hover:border-primary-pink/40 hover:bg-primary-pink/5"
          >
            <div className="w-8 flex items-center justify-center">
              {getRankDisplay(entry.rank)}
            </div>

            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-primary-pink/20">
              {entry.profilePicture ? (
                <img
                  src={entry.profilePicture}
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

            <div className="flex-grow min-w-0 text-left">
              <p className="text-sm text-white font-medium truncate">
                {entry.showWallet
                  ? `${entry.wallet.slice(0, 4)}...${entry.wallet.slice(-4)}`
                  : entry.username || `${entry.wallet.slice(0, 4)}...${entry.wallet.slice(-4)}`}
              </p>
              <p className="text-xs text-primary-pink">
                {entry.experience.toLocaleString()} XP
              </p>
            </div>
          </button>
        ))}

        {leaderboard.length === 0 && (
          <div className="text-center py-6 text-neutral-lightGray">
            No raiders yet
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedPlayer && (
        <ProfileModal
          player={playerService.getPlayer(selectedPlayer.wallet)!}
          rank={selectedPlayer.rank}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};