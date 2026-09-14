import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { createId } from '@/lib/id';
import { pursuitActionCounts } from '@/lib/progress';
import type { PursuitStatus } from '@/types';

const STATUSES: PursuitStatus[] = ['active', 'paused', 'completed'];

export default function PursuitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPursuit, updatePursuit, deletePursuit, toggleAction } = useApp();
  const pursuit = getPursuit(id);
  const [newAction, setNewAction] = useState('');

  const counts = useMemo(
    () => (pursuit ? pursuitActionCounts(pursuit) : { completed: 0, total: 0 }),
    [pursuit],
  );

  if (!pursuit) {
    return (
      <Screen title="Missing pursuit">
        <Text style={styles.muted}>This pursuit was deleted or never existed.</Text>
        <Button title="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const firstMilestone = pursuit.milestones[0];

  const addAction = async () => {
    if (!newAction.trim() || !firstMilestone) return;
    const milestones = pursuit.milestones.map((m) =>
      m.id === firstMilestone.id
        ? {
            ...m,
            actions: [
              ...m.actions,
              { id: createId('act'), title: newAction.trim(), done: false },
            ],
          }
        : m,
    );
    await updatePursuit(pursuit.id, { milestones });
    setNewAction('');
  };

  const onDelete = () => {
    Alert.alert('Delete pursuit?', 'This cannot be undone on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deletePursuit(pursuit.id);
          router.replace('/(tabs)/pursuits');
        },
      },
    ]);
  };

  return (
    <Screen title={pursuit.title} subtitle={pursuit.why} scroll>
      <ProgressBar completed={counts.completed} total={counts.total} />

      <Text style={styles.section}>Status</Text>
      <View style={styles.statusRow}>
        {STATUSES.map((s) => (
          <Pressable
            key={s}
            onPress={() => updatePursuit(pursuit.id, { status: s })}
            style={[styles.chip, pursuit.status === s && styles.chipActive]}
          >
            <Text style={[styles.chipText, pursuit.status === s && styles.chipTextActive]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Milestones & actions</Text>
      {pursuit.milestones.map((m) => (
        <Card key={m.id}>
          <Text style={styles.milestone}>{m.title}</Text>
          {m.actions.map((a) => (
            <Pressable
              key={a.id}
              onPress={() => toggleAction(pursuit.id, m.id, a.id)}
              style={styles.actionRow}
            >
              <View style={[styles.check, a.done && styles.checkDone]}>
                {a.done ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
              <Text style={[styles.actionTitle, a.done && styles.actionDone]}>{a.title}</Text>
            </Pressable>
          ))}
        </Card>
      ))}

      {firstMilestone ? (
        <View style={styles.addBlock}>
          <TextField
            label="Add action"
            value={newAction}
            onChangeText={setNewAction}
            placeholder="Another checkable step"
          />
          <Button title="Add action" variant="secondary" onPress={addAction} disabled={!newAction.trim()} />
        </View>
      ) : null}

      <View style={styles.danger}>
        <Button title="Delete pursuit" variant="danger" onPress={onDelete} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  muted: { ...typography.caption, marginBottom: spacing.md },
  section: { ...typography.h3, marginTop: spacing.lg, marginBottom: spacing.sm },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.chip },
  chipText: { ...typography.caption, color: colors.textMuted },
  chipTextActive: { color: colors.accent, fontWeight: '600' },
  milestone: { ...typography.h3, marginBottom: spacing.sm },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkMark: { color: colors.bg, fontWeight: '700', fontSize: 14 },
  actionTitle: { ...typography.body, flex: 1 },
  actionDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  addBlock: { marginTop: spacing.md },
  danger: { marginTop: spacing.xl, marginBottom: spacing.lg },
});
