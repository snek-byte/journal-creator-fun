
import type { StateCreator } from 'zustand';
import type { JournalStore } from '../types';

export const createUiSlice: StateCreator<JournalStore, [], [], Pick<JournalStore, 'showPreview' | 'togglePreview'>> = (set) => ({
  showPreview: true,
  togglePreview: () => set((state) => ({ 
    showPreview: !state.showPreview 
  })),
});
