
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

    // Load interact.js with a more robust approach
    if (!document.getElementById('interactjs-script-global')) {
      const script = document.createElement('script');
      script.id = 'interactjs-script-global';
      script.src = 'https://cdn.jsdelivr.net/npm/interactjs@1.10.17/dist/interact.min.js';
      script.async = false;
      script.defer = false;
      
      script.onload = () => {
        console.log('Interact.js script loaded successfully');
        setInteractJsLoaded(true);
        toast.success("Drag and resize functionality loaded");
      };
      
      script.onerror = () => {
        console.error('Failed to load interact.js');
        toast.error("Failed to load drag functionality");
      };
      
      document.head.appendChild(script);
      console.log('Interact.js script added to page');
    } else {
      // If script tag already exists, check if window.interact is available
      if (window.interact) {
        console.log('Interact.js already available');
        setInteractJsLoaded(true);
      } else {
        // Poll for interact.js to become available
        const checkInteract = setInterval(() => {
          if (window.interact) {
            console.log('Interact.js detected after polling');
            setInteractJsLoaded(true);
            clearInterval(checkInteract);
          }
        }, 100);
        
        // Clear interval after 5 seconds to prevent infinite polling
        setTimeout(() => {
          clearInterval(checkInteract);
          if (!window.interact) {
            console.error('Interact.js failed to load after polling');
            toast.error("Drag functionality unavailable. Try refreshing the page.");
          }
        }, 5000);
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
            <p className="text-sm text-muted-foreground">Setting up drag and drop functionality</p>
          </div>
        </div>
      )}
    </div>
  );
}
