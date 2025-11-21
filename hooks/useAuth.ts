// hooks/useAuth.ts
import { useEffect, useState } from 'react';
// 🎯 NOTICE: Relative paths (..) instead of @/
import { useAuthStore } from '../lib/store';
import { authService } from '../services/auth.service';

export function useAuth() {
  const { user, profile, session, setProfile, clearAll } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    const p = await authService.getCurrentUserProfile();
    if (p) {
      setProfile(p);
      return p;
    }
    return null;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (session && !profile) {
        await refreshProfile();
      }
      setIsLoading(false);
    };

    initializeAuth();

    const { data: authListener } = authService.onAuthStateChange((event, _) => {
        if (event === 'SIGNED_OUT') {
            clearAll();
        }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [session, profile, setProfile, clearAll]);

  return {
    isAuthenticated: !!user && !!profile,
    isLoading,
    user,
    profile,
    session,
    refreshProfile,
  };
}