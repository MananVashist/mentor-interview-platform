import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store';

export function useAuth() {
  // Get the state and actions from your Zustand store
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  // Get the setters to update store when Supabase changes
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear); // ✅ Get 'clear', not 'clearAll'

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // 2. Listen for auth changes (Sign In / Sign Out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[Auth] Event fired: ${event}`);

      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        // 🛑 THIS IS WHERE YOUR ERROR WAS
        // The function is named 'clear', NOT 'clearAll'
        await clear(); 
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!session?.user,
  };
}