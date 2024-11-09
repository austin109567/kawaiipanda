import { FC, useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { QuestForm } from './QuestForm';
import { QuestList } from './QuestList';

export const QuestAdmin: FC = () => {
  const [activeView, setActiveView] = useState<'create' | 'edit'>('create');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Quest Administration</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveView('create')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === 'create'
                ? 'bg-primary-pink text-white'
                : 'text-neutral-lightGray hover:bg-primary-pink/10 hover:text-primary-pink'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add New Quest
          </button>
          <button
            onClick={() => setActiveView('edit')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === 'edit'
                ? 'bg-primary-pink text-white'
                : 'text-neutral-lightGray hover:bg-primary-pink/10 hover:text-primary-pink'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            Edit Quests
          </button>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-primary-pink/20">
        {activeView === 'create' ? (
          <QuestForm onSubmit={() => setActiveView('edit')} />
        ) : (
          <QuestList />
        )}
      </div>
    </div>
  );
};