
import type { JournalEntry, Challenge, Badge, UserProgress, Mood } from '@/types/journal';

export interface CurrentEntry {
  text: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  mood?: Mood;
  moodNote?: string;
  isPublic: boolean;
  textStyle?: string;
}

export interface JournalState {
  currentEntry: CurrentEntry;
  entries: JournalEntry[];
  dailyChallenge: Challenge | null;
  badges: Badge[];
  progress: UserProgress;
  showPreview: boolean;
}

export interface JournalActions {
  setText: (text: string) => void;
  setFont: (font: string) => void;
  setFontSize: (size: string) => void;
  setFontWeight: (weight: string) => void;
  setFontColor: (color: string) => void;
  setGradient: (gradient: string) => void;
  setMood: (mood: Mood) => void;
  setMoodNote: (note: string) => void;
  setIsPublic: (isPublic: boolean) => void;
  setTextStyle: (style: string) => void;
  togglePreview: () => void;
  saveEntry: () => Promise<void>;
  loadEntries: () => Promise<void>;
  loadProgress: () => Promise<void>;
  loadChallenge: () => void;
  applyChallenge: () => void;
  earnXP: (amount: number) => Promise<void>;
}

export type JournalStore = JournalState & JournalActions;
