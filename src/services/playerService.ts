import { Player, LeaderboardEntry, TimeRangeStats } from '../types/player';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

class PlayerService {
  private static instance: PlayerService;
  private players: Map<string, Player>;
  private listeners: Map<string, Set<() => void>>;
  private globalListeners: Set<() => void>;
  private readonly STORAGE_KEY = 'players_v1';
  private readonly PROFILE_PICS_KEY = 'player_profile_pics';

  private constructor() {
    this.players = new Map();
    this.listeners = new Map();
    this.globalListeners = new Set();
    this.loadPlayers();
  }

  static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  private loadPlayers(): void {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const decompressed = decompressFromUTF16(savedData);
        const parsed = JSON.parse(decompressed);
        this.players = new Map(Object.entries(parsed));
      }

      const savedProfilePics = localStorage.getItem(this.PROFILE_PICS_KEY);
      if (savedProfilePics) {
        const decompressed = decompressFromUTF16(savedProfilePics);
        const profilePics = JSON.parse(decompressed);
        
        for (const [wallet, pic] of Object.entries(profilePics)) {
          const player = this.players.get(wallet);
          if (player) {
            player.profilePicture = pic as string;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load players:', error);
      this.players = new Map();
    }
  }

  private save(): void {
    try {
      const profilePics: Record<string, string> = {};
      const playerData: Record<string, Omit<Player, 'profilePicture'>> = {};

      this.players.forEach((player, wallet) => {
        if (player.profilePicture) {
          profilePics[wallet] = player.profilePicture;
        }
        
        const { profilePicture, ...playerWithoutPic } = player;
        playerData[wallet] = playerWithoutPic;
      });

      const compressed = compressToUTF16(JSON.stringify(playerData));
      localStorage.setItem(this.STORAGE_KEY, compressed);

      try {
        const compressedPics = compressToUTF16(JSON.stringify(profilePics));
        localStorage.setItem(this.PROFILE_PICS_KEY, compressedPics);
      } catch (picError) {
        if (picError.name === 'QuotaExceededError') {
          console.warn('Profile pictures storage quota exceeded, saving without profile pictures');
        } else {
          throw picError;
        }
      }
    } catch (error) {
      console.error('Failed to save players:', error);
      
      if (error.name === 'QuotaExceededError') {
        try {
          localStorage.removeItem(this.PROFILE_PICS_KEY);
          const playerData: Record<string, Omit<Player, 'profilePicture'>> = {};
          this.players.forEach((player, wallet) => {
            const { profilePicture, ...playerWithoutPic } = player;
            playerData[wallet] = playerWithoutPic;
          });
          const compressed = compressToUTF16(JSON.stringify(playerData));
          localStorage.setItem(this.STORAGE_KEY, compressed);
        } catch (fallbackError) {
          console.error('Failed to save even without profile pictures:', fallbackError);
        }
      }
    }
  }

  private notifyListeners(wallet: string): void {
    this.listeners.get(wallet)?.forEach(callback => callback());
    this.globalListeners.forEach(callback => callback());
  }

  addListener(wallet: string, callback: () => void): void {
    if (!this.listeners.has(wallet)) {
      this.listeners.set(wallet, new Set());
    }
    this.listeners.get(wallet)?.add(callback);
  }

  removeListener(wallet: string, callback: () => void): void {
    this.listeners.get(wallet)?.delete(callback);
  }

  addGlobalListener(callback: () => void): void {
    this.globalListeners.add(callback);
  }

  removeGlobalListener(callback: () => void): void {
    this.globalListeners.delete(callback);
  }

  enrollPlayer(wallet: string): Player {
    if (!this.players.has(wallet)) {
      const newPlayer: Player = {
        wallet,
        username: null,
        handle: null,
        twitterHandle: null,
        discordHandle: null,
        profilePicture: null,
        experience: 0,
        dateJoined: Date.now(),
        questsCompleted: 0,
        raidBossesDefeated: 0,
        lastQuestCompletionTime: 0,
        showWallet: true,
        guild: null
      };
      this.players.set(wallet, newPlayer);
      this.save();
      this.notifyListeners(wallet);
      return newPlayer;
    }
    return this.players.get(wallet)!;
  }

  getPlayer(wallet: string): Player | null {
    return this.players.get(wallet) || null;
  }

  setUsername(wallet: string, username: string | null): boolean {
    const player = this.players.get(wallet);
    if (!player) return false;

    if (username) {
      for (const [playerWallet, p] of this.players.entries()) {
        if (playerWallet !== wallet && p.username === username) {
          return false;
        }
      }
    }

    player.username = username;
    this.players.set(wallet, player);
    this.save();
    this.notifyListeners(wallet);
    return true;
  }

  setTwitterHandle(wallet: string, handle: string | null): boolean {
    const player = this.players.get(wallet);
    if (!player) return false;

    player.twitterHandle = handle;
    this.players.set(wallet, player);
    this.save();
    this.notifyListeners(wallet);
    return true;
  }

  setDiscordHandle(wallet: string, handle: string | null): boolean {
    const player = this.players.get(wallet);
    if (!player) return false;

    player.discordHandle = handle;
    this.players.set(wallet, player);
    this.save();
    this.notifyListeners(wallet);
    return true;
  }

  setProfilePicture(wallet: string, imageData: string): boolean {
    const player = this.players.get(wallet);
    if (!player) return false;

    try {
      const compressed = compressToUTF16(imageData);
      player.profilePicture = compressed;
      this.players.set(wallet, player);
      this.save();
      this.notifyListeners(wallet);
      return true;
    } catch (error) {
      console.error('Failed to set profile picture:', error);
      return false;
    }
  }

  getProfilePicture(wallet: string): string | null {
    const player = this.players.get(wallet);
    if (!player?.profilePicture) return null;
    
    try {
      return decompressFromUTF16(player.profilePicture);
    } catch {
      return player.profilePicture;
    }
  }

  setGuild(wallet: string, guildId: string | null): boolean {
    const player = this.players.get(wallet);
    if (!player) return false;

    player.guild = guildId;
    this.players.set(wallet, player);
    this.save();
    this.notifyListeners(wallet);
    return true;
  }

  addExperience(wallet: string, amount: number): void {
    const player = this.players.get(wallet);
    if (player) {
      player.experience += amount;
      player.questsCompleted += 1;
      player.lastQuestCompletionTime = Date.now();
      this.players.set(wallet, player);
      this.save();
      this.notifyListeners(wallet);
    }
  }

  incrementRaidBossesDefeated(wallet: string): void {
    const player = this.players.get(wallet);
    if (player) {
      player.raidBossesDefeated = (player.raidBossesDefeated || 0) + 1;
      this.players.set(wallet, player);
      this.save();
      this.notifyListeners(wallet);
    }
  }

  getTimeRangeStats(timeRange: 'daily' | 'weekly' | 'monthly' | 'allTime'): TimeRangeStats {
    const now = Date.now();
    const getStartTime = () => {
      switch (timeRange) {
        case 'daily':
          return now - 24 * 60 * 60 * 1000;
        case 'weekly':
          return now - 7 * 24 * 60 * 60 * 1000;
        case 'monthly':
          return now - 30 * 24 * 60 * 60 * 1000;
        case 'allTime':
          return 0;
      }
    };

    const startTime = getStartTime();
    const activePlayers = Array.from(this.players.values()).filter(
      player => player.lastQuestCompletionTime > startTime
    );

    const totalXP = activePlayers.reduce((sum, player) => sum + player.experience, 0);
    const topRaider = activePlayers.length > 0 
      ? activePlayers.reduce((a, b) => a.experience > b.experience ? a : b)
      : null;

    return {
      topRaider,
      totalXP,
      activeRaiders: activePlayers.length
    };
  }

  getLeaderboard(): LeaderboardEntry[] {
    return Array.from(this.players.values())
      .sort((a, b) => b.experience - a.experience)
      .map((player, index) => ({
        wallet: player.wallet,
        username: player.username,
        handle: player.handle,
        profilePicture: player.profilePicture,
        experience: player.experience,
        questsCompleted: player.questsCompleted,
        raidBossesDefeated: player.raidBossesDefeated || 0,
        rank: index + 1,
        showWallet: player.showWallet
      }));
  }
}

export const playerService = PlayerService.getInstance();