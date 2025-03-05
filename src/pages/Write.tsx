
import { JournalEditor } from "@/components/JournalEditor";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useJournalStore } from "@/store/journalStore";
import { toast } from "sonner";

export default function Write() {
  const { loadEntries, loadProgress } = useJournalStore();
  const [interactJsLoaded, setInteractJsLoaded] = useState(false);

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

    // Load interact.js directly as a script
    if (typeof window !== 'undefined') {
      // Check if interact.js is already loaded
      if (window.interact) {
        console.log('interact.js already available');
        setInteractJsLoaded(true);
        toast.success("Journal editor ready");
      } else {
        console.log('Loading interact.js script');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/interactjs@1.10.17/dist/interact.min.js';
        script.async = true;
        script.onload = () => {
          if (window.interact) {
            console.log('interact.js loaded successfully');
            setInteractJsLoaded(true);
            toast.success("Journal editor ready");
          } else {
            console.error('interact is not available after script load');
            toast.error("Failed to initialize the editor");
          }
        };
        script.onerror = () => {
          console.error('Failed to load interact.js script');
          toast.error("Failed to load editor components");
        };
        
        document.body.appendChild(script);
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [loadEntries, loadProgress]);

  return (
    <div className="min-h-screen">
      {interactJsLoaded ? (
        <JournalEditor />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading journal editor...</p>
          </div>
        </div>
      )}
    </div>
  );
}
