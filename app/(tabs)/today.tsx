import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { pursuitActionCounts } from '@/lib/progress';

export default function TodayScreen() {
  const { persona, pursuits, personaComplete } = useApp();
  const active = pursuits.filter((p) => p.status === 'active');

  const nextActions = active.flatMap((p) =>
    p.milestones.flatMap((m) =>
      m.actions
        .filter((a) => !a.done)
        .slice(0, 1)
        .map((a) => ({ pursuitId: p.id, pursuitTitle: p.title, action: a })),
    ),
  );

  return (
    <Screen title="Today" subtitle="What moves your pursuits forward" scroll>
      {!personaComplete ? (
        <Card>
          <Text style={styles.warnTitle}>Persona incomplete</Text>
          <Text style={styles.warnBody}>
            Set your role and becoming on the Persona tab before the Card loop is meaningful.
          </Text>
          <Link href="/(tabs)/profile" asChild>
            <Pressable>
              <Text style={styles.link}>Complete persona →</Text>
            </Pressable>
          </Link>
        </Card>
      ) : (
        <Card>
          <Text style={styles.label}>YOU ARE</Text>
          <Text style={styles.role}>{persona?.role}</Text>
          <Text style={[styles.label, { marginTop: spacing.md }]}>BECOMING</Text>
          <Text style={styles.becoming}>{persona?.becoming}</Text>
        </Card>
      )}

      <Text style={styles.section}>Active pursuits</Text>
      {active.length === 0 ? (
        <EmptyState
          title="No active pursuits"
          body="Add a pursuit to start collecting evidence on your Card."
        />
      ) : (
        active.map((p) => {
          const counts = pursuitActionCounts(p);
          return (
            <Link key={p.id} href={`/pursuit/${p.id}`} asChild>
              <Pressable>
                <Card>
                  <Text style={styles.pursuitTitle}>{p.title}</Text>
                  <Text style={styles.meta}>
                    {counts.completed}/{counts.total} actions done
                  </Text>
                </Card>
              </Pressable>
            </Link>
          );
        })
      )}

      <Text style={styles.section}>Next actions</Text>
      {nextActions.length === 0 ? (
        <Text style={styles.muted}>Nothing pending — check off actions inside a pursuit.</Text>
      ) : (
        nextActions.slice(0, 5).map((item) => (
          <View key={item.action.id} style={styles.nextRow}>
            <Text style={styles.nextAction}>{item.action.title}</Text>
            <Text style={styles.muted}>{item.pursuitTitle}</Text>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label },
  role: { ...typography.h2, marginTop: spacing.xs },
  becoming: { ...typography.body, marginTop: spacing.xs, color: colors.accent },
  section: { ...typography.h3, marginTop: spacing.sm, marginBottom: spacing.sm },
  pursuitTitle: { ...typography.h3 },
  meta: { ...typography.caption, marginTop: spacing.xs },
  muted: { ...typography.caption },
  nextRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  nextAction: { ...typography.body },
  warnTitle: { ...typography.h3, color: colors.warning },
  warnBody: { ...typography.caption, marginTop: spacing.sm, marginBottom: spacing.sm },
  link: { ...typography.body, color: colors.accent, fontWeight: '600' },
});
