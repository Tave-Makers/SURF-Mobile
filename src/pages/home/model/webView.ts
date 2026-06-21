import { type BottomNavigationPath } from '@/widgets/bottom-navigation';

const DEFAULT_WEB_URL = 'https://www.tavesurf.site/';
const BOTTOM_NAVIGATION_PATHS = new Set<BottomNavigationPath>(['/', '/mypage']);

/** Expo public 환경변수가 있으면 사용하고, 없으면 운영 WebView URL로 fallback합니다. */
const getWebUrl = () => {
  const envWebUrl: unknown = process.env.EXPO_PUBLIC_WEB_URL;

  return typeof envWebUrl === 'string' && envWebUrl.length > 0 ? envWebUrl : DEFAULT_WEB_URL;
};

/** Home WebView가 처음 로드할 기준 URL입니다. */
export const WEB_URL = getWebUrl();

/** BottomNavigation path를 현재 WebView base URL 기준의 절대 URL로 변환합니다. */
export const buildWebUrl = (path: BottomNavigationPath) => {
  return new URL(path, WEB_URL).toString();
};

/** WebView navigation URL에서 route path만 추출하고 trailing slash를 정규화합니다. */
export const getPathFromUrl = (url: string): string => {
  try {
    const { pathname } = new URL(url);
    return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  } catch {
    return '/';
  }
};

/** 현재 path가 native bottom navigation을 노출해야 하는 path인지 판별합니다. */
export const isBottomNavigationPath = (path: string): path is BottomNavigationPath => {
  return BOTTOM_NAVIGATION_PATHS.has(path as BottomNavigationPath);
};
