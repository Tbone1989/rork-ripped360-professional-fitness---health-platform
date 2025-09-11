import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Bed, HeartPulse, Activity, Sparkles, CalendarClock } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Metrics {
  sleepHours: string;
  hrv: string;
  restingHr: string;
  soreness: 'low' | 'moderate' | 'high';
  rpe: string;
  notes: string;
}

const sorenessOptions: Array<{ id: Metrics['soreness']; label: string }> = [
  { id: 'low', label: 'Low' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'high', label: 'High' },
];

export default function SleepRecoveryAIScreen() {
  const [metrics, setMetrics] = useState<Metrics>({ sleepHours: '', hrv: '', restingHr: '', soreness: 'moderate', rpe: '', notes: '' });
  const [plan, setPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const canGenerate = useMemo(() => {
    return metrics.sleepHours.trim().length > 0 && !isLoading;
  }, [metrics.sleepHours, isLoading]);

  const setField = useCallback(<K extends keyof Metrics>(key: K, value: Metrics[K]) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleGenerate = useCallback(async () => {
    try {
      setIsLoading(true);
      setPlan('');
      const prompt = `You are a bodybuilding recovery coach. Create a personalized sleep and recovery plan.\nMetrics: sleep=${metrics.sleepHours}h, HRV=${metrics.hrv || 'n/a'}, RestingHR=${metrics.restingHr || 'n/a'}, Soreness=${metrics.soreness}, RPE=${metrics.rpe || 'n/a'}.\nNotes: ${metrics.notes}.\nReturn sections: Summary, Today\'s Readiness (1-5), Training Adjustment, Sleep Plan (bedtime, routine), Recovery (mobility, sauna/cold, steps), Nutrition & Supplements, Red Flags. Keep it concise.`;
      const res = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You optimize recovery for physique athletes. Be direct and actionable.' },
            { role: 'user', content: prompt },
          ],
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to generate');
      }
      const data = (await res.json()) as { completion?: string };
      setPlan(data?.completion ?? 'No plan returned.');
    } catch (e) {
      console.error('[SleepRecoveryAI] generate error', e);
      Alert.alert('Generation failed', 'Could not generate your plan. Try again.');
    } finally {
      setIsLoading(false);
    }
  }, [metrics]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sleep & Recovery AI' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.hero}>
          <View style={styles.heroIcon}>
            <Bed size={20} color={colors.accent.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Daily Recovery Check-in</Text>
            <Text style={styles.heroSubtitle}>Get an adaptive plan based on sleep and recovery metrics.</Text>
          </View>
        </Card>

        <Card style={styles.form}>
          <Text style={styles.label}>Sleep last night (hours)</Text>
          <Input value={metrics.sleepHours} onChangeText={(t) => setField('sleepHours', t)} keyboardType="numeric" placeholder="e.g., 7.5" />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>HRV</Text>
              <Input value={metrics.hrv} onChangeText={(t) => setField('hrv', t)} keyboardType="numeric" placeholder="ms" />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Resting HR</Text>
              <Input value={metrics.restingHr} onChangeText={(t) => setField('restingHr', t)} keyboardType="numeric" placeholder="bpm" />
            </View>
          </View>

          <Text style={styles.label}>Muscle soreness</Text>
          <View style={styles.chips}>
            {sorenessOptions.map(opt => {
              const active = metrics.soreness === opt.id;
              return (
                <TouchableOpacity key={opt.id} style={[styles.chip, active && styles.chipActive]} onPress={() => setField('soreness', opt.id)}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Session RPE (last workout)</Text>
          <Input value={metrics.rpe} onChangeText={(t) => setField('rpe', t)} keyboardType="numeric" placeholder="1-10" />

          <Text style={styles.label}>Notes</Text>
          <Input value={metrics.notes} onChangeText={(t) => setField('notes', t)} multiline style={styles.notes} placeholder="Injuries, stress, travel…" />

          <Button title={isLoading ? 'Analyzing…' : 'Generate Recovery Plan'} onPress={handleGenerate} disabled={!canGenerate} icon={<HeartPulse size={16} color={colors.text.tertiary} />} />
        </Card>

        {isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.accent.primary} />
            <Text style={styles.loadingText}>Crunching your data…</Text>
          </View>
        )}

        {plan ? (
          <Card style={styles.plan}>
            <View style={styles.planHeader}>
              <Activity size={18} color={colors.accent.primary} />
              <Text style={styles.planTitle}>Today&apos;s Plan</Text>
            </View>
            <Text style={styles.planText}>{plan}</Text>
            <View style={styles.planFooter}>
              <CalendarClock size={14} color={colors.text.secondary} />
              <Text style={styles.planFooterText}>Re-run daily for updates</Text>
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
  hero: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background.tertiary, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: colors.text.primary, fontSize: 16, fontWeight: '700' },
  heroSubtitle: { color: colors.text.secondary, marginTop: 2 },
  form: { padding: 16, gap: 10 },
  label: { color: colors.text.primary, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  row: { flexDirection: 'row', gap: 10 },
  col: { flex: 1 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: colors.background.secondary, borderWidth: 1, borderColor: colors.border.light },
  chipActive: { backgroundColor: colors.accent.primary },
  chipText: { color: colors.text.secondary, fontWeight: '600', fontSize: 12 },
  chipTextActive: { color: colors.text.primary },
  notes: { minHeight: 80, textAlignVertical: 'top' as const },
  loading: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 },
  loadingText: { color: colors.text.secondary },
  plan: { padding: 16, gap: 8 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planTitle: { color: colors.text.primary, fontWeight: '700' },
  planText: { color: colors.text.secondary, lineHeight: 20 },
  planFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  planFooterText: { color: colors.text.secondary, fontSize: 12 },
});
