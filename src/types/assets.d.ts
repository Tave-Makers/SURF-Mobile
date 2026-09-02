// expo-env.d.ts 는 prebuild 가 다시 쓰므로 에셋 모듈 선언은 여기에 둔다.
declare module '*.ttf' {
  const asset: number;
  export default asset;
}

declare module '*.otf' {
  const asset: number;
  export default asset;
}
