import React, { forwardRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = PressableProps & {
  title: string;
  variant?: Variant;
  loading?: boolean;
};

export const Button = forwardRef<React.ElementRef<typeof Pressable>, Props>(
  function Button({ title, variant = 'primary', loading, disabled, style, ...rest }, ref) {
    const isDisabled = disabled || loading;
    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.base,
          styles[variant],
          pressed && !isDisabled ? styles.pressed : null,
          isDisabled ? styles.disabled : null,
          typeof style === 'function' ? style({ pressed }) : style,
        ]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? colors.bg : colors.accent} />
        ) : (
          <Text style={[styles.label, styles[`${variant}Label` as const]]}>{title}</Text>
        )}
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: { backgroundColor: colors.accent },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.danger },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.45 },
  label: { fontSize: 16, fontWeight: '600' },
  primaryLabel: { color: colors.bg },
  secondaryLabel: { color: colors.text },
  ghostLabel: { color: colors.accent },
  dangerLabel: { color: colors.bg },
});
