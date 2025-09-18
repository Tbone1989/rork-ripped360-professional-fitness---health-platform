import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ShoppingBag, BadgePlus, CalendarCheck2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function HomeScreen() {
  const today = useMemo(() => new Date().toDateString(), []);

  return (
    <View style={styles.container} testID="home-container">
      <ScrollView contentContainerStyle={styles.scroll} testID="home-scroll">
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Ripped City 360</Text>
          <TouchableOpacity accessibilityLabel="Open store" testID="home-store-btn">
            <ShoppingBag size={22} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <Card style={styles.brandCard} testID="brand-card" title={undefined}>
          <Text style={styles.brandHeadline}>GET RIPPED.{"\n"}STAY REAL.</Text>
          <Text style={styles.brandSub}>Premium Coaching • Elite Training • Real Results</Text>
          <View style={styles.actionsRow}>
            <Button title="Check In" onPress={() => {}} icon={<CalendarCheck2 size={18} color={colors.text.primary} />} />
            <Button title="Join" variant="outline" onPress={() => {}} icon={<BadgePlus size={18} color={colors.accent.primary} />} />
          </View>
          <Text style={styles.mutedDate}>{today}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Daily Check-in</Text>
        <Card style={styles.checkinCard}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>Claim</Text>
              <Text style={styles.statLabel}>your reward</Text>
            </View>
          </View>
          <View style={styles.actionsRow}>
            <Button title="Check In" onPress={() => {}} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  brandCard: {
    padding: 16,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    marginBottom: 16,
  },
  brandHeadline: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  brandSub: {
    color: colors.text.secondary,
    marginBottom: 12,
  },
  mutedDate: {
    color: colors.text.tertiary,
    marginTop: 12,
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  checkinCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.background.card,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: colors.accent.secondary,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.text.secondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
});