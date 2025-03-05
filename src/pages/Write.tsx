
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

    // Load interact.js directly with the correct namespace
    const loadInteractJs = () => {
      if (window.interact) {
        console.log('Interact.js already available in window');
        setInteractJsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js';
      script.async = true;
      script.onload = () => {
        console.log('Interact.js loaded successfully from CDN');
        if (window.interact) {
          setInteractJsLoaded(true);
          toast.success("Drag functionality is ready");
        } else {
          console.error('interact is not available after script load');
          toast.error("Failed to initialize drag functionality");
        }
      };
      script.onerror = () => {
        console.error('Failed to load interact.js script');
        toast.error("Failed to load drag functionality");
      };
      
      document.head.appendChild(script);
    };

    loadInteractJs();

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
            <p className="text-sm text-muted-foreground">Setting up drag and drop functionality</p>
          </div>
        </div>
      )}
    </div>
  );
}
