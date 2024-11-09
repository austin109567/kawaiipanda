import { Guild, GuildStats, GuildMember, GuildArchetype } from '../types/guild';
import { playerService } from './playerService';

class GuildService {
  private static instance: GuildService;
  private guilds: Map<string, Guild>;
  private memberGuilds: Map<string, string>; // wallet -> guildId

  private constructor() {
    this.guilds = new Map();
    this.memberGuilds = new Map();
    this.initializeGuilds();
    this.loadGuilds();
  }

  private initializeGuilds() {
    const defaultGuilds: Guild[] = [
      {
        id: 'aureus-coven',
        name: 'The Aureus Coven',
        description: 'For the Finance archetype, representing a mystical society with the golden wisdom and foresight to generate fortune.',
        imageUrl: '/assets/guilds/aureus-coven.jpg',
        members: [],
        totalXp: 0,
        dateCreated: Date.now(),
        archetype: 'Finance'
      },
      {
        id: 'emberseekers',
        name: 'The Emberseekers',
        description: 'Representing the Adventurer archetype, a pack of daring explorers guided by ancient flames and destined to uncover hidden realms.',
        imageUrl: '/assets/guilds/emberseekers.jpg',
        members: [],
        totalXp: 0,
        dateCreated: Date.now(),
        archetype: 'Adventurer'
      },
      {
        id: 'solacebound',
        name: 'The Solacebound',
        description: 'Embodying the Philanthropist archetype, these pandas are bound by a vow of kindness, bringing peace and aid wherever they go.',
        imageUrl: '/assets/guilds/solacebound.jpg',
        members: [],
        totalXp: 0,
        dateCreated: Date.now(),
        archetype: 'Philanthropist'
      },
      {
        id: 'revelkin',
        name: 'The Revelkin',
        description: 'For the Party Animal archetype, an enchanted circle of merry pandas known for their boundless joy and festive spirit.',
        imageUrl: '/assets/guilds/revelkin.jpg',
        members: [],
        totalXp: 0,
        dateCreated: Date.now(),
        archetype: 'PartyAnimal'
      }
    ];

    defaultGuilds.forEach(guild => {
      this.guilds.set(guild.id, guild);
    });
  }

  private loadGuilds(): void {
    const savedData = localStorage.getItem('guilds');
    const savedMemberData = localStorage.getItem('memberGuilds');

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.entries(parsed).forEach(([key, value]) => {
          this.guilds.set(key, value as Guild);
        });
      } catch (error) {
        console.error('Failed to parse saved guilds:', error);
      }
    }

    if (savedMemberData) {
      try {
        const parsed = JSON.parse(savedMemberData);
        Object.entries(parsed).forEach(([key, value]) => {
          this.memberGuilds.set(key, value as string);
        });
      } catch (error) {
        console.error('Failed to parse saved member guilds:', error);
      }
    }
  }

  private save(): void {
    try {
      const guildsData = Object.fromEntries(this.guilds);
      const memberData = Object.fromEntries(this.memberGuilds);
      localStorage.setItem('guilds', JSON.stringify(guildsData));
      localStorage.setItem('memberGuilds', JSON.stringify(memberData));
    } catch (error) {
      console.error('Failed to save guild data:', error);
    }
  }

  static getInstance(): GuildService {
    if (!GuildService.instance) {
      GuildService.instance = new GuildService();
    }
    return GuildService.instance;
  }

  getGuilds(): Guild[] {
    return Array.from(this.guilds.values());
  }

  getGuildById(id: string): Guild | null {
    return this.guilds.get(id) || null;
  }

  getPlayerGuild(wallet: string): Guild | null {
    const guildId = this.memberGuilds.get(wallet);
    return guildId ? this.guilds.get(guildId) || null : null;
  }

  updateGuild(guildId: string, updates: Partial<Guild>): boolean {
    const guild = this.guilds.get(guildId);
    if (!guild) return false;

    this.guilds.set(guildId, { ...guild, ...updates });
    this.save();
    return true;
  }

  assignGuild(wallet: string, answers: { questionId: string; archetype: GuildArchetype }[]): Guild {
    // Count archetype votes
    const votes: Record<GuildArchetype, number> = {
      Finance: 0,
      Adventurer: 0,
      Philanthropist: 0,
      PartyAnimal: 0
    };

    answers.forEach(answer => {
      votes[answer.archetype] = (votes[answer.archetype] || 0) + 1;
    });

    // Find winning archetype
    let maxVotes = 0;
    let winningArchetype: GuildArchetype = 'Adventurer'; // Default
    Object.entries(votes).forEach(([archetype, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        winningArchetype = archetype as GuildArchetype;
      }
    });

    // Find matching guild
    const guild = Array.from(this.guilds.values()).find(g => g.archetype === winningArchetype);
    if (!guild) {
      throw new Error('No matching guild found');
    }

    // Add member to guild if not already a member
    if (!guild.members) {
      guild.members = [];
    }
    
    if (!guild.members.includes(wallet)) {
      guild.members.push(wallet);
      this.guilds.set(guild.id, guild);
      this.memberGuilds.set(wallet, guild.id);
      this.save();
    }

    return guild;
  }

  getGuildStats(timeRange: 'daily' | 'weekly' | 'monthly' | 'allTime'): GuildStats[] {
    const guilds = Array.from(this.guilds.values());
    if (!guilds || guilds.length === 0) return [];

    return guilds.map(guild => {
      const memberStats = (guild.members || []).map(wallet => {
        const player = playerService.getPlayer(wallet);
        return player ? player.experience : 0;
      });

      const totalXp = memberStats.reduce((sum, xp) => sum + xp, 0);

      return {
        id: guild.id,
        name: guild.name,
        description: guild.description,
        imageUrl: guild.imageUrl,
        memberCount: guild.members?.length || 0,
        totalXp,
        dailyXp: 0, // TODO: Implement time-based XP tracking
        weeklyXp: 0,
        monthlyXp: 0
      };
    }).sort((a, b) => b.totalXp - a.totalXp);
  }

  getGuildMembers(guildId: string): GuildMember[] {
    const guild = this.guilds.get(guildId);
    if (!guild || !guild.members) return [];

    return guild.members.map(wallet => {
      const player = playerService.getPlayer(wallet);
      return {
        wallet,
        username: player?.username || null,
        profilePicture: player?.profilePicture || null,
        experience: player?.experience || 0,
        joinDate: player?.dateJoined || 0
      };
    }).sort((a, b) => b.experience - a.experience);
  }
}

export const guildService = GuildService.getInstance();