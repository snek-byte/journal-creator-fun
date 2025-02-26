
import type { JournalState } from './types';

export const initialState: JournalState = {
  currentEntry: {
    text: '',
    font: 'inter',
    fontSize: '16px',
    fontWeight: 'normal',
    fontColor: '#000000',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    isPublic: false,
    textStyle: '',
  },
  entries: [],
  dailyChallenge: null,
  badges: [
    {
      id: 'streak-7',
      name: '7-Day Streak',
      description: 'Write every day for 7 days',
      icon: '🔥',
      requirement: 7,
      type: 'streak'
    },
    {
      id: 'entries-30',
      name: '30 Entries',
      description: 'Write 30 journal entries',
      icon: '📚',
      requirement: 30,
      type: 'entries'
    },
    {
      id: 'challenges-10',
      name: 'Challenge Master',
      description: 'Complete 10 daily challenges',
      icon: '🎯',
      requirement: 10,
      type: 'challenges'
    }
  ],
  progress: {
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalEntries: 0,
    completedChallenges: [],
    unlockedFeatures: [],
    earnedBadges: []
  },
  showPreview: true,
};
