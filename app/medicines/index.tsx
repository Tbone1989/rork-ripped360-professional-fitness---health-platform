import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Search, Filter } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { Input } from '@/components/ui/Input';
import { peptidesMedicines } from '@/mocks/supplements';
import { getImageForMedicine } from '@/utils/medicalImages';
import type { MedicineInfo } from '@/types/medical';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const CATEGORIES = [
  'All',
  'GLP-1 Agonist',
  'GLP-1/GIP Agonist',
  'Triple Agonist',
  'Amylin Analog',
  'Melanocortin Peptide',
  'GHRP',
  'GHRH Analog',
  'Healing Peptide',
  'Coenzyme',
  'Hormone - Androgen (Men)',
  'Hormone - Estrogen (Women)',
  'Hormone - Progestogen (Women)',
  'Hormone - Adrenal',
  'Myostatin Inhibitor',
  'Combination Peptide',
  'Education',
] as const;

export default function MedicinesListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

  const data = useMemo<MedicineInfo[]>(() => peptidesMedicines, []);

  const filtered = useMemo<MedicineInfo[]>(() => {
    const term = search.trim().toLowerCase();
    return data.filter((m) => {
      const inCategory = category === 'All' ? true : (m.category ?? '').toLowerCase() === category.toLowerCase();
      if (!inCategory) return false;
      if (!term) return true;
      const hay = `${m.name} ${m.genericName} ${m.category}`.toLowerCase();
      return hay.includes(term);
    });
  }, [data, search, category]);

  const keyExtractor = useCallback((item: MedicineInfo) => item.id, []);

  const renderItem = useCallback(({ item }: { item: MedicineInfo }) => {
    const initialUri = getImageForMedicine(item) ?? item.imageUrl ?? 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=900&auto=format&fit=crop';
    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        activeOpacity={0.8}
        onPress={() => router.push(`/medicines/${item.id}`)}
        testID={`medicineCard-${item.id}`}
      >
        <Card style={styles.card}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: initialUri }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              testID={`medicineImage-${item.id}`}
            />
            {item.prescriptionRequired ? (
              <View style={styles.rxPill}>
                <Text style={styles.rxText}>Rx</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.meta}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.generic} numberOfLines={1}>{item.genericName}</Text>
            <View style={styles.row}>
              <View style={styles.dot} />
              <Text style={styles.category} numberOfLines={1}>{item.category}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }, [router]);

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="medicinesListScreen">
        <Stack.Screen options={{ title: 'Medicines', headerStyle: { backgroundColor: colors.background.primary } }} />

        <View style={styles.searchRow}>
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Search medicines"
            leftIcon={<Search size={16} color={colors.text.secondary} />}
            testID="searchInput"
          />
        </View>

        <View style={styles.filters}>
          <ChipGroup>
            {CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={category === c}
                onPress={() => setCategory(c)}
                leftIcon={category === c ? <Filter size={14} color={colors.text.primary} /> : undefined}
                testID={`category-${c}`}
              />
            ))}
          </ChipGroup>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.empty} testID="emptyState">
              <Text style={styles.emptyTitle}>No medicines found</Text>
              <Text style={styles.emptySubtitle}>Try a different search or category</Text>
            </View>
          )}
          ListFooterComponent={<View style={{ height: 24 }} />}
          initialNumToRender={8}
          windowSize={5}
          removeClippedSubviews={false}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  filters: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  column: {
    gap: 8,
    paddingHorizontal: 4,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    overflow: 'hidden',
  },
  imageWrapper: {
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.background.tertiary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  rxPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.status.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  rxText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  meta: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  generic: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.primary,
  },
  category: {
    fontSize: 11,
    color: colors.text.secondary,
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});
