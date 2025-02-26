
export type Mood = 'happy' | 'sad' | 'stressed' | 'calm' | 'neutral';

export interface JournalEntry {
  id: string;
  text: string;
  date: string;
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
  type: 'streak' | 'entries' | 'challenges' | 'mood';
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
