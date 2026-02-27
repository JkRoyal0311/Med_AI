/**
 * Root layout — wraps entire app
 */
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../store/authStore';
import { useRouter, useSegments } from 'expo-router';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 300000 },
  },
});

function AuthGuard() {
  const { user, loading, restore } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => { restore(); }, []);

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/(auth)/login');
    if (user && inAuth) router.replace('/(tabs)');
  }, [user, loading]);

  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthGuard />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="result" options={{ presentation: 'card' }} />
          <Stack.Screen name="symptoms" />
          <Stack.Screen name="search" />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
