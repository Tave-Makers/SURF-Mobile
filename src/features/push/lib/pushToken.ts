import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

/** 서버 device-tokens API 의 platform 값. */
export type PushPlatform = 'IOS' | 'ANDROID';

export const PUSH_PLATFORM: PushPlatform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';

/*
 * requestPermission / AuthorizationStatus 는 RNFirebase v26에서 deprecated 표시가 붙어 있고
 * expo-notifications 또는 react-native-permissions 사용을 권장한다.
 * 그럼에도 여기서 계속 쓰는 이유:
 *   - expo-notifications 는 Android에서 자체 FirebaseMessagingService 를 등록해
 *     FCM 메시지를 가로챈다. 그러면 onTokenRefresh 가 더 이상 호출되지 않아
 *     토큰 갱신 시 서버 재등록이 끊긴다.
 *   - react-native-permissions 는 네이티브 의존성이 하나 더 늘고 prebuild 재생성이 필요하다.
 * 실제 제거는 RNFirebase 다음 메이저에서 예정돼 있으므로 그때 함께 옮긴다.
 */
const GRANTED_STATUSES: number[] = [
  AuthorizationStatus.AUTHORIZED,
  AuthorizationStatus.PROVISIONAL,
];

/**
 * 푸시 권한을 요청한다.
 * Android 13+ 의 POST_NOTIFICATIONS 런타임 권한도 이 호출이 처리한다.
 */
export const requestPushPermission = async () => {
  const status = await requestPermission(getMessaging());
  return GRANTED_STATUSES.includes(status);
};

/** 권한이 있으면 FCM 등록 토큰을 돌려준다. 없으면 null. */
export const getPushToken = async () => {
  const granted = await requestPushPermission();
  if (!granted) return null;

  const messaging = getMessaging();

  try {
    // iOS는 APNs 등록이 끝나야 FCM 토큰이 나온다.
    // 시뮬레이터에는 APNs 가 없어 여기서 timeout 이 난다 — 실패해도 앱은 계속 동작해야 한다.
    if (Platform.OS === 'ios') {
      await registerDeviceForRemoteMessages(messaging);
    }

    return await getToken(messaging);
  } catch (error) {
    console.warn('[push] FCM 토큰 발급 실패', error);
    return null;
  }
};

/** 토큰이 갱신되면 콜백을 부른다. 서버 재등록에 사용한다. */
export const subscribeToTokenRefresh = (listener: (token: string) => void) =>
  onTokenRefresh(getMessaging(), listener);
