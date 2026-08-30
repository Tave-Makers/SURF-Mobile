/**
 * packages/ui/styles 의 토큰을 그대로 옮긴 값.
 * 로그인 화면이 웹과 같아야 해서 임의로 고르지 않는다.
 */
export const COLOR_TOKENS = {
  light: {
    backgroundNormal: '#ffffff',
    backgroundNormalInverse: '#12141c',
    foregroundNormalReverse: '#f4f6f8',
    foregroundStaticBlack: '#12141c',
    foregroundTertiary: '#9da6be',
  },
  dark: {
    backgroundNormal: '#12141c',
    backgroundNormalInverse: '#ffffff',
    foregroundNormalReverse: '#191b24',
    foregroundStaticBlack: '#12141c',
    foregroundTertiary: '#9da6be',
  },
} as const;

/**
 * RN iOS 는 가변 폰트의 wght 축을 고르지 못해 기본 인스턴스(400)만 등록한다.
 * 그래서 가변 폰트 대신 굵기별 정적 서체를 번들하고 fontFamily 로 굵기를 고른다.
 * fontWeight 를 함께 주는 건 폰트에 없는 글리프가 시스템 폰트로 폴백될 때
 * 굵기까지 따라가게 하기 위한 안전장치다.
 */
export const FONT_FAMILY = {
  regular: 'WantedSans-Regular',
  semiBold: 'WantedSans-SemiBold',
} as const;

/**
 * packages/ui/styles/scheme-tokens.css 의 --spacing-* 스케일.
 * Tailwind 기본(4px 배수)이 아니라 convert-scheme.ts 가 생성한 커스텀 값이므로
 * px-15 를 60px 처럼 환산하면 안 된다.
 */
export const SPACING = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 8,
  9: 9,
  10: 10,
  11: 12,
  12: 14,
  13: 16,
  14: 18,
  15: 20,
  16: 24,
  17: 28,
  18: 32,
  19: 40,
  20: 48,
} as const;

/** --radius-4 */
export const RADIUS_4 = 8;

/** .text-title-title2 */
export const TITLE_2 = {
  fontFamily: FONT_FAMILY.semiBold,
  fontWeight: '600',
  lineHeight: 22,
  fontSize: 16,
  letterSpacing: -0.17,
} as const;

/** .text-caption-caption4 */
export const CAPTION_4 = {
  fontFamily: FONT_FAMILY.regular,
  fontWeight: '400',
  lineHeight: 14,
  fontSize: 12,
  letterSpacing: -0.17,
} as const;
