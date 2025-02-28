
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
  textPosition: { x: number; y: number };
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

export type Mood =
  | 'happy'
  | 'excited'
  | 'content'
  | 'grateful'
  | 'relaxed'
  | 'hopeful'
  | 'motivated'
  | 'proud'
  | 'silly'
  | 'calm'
  | 'okay'
  | 'tired'
  | 'bored'
  | 'stressed'
  | 'anxious'
  | 'sad'
  | 'angry'
  | 'frustrated'
  | 'overwhelmed'
  | 'lonely';

export interface Sticker {
  id: string;
  url: string;
  position: { x: number; y: number };
  width: number;
  height: number;
}

export interface Icon {
  id: string;
  url: string;
  position: { x: number; y: number };
  size: number;
  color: string;
  style: 'outline' | 'color';
}

export interface HistoryEntry {
  text: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  mood?: Mood;
  moodNote?: string;
  isPublic: boolean;
  textStyle: string;
  stickers: Sticker[];
  icons: Icon[];
  textPosition: { x: number; y: number };
  backgroundImage?: string;
  drawing?: string;
  filter?: string;
}

// Adding the missing StickerSource type
export type StickerSource = 'decorative' | 'nature' | 'food';
