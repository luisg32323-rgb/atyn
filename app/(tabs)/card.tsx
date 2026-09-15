import { Link } from 'expo-router';
import { useMemo } from 'react';
import { Alert, Share, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { PacePill, TrendPill } from '@/components/ui/StatusPill';
import { colors, fonts, radius, spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { cardDisplayName, computeCategoryStats, computeOvr } from '@/lib/cardStats';
import { momentumSummary } from '@/lib/status';

export default function AtYnCardScreen() {
  const { persona, personaComplete, pursuits } = useApp();
  const stats = useMemo(
    () => computeCategoryStats(pursuits, persona),
    [pursuits, persona],
  );
  const ovr = computeOvr(stats);
  const name = cardDisplayName(persona);
  const momentum = useMemo(() => momentumSummary(pursuits), [pursuits]);

  const onShare = async () => {
    try {
      const lines = stats.map((s) => `${s.label} ${s.value}`).join(' · ');
      await Share.share({
        message: `ATYN Card — ${name}\nOVR ${ovr}\n${lines}\n${momentum.pace} · ${momentum.trend}`,
      });
    } catch {
      Alert.alert('Share unavailable', 'Could not open the system share sheet.');
    }
  };

  if (!personaComplete) {
    return (
      <Screen title="Card" subtitle="Name, OVR, six stats" scroll>
        <EmptyState
          title="Persona required"
          body="Complete role + becoming on the Persona tab. The Card never invents who you are."
        />
        <Link href="/(tabs)/profile" asChild>
          <Button title="Go to Persona" />
        </Link>
      </Screen>
    );
  }

  if (pursuits.length === 0) {
    return (
      <Screen title="Card" subtitle="Name, OVR, six stats" scroll>
        <EmptyState
          title="No evidence yet"
          body="Add a pursuit and complete actions — categories fill from real work, not vibes."
        />
        <Link href="/pursuit/new" asChild>
          <Button title="New pursuit" />
        </Link>
        <Link href="/card/how-it-works" asChild>
          <Button title="How it works" variant="ghost" />
        </Link>
      </Screen>
    );
  }

  return (
    <Screen title="Card" subtitle="Shareable identity score" scroll>
      <View style={styles.atynCard}>
        <View style={styles.cardTop}>
          <Text style={styles.brand}>ATYN</Text>
          <View style={styles.pillRow}>
            <PacePill pace={momentum.pace} />
            <TrendPill trend={momentum.trend} />
          </View>
        </View>

        <Text style={styles.label}>Name</Text>
        <Text style={styles.name}>{name}</Text>
        {persona?.becoming ? (
          <Text style={styles.becoming}>{persona.becoming}</Text>
        ) : null}

        <View style={styles.ovrBlock}>
          <Text style={styles.label}>OVR</Text>
          <Text style={styles.ovr}>{ovr}</Text>
        </View>

        <View style={styles.statGrid}>
          {stats.map((s) => (
            <View key={s.key} style={styles.statCell}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Share" onPress={onShare} />
        <Link href="/card/how-it-works" asChild>
          <Button title="How it works" variant="secondary" />
        </Link>
        <Link href="/card/breakdown" asChild>
          <Button title="Breakdown" variant="ghost" />
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  atynCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.accent,
    padding: spacing[24],
    marginBottom: spacing[16],
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[16],
    gap: spacing[8],
  },
  brand: { ...typography.label, color: colors.accent },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4], justifyContent: 'flex-end' },
  label: { ...typography.label },
  name: { ...typography.title, marginTop: spacing[4] },
  becoming: { ...typography.body, color: colors.foil, marginTop: spacing[4] },
  ovrBlock: { marginTop: spacing[20], marginBottom: spacing[16] },
  ovr: { ...typography.numeral, color: colors.accent, marginTop: spacing[4] },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing[4],
  },
  statCell: {
    width: '33.33%',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[12],
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.mono,
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
  },
  statLabel: { ...typography.label, marginTop: spacing[4], color: colors.textMuted },
  actions: { gap: spacing[8] },
});
