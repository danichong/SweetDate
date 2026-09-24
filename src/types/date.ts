export type DateCategory =
  | 'comida'
  | 'viajes'
  | 'casa'
  | 'cultura'
  | 'aire_libre'
  | 'cine'
  | 'relax'
  | 'aventura';

export interface CategoryInfo {
  id: DateCategory;
  name: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export interface DateMemory {
  photoUrl?: string;
  photoUrls?: string[];
  note?: string;
  rating?: number; // 1 to 5
  completedAt?: string;
}

export interface DateWeather {
  temp: number;
  condition: string;
  icon: string;
  rainProbability?: number;
  advisory?: string;
}

export interface DateItem {
  id: string;
  title: string;
  category: DateCategory;
  dateTime: string; // ISO or YYYY-MM-DDTHH:mm
  budget: number;
  location?: string;
  dressCode?: string;
  externalLink?: string;
  notes?: string;
  status: 'pending' | 'completed';
  memory?: DateMemory;
  weather?: DateWeather;
  createdAt: string;
  updatedAt: string;
}

export interface TimeCapsule {
  id: string;
  title: string;
  message: string;
  unlockDate: string; // ISO date
  photoUrl?: string;
  author: string;
  createdAt: string;
}

export interface DateChallenge {
  id: string;
  number: number;
  title: string;
  description: string;
  category: DateCategory;
  budgetEstimated: number;
  hint: string;
  isRevealed: boolean;
  isAddedToDates: boolean;
}

export type StatusFilter = 'all' | 'pending' | 'completed';

export type SortOption =
  | 'date_asc'
  | 'date_desc'
  | 'budget_asc'
  | 'budget_desc'
  | 'created_desc';

export interface CoupleProfile {
  partner1: string;
  partner2: string;
  startDate?: string;
  currency: string;
  pairCode?: string;
  lastSyncedAt?: string;
}
