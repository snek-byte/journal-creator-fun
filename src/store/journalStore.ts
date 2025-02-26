import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JournalEntry, Challenge, Badge, UserProgress, Mood, Sticker } from '@/types/journal';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    textStyle: string;
    stickers: Sticker[];
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
  setStickers: (stickers: Sticker[]) => void;
  togglePreview: () => void;
  saveEntry: () => Promise<void>;
  loadEntries: () => Promise<void>;
  loadProgress: () => Promise<void>;
  loadChallenge: () => void;
  applyChallenge: () => void;
  earnXP: (amount: number) => Promise<void>;
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
        textStyle: 'normal',
        stickers: []
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
      setTextStyle: (textStyle) => set((state) => ({
        currentEntry: { ...state.currentEntry, textStyle }
      })),
      setStickers: (stickers) => set((state) => ({
        currentEntry: { ...state.currentEntry, stickers }
      })),
      togglePreview: () => set((state) => ({ 
        showPreview: !state.showPreview 
      })),
      saveEntry: async () => {
        const state = get();
        const user = await supabase.auth.getUser();
        
        if (!user.data.user) {
          toast.error('Please sign in to save entries');
          return;
        }

        try {
          const { error: entryError } = await supabase
            .from('journal_entries')
            .insert({
              user_id: user.data.user.id,
              text: state.currentEntry.text,
              font: state.currentEntry.font,
              font_size: state.currentEntry.fontSize,
              font_weight: state.currentEntry.fontWeight,
              font_color: state.currentEntry.fontColor,
              gradient: state.currentEntry.gradient,
              mood: state.currentEntry.mood || null,
              mood_note: state.currentEntry.moodNote || null,
              is_public: state.currentEntry.isPublic,
              challenge_id: state.dailyChallenge?.id || null,
              text_style: state.currentEntry.textStyle || null,
              stickers: state.currentEntry.stickers
            });

          if (entryError) throw entryError;

          // Update progress
          const xpEarned = 10 + (state.dailyChallenge ? 20 : 0);
          await get().earnXP(xpEarned);
          
          // Reset current entry
          set((state) => ({
            currentEntry: {
              ...state.currentEntry,
              text: '',
              mood: undefined,
              moodNote: undefined,
              textStyle: 'normal',
              stickers: []
            }
          }));

          // Reload entries to show the new one
          await get().loadEntries();
          
          toast.success('Journal entry saved!');
        } catch (error) {
          console.error('Error saving entry:', error);
          toast.error('Failed to save entry');
        }
      },
      loadEntries: async () => {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const { data, error } = await supabase
          .from('journal_entries')
          .select()
          .eq('user_id', user.data.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading entries:', error);
          toast.error('Failed to load entries');
          return;
        }

        if (!data) {
          set({ entries: [] });
          return;
        }

        const entries = data.map(entry => ({
          id: entry.id,
          date: entry.created_at,
          text: entry.text,
          font: entry.font,
          fontSize: entry.font_size,
          fontWeight: entry.font_weight,
          fontColor: entry.font_color,
          gradient: entry.gradient,
          mood: entry.mood as Mood | undefined,
          moodNote: entry.mood_note || undefined,
          isPublic: entry.is_public,
          challengeId: entry.challenge_id || undefined,
          textStyle: entry.text_style || undefined
        }));

        set({ entries });
      },
      loadProgress: async () => {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.data.user.id)
          .single();

        if (error) {
          console.error('Error loading progress:', error);
          toast.error('Failed to load progress');
          return;
        }

        if (!data) return;

        set({
          progress: {
            totalXp: data.total_xp,
            currentStreak: data.current_streak,
            longestStreak: data.longest_streak,
            totalEntries: data.total_entries,
            completedChallenges: data.completed_challenges,
            unlockedFeatures: data.unlocked_features,
            earnedBadges: data.earned_badges
          }
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
      earnXP: async (amount) => {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const currentState = get();
        const newTotalXp = currentState.progress.totalXp + amount;
        const newTotalEntries = currentState.progress.totalEntries + 1;

        const { data, error } = await supabase
          .from('profiles')
          .update({
            total_xp: newTotalXp,
            total_entries: newTotalEntries
          })
          .eq('id', user.data.user.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating XP:', error);
          toast.error('Failed to update progress');
          return;
        }

        if (!data) return;

        set((state) => ({
          progress: {
            ...state.progress,
            totalXp: data.total_xp,
            totalEntries: data.total_entries
          }
        }));

        toast.success(`Earned ${amount} XP!`);
      }
    }),
    {
      name: 'journal-storage'
    }
  )
);
