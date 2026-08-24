import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      {/* 상단이 밝은 하늘색 일러스트라 아이콘은 dark 유지.
          Expo SDK 54+ Android는 edge-to-edge가 기본이라 translucent/backgroundColor는 지정하지 않는다. */}
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A0A' },
        }}
      />
    </SafeAreaProvider>
  );
};

export default RootLayout;
