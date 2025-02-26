
import type { StateCreator } from 'zustand';
import type { JournalStore } from '../types';
import type { Mood } from '@/types/journal';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const createEntriesSlice: StateCreator<JournalStore> = (set, get) => ({
  entries: [],
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
          text_style: state.currentEntry.textStyle || null
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
          textStyle: ''
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
});
