import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { spacing, typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { personaCompleteness } from '@/lib/persona';

export default function ProfilePersonaScreen() {
  const { persona, session, savePersona, signOut } = useApp();
  const [role, setRole] = useState(persona?.role ?? '');
  const [becoming, setBecoming] = useState(persona?.becoming ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRole(persona?.role ?? '');
    setBecoming(persona?.becoming ?? '');
  }, [persona?.role, persona?.becoming]);

  const completeness = personaCompleteness({
    role,
    becoming,
    updatedAt: persona?.updatedAt ?? '',
  });

  const onSave = async () => {
    if (!completeness.complete) return;
    await savePersona({ role, becoming });
    setSaved(true);
  };

  return (
    <Screen title="Persona" subtitle="Role + becoming required" scroll>
      <Card>
        <Text style={styles.meta}>
          Completeness: {completeness.filled}/{completeness.total}
          {completeness.complete ? ' · ready' : ` · missing ${completeness.missing.join(', ')}`}
        </Text>
        <Text style={styles.session}>
          Session: {session?.mode}
          {session?.email ? ` · ${session.email}` : ''}
        </Text>
      </Card>

      <TextField
        label="Role"
        value={role}
        onChangeText={(t) => {
          setSaved(false);
          setRole(t);
        }}
        placeholder="e.g. Product designer"
        hint="Who you are in the work you do now."
      />
      <TextField
        label="Becoming"
        value={becoming}
        onChangeText={(t) => {
          setSaved(false);
          setBecoming(t);
        }}
        placeholder="e.g. A founder who ships clarity"
        multiline
        style={{ minHeight: 88, textAlignVertical: 'top' }}
        hint="The identity you are building evidence toward."
      />

      <Button
        title={saved ? 'Saved' : 'Save persona'}
        onPress={onSave}
        disabled={!completeness.complete}
      />

      <View style={styles.spacer} />
      <Button title="Sign out / reset local data" variant="danger" onPress={() => signOut()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: { ...typography.body, marginBottom: spacing[4] },
  session: { ...typography.caption },
  spacer: { height: spacing[24] },
});
