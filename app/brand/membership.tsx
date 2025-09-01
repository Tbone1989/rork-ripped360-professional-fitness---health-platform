import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Check, Star, Crown, Zap, ArrowRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useBrandStore } from '@/store/brandStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function MembershipScreen() {
  const { userMembership } = useBrandStore();
  
  const membershipBenefits = [
    {
      icon: Star,
      title: 'Exclusive Challenges',
      description: 'Access member-only fitness challenges and competitions with prizes'
    },
    {
      icon: Crown,
      title: 'Premium Coaching',
      description: 'Connect with certified trainers and nutrition experts for personalized guidance'
    },
    {
      icon: Zap,
      title: 'Member-Only Gear',
      description: 'Shop exclusive merchandise and equipment not available to the public'
    },
    {
      icon: Check,
      title: 'Affiliate Commissions',
      description: 'Earn money by referring friends and promoting our products'
    }
  ];
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Membership Plans',
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Unlock All Benefits</Text>
          <Text style={styles.headerSubtitle}>
            Join our membership program to access exclusive challenges, gear, coaching, and earn affiliate commissions
          </Text>
        </View>
        
        {/* Current Membership Status */}
        {userMembership && userMembership.status === 'active' && (
          <View style={styles.currentMembershipSection}>
            <Card style={styles.currentMembershipCard}>
              <View style={styles.currentMembershipHeader}>
                <Badge
                  label={`${userMembership.tier.name} Member`}
                  variant="success"
                />
                <Text style={styles.memberSince}>
                  Member since {new Date(userMembership.startDate).toLocaleDateString()}
                </Text>
              </View>
            </Card>
          </View>
        )}
        
        {/* Membership Benefits */}
        <View style={styles.benefitsContainer}>
          {membershipBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} style={styles.benefitCard}>
                <View style={styles.benefitIcon}>
                  <Icon size={24} color={colors.accent.primary} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                </View>
              </Card>
            );
          })}
        </View>
        
        {/* Call to Action */}
        {(!userMembership || userMembership.status !== 'active') && (
          <View style={styles.ctaSection}>
            <Card style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>Ready to Join?</Text>
              <Text style={styles.ctaDescription}>
                View membership plans and start your journey today
              </Text>
              <Button
                title="View Membership Plans"
                onPress={() => router.push('/profile/subscription')}
                style={styles.ctaButton}
                icon={<ArrowRight size={16} color={colors.text.primary} />}
              />
            </Card>
          </View>
        )}
        
        {/* Free Plan Info */}
        <View style={styles.freePlanSection}>
          <Card style={styles.freePlanCard}>
            <Text style={styles.freePlanTitle}>Your Free Plan Includes</Text>
            <View style={styles.freePlanFeatures}>
              <View style={styles.freePlanFeature}>
                <Check size={16} color={colors.status.success} />
                <Text style={styles.freePlanFeatureText}>Basic workout tracking</Text>
              </View>
              <View style={styles.freePlanFeature}>
                <Check size={16} color={colors.status.success} />
                <Text style={styles.freePlanFeatureText}>Exercise database access</Text>
              </View>
              <View style={styles.freePlanFeature}>
                <Check size={16} color={colors.status.success} />
                <Text style={styles.freePlanFeatureText}>Community support</Text>
              </View>
              <View style={styles.freePlanFeature}>
                <Check size={16} color={colors.status.success} />
                <Text style={styles.freePlanFeatureText}>Limited AI features</Text>
              </View>
            </View>
            
            <Text style={styles.freePlanLimitsTitle}>Free Plan Limits:</Text>
            <View style={styles.freePlanLimits}>
              <Text style={styles.freePlanLimit}>• Max 3 workouts per week</Text>
              <Text style={styles.freePlanLimit}>• Basic progress tracking</Text>
              <Text style={styles.freePlanLimit}>• No coaching access</Text>
              <Text style={styles.freePlanLimit}>• Limited medical features</Text>
            </View>
            
            <Button
              title="Upgrade for Full Access"
              onPress={() => router.push('/profile/subscription')}
              style={styles.upgradeButton}
              icon={<ArrowRight size={16} color={colors.text.primary} />}
            />
          </Card>
        </View>
        
        {/* FAQ Link */}
        <View style={styles.faqSection}>
          <TouchableOpacity onPress={() => router.push('/brand/faq')}>
            <Text style={styles.faqLink}>Frequently Asked Questions</Text>
          </TouchableOpacity>
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
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  currentMembershipSection: {
    padding: 20,
    paddingTop: 0,
  },
  currentMembershipCard: {
    borderWidth: 1,
    borderColor: colors.status.success,
  },
  currentMembershipHeader: {
    alignItems: 'center',
    gap: 8,
  },
  memberSince: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  benefitsContainer: {
    padding: 20,
    paddingTop: 0,
    gap: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    gap: 16,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  ctaSection: {
    padding: 20,
    paddingTop: 0,
  },
  ctaCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background.secondary,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    paddingHorizontal: 32,
  },
  freePlanSection: {
    padding: 20,
    paddingTop: 0,
  },
  freePlanCard: {
    padding: 20,
  },
  freePlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  freePlanFeatures: {
    gap: 12,
    marginBottom: 20,
  },
  freePlanFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  freePlanFeatureText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  freePlanLimitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  freePlanLimits: {
    gap: 8,
    marginBottom: 20,
  },
  freePlanLimit: {
    fontSize: 14,
    color: colors.text.tertiary,
    paddingLeft: 8,
  },
  upgradeButton: {
    marginTop: 8,
  },
  faqSection: {
    padding: 20,
    alignItems: 'center',
  },
  faqLink: {
    fontSize: 16,
    color: colors.accent.primary,
    textDecorationLine: 'underline',
  },
});