
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JournalStore } from './types';
import { initialState } from './initialState';
import { createEntrySlice } from './entryActions';
import { createProgressSlice } from './progressActions';
import { createChallengeSlice } from './challengeActions';

export const useJournalStore = create<JournalStore>()(
  persist(
    (...a) => ({
      ...initialState,
      ...createEntrySlice(...a),
      ...createProgressSlice(...a),
      ...createChallengeSlice(...a),
    }),
    {
      name: 'journal-storage'
    }
  )
);
