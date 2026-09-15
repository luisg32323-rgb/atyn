import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  colors,
  paceColor,
  radius,
  spacing,
  trendColor,
  typography,
  type PaceStatus,
  type TrendStatus,
} from '@/constants/theme';

function softBg(hex: string): string {
  // Warm translucent wash on Paper — fixed soft fills by status family.
  if (hex === colors.statusAhead || hex === colors.trendRising) return '#E4EDE6';
  if (hex === colors.statusBehind || hex === colors.trendSlipping) return '#F3E4E1';
  if (hex === colors.trendSteady) return '#E4EAF3';
  return '#E4EAF3'; // on track / accent family
}

export function PacePill({ pace }: { pace: PaceStatus }) {
  const c = paceColor(pace);
  return (
    <View style={[styles.pill, { backgroundColor: softBg(c), borderColor: c }]}>
      <Text style={[styles.text, { color: c }]}>{pace}</Text>
    </View>
  );
}

export function TrendPill({ trend }: { trend: TrendStatus }) {
  const c = trendColor(trend);
  return (
    <View style={[styles.pill, { backgroundColor: softBg(c), borderColor: c }]}>
      <Text style={[styles.text, { color: c }]}>{trend}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[4],
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.label,
    letterSpacing: 0.4,
    textTransform: 'none',
    fontSize: 12,
    fontWeight: '600',
  },
});
