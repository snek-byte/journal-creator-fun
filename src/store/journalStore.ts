
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JournalStore } from './types';
import { createEntrySlice } from './slices/entrySlice';
import { createUiSlice } from './slices/uiSlice';
import { createProgressSlice } from './slices/progressSlice';
import { createChallengeSlice } from './slices/challengeSlice';
import { createEntriesSlice } from './slices/entriesSlice';

export const useJournalStore = create<JournalStore>()(
  persist(
    (...a) => ({
      ...createEntrySlice(...a),
      ...createUiSlice(...a),
      ...createProgressSlice(...a),
      ...createChallengeSlice(...a),
      ...createEntriesSlice(...a),
    }),
    {
      name: 'journal-storage'
    }
  )
);
