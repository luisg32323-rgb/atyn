import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { PacePill, TrendPill } from '@/components/ui/StatusPill';
import { colors, fonts, radius, spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { momentumSummary } from '@/lib/status';

type PriorityItem = {
  pursuitId: string;
  pursuitTitle: string;
  milestoneId: string;
  action: { id: string; title: string; done: boolean };
};

export default function TodayScreen() {
  const { persona, pursuits, personaComplete, toggleAction } = useApp();
  const active = pursuits.filter((p) => p.status === 'active');
  const momentum = useMemo(() => momentumSummary(pursuits), [pursuits]);

  const priorities: PriorityItem[] = useMemo(
    () =>
      active.flatMap((p) =>
        p.milestones.flatMap((m) =>
          m.actions
            .filter((a) => !a.done)
            .slice(0, 1)
            .map((a) => ({
              pursuitId: p.id,
              pursuitTitle: p.title,
              milestoneId: m.id,
              action: a,
            })),
        ),
      ),
    [active],
  );

  const [sheet, setSheet] = useState<null | { mode: 'complete' | 'reschedule'; item: PriorityItem }>(
    null,
  );
  const [evidenceNote, setEvidenceNote] = useState('');

  const insight = useMemo(() => {
    if (!personaComplete) {
      return 'Set role + becoming so Today can mirror who you are building.';
    }
    if (priorities.length === 0) {
      return 'No open actions — add a step inside a pursuit, or enjoy the quiet.';
    }
    if (momentum.pace === 'Behind') {
      return 'Pace is behind this week. One completed action moves the Card more than another plan.';
    }
    if (momentum.trend === 'Rising') {
      return 'Trend is rising. Protect the streak of evidence — finish a priority before noon if you can.';
    }
    return `This week: ${momentum.week.completed}/${momentum.week.target} evidence steps. Stay ${momentum.pace.toLowerCase()}.`;
  }, [personaComplete, priorities.length, momentum]);

  const closeSheet = () => {
    setSheet(null);
    setEvidenceNote('');
  };

  const confirmComplete = async () => {
    if (!sheet) return;
    const { item } = sheet;
    await toggleAction(item.pursuitId, item.milestoneId, item.action.id);
    closeSheet();
  };

  return (
    <Screen title="Today" subtitle="Momentum, week, priorities" scroll>
      {!personaComplete ? (
        <Card>
          <Text style={styles.warnTitle}>Persona incomplete</Text>
          <Text style={styles.warnBody}>
            Role and becoming are required before the Card loop is meaningful.
          </Text>
          <Link href="/(tabs)/profile" asChild>
            <Pressable>
              <Text style={styles.link}>Complete persona →</Text>
            </Pressable>
          </Link>
        </Card>
      ) : (
        <Card style={styles.momentumCard}>
          <Text style={styles.label}>Momentum</Text>
          <View style={styles.pillRow}>
            <PacePill pace={momentum.pace} />
            <TrendPill trend={momentum.trend} />
          </View>
          {persona?.role ? (
            <Text style={styles.personaLine}>
              {persona.role}
              {persona.becoming ? ` · becoming ${persona.becoming}` : ''}
            </Text>
          ) : null}
        </Card>
      )}

      <Text style={styles.section}>This week</Text>
      <Card>
        <ProgressBar
          completed={momentum.week.completed}
          total={momentum.week.target}
          label="Evidence vs week target"
        />
      </Card>

      <Text style={styles.section}>Priority actions</Text>
      {priorities.length === 0 ? (
        <EmptyState
          title="Nothing queued"
          body="Open a pursuit and add a checkable action — it shows up here."
        />
      ) : (
        priorities.slice(0, 5).map((item) => (
          <Card key={item.action.id}>
            <Text style={styles.actionTitle}>{item.action.title}</Text>
            <Text style={styles.meta}>{item.pursuitTitle}</Text>
            <View style={styles.actionBtns}>
              <Pressable
                style={styles.miniBtn}
                onPress={() => setSheet({ mode: 'complete', item })}
              >
                <Text style={styles.miniBtnText}>Complete</Text>
              </Pressable>
              <Pressable
                style={[styles.miniBtn, styles.miniBtnGhost]}
                onPress={() => setSheet({ mode: 'reschedule', item })}
              >
                <Text style={[styles.miniBtnText, styles.miniBtnGhostText]}>Reschedule</Text>
              </Pressable>
              <Link href={`/pursuit/${item.pursuitId}`} asChild>
                <Pressable style={[styles.miniBtn, styles.miniBtnGhost]}>
                  <Text style={[styles.miniBtnText, styles.miniBtnGhostText]}>Open</Text>
                </Pressable>
              </Link>
            </View>
          </Card>
        ))
      )}

      <Text style={styles.section}>Insight</Text>
      <Card style={styles.insightCard}>
        <Text style={styles.insight}>{insight}</Text>
      </Card>

      <Modal visible={!!sheet} animationType="slide" transparent onRequestClose={closeSheet}>
        <Pressable style={styles.modalBackdrop} onPress={closeSheet}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {sheet?.mode === 'complete' ? (
              <>
                <Text style={styles.sheetTitle}>Complete with evidence</Text>
                <Text style={styles.sheetBody}>{sheet.item.action.title}</Text>
                <TextInput
                  style={styles.evidenceInput}
                  placeholder="Optional note (stub — stored locally later)"
                  placeholderTextColor={colors.textDim}
                  value={evidenceNote}
                  onChangeText={setEvidenceNote}
                  multiline
                />
                <Button title="Mark complete" onPress={confirmComplete} />
                <Button title="Cancel" variant="ghost" onPress={closeSheet} />
              </>
            ) : sheet?.mode === 'reschedule' ? (
              <>
                <Text style={styles.sheetTitle}>Reschedule</Text>
                <Text style={styles.sheetBody}>
                  Stub: “{sheet.item.action.title}” stays open. Full scheduling lands later.
                </Text>
                <Button title="Got it" onPress={closeSheet} />
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label, marginBottom: spacing[8] },
  section: { ...typography.heading, marginTop: spacing[8], marginBottom: spacing[8] },
  momentumCard: { borderColor: colors.foil },
  pillRow: { flexDirection: 'row', gap: spacing[8], marginBottom: spacing[12] },
  personaLine: { ...typography.caption, color: colors.slate },
  actionTitle: { ...typography.heading },
  meta: { ...typography.caption, marginTop: spacing[4], marginBottom: spacing[12] },
  actionBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[8] },
  miniBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[8],
    borderRadius: radius.sm,
  },
  miniBtnGhost: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  miniBtnText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textOnAccent,
  },
  miniBtnGhostText: { color: colors.ink },
  insightCard: { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
  insight: { ...typography.body, color: colors.slate },
  warnTitle: { ...typography.heading, color: colors.warning },
  warnBody: { ...typography.caption, marginTop: spacing[8], marginBottom: spacing[8] },
  link: { ...typography.body, color: colors.accent, fontWeight: '600' },
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
