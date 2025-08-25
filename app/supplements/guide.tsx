import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Pill, FlaskConical, ShieldCheck, Info } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { preworkoutGuide, proteinGuide, fiberGuide, safetyNotes, IngredientGuide, DosageRange } from '@/constants/supplementGuides';

function Dosage({ range }: { range: DosageRange }) {
  const text = useMemo(() => {
    const unit = range.unit;
    const min = range.min;
    const max = range.max;
    const span = min === max ? `${min}${unit}` : `${min}–${max}${unit}`;
    const timing = range.timing ? ` • ${range.timing}` : '';
    return `${span}${timing}`;
  }, [range.min, range.max, range.timing, range.unit]);

  return <Text style={styles.doseText} testID="DoseText">{text}</Text>;
}

function IngredientItem({ item }: { item: IngredientGuide }) {
  const doses = Array.isArray(item.recommended) ? item.recommended : [item.recommended];
  return (
    <View style={styles.ingredientItem} testID={`Ingredient-${item.id}`}>
      <Text style={styles.ingredientName}>{item.name}</Text>
      <View style={styles.metaRow}>
        <Badge label={item.evidence} variant={item.evidence === 'Strong' ? 'success' : item.evidence === 'Moderate' ? 'default' : 'warning'} size="small" />
        <Text style={styles.metaPipe}>•</Text>
        <Text style={styles.purposeText}>{item.purpose.join(', ')}</Text>
      </View>
      <View style={styles.doseRow}>
        {doses.map((d, idx) => (
          <Dosage key={idx} range={d} />
        ))}
      </View>
      {item.notes?.length ? (
        <View style={styles.notesBox}>
          {item.notes.map((n, idx) => (
            <Text key={idx} style={styles.noteLine}>• {n}</Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function SupplementGuideScreen() {
  console.log('[SupplementGuideScreen] render');
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="SupplementGuideScreen">
      <Stack.Screen options={{ title: 'Supplement Guides' }} />

      <Card style={styles.hero}>
        <View style={styles.heroRow}>
          <Pill size={20} color={colors.accent.primary} />
          <Text style={styles.heroTitle}>Pre-Workout Ingredients</Text>
        </View>
        <Text style={styles.heroSubtitle}>{preworkoutGuide.subtitle}</Text>
      </Card>

      <Card style={styles.sectionCard}>
        {preworkoutGuide.items.map((it) => (
          <IngredientItem key={it.id} item={it} />
        ))}
      </Card>

      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          <FlaskConical size={20} color={colors.accent.primary} />
          <Text style={styles.sectionTitle}>Protein Types & Timing</Text>
        </View>
        <Text style={styles.sectionSubtitle}>{proteinGuide.subtitle ?? ''}</Text>
      </Card>

      <Card style={styles.sectionCard}>
        {proteinGuide.items.map((it) => (
          <IngredientItem key={it.id} item={it} />
        ))}
      </Card>

      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Info size={20} color={colors.accent.primary} />
          <Text style={styles.sectionTitle}>{fiberGuide.title}</Text>
        </View>
        <Text style={styles.sectionSubtitle}>{fiberGuide.description}</Text>
      </Card>

      <Card style={styles.sectionCard}>
        {fiberGuide.bullets.map((b, i) => (
          <Text key={i} style={styles.bullet}>• {b}</Text>
        ))}
      </Card>

      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          <ShieldCheck size={20} color={colors.status.success} />
          <Text style={styles.sectionTitle}>{safetyNotes.title}</Text>
        </View>
        <Text style={styles.sectionSubtitle}>{safetyNotes.description}</Text>
      </Card>

      <Card style={styles.sectionCard}>
        {safetyNotes.bullets.map((b, i) => (
          <Text key={i} style={styles.bullet}>• {b}</Text>
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
  hero: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.background.secondary,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  headerCard: {
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: colors.background.secondary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  sectionCard: {
    padding: 12,
    marginBottom: 8,
  },
  ingredientItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  metaPipe: {
    color: colors.text.tertiary,
  },
  purposeText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  doseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  doseText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: 6,
  },
  notesBox: {
    marginTop: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
    padding: 8,
  },
  noteLine: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  bullet: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 8,
  },
  footerSpace: {
    height: 24,
  },
});
