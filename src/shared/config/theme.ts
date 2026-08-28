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

export const FONT_FAMILY = 'WantedSans';

/** --radius-4 */
export const RADIUS_4 = 8;

/** .text-title-title2 */
export const TITLE_2 = {
  fontFamily: FONT_FAMILY,
  fontWeight: '600',
  lineHeight: 22,
  fontSize: 16,
  letterSpacing: -0.17,
} as const;

/** .text-caption-caption4 */
export const CAPTION_4 = {
  fontFamily: FONT_FAMILY,
  fontWeight: '400',
  lineHeight: 14,
  fontSize: 12,
  letterSpacing: -0.17,
} as const;
