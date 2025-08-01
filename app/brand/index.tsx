import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Trophy, Crown, BookOpen, DollarSign, Users, Star, ArrowRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useBrandStore } from '@/store/brandStore';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function BrandOverviewScreen() {
  const { userMembership, userChallenges, purchasedGuides } = useBrandStore();
  const user = useUserStore((state) => state.user);
  
  const brandFeatures = [
    {
      id: 'challenges',
      title: 'Member Challenges',
      description: 'Exclusive challenges with premium rewards and community engagement',
      icon: Trophy,
      color: colors.accent.primary,
      route: '/brand/challenges',
      stats: `${userChallenges.length} joined`,
    },
    {
      id: 'gear',
      title: 'Exclusive Gear',
      description: 'Member-only products with early access and special pricing',
      icon: Crown,
      color: colors.status.warning,
      route: '/brand/exclusive-gear',
      stats: 'Limited editions',
    },
    {
      id: 'guides',
      title: 'Branded Guides',
      description: 'Expert nutrition and training guides from our professional team',
      icon: BookOpen,
      color: colors.status.info,
      route: '/brand/guides',
      stats: `${purchasedGuides.length} owned`,
    },
    {
      id: 'affiliate',
      title: 'Affiliate Program',
      description: 'Earn commissions by promoting Ripped City products and services',
      icon: DollarSign,
      color: colors.status.success,
      route: '/brand/affiliate',
      stats: '15% commission',
    },
  ];
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Brand Synergy',
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400' }}
            style={styles.brandImage}
          />
          <Text style={styles.headerTitle}>Ripped City Inc.</Text>
          <Text style={styles.headerSubtitle}>Your Complete Fitness Ecosystem</Text>
          <Text style={styles.headerDescription}>
            From exclusive gear to expert coaching, unlock the full potential of your fitness journey with our integrated brand experience.
          </Text>
        </View>
        
        {/* Membership Status */}
        {userMembership ? (
          <Card style={styles.membershipCard}>
            <View style={styles.membershipHeader}>
              <Badge
                label={userMembership.tier.name}
                style={[styles.membershipBadge, { backgroundColor: userMembership.tier.color + '20' }]}
                textStyle={{ color: userMembership.tier.color }}
              />
              <Text style={styles.membershipStatus}>Active Member</Text>
            </View>
            <Text style={styles.membershipBenefits}>
              Enjoying {userMembership.tier.discountPercentage}% discount on all products and exclusive access to member-only content.
            </Text>
            <Button
              title="Manage Membership"
              variant="outline"
              onPress={() => router.push('/profile/subscription')}
              style={styles.manageButton}
            />
          </Card>
        ) : (
          <Card style={styles.upgradeCard}>
            <Crown size={32} color={colors.status.warning} />
            <Text style={styles.upgradeTitle}>Unlock Premium Benefits</Text>
            <Text style={styles.upgradeDescription}>
              Join our membership program to access exclusive challenges, gear, coaching, and earn affiliate commissions.
            </Text>
            <Button
              title="View Membership Plans"
              onPress={() => router.push('/brand/membership')}
              style={styles.upgradeButton}
            />
          </Card>
        )}
        
        {/* Brand Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Brand Features</Text>
          <View style={styles.featuresGrid}>
            {brandFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <TouchableOpacity
                  key={feature.id}
                  style={styles.featureCard}
                  onPress={() => router.push(feature.route as any)}
                >
                  <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                    <IconComponent size={24} color={feature.color} />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  <Text style={styles.featureStats}>{feature.stats}</Text>
                  <ArrowRight size={16} color={colors.text.secondary} style={styles.featureArrow} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Brand Journey</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userChallenges.length}</Text>
              <Text style={styles.statLabel}>Challenges Joined</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{purchasedGuides.length}</Text>
              <Text style={styles.statLabel}>Guides Owned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userMembership ? userMembership.tier.discountPercentage : 0}%
              </Text>
              <Text style={styles.statLabel}>Discount Rate</Text>
            </View>
          </View>
        </Card>
        
        {/* Community Section */}
        <Card style={styles.communityCard}>
          <View style={styles.communityHeader}>
            <Users size={24} color={colors.accent.primary} />
            <Text style={styles.communityTitle}>Join the Community</Text>
          </View>
          <Text style={styles.communityDescription}>
            Connect with fellow members, share your progress, and get exclusive access to brand events and content.
          </Text>
          <Button
            title="Explore Community"
            variant="outline"
            onPress={() => router.push('/brand/challenges')}
            style={styles.communityButton}
          />
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
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  brandImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.accent.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  headerDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  membershipCard: {
    marginBottom: 24,
    padding: 20,
  },
  membershipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  membershipBadge: {
    marginRight: 12,
  },
  membershipStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  membershipBenefits: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  manageButton: {
    alignSelf: 'flex-start',
  },
  upgradeCard: {
    marginBottom: 24,
    padding: 20,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  upgradeButton: {
    minWidth: 200,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  featureStats: {
    fontSize: 12,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  featureArrow: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statsCard: {
    marginBottom: 24,
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  communityCard: {
    padding: 20,
    marginBottom: 24,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: 12,
  },
  communityDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  communityButton: {
    alignSelf: 'flex-start',
  },
});