// app/_layout.tsx
import { Stack } from 'expo-router';
import { NotificationProvider } from '@/lib/ui/NotificationBanner';

export default function RootLayout() {
  return (
    <NotificationProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </NotificationProvider>
  );
}