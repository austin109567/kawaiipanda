import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { QuestList } from './QuestList';
import { Leaderboard } from './Leaderboard';
import { UserProfile } from './UserProfile';
import { RaidBoss } from './RaidBoss';
import { CompletedRaids } from './CompletedRaids';
import { ConnectPrompt } from '../ConnectPrompt';
import { raidService } from '../../services/raidService';
import { Sword } from 'lucide-react';

export const Raid: FC = () => {
  const { connected } = useWallet();
  const completedRaids = raidService.getCompletedRaids();

  if (!connected) {
    return <ConnectPrompt />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-title text-text-light-primary dark:text-white mb-2 flex items-center justify-center gap-3">
        <img 
            src="/assets/pandas/raidpanda.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
          Raid Arena
          <img 
            src="/assets/pandas/raidpanda.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
        </h1>
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Join epic raid battles and earn rewards
        </p>
      </div>

      {/* User Profile */}

        <UserProfile />


      {/* Active Raid Bosses */}

        <RaidBoss />


      {/* Three Column Layout */}

        {/* Available Quests */}
        <div className="lg:col-span-2">
          <QuestList />
        </div>
        {/* Leaderboard & Completed Raids */}
        <div className="space-y-8">
          <Leaderboard />
          <CompletedRaids raids={completedRaids} />
        </div>

    </div>
  );
};

export { RaidBossDetails } from './RaidBossDetails';