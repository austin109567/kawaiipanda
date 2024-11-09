import { FC, useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { QuestSubmissionModal } from './QuestSubmissionModal';
import { raidService } from '../../services/raidService';
import { useWallet } from '@solana/wallet-adapter-react';
import { QuestSubmission } from '../../types/raid';

interface RaidQuestListProps {
  raidId: string;
  onClose: () => void;
}

export const RaidQuestList: FC<RaidQuestListProps> = ({ raidId, onClose }) => {
  const { publicKey } = useWallet();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const raids = raidService.getActiveRaids();
  const raid = raids.find(r => r.id === raidId);
  const quests = raid?.boss.quests || [];

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleQuestComplete = (questId: string) => {
    setSelectedQuestId(questId);
    setShowSubmitModal(true);
  };

  const handleSubmitProof = async (submission: QuestSubmission) => {
    if (!publicKey || !selectedQuestId) return;
    
    const success = await raidService.completeQuest(raidId, selectedQuestId, publicKey.toString(), submission);
    if (success) {
      setShowSubmitModal(false);
      setSelectedQuestId(null);
      setRefreshKey(prev => prev + 1);
    }
  };

  if (!raid) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-neutral-charcoal/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col bg-[#1A1B23] rounded-xl border border-primary-pink/20 shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-pink/20">
          <h3 className="text-xl font-bold text-white">
            {raid.boss.name} - Quests
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quest List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {quests.map((quest) => {
            const isCompleted = quest.completedBy?.includes(publicKey?.toString() || '');

            return (
              <div
                key={`${quest.id}-${refreshKey}`}
                className="bg-black/40 rounded-lg p-4 border border-primary-pink/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white mb-2">{quest.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-primary-pink" />
                      <span className="text-primary-pink">+{quest.xpReward} XP</span>
                    </div>
                  </div>
                  {isCompleted ? (
                    <div className="px-4 py-2 bg-green-900/20 text-green-400 rounded-lg">
                      Completed
                    </div>
                  ) : (
                    <button
                      onClick={() => handleQuestComplete(quest.id)}
                      className="px-4 py-2 bg-primary-pink/20 text-primary-pink hover:bg-primary-pink/30 rounded-lg transition-colors"
                    >
                      Complete Quest
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {quests.length === 0 && (
            <div className="text-center py-8 text-neutral-lightGray">
              No quests available for this raid boss
            </div>
          )}
        </div>
      </div>

      {showSubmitModal && (
        <QuestSubmissionModal
          onClose={() => {
            setShowSubmitModal(false);
            setSelectedQuestId(null);
          }}
          onSubmit={handleSubmitProof}
        />
      )}
    </div>
  );
};