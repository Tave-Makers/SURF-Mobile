const { withProjectBuildGradle } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');

const TAG = 'surf-kakao-maven';
const KAKAO_REPO = "    maven { url 'https://devrepo.kakao.com/nexus/content/groups/public/' }";

/**
 * 카카오 SDK 저장소를 android/build.gradle 에 추가한다.
 *
 * com.kakao.sdk:* 는 Maven Central 에 없고 카카오 자체 Nexus 에만 올라간다.
 * 없으면 :app:debugRuntimeClasspath 해석 단계에서
 * "Could not find com.kakao.sdk:v2-common" 으로 gradle 빌드가 실패한다.
 *
 * prebuild 가 build.gradle 을 다시 쓰기 때문에 직접 편집하지 않고 플러그인으로 넣는다.
 */
module.exports = function withKakaoMavenRepo(config) {
  return withProjectBuildGradle(config, (cfg) => {
    cfg.modResults.contents = mergeContents({
      src: cfg.modResults.contents,
      newSrc: KAKAO_REPO,
      tag: TAG,
      anchor: /maven \{ url 'https:\/\/www\.jitpack\.io' \}/,
      offset: 1,
      comment: '//',
    }).contents;

    return cfg;
  });
};
