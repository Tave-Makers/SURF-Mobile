import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { CAPTION_4, COLOR_TOKENS, RADIUS_4, TITLE_2 } from '@/shared/config/theme';
import { AppleIcon, KakaoIcon, SurfLogo } from '@/shared/ui/BrandIcons';

/**
 * 웹 /login (apps/web/src/app-pages/login/ui/LoginPage.tsx) 을 그대로 옮긴 화면.
 * 앱은 이 오버레이가 WebView 를 덮으므로, 여기서 웹과 달라지면 그대로 앱의 첫 화면이
 * 웹과 달라진다. 간격·색·타이포는 전부 웹 토큰에서 가져온 값이다.
 */

const POLICY_LINKS = [
  { path: '/terms-of-service', label: '서비스 이용약관' },
  { path: '/privacy-policy', label: '개인정보 처리방침' },
  { path: '/operational-policy', label: '운영정책' },
] as const;

const SUPPORT_LINK = { path: '/support', label: '문의' } as const;

type LoginOverlayProps = {
  pending: boolean;
  errorMessage: string | null;
  appleAvailable: boolean;
  onKakaoPress: () => void;
  onApplePress: () => void;
  onLinkPress: (path: string) => void;
};

export const LoginOverlay = ({
  pending,
  errorMessage,
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
        <View style={styles.buttons}>
          {errorMessage !== null && (
            <Text style={[styles.error, { color: c.foregroundTertiary }]}>{errorMessage}</Text>
          )}

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
        </View>

        <View accessibilityLabel="서비스 정책 및 문의" style={styles.nav}>
          <View style={styles.policyRow}>
            {POLICY_LINKS.map(({ path, label }, index) => (
              <View key={path} style={styles.policyItem}>
                {index > 0 && (
                  <Text style={[styles.caption, { color: c.foregroundTertiary }]}>|</Text>
                )}
                <Text
                  accessibilityRole="link"
                  onPress={() => onLinkPress(path)}
                  style={[styles.caption, styles.link, { color: c.foregroundTertiary }]}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>

          <Text
            accessibilityRole="link"
            onPress={() => onLinkPress(SUPPORT_LINK.path)}
            style={[styles.caption, styles.link, { color: c.foregroundTertiary }]}
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
    paddingHorizontal: 60,
    paddingTop: 268.96,
  },
  // w-full flex-col items-center gap-[1.25rem]
  stack: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  buttons: {
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
  error: {
    ...CAPTION_4,
    textAlign: 'center',
  },
  // flex-col items-center gap-y-4
  nav: {
    alignItems: 'center',
    gap: 16,
  },
  // items-center justify-center gap-x-6
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  caption: CAPTION_4,
  link: {
    textDecorationLine: 'underline',
  },
});
