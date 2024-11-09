import { FC, useState, useEffect } from 'react';
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Quest } from '../../types/quest';
import { QuestForm } from './QuestForm';
import { questService } from '../../services/questService';

export const QuestList: FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  useEffect(() => {
    // Load all quests when component mounts
    setQuests(questService.getQuests());
  }, []);

  const handleDelete = (questId: string) => {
    if (questService.deleteQuest(questId)) {
      setQuests(questService.getQuests());
    }
  };

  const handleUpdateQuest = (quest: Quest) => {
    if (questService.updateQuest(quest.id, quest)) {
      setQuests(questService.getQuests());
      setEditingQuest(null);
    }
  };

  if (editingQuest) {
    return (
      <div>
        <button
          onClick={() => setEditingQuest(null)}
          className="text-neutral-lightGray hover:text-white mb-4 flex items-center gap-2"
        >
          ← Back to Quest List
        </button>
        <QuestForm 
          quest={editingQuest} 
          onSubmit={handleUpdateQuest}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quests.map(quest => (
        <div
          key={quest.id}
          className="bg-black/40 rounded-lg overflow-hidden border border-primary-pink/20"
        >
          <div className="flex">
            {/* Quest Image */}
            <div className="w-48 h-32 bg-neutral-charcoal/40 flex-shrink-0">
              {quest.imageUrl ? (
                <img
                  src={quest.imageUrl}
                  alt={quest.description}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-lightGray">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Quest Details */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-white font-medium line-clamp-2">{quest.description}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-2 py-1 bg-primary-pink/10 text-primary-pink rounded-md capitalize">
                      {quest.type}
                    </span>
                    <span className="text-primary-pink">
                      {quest.xpReward} XP
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingQuest(quest)}
                    className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    title="Edit quest"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(quest.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-400/5"
                    title="Delete quest"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quest Status */}
              <div className="mt-4 flex items-center gap-2 text-sm text-neutral-lightGray">
                <span>
                  Completed by: {quest.completedBy?.length || 0} players
                </span>
                <span>•</span>
                <span>
                  Expires: {new Date(quest.dateExpires).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {quests.length === 0 && (
        <div className="text-center py-8 text-neutral-lightGray">
          No quests found
        </div>
      )}
    </div>
  );
};