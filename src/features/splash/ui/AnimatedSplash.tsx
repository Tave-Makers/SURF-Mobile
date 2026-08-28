import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, useAnimatedValue, useColorScheme } from 'react-native';

import splashAnimation from '../../../../assets/lottie/surf-splash.json';
import { COLOR_TOKENS } from '@/shared/config/theme';


const FADE_OUT_MS = 260;

type AnimatedSplashProps = {
  /** 애니메이션이 끝났고 세션 판별도 끝나 사라져도 되는 상태 */
  ready: boolean;
  onAnimationFinish: () => void;
  onFadeOutEnd: () => void;
};

/**
 * 네이티브 스플래시(단색 배경)를 이어받아 로고 애니메이션을 재생한다.
 *
 * 배경은 웹 로그인 화면과 같은 --color-background-normal 을 쓴다.
 * 스플래시 → 로그인 화면으로 넘어갈 때 배경색이 바뀌지 않아야 하기 때문이다.
 * app.json 의 expo-splash-screen backgroundColor(라이트/다크)도 같은 값으로 맞춰져 있다.
 */
export const AnimatedSplash = ({ ready, onAnimationFinish, onFadeOutEnd }: AnimatedSplashProps) => {
  const scheme = useColorScheme();
  const backgroundColor = COLOR_TOKENS[scheme === 'dark' ? 'dark' : 'light'].backgroundNormal;

  const opacity = useAnimatedValue(1);
  const fadingRef = useRef(false);

  useEffect(() => {
    if (!ready || fadingRef.current) return;

    fadingRef.current = true;
    Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_OUT_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onFadeOutEnd();
    });
  }, [ready, opacity, onFadeOutEnd]);

  return (
    <Animated.View style={[styles.container, { backgroundColor, opacity }]} pointerEvents="none">
      <LottieView
        source={splashAnimation}
        style={styles.animation}
        autoPlay
        loop={false}
        resizeMode="contain"
        onAnimationFinish={onAnimationFinish}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 216.453,
    height: 80.796,
  },
});
