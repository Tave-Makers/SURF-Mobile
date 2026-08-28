import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from 'react-native-webview';

import { isAppleSignInAvailable, signInWithApple } from '@/features/auth/lib/appleLogin';
import { signInWithKakao, signOutFromKakao } from '@/features/auth/lib/kakaoLogin';
import { readCachedSessionState, writeCachedSessionState } from '@/features/auth/lib/sessionCache';
import { LoginOverlay } from '@/features/auth/ui/LoginOverlay';
import {
  getPushToken,
  PUSH_PLATFORM,
  subscribeToTokenRefresh,
} from '@/features/push/lib/pushToken';
import { AnimatedSplash } from '@/features/splash/ui/AnimatedSplash';
import {
  buildInitScript,
  buildPushTokenScript,
  buildSessionScript,
  parseBridgeMessage,
  type AppSessionPayload,
} from '@/features/webview/lib/bridge';
import { WEB_URL } from '@/shared/config/env';
import { COLOR_TOKENS } from '@/shared/config/theme';

/**
 * 세션의 주인은 WebView 쿠키다.
 * 네이티브는 SDK 로그인 결과를 웹에 넘겨 세션을 만들어주고,
 * 웹이 /login 으로 돌려보내면 로그아웃으로 판단한다.
 */
type SessionStatus =
  | 'booting'
  | 'signed-out'
  | 'authenticating'
  /** 로그인 화면의 약관·문의 링크로 공개 페이지를 보는 중. 오버레이를 잠시 걷는다. */
  | 'browsing'
  | 'signed-in';

const LOGIN_PATH = '/login';
const LOGIN_CALLBACK_PATH = '/login/callback';

