import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JournalEntry, Challenge, Badge, UserProgress, Mood } from '@/types/journal';
import { generatePrompt } from '@/services/promptService';

interface JournalState {
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
  togglePreview: () => void;
  saveEntry: () => void;
  loadChallenge: () => void;
  applyChallenge: () => void;
  earnXP: (amount: number) => void;
  apiKey: string;
  generatedPrompt: string;
  setApiKey: (key: string) => void;
  generateMoodPrompt: (mood: Mood) => Promise<void>;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      currentEntry: {
        text: '',
        font: 'inter',
        fontSize: '16px',
        fontWeight: 'normal',
        fontColor: '#000000',
        gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        isPublic: false,
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
      setText: (text) => set((state) => ({ 
        currentEntry: { ...state.currentEntry, text } 
      })),
      setFont: (font) => set((state) => ({ 
        currentEntry: { ...state.currentEntry, font } 
      })),
      setFontSize: (fontSize) => set((state) => ({ 
        currentEntry: { ...state.currentEntry, fontSize } 
      })),
      setFontWeight: (fontWeight) => set((state) => ({ 
        currentEntry: { ...state.currentEntry, fontWeight } 
      })),
      setFontColor: (fontColor) => set((state) => ({ 
        currentEntry: { ...state.currentEntry, fontColor } 
      })),
      setGradient: (gradient) => set((state) => ({ 
        currentEntry: { ...state.currentEntry, gradient } 
      })),
      setMood: (mood) => set((state) => ({ 
        currentEntry: { ...state.currentEntry, mood } 
      })),
      setMoodNote: (moodNote) => set((state) => ({ 
        currentEntry: { ...state.currentEntry, moodNote } 
      })),
      setIsPublic: (isPublic) => set((state) => ({ 
        currentEntry: { ...state.currentEntry, isPublic } 
      })),
      togglePreview: () => set((state) => ({ 
        showPreview: !state.showPreview 
      })),
      saveEntry: () => {
        const state = get();
        const newEntry: JournalEntry = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          ...state.currentEntry,
          challengeId: state.dailyChallenge?.id
        };
        
        set((state) => {
          const hasEntryToday = state.entries.some(
            entry => new Date(entry.date).toDateString() === new Date().toDateString()
          );
          
          const xpEarned = 10 + (state.dailyChallenge ? 20 : 0);
          const newStreak = hasEntryToday ? state.progress.currentStreak : state.progress.currentStreak + 1;
          
          return {
            entries: [newEntry, ...state.entries],
            currentEntry: {
              ...state.currentEntry,
              text: '',
              mood: undefined,
              moodNote: undefined
            },
            progress: {
              ...state.progress,
              totalXp: state.progress.totalXp + xpEarned,
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, state.progress.longestStreak),
              totalEntries: state.progress.totalEntries + 1,
              completedChallenges: state.dailyChallenge 
                ? [...state.progress.completedChallenges, state.dailyChallenge.id]
                : state.progress.completedChallenges
            }
          };
        });
      },
      loadChallenge: () => {
        const prompts = [
          "What made you smile today?",
          "What's a challenge you overcame recently?",
          "Write about a small act of kindness you witnessed or performed",
          "What's something you're looking forward to?",
          "Describe your perfect day",
          "What's a skill you'd like to develop?",
          "Write about someone who inspires you"
        ];
        
        const today = new Date().toDateString();
        const promptIndex = Math.floor(
          new Date(today).getTime() / (1000 * 60 * 60 * 24)
        ) % prompts.length;
        
        set({
          dailyChallenge: {
            id: `challenge-${today}`,
            prompt: prompts[promptIndex],
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
      earnXP: (amount) => set((state) => ({
        progress: {
          ...state.progress,
          totalXp: state.progress.totalXp + amount
        }
      })),
      apiKey: '',
      generatedPrompt: '',
      setApiKey: (key: string) => set({ apiKey: key }),
      generateMoodPrompt: async (mood: Mood) => {
        const { apiKey } = get();
        if (!apiKey) return;
        
        const prompt = await generatePrompt(mood, apiKey);
        set({ generatedPrompt: prompt });
      }
    }),
    {
      name: 'journal-storage'
    }
  )
);
