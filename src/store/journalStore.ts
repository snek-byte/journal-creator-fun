import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";
import type { Mood, Sticker, Icon } from '@/types/journal';
import { v4 as uuidv4 } from 'uuid';
import { generateDailyChallenge } from '@/utils/journalChallenges';
import { EMPTY_ENTRY } from '@/hooks/journal/constants';

interface JournalState {
  currentEntry: {
    id: string | null;
    text: string;
    font: string;
    fontSize: string;
    fontWeight: string;
    fontColor: string;
    gradient: string;
    isPublic: boolean;
    stickers: Sticker[];
    icons: Icon[];
    textPosition: { x: number, y: number };
    backgroundImage: string;
    drawing: string;
    filter: string;
    textStyle: string;
    mood?: Mood;
  };
  allEntries: any[];
  showPreview: boolean;
  dailyChallenge: any;
  userProgress: {
    streak: number;
    entriesCount: number;
    wordCount: number;
    lastEntry: string | null;
  };
  badges: any[];
  entries: any[];
  progress: any;
  
  setText: (text: string) => void;
  setFont: (font: string) => void;
  setFontSize: (size: string) => void;
  setFontWeight: (weight: string) => void;
  setFontColor: (color: string) => void;
  setGradient: (gradient: string) => void;
  setMood: (mood: Mood) => void;
  setIsPublic: (isPublic: boolean) => void;
  setTextStyle: (style: string) => void;
  setStickers: (stickers: Sticker[]) => void;
  setIcons: (icons: Icon[]) => void;
  setTextPosition: (position: { x: number, y: number }) => void;
  setBackgroundImage: (url: string) => void;
  setDrawing: (dataUrl: string) => void;
  setFilter: (filter: string) => void;
  addSticker: (sticker: Sticker) => void;
  addIcon: (icon: Icon) => void;
  updateIcon: (id: string, updates: Partial<Icon>) => void;
  removeIcon: (id: string) => void;
  togglePreview: () => void;
  saveEntry: () => void;
  loadEntries: () => void;
  loadProgress: () => void;
  applyChallenge: () => void;
  loadChallenge: () => void;
  resetEntry: () => void;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  currentEntry: {
    id: null,
    text: '',
    font: 'font-sans',
    fontSize: '16px',
    fontWeight: 'normal',
    fontColor: '#000000',
    gradient: 'linear-gradient(135deg, white, #f5f5f5)',
    isPublic: false,
    stickers: [],
    icons: [],
    textPosition: { x: 50, y: 50 },
    backgroundImage: '',
    drawing: '',
    filter: 'none',
    textStyle: 'normal',
  },
  allEntries: [],
  showPreview: false,
  dailyChallenge: null,
  userProgress: {
    streak: 0,
    entriesCount: 0,
    wordCount: 0,
    lastEntry: null,
  },
  badges: [
    { id: 'streak-3', name: 'Consistent Journaler', description: '3 day streak', image: '/badges/streak-3.svg', achieved: false },
    { id: 'streak-7', name: 'Weekly Warrior', description: '7 day streak', image: '/badges/streak-7.svg', achieved: false },
    { id: 'streak-30', name: 'Monthly Master', description: '30 day streak', image: '/badges/streak-30.svg', achieved: false },
    { id: 'entries-5', name: 'Getting Started', description: '5 journal entries', image: '/badges/entries-5.svg', achieved: false },
    { id: 'entries-20', name: 'Dedicated Writer', description: '20 journal entries', image: '/badges/entries-20.svg', achieved: false },
    { id: 'words-1000', name: 'Wordsmith', description: '1,000 words written', image: '/badges/words-1000.svg', achieved: false },
    { id: 'words-10000', name: 'Author', description: '10,000 words written', image: '/badges/words-10000.svg', achieved: false },
  ],
  entries: [],
  progress: {
    streak: 0,
    entriesCount: 0,
    wordCount: 0,
    lastEntry: null,
  },
  
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
  
  setIsPublic: (isPublic) => set((state) => ({ 
    currentEntry: { ...state.currentEntry, isPublic } 
  })),
  
  setTextStyle: (textStyle) => set((state) => ({ 
    currentEntry: { ...state.currentEntry, textStyle } 
  })),
  
  setStickers: (stickers) => set((state) => ({ 
    currentEntry: { ...state.currentEntry, stickers } 
  })),
  
  setIcons: (icons) => set((state) => ({ 
    currentEntry: { ...state.currentEntry, icons } 
  })),
  
  setTextPosition: (textPosition) => set((state) => ({ 
    currentEntry: { ...state.currentEntry, textPosition } 
  })),
  
  setBackgroundImage: (backgroundImage) => set((state) => ({ 
    currentEntry: { ...state.currentEntry, backgroundImage } 
  })),
  
  setDrawing: (drawing) => set((state) => ({ 
    currentEntry: { ...state.currentEntry, drawing } 
  })),
  
