
import type { JournalEntry, Challenge, Badge, UserProgress, Mood } from '@/types/journal';
import type { TextStyle } from '@/utils/unicodeTextStyles';

export interface JournalStore {
  // Current entry being edited
  currentEntry: {
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
  };
  // Collections
  entries: JournalEntry[];
  dailyChallenge: Challenge | null;
  badges: Badge[];
  // User progress
  progress: UserProgress;
  // UI state
  showPreview: boolean;
  // Actions
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
