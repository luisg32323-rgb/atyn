import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { createId } from '@/lib/id';

export default function NewPursuitScreen() {
  const { addPursuit } = useApp();
  const [title, setTitle] = useState('');
  const [why, setWhy] = useState('');
  const [milestone, setMilestone] = useState('First milestone');
  const [action, setAction] = useState('Take the first step');
  const [saving, setSaving] = useState(false);

  const canSave = title.trim().length > 0 && why.trim().length > 0;

  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const pursuit = await addPursuit({
        title,
        why,
        milestones: [
          {
            id: createId('ms'),
            title: milestone.trim() || 'First milestone',
            actions: [
              {
                id: createId('act'),
                title: action.trim() || 'Take the first step',
                done: false,
              },
            ],
          },
        ],
      });
      router.replace(`/pursuit/${pursuit.id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen scroll>
      <TextField label="Title" value={title} onChangeText={setTitle} placeholder="Ship ATYN Card v1" />
      <TextField
        label="Why"
        value={why}
        onChangeText={setWhy}
        placeholder="Because evidence compounds identity"
        multiline
        style={{ minHeight: 88, textAlignVertical: 'top' }}
      />
      <TextField
        label="First milestone"
        value={milestone}
        onChangeText={setMilestone}
        placeholder="Milestone title"
      />
      <TextField
        label="First action"
        value={action}
        onChangeText={setAction}
        placeholder="Checkable action"
      />
      <View style={styles.actions}>
        <Button title="Create pursuit" onPress={onSave} disabled={!canSave} loading={saving} />
        <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { gap: spacing.sm, marginTop: spacing.sm },
});
