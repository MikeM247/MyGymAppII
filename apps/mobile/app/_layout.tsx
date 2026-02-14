import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@/theme/colors";
import { useAuthStore } from "@/store/authStore";
import { useOfflineQueueStore } from "@/store/offlineQueueStore";
import { syncOfflineQueue } from "@/offline/syncService";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { token, isReady, bootstrap } = useAuthStore();
  const hydrateQueue = useOfflineQueueStore((state) => state.hydrate);

  useEffect(() => {
    bootstrap();
    hydrateQueue();
  }, [bootstrap, hydrateQueue]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (token && inAuthGroup) {
      router.replace("/(tabs)");
      syncOfflineQueue().catch(() => null);
    }
  }, [isReady, segments, token, router]);

  useEffect(() => {
    if (!token) {
      return;
    }

    syncOfflineQueue().catch(() => null);
    const id = setInterval(() => {
      syncOfflineQueue().catch(() => null);
    }, 30000);

    return () => clearInterval(id);
  }, [token]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
