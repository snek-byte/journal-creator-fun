
import type { StateCreator } from 'zustand';
import type { JournalStore } from './types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const createProgressSlice: StateCreator<
  JournalStore,
  [],
  [],
  Pick<JournalStore, 'loadProgress' | 'earnXP'>
> = (set, get) => ({
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

    if (!data) {
      return;
    }

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
  earnXP: async (amount) => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        total_xp: get().progress.totalXp + amount,
        total_entries: get().progress.totalEntries + 1
      })
      .eq('id', user.data.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating XP:', error);
      toast.error('Failed to update progress');
      return;
    }

    if (!data) {
      return;
    }

    set((state) => ({
      progress: {
        ...state.progress,
        totalXp: data.total_xp,
        totalEntries: data.total_entries
      }
    }));

    toast.success(`Earned ${amount} XP!`);
  }
});
