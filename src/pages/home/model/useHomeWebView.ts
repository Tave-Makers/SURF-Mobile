import { useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { buildWebUrl, getPathFromUrl, isBottomNavigationPath, WEB_URL } from './webView';

import { type BottomNavigationPath } from '@/widgets/bottom-navigation';

/**
 * Home 화면의 WebView navigation 상태를 관리합니다.
 *
 * - WebView ref와 현재 URL을 보관합니다.
 * - Android hardware back button을 WebView history와 연결합니다.
 * - 현재 WebView path가 native bottom navigation 대상인지 판별합니다.
 */
export const useHomeWebView = () => {
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

  return {
    activeBottomNavigationPath,
    handleNavigate,
    handleNavigationStateChange,
    webUri,
    webViewRef,
  };
};
