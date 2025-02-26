
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import Write from "./pages/Write";
import Auth from "./pages/Auth";

function App() {
  const [session, setSession] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={session ? <Navigate to="/write" /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={session ? <Navigate to="/write" /> : <Auth />}
        />
        <Route
          path="/write"
          element={session ? <Write /> : <Navigate to="/auth" />}
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
