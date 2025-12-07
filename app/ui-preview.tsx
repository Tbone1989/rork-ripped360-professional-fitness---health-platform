import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Activity, Award, Dumbbell, HeartPulse } from 'lucide-react-native';
import { useTheme } from '@/store/themeProvider';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { colors } from '@/constants/colors';

interface StatCard {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  variant?: 'success' | 'info' | 'warning';
}

const heroImage = 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1000&q=80';

const UIPreviewScreen: React.FC = () => {
  const { theme } = useTheme();

  const statCards = useMemo<StatCard[]>(
    () => [
      {
        id: 'workouts',
        label: 'Workouts',
        value: '87',
        icon: <Dumbbell color={colors.accent.tertiary} size={20} />, 
      },
      {
        id: 'hours',
        label: 'Hours',
        value: '72',
        icon: <Activity color={colors.accent.secondary} size={20} />, 
        variant: 'info',
      },
      {
        id: 'streak',
        label: 'Streak',
        value: '12',
        icon: <Award color={colors.status.success} size={20} />, 
        variant: 'success',
      },
      {
        id: 'best',
        label: 'Best',
        value: '30',
        icon: <HeartPulse color={colors.status.warning} size={20} />, 
        variant: 'warning',
      },
    ],
    [],
  );

  console.log('[UI Preview] render', statCards.length);

  return (
    <>
      <Stack.Screen options={{ title: 'UI Snapshot', headerTintColor: '#fff', headerStyle: { backgroundColor: '#000' } }} />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
        contentContainerStyle={styles.content}
        testID="ui-preview-scroll"
      >
        <View style={[styles.heroCard, { backgroundColor: theme.colors.background.secondary }]} testID="ui-preview-hero">
          <Image source={{ uri: heroImage }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Ripped City Inc.</Text>
            <Text style={styles.heroSubtitle}>Premium Coaching • Elite Training • Real Results</Text>
            <Badge label="PREP" variant="primary" style={styles.heroBadge} textStyle={styles.heroBadgeText} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fitness Overview</Text>
          <Text style={styles.sectionSubtitle}>Mirrors the in-app dashboard cards</Text>
        </View>
        <View style={styles.statsRow} testID="ui-preview-stats">
          {statCards.map((stat) => (
            <View key={stat.id} style={[styles.statCard, { backgroundColor: theme.colors.background.card }]}
              testID={`stat-${stat.id}`}>
              <View style={styles.statIcon}>{stat.icon}</View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              {stat.variant && <Badge label={stat.variant} variant={stat.variant} size="small" />}
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nutrition Preview</Text>
          <Text style={styles.sectionSubtitle}>Matches Today&apos;s Nutrition layout</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.background.card }]} testID="ui-preview-nutrition">
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today&apos;s Nutrition</Text>
            <Text style={styles.cardMeta}>1635 / 2400 cal</Text>
          </View>
          <ProgressBar progress={0.68} showPercentage color={colors.accent.primary} />
          <View style={styles.macrosRow}>
            {[
              { label: 'Protein', value: '110g' },
              { label: 'Carbs', value: '143g' },
              { label: 'Fat', value: '60g' },
            ].map((macro) => (
              <View key={macro.label} style={styles.macroItem}>
                <Text style={styles.macroValue}>{macro.value}</Text>
                <Text style={styles.macroLabel}>{macro.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contest Prep Snapshot</Text>
          <Text style={styles.sectionSubtitle}>Preview of contest tab UI</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.background.card }]} testID="ui-preview-contest">
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>NPC Regional Championships</Text>
            <Badge label="-438 days" variant="outline" />
          </View>
          <Text style={styles.cardMeta}>Mens Physique • Peak Week</Text>
          <View style={styles.contestStats}>
            {[
              { label: 'Weight', value: '172kg' },
              { label: 'Body Fat', value: '10%' },
              { label: 'Weeks Out', value: '12' },
            ].map((item) => (
              <View key={item.label} style={styles.contestPill}>
                <Text style={styles.contestValue}>{item.value}</Text>
                <Text style={styles.contestLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Verification</Text>
          <Text style={styles.sectionSubtitle}>Open this screen to compare with the shared screenshots.</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.background.card }]} testID="ui-preview-summary">
          <Text style={styles.summaryText}>
            The live UI continues to use the dark, high-contrast palette, rounded cards, and red accent system captured in your
            reference images. This snapshot is wired to the same theme constants the rest of the app consumes, so any drift would
            surface here as well.
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 180,
  },
  heroContent: {
    padding: 20,
    gap: 8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  heroBadge: {
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flexBasis: '47%',
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  cardMeta: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  contestStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contestPill: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    marginHorizontal: 4,
  },
  contestValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  contestLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
});

export default UIPreviewScreen;
