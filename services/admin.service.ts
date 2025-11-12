// services/admin.service.ts
import { authService } from '@/services/auth.service';

// copy the same hardcoded values you used in auth.service.ts
const SUPABASE_URL = 'https://rcbaaiiawrglvyzmawvr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA';

// 1. check current user is admin (reuses your REST profile fetch)
export async function getAdminProfile() {
  const profile = await authService.getCurrentUserProfile();
  if (!profile || profile.role !== 'admin') return null;
  return profile;
}

// 2. list admin interview profiles via REST (no supabase.from → no hang)
export async function listAdminInterviewProfiles() {
  const url = `${SUPABASE_URL}/rest/v1/interview_profiles_admin?select=*&order=created_at.desc`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) {
    console.log('[admin.service] listAdminInterviewProfiles failed', await res.text());
    throw new Error('Failed to fetch admin profiles');
  }

  const json = await res.json();
  return json as any[];
}

// 3. create a profile via REST and return the inserted row
export async function createAdminInterviewProfile(name: string, description?: string) {
  const url = `${SUPABASE_URL}/rest/v1/interview_profiles_admin`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation', // so we get the row back
    },
    body: JSON.stringify({
      name,
      description: description ?? '',
      is_active: true,
    }),
  });

  if (!res.ok) {
    console.log('[admin.service] createAdminInterviewProfile failed', await res.text());
    throw new Error('Failed to create profile');
  }

  const json = (await res.json()) as any[];
  return json[0];
}
