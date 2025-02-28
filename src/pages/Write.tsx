
import { JournalEditor } from "@/components/JournalEditor";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useJournalStore } from "@/store/journalStore";
import { toast } from "sonner";

export default function Write() {
  const { loadEntries, loadProgress } = useJournalStore();

  // Load user data on component mount
  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Load user's entries and progress if logged in
        loadEntries().catch(err => {
          console.error("Failed to load entries:", err);
          toast.error("Failed to load your journal entries");
        });
        loadProgress().catch(err => {
          console.error("Failed to load progress:", err);
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          loadEntries();
          loadProgress();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [loadEntries, loadProgress]);

  return (
    <div className="min-h-screen bg-gray-50">
      <JournalEditor />
    </div>
  );
}
