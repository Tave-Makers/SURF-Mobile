# SURF Mobile

SURF Mobile은 TAVE 구성원을 위한 SURF 웹 서비스를 모바일 앱으로 제공하는 Expo 기반 React Native 프로젝트입니다.

앱의 메인 화면은 `react-native-webview`로 `https://www.tavesurf.site/`를 렌더링하고, 일부 네이티브 UI를 앱에서 오버레이합니다. 현재 하단 내비게이션은 WebView 경로가 `/`, `/mypage`일 때만 노출됩니다.

## 기술 스택

| 항목            | 버전/도구                 |
| --------------- | ------------------------- |
| Node.js         | `>=18`                    |
| pnpm            | `10.15.1`                 |
| Expo            | `~55.0.11`                |
| Expo Router     | `~55.0.10`                |
| React           | `19.2.0`                  |
| React Native    | `0.83.4`                  |
| TypeScript      | `5.9.2`                   |
| ESLint          | `9.39.2`                  |
| WebView         | `react-native-webview`    |
| SVG             | `react-native-svg`        |
| Package Manager | `pnpm` with Corepack 권장 |

## 시작하기

```bash
corepack enable
pnpm install
```

## 실행 명령어

이 프로젝트는 루트에서 바로 실행합니다.

```bash
pnpm dev
pnpm ios
pnpm android
pnpm web
```

| 명령어         | 설명                                        |
| -------------- | ------------------------------------------- |
| `pnpm dev`     | Expo 개발 서버 실행                         |
| `pnpm ios`     | iOS Simulator에 네이티브 앱 빌드 및 실행    |
| `pnpm android` | Android Emulator에 네이티브 앱 빌드 및 실행 |
| `pnpm web`     | Expo Web 실행                               |

## 검증 명령어

```bash
pnpm check-types
pnpm lint
pnpm format
```

| 명령어             | 설명                 |
| ------------------ | -------------------- |
| `pnpm check-types` | TypeScript 타입 체크 |
| `pnpm lint`        | ESLint 검사          |
| `pnpm format`      | Prettier 포맷 적용   |

## 환경변수

WebView 기본 URL은 `https://www.tavesurf.site/`입니다. 다른 웹 서버를 바라보게 하려면 Expo public 환경변수로 지정합니다.

```bash
EXPO_PUBLIC_WEB_URL=https://example.com pnpm ios
```

개발 서버를 사용할 때는 로컬 네트워크에서 시뮬레이터/에뮬레이터가 접근 가능한 주소를 사용해야 합니다.

## 프로젝트 구조

```txt
src/
├── app/
│   ├── _layout.tsx      # 앱 공통 레이아웃, 폰트, StatusBar 설정
│   └── index.tsx        # WebView 기반 메인 화면
├── widgets/
│   └── bottom-navigation/
│       ├── index.ts     # public API
│       ├── model/       # 타입, 상태, 순수 로직
│       └── ui/          # 위젯 UI 컴포넌트
└── shared/
    └── ui/              # 앱 전역에서 재사용되는 primitive UI

assets/
├── fonts/               # Pretendard 폰트
└── images/              # 앱 아이콘, 스플래시 등 이미지

docs/
├── code-convention.md
└── component-patterns.md
```

## 개발 규칙

- 코드 컨벤션은 [docs/code-convention.md](docs/code-convention.md)를 따릅니다.
- 에이전트 작업 지침은 [AGENTS.md](AGENTS.md)를 기준으로 합니다.
- 프로젝트 구조는 Feature-Sliced Design(FSD)을 따릅니다.
- 앱 텍스트는 Pretendard 폰트를 사용합니다.
- 스타일은 `StyleSheet.create`와 React Native style object를 사용합니다.
- 단순 계산이나 이벤트 핸들러에는 불필요한 `useMemo`, `useCallback`을 추가하지 않습니다.
- SafeArea, StatusBar, 하단 네이티브 UI는 라이트/다크 모드를 함께 고려합니다.

## 배포 메타데이터

스토어 등록용 메타데이터는 [store.config.json](store.config.json)에 정리되어 있습니다.
