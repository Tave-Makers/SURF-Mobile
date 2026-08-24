import { useEffect, useRef } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBackRef.current) return false;

      webViewRef.current?.goBack();
      return true;
    });

    return () => subscription.remove();
  }, []);

  // 네이티브 앱 WebView에서만 .is-native-app 클래스와 safe area CSS 변수를 주입한다.
  // 일반 웹 브라우저에는 이 코드가 실행되지 않으므로 웹 레이아웃은 전혀 영향받지 않는다.
  const injectedSafeArea = `
    (function () {
      var root = document.documentElement;
      root.classList.add('is-native-app');
      root.style.setProperty('--sat', '${insets.top}px');
      root.style.setProperty('--sar', '${insets.right}px');
      root.style.setProperty('--sab', '${insets.bottom}px');
      root.style.setProperty('--sal', '${insets.left}px');
    })();
    true;
  `;

  return (
    <View style={styles.container}>
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
        // iOS가 safe area만큼 자동으로 inset을 넣는 동작을 끈다
        // 개발 빌드에서만 WebView 원격 디버깅 허용 (iOS 16.4+ / Android 필수)
        webviewDebuggingEnabled={__DEV__}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        injectedJavaScriptBeforeContentLoaded={injectedSafeArea}
        // SPA 라우팅 등으로 document가 교체돼도 클래스/변수가 유지되도록 재주입
        onLoadEnd={() => webViewRef.current?.injectJavaScript(injectedSafeArea)}
        onNavigationStateChange={(navigationState) => {
          canGoBackRef.current = navigationState.canGoBack;
        }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
  },
});
