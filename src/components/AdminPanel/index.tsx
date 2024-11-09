import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { QuestAdmin } from '../Admin/QuestAdmin';
import { RaidAdmin } from '../Admin/RaidAdmin';
import { Sword, ScrollText } from 'lucide-react';

const ADMIN_WALLET = "8jN1XtgiuWeyNjzysYVqGZ1mPAG37sjmuCTnENz66wrs";

export const AdminPanel: FC = () => {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<'quests' | 'raids'>('quests');
  
  if (!publicKey || publicKey.toString() !== ADMIN_WALLET) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-neutral-lightGray">
            You don't have permission to access this area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('quests')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'quests'
                ? 'bg-primary-pink text-white'
                : 'text-neutral-lightGray hover:bg-primary-pink/10 hover:text-primary-pink'
            }`}
          >
            <ScrollText className="w-5 h-5" />
            <span className="whitespace-nowrap">Quest Administration</span>
          </button>
          <button
            onClick={() => setActiveTab('raids')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'raids'
                ? 'bg-primary-pink text-white'
                : 'text-neutral-lightGray hover:bg-primary-pink/10 hover:text-primary-pink'
            }`}
          >
            <Sword className="w-5 h-5" />
            <span className="whitespace-nowrap">Raid Administration</span>
          </button>
        </div>
      </div>

      {activeTab === 'quests' ? <QuestAdmin /> : <RaidAdmin />}
    </div>
  );
};