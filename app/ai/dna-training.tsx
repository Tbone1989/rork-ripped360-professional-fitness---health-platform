import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Dumbbell, Dna, FileText, Sparkles, ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface MarkerInput {
  marker: string;
  value: string;
}

export default function DNATrainingScreen() {
  const [markers, setMarkers] = useState<MarkerInput[]>([{ marker: '', value: '' }]);
  const [goal, setGoal] = useState<string>('hypertrophy');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plan, setPlan] = useState<string>('');

  const canGenerate = useMemo(() => {
    const anyMarker = markers.some(m => m.marker.trim().length > 0 && m.value.trim().length > 0);
    return anyMarker && goal.trim().length > 0 && !isLoading;
  }, [markers, goal, isLoading]);

  const updateMarker = useCallback((index: number, key: keyof MarkerInput, value: string) => {
    setMarkers(prev => prev.map((m, i) => (i === index ? { ...m, [key]: value } : m)));
  }, []);

  const addMarker = useCallback(() => {
    setMarkers(prev => [...prev, { marker: '', value: '' }]);
  }, []);

  const removeMarker = useCallback((index: number) => {
    setMarkers(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleGenerate = useCallback(async () => {
    try {
      setIsLoading(true);
      setPlan('');

      const summary = markers
        .filter(m => m.marker.trim() && m.value.trim())
        .map(m => `${m.marker}: ${m.value}`)
        .join(', ');

      const prompt = `Create a DNA-informed training plan for bodybuilding.\nGoal: ${goal}.\nDNA markers: ${summary}.\nNotes: ${notes}.\nReturn clear sections: Overview, Weekly Split, Exercise Selection, Volume/Intensity, Recovery, Nutrition, Risks & Adjustments. Use concise bullet points.`;

      const res = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are an elite bodybuilding coach and exercise scientist. Keep outputs concise, structured, and actionable.' },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to generate');
      }
      const data = (await res.json()) as { completion?: string };
      setPlan(data?.completion ?? 'No plan generated.');
    } catch (err: unknown) {
      console.error('[DNA Training] Generate error', err);
      Alert.alert('Generation failed', 'Could not generate plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [markers, goal, notes]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'DNA-based Training' }} />

      <ScrollView contentContainerStyle={styles.content} testID="dna-training-scroll">
        <Card style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Dna size={24} color={colors.accent.primary} />
            <Text style={styles.title}>DNA-based Programming</Text>
          </View>
          <Text style={styles.subtitle}>
            Enter key markers (e.g., ACTN3, ACE, COL5A1) with your genotype to tailor training.
          </Text>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Goal</Text>
          <Input
            placeholder="e.g., hypertrophy, strength, fat loss"
            value={goal}
            onChangeText={setGoal}
            testID="goal-input"
          />

          <View style={styles.sectionSpacer} />
          <Text style={styles.sectionTitle}>DNA Markers</Text>
          {markers.map((m, i) => (
            <View key={i} style={styles.markerRow} testID={`marker-row-${i}`}>
              <Input
                placeholder="Marker (e.g., ACTN3)"
                value={m.marker}
                onChangeText={(t) => updateMarker(i, 'marker', t)}
                style={styles.markerInput}
              />
              <Input
                placeholder="Value (e.g., RR)"
                value={m.value}
                onChangeText={(t) => updateMarker(i, 'value', t)}
                style={styles.valueInput}
              />
              {markers.length > 1 && (
                <TouchableOpacity onPress={() => removeMarker(i)} style={styles.removeBtn} testID={`remove-marker-${i}`}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={addMarker} style={styles.addMarkerBtn} testID="add-marker">
            <Sparkles size={16} color={colors.accent.primary} />
            <Text style={styles.addMarkerText}>Add marker</Text>
          </TouchableOpacity>

          <View style={styles.sectionSpacer} />
          <Text style={styles.sectionTitle}>Notes</Text>
          <Input
            placeholder="Injuries, training age, equipment, preferences"
            value={notes}
            onChangeText={setNotes}
            multiline
            style={styles.notesInput}
            testID="notes-input"
          />

          <Button
            title={isLoading ? 'Generating…' : 'Generate Plan'}
            onPress={handleGenerate}
            disabled={!canGenerate}
            icon={<Dumbbell size={16} color={colors.text.tertiary} />}
            style={styles.generateBtn}
            testID="generate-dna-plan"
          />
        </Card>

        {isLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.accent.primary} />
            <Text style={styles.loadingText}>Creating your plan…</Text>
          </View>
        )}

        {plan ? (
          <Card style={styles.planCard}>
            <View style={styles.planHeader}>
              <FileText size={18} color={colors.accent.primary} />
              <Text style={styles.planTitle}>Your Plan</Text>
            </View>
            <Text style={styles.planText}>{plan}</Text>
            <View style={styles.planActions}>
              <Button title="Open Smart Grocery List" onPress={() => router.push('/meals/smart-list')} rightIcon={<ChevronRight size={16} color={colors.text.primary} />} />
            </View>
          </Card>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { padding: 16, gap: 12 },
  headerCard: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { color: colors.text.primary, fontSize: 18, fontWeight: '700' },
  subtitle: { color: colors.text.secondary, marginTop: 6, lineHeight: 18 },
  formCard: { padding: 16, gap: 12 },
  sectionTitle: { color: colors.text.primary, fontSize: 14, fontWeight: '700', marginBottom: 6 },
  sectionSpacer: { height: 8 },
  markerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  markerInput: { flex: 1 },
  valueInput: { width: 100 },
  removeBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  removeText: { color: colors.status.error, fontWeight: '600', fontSize: 12 },
  addMarkerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
  addMarkerText: { color: colors.accent.primary, fontWeight: '600' },
  notesInput: { minHeight: 80, textAlignVertical: 'top' as const },
  generateBtn: { marginTop: 8 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 },
  loadingText: { color: colors.text.secondary },
  planCard: { padding: 16, gap: 8 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planTitle: { color: colors.text.primary, fontWeight: '700' },
  planText: { color: colors.text.secondary, lineHeight: 20 },
  planActions: { marginTop: 8 },
});
