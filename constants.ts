
import { AdData, PlayerRank } from './types';

export const BOARD_SIZE = 11;
export const TOTAL_SQUARES = 40;
export const SQUARE_SIZE = 2;
export const CORNER_SIZE = 2.5;

export const POINTS_PER_AD = 100;
export const POINTS_PER_LAP = 1000;
export const TOKENS_PER_LAP = 50;
export const STREAK_BONUS_MULTIPLIER = 0.5;

export const THEME_COLORS = {
  primary: '#3b82f6',
  secondary: '#1e293b',
  accent: '#fbbf24',
  suit: '#e2e8f0',
  skin: '#fecaca',
  equipment: '#1e293b'
};

export const CATEGORY_COLORS: Record<string, string> = {
  'Tech': '#3b82f6',
  'Fashion': '#ec4899',
  'Food': '#f59e0b',
  'Travel': '#10b981',
  'Health': '#8b5cf6',
  'Finance': '#64748b',
  'Special': '#f8fafc'
};

export const INITIAL_LEADERBOARD: PlayerRank[] = [
  { name: "EcoExplorer_99", score: 28400, loops: 12, referrals: 4 },
  { name: "BrandMaster", score: 22200, loops: 9, referrals: 10 },
  { name: "AdVenturer", score: 18800, loops: 7, referrals: 2 },
  { name: "PixelTraveler", score: 12500, loops: 6, referrals: 5 },
  { name: "You", score: 0, loops: 0, referrals: 0, isPlayer: true }
];

const CATEGORIES = ['Tech', 'Fashion', 'Food', 'Travel', 'Health', 'Finance'];

export const MOCK_ADS: AdData[] = Array.from({ length: TOTAL_SQUARES }).map((_, i) => {
  const isCorner = i % 10 === 0;
  const isChallenge = !isCorner && (i % 7 === 0 || i % 13 === 0);
  const category = isCorner ? 'Special' : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  
  return {
    id: i,
    name: isCorner ? (i === 0 ? "GO START" : i === 10 ? "LOUNGE" : i === 20 ? "FREE PARKING" : "REVENUE") : `Brand ${i}`,
    category,
    description: `Engage with ${isCorner ? 'our platform' : 'this brand'} to earn rewards and discover exclusive deals.`,
    logo: `https://picsum.photos/seed/${i + 50}/200`,
    cta: isChallenge ? "Start Challenge" : "Learn More",
    link: "https://google.com",
    color: CATEGORY_COLORS[category],
    price: isCorner ? 0 : 100 + (i * 10),
    isChallenge,
    engagementScore: Math.floor(Math.random() * 500) + 100,
  };
});
