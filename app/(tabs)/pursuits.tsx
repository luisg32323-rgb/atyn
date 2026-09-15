import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { PacePill, TrendPill } from '@/components/ui/StatusPill';
import { colors, spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { pursuitActionCounts } from '@/lib/progress';
import { pursuitTrajectory } from '@/lib/status';

export default function PursuitsScreen() {
  const { pursuits } = useApp();

  return (
    <Screen title="Pursuits" subtitle="List, trajectory, evidence" scroll>
      <Link href="/pursuit/new" asChild>
        <Button title="New pursuit" />
      </Link>

      <View style={styles.list}>
        {pursuits.length === 0 ? (
          <EmptyState
            title="No pursuits yet"
            body="Create a pursuit with a why and checkable milestone actions."
          />
        ) : (
          pursuits.map((p) => {
            const counts = pursuitActionCounts(p);
            const traj = pursuitTrajectory(p);
            return (
              <Link key={p.id} href={`/pursuit/${p.id}`} asChild>
                <Pressable>
                  <Card>
                    <View style={styles.row}>
                      <Text style={styles.title}>{p.title}</Text>
                      <Text style={styles.status}>{p.status}</Text>
                    </View>
                    <Text style={styles.why} numberOfLines={2}>
                      {p.why}
                    </Text>
                    <View style={styles.pills}>
                      <PacePill pace={traj.pace} />
                      <TrendPill trend={traj.trend} />
                    </View>
                    <ProgressBar completed={counts.completed} total={counts.total} />
                  </Card>
                </Pressable>
              </Link>
            );
          })
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: spacing[16] },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.heading, flex: 1, marginRight: spacing[8] },
  status: {
    ...typography.label,
    color: colors.accent,
    backgroundColor: colors.chip,
    paddingHorizontal: spacing[8],
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    textTransform: 'none',
    letterSpacing: 0.3,
  },
  why: { ...typography.caption, marginVertical: spacing[8] },
  pills: { flexDirection: 'row', gap: spacing[8], marginBottom: spacing[12] },
});
