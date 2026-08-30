import { Modal, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import {
  BODY_6,
  BODY_9,
  COLOR_TOKENS,
  RADIUS_3,
  RADIUS_4,
  SPACING,
  TITLE_2,
} from '@/shared/config/theme';

type AlertDialogProps = {
  title: string;
  infoText?: string;
  confirmLabel?: string;
  onConfirm: () => void;
};

/**
 * 웹 packages/ui 의 Alert 를 그대로 옮긴 것.
 *
 * 지금 앱에서 쓰는 건 '확인' 하나짜리(TextButton 단독) 알럿뿐이라 그 형태만 옮겼다.
 * 버튼이 늘어나면 웹처럼 actions 배열로 넓히면 된다.
 */
export const AlertDialog = ({
  title,
  infoText,
  confirmLabel = '확인',
  onConfirm,
}: AlertDialogProps) => {
  const scheme = useColorScheme();
  const c = COLOR_TOKENS[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Modal transparent statusBarTranslucent animationType="fade" onRequestClose={onConfirm}>
      <View style={styles.root}>
        {/* 웹은 closeOnBackdrop 이 기본값 true 다 */}
        <Pressable accessibilityElementsHidden style={styles.backdrop} onPress={onConfirm} />

        <View style={[styles.dialog, { backgroundColor: c.backgroundNormalLighter }]}>
          <View style={styles.texts}>
            <Text style={[styles.title, { color: c.foregroundNormal }]}>{title}</Text>
            {infoText !== undefined && (
              <Text style={[styles.info, { color: c.foregroundNormalLighter }]}>{infoText}</Text>
            )}
          </View>

          {/* 텍스트 버튼 하나뿐이면 웹은 ml-auto 로 오른쪽에 붙인다 */}
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}
            >
              <Text style={[styles.textButtonLabel, { color: c.foregroundPrimary }]}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // bg-black/60
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  // w-[17.1875rem] rounded-4 gap-14 px-15 pt-15 pb-14
  dialog: {
    width: 275,
    borderRadius: RADIUS_4,
    gap: SPACING[14],
    paddingHorizontal: SPACING[15],
    paddingTop: SPACING[15],
    paddingBottom: SPACING[14],
    boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.12)',
  },
  // gap-5
  texts: {
    gap: SPACING[5],
  },
  title: TITLE_2,
  info: BODY_9,
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  // TextButton size="m": p-9 + 좌우 0.25rem 스페이서, rounded-3
  textButton: {
    borderRadius: RADIUS_3,
    paddingVertical: SPACING[9],
    paddingHorizontal: SPACING[9] + 4,
  },
  textButtonLabel: BODY_6,
  pressed: {
    opacity: 0.7,
  },
});
