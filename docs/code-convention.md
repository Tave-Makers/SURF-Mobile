# React Native Code Convention

본 문서는 SURF Mobile 앱의 브랜치, 커밋, 코드 스타일, 컴포넌트 작성 규칙을 정의합니다.
현재 프로젝트는 Expo Router 기반 React Native 앱이며, WebView로 웹 서비스를 렌더링하고 일부 네이티브 UI를 오버레이합니다.

---

## 브랜치 컨벤션

기본 규칙: `타입/작업-내용`

| 타입        | 설명                     | 예시                         |
| ----------- | ------------------------ | ---------------------------- |
| `feat/`     | 새로운 기능 개발         | `feat/bottom-navigation`     |
| `fix/`      | 버그 수정                | `fix/safe-area-dark-mode`    |
| `hotfix/`   | 운영 중 긴급 버그 수정   | `hotfix/webview-login-crash` |
| `refactor/` | 동작 변경 없는 구조 개선 | `refactor/navigation-icons`  |
| `ui/`       | UI, 스타일, 에셋 작업    | `ui/bottom-tab-design`       |
| `docs/`     | 문서 작업                | `docs/code-convention`       |
| `chore/`    | 빌드, 설정, 의존성 작업  | `chore/update-expo-config`   |
| `test/`     | 테스트 코드 추가/수정    | `test/webview-navigation`    |
| `release/`  | 배포 준비 브랜치         | `release/v1.0.0`             |

---

## 커밋 컨벤션

기본 규칙: `타입: 작업 내용 (#이슈번호 선택)`

```bash
feat: 하단 내비게이션 추가 (#39)
```

| 타입       | 설명                    | 예시                                   |
| ---------- | ----------------------- | -------------------------------------- |
| `feat`     | 새로운 기능 추가        | `feat: 홈/마이페이지 네이티브 탭 추가` |
| `fix`      | 버그 수정               | `fix: 다크모드 safe area 배경 수정`    |
| `refactor` | 리팩토링                | `refactor: 아이콘 컴포넌트 분리`       |
| `style`    | UI/스타일 변경          | `style: 바텀 내비 색상 조정`           |
| `format`   | 포맷팅만 적용           | `format: prettier 적용`                |
| `docs`     | 문서 작업               | `docs: iOS 실행 방법 추가`             |
| `chore`    | 환경 설정/빌드/의존성   | `chore: react-native-svg 추가`         |
| `add`      | 신규 파일/에셋 추가     | `add: Pretendard 폰트 추가`            |
| `del`      | 불필요한 코드/파일 제거 | `del: legacy icon wrapper 제거`        |
| `test`     | 테스트 코드 추가/수정   | `test: route parsing 유닛 테스트 추가` |

---

## 프로젝트 구조

프로젝트는 Feature-Sliced Design(FSD)을 따른다. 현재 앱은 작으므로 필요한 레이어부터 점진적으로 사용하되, 새 코드는 아래 레이어 경계를 기준으로 배치한다.

```txt
src/
├── app/
│   ├── _layout.tsx      # 앱 공통 Provider, font, status bar, router shell
│   └── index.tsx        # Expo Router route, WebView 기반 메인 화면
├── pages/               # 화면 단위 조합이 route 밖에 필요할 때 사용
├── widgets/             # 화면에 배치되는 독립적인 UI 블록
│   └── bottom-navigation/
│       ├── index.ts     # public API
│       ├── model/       # 타입, 상태, 순수 로직
│       └── ui/          # 위젯 UI 컴포넌트
├── features/            # 사용자 행동 단위 기능
├── entities/            # 도메인 모델
└── shared/
    └── ui/              # 앱 전역에서 재사용되는 primitive UI
```

- Expo Router의 route 파일은 `src/app/**` 아래에 둔다.
- 화면에 직접 배치되는 조합형 UI는 `src/widgets/**`에 둔다.
- 여러 레이어에서 재사용되는 primitive UI와 아이콘은 `src/shared/ui/**`에 둔다.
- 특정 slice 내부에서만 쓰는 컴포넌트는 해당 slice의 `ui/**` 아래에 둔다.
- 외부 레이어에서는 slice 내부 파일을 직접 import하지 말고 `index.ts` public API를 통해 import한다.
- 에셋은 `assets/**` 아래에 둔다. 폰트는 `assets/fonts/**`를 사용한다.
- 타입 선언은 루트 `*.d.ts` 또는 `src/**/*.d.ts`에 둔다. 에셋 import 타입처럼 전역 선언이 필요한 경우 루트에 둬도 된다.

---

## 네이밍 컨벤션

| 케이스             | 적용 대상                     | 예시                                       |
| ------------------ | ----------------------------- | ------------------------------------------ |
| `camelCase`        | 함수, 변수, 훅, 이벤트 핸들러 | `getPathFromUrl`, `handleNavigate`         |
| `PascalCase`       | 컴포넌트, 타입, 인터페이스    | `BottomNavigation`, `BottomNavigationPath` |
| `UPPER_SNAKE_CASE` | 모듈 상수, 환경변수           | `DEFAULT_WEB_URL`, `EXPO_PUBLIC_WEB_URL`   |
| `kebab-case`       | 문서/일반 파일명              | `code-convention.md`                       |
| `PascalCase.tsx`   | React 컴포넌트 파일           | `HomeIcon.tsx`, `BottomNavigation.tsx`     |

- 컴포넌트 파일명은 export 컴포넌트명과 맞춘다.
- 훅 파일명은 `use`로 시작한다: `useWebViewNavigation.ts`.
- URL path 타입처럼 값의 범위가 작은 경우 union type을 우선 사용한다.

---

## Export / Import

### Export

컴포넌트와 유틸은 기본적으로 named export를 사용한다.

```tsx
// Good
export const BottomNavigation = () => {
  return null;
};
```

Expo Router route 파일은 프레임워크 요구사항에 맞춰 default export를 허용한다.

```tsx
// src/app/index.tsx
const HomeScreen = () => {
  return null;
};

export default HomeScreen;
```

### Import 순서

ESLint import/order 규칙을 따른다.

1. React/React Native/Expo 등 외부 라이브러리
2. 상대경로 import (`../...`, `./...`)
3. alias import (`@/...`)
4. 타입 import는 가능한 한 `type` 키워드를 사용한다.

```tsx
import { useEffect } from 'react';
import { View, type ColorValue } from 'react-native';

import { HomeIcon } from './HomeIcon';

import { BottomNavigation } from '@/widgets/bottom-navigation';
```

---

## React Native 컴포넌트 규칙

- DOM 태그를 사용하지 않는다. `div`, `button`, `span`, `form` 대신 `View`, `Pressable`, `Text` 등을 사용한다.
- CSS/Tailwind/className 대신 `StyleSheet.create`와 React Native style object를 사용한다.
- 터치 가능한 UI는 `Pressable`을 기본으로 사용하고 `accessibilityRole`, `accessibilityLabel`, `accessibilityState`를 함께 고려한다.
- SVG 아이콘은 `react-native-svg` 기반 컴포넌트로 만든다.
- 네이티브 컴포넌트 props에는 웹 전용 props를 넣지 않는다. 예: `onClick`, `className`, `href`.
- 컴포넌트 props는 같은 파일 안에서 `interface Props`로 선언한다. 외부에서 재사용해야 하는 도메인 타입만 별도 이름을 붙여 export한다.
- 조건부 스타일은 배열 문법을 사용한다.

```tsx
interface Props {
  label: string;
}

<Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>;
```

### 파일 구성 순서

컴포넌트 파일은 읽는 사람이 공개 API를 먼저 볼 수 있도록 아래 순서를 따른다.

1. import
2. export type, 내부 type
3. export component
4. 내부 component
5. 상수, 유틸 함수
6. `styles`

상수와 유틸 함수는 컴포넌트보다 아래에 둔다. 단, 모듈 초기화 시점에 즉시 실행되어야 하거나 외부 export가 필요한 값은 예외적으로 위에 둘 수 있다.

---

## 스타일 규칙

### StyleSheet

- 컴포넌트 하단에 `const styles = StyleSheet.create(...)`를 둔다.
- 반복되는 디자인 값은 컴포넌트 하단, `styles` 위의 상수로 분리한다.
- 숫자 단위는 React Native 기본 dp를 사용한다.
- 색상은 의미 있는 이름의 상수로 분리한다.

```tsx
const ACTIVE_LABEL_COLOR = '#2D54C8';

const styles = StyleSheet.create({
  label: {
    color: ACTIVE_LABEL_COLOR,
    fontSize: 11,
  },
});
```

### 다크모드

- 시스템 테마 대응은 `useColorScheme()`을 사용한다.
- safe area, screen background, overlay/navigation background를 같이 대응한다.
- WebView 자체 콘텐츠의 다크모드는 웹 서비스가 담당한다. 네이티브 영역만 앱에서 보정한다.

```tsx
const isDarkMode = useColorScheme() === 'dark';
const backgroundColor = isDarkMode ? '#0F1117' : '#ffffff';

<SafeAreaView style={[styles.safeArea, { backgroundColor }]} />;
```

### Safe Area

- 화면 root는 `react-native-safe-area-context`의 `SafeAreaView`를 사용한다.
- SafeArea 배경색은 화면 배경색과 같은 토큰으로 지정한다.
- 하단 고정 UI를 추가할 때는 홈 인디케이터 영역과 겹치지 않는지 iOS/Android 모두 확인한다.

### 폰트

- 앱 텍스트는 Pretendard를 기본으로 한다.
- 폰트 파일은 `assets/fonts/**`에 둔다.
- `_layout.tsx`에서 `expo-font`의 `useFonts`로 로드한다.
- `fontWeight`에 의존하지 말고 필요한 weight는 별도 family로 등록해 사용한다.

```tsx
fontFamily: 'Pretendard-SemiBold';
```

---

## WebView 규칙

- 기본 URL은 `EXPO_PUBLIC_WEB_URL`로 오버라이드 가능하게 둔다.
- URL 조합은 문자열 더하기 대신 `new URL(path, baseUrl)`을 사용한다.
- 현재 WebView 경로는 URL parser로 파싱하고, trailing slash 처리를 명시한다.
- 하드웨어 뒤로가기는 Android에서만 의미가 크므로 `BackHandler` cleanup을 반드시 둔다.
- WebView 내부 라우팅과 네이티브 오버레이가 중복되지 않는지 확인한다.

```ts
const buildWebUrl = (path: BottomNavigationPath) => {
  return new URL(path, WEB_URL).toString();
};
```

---

## Hook / 로직 분리

작은 화면에서는 단순함을 우선한다. `useMemo`, `useCallback`은 기본으로 쓰지 않는다.

### 분리 기준

다음 중 하나라도 해당하면 커스텀 훅으로 분리한다.

- `useState` 또는 `useRef`가 많아져 화면 JSX보다 로직이 더 길어지는 경우
- `useEffect`에서 구독, 이벤트 리스너, 타이머 등 cleanup이 필요한 부수효과가 여러 개 있는 경우
- WebView navigation, auth bridge, push permission처럼 다른 화면에서도 재사용될 가능성이 있는 경우
- 플랫폼 분기 또는 권한 처리가 들어가는 경우

### 메모이제이션 기준

- `useMemo`, `useCallback`은 성능 문제가 확인되었거나 참조 안정성이 실제로 필요한 경우에만 사용한다.
- 단순 계산, 단순 이벤트 핸들러에는 사용하지 않는다.
- memoization을 추가한다면 의도를 코드 구조에서 드러내고 의존성 배열을 정확히 유지한다.

---

## 타입 규칙

- `any`는 사용하지 않는다. 외부 입력은 `unknown`으로 받은 뒤 좁힌다.
- React Native style prop은 `StyleProp<ViewStyle>`처럼 RN 제공 타입을 사용한다.
- icon/color props는 `ColorValue`를 사용한다.
- route path처럼 허용 값이 정해진 값은 union type으로 표현한다.

```ts
export type BottomNavigationPath = '/' | '/mypage';
```

---

## 에셋 / 아이콘

- bitmap 이미지는 `assets/images/**`, 앱 아이콘은 `assets/icons/**`, 폰트는 `assets/fonts/**`에 둔다.
- SVG path 기반 아이콘은 `react-native-svg` 컴포넌트로 만든다.
- 아이콘 컴포넌트는 개별 파일로 분리한다: `HomeIcon.tsx`, `MyIcon.tsx`.
- 여러 아이콘을 문자열 name으로 받는 래퍼는 필요한 경우에만 만든다. 현재처럼 아이콘 수가 적으면 개별 컴포넌트를 직접 import한다.

---

## 에러 처리 / 로깅

- 사용자에게 보여줄 에러와 개발자용 로그를 구분한다.
- WebView 로딩 실패, 권한 실패, native bridge 실패처럼 사용자 행동이 필요한 에러는 UI 상태로 표현한다.
- 단순 rethrow만 하는 catch는 작성하지 않는다.
- `console.warn`/`console.error`는 런타임에서 실제 진단 가치가 있을 때만 사용한다.

---

## 실행 / 검증

변경 후 최소한 아래 명령을 확인한다.

```bash
pnpm check-types
pnpm lint
```

네이티브 모듈이나 iOS/Android 설정이 바뀐 경우에는 앱을 재빌드한다.

```bash
pnpm ios
pnpm android
```

검증 시 확인할 항목:

- iOS Simulator와 Android Emulator에서 앱이 빌드/실행되는지
- WebView가 정상 로드되는지
- SafeArea, StatusBar, 하단 네비게이션이 라이트/다크 모드에서 깨지지 않는지
- iOS 홈 인디케이터, Android navigation bar와 네이티브 UI가 겹치지 않는지

---

본 규칙은 현재 모바일 앱 구조를 기준으로 하며, 앱 구조가 커지면 실제 코드 패턴에 맞춰 갱신합니다.
