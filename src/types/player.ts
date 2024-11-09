export interface Player {
  wallet: string;
  username: string | null;
  handle: string | null;
  profilePicture: string | null;
  experience: number;
  dateJoined: number;
  questsCompleted: number;
  raidBossesDefeated: number;
  lastQuestCompletionTime: number;
  showWallet: boolean;
  guild: string | null;
}

export interface LeaderboardEntry {
  wallet: string;
  username: string | null;
  handle: string | null;
  profilePicture: string | null;
  experience: number;
  questsCompleted: number;
  raidBossesDefeated: number;
  rank: number;
  showWallet: boolean;
}

export interface TimeRangeStats {
  topRaider: Player | null;
  totalXP: number;
  activeRaiders: number;
}