const { withAndroidStyles } = require('@expo/config-plugins');

const SPLASH_STYLE = 'Theme.App.SplashScreen';
const ICON_ITEM = 'windowSplashScreenAnimatedIcon';

/**
 * Android 스플래시 스타일에서 windowSplashScreenAnimatedIcon 항목을 제거한다.
 *
 * 로고는 로티가 그리므로 app.json 의 expo-splash-screen 설정에는 image 가 없다.
 * 그런데 플러그인은 이미지 유무와 상관없이 이 항목을 항상 styles.xml 에 쓰고,
 * drawable 은 이미지가 있을 때만 만든다. 그래서 존재하지 않는 리소스를 참조하게 되어
 * :app:processDebugResources 에서 링크가 실패한다.
 *
 *   error: resource drawable/splashscreen_logo not found
 *
 * 로컬 iOS 빌드에서는 드러나지 않고 Android 빌드에서만 터진다.
 */
module.exports = function withoutSplashIcon(config) {
  return withAndroidStyles(config, (cfg) => {
    for (const style of cfg.modResults.resources.style ?? []) {
      if (style.$.name !== SPLASH_STYLE || !style.item) continue;

      style.item = style.item.filter((item) => item.$.name !== ICON_ITEM);
    }

    return cfg;
  });
};
