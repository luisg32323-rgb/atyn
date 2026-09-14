import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { allPursuitsActionCounts, pursuitActionCounts } from '@/lib/progress';

export default function AtYnCardScreen() {
  const { persona, personaComplete, pursuits } = useApp();
  const overall = allPursuitsActionCounts(pursuits);

  return (
    <Screen title="ATYN Card" subtitle="Role, becoming, evidence — no Momentum" scroll>
      {!personaComplete ? (
        <EmptyState
          title="Persona required"
          body="Complete role + becoming on the Persona tab. The Card never invents persona data."
        />
      ) : (
        <View style={styles.atynCard}>
          <Text style={styles.brand}>ATYN</Text>
          <Text style={styles.label}>ROLE</Text>
          <Text style={styles.role}>{persona?.role}</Text>
          <Text style={[styles.label, { marginTop: spacing.md }]}>BECOMING</Text>
          <Text style={styles.becoming}>{persona?.becoming}</Text>

          <View style={styles.divider} />

          <ProgressBar
            completed={overall.completed}
            total={overall.total}
            label="Evidence (actions completed)"
          />
          <Text style={styles.note}>
            Progress is completed actions ÷ total actions across pursuits. Momentum is hidden in v1.
          </Text>
        </View>
      )}

      {personaComplete && pursuits.length > 0 ? (
        <>
          <Text style={styles.section}>By pursuit</Text>
          {pursuits.map((p) => {
            const c = pursuitActionCounts(p);
            return (
              <Card key={p.id}>
                <Text style={styles.pursuitTitle}>{p.title}</Text>
                <ProgressBar completed={c.completed} total={c.total} />
              </Card>
            );
          })}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  atynCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.accentDim,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  brand: {
    ...typography.label,
    color: colors.accent,
    marginBottom: spacing.md,
  },
  label: { ...typography.label },
  role: { ...typography.h2, marginTop: spacing.xs },
  becoming: { ...typography.body, marginTop: spacing.xs, color: colors.accent, lineHeight: 24 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  note: { ...typography.caption, marginTop: spacing.sm, lineHeight: 18 },
  section: { ...typography.h3, marginBottom: spacing.sm },
  pursuitTitle: { ...typography.h3, marginBottom: spacing.sm },
});
