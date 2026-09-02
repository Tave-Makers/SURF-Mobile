import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { CAPTION_4, COLOR_TOKENS, RADIUS_4, SPACING, TITLE_2 } from '@/shared/config/theme';
import { AppleIcon, KakaoIcon, SurfLogo } from '@/shared/ui/BrandIcons';

/**
 * 웹 /login (apps/web/src/app-pages/login/ui/LoginPage.tsx) 을 그대로 옮긴 화면.
 * 앱은 이 오버레이가 WebView 를 덮으므로, 여기서 웹과 달라지면 그대로 앱의 첫 화면이
 * 웹과 달라진다. 구조·간격·색·타이포는 전부 웹 마크업과 packages/ui 토큰을 따른다.
 */

const POLICY_LINKS = [
  { path: '/terms-of-service', label: '서비스 이용약관' },
  { path: '/privacy-policy', label: '개인정보 처리방침' },
  { path: '/operational-policy', label: '운영정책' },
] as const;

const SUPPORT_LINK = { path: '/support', label: '문의' } as const;

type LoginOverlayProps = {
  pending: boolean;
  appleAvailable: boolean;
  onKakaoPress: () => void;
  onApplePress: () => void;
  onLinkPress: (path: string) => void;
};

export const LoginOverlay = ({
  pending,
  appleAvailable,
  onKakaoPress,
  onApplePress,
  onLinkPress,
}: LoginOverlayProps) => {
  const scheme = useColorScheme();
  const c = COLOR_TOKENS[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.container, { backgroundColor: c.backgroundNormal }]}>
      <SurfLogo />

      <View style={styles.stack}>
        <Pressable
          accessibilityRole="button"
          disabled={pending}
          onPress={onKakaoPress}
          style={({ pressed }) => [styles.button, styles.kakao, pressed && styles.pressed]}
        >
          <KakaoIcon />
          <Text style={[styles.buttonLabel, { color: c.foregroundStaticBlack }]}>
            카카오로 로그인하기
          </Text>
        </Pressable>

        {appleAvailable && (
          <Pressable
            accessibilityRole="button"
            disabled={pending}
            onPress={onApplePress}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: c.backgroundNormalInverse },
              pressed && styles.pressed,
            ]}
          >
            <AppleIcon color={c.foregroundNormalReverse} />
            <Text style={[styles.buttonLabel, { color: c.foregroundNormalReverse }]}>
              애플로 로그인하기
            </Text>
          </Pressable>
        )}

        <View accessibilityLabel="서비스 정책 및 문의" style={styles.nav}>
          <View style={styles.policyRow}>
            {POLICY_LINKS.map(({ path, label }, index) => (
              <Fragment key={path}>
                {index > 0 && (
                  <Text
                    accessibilityElementsHidden
                    style={[styles.caption, { color: c.foregroundTertiary }]}
                  >
                    |
                  </Text>
                )}
                <Text
                  accessibilityRole="link"
                  onPress={() => onLinkPress(path)}
                  style={[styles.caption, { color: c.foregroundTertiary }]}
                >
                  {label}
                </Text>
              </Fragment>
            ))}
          </View>

          <Text
            accessibilityRole="link"
            onPress={() => onLinkPress(SUPPORT_LINK.path)}
            style={[styles.caption, { color: c.foregroundTertiary }]}
          >
            {SUPPORT_LINK.label}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // h-dvh w-dvw flex-col items-center gap-[6.75rem] px-15 pt-[16.81rem]
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    gap: 108,
    paddingHorizontal: SPACING[15],
    paddingTop: 268.96,
  },
  // w-full flex-col items-center gap-[1.25rem]
  stack: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  // rounded-4 h-[3rem] w-full gap-[0.5rem]
  button: {
    height: 48,
    width: '100%',
    borderRadius: RADIUS_4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  kakao: {
    backgroundColor: '#FEE500',
  },
  buttonLabel: TITLE_2,
  pressed: {
    opacity: 0.7,
  },
  // flex-col items-center gap-y-4
  nav: {
    alignItems: 'center',
    gap: SPACING[4],
  },
  // items-center justify-center gap-x-6
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING[6],
  },
  // 클래스에 underline 이 있지만 .text-caption-caption4 의 text-decoration: none 이
  // 덮어써서 웹에서는 밑줄이 그어지지 않는다. 실측값(textDecorationLine: none)을 따른다.
  caption: CAPTION_4,
});
