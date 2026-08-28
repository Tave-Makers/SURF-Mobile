# SURF Mobile

### 환경

- 작성 기준 Node.js : `20.19.4`
- pnpm : `10.15.1`
- 패키지 매니저 관리 방식 : `Corepack`
- 앱/도구 버전
  - Expo : `~55.0.11`
  - Expo Router : `~55.0.10`
  - React : `19.2.0`
  - React Native : `0.83.4`
  - TypeScript : `5.9.2`
  - ESLint : `9.39.2`
  - Husky : `9.1.7`
  - lint-staged : `16.1.6`
  - Turborepo : `2.7.3`

### 실행 명령어

루트에서 실행

```bash
pnpm install
pnpm dev:mobile
pnpm android:mobile
pnpm ios:mobile
pnpm web:mobile
pnpm lint:mobile
pnpm check-types:mobile
```

`apps/mobile` 내부에서 직접 실행

```bash
pnpm dev
pnpm android
pnpm ios
pnpm web
pnpm lint
pnpm check-types
```

### 네이티브 로그인 & 푸시 알림

앱은 WebView 셸이지만 로그인과 FCM은 네이티브에서 처리한다.

**동작 구조**

세션의 주인은 **WebView 쿠키**다. 네이티브는 SURF JWT를 직접 보관하지 않는다.

1. WebView가 `WEB_URL`을 로드한다. 웹 미들웨어가 `/login`으로 돌려보내면 네이티브 로그인 오버레이를 띄운다.
2. 카카오/애플 네이티브 SDK로 로그인해서 SDK 토큰을 받는다.
3. 그 토큰을 WebView 안에서 `POST /api/app-session`으로 보낸다. 웹이 백엔드 `/login/{kakao|apple}/app`으로 교환하고 `accessToken`·`refreshToken` 쿠키를 심는다.
4. `/login/callback`으로 이동하면 이후 온보딩·토큰 재발급·로그아웃은 전부 기존 웹 흐름 그대로 동작한다.
5. 로그인 후 네이티브가 FCM 토큰을 받아 WebView에 주입하고, 웹이 인증된 프록시로 `POST /v1/user/notifications/device-tokens`에 `IOS`/`ANDROID`로 등록한다.

**설정이 필요한 항목**

- `app.json` → `@react-native-kakao/core` 플러그인의 `nativeAppKey`를 카카오 디벨로퍼스의 **네이티브 앱 키**로 교체해야 한다. (현재 `KAKAO_NATIVE_APP_KEY_HERE` placeholder)
- 카카오 디벨로퍼스에 iOS 번들 ID `com.tavemakers.surf`, Android 패키지 `site.tavesurf.mobile` + 키 해시를 등록한다. 키 해시는 앱 실행 중 `getKeyHashAndroid()`로 확인할 수 있다.
- Apple Developer에서 App ID에 **Sign in with Apple**과 **Push Notifications** capability를 켠다.
- Firebase 콘솔에 **APNs 인증 키**를 업로드한다. 이게 없으면 iOS 푸시가 발송되지 않는다.
  `certs/AuthKey_9W2SMH3ZD2.p8` 이 APNs 키인지 Sign in with Apple 키인지는 파일만으로 구분되지 않으므로,
  Apple Developer → Keys 에서 해당 Key ID 의 활성화된 서비스를 먼저 확인한다.
- 네이티브 설정이 바뀌었으므로 다음 빌드 전에 `npx expo prebuild`로 `ios/`·`android/`를 재생성해야 한다.
