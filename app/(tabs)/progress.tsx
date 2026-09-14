import { StyleSheet, Text } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/constants/theme';

export default function ProgressStubScreen() {
  return (
    <Screen title="Progress" subtitle="Stub — coming after Card v1" scroll>
      <Text style={styles.body}>
        Charts, streaks, and deeper analytics land later. For now, evidence progress lives on the
        ATYN Card (completed actions / total). Momentum remains intentionally hidden.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { ...typography.body, color: colors.textMuted, lineHeight: 24, marginTop: spacing.sm },
});
