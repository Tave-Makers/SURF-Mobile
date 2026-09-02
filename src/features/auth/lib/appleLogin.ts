import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

export type AppleCredential = {
  identityToken: string;
  /** 서버로는 원문 nonce 를 보낸다. Apple 에 넘긴 값은 이걸 SHA-256 한 것이다. */
  nonce: string;
  authorizationCode: string;
  /** Apple 은 최초 1회만 이름을 준다. 재로그인 시에는 빈 문자열이 된다. */
  name: string;
};

const createRawNonce = () => Crypto.randomUUID().replace(/-/g, '');

/** 백엔드(AppleIdentityTokenVerifier)가 소문자 hex SHA-256 으로 비교하므로 형식을 맞춘다. */
const sha256Hex = (value: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value, {
    encoding: Crypto.CryptoEncoding.HEX,
  });

const joinName = (fullName: AppleAuthentication.AppleAuthenticationFullName | null) => {
  if (!fullName) return '';

  return [fullName.familyName, fullName.givenName].filter(Boolean).join('');
};

export const isAppleSignInAvailable = () => AppleAuthentication.isAvailableAsync();

/**
 * Apple SDK 로그인 결과를 서버 검증 가능한 형태로 돌려준다.
 *
 * expo-apple-authentication 은 nonce 를 그대로 Apple 에 넘기고(해싱하지 않는다),
 * Apple 은 받은 값을 identityToken 의 nonce 클레임에 그대로 담는다.
 * 백엔드는 APP 흐름에서 nonce 클레임을 SHA-256(원문 nonce) 로 기대하므로,
 * Apple 에는 해시를 넘기고 서버에는 원문을 보낸다.
 */
export const signInWithApple = async (): Promise<AppleCredential> => {
  const rawNonce = createRawNonce();
  const hashedNonce = await sha256Hex(rawNonce);

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!credential.identityToken) {
    throw new Error('Apple 로그인 토큰을 받지 못했어요.');
  }

  return {
    identityToken: credential.identityToken,
    nonce: rawNonce,
    authorizationCode: credential.authorizationCode ?? '',
    name: joinName(credential.fullName),
  };
};
