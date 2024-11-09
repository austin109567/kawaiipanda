import { FC, useState, useEffect } from 'react';
import { Star, ScrollText, ChevronDown, Clock, Calendar, Trophy } from 'lucide-react';
import { Quest } from '../../types/quest';
import { QuestSubmissionModal } from './QuestSubmissionModal';
import { questService } from '../../services/questService';
import { useWallet } from '@solana/wallet-adapter-react';

interface QuestListProps {}

export const QuestList: FC<QuestListProps> = () => {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [submittingQuest, setSubmittingQuest] = useState<Quest | null>(null);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const allQuests = questService.getQuests();
    
    // Filter active quests by type
    setQuests(allQuests.filter(quest => 
      quest.type === activeTab && 
      !quest.completedBy?.includes(publicKey?.toString() || '')
    ));

    // Get completed quests
    setCompletedQuests(allQuests.filter(quest => 
      quest.completedBy?.includes(publicKey?.toString() || '')
    ).sort((a, b) => b.dateCreated - a.dateCreated));
  }, [activeTab, publicKey, refreshKey]);

  const handleSubmitProof = async (submission: { url: string; screenshot?: File }) => {
    if (!submittingQuest || !publicKey) return;

    const success = await questService.submitQuestProof(
      submittingQuest.id,
      publicKey.toString(),
      submission
    );

    if (success) {
      setSubmittingQuest(null);
      setRefreshKey(prev => prev + 1);
    }
  };

  const TabButton: FC<{
    type: 'daily' | 'weekly' | 'monthly';
    icon: any;
    label: string;
  }> = ({ type, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        activeTab === type
          ? 'bg-primary-main text-white shadow-lg shadow-primary-main/20'
          : 'text-text-light-secondary dark:text-neutral-lightGray hover:bg-primary-main/10 hover:text-primary-main'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );

  const displayedCompletedQuests = showAllCompleted 
    ? completedQuests 
    : completedQuests.slice(0, 3);

  return (
    <div className="gradient-box p-4 sm:p-8">
      <h3 className="text-xl font-bold text-text-light-primary dark:text-white mb-6 flex items-center gap-2">
        <ScrollText className="w-5 h-5 text-primary-main" />
        Available Quests
      </h3>

      {/* Quest Type Tabs - Scrollable on mobile */}
      <div className="overflow-x-auto pb-2 mb-6 -mx-4 sm:mx-0">
        <div className="flex gap-2 px-4 sm:px-0 min-w-max sm:min-w-0">
          <TabButton type="daily" icon={Clock} label="Daily" />
          <TabButton type="weekly" icon={Calendar} label="Weekly" />
          <TabButton type="monthly" icon={Trophy} label="Monthly" />
        </div>
      </div>

      {/* Available Quests */}
      <div className="space-y-4 mb-8">
        {quests.map(quest => (
          <div
            key={quest.id}
            className="gradient-box p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                {quest.imageUrl && (
                  <img
                    src={quest.imageUrl}
                    alt={quest.description}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <p className="text-lg font-medium text-white mb-2">{quest.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-primary-main" />
                  <span className="text-primary-main">+{quest.xpReward} XP</span>
                </div>
              </div>
              <button
                onClick={() => setSubmittingQuest(quest)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-all transform hover:scale-105 shadow-glow"
              >
                Submit Proof
              </button>
            </div>
          </div>
        ))}

        {quests.length === 0 && (
          <div className="text-center py-8 text-text-light-secondary dark:text-neutral-lightGray">
            No {activeTab} quests available
          </div>
        )}
      </div>

      {/* Completed Quests Section */}
      {completedQuests.length > 0 && (
        <div className="border-t border-primary-main/20 pt-6">
          <h4 className="text-lg font-semibold text-white mb-4">Completed Quests</h4>
          <div className="space-y-4">
            <div className={`space-y-4 ${showAllCompleted ? 'max-h-96 overflow-y-auto custom-scrollbar pr-2' : ''}`}>
              {displayedCompletedQuests.map(quest => (
                <div
                  key={quest.id}
                  className="bg-primary-main/[0.12] dark:bg-black/40 rounded-lg p-4 border border-primary-main/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-white mb-2">{quest.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-primary-main">+{quest.xpReward} XP</span>
                        <span className="text-neutral-lightGray">
                          Completed {new Date(quest.dateCreated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-primary-main/20 text-primary-main rounded-lg">
                      Completed
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {completedQuests.length > 3 && (
              <button
                onClick={() => setShowAllCompleted(!showAllCompleted)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-main/20 text-primary-main rounded-lg hover:bg-primary-main/30 transition-all duration-300"
              >
                {showAllCompleted ? 'Show Less' : 'Show More'}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAllCompleted ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>
      )}

      {submittingQuest && (
        <QuestSubmissionModal
          onClose={() => setSubmittingQuest(null)}
          onSubmit={handleSubmitProof}
        />
      )}
    </div>
  );
};