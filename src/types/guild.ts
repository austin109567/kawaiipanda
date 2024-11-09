export type GuildArchetype = 'Finance' | 'Adventurer' | 'Philanthropist' | 'PartyAnimal';

export interface Guild {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  members: string[]; // wallet addresses
  totalXp: number;
  dateCreated: number;
  archetype: GuildArchetype;
}

export interface GuildStats {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  memberCount: number;
  totalXp: number;
  dailyXp: number;
  weeklyXp: number;
  monthlyXp: number;
}

export interface GuildMember {
  wallet: string;
  username: string | null;
  profilePicture: string | null;
  experience: number;
  joinDate: number;
}