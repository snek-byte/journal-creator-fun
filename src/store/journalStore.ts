
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JournalEntry, Challenge, Badge, UserProgress, Mood, Sticker, Icon, TextBox } from '@/types/journal';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JournalState {
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
    icons: Icon[];
    textPosition: { x: number, y: number };
    backgroundImage?: string;
    drawing?: string;
    filter?: string;
    textBoxes: TextBox[];
  };
  entries: JournalEntry[];
  dailyChallenge: Challenge | null;
  badges: Badge[];
  progress: UserProgress;
  showPreview: boolean;
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
  setIcons: (icons: Icon[]) => void;
  setTextPosition: (position: { x: number, y: number }) => void;
  setBackgroundImage: (url: string) => void;
  addSticker: (sticker: Sticker) => void;
  addIcon: (icon: Icon) => void;
  removeSticker: (stickerId: string) => void;
  removeIcon: (iconId: string) => void;
  updateIcon: (iconId: string, updates: Partial<Icon>) => void;
  togglePreview: () => void;
  saveEntry: () => Promise<void>;
  loadEntries: () => Promise<void>;
  loadProgress: () => Promise<void>;
  loadChallenge: () => void;
  applyChallenge: () => void;
  earnXP: (amount: number) => Promise<void>;
  setDrawing: (drawing: string) => void;
  setFilter: (filter: string) => void;
  setTextBoxes: (textBoxes: TextBox[]) => void;
  addTextBox: (textBox: TextBox) => void;
  updateTextBox: (id: string, updates: Partial<TextBox>) => void;
  removeTextBox: (id: string) => void;
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
        stickers: [],
        icons: [],
        textPosition: { x: 50, y: 50 },
        backgroundImage: undefined,
        drawing: undefined,
        filter: 'none',
        textBoxes: []
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
      setStickers: (stickers) => {
        console.log("Setting stickers in store:", stickers);
        set((state) => ({
          currentEntry: { ...state.currentEntry, stickers }
        }));
      },
      setIcons: (icons) => set((state) => ({
        currentEntry: { ...state.currentEntry, icons }
      })),
      setTextPosition: (textPosition) => set((state) => ({
        currentEntry: { ...state.currentEntry, textPosition }
      })),
      setBackgroundImage: (url) => set((state) => ({
        currentEntry: { ...state.currentEntry, backgroundImage: url }
      })),
      setDrawing: (drawing) => set((state) => ({
        currentEntry: { ...state.currentEntry, drawing }
      })),
      setFilter: (filter) => set((state) => ({
        currentEntry: { ...state.currentEntry, filter }
      })),
      setTextBoxes: (textBoxes) => set((state) => ({
        currentEntry: { ...state.currentEntry, textBoxes }
      })),
      addTextBox: (textBox) => set((state) => ({
        currentEntry: { 
          ...state.currentEntry, 
          textBoxes: [...state.currentEntry.textBoxes, textBox] 
        }
      })),
      updateTextBox: (id, updates) => set((state) => ({
        currentEntry: {
          ...state.currentEntry,
          textBoxes: state.currentEntry.textBoxes.map(box => 
            box.id === id ? { ...box, ...updates } : box
          )
        }
      })),
      removeTextBox: (id) => set((state) => ({
        currentEntry: {
          ...state.currentEntry,
          textBoxes: state.currentEntry.textBoxes.filter(box => box.id !== id)
        }
      })),
      addSticker: (sticker) => {
        console.log("Adding sticker to store:", sticker);
        set((state) => {
          const updatedStickers = [...(state.currentEntry.stickers || []), sticker];
          console.log("Updated stickers array:", updatedStickers);
          return {
            currentEntry: { 
              ...state.currentEntry, 
              stickers: updatedStickers
            }
          };
        });
      },
      addIcon: (icon) => set((state) => {
        const currentIcons = state.currentEntry.icons || [];
        return {
          currentEntry: {
            ...state.currentEntry,
            icons: [...currentIcons, icon]
          }
        };
      }),
      removeSticker: (stickerId) => set((state) => ({
        currentEntry: {
          ...state.currentEntry,
          stickers: (state.currentEntry.stickers || []).filter(s => s.id !== stickerId)
        }
      })),
      removeIcon: (iconId) => {
        console.log("Removing icon with ID:", iconId);
        set((state) => ({
          currentEntry: {
            ...state.currentEntry,
            icons: (state.currentEntry.icons || []).filter(i => i.id !== iconId)
          }
        }));
      },
      updateIcon: (iconId, updates) => {
        set((state) => ({
          currentEntry: {
            ...state.currentEntry,
            icons: (state.currentEntry.icons || []).map(icon => 
              icon.id === iconId ? { ...icon, ...updates } : icon
            )
          }
        }));
      },
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
              stickers: state.currentEntry.stickers,
              icons: state.currentEntry.icons,
              text_position: state.currentEntry.textPosition,
              background_image: state.currentEntry.backgroundImage || null,
              drawing: state.currentEntry.drawing || null,
              filter: state.currentEntry.filter || 'none',
              text_boxes: state.currentEntry.textBoxes
            });

          if (entryError) throw entryError;

          const xpEarned = 10 + (state.dailyChallenge ? 20 : 0);
          await get().earnXP(xpEarned);
          
          set((state) => ({
            currentEntry: {
              ...state.currentEntry,
              text: '',
              mood: undefined,
              moodNote: undefined,
              textStyle: 'normal',
              stickers: [],
              icons: [],
              textPosition: { x: 50, y: 50 },
              backgroundImage: undefined,
              drawing: undefined,
              filter: 'none',
              textBoxes: []
            }
          }));

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
          textStyle: entry.text_style || undefined,
          stickers: entry.stickers as Sticker[] || [],
          icons: entry.icons as Icon[] || [],
          textPosition: entry.text_position as { x: number, y: number } || { x: 50, y: 50 },
          backgroundImage: entry.background_image as string | undefined,
          drawing: entry.drawing as string | undefined,
          filter: entry.filter as string | undefined,
          textBoxes: entry.text_boxes as TextBox[] || []
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
