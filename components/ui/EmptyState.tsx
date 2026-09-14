import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: { ...typography.h3, marginBottom: spacing.sm, textAlign: 'center' },
  body: { ...typography.caption, textAlign: 'center', color: colors.textMuted },
});
