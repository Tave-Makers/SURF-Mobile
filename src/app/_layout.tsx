import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WantedSans from '../../assets/fonts/WantedSansStdVariable.ttf';

// 웹 세션을 확인하기 전까지 로그인 화면이 깜빡이지 않도록 스플래시를 잡아둔다.
// 해제는 세션 판별이 끝나는 src/app/index.tsx 에서 한다.
void SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // 로그인 화면이 웹과 같은 타이포로 보여야 해서 웹과 동일한 폰트를 번들한다
  const [fontsLoaded] = useFonts({ WantedSans });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      {/* 스플래시·로그인 배경이 라이트/다크에 따라 #ffffff / #12141c 로 바뀌므로
          상태바 아이콘도 따라가야 한다.
          Expo SDK 54+ Android는 edge-to-edge가 기본이라 translucent/backgroundColor는 지정하지 않는다. */}
      <StatusBar style="auto" />
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
