import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import pretendardRegular from '../../assets/fonts/Pretendard-Regular.otf';
import pretendardSemiBold from '../../assets/fonts/Pretendard-SemiBold.otf';

const RootLayout = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [fontsLoaded] = useFonts({
    Pretendard: pretendardRegular,
    'Pretendard-SemiBold': pretendardSemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: isDarkMode ? '#0F1117' : '#ffffff' },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
