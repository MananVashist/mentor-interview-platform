// app/auth/oauth-callback.tsx
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/services/auth.service';
import { logger } from '@/lib/debug';

export default function OAuthCallback() {
  const router = useRouter();
  const { setUser, setSession, setProfile } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Ensure we have a session after the provider redirect
        const { data: s1, error: e1 } = await supabase.auth.getSession();
        if (e1) logger.warn('[OAuthCB] getSession error', e1);

        const existing = s1?.session;
        if (!existing) {
          // Native PKCE flow may require an exchange (web usually doesn’t)
          // If there is a `code`, supabase-js can exchange automatically on native.
          // If nothing is present, we proceed to check again.
        }

        const { data: s2 } = await supabase.auth.getSession();
        const session = s2?.session ?? null;
        const user = session?.user ?? null;

        logger.debug('[OAuthCB] session', { hasSession: !!session, uid: user?.id });

        if (!user || !session) {
          router.replace('/auth/sign-in');
          return;
        }

        // hydrate store
        setUser(user);
        setSession(session);

        // fetch profile row
        const profile = await authService.getUserProfileById(user.id);
        if (profile) {
          setProfile(profile as any);
          // route by role
          switch (profile.role) {
            case 'candidate':
              router.replace('/candidate');
              break;
            case 'mentor':
              router.replace('/mentor');
              break;
            case 'admin':
              router.replace('/(admin)');
              break;
            default:
              router.replace('/candidate');
              break;
          }
        } else {
          // No profile row yet; send them to sign-in (or a role-picker if you add one later)
          router.replace('/auth/sign-in');
        }
      } catch (e) {
        logger.warn('[OAuthCB] exception', e);
        router.replace('/auth/sign-in');
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
}
