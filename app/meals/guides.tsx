import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Utensils, Salad, Sandwich, Info } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { restaurantGuide, foodBasics, smartSwaps } from '@/constants/nutritionGuides';

export default function MealGuidesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="MealGuidesScreen">
      <Stack.Screen options={{ title: 'Eating Out & Food Basics' }} />

      <Card style={styles.headerCard}>
        <View style={styles.row}>
          <Utensils size={20} color={colors.accent.primary} />
          <Text style={styles.title}>Ordering at Restaurants</Text>
        </View>
        <Text style={styles.subtitle}>{restaurantGuide.description ?? ''}</Text>
      </Card>

      <Card style={styles.sectionCard}>
        {restaurantGuide.tips.map((t, i) => (
          <Text key={i} style={styles.bullet}>• {t}</Text>
        ))}
      </Card>

      <Card style={styles.headerCard}>
        <View style={styles.row}>
          <Salad size={20} color={colors.accent.primary} />
          <Text style={styles.title}>{foodBasics.title}</Text>
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        {foodBasics.items.map((it) => (
          <View key={it.id} style={styles.itemBlock}>
            <Text style={styles.itemTitle}>{it.name}</Text>
            <Text style={styles.itemLine}>Best for: {it.bestFor.join(', ')}</Text>
            {it.watchouts?.length ? (
              <Text style={styles.itemLine}>Watch-outs: {it.watchouts.join('; ')}</Text>
            ) : null}
            {it.notes?.length ? (
              <Text style={styles.itemLine}>Notes: {it.notes.join('; ')}</Text>
            ) : null}
          </View>
        ))}
      </Card>

      <Card style={styles.headerCard}>
        <View style={styles.row}>
          <Sandwich size={20} color={colors.accent.primary} />
          <Text style={styles.title}>{smartSwaps.title}</Text>
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        {smartSwaps.tips.map((t, i) => (
          <Text key={i} style={styles.bullet}>• {t}</Text>
        ))}
      </Card>

      <View style={styles.footerSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: 16,
  },
  headerCard: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  sectionCard: {
    padding: 12,
    marginBottom: 12,
  },
  bullet: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 8,
  },
  itemBlock: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  itemLine: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  footerSpace: {
    height: 24,
  },
});
