import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, Plus, Camera, Calendar, TrendingUp, UtensilsCrossed, RefreshCw } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { trpc } from '@/lib/trpc';

type NutritionItem = {
  name: string;
  brand?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize?: string;
  image?: string;
};

export default function MealsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const nutritionQuery = trpc.nutrition.search.useQuery(
    { query: searchQuery.trim() },
    { enabled: searchQuery.trim().length >= 2, staleTime: 60 * 1000 }
  );

  const results: NutritionItem[] = useMemo(() => {
    const arr = Array.isArray(nutritionQuery.data) ? (nutritionQuery.data as NutritionItem[]) : [];
    return arr.slice(0, 15).map((i) => ({
      name: String(i.name ?? 'Food'),
      brand: typeof i.brand === 'string' ? i.brand : undefined,
      calories: typeof i.calories === 'number' ? i.calories : undefined,
      protein: typeof i.protein === 'number' ? i.protein : undefined,
      carbs: typeof i.carbs === 'number' ? i.carbs : undefined,
      fat: typeof i.fat === 'number' ? i.fat : undefined,
      fiber: typeof i.fiber === 'number' ? i.fiber : undefined,
      sugar: typeof i.sugar === 'number' ? i.sugar : undefined,
      sodium: typeof i.sodium === 'number' ? i.sodium : undefined,
      servingSize: typeof i.servingSize === 'string' ? i.servingSize : undefined,
      image: typeof i.image === 'string' ? i.image : undefined,
    }));
  }, [nutritionQuery.data]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} testID="meals-container">
      <Stack.Screen
        options={{
          title: 'Nutrition & Meals',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/meals/scan' as any)} testID="meals-header-scan">
                <Camera size={20} color={colors.accent.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/meals/add' as any)} testID="meals-header-add">
                <Plus size={20} color={colors.accent.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={styles.hero} testID="meals-hero">
        <Text style={styles.heroTitle}>Nutrition, made actionable</Text>
        <Text style={styles.heroSub}>Search foods, scan labels, build meal plans, and track progress.</Text>
      </View>

      <Card style={styles.searchCard} testID="meals-search-card">
        <View style={styles.searchRow}>
          <Search size={18} color={colors.text.secondary} />
          <Input
            placeholder="Search foods (e.g. chicken breast, rice…)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            testID="meals-search-input"
          />
        </View>

        {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
          <Text style={styles.hintText}>Type at least 2 characters to search.</Text>
        )}

        {nutritionQuery.isFetching && (
          <View style={styles.loadingRow} testID="meals-search-loading">
            <ActivityIndicator color={colors.accent.primary} />
            <Text style={styles.loadingText}>Searching…</Text>
          </View>
        )}

        {nutritionQuery.error && (
          <View style={styles.errorRow} testID="meals-search-error">
            <Text style={styles.errorText}>Couldn’t load results.</Text>
            <Button
              title="Retry"
              onPress={() => nutritionQuery.refetch()}
              icon={<RefreshCw size={18} color={colors.text.primary} />}
              testID="meals-search-retry"
            />
          </View>
        )}

        {results.length > 0 && (
          <View style={styles.resultsList} testID="meals-search-results">
            {results.map((r, idx) => (
              <View key={`${r.name}-${idx}`} style={styles.resultRow} testID={`meals-result-${idx}`}>
                <View style={styles.resultLeft}>
                  <Text style={styles.resultName} numberOfLines={1}>
                    {r.name}
                  </Text>
                  <Text style={styles.resultMeta} numberOfLines={1}>
                    {(r.brand ? `${r.brand} • ` : '') + (r.servingSize ?? 'serving')}
                  </Text>
                </View>
                <View style={styles.resultRight}>
                  {typeof r.calories === 'number' ? (
                    <Text style={styles.resultKcal}>{Math.round(r.calories)} kcal</Text>
                  ) : (
                    <Text style={styles.resultKcalMuted}>—</Text>
                  )}
                  <Text style={styles.resultMacros} numberOfLines={1}>
                    {`P ${Math.round(r.protein ?? 0)}  C ${Math.round(r.carbs ?? 0)}  F ${Math.round(r.fat ?? 0)}`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {!nutritionQuery.isFetching && searchQuery.trim().length >= 2 && results.length === 0 && !nutritionQuery.error && (
          <Text style={styles.hintText} testID="meals-no-results">
            No results. Try a more general search (e.g. “chicken”, “rice”, “oats”).
          </Text>
        )}
      </Card>

      <View style={styles.quickActions} testID="meals-quick-actions">
        <Button
          title="Log Food"
          onPress={() => router.push('/meals/log' as any)}
          icon={<Plus size={18} color={colors.text.primary} />}
          style={styles.actionButton}
          testID="meals-log"
        />
        <Button
          title="Meal Plans"
          variant="outline"
          onPress={() => router.push('/meals/plans' as any)}
          icon={<Calendar size={18} color={colors.accent.primary} />}
          style={styles.actionButton}
          testID="meals-plans"
        />
        <Button
          title="Progress"
          variant="outline"
          onPress={() => router.push('/meals/progress' as any)}
          icon={<TrendingUp size={18} color={colors.accent.primary} />}
          style={styles.actionButton}
          testID="meals-progress"
        />
      </View>

      <Card style={styles.featureCard} testID="meals-feature-label-reader">
        <View style={styles.featureHeader}>
          <Text style={styles.featureTitle}>Food Label Reader</Text>
          <Text style={styles.featureSub}>Scan labels for a deep nutrition breakdown.</Text>
        </View>
        <Button
          title="Scan Food Labels"
          onPress={() => router.push('/meals/label-reader' as any)}
          icon={<Camera size={18} color={colors.text.primary} />}
          testID="meals-label-reader"
        />
      </Card>

      <Card style={styles.featureCard} testID="meals-feature-guides">
        <View style={styles.featureHeader}>
          <Text style={styles.featureTitle}>Guides & Education</Text>
          <Text style={styles.featureSub}>Restaurant ordering, smart swaps, and food basics.</Text>
        </View>
        <View style={styles.featureButtonsRow}>
          <Button
            title="Open Meal Guides"
            onPress={() => router.push('/meals/guides' as any)}
            icon={<UtensilsCrossed size={18} color={colors.text.primary} />}
            style={styles.featureButton}
            testID="meals-guides"
          />
          <Button
            title="Healthy Recipes"
            variant="outline"
            onPress={() => router.push('/meals/recipes' as any)}
            icon={<UtensilsCrossed size={18} color={colors.accent.primary} />}
            style={styles.featureButton}
            testID="meals-recipes"
          />
        </View>
      </Card>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    padding: 16,
    paddingBottom: 8,
  },
  heroTitle: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  heroSub: {
    marginTop: 6,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  searchCard: {
    marginHorizontal: 16,
    padding: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  hintText: {
    marginTop: 10,
    color: colors.text.tertiary,
  },
  loadingRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.text.secondary,
    fontWeight: '600',
  },
  errorRow: {
    marginTop: 12,
    gap: 10,
  },
  errorText: {
    color: colors.status.error,
    fontWeight: '700',
  },
  resultsList: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: 12,
  },
  resultLeft: {
    flex: 1,
  },
  resultName: {
    color: colors.text.primary,
    fontWeight: '800',
  },
  resultMeta: {
    marginTop: 2,
    color: colors.text.secondary,
    fontSize: 12,
  },
  resultRight: {
    alignItems: 'flex-end',
    minWidth: 92,
  },
  resultKcal: {
    color: colors.accent.primary,
    fontWeight: '900',
  },
  resultKcalMuted: {
    color: colors.text.tertiary,
    fontWeight: '900',
  },
  resultMacros: {
    marginTop: 2,
    color: colors.text.tertiary,
    fontSize: 11,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  featureCard: {
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 12,
    padding: 16,
  },
  featureHeader: {
    marginBottom: 12,
  },
  featureTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  featureSub: {
    marginTop: 4,
    color: colors.text.secondary,
  },
  featureButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  featureButton: {
    flex: 1,
  },
  bottomPad: {
    height: 24,
  },
});
