
import type { StateCreator } from 'zustand';
import type { JournalStore } from '../types';

export const createChallengeSlice: StateCreator<JournalStore, [], [], Pick<JournalStore, 'dailyChallenge' | 'badges' | 'loadChallenge' | 'applyChallenge'>> = (set, get) => ({
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
  loadChallenge: () => {
    const prompts = [
      "What made you smile today?",
      "What's a challenge you overcame recently?",
      "Write about a small act of kindness you witnessed or performed",
      "What's something you're looking forward to?",
      "Describe your perfect day",
      "What's a skill you'd like to develop?",
      "Write about someone who inspires you",
      "Share a memorable conversation you had recently",
      "What's your favorite place and why?",
      "Write about a goal you're working towards",
      "Describe a moment that changed your perspective",
      "What are you grateful for today?",
      "Write about a lesson you learned the hard way",
      "Share a dream or aspiration you have",
      "What makes you feel most alive?"
    ];
    
    const today = new Date().toDateString();
    const randomIndex = Math.floor(Math.random() * prompts.length);
    
    set({
      dailyChallenge: {
        id: `challenge-${today}-${randomIndex}`,
        prompt: prompts[randomIndex],
        date: today,
        xpReward: 20
      }
    });
  },
  applyChallenge: () => {
    const state = get();
    if (state.dailyChallenge) {
      set((state) => ({
        currentEntry: {
          ...state.currentEntry,
          text: state.dailyChallenge?.prompt || ''
        }
      }));
    }
  },
});
