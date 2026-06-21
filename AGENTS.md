# Agent Instructions

이 저장소에서 작업할 때는 [React Native Code Convention](docs/code-convention.md)을 우선 확인하고 따른다.

핵심 기준:

- Expo Router 기반 React Native 프로젝트로 취급한다.
- 프로젝트 구조는 Feature-Sliced Design(FSD)을 따르고, slice 외부에서는 `index.ts` public API를 통해 import한다.
- 웹/Next.js/Tailwind 전용 패턴을 도입하지 않는다.
- 컴포넌트는 named export를 기본으로 사용하고, `src/app/**` route 파일만 default export를 허용한다.
- 스타일은 `StyleSheet.create`와 React Native style object를 사용한다.
- SafeArea, StatusBar, 하단 네이티브 UI는 라이트/다크 모드를 함께 고려한다.
- 단순한 계산과 이벤트 핸들러에 불필요한 `useMemo`, `useCallback`을 추가하지 않는다.
- 변경 후 가능한 경우 `pnpm check-types`와 `pnpm lint`를 실행한다.
