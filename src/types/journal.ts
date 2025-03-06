
export interface Point {
  x: number;
  y: number;
}

export interface Sticker {
  id: string;
  url: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
}

export interface Icon {
  id: string;
  url: string;
  position: { x: number; y: number };
  color: string;
  size: number;
  style: 'outline' | 'color';
}

export interface TextBox {
  id: string;
  text: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle?: string;
  rotation: number;
  zIndex: number;
}

export interface Mood {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface JournalEntry {
  id: number;
  date: string;
  text: string;
  mood?: Mood;
  moodNote?: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle?: string;
  isPublic: boolean;
  stickers: Sticker[];
  icons: Icon[];
  textBoxes: TextBox[];
  textPosition: { x: number; y: number };
  backgroundImage?: string;
  drawing?: string;
  filter?: string;
}

export interface Challenge {
  id: number;
  date: string;
  prompt: string;
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
  textBoxes: TextBox[];
}

export interface Progress {
  streak: number;
  longestStreak: number;
  entries: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface AudioTrack {
  id: string;
  name: string; 
  url: string;
  volume: number;
  isPlaying: boolean;
  category?: string;
}

export type StickerSource = 'decorative' | 'nature' | 'food';

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
