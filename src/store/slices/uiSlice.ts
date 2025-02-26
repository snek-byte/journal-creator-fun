
import type { StateCreator } from 'zustand';
import type { JournalStore } from '../types';

export const createUiSlice: StateCreator<JournalStore> = (set) => ({
  showPreview: true,
  togglePreview: () => set((state) => ({ 
    showPreview: !state.showPreview 
  })),
});
