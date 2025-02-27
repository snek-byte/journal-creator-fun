
import { useEffect, useState } from "react";
import { JournalEditor } from "@/components/JournalEditor";
import { useJournalStore } from "@/store/journalStore";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Write = () => {
  const { loadEntries, loadProgress } = useJournalStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state and set up persistence
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Get the session from localStorage first for instant UI response
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        // Load entries and progress if authenticated
        if (session) {
          loadEntries();
          loadProgress();
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Run the auth check when component mounts
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      
      // When auth state changes to authenticated, load user data
      if (session) {
        loadEntries();
        loadProgress();
      }
    });

    return () => subscription.unsubscribe();
  }, [loadEntries, loadProgress]);

  return (
    <div className="relative">
      {!isAuthenticated && !isLoading && (
        <div className="absolute top-2 right-2 z-50">
          <Link to="/auth">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs bg-white/30 hover:bg-white/50 text-gray-600 px-2 py-1 h-auto min-h-0 rounded-sm shadow-sm backdrop-blur-sm border-none"
            >
              Sign in
            </Button>
          </Link>
        </div>
      )}
      <JournalEditor />
    </div>
  );
};

export default Write;
