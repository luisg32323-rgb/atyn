import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { colors, fonts, spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { computeCategoryStats, computeOvr } from '@/lib/cardStats';
import { pursuitActionCounts } from '@/lib/progress';

export default function CardBreakdownScreen() {
  const { persona, personaComplete, pursuits } = useApp();
  const stats = useMemo(
    () => computeCategoryStats(pursuits, persona),
    [pursuits, persona],
  );
  const ovr = computeOvr(stats);

  if (!personaComplete) {
    return (
      <Screen title="Breakdown" scroll>
        <EmptyState title="Persona required" body="Set role + becoming first." />
      </Screen>
    );
  }

  return (
    <Screen title="Breakdown" subtitle={`OVR ${ovr}`} scroll>
      <Card>
        {stats.map((s) => (
          <View key={s.key} style={styles.row}>
            <Text style={styles.label}>{s.label}</Text>
            <Text style={styles.value}>{s.value}</Text>
          </View>
        ))}
      </Card>

      <Text style={styles.section}>By pursuit</Text>
      {pursuits.length === 0 ? (
        <EmptyState title="No pursuits" body="Evidence appears once you add pursuits." />
      ) : (
        pursuits.map((p) => {
          const c = pursuitActionCounts(p);
          return (
            <Card key={p.id}>
              <Text style={styles.pursuit}>{p.title}</Text>
              <ProgressBar completed={c.completed} total={c.total} />
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[8],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: { ...typography.body },
  value: { fontFamily: fonts.mono, fontSize: 18, fontWeight: '700', color: colors.accent },
  section: { ...typography.heading, marginBottom: spacing[8], marginTop: spacing[8] },
  pursuit: { ...typography.heading, marginBottom: spacing[8] },
});
