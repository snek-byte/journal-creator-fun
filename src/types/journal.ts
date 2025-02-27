
export type Mood = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'excited' 
  | 'relaxed' 
  | 'anxious'
  | 'grateful'
  | 'confused';

export interface Sticker {
  id: string;
  url: string;
  position: {
    x: number;
    y: number;
  };
}

export interface JournalEntry {
  id: number;
  date: string;
  text: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  mood?: Mood;
  moodNote?: string;
  isPublic: boolean;
  challengeId?: string;
  textStyle?: string;
  stickers: Sticker[];
  textPosition?: {
    x: number;
    y: number;
  };
}

export interface Challenge {
  id: string;
  prompt: string;
  date: string;
  xpReward: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'entries' | 'challenges';
}

export interface UserProgress {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  completedChallenges: string[];
  unlockedFeatures: string[];
  earnedBadges: string[];
}
