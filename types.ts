
export interface AdData {
  id: number;
  name: string;
  category: string;
  description: string;
  logo: string;
  cta: string;
  link: string;
  color: string;
  price?: number;
  isChallenge?: boolean;
  engagementScore?: number;
  socials?: {
    twitter?: string;
    instagram?: string;
  };
}

export interface AdCategory {
  name: string;
  color: string;
  isCustom?: boolean;
}

export interface Reward {
  type: 'CREDITS' | 'TOKEN' | 'BADGE' | 'MYSTERY';
  amount: number;
  label: string;
  bonus?: string;
}

export interface PlayerRank {
  name: string;
  score: number;
  loops: number;
  referrals: number;
  isPlayer?: boolean;
}

export type CharacterType = 'SKIER' | 'SNOWBOARDER' | 'EXPLORER';

export interface GameState {
  currentPosition: number;
  score: number;
  tokens: number;
  loopsCompleted: number;
  streak: number;
  visitedCount: number;
  selectedAd: AdData | null;
  pendingReward: Reward | null;
  activeChallenge: 'CLICKER' | 'REACTION' | null;
  isMoving: boolean;
  history: number[];
  leaderboard: PlayerRank[];
  referralCode: string;
  characterType: CharacterType;
}

export enum SquareType {
  PROPERTY = 'PROPERTY',
  CORNER = 'CORNER',
  SPECIAL = 'SPECIAL'
}
