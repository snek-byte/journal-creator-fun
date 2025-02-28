
import { JournalEditor } from "@/components/JournalEditor";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useJournalStore } from "@/store/journalStore";

export default function Write() {
  const { loadEntries, loadProgress } = useJournalStore();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Load user's entries and progress if logged in
        loadEntries();
        loadProgress();
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
    <div className="min-h-screen">
      <JournalEditor />
    </div>
  );
}