  setFilter: (filter) => set((state) => ({ 
    currentEntry: { ...state.currentEntry, filter } 
  })),
  
  addSticker: (sticker) => set((state) => {
    const newSticker = {
      ...sticker,
      id: uuidv4()
    };
    return { 
      currentEntry: { 
        ...state.currentEntry, 
        stickers: [...state.currentEntry.stickers, newSticker] 
      } 
    };
  }),
  
  addIcon: (icon) => set((state) => {
    const newIcon = {
      ...icon,
      id: uuidv4()
    };
    return { 
      currentEntry: { 
        ...state.currentEntry, 
        icons: [...state.currentEntry.icons, newIcon] 
      } 
    };
  }),
  
  updateIcon: (id, updates) => set((state) => {
    const updatedIcons = state.currentEntry.icons.map(icon => 
      icon.id === id ? { ...icon, ...updates } : icon
    );
    return { 
      currentEntry: { 
        ...state.currentEntry, 
        icons: updatedIcons 
      } 
    };
  }),
  
  removeIcon: (id) => set((state) => {
    const filteredIcons = state.currentEntry.icons.filter(icon => icon.id !== id);
    return { 
      currentEntry: { 
        ...state.currentEntry, 
        icons: filteredIcons 
      } 
    };
  }),
  
  togglePreview: () => set((state) => ({ 
    showPreview: !state.showPreview 
  })),
  
  saveEntry: async () => {
    const { currentEntry, userProgress } = get();
    
    if (!currentEntry.text.trim()) {
      console.error("Cannot save empty entry");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User must be logged in to save entries");
        return;
      }
      
      const entryToSave = {
        ...currentEntry,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([entryToSave])
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log("Entry saved successfully:", data);
      
      // Update user progress
      const wordCount = currentEntry.text.trim().split(/\s+/).length;
      const today = new Date().toISOString().split('T')[0];
      const lastEntryDate = userProgress.lastEntry 
        ? new Date(userProgress.lastEntry).toISOString().split('T')[0] 
        : null;
      
      let newStreak = userProgress.streak;
      
      if (lastEntryDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastEntryDate === yesterdayStr) {
          // User wrote yesterday, increment streak
          newStreak += 1;
        } else if (lastEntryDate !== today) {
          // User didn't write yesterday or today yet, reset streak
          newStreak = 1;
        }
        // If lastEntryDate === today, they've already written today, keep streak
      } else {
        // First entry ever
        newStreak = 1;
      }
      
      const newProgress = {
        streak: newStreak,
        entriesCount: userProgress.entriesCount + 1,
        wordCount: userProgress.wordCount + wordCount,
        lastEntry: today
      };
      
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert([{
          user_id: user.id,
          ...newProgress
        }]);
      
      if (progressError) {
        throw progressError;
      }
      
      set({ userProgress: newProgress });
      console.log("Progress updated:", newProgress);
      
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  },

  loadEntries: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User must be logged in to load entries");
        return;
      }
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      console.log("Entries loaded:", data);
      set({ entries: data || [] });
      
    } catch (error) {
      console.error("Error loading entries:", error);
    }
  },
  
  loadProgress: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User must be logged in to load progress");
        return;
      }
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }
      
      const progress = data || {
        streak: 0,
        entriesCount: 0,
        wordCount: 0,
        lastEntry: null
      };
      
      console.log("Progress loaded:", progress);
      set({ 
        userProgress: progress,
        progress
      });
      
      // Update badges based on progress
      const { badges } = get();
      const updatedBadges = badges.map(badge => {
        let achieved = false;
        
        if (badge.id === 'streak-3') achieved = progress.streak >= 3;
        if (badge.id === 'streak-7') achieved = progress.streak >= 7;
        if (badge.id === 'streak-30') achieved = progress.streak >= 30;
        if (badge.id === 'entries-5') achieved = progress.entriesCount >= 5;
        if (badge.id === 'entries-20') achieved = progress.entriesCount >= 20;
        if (badge.id === 'words-1000') achieved = progress.wordCount >= 1000;
        if (badge.id === 'words-10000') achieved = progress.wordCount >= 10000;
        
        return { ...badge, achieved };
      });
      
      set({ badges: updatedBadges });
      
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  },
  
  applyChallenge: () => {
    const { dailyChallenge } = get();
    if (!dailyChallenge) return;
    
    set((state) => ({
      currentEntry: {
        ...state.currentEntry,
        text: state.currentEntry.text ? 
          state.currentEntry.text + "\n\n" + dailyChallenge.prompt + "\n\n" :
          dailyChallenge.prompt + "\n\n"
      }
    }));
  },
  
  loadChallenge: () => {
    const challenge = generateDailyChallenge();
    set({ dailyChallenge: challenge });
  },
  
  resetEntry: () => {
    set({ 
      currentEntry: {
        id: null,
        ...EMPTY_ENTRY
      } 
    });
  },
}));
