import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { pursuitActionCounts } from '@/lib/progress';

export default function PursuitsScreen() {
  const { pursuits } = useApp();

  return (
    <Screen title="Pursuits" subtitle="Title, why, status, milestones" scroll>
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
  list: { marginTop: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.h3, flex: 1, marginRight: spacing.sm },
  status: {
    ...typography.label,
    color: colors.accent,
    backgroundColor: colors.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  why: { ...typography.caption, marginVertical: spacing.sm },
});
