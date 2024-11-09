import { FC, useState } from 'react';
import { Trophy, Users } from 'lucide-react';
import { TimeRangeStats } from './TimeRangeStats';
import { GuildLeaderboards } from './GuildLeaderboards';
import { PlayerLeaderboards } from './PlayerLeaderboards';

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'allTime';

export const RaidLeaderboards: FC = () => {
  const [activeTab, setActiveTab] = useState<'raiders' | 'guilds'>('raiders');
  const [timeRange, setTimeRange] = useState<TimeRange>('allTime');

  const TimeRangeButton: FC<{
    range: TimeRange;
    label: string;
  }> = ({ range, label }) => (
    <button
      onClick={() => setTimeRange(range)}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        timeRange === range
          ? 'bg-primary-main text-white shadow-glow'
          : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-primary-main/10 hover:text-primary-main'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-title text-text-light-primary dark:text-white mb-2 flex items-center justify-center gap-3">
        <img 
            src="/assets/pandas/tiltedpanda.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
          Leaderboards
          <img 
            src="/assets/pandas/tiltedpanda.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
        </h1>
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Find your place in the leaderboard
        </p>
      </div>

      {/* Tab Selection */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('raiders')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'raiders'
              ? 'bg-primary-main text-white shadow-glow'
              : 'bg-primary-main/20 text-text-light-primary dark:text-white hover:bg-primary-main/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Raid Leaderboards
          </div>
        </button>

        <button
          onClick={() => setActiveTab('guilds')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'guilds'
              ? 'bg-primary-main text-white shadow-glow'
              : 'bg-primary-main/20 text-text-light-primary dark:text-white hover:bg-primary-main/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Guild Leaderboards
          </div>
        </button>
      </div>

      {/* Time Range Selection */}
      <div className="flex justify-center gap-2 p-2 bg-primary-main/5 dark:bg-primary-main/10 backdrop-blur-xl rounded-xl border border-primary-main/20">
        <TimeRangeButton range="daily" label="Daily" />
        <TimeRangeButton range="weekly" label="Weekly" />
        <TimeRangeButton range="monthly" label="Monthly" />
        <TimeRangeButton range="allTime" label="All Time" />
      </div>

      {/* Time Range Stats */}
      <TimeRangeStats timeRange={timeRange} />

      {/* Content */}
      <div className="gradient-box p-6">
        {activeTab === 'raiders' ? (
          <PlayerLeaderboards timeRange={timeRange} />
        ) : (
          <GuildLeaderboards timeRange={timeRange} />
        )}
      </div>
    </div>
  );
};