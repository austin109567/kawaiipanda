import { FC, useState, useEffect } from 'react';
import { Trophy, Users, Star } from 'lucide-react';
import { guildService } from '../../services/guildService';
import { GuildStats } from '../../types/guild';
import { GuildMembersModal } from './GuildMembersModal';
import { calculateLevel } from '../../utils/levelCalculator';

interface GuildLeaderboardsProps {
  timeRange: 'daily' | 'weekly' | 'monthly' | 'allTime';
}

export const GuildLeaderboards: FC<GuildLeaderboardsProps> = ({ timeRange }) => {
  const [guildStats, setGuildStats] = useState<GuildStats[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      try {
        // Get guild stats and ensure uniqueness by guild ID
        const stats = guildService.getGuildStats(timeRange);
        const uniqueStats = stats.reduce((acc: GuildStats[], curr) => {
          if (!acc.find(g => g.id === curr.id)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        
        setGuildStats(uniqueStats || []);
      } catch (error) {
        console.error('Failed to load guild stats:', error);
        setGuildStats([]);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  const calculateGuildLevel = (guild: GuildStats) => {
    const members = guildService.getGuildMembers(guild.id);
    const totalLevel = members.reduce((sum, member) => {
      const { level } = calculateLevel(member.experience);
      return sum + level;
    }, 0);
    return totalLevel;
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main mx-auto"></div>
        </div>
      ) : guildStats.length > 0 ? (
        guildStats.map((guild, index) => {
          const guildLevel = calculateGuildLevel(guild);
          return (
            <button
              key={guild.id}
              onClick={() => setSelectedGuild(guild.id)}
              className="w-full gradient-box p-6 hover:border-primary-main/40 transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-6">
                {/* Rank */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-main/10 flex items-center justify-center">
                  <span className="text-primary-main font-bold">#{index + 1}</span>
                </div>

                {/* Guild Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-primary-main/20">
                  {guild.imageUrl ? (
                    <img
                      src={guild.imageUrl}
                      alt={guild.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-main/10 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-primary-main" />
                    </div>
                  )}
                </div>

                {/* Guild Info */}
                <div className="flex-grow min-w-0">
                  <h3 className="text-lg font-medium text-text-light-primary dark:text-white truncate mb-2">
                    {guild.name}
                  </h3>
                  <p className="text-base text-text-light-secondary dark:text-text-dark-secondary leading-relaxed line-clamp-2">
                    {guild.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-main" />
                    <span className="text-text-light-primary dark:text-white font-medium">
                      {guild.memberCount}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary-main" />
                      <span className="text-text-light-primary dark:text-white font-medium">
                        {guild.totalXp.toLocaleString()} XP
                      </span>
                    </div>
                    <div className="text-sm text-primary-main font-semibold">
                      Guild Level {guildLevel}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })
      ) : (
        <div className="text-center py-8 text-text-light-secondary dark:text-text-dark-secondary">
          No guild data available
        </div>
      )}

      {/* Guild Members Modal */}
      {selectedGuild && (
        <GuildMembersModal
          guildId={selectedGuild}
          onClose={() => setSelectedGuild(null)}
        />
      )}
    </div>
  );
};