import { FC } from 'react';
import { Trophy, Star, Users } from 'lucide-react';
import { playerService } from '../../services/playerService';

interface TimeRangeStatsProps {
  timeRange: 'daily' | 'weekly' | 'monthly' | 'allTime';
}

export const TimeRangeStats: FC<TimeRangeStatsProps> = ({ timeRange }) => {
  const stats = playerService.getTimeRangeStats(timeRange);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="gradient-box p-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary-main" />
          <div>
            <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">Top Raider</p>
            <p className="text-lg font-bold text-text-light-primary dark:text-white">
              {stats.topRaider?.username || 
                `${stats.topRaider?.wallet.slice(0, 4)}...${stats.topRaider?.wallet.slice(-4)}`}
            </p>
          </div>
        </div>
      </div>

      <div className="gradient-box p-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary-main" />
          <div>
            <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">Total XP</p>
            <p className="text-lg font-bold text-text-light-primary dark:text-white">
              {stats.totalXP.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="gradient-box p-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-main" />
          <div>
            <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">Active Raiders</p>
            <p className="text-lg font-bold text-text-light-primary dark:text-white">
              {stats.activeRaiders}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};