import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { colors } from '@/constants/colors';
import { ShoppingBag, Users, Trophy, Activity, HeartHandshake, User, Store } from 'lucide-react-native';

interface LinkItem {
  key: string;
  title: string;
  href: Href<string>;
  icon: React.ReactNode;
}

export default function MoreScreen() {
  const router = useRouter();

  const links = useMemo<LinkItem[]>(() => [
    { key: 'shop', title: 'Shop', href: '/shop' as Href<string>, icon: <ShoppingBag size={18} color={colors.text.primary} /> },
    { key: 'community', title: 'Community', href: '/community' as Href<string>, icon: <Users size={18} color={colors.text.primary} /> },
    { key: 'contest', title: 'Contest', href: '/contest' as Href<string>, icon: <Trophy size={18} color={colors.text.primary} /> },
    { key: 'coaching', title: 'Coaching', href: '/coaching' as Href<string>, icon: <HeartHandshake size={18} color={colors.text.primary} /> },
    { key: 'health', title: 'Health', href: '/medical' as Href<string>, icon: <Activity size={18} color={colors.text.primary} /> },
    { key: 'profile', title: 'Profile', href: '/profile' as Href<string>, icon: <User size={18} color={colors.text.primary} /> },
  ], []);

  return (
    <View style={styles.container} testID="more-container">
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>More</Text>
        <View style={styles.card}>
          {links.map((l, idx) => (
            <TouchableOpacity
              key={l.key}
              style={[styles.row, idx !== 0 ? styles.rowDivider : undefined]}
              onPress={() => router.push(l.href)}
              activeOpacity={0.85}
              testID={`more-link-${l.key}`}
              accessibilityRole="button"
              accessibilityLabel={l.title}
            >
              <View style={styles.iconWrap}>{l.icon}</View>
              <Text style={styles.rowText}>{l.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.supportCard}>
          <Store size={18} color={colors.accent.primary} />
          <Text style={styles.supportText}>Looking for something else? Check Shop categories, Community feed, or open Coaching.</Text>
        </View>
      </ScrollView>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.text.primary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  supportCard: {
    marginTop: 16,
    borderRadius: 14,
    padding: 12,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  supportText: {
    color: colors.text.secondary,
    flex: 1,
  },
});
