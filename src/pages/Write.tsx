
import { JournalEditor } from "@/components/JournalEditor";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useJournalStore } from "@/store/journalStore";

export default function Write() {
  const { loadEntries, loadProgress } = useJournalStore();
  const [interactJsLoaded, setInteractJsLoaded] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(0);

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

    // Load interact.js script
    const loadInteractJs = () => {
      if (typeof window !== 'undefined') {
        if (window.interact) {
          console.log('interact.js already available in window');
          setInteractJsLoaded(true);
          return;
        }
        
        console.log('Loading interact.js script, attempt:', loadingAttempts + 1);
        
        // Remove any previous script elements to avoid duplicates
        const existingScripts = document.querySelectorAll('script[src*="interact.min.js"]');
        existingScripts.forEach(script => script.remove());
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/interactjs@1.10.17/dist/interact.min.js';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('interact.js loaded successfully, window.interact:', !!window.interact);
          if (window.interact) {
            setInteractJsLoaded(true);
          } else {
            console.error('interact is not available after script load');
            
            // Try loading again after a delay, with max attempts
            if (loadingAttempts < 3) {
              setTimeout(() => {
                setLoadingAttempts(prev => prev + 1);
                loadInteractJs();
              }, 1000);
            }
          }
        };
        
        script.onerror = () => {
          console.error('Failed to load interact.js script');
          
          // Try loading again after a delay, with max attempts
          if (loadingAttempts < 3) {
            setTimeout(() => {
              setLoadingAttempts(prev => prev + 1);
              loadInteractJs();
            }, 1000);
          }
        };
        
        document.body.appendChild(script);
      }
    };
    
    loadInteractJs();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadEntries, loadProgress, loadingAttempts]);

  return (
    <div className="min-h-screen">
      {interactJsLoaded ? (
        <JournalEditor />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading journal editor...</p>
            <p className="text-sm text-muted-foreground mt-2">Initializing interactive components...</p>
          </div>
        </div>
      )}
    </div>
  );
}

declare global {
  interface Window {
    interact: any;
  }
}
