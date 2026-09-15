import { StyleSheet, Text } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/constants/theme';

/** Hidden from tab bar — Card (2b) is the score surface. Kept for route safety. */
export default function ProgressStubScreen() {
  return (
    <Screen title="Progress" subtitle="Moved to Card" scroll>
      <Text style={styles.body}>
        Charts and deeper analytics land later. Pace, trend, OVR, and category stats live on the
        ATYN Card and Today.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { ...typography.body, color: colors.textMuted, lineHeight: 24, marginTop: spacing[8] },
});
