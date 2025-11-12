import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function MentorIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile page by default
    router.replace('/(mentor)/profile');
  }, []);

  return null;
}