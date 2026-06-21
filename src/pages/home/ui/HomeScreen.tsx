import { ActivityIndicator, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { useHomeWebView } from '../model/useHomeWebView';

import { BottomNavigation } from '@/widgets/bottom-navigation';

export const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundColor = isDarkMode ? '#0F1117' : '#ffffff';
  const {
    activeBottomNavigationPath,
    handleNavigate,
    handleNavigationStateChange,
    webUri,
    webViewRef,
  } = useHomeWebView();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <WebView
        ref={webViewRef}
        source={{ uri: webUri }}
        style={[styles.webview, { backgroundColor }]}
        originWhitelist={['https://*', 'http://*']}
        allowsBackForwardNavigationGestures
        startInLoadingState
        renderLoading={() => <LoadingView backgroundColor={backgroundColor} />}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        javaScriptEnabled
        domStorageEnabled
        onNavigationStateChange={handleNavigationStateChange}
      />
      {activeBottomNavigationPath && (
        <BottomNavigation activePath={activeBottomNavigationPath} onNavigate={handleNavigate} />
      )}
    </SafeAreaView>
  );
};

interface Props {
  backgroundColor: string;
}

const LoadingView = ({ backgroundColor }: Props) => {
  return (
    <View style={[styles.loading, { backgroundColor }]}>
      <ActivityIndicator color="#208AEF" />
    </View>
  );
};

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
