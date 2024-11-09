import { FC, useState } from 'react';
import { RaidState } from '../../types/raid';
import { Trophy, Users, Star } from 'lucide-react';
import { RaidBossDetailsModal } from './RaidBossDetailsModal';
import { RaidBossShareModal } from './RaidBossShareModal';
import { useWallet } from '@solana/wallet-adapter-react';

interface CompletedRaidsProps {
  raids: RaidState[];
}

export const CompletedRaids: FC<CompletedRaidsProps> = ({ raids }) => {
  const { publicKey } = useWallet();
  const [selectedRaid, setSelectedRaid] = useState<RaidState | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = (raid: RaidState) => {
    setSelectedRaid(raid);
    setShowShareModal(true);
  };

  const didParticipate = (raid: RaidState) => {
    return raid.participants.some(p => p.wallet === publicKey?.toString());
  };

  return (
    <div className="gradient-box p-8">
      <h3 className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2">
        <Trophy className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2" />
        Completed Raids
      </h3>

      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {raids.map((raid) => (
          <div
            key={raid.id}
            className="bg-black/40 rounded-lg overflow-hidden border border-primary-pink/20 transition-all hover:border-primary-pink/40 hover:bg-primary-pink/5"
          >
            <div className="aspect-[3/2] relative">
              <img
                src={raid.boss.imageUrl}
                alt={raid.boss.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="text-base font-semibold text-white mb-1">{raid.boss.name}</h4>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-neutral-lightGray">
                    <Users className="w-3 h-3" />
                    {raid.participants.length}
                  </div>
                  <div className="flex items-center gap-1 text-primary-pink">
                    <Star className="w-3 h-3" />
                    {raid.boss.rewards.bonusXp.toLocaleString()} XP
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 flex justify-between items-center">
              <button
                onClick={() => setSelectedRaid(raid)}
                className="text-sm text-neutral-lightGray hover:text-white transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => handleShare(raid)}
                className="px-3 py-1 bg-primary-pink/20 text-primary-pink rounded-lg hover:bg-primary-pink/30 transition-colors text-sm"
              >
                Share Victory
              </button>
            </div>
          </div>
        ))}

        {raids.length === 0 && (
          <div className="text-center py-6 text-neutral-lightGray">
            No completed raids yet
          </div>
        )}
      </div>

      {selectedRaid && !showShareModal && (
        <RaidBossDetailsModal
          raid={selectedRaid}
          onClose={() => setSelectedRaid(null)}
        />
      )}

      {selectedRaid && showShareModal && (
        <RaidBossShareModal
          raid={selectedRaid}
          participated={didParticipate(selectedRaid)}
          onClose={() => {
            setSelectedRaid(null);
            setShowShareModal(false);
          }}
        />
      )}
    </div>
  );
};