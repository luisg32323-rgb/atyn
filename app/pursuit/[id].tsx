import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { PacePill, TrendPill } from '@/components/ui/StatusPill';
import { TextField } from '@/components/ui/TextField';
import { colors, fonts, radius, spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { createId } from '@/lib/id';
import { pursuitActionCounts } from '@/lib/progress';
import { pursuitTrajectory } from '@/lib/status';
import type { PursuitStatus } from '@/types';

const STATUSES: PursuitStatus[] = ['active', 'paused', 'completed'];

export default function PursuitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPursuit, updatePursuit, deletePursuit, toggleAction } = useApp();
  const pursuit = getPursuit(id);
  const [newAction, setNewAction] = useState('');
  const [draftStatus, setDraftStatus] = useState<'idle' | 'shown' | 'accepted' | 'rejected'>('idle');
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [evidenceAction, setEvidenceAction] = useState<{
    milestoneId: string;
    actionId: string;
    title: string;
  } | null>(null);

  const counts = useMemo(
    () => (pursuit ? pursuitActionCounts(pursuit) : { completed: 0, total: 0 }),
    [pursuit],
  );
  const traj = useMemo(() => (pursuit ? pursuitTrajectory(pursuit) : null), [pursuit]);

  if (!pursuit) {
    return (
      <Screen title="Missing pursuit">
        <Text style={styles.muted}>This pursuit was deleted or never existed.</Text>
        <Button title="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const firstMilestone = pursuit.milestones[0];
  const draftText = `Try: ship one visible proof for “${pursuit.title}” this week — something you could paste onto the Card.`;

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

  const openEvidence = (milestoneId: string, actionId: string, title: string) => {
    setEvidenceAction({ milestoneId, actionId, title });
    setEvidenceNote('');
    setEvidenceOpen(true);
  };

  const submitEvidence = async () => {
    if (!evidenceAction) return;
    await toggleAction(pursuit.id, evidenceAction.milestoneId, evidenceAction.actionId);
    setEvidenceOpen(false);
    setEvidenceAction(null);
    setEvidenceNote('');
  };

  return (
    <Screen title={pursuit.title} subtitle={pursuit.why} scroll>
      {traj ? (
        <Card>
          <Text style={styles.label}>Trajectory</Text>
          <View style={styles.pills}>
            <PacePill pace={traj.pace} />
            <TrendPill trend={traj.trend} />
          </View>
          <ProgressBar completed={counts.completed} total={counts.total} />
        </Card>
      ) : null}

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

      <Text style={styles.section}>AI draft (stub)</Text>
      <Card>
        {draftStatus === 'idle' ? (
          <>
            <Text style={styles.muted}>Optional coach-style next step — local stub only.</Text>
            <Button title="Show draft" variant="secondary" onPress={() => setDraftStatus('shown')} />
          </>
        ) : (
          <>
            <Text style={styles.draft}>{draftText}</Text>
            {draftStatus === 'shown' ? (
              <View style={styles.draftRow}>
                <Button
                  title="Accept"
                  onPress={async () => {
                    if (!firstMilestone) return;
                    const milestones = pursuit.milestones.map((m) =>
                      m.id === firstMilestone.id
                        ? {
                            ...m,
                            actions: [
                              ...m.actions,
                              {
                                id: createId('act'),
                                title: `Ship visible proof for ${pursuit.title}`,
                                done: false,
                              },
                            ],
                          }
                        : m,
                    );
                    await updatePursuit(pursuit.id, { milestones });
                    setDraftStatus('accepted');
                  }}
                />
                <Button title="Edit" variant="secondary" onPress={() => setNewAction(draftText)} />
                <Button title="Reject" variant="ghost" onPress={() => setDraftStatus('rejected')} />
              </View>
            ) : (
              <Text style={styles.meta}>
                {draftStatus === 'accepted' ? 'Draft accepted into actions.' : 'Draft rejected.'}
              </Text>
            )}
          </>
        )}
      </Card>

      <Text style={styles.section}>Milestones & actions</Text>
      {pursuit.milestones.map((m) => (
        <Card key={m.id}>
          <Text style={styles.milestone}>{m.title}</Text>
          {m.actions.map((a) => (
            <View key={a.id} style={styles.actionRow}>
              <Pressable
                onPress={() => toggleAction(pursuit.id, m.id, a.id)}
                style={[styles.check, a.done && styles.checkDone]}
              >
                {a.done ? <Text style={styles.checkMark}>✓</Text> : null}
              </Pressable>
              <Text style={[styles.actionTitle, a.done && styles.actionDone]}>{a.title}</Text>
              {!a.done ? (
                <Pressable onPress={() => openEvidence(m.id, a.id, a.title)}>
                  <Text style={styles.evidenceLink}>Evidence</Text>
                </Pressable>
              ) : null}
            </View>
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

      <Modal visible={evidenceOpen} animationType="slide" transparent onRequestClose={() => setEvidenceOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setEvidenceOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>Evidence (stub)</Text>
            <Text style={styles.sheetBody}>{evidenceAction?.title}</Text>
            <TextInput
              style={styles.evidenceInput}
              placeholder="What did you do? (local stub)"
              placeholderTextColor={colors.textDim}
              value={evidenceNote}
              onChangeText={setEvidenceNote}
              multiline
            />
            <Button title="Save & complete" onPress={submitEvidence} />
            <Button title="Cancel" variant="ghost" onPress={() => setEvidenceOpen(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  muted: { ...typography.caption, marginBottom: spacing[16] },
  label: { ...typography.label, marginBottom: spacing[8] },
  section: { ...typography.heading, marginTop: spacing[16], marginBottom: spacing[8] },
  pills: { flexDirection: 'row', gap: spacing[8], marginBottom: spacing[12] },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[8] },
  chip: {
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[8],
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.chipActive },
  chipText: { ...typography.caption, color: colors.textMuted },
  chipTextActive: { color: colors.accent, fontWeight: '600' },
  draft: { ...typography.body, marginBottom: spacing[12] },
  draftRow: { gap: spacing[8] },
  meta: { ...typography.caption },
  milestone: { ...typography.heading, marginBottom: spacing[8] },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[8],
    gap: spacing[8],
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkMark: { color: colors.textOnAccent, fontWeight: '700', fontSize: 14 },
  actionTitle: { ...typography.body, flex: 1 },
  actionDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  evidenceLink: { ...typography.caption, color: colors.accent, fontWeight: '600' },
  addBlock: { marginTop: spacing[16] },
  danger: { marginTop: spacing[32], marginBottom: spacing[24] },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28,27,25,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing[24],
    paddingBottom: spacing[32],
    gap: spacing[8],
  },
  sheetTitle: { ...typography.heading },
  sheetBody: { ...typography.body, color: colors.textMuted, marginBottom: spacing[8] },
  evidenceInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    color: colors.ink,
    fontFamily: fonts.sans,
    fontSize: 16,
    minHeight: 88,
    padding: spacing[12],
    textAlignVertical: 'top',
    marginBottom: spacing[8],
  },
});
