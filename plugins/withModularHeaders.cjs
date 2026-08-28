const { withPodfile } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');

const TAG = 'surf-modular-headers';

/**
 * Podfile 에 use_modular_headers! 를 넣는다.
 *
 * $RNFirebaseDisableSPM = true 로 Firebase 를 CocoaPods 에서 받으면
 * FirebaseCoreInternal 같은 Swift pod 이 GoogleUtilities 를 참조하는데,
 * GoogleUtilities 가 모듈을 정의하지 않아 static 라이브러리로는 통합되지 않는다.
 * 모듈 맵을 생성하도록 해서 Swift 에서 import 할 수 있게 만든다.
 *
 * prebuild 가 Podfile 을 다시 쓰기 때문에 직접 편집하지 않고 플러그인으로 넣는다.
 */
module.exports = function withModularHeaders(config) {
  return withPodfile(config, (cfg) => {
    cfg.modResults.contents = mergeContents({
      src: cfg.modResults.contents,
      newSrc: '  use_modular_headers!',
      tag: TAG,
      anchor: /use_expo_modules!/,
      offset: 1,
      comment: '#',
    }).contents;

    return cfg;
  });
};
