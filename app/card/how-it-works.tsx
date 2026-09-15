import { StyleSheet, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/constants/theme';

export default function HowItWorksScreen() {
  return (
    <Screen title="How it works" subtitle="Card scoring, plainly" scroll>
      <Card>
        <Text style={styles.h}>Persona</Text>
        <Text style={styles.p}>
          Role + becoming define the name on the Card. ATYN never invents who you are.
        </Text>
      </Card>
      <Card>
        <Text style={styles.h}>Pursuits → evidence</Text>
        <Text style={styles.p}>
          Actions you complete are evidence. Categories (Body, Mind, Craft, Wealth, Bond, Grit)
          rise from that work and soft keyword bias — not from self-grading.
        </Text>
      </Card>
      <Card>
        <Text style={styles.h}>OVR</Text>
        <Text style={styles.p}>
          Overall is the average of the six category scores (0–99). Momentum pills show pace
          (Ahead / On track / Behind) and trend (Rising / Steady / Slipping).
        </Text>
      </Card>
      <Card>
        <Text style={styles.h}>Share</Text>
        <Text style={styles.p}>
          Share is optional. Build in private; show when the Card feels true.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h: { ...typography.heading, marginBottom: spacing[8] },
  p: { ...typography.body, color: colors.slate },
});
