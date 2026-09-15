import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing, typography } from '@/constants/theme';
import { progressRatio } from '@/lib/progress';

type Props = {
  completed: number;
  total: number;
  label?: string;
};

export function ProgressBar({ completed, total, label }: Props) {
  const ratio = progressRatio(completed, total);
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>{label ?? 'Progress'}</Text>
        <Text style={styles.count}>
          {completed}/{total}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(ratio * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[8],
  },
  label: { ...typography.caption },
  count: {
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  track: {
    height: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.progressTrack,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.progressFill,
    borderRadius: radius.sm,
  },
});
