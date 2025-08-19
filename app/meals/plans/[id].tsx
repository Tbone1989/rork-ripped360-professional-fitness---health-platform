import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Star, Flame, Calendar, ChefHat } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PlanDetails {
  id: string;
  name: string;
  description: string;
  duration: string;
  calories: number;
  mealsPerDay: number;
  rating?: number;
}

export default function MealPlanDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : undefined;

  const plan: PlanDetails = useMemo(() => ({
    id: id ?? 'plan',
    name: 'Meal Plan',
    description: 'Detailed meal plan overview',
    duration: '4 weeks',
    calories: 2400,
    mealsPerDay: 6,
    rating: 4.7,
  }), [id]);

  return (
    <ScrollView style={styles.container} testID="meal-plan-details">
      <Stack.Screen options={{ title: plan.name }} />

      <Card style={styles.headerCard} testID="plan-header-card">
        <Text style={styles.title}>{plan.name}</Text>
        <Text style={styles.description}>{plan.description}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Calendar size={16} color={colors.text.secondary} />
            <Text style={styles.metaText}>{plan.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Flame size={16} color={colors.text.secondary} />
            <Text style={styles.metaText}>{plan.calories} cal/day</Text>
          </View>
          <View style={styles.metaItem}>
            <ChefHat size={16} color={colors.text.secondary} />
            <Text style={styles.metaText}>{plan.mealsPerDay} meals/day</Text>
          </View>
          {typeof plan.rating === 'number' && (
            <View style={styles.metaItem}>
              <Star size={16} color={colors.status.warning} />
              <Text style={styles.metaText}>{plan.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </Card>

      <Card style={styles.ctaCard} testID="plan-cta-card">
        <Button title="Start This Plan" onPress={() => { console.log('Start plan', plan.id); router.push({ pathname: '/meals/plan', params: { planId: plan.id } }); }} testID="start-plan-button" />
        <View style={styles.ctaSpacer} />
        <Button title="Preview Day 1" variant="outline" onPress={() => { console.log('Preview Day 1', plan.id); router.push({ pathname: '/meals/plan', params: { planId: plan.id, preview: '1' } }); }} testID="preview-day-button" />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerCard: {
    margin: 16,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  ctaCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  ctaSpacer: {
    height: 12,
  },
});