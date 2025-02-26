
import { JournalEditor } from "@/components/JournalEditor";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export default function Write() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="relative">
      {!isAuthenticated && (
        <div className="absolute top-4 right-4 z-50">
          <Link to="/auth">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs bg-white/50 hover:bg-white/80 text-gray-600 border border-gray-200/50 shadow-sm backdrop-blur-sm"
            >
              Sign up to save
            </Button>
          </Link>
        </div>
      )}
      <JournalEditor />
    </div>
  );
}
