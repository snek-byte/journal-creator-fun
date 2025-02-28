import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";
import type { Mood, Sticker, Icon } from '@/types/journal';
import { v4 as uuidv4 } from 'uuid';
import { generateDailyChallenge } from '@/utils/journalChallenges';

const EMPTY_ENTRY = {
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
};

export const useJournalStore = create((set, get) => ({
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
      id: uuidv4(),
      position: sticker.position || { x: 100, y: 100 }
    };
    
    return {
      currentEntry: {
        ...state.currentEntry,
        stickers: [...(state.currentEntry.stickers || []), newSticker]
      }
    };
  }),
  
  addIcon: (icon) => set((state) => {
    const newIcon = {
      ...icon,
      id: uuidv4(),
      position: icon.position || { x: 100, y: 100 }
    };
    
    return {
      currentEntry: {
        ...state.currentEntry,
        icons: [...(state.currentEntry.icons || []), newIcon]
      }
    };
  }),
  
  updateIcon: (iconId, updates) => set((state) => {
    const updatedIcons = (state.currentEntry.icons || []).map(icon => 
      icon.id === iconId ? { ...icon, ...updates } : icon
    );
    
    return {
      currentEntry: {
        ...state.currentEntry,
        icons: updatedIcons
      }
    };
  }),
  
  removeIcon: (iconId) => set((state) => {
    const filteredIcons = (state.currentEntry.icons || []).filter(icon => 
      icon.id !== iconId
    );
    
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
  
  resetEntry: () => {
    set({ 
      currentEntry: {
        id: null,
        ...EMPTY_ENTRY
      } 
    });
  },
  
  saveEntry: async () => {
    const { currentEntry, userProgress } = get();
    
    if (!currentEntry.text.trim()) {
      console.error("Cannot save empty entry");
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      
      const entryData = {
        ...currentEntry,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };
      
      // If entry has an ID, update it, otherwise create new
      if (currentEntry.id) {
        const { error } = await supabase
          .from('journal_entries')
          .update(entryData)
          .eq('id', currentEntry.id);
          
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('journal_entries')
          .insert({
            ...entryData,
            created_at: new Date().toISOString()
          })
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          set(state => ({
            currentEntry: { ...state.currentEntry, id: data[0].id }
          }));
        }
        
        // Update user progress
        const wordCount = currentEntry.text.trim().split(/\s+/).length;
        const today = new Date().toDateString();
        const lastEntryDate = userProgress.lastEntry 
          ? new Date(userProgress.lastEntry).toDateString() 
          : null;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutiveDay = lastEntryDate === yesterday.toDateString();
        
        const newStreak = isConsecutiveDay 
          ? userProgress.streak + 1 
          : (lastEntryDate === today ? userProgress.streak : 1);
        
        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            streak: newStreak,
            entries_count: userProgress.entriesCount + 1,
            word_count: userProgress.wordCount + wordCount,
            last_entry: new Date().toISOString()
          });
          
        set(state => ({
          userProgress: {
            ...state.userProgress,
            streak: newStreak,
            entriesCount: state.userProgress.entriesCount + 1,
            wordCount: state.userProgress.wordCount + wordCount,
            lastEntry: new Date().toISOString()
          }
        }));
      }
      
      // Refresh entries list
      get().loadEntries();
      
      console.log("Entry saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving entry:", error);
      return false;
    }
  },
  
  loadEntries: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      set({ allEntries: data || [] });
    } catch (error) {
      console.error("Error loading entries:", error);
    }
  },
  
  loadEntry: async (id) => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        set({ currentEntry: data });
      }
    } catch (error) {
      console.error("Error loading entry:", error);
    }
  },
  
  loadProgress: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - not an error for new users
        throw error;
      }
      
      if (data) {
        set({ userProgress: data });
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  },
  
  loadChallenge: () => {
    const challenge = generateDailyChallenge();
    set({ dailyChallenge: challenge });
  },
  
  applyChallenge: () => {
    const { dailyChallenge } = get();
    if (!dailyChallenge) return;
    
    set(state => ({
      currentEntry: {
        ...state.currentEntry,
        text: state.currentEntry.text + 
          (state.currentEntry.text ? '\n\n' : '') + 
          `Today's Challenge: ${dailyChallenge.prompt}\n\n`
      }
    }));
  }
}));