/** RN 의 URL 구현에 의존하지 않고 pathname 만 뽑는다. */
const getPathname = (url: string) => {
  const withoutProtocol = url.replace(/^[a-z]+:\/\//i, '');
  const slashIndex = withoutProtocol.indexOf('/');
  if (slashIndex === -1) return '/';

  const [path] = withoutProtocol.slice(slashIndex).split(/[?#]/);
  return path.length > 0 ? path : '/';
};

const isSurfOrigin = (url: string) => url === WEB_URL || url.startsWith(`${WEB_URL}/`);

const isLoginUrl = (url: string) => {
  const pathname = getPathname(url);
  if (pathname.startsWith(LOGIN_CALLBACK_PATH)) return false;

  return pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);
};

const isCancellation = (error: unknown) => {
  if (typeof error !== 'object' || error === null) return false;

  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' && code.toUpperCase().includes('CANCEL');
};

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message.length > 0 ? error.message : fallback;

const HomeScreen = () => {
  const webViewRef = useRef<WebView>(null);
  const canGoBackRef = useRef(false);
  const currentUrlRef = useRef(WEB_URL);
  const pushRequestedRef = useRef(false);
  const pushTokenRef = useRef<string | null>(null);
  const statusRef = useRef<SessionStatus>('booting');
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const appBackground = COLOR_TOKENS[scheme === 'dark' ? 'dark' : 'light'].backgroundNormal;

  const [status, setStatus] = useState<SessionStatus>('booting');
  const [animationFinished, setAnimationFinished] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appleAvailable, setAppleAvailable] = useState(false);

  statusRef.current = status;

  useEffect(() => {
    void isAppleSignInAvailable().then(setAppleAvailable);
  }, []);

  // 지난번에 로그아웃 상태였다면 웹 로딩을 기다리지 않고 바로 로그인 화면을 띄운다.
  // 예측이 틀렸으면 WebView 가 로드되는 순간 handleNavigationStateChange 가 교정한다.
  useEffect(() => {
    void (async () => {
      const cached = await readCachedSessionState();
      if (cached !== 'signed-out') return;

      setStatus((previous) => (previous === 'booting' ? 'signed-out' : previous));
    })();
  }, []);

  // 다음 실행에서 쓸 수 있도록 확정된 상태만 기록한다
  useEffect(() => {
    if (status !== 'signed-in' && status !== 'signed-out') return;

    void writeCachedSessionState(status);
  }, [status]);

  // 네이티브 정지 스플래시는 로티가 마운트되는 즉시 넘긴다.
  // 이후 화면 전환은 AnimatedSplash 가 담당한다.
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      // 로그인 오버레이가 떠 있으면 WebView 히스토리를 건드리지 않는다
      if (statusRef.current !== 'signed-in' && statusRef.current !== 'browsing') return false;
      if (!canGoBackRef.current) return false;

      webViewRef.current?.goBack();
      return true;
    });

    return () => subscription.remove();
  }, []);

  // window 에 심은 값은 문서가 새로 로드되면 날아가므로 토큰을 들고 있다가 매 로드마다 다시 넣는다
  const injectPushToken = useCallback((token: string) => {
    pushTokenRef.current = token;
    webViewRef.current?.injectJavaScript(buildPushTokenScript(token, PUSH_PLATFORM));
  }, []);

  // 로그인 직후 FCM 토큰을 웹에 넘긴다. 등록은 웹의 인증된 프록시가 담당한다.
  useEffect(() => {
    if (status !== 'signed-in' || pushRequestedRef.current) return;

    pushRequestedRef.current = true;
    let cancelled = false;

    void (async () => {
      const token = await getPushToken();
      if (cancelled || token === null) return;

      injectPushToken(token);
    })();

    return () => {
      cancelled = true;
    };
  }, [status, injectPushToken]);

  useEffect(
    () =>
      subscribeToTokenRefresh((token) => {
        if (statusRef.current !== 'signed-in') return;

        injectPushToken(token);
      }),
    [injectPushToken],
  );

  const startSession = useCallback((payload: AppSessionPayload) => {
    // SURF 오리진이 아닌 페이지에는 로그인 토큰을 절대 주입하지 않는다
    if (!isSurfOrigin(currentUrlRef.current)) {
      setStatus('signed-out');
      setErrorMessage('로그인 페이지를 다시 불러오는 중이에요. 잠시 후 다시 시도해주세요.');
      webViewRef.current?.injectJavaScript(
        `window.location.replace(${JSON.stringify(`${WEB_URL}${LOGIN_PATH}`)});true;`,
      );
      return;
    }

    setErrorMessage(null);
    setStatus('authenticating');
    webViewRef.current?.injectJavaScript(buildSessionScript(payload));
  }, []);

  const handleKakaoPress = useCallback(() => {
    void (async () => {
      setErrorMessage(null);
      setStatus('authenticating');

      try {
        const accessToken = await signInWithKakao();
        startSession({ provider: 'kakao', accessToken });
      } catch (error) {
        await signOutFromKakao();
        setStatus('signed-out');
        setErrorMessage(
          isCancellation(error) ? null : toErrorMessage(error, '카카오 로그인에 실패했어요.'),
        );
      }
    })();
  }, [startSession]);

  const handleApplePress = useCallback(() => {
    void (async () => {
      setErrorMessage(null);
      setStatus('authenticating');

      try {
        const credential = await signInWithApple();
        startSession({ provider: 'apple', ...credential });
      } catch (error) {
        setStatus('signed-out');
        setErrorMessage(
          isCancellation(error) ? null : toErrorMessage(error, 'Apple 로그인에 실패했어요.'),
        );
      }
    })();
  }, [startSession]);

  // 약관·문의는 WebView 의 공개 페이지로 보낸다. 그 페이지의 헤더 뒤로가기로 /login 에
  // 돌아오면 handleNavigationStateChange 가 다시 signed-out 으로 되돌린다.
  const handleLinkPress = useCallback((path: string) => {
    setStatus('browsing');
    webViewRef.current?.injectJavaScript(
      `window.location.href = ${JSON.stringify(`${WEB_URL}${path}`)};true;`,
    );
  }, []);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    const message = parseBridgeMessage(event.nativeEvent.data);
    if (message === null) return;

    if (message.type === 'LOGGED_OUT') {
      pushRequestedRef.current = false;
      pushTokenRef.current = null;
      setStatus('signed-out');
      return;
    }

    if (message.ok) {
      setErrorMessage(null);
      setStatus('signed-in');
      return;
    }

    void signOutFromKakao();
    pushRequestedRef.current = false;
    pushTokenRef.current = null;
    setStatus('signed-out');
    setErrorMessage(message.message ?? '로그인에 실패했어요. 잠시 후 다시 시도해주세요.');
  }, []);

  const handleNavigationStateChange = useCallback((navigationState: WebViewNavigation) => {
    canGoBackRef.current = navigationState.canGoBack;
    currentUrlRef.current = navigationState.url;

    // 이 콜백은 로딩 시작 시점에도 불린다. 그때의 url 은 아직 리다이렉트 전이라
    // /login 으로 갈 요청도 홈으로 보여 로그인된 것으로 오판하게 된다.
    if (navigationState.loading) return;

    if (!isSurfOrigin(navigationState.url)) return;

    if (isLoginUrl(navigationState.url)) {
      pushRequestedRef.current = false;
      pushTokenRef.current = null;
      // 세션을 심는 중에는 /login 을 스쳐갈 수 있으므로 유지한다
      setStatus((previous) => (previous === 'authenticating' ? previous : 'signed-out'));
      return;
    }

    // 약관 열람(browsing)과 로그인 진행(authenticating)은 그대로 두고,
    // 나머지는 로그인된 것으로 본다. 캐시로 미리 signed-out 이 된 경우도 여기서 교정된다
    setStatus((previous) =>
      previous === 'browsing' || previous === 'authenticating' ? previous : 'signed-in',
    );
  }, []);

  const initScript = buildInitScript(insets);

  const handleLoadEnd = () => {
    // 첫 로드가 SURF 오리진에 도달하지 못해도(네트워크 실패, 외부 리다이렉트)
    // 스플래시에 갇히지 않도록 booting 을 풀어준다.
    // 무조건 signed-in 으로 두면 /login 에 있는데도 잠깐 로그인 상태가 되어
    // 푸시 토큰 발급이 먼저 돌아버리므로 URL 로 판정한다
    setStatus((previous) => {
      if (previous !== 'booting') return previous;

      const url = currentUrlRef.current;
      return isSurfOrigin(url) && !isLoginUrl(url) ? 'signed-in' : 'signed-out';
    });

    webViewRef.current?.injectJavaScript(initScript);

    const pushToken = pushTokenRef.current;
    if (pushToken !== null) {
      webViewRef.current?.injectJavaScript(buildPushTokenScript(pushToken, PUSH_PLATFORM));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: appBackground }]}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        originWhitelist={['https://*', 'http://*']}
        allowsBackForwardNavigationGestures
        startInLoadingState
        renderLoading={() => (
          <View style={[styles.loading, { backgroundColor: appBackground }]}>
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
        injectedJavaScriptBeforeContentLoaded={initScript}
        // SPA 라우팅 등으로 document가 교체돼도 클래스/변수가 유지되도록 재주입
        onLoadEnd={handleLoadEnd}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigationStateChange}
      />

      {(status === 'signed-out' || status === 'authenticating') && (
        <LoginOverlay
          pending={status === 'authenticating'}
          errorMessage={errorMessage}
          appleAvailable={appleAvailable}
          onKakaoPress={handleKakaoPress}
          onApplePress={handleApplePress}
          onLinkPress={handleLinkPress}
        />
      )}

      {!splashHidden && (
        <AnimatedSplash
          ready={animationFinished && status !== 'booting'}
          onAnimationFinish={() => setAnimationFinished(true)}
          onFadeOutEnd={() => setSplashHidden(true)}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
