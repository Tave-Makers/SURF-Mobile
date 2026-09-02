import { useEffect } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

import { BODY_9, COLOR_TOKENS, RADIUS_3, SPACING } from '@/shared/config/theme';

/** 웹 toastStore 의 기본 노출 시간 */
const DURATION_MS = 3000;

type ToastProps = {
  text: string;
  onHide: () => void;
};

/**
 * 웹 packages/ui 의 Toast + ToastViewport 를 그대로 옮긴 것.
 *
 * 로그인 화면은 네이티브 LoginOverlay 가 WebView 를 덮기 때문에 웹이 띄운 토스트가
 * 그 아래에 가려 보이지 않는다. 그래서 같은 모양을 네이티브로 다시 그린다.
 * 위치(bottom + 92px)는 웹 뷰포트가 화면 전체를 쓰므로 그대로 옮기면 같은 자리에 온다.
 *
 * 새 토스트가 뜰 때 타이머가 리셋되도록 부모가 key 를 갈아끼운다(웹 store 와 같은 동작).
 */
export const Toast = ({ text, onHide }: ToastProps) => {
  const scheme = useColorScheme();
  const c = COLOR_TOKENS[scheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    const timer = setTimeout(onHide, DURATION_MS);

    return () => clearTimeout(timer);
  }, [onHide]);

  return (
    <View style={styles.viewport} pointerEvents="none">
      <View
        accessibilityLiveRegion="polite"
        style={[styles.toast, { backgroundColor: c.backgroundNormalInverseAlpha }]}
      >
        <Text style={[styles.text, { color: c.foregroundNormalReverse }]}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // fixed bottom-0 left-1/2 w-full -translate-x-1/2 px-10 pb-[5.75rem]
  viewport: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: SPACING[10],
    paddingBottom: 92,
  },
  // px-13 py-10 rounded-3
  toast: {
    paddingHorizontal: SPACING[13],
    paddingVertical: SPACING[10],
    borderRadius: RADIUS_3,
  },
  text: BODY_9,
});
