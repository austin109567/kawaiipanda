import { RaidState, RaidBoss, RaidParticipant, RaidReward, QuestSubmission } from '../types/raid';
import { playerService } from './playerService';
import { submissionService } from './submissionService';

class RaidService {
  private static instance: RaidService;
  private raids: Map<string, RaidState> = new Map();

  private constructor() {
    // Load from localStorage if available
    const savedData = localStorage.getItem('raids');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        this.raids = new Map(Object.entries(parsed));
      } catch (error) {
        console.error('Failed to parse saved raids:', error);
        this.raids = new Map();
      }
    }
  }

  static getInstance(): RaidService {
    if (!RaidService.instance) {
      RaidService.instance = new RaidService();
    }
    return RaidService.instance;
  }

  private save(): void {
    try {
      const data = Object.fromEntries(this.raids);
      localStorage.setItem('raids', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save raids:', error);
    }
  }

  private calculateHealth(defense: number): number {
    // Base health + additional HP from defense
    return 1000 + (defense * 10);
  }

  private updateRaidHealth(raid: RaidState): void {
    const totalQuestsRequired = raid.boss.quests.length * 10; // Each quest needs 10 completions
    const totalCompletions = raid.boss.quests.reduce((sum, quest) => sum + quest.completedBy.length, 0);
    const completionPercentage = totalCompletions / totalQuestsRequired;
    
    // Update health based on completion percentage
    raid.boss.health = raid.boss.maxHealth * (1 - completionPercentage);
    
    // Check if raid is completed
    if (raid.boss.health <= 0) {
      this.handleRaidCompletion(raid);
    }
    
    this.save();
  }

  private handleRaidCompletion(raid: RaidState): void {
    raid.status = 'completed';
    raid.endTime = Date.now();

    // Award bonus XP and increment raid boss defeats for all participants
    raid.participants.forEach(p => {
      playerService.addExperience(p.wallet, raid.boss.rewards.bonusXp);
      playerService.incrementRaidBossesDefeated(p.wallet);
    });

    this.save();
  }

  getAllRaids(): RaidState[] {
    return Array.from(this.raids.values())
      .filter(raid => raid !== null)
      .sort((a, b) => b.startTime - a.startTime);
  }

  getActiveRaids(): RaidState[] {
    return Array.from(this.raids.values())
      .filter(raid => raid?.status === 'active')
      .sort((a, b) => b.startTime - a.startTime);
  }

  createRaidBoss(boss: Omit<RaidBoss, 'id' | 'maxHealth' | 'health'>): RaidState {
    const maxHealth = this.calculateHealth(boss.defense);
    const newBoss: RaidBoss = {
      ...boss,
      id: `raid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      maxHealth,
      health: maxHealth,
      quests: boss.quests.map(quest => ({
        ...quest,
        completedBy: []
      }))
    };

    const raid: RaidState = {
      id: `raid-${Date.now()}`,
      boss: newBoss,
      participants: [],
      startTime: Date.now(),
      endTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      status: 'active',
      questCompletions: 0
    };

    this.raids.set(raid.id, raid);
    this.save();
    return raid;
  }

  updateRaidBoss(raidId: string, updates: Partial<RaidBoss>): boolean {
    const raid = this.raids.get(raidId);
    if (!raid || raid.status === 'completed') return false;

    const maxHealth = this.calculateHealth(updates.defense || raid.boss.defense);
    raid.boss = {
      ...raid.boss,
      ...updates,
      maxHealth,
      health: maxHealth
    };

    this.raids.set(raidId, raid);
    this.save();
    return true;
  }

  deleteRaid(raidId: string): boolean {
    const deleted = this.raids.delete(raidId);
    if (deleted) {
      this.save();
    }
    return deleted;
  }

  joinRaid(raidId: string, wallet: string, nftId: string): boolean {
    const raid = this.raids.get(raidId);
    if (!raid || raid.status !== 'active') return false;

    if (raid.participants.some(p => p.wallet === wallet)) {
      return false;
    }

    raid.participants.push({
      wallet,
      nftId,
      questsCompleted: 0,
      lastQuestCompletionTime: 0
    });

    this.raids.set(raidId, raid);
    this.save();
    return true;
  }

  async completeQuest(raidId: string, questId: string, wallet: string, submission: QuestSubmission): Promise<boolean> {
    const raid = this.raids.get(raidId);
    if (!raid || raid.status !== 'active') return false;

    const quest = raid.boss.quests.find(q => q.id === questId);
    if (!quest || quest.completedBy.includes(wallet)) return false;

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
        questType: 'raid',
        raidId,
        wallet,
        url: submission.url,
        screenshot: screenshotData
      });

      // Update quest completion
      quest.completedBy.push(wallet);
      raid.questCompletions += 1;

      // Update participant stats
      const participant = raid.participants.find(p => p.wallet === wallet);
      if (participant) {
        participant.questsCompleted += 1;
        participant.lastQuestCompletionTime = Date.now();
        playerService.addExperience(wallet, quest.xpReward);
      }

      // Update raid health
      this.updateRaidHealth(raid);

      this.save();
      return true;
    } catch (error) {
      console.error('Failed to complete quest:', error);
      return false;
    }
  }

  getCompletedRaids(): RaidState[] {
    return Array.from(this.raids.values())
      .filter(raid => raid?.status === 'completed')
      .sort((a, b) => b.endTime - a.endTime)
      .slice(0, 10); // Return last 10 completed raids
  }

  getRaidProgress(raidId: string): number {
    const raid = this.raids.get(raidId);
    if (!raid) return 0;

    const totalQuestCompletions = raid.boss.quests.reduce((total, q) => total + q.completedBy.length, 0);
    const requiredCompletions = raid.boss.quests.length * 10;
    return (totalQuestCompletions / requiredCompletions) * 100;
  }
}

export const raidService = RaidService.getInstance();