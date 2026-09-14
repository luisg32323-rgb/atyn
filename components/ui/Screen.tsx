import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/constants/theme';

type Props = ViewProps & {
  title?: string;
  subtitle?: string;
  scroll?: boolean;
  children: React.ReactNode;
};

export function Screen({ title, subtitle, scroll, children, style, ...rest }: Props) {
  const body = (
    <View style={[styles.inner, style]} {...rest}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { flexGrow: 1, paddingBottom: spacing.xl },
  inner: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.md },
  title: { ...typography.title, marginBottom: spacing.xs },
  subtitle: { ...typography.caption, marginBottom: spacing.md },
});
