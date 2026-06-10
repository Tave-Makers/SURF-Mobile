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


