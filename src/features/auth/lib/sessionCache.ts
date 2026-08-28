import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'surf.lastSessionState';

export type CachedSessionState = 'signed-in' | 'signed-out';

/**
 * 마지막으로 확인된 로그인 여부를 기기에 남긴다.
 *
 * 세션의 진짜 주인은 WebView 쿠키이고 그 판별은 웹 페이지가 로드돼야 끝난다.
 * 그때까지 스플래시를 붙잡아 두면 로그아웃 상태에서도 웹 로딩을 기다리게 되는데,
 * 어차피 그 화면은 네이티브 로그인 오버레이가 덮을 것이라 전부 낭비다.
 * 지난 상태를 미리 알면 스플래시 직후에 곧바로 로그인 화면을 띄울 수 있고,
 * 예측이 틀렸더라도 WebView 가 로드되는 순간 실제 상태로 교정된다.
 */
export const readCachedSessionState = async (): Promise<CachedSessionState | null> => {
  try {
    const value = await AsyncStorage.getItem(KEY);
    return value === 'signed-in' || value === 'signed-out' ? value : null;
  } catch {
    return null;
  }
};

export const writeCachedSessionState = async (value: CachedSessionState) => {
  try {
    await AsyncStorage.setItem(KEY, value);
  } catch {
    // 캐시는 최적화일 뿐이라 실패해도 흐름에 영향을 주지 않는다
  }
};
