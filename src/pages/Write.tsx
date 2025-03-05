
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

    // Load interact.js once at page level to ensure it's available
    if (!document.getElementById('interactjs-script-global')) {
      const script = document.createElement('script');
      script.id = 'interactjs-script-global';
      script.src = 'https://cdn.jsdelivr.net/npm/interactjs@1.10.17/dist/interact.min.js';
      script.async = false;
      script.defer = false;
      document.head.appendChild(script);
      console.log('Interact.js script added to page');
    }

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
