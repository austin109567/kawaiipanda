export interface QuestSubmissionRecord {
  id: string;
  questId: string;
  questType: 'quest' | 'raid';
  raidId?: string;
  wallet: string;
  url: string;
  screenshot?: string;
  dateSubmitted: number;
}

export interface SubmissionPage {
  submissions: QuestSubmissionRecord[];
  currentPage: number;
  totalPages: number;
  totalSubmissions: number;
}