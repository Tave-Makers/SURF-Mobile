import { initializeKakaoSDK } from '@react-native-kakao/core';
import { login as kakaoSdkLogin, logout as kakaoSdkLogout } from '@react-native-kakao/user';

import { isKakaoConfigured, KAKAO_NATIVE_APP_KEY } from '@/shared/config/env';

let initialization: Promise<void> | null = null;

const ensureInitialized = () => {
  if (initialization) return initialization;

  if (!isKakaoConfigured() || KAKAO_NATIVE_APP_KEY === null) {
    return Promise.reject(
      new Error('app.json 의 @react-native-kakao/core 플러그인에 실제 nativeAppKey를 넣어주세요.'),
    );
  }

  initialization = initializeKakaoSDK(KAKAO_NATIVE_APP_KEY).catch((error: unknown) => {
    // 실패한 초기화를 캐시하면 다시는 로그인할 수 없다
    initialization = null;
    throw error;
  });

  return initialization;
};

/** 카카오 SDK 로그인 후 서버 검증에 쓸 카카오 AccessToken을 돌려준다. */
export const signInWithKakao = async () => {
  await ensureInitialized();

  const token = await kakaoSdkLogin();
  return token.accessToken;
};

/** 서버 로그인에 실패했을 때 카카오 쪽 세션만 남지 않도록 정리한다. */
export const signOutFromKakao = async () => {
  if (!initialization) return;

  try {
    await kakaoSdkLogout();
  } catch {
    // 이미 로그아웃 상태면 무시한다
  }
};
