import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function EmailAuthScreen() {
  const { stubEmailSignIn } = useApp();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSend = async () => {
    if (!email.trim()) return;
    setSent(true);
    await stubEmailSignIn(email);
  };

  return (
    <Screen title="Magic link" subtitle="Stub — signs you in locally" scroll>
      <Text style={styles.note}>
        No email is sent. This placeholder stores a local session so the Persona → Pursuits → Card
        loop works without API keys.
      </Text>
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
        autoCorrect={false}
      />
      <View style={styles.actions}>
        <Button title={sent ? 'Signed in (local)' : 'Send magic link (stub)'} onPress={onSend} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { ...typography.caption, marginBottom: spacing[16], lineHeight: 20 },
  actions: { marginTop: spacing[8] },
});
