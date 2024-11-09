import { Quest } from '../types/quest';
import { questPoolService } from './questPoolService';
import { playerService } from './playerService';
import { submissionService } from './submissionService';

class QuestService {
  private static instance: QuestService;
  private quests: Map<string, Quest> = new Map();
  private refreshInterval: NodeJS.Timer | null = null;

  private constructor() {
    const savedData = localStorage.getItem('quests');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        this.quests = new Map(Object.entries(parsed));
      } catch (error) {
        console.error('Failed to parse saved quests:', error);
      }
    }
    this.setupQuestRotation();
  }

  static getInstance(): QuestService {
    if (!QuestService.instance) {
      QuestService.instance = new QuestService();
    }
    return QuestService.instance;
  }

  private save(): void {
    const data = Object.fromEntries(this.quests);
    localStorage.setItem('quests', JSON.stringify(data));
  }

  private setupQuestRotation(): void {
    const checkAndRotate = () => {
      const now = new Date();
      const cst = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
      
      // Check if it's 6 AM CST
      if (cst.getHours() === 6 && cst.getMinutes() === 0) {
        // Daily rotation
        this.rotateQuests('daily');

        // Weekly rotation (on Sunday)
        if (cst.getDay() === 0) {
          this.rotateQuests('weekly');
        }

        // Monthly rotation (on the 1st)
        if (cst.getDate() === 1) {
          this.rotateQuests('monthly');
        }
      }
    };

    // Check every minute
    this.refreshInterval = setInterval(checkAndRotate, 60000);
    checkAndRotate(); // Initial check
  }

  private rotateQuests(type: 'daily' | 'weekly' | 'monthly'): void {
    const now = Date.now();
    
    // Remove expired automatic quests
    this.quests = new Map(
      Array.from(this.quests.entries())
        .filter(([_, quest]) => 
          !(quest.type === type && quest.isAutomatic && quest.dateExpires <= now)
        )
    );

    // Add new quests from the pool
    const pool = questPoolService.getActiveQuests(type);
    pool.forEach(quest => {
      const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.quests.set(id, {
        ...quest,
        id,
        dateCreated: now,
        status: 'available',
        completedBy: []
      });
    });

    this.save();
  }

  async submitQuestProof(
    questId: string,
    wallet: string,
    submission: { url: string; screenshot?: File }
  ): Promise<boolean> {
    const quest = this.quests.get(questId);
    if (!quest || quest.completedBy?.includes(wallet)) {
      return false;
    }

    try {
      // Convert screenshot to data URL if provided
      let screenshotData: string | undefined;
      if (submission.screenshot) {
        screenshotData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(submission.screenshot);
        });
      }

      // Add submission record
      submissionService.addSubmission({
        questId,
        questType: 'quest',
        wallet,
        url: submission.url,
        screenshot: screenshotData
      });

      // Update quest completion status
      quest.completedBy = [...(quest.completedBy || []), wallet];
      quest.proof = [
        ...(quest.proof || []),
        {
          wallet,
          url: submission.url,
          dateSubmitted: Date.now()
        }
      ];

      // Award XP to the player
      playerService.addExperience(wallet, quest.xpReward);

      this.quests.set(questId, quest);
      this.save();
      return true;
    } catch (error) {
      console.error('Failed to submit quest proof:', error);
      return false;
    }
  }

  getQuests(type?: 'daily' | 'weekly' | 'monthly'): Quest[] {
    const allQuests = Array.from(this.quests.values());
    return type ? allQuests.filter(q => q.type === type) : allQuests;
  }

  updateQuest(questId: string, updates: Partial<Quest>): boolean {
    const quest = this.quests.get(questId);
    if (!quest) return false;

    this.quests.set(questId, { ...quest, ...updates });
    this.save();
    return true;
  }

  deleteQuest(questId: string): boolean {
    const deleted = this.quests.delete(questId);
    if (deleted) {
      this.save();
    }
    return deleted;
  }

  isQuestCompleted(questId: string, wallet: string): boolean {
    const quest = this.quests.get(questId);
    return quest?.completedBy?.includes(wallet) || false;
  }
}

export const questService = QuestService.getInstance();