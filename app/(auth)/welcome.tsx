import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function WelcomeScreen() {
  const { enterDemo, stubAppleSignIn } = useApp();

  return (
    <Screen title="ATYN" subtitle="Persona → Pursuits → Card" scroll>
      <Text style={styles.lead}>
        Local-first v1. Demo mode works without Supabase keys. Auth below is stubbed for future
        magic link + Apple Sign In.
      </Text>

      <View style={styles.stack}>
        <Button title="Continue in demo mode" onPress={() => enterDemo()} />
        <Link href="/(auth)/email" asChild>
          <Button title="Email magic link (stub)" variant="secondary" />
        </Link>
        <Button title="Continue with Apple (stub)" variant="secondary" onPress={() => stubAppleSignIn()} />
      </View>

      <Text style={styles.footnote}>
        Demo persists persona and pursuits in AsyncStorage on this device.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg, lineHeight: 24 },
  stack: { gap: spacing.sm },
  footnote: { ...typography.caption, marginTop: spacing.lg },
});
