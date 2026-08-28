import { Platform } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

import type { PushPlatform } from '@/features/push/lib/pushToken';

/** 네이티브 SDK 로그인 결과. 웹의 /api/app-session 이 서버 검증까지 대신 한다. */
export type AppSessionPayload =
  | { provider: 'kakao'; accessToken: string }
  | {
      provider: 'apple';
      identityToken: string;
      nonce: string;
      authorizationCode: string;
      name: string;
    };

/** WebView -> 네이티브 메시지. */
export type BridgeMessage =
  { type: 'SESSION_RESULT'; ok: boolean; message?: string } | { type: 'LOGGED_OUT' };

/**
 * 주입 스크립트에 값을 안전하게 박아 넣는다.
 * JSON.stringify 는 U+2028/U+2029 를 이스케이프하지 않아서 JS 문법을 깨뜨릴 수 있다.
 */
const toJsLiteral = (value: unknown) =>
  JSON.stringify(value)
    .replace(/\u2028/gu, '\\u2028')
    .replace(/\u2029/gu, '\\u2029');

export const parseBridgeMessage = (raw: string): BridgeMessage | null => {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const type = (parsed as { type?: unknown }).type;
    if (type !== 'SESSION_RESULT' && type !== 'LOGGED_OUT') return null;

    return parsed as BridgeMessage;
  } catch {
    return null;
  }
};

/**
 * 네이티브 앱 WebView에서만 .is-native-app 클래스와 safe area CSS 변수를 주입한다.
 * 일반 웹 브라우저에는 이 코드가 실행되지 않으므로 웹 레이아웃은 전혀 영향받지 않는다.
 */
export const buildInitScript = (insets: EdgeInsets) => `
  (function () {
    var root = document.documentElement;
    root.classList.add('is-native-app');
    root.style.setProperty('--sat', '${insets.top}px');
    root.style.setProperty('--sar', '${insets.right}px');
    root.style.setProperty('--sab', '${insets.bottom}px');
    root.style.setProperty('--sal', '${insets.left}px');
    window.__SURF_NATIVE__ = { platform: ${toJsLiteral(Platform.OS)} };
  })();
  true;
`;

/**
 * 네이티브 로그인 결과를 웹 세션(쿠키)으로 교환한다.
 * fetch 를 WebView 안에서 돌려야 응답의 Set-Cookie 가 WebView 쿠키 저장소에 들어간다.
 */
export const buildSessionScript = (payload: AppSessionPayload) => `
  (function () {
    var post = function (message) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
      }
    };

    fetch('/api/app-session', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Surf-Client': 'APP',
      },
      body: JSON.stringify(${toJsLiteral(payload)}),
    })
      .then(function (res) {
        return res
          .json()
          .catch(function () {
            return {};
          })
          .then(function (body) {
            return { ok: res.ok, body: body };
          });
      })
      .then(function (result) {
        post({
          type: 'SESSION_RESULT',
          ok: result.ok,
          message: result.body && result.body.message,
        });

        if (result.ok) {
          window.location.replace('/login/callback');
        }
      })
      .catch(function (error) {
        post({ type: 'SESSION_RESULT', ok: false, message: String(error) });
      });
  })();
  true;
`;

/**
 * 네이티브에서 받은 FCM 토큰을 웹에 넘긴다.
 * 웹은 이미 로그인된 axios 인스턴스로 device-tokens 등록을 하므로
 * 네이티브가 SURF JWT 를 직접 들고 있을 필요가 없다.
 */
export const buildPushTokenScript = (token: string, platform: PushPlatform) => `
  (function () {
    window.__SURF_NATIVE_PUSH__ = { token: ${toJsLiteral(token)}, platform: ${toJsLiteral(platform)} };
    window.dispatchEvent(new Event('surf:native-push'));
  })();
  true;
`;
