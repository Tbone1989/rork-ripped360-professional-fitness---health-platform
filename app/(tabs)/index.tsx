import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ShoppingBag, Gift, Plus, CalendarCheck2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { brandAssets } from '@/constants/brand';

export default function HomeScreen() {
  const today = useMemo(() => new Date().toDateString(), []);

  return (
    <View style={styles.container} testID="home-container">
      <ScrollView contentContainerStyle={styles.scroll} testID="home-scroll">
        <View style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Ripped City 360</Text>
            <TouchableOpacity accessibilityLabel="Open store" testID="home-store-btn">
              <ShoppingBag size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerDivider} />
        </View>

        <Card style={styles.brandCard} testID="brand-card" title={undefined}>
          <View style={styles.heroTop}>
            <Image
              source={{ uri: brandAssets.rippedCityIncLogo }}
              style={styles.logo}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </View>
          <Text style={styles.brandHeadline}>GET RIPPED.{"\n"}STAY REAL.</Text>
          <Text style={styles.brandTitle}>Ripped City Inc.</Text>
          <Text style={styles.brandSub}>Premium Coaching • Elite Training • Real Results</Text>
          <Text style={styles.brandBody}>
            Built for athletes who demand more. Train harder, recover smarter, live the RCI standard.
          </Text>
          <View style={styles.actionsRow}>
            <Button
              title="Check In"
              onPress={() => {}}
              icon={<CalendarCheck2 size={18} color={colors.text.primary} />}
              testID="checkin-cta"
            />
          </View>
          <Text style={styles.mutedDate}>{today}</Text>
        </Card>

        <Card style={styles.checkinCard} testID="daily-checkin-card">
          <View style={styles.checkinRow}>
            <View style={styles.streakPill}>
              <Text style={styles.streakValue}>0</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
            <View style={styles.checkinInfo}>
              <Text style={styles.checkinTitle}>Daily Check-in</Text>
              <Text style={styles.checkinSub}>Claim your reward</Text>
              <View style={styles.checkinButtonRow}>
                <Button title="Check In" onPress={() => {}} size="small" testID="checkin-button" />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.rewardsRow} accessibilityRole="link" testID="rewards-link">
            <Gift size={18} color={colors.accent.primary} />
            <Text style={styles.rewardsText}>View Rewards Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fab} activeOpacity={0.9} testID="home-fab">
            <Plus size={28} color={colors.text.primary} />
          </TouchableOpacity>
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
    paddingBottom: 48,
  },
  headerWrap: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.light,
    marginTop: 12,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '700',
  },
  brandCard: {
    padding: 20,
    backgroundColor: colors.background.card,
    borderRadius: 20,
    marginBottom: 16,
  },
  heroTop: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 16,
  },
  brandHeadline: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  brandTitle: {
    color: colors.accent.secondary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  brandSub: {
    color: colors.text.secondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  brandBody: {
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  mutedDate: {
    color: colors.text.tertiary,
    marginTop: 12,
    fontSize: 12,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  checkinCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.background.card,
  },
  checkinRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakPill: {
    width: 96,
    height: 96,
    borderRadius: 20,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  streakValue: {
    color: colors.text.primary,
    fontSize: 26,
    fontWeight: '900',
  },
  streakLabel: {
    color: colors.text.primary,
    fontSize: 12,
    marginTop: 2,
  },
  checkinInfo: {
    flex: 1,
  },
  checkinTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  checkinSub: {
    color: colors.text.secondary,
    marginTop: 2,
    marginBottom: 8,
  },
  checkinButtonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rewardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  rewardsText: {
    color: '#FFA4A4',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});