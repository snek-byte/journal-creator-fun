
export type Mood = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'excited' 
  | 'relaxed' 
  | 'anxious'
  | 'grateful'
  | 'confused'
  | 'stressed'
  | 'calm'
  | 'neutral';

export interface Sticker {
  id: string;
  url: string;
  position: {
    x: number;
    y: number;
  };
  width?: number;
  height?: number;
}

export interface Icon {
  id: string;
  url: string;
  position: {
    x: number;
    y: number;
  };
  color?: string;
  size?: number;
  style: 'outline' | 'color';
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
  icons: Icon[];
  textPosition?: {
    x: number;
    y: number;
  };
  backgroundImage?: string;
  drawing?: string;
  filter?: string;
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

// Add artistic to the allowed sticker sources
export type StickerSource = 'local' | 'giphy' | 'flaticon' | 'icons8' | 'artistic';
