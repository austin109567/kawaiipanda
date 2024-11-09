import { FC } from 'react';
import { Shield, Star } from 'lucide-react';
import { RaidState } from '../../types/raid';

interface RaidBossCardProps {
  raid: RaidState;
  onJoin: () => void;
  onViewQuests: () => void;
  onShowDetails: () => void;
  isParticipating: boolean;
  hasCompletedAllQuests: boolean;
}

export const RaidBossCard: FC<RaidBossCardProps> = ({
  raid,
  onJoin,
  onViewQuests,
  onShowDetails,
  isParticipating,
  hasCompletedAllQuests
}) => {
  const healthPercentage = (raid.boss.health / raid.boss.maxHealth) * 100;

  return (
    <div className="group bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-primary-pink/20 hover:border-primary-pink/40 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,158,205,0.2)]">
      {/* Raid Boss Image */}
      <button
        onClick={onShowDetails}
        className="w-full aspect-video relative overflow-hidden"
      >
        <img
          src={raid.boss.imageUrl}
          alt={raid.boss.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-pink transition-colors">
            {raid.boss.name}
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-primary-pink" />
              <span className="text-white">{raid.boss.defense}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary-pink" />
              <span className="text-white">
                {raid.boss.rewards.xp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Health Bar */}
      <div className="px-4 py-3 bg-black/60">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-white font-medium">Boss HP</span>
          <span className="text-white font-medium">
            {Math.ceil(raid.boss.health).toLocaleString()} / {raid.boss.maxHealth.toLocaleString()}
          </span>
        </div>
        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-pink to-primary-coral transition-all duration-300"
            style={{ width: `${healthPercentage}%` }}
          >
            <div className="w-full h-full animate-pulse-soft opacity-50 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        {isParticipating ? (
          <button
            onClick={onViewQuests}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              hasCompletedAllQuests
                ? 'inline-flex items-center gap-2 px-8 py-4 bg-primary-main text-white rounded-xl text-lg font-semibold transition-all transform hover:scale-105 hover:bg-primary-main/90 shadow-glow'
                : 'inline-flex items-center gap-2 px-8 py-4 bg-primary-main text-white rounded-xl text-lg font-semibold transition-all transform hover:scale-105 hover:bg-primary-main/90 shadow-glow'
            }`}
          >
            {hasCompletedAllQuests ? 'Completed' : 'View Quests'}
          </button>
        ) : (
          <button
            onClick={onJoin}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-main text-white rounded-xl text-lg font-semibold transition-all transform hover:scale-105 hover:bg-primary-main/90 shadow-glow"
          >
            Join Raid
          </button>
        )}
      </div>
    </div>
  );
};