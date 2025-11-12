import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '@/lib/store';

// your project’s values
const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

export default function AdminHome() {
  const { profile, session } = useAuthStore();

  const [profiles, setProfiles] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const [debug, setDebug] = useState<string[]>([]);
  const [error, setError] = useState('');

  // helper to log to console + screen
  const log = useCallback((msg: string, obj?: any) => {
    const line = obj ? `${msg} ${JSON.stringify(obj)}` : msg;
    console.log('[ADMIN DBG]', line);
    setDebug((d) => [line, ...d]);
  }, []);

  // fetch profiles from supabase (REST) with current token
  const fetchProfiles = useCallback(async () => {
    setError('');
    log('--- FETCH PROFILES START ---');

    if (!profile) {
      log('fetchProfiles: no profile in store yet');
      setError('No profile in store');
      return;
    }
    if (profile.role !== 'admin') {
      log('fetchProfiles: profile.role is not admin', profile.role);
      setError('Not admin');
      return;
    }
    if (!session?.access_token) {
      log('fetchProfiles: NO access_token in session');
      setError('No access token in store (check sign-in → setSession)');
      return;
    }

    const url = `${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=*&order=created_at.desc`;
    const headers: Record<string, string> = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session.access_token}`,
    };

    log('fetchProfiles: GET ' + url);
    log('fetchProfiles: headers (without token)', {
      apikey: headers.apikey ? 'present' : 'missing',
      Authorization: headers.Authorization ? 'present' : 'missing',
    });

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers,
      });

      log('fetchProfiles: response status ' + res.status);

      const text = await res.text();
      log('fetchProfiles: raw body ' + text);

      if (!res.ok) {
        setError(`Fetch failed: ${res.status}`);
        return;
      }

      const json = JSON.parse(text);
      setProfiles(json);
      log('fetchProfiles: parsed JSON length=' + json.length);
    } catch (e: any) {
      log('fetchProfiles: exception ' + e?.message);
      setError(e?.message || 'Unknown fetch error');
    }

    log('--- FETCH PROFILES END ---');
  }, [profile, session, log]);

  // initial load
  useEffect(() => {
    // only try when profile is available
    if (profile) {
      fetchProfiles();
    } else {
      log('useEffect: profile not ready yet');
    }
  }, [profile, fetchProfiles, log]);

  // add profile (POST)
  const addProfile = useCallback(async () => {
    setError('');
    log('--- ADD PROFILE START ---');

    if (!profile) {
      log('addProfile: no profile in store');
      setError('No profile in store');
      return;
    }
    if (profile.role !== 'admin') {
      log('addProfile: not admin', profile.role);
      setError('Not admin');
      return;
    }
    if (!session?.access_token) {
      log('addProfile: NO access_token in session');
      setError('No access token in store (check sign-in → setSession)');
      return;
    }

    const url = `${SUPABASE_URL}/rest/v1/interview_profiles_admin`;
    const headers: Record<string, string> = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };

    const body = {
      name,
      description: desc,
      is_active: true,
    };

    log('addProfile: POST ' + url);
    log('addProfile: headers (without token)', {
      apikey: headers.apikey ? 'present' : 'missing',
      Authorization: headers.Authorization ? 'present' : 'missing',
      'Content-Type': headers['Content-Type'] ? 'present' : 'missing',
      Prefer: headers['Prefer'] ? 'present' : 'missing',
    });
    log('addProfile: body', body);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      log('addProfile: response status ' + res.status);

      const text = await res.text();
      log('addProfile: raw body ' + text);

      if (!res.ok) {
        setError(`Create failed: ${res.status}`);
        // try to show postgres error message if present
        try {
          const errJson = JSON.parse(text);
          if (errJson?.message) {
            setError(`Create failed: ${errJson.message}`);
          }
        } catch (_) {
          // ignore
        }
        return;
      }

      // success
      const json = JSON.parse(text);
      const created = json[0];
      log('addProfile: created row', created);

      setProfiles((prev) => [created, ...prev]);
      setName('');
      setDesc('');
    } catch (e: any) {
      log('addProfile: exception ' + e?.message);
      setError(e?.message || 'Unknown create error');
    }

    log('--- ADD PROFILE END ---');
  }, [profile, session, name, desc, log]);

  // ===== RENDER =====

  // still waiting for profile from store
  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Admin: waiting for profile from store…</Text>
        <DebugPanel debug={debug} />
      </View>
    );
  }

  // profile exists but not admin
  if (profile.role !== 'admin') {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', fontWeight: '600' }}>
          You are logged in as "{profile.role}", not "admin".
        </Text>
        <DebugPanel debug={debug} profile={profile} session={session} />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Admin dashboard (debug)</Text>
      <Text style={styles.subtitle}>
        Signed in as {profile.email} · user id: {profile.id}
      </Text>

      {!session?.access_token ? (
        <Text style={{ color: 'red', marginBottom: 8 }}>
          ⚠ No access_token in store. The request will fail RLS.
        </Text>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add interview profile</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Profile name"
        />
        <TextInput
          style={[styles.input, { height: 60 }]}
          value={desc}
          onChangeText={setDesc}
          placeholder="Description"
          multiline
        />
        <Button title="Add profile" onPress={addProfile} />
        {error ? <Text style={{ color: 'red', marginTop: 6 }}>{error}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Existing profiles</Text>
        <FlatList
          data={profiles}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text style={{ color: '#6b7280' }}>No profiles found.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.description ? <Text>{item.description}</Text> : null}
              <Text style={styles.meta}>
                id: {item.id} · active: {String(item.is_active)}
              </Text>
            </View>
          )}
        />
      </View>

      <DebugPanel debug={debug} profile={profile} session={session} />
    </View>
  );
}

// a small panel to show logs + current store values
function DebugPanel({
  debug,
  profile,
  session,
}: {
  debug: string[];
  profile?: any;
  session?: any;
}) {
  return (
    <View style={styles.debugBox}>
      <Text style={styles.debugTitle}>Debug</Text>
      {profile ? (
        <>
          <Text style={styles.debugLabel}>profile:</Text>
          <Text style={styles.debugText}>{JSON.stringify(profile, null, 2)}</Text>
        </>
      ) : null}
      {session ? (
        <>
          <Text style={styles.debugLabel}>session (partial):</Text>
          <Text style={styles.debugText}>
            {JSON.stringify(
              {
                // don’t print full token to screen
                access_token: session.access_token
                  ? session.access_token.slice(0, 16) + '…'
                  : null,
                expires_in: session.expires_in,
                token_type: session.token_type,
              },
              null,
              2
            )}
          </Text>
        </>
      ) : null}
      <Text style={styles.debugLabel}>logs:</Text>
      <ScrollView style={{ maxHeight: 160 }}>
        {debug.map((d, i) => (
          <Text key={i} style={styles.debugText}>
            • {d}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: '#f3f4f6' },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#6b7280', marginBottom: 12 },
  section: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12 },
  sectionTitle: { fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  cardTitle: { fontWeight: '600' },
  meta: { fontSize: 10, color: '#6b7280', marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  debugBox: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  debugTitle: { fontWeight: '600', marginBottom: 8 },
  debugLabel: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  debugText: { fontSize: 11, color: '#374151' },
});
