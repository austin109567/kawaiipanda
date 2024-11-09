import { FC, useState, useEffect } from 'react';
import { Trophy, Star, ChevronDown } from 'lucide-react';
import { playerService } from '../../services/playerService';
import { LeaderboardEntry } from '../../types/player';
import { ProfileModal } from './ProfileModal';
import { LevelDisplay } from '../LevelDisplay';

export const PlayerLeaderboards: FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = () => {
      try {
        const entries = playerService.getLeaderboard();
        setLeaderboard(entries);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + 10, 100)); // Increment by 10 up to max 100
  };

  const displayedPlayers = leaderboard.slice(0, displayCount);

  const getRankDisplay = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
          rank === 2 ? 'bg-gray-300/20 text-gray-300' :
          'bg-amber-700/20 text-amber-700'
        }`}>
          <Trophy className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-primary-main/10 flex items-center justify-center">
        <span className="text-primary-main font-mono">{rank}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayedPlayers.length > 0 ? (
        <>
          <div className="space-y-4">
            {displayedPlayers.map((entry) => (
              <button
                key={entry.wallet}
                onClick={() => setSelectedPlayer(entry)}
                className="w-full bg-gradient-radial from-primary-main/5 via-primary-main/10 to-transparent backdrop-blur-sm rounded-xl p-6 border border-primary-main/20 hover:border-primary-main/40 transition-all transform hover:scale-[1.02]"
              >
                <div className="flex items-center gap-6">
                  {getRankDisplay(entry.rank)}

                  <div className="w-12 h-12 rounded-full overflow-hidden border border-primary-main/20">
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

                  <div className="flex-grow min-w-0">
                    <h3 className="text-xl font-bold text-white truncate">
                      {entry.showWallet 
                        ? `${entry.wallet.slice(0, 4)}...${entry.wallet.slice(-4)}`
                        : entry.username || `${entry.wallet.slice(0, 4)}...${entry.wallet.slice(-4)}`}
                    </h3>
                  </div>

                  <div className="flex items-center gap-6">
                    <LevelDisplay xp={entry.experience} size="sm" />
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary-main" />
                      <span className="text-white font-medium">
                        {entry.experience.toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {displayCount < leaderboard.length && displayCount < 100 && (
            <button
              onClick={handleShowMore}
              className="flex items-center gap-2 px-6 py-3 bg-primary-main/20 text-primary-main rounded-lg hover:bg-primary-main/30 transition-colors mx-auto"
            >
              Show More
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-text-light-secondary dark:text-text-dark-secondary">
          No players found
        </div>
      )}

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