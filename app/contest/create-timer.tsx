import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Plus, Trash2, Save, ChevronLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useContestStore } from '@/store/contestStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface PoseRow {
  id: string;
  name: string;
  duration: string;
  rest: string;
}

export default function CreateTimerScreen() {
  const { createPosingTimer } = useContestStore();
  const [name, setName] = useState<string>('');
  const [rounds, setRounds] = useState<string>('3');
  const [poses, setPoses] = useState<PoseRow[]>([{
    id: `${Date.now()}-0`,
    name: '',
    duration: '15',
    rest: '5',
  }]);

  const addPose = useCallback(() => {
    console.log('[CreateTimer] addPose');
    setPoses(prev => [...prev, { id: `${Date.now()}-${prev.length}`, name: '', duration: '10', rest: '5' }]);
  }, []);

  const removePose = useCallback((id: string) => {
    console.log('[CreateTimer] removePose', id);
    setPoses(prev => prev.filter(p => p.id !== id));
  }, []);

  const updatePose = useCallback((id: string, field: keyof PoseRow, value: string) => {
    console.log('[CreateTimer] updatePose', { id, field, value });
    setPoses(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  }, []);

  const totalPerRound = useMemo(() => {
    const total = poses.reduce((acc, p) => {
      const d = Number.parseInt(p.duration || '0', 10) || 0;
      const r = Number.parseInt(p.rest || '0', 10) || 0;
      return acc + d + r;
    }, 0);
    return total;
  }, [poses]);

  const onSave = useCallback(() => {
    try {
      console.log('[CreateTimer] onSave');
      const r = Math.max(1, Number.parseInt(rounds || '1', 10) || 1);
      const cleanedPoses = poses
        .map(p => ({ name: p.name.trim(), duration: Math.max(1, Number.parseInt(p.duration || '0', 10) || 0), rest: Math.max(0, Number.parseInt(p.rest || '0', 10) || 0) }))
        .filter(p => p.name.length > 0 && p.duration > 0);

      if (!name.trim()) {
        Alert.alert('Missing name', 'Please enter a timer name.');
        return;
      }
      if (cleanedPoses.length === 0) {
        Alert.alert('Add poses', 'Please add at least one pose with a duration.');
        return;
      }

      const totalDuration = r * cleanedPoses.reduce((acc, p) => acc + p.duration + p.rest, 0);

      createPosingTimer({
        name: name.trim(),
        poses: cleanedPoses,
        rounds: r,
        totalDuration,
      });

      Alert.alert('Saved', 'Your timer has been created.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e) {
      console.error('[CreateTimer] save error', e);
      Alert.alert('Error', 'Failed to create timer. Please try again.');
    }
  }, [createPosingTimer, name, poses, rounds]);

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Stack.Screen options={{
          title: 'New Posing Timer',
          headerLeft: () => (
            <TouchableOpacity accessibilityRole="button" onPress={() => router.back()} testID="back-button" style={styles.iconBtn}>
              <ChevronLeft size={22} color={colors.text.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity accessibilityRole="button" onPress={onSave} testID="save-button" style={styles.iconBtn}>
              <Save size={20} color={colors.accent.primary} />
            </TouchableOpacity>
          )
        }} />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Text style={styles.label}>Timer Name</Text>
            <TextInput
              testID="timer-name"
              style={styles.input}
              placeholder="e.g., Mandatory Poses Drill"
              placeholderTextColor={colors.text.tertiary}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, { marginTop: 16 as const }]}>Rounds</Text>
            <TextInput
              testID="timer-rounds"
              style={styles.input}
              keyboardType="number-pad"
              value={rounds}
              onChangeText={setRounds}
            />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Per-round est.</Text>
              <Text style={styles.summaryValue}>{Math.max(0, totalPerRound)}s</Text>
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Poses</Text>
              <TouchableOpacity onPress={addPose} testID="add-pose" style={styles.addPoseBtn}>
                <Plus size={18} color={colors.accent.primary} />
                <Text style={styles.addPoseText}>Add Pose</Text>
              </TouchableOpacity>
            </View>

            {poses.map((p, idx) => (
              <View key={p.id} style={styles.poseRow} testID={`pose-row-${idx}`}>
                <View style={styles.poseMain}>
                  <TextInput
                    testID={`pose-name-${idx}`}
                    style={styles.input}
                    placeholder={`Pose name #${idx + 1}`}
                    placeholderTextColor={colors.text.tertiary}
                    value={p.name}
                    onChangeText={(t) => updatePose(p.id, 'name', t)}
                  />
                  <View style={styles.inlineInputs}>
                    <View style={styles.inlineField}>
                      <Text style={styles.smallLabel}>Duration (s)</Text>
                      <TextInput
                        testID={`pose-duration-${idx}`}
                        style={styles.input}
                        keyboardType="number-pad"
                        value={p.duration}
                        onChangeText={(t) => updatePose(p.id, 'duration', t)}
                      />
                    </View>
                    <View style={styles.inlineField}>
                      <Text style={styles.smallLabel}>Rest (s)</Text>
                      <TextInput
                        testID={`pose-rest-${idx}`}
                        style={styles.input}
                        keyboardType="number-pad"
                        value={p.rest}
                        onChangeText={(t) => updatePose(p.id, 'rest', t)}
                      />
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removePose(p.id)} accessibilityLabel={`Remove pose ${idx + 1}`} style={styles.removeBtn} testID={`remove-pose-${idx}`}>
                  <Trash2 size={18} color={colors.status.error} />
                </TouchableOpacity>
              </View>
            ))}
          </Card>

          <Button testID="save-timer" title="Save Timer" onPress={onSave} />
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  smallLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addPoseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.accent.primary + '10',
  },
  addPoseText: {
    color: colors.accent.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  poseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  poseMain: {
    flex: 1,
    gap: 10,
  },
  inlineInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  inlineField: {
    flex: 1,
  },
  removeBtn: {
    padding: 8,
    alignSelf: 'center',
  },
  iconBtn: {
    padding: 6,
  },
  summaryRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryText: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  summaryValue: {
    color: colors.accent.primary,
    fontWeight: '700',
  },
});