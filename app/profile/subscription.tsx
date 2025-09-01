import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Crown, 
  Check, 
  ArrowRight,
  Star,
  Zap
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/userStore';
import { useBrandStore } from '@/store/brandStore';

const freePlan = {
  id: 'free',
  name: 'Free',
  price: 0,
  period: 'forever',
  features: [
    'Basic workout tracking',
    'Exercise database access',
    'Community support',
    'Limited AI features'
  ],
  limitations: [
    'Max 3 workouts per week',
    'Basic progress tracking',
    'No coaching access',
    'Limited medical features'
  ],
  popular: false
};

export default function SubscriptionScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { membershipTiers, userMembership } = useBrandStore();
  const [selectedPlan, setSelectedPlan] = useState<string>(
    userMembership?.tier.id || user?.subscription?.plan || 'free'
  );
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Combine free plan with membership tiers
  const allPlans = [freePlan, ...membershipTiers];

  const handleUpgrade = (planId: string) => {
    if (planId === 'free') return;
    
    // Navigate to payment screen with billing period
    router.push(`/profile/payment?plan=${planId}&billing=${billingPeriod}`);
  };



  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Crown size={24} color={colors.accent.primary} />
        </View>
        <Text style={styles.title}>Subscription Plans</Text>
        <Text style={styles.subtitle}>
          Choose the plan that fits your fitness and health goals
        </Text>
      </View>



      <View style={styles.billingToggle}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              billingPeriod === 'monthly' && styles.toggleOptionActive
            ]}
            onPress={() => setBillingPeriod('monthly')}
          >
            <Text style={[
              styles.toggleText,
              billingPeriod === 'monthly' && styles.toggleTextActive
            ]}>Monthly</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleOption,
              billingPeriod === 'yearly' && styles.toggleOptionActive
            ]}
            onPress={() => setBillingPeriod('yearly')}
          >
            <Text style={[
              styles.toggleText,
              billingPeriod === 'yearly' && styles.toggleTextActive
            ]}>Yearly</Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>Save 17%</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.plansSection}>
        {allPlans.map((plan) => {
          const isCurrentPlan = (userMembership?.tier.id === plan.id) || (user?.subscription?.plan === plan.id);
          const monthlyPrice = plan.price || 0;
          const yearlyPrice = plan.id !== 'free' ? monthlyPrice * 10 : 0; // 2 months free
          const displayPrice = billingPeriod === 'yearly' && plan.id !== 'free' ? yearlyPrice : monthlyPrice;
          const period = plan.id === 'free' ? 'forever' : (billingPeriod === 'yearly' ? 'year' : 'month');
          
          return (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
                ('popular' in plan && plan.popular) && styles.popularPlan
              ]}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.8}
            >
              {('popular' in plan && plan.popular) && (
                <View style={styles.popularBadge}>
                  <Star size={12} color={colors.text.primary} fill={colors.text.primary} />
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                  {plan.id !== 'free' && billingPeriod === 'yearly' ? (
                    <>
                      <Text style={styles.price}>
                        ${(yearlyPrice / 12).toFixed(2)}
                      </Text>
                      <Text style={styles.period}>/month</Text>
                      <Text style={styles.yearlyNote}>
                        (${yearlyPrice}/year)
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.price}>
                        ${displayPrice}
                      </Text>
                      <Text style={styles.period}>/{period}</Text>
                    </>
                  )}
                </View>
              </View>
              
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.feature}>
                    <Check size={16} color={colors.status.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
                
                {('limitations' in plan && plan.limitations) && plan.limitations.map((limitation: string, index: number) => (
                  <View key={index} style={styles.limitation}>
                    <Text style={styles.limitationBullet}>•</Text>
                    <Text style={styles.limitationText}>{limitation}</Text>
                  </View>
                ))}
              </View>
              
              {!isCurrentPlan && (
                <Button
                  title={
                    selectedPlan === plan.id 
                      ? (plan.id === 'free' ? 'Downgrade to Free' : 'Upgrade Now')
                      : 'Select Plan'
                  }
                  onPress={() => {
                    if (selectedPlan !== plan.id) {
                      setSelectedPlan(plan.id);
                    } else {
                      handleUpgrade(plan.id);
                    }
                  }}
                  variant={selectedPlan === plan.id ? 'primary' : 'secondary'}
                  style={styles.upgradeButton}
                  icon={selectedPlan === plan.id && plan.id !== 'free' ? <ArrowRight size={16} color={colors.text.primary} /> : undefined}
                />
              )}
              
              {isCurrentPlan && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current Plan</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.benefitsSection}>
        <Card style={styles.benefitsCard}>
          <View style={styles.benefitsHeader}>
            <Zap size={20} color={colors.accent.primary} />
            <Text style={styles.benefitsTitle}>Why Upgrade?</Text>
          </View>
          
          <View style={styles.benefitsList}>
            <View style={styles.benefit}>
              <Text style={styles.benefitTitle}>AI-Powered Insights</Text>
              <Text style={styles.benefitDescription}>
                Get personalized workout recommendations and form analysis
              </Text>
            </View>
            
            <View style={styles.benefit}>
              <Text style={styles.benefitTitle}>Expert Coaching</Text>
              <Text style={styles.benefitDescription}>
                Connect with certified trainers and nutrition experts
              </Text>
            </View>
            
            <View style={styles.benefit}>
              <Text style={styles.benefitTitle}>Medical Integration</Text>
              <Text style={styles.benefitDescription}>
                Track bloodwork, supplements, and health metrics
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All plans include a 7-day free trial. Cancel anytime.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginHorizontal: 20,
  },

  plansSection: {
    padding: 16,
    paddingTop: 0,
    gap: 16,
  },
  planCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPlan: {
    borderColor: colors.accent.primary,
  },
  popularPlan: {
    borderColor: colors.status.warning,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: colors.status.warning,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.accent.primary,
  },
  period: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  yearlyNote: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginLeft: 8,
  },
  billingToggle: {
    padding: 16,
    paddingTop: 0,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    position: 'relative',
  },
  toggleOptionActive: {
    backgroundColor: colors.accent.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  toggleTextActive: {
    color: colors.text.primary,
  },
  saveBadge: {
    position: 'absolute',
    top: -6,
    right: 8,
    backgroundColor: colors.status.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.primary,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  limitation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  limitationBullet: {
    fontSize: 16,
    color: colors.text.tertiary,
    width: 16,
  },
  limitationText: {
    fontSize: 14,
    color: colors.text.tertiary,
    flex: 1,
  },
  upgradeButton: {
    marginTop: 8,
  },
  currentBadge: {
    backgroundColor: colors.status.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 8,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  benefitsSection: {
    padding: 16,
    paddingTop: 0,
  },
  benefitsCard: {
    backgroundColor: colors.background.secondary,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  benefitsList: {
    gap: 16,
  },
  benefit: {
    gap: 4,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  benefitDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});