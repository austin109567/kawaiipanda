import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { RaidState, QuestSubmission } from '../types/raid';
import { raidService } from '../services/raidService';

export function useRaid() {
  const { publicKey } = useWallet();
  const [currentRaids, setCurrentRaids] = useState<RaidState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRaids = () => {
      const raids = raidService.getAllRaids().filter(raid => raid.status === 'active');
      setCurrentRaids(raids);
      setLoading(false);
    };

    loadRaids();
    const interval = setInterval(loadRaids, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const joinRaid = (raidId: string, nftId: string) => {
    if (!publicKey) return false;
    return raidService.joinRaid(raidId, publicKey.toString(), nftId);
  };

  const completeQuest = (raidId: string, questId: string, submission: QuestSubmission) => {
    if (!publicKey) return false;
    return raidService.completeQuest(raidId, questId, publicKey.toString(), submission);
  };

  return {
    currentRaids,
    loading,
    joinRaid,
    completeQuest
  };
}