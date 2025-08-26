import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChefHat, Flame, Beef, Wheat } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMedicalStore } from '@/store/medicalStore';
import { MedicalCondition } from '@/types/medical';
import { apiService } from '@/services/api';

interface Prefs {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: number;
  restrictions: string[];
}

export default function CreateMealPlanScreen() {
  const router = useRouter();
  const medicalProfile = useMedicalStore((s) => s.medicalProfile);
  const [calories, setCalories] = useState<string>('2200');
  const [protein, setProtein] = useState<string>('150');
  const [carbs, setCarbs] = useState<string>('220');
  const [fat, setFat] = useState<string>('70');
  const [meals, setMeals] = useState<string>('5');
  const [loading, setLoading] = useState<boolean>(false);

  const restrictions = useMemo<string[]>(() => {
    const conditions = medicalProfile?.conditions ?? [];
    const normalized = conditions.map((c: MedicalCondition) => c.name.toLowerCase());
    const r: string[] = [];
    if (normalized.some((n) => n.includes('diabetes') || n.includes('pre-diabetes') || n.includes('prediabetes'))) r.push('low-glycemic', 'controlled-carbs', 'no-added-sugar', 'high-fiber');
    if (normalized.some((n) => n.includes('hypertension') || n.includes('blood pressure'))) r.push('low-sodium', 'dash-diet');
    if (normalized.some((n) => n.includes('kidney'))) r.push('renal-friendly');
    if (normalized.some((n) => n.includes('celiac') || n.includes('gluten'))) r.push('gluten-free');
    if (normalized.some((n) => n.includes('lactose') || n.includes('dairy'))) r.push('dairy-free');
    return Array.from(new Set(r));
  }, [medicalProfile?.conditions]);

  const onCreate = async () => {
    setLoading(true);
    try {
      const prefs: Prefs = {
        calories: Number(calories || '0'),
        protein: Number(protein || '0'),
        carbs: Number(carbs || '0'),
        fat: Number(fat || '0'),
        meals: Number(meals || '0'),
        restrictions,
      };
      console.log('Creating custom meal plan', prefs);
      const plan = await apiService.generateMealPlan(prefs);
      router.replace({ pathname: '/meals/plan', params: { planData: JSON.stringify(plan) } });
    } catch (e) {
      console.error('Create custom plan failed', e);
      Alert.alert('Error', 'Could not create meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="create-meal-plan">
      <Stack.Screen options={{ title: 'Create Custom Plan' }} />

      <Card style={styles.card}>
        <Text style={styles.label}>Daily Calories</Text>
        <Input keyboardType="numeric" value={calories} onChangeText={setCalories} testID="calories-input" />
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Protein (g)</Text>
            <Input keyboardType="numeric" value={protein} onChangeText={setProtein} testID="protein-input" />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Carbs (g)</Text>
            <Input keyboardType="numeric" value={carbs} onChangeText={setCarbs} testID="carbs-input" />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Fat (g)</Text>
            <Input keyboardType="numeric" value={fat} onChangeText={setFat} testID="fat-input" />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Meals per day</Text>
            <Input keyboardType="numeric" value={meals} onChangeText={setMeals} testID="meals-input" />
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Auto-applied restrictions</Text>
        <Text style={styles.restrictions} numberOfLines={3}>
          {restrictions.length > 0 ? restrictions.join(' • ') : 'None'}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Flame size={16} color={colors.accent.primary} />
            <Text style={styles.statText}>{calories || '0'} cal</Text>
          </View>
          <View style={styles.stat}>
            <Beef size={16} color={colors.accent.secondary} />
            <Text style={styles.statText}>{protein || '0'} g</Text>
          </View>
          <View style={styles.stat}>
            <Wheat size={16} color={colors.status.warning} />
            <Text style={styles.statText}>{carbs || '0'} g</Text>
          </View>
        </View>
      </Card>

      <Button title={loading ? 'Creating...' : 'Create Plan'} onPress={onCreate} disabled={loading} icon={<ChefHat size={18} color={colors.text.primary} />} testID="create-plan-btn" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { padding: 16, gap: 16 },
  card: { padding: 16 },
  label: { fontSize: 13, color: colors.text.secondary, marginBottom: 6 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text.primary, marginBottom: 8 },
  restrictions: { fontSize: 13, color: colors.text.secondary },
  statsRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 12, color: colors.text.secondary },
});