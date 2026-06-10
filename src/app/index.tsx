import { useEffect, useRef } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const DEFAULT_WEB_URL = 'https://www.tavesurf.site/';

const getWebUrl = () => {
  const envWebUrl: unknown = process.env.EXPO_PUBLIC_WEB_URL;

  return typeof envWebUrl === 'string' && envWebUrl.length > 0 ? envWebUrl : DEFAULT_WEB_URL;
};

const WEB_URL = getWebUrl();

const HomeScreen = () => {
  const webViewRef = useRef<WebView>(null);
  const canGoBackRef = useRef(false);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBackRef.current) return false;

      webViewRef.current?.goBack();
      return true;
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        originWhitelist={['https://*', 'http://*']}
        allowsBackForwardNavigationGestures
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator color="#208AEF" />
          </View>
        )}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        javaScriptEnabled
        domStorageEnabled
        onNavigationStateChange={(navigationState) => {
          canGoBackRef.current = navigationState.canGoBack;
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
