import { create } from 'zustand';
import { Profile, Candidate, Mentor } from '@/lib/types';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  candidateProfile: Candidate | null;
  mentorProfile: Mentor | null;
  isLoading: boolean;
  session: any | null; // ✅ added
  setUser: (user: any) => void;
  setProfile: (profile: Profile | null) => void;
  setCandidateProfile: (candidate: Candidate | null) => void;
  setMentorProfile: (mentor: Mentor | null) => void;
  setIsLoading: (loading: boolean) => void;
  setSession: (session: any | null) => void; // ✅ added
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  candidateProfile: null,
  mentorProfile: null,
  isLoading: true,
  session: null, // ✅ added
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setCandidateProfile: (candidateProfile) => set({ candidateProfile }),
  setMentorProfile: (mentorProfile) => set({ mentorProfile }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSession: (session) => set({ session }), // ✅ added
  clear: () =>
    set({
      user: null,
      profile: null,
      candidateProfile: null,
      mentorProfile: null,
      isLoading: false,
      session: null, // ✅ added
    }),
}));

interface NotificationState {
  unreadCount: number;
  notifications: any[];
  setUnreadCount: (count: number) => void;
  setNotifications: (notifications: any[]) => void;
  markAsRead: (notificationId: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  notifications: [],
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  setNotifications: (notifications) => set({ notifications }),
  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
}));
