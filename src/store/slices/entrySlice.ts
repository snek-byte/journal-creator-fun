
import type { StateCreator } from 'zustand';
import type { JournalStore } from '../types';
import type { Mood } from '@/types/journal';

export const createEntrySlice: StateCreator<JournalStore> = (set) => ({
  currentEntry: {
    text: '',
    font: 'inter',
    fontSize: '16px',
    fontWeight: 'normal',
    fontColor: '#000000',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    isPublic: false,
    textStyle: ''
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
  setMood: (mood: Mood) => set((state) => ({ 
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
});
