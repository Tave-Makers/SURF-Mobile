import Constants from 'expo-constants';

const DEFAULT_WEB_URL = 'https://www.tavesurf.site';

const readStringEnv = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.length > 0 ? value : fallback;

/** WebView가 로드하는 SURF 웹 오리진. 세션 쿠키의 주인이기도 하다. */
export const WEB_URL = readStringEnv(process.env.EXPO_PUBLIC_WEB_URL, DEFAULT_WEB_URL).replace(
  /\/+$/,
  '',
);

/**
 * 카카오 네이티브 앱 키.
 * app.json 의 @react-native-kakao/core 플러그인 설정과 값을 공유해서
 * 네이티브(URL scheme)와 JS(SDK 초기화)가 어긋나지 않게 한다.
 */
export const KAKAO_NATIVE_APP_KEY = (() => {
  const plugins = Constants.expoConfig?.plugins ?? [];

  for (const plugin of plugins) {
    if (!Array.isArray(plugin) || plugin[0] !== '@react-native-kakao/core') continue;

    const config: unknown = plugin[1];
    if (typeof config === 'object' && config !== null && 'nativeAppKey' in config) {
      const key = (config as { nativeAppKey?: unknown }).nativeAppKey;
      if (typeof key === 'string' && key.length > 0) return key;
    }
  }

  return null;
})();

export const PLACEHOLDER_KAKAO_KEY = 'KAKAO_NATIVE_APP_KEY_HERE';

export const isKakaoConfigured = () =>
  KAKAO_NATIVE_APP_KEY !== null && KAKAO_NATIVE_APP_KEY !== PLACEHOLDER_KAKAO_KEY;
