import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { BottomNavigation, type BottomNavigationPath } from '@/components/ui/BottomNavigation';

const DEFAULT_WEB_URL = 'https://www.tavesurf.site/';
const BOTTOM_NAVIGATION_PATHS = new Set<BottomNavigationPath>(['/', '/mypage']);

const getWebUrl = () => {
  const envWebUrl: unknown = process.env.EXPO_PUBLIC_WEB_URL;

  return typeof envWebUrl === 'string' && envWebUrl.length > 0 ? envWebUrl : DEFAULT_WEB_URL;
};

const WEB_URL = getWebUrl();

const buildWebUrl = (path: BottomNavigationPath) => {
  return new URL(path, WEB_URL).toString();
};

const getPathFromUrl = (url: string): string => {
  try {
    const { pathname } = new URL(url);
    return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  } catch {
    return '/';
  }
};

const isBottomNavigationPath = (path: string): path is BottomNavigationPath => {
  return BOTTOM_NAVIGATION_PATHS.has(path as BottomNavigationPath);
};

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const webViewRef = useRef<WebView>(null);
  const canGoBackRef = useRef(false);
  const [currentPath, setCurrentPath] = useState(() => getPathFromUrl(WEB_URL));
  const [webUri, setWebUri] = useState(WEB_URL);

  const activeBottomNavigationPath = isBottomNavigationPath(currentPath) ? currentPath : null;

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBackRef.current) return false;

      webViewRef.current?.goBack();
      return true;
    });

    return () => subscription.remove();
  }, []);

  const handleNavigate = (path: BottomNavigationPath) => {
    setCurrentPath(path);
    setWebUri(buildWebUrl(path));
  };

  const handleNavigationStateChange = (navigationState: WebViewNavigation) => {
    canGoBackRef.current = navigationState.canGoBack;
    setCurrentPath(getPathFromUrl(navigationState.url));
  };

  const backgroundColor = isDarkMode ? '#0F1117' : '#ffffff';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <WebView
        ref={webViewRef}
        source={{ uri: webUri }}
        style={[styles.webview, { backgroundColor }]}
        originWhitelist={['https://*', 'http://*']}
        allowsBackForwardNavigationGestures
        startInLoadingState
        renderLoading={() => (
          <View style={[styles.loading, { backgroundColor }]}>
            <ActivityIndicator color="#208AEF" />
          </View>
        )}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        javaScriptEnabled
        domStorageEnabled
        onNavigationStateChange={handleNavigationStateChange}
      />
      {activeBottomNavigationPath ? (
        <BottomNavigation activePath={activeBottomNavigationPath} onNavigate={handleNavigate} />
      ) : null}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
