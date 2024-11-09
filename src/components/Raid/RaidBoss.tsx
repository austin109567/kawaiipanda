import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRaid } from '../../hooks/useRaid';
import { RaidQuestList } from './RaidQuestList';
import { RaidBossCard } from './RaidBossCard';
import { RaidBossDetails } from './RaidBossDetails';

export const RaidBoss: FC = () => {
  const { publicKey } = useWallet();
  const { currentRaids, joinRaid } = useRaid();
  const [showQuests, setShowQuests] = useState(false);
  const [selectedRaidId, setSelectedRaidId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Auto-refresh raid status
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update HP bars
      setSelectedRaidId(prev => prev);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleJoinRaid = (raidId: string) => {
    if (!publicKey) return;
    const success = joinRaid(raidId, 'default-nft-id');
    if (success) {
      setSelectedRaidId(raidId);
      setShowQuests(true);
    }
  };

  const handleShowQuests = (raidId: string) => {
    setSelectedRaidId(raidId);
    setShowQuests(true);
  };

  const handleShowDetails = (raidId: string) => {
    setSelectedRaidId(raidId);
    setShowDetails(true);
  };

  return (
    <div className="gradient-box p-8">
      <h2 className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2">Active Raid Bosses</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentRaids.map((raid) => {
          const isParticipating = raid.participants.some(
            p => p.wallet === publicKey?.toString()
          );
          const hasCompletedAllQuests = raid.boss.quests.every(
            quest => quest.completedBy.includes(publicKey?.toString() || '')
          );

          return (
            <RaidBossCard
              key={raid.id}
              raid={raid}
              onJoin={() => handleJoinRaid(raid.id)}
              onViewQuests={() => handleShowQuests(raid.id)}
              onShowDetails={() => handleShowDetails(raid.id)}
              isParticipating={isParticipating}
              hasCompletedAllQuests={hasCompletedAllQuests}
            />
          );
        })}

        {currentRaids.length === 0 && (
          <div className="col-span-full text-center py-8 text-neutral-lightGray">
            No active raid bosses
          </div>
        )}
      </div>

      {showQuests && selectedRaidId && (
        <RaidQuestList
          raidId={selectedRaidId}
          onClose={() => {
            setShowQuests(false);
            setSelectedRaidId(null);
          }}
        />
      )}

      {showDetails && selectedRaidId && (
        <RaidBossDetails
          raid={currentRaids.find(r => r.id === selectedRaidId)!}
          onClose={() => {
            setShowDetails(false);
            setSelectedRaidId(null);
          }}
          onJoin={() => handleJoinRaid(selectedRaidId)}
          onViewQuests={() => {
            setShowDetails(false);
            handleShowQuests(selectedRaidId);
          }}
          isParticipating={currentRaids.find(r => r.id === selectedRaidId)?.participants.some(
            p => p.wallet === publicKey?.toString()
          ) || false}
        />
      )}
    </div>
  );
};