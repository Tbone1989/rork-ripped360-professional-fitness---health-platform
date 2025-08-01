import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Check, Star, Crown, Zap } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useBrandStore } from '@/store/brandStore';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MembershipTier } from '@/types/brand';

const tierIcons = {
  basic: Zap,
  elite: Star,
  champion: Crown,
};

export default function MembershipScreen() {
  const { membershipTiers, userMembership, setUserMembership } = useBrandStore();
  const user = useUserStore((state) => state.user);
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');
  
  const handleSubscribe = (tier: MembershipTier) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to subscribe to a membership plan.');
      return;
    }
    
    // In a real app, this would integrate with payment processing
    const monthlyPrice = tier.price;
    const yearlyPrice = tier.price * 10; // 2 months free
    const displayPrice = selectedBilling === 'yearly' ? yearlyPrice : monthlyPrice;
    const billingText = selectedBilling === 'yearly' ? 'year' : 'month';
    
    Alert.alert(
      'Subscription',
      `Subscribe to ${tier.name} for ${displayPrice.toFixed(2)}/${billingText}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: () => {
            const daysToAdd = selectedBilling === 'yearly' ? 365 : 30;
            const newMembership = {
              id: Date.now().toString(),
              userId: user.id,
              tier: {
                ...tier,
                price: displayPrice,
                billingCycle: selectedBilling
              },
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active' as const,
              autoRenew: true,
              paymentMethod: 'card',
            };
            setUserMembership(newMembership);
            Alert.alert('Success!', `Welcome to ${tier.name}!`);
          }
        }
      ]
    );
  };
  
  const renderTier = (tier: MembershipTier) => {
    const Icon = tierIcons[tier.id as keyof typeof tierIcons];
    const isCurrentTier = userMembership?.tier.id === tier.id;
    const monthlyPrice = tier.price;
    const fullYearlyPrice = tier.price * 12;
    const yearlyPrice = tier.price * 10; // 2 months free (17% savings)
    const displayPrice = selectedBilling === 'yearly' ? yearlyPrice : monthlyPrice;
    const billingText = selectedBilling === 'yearly' ? 'year' : 'month';
    const savingsAmount = fullYearlyPrice - yearlyPrice;
    const savingsPercentage = Math.round((savingsAmount / fullYearlyPrice) * 100);
    
    return (
      <Card
        key={tier.id}
        style={[
          styles.tierCard,
          tier.popular && styles.popularTier,
          isCurrentTier && styles.currentTier
        ]}
      >
        {tier.popular && (
          <Badge
            label="Most Popular"
            variant="error"
            style={styles.popularBadge}
          />
        )}
        
        <View style={styles.tierHeader}>
          <View style={[styles.tierIcon, { backgroundColor: tier.color + '20' }]}>
            <Icon size={24} color={tier.color} />
          </View>
          <Text style={styles.tierName}>{tier.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${displayPrice.toFixed(2)}</Text>
            <Text style={styles.billingCycle}>/{billingText}</Text>
          </View>
          
          {selectedBilling === 'yearly' && (
            <View style={styles.savingsContainer}>
              <Text style={styles.savings}>Save {savingsPercentage}% annually</Text>
              <Text style={styles.savingsAmount}>${savingsAmount.toFixed(2)} saved vs monthly</Text>
            </View>
          )}
        </View>
        
        <View style={styles.featuresContainer}>
          {tier.features.map((feature, index) => (
            <View key={index} style={styles.feature}>
              <Check size={16} color={colors.status.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.tierActions}>
          {isCurrentTier ? (
            <View style={styles.currentMembershipContainer}>
              <Badge
                label="Current Plan"
                variant="success"
                style={styles.currentBadge}
              />
              <Button
                title="Manage"
                variant="outline"
                onPress={() => router.push('/profile/subscription')}
                style={styles.manageButton}
              />
            </View>
          ) : (
            <Button
              title={`Choose ${tier.name}`}
              onPress={() => handleSubscribe(tier)}
              style={[
                styles.subscribeButton,
                tier.popular && styles.popularButton
              ]}
            />
          )}
        </View>
      </Card>
    );
  };
  
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
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
          <Text style={styles.headerSubtitle}>
            Unlock exclusive challenges, coaching, and member-only gear
          </Text>
        </View>
        
        {/* Billing Toggle */}
        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[
              styles.billingOption,
              selectedBilling === 'monthly' && styles.billingOptionActive
            ]}
            onPress={() => setSelectedBilling('monthly')}
          >
            <Text style={[
              styles.billingText,
              selectedBilling === 'monthly' && styles.billingTextActive
            ]}>
              Monthly
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.billingOption,
              selectedBilling === 'yearly' && styles.billingOptionActive
            ]}
            onPress={() => setSelectedBilling('yearly')}
          >
            <Text style={[
              styles.billingText,
              selectedBilling === 'yearly' && styles.billingTextActive
            ]}>
              Yearly
            </Text>
            <Badge
              label="Save 17%"
              variant="success"
              style={styles.savingsBadge}
            />
          </TouchableOpacity>
        </View>
        
        {/* Membership Tiers */}
        <View style={styles.tiersContainer}>
          {membershipTiers.map(renderTier)}
        </View>
        
        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>All Plans Include:</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefit}>
              <Check size={16} color={colors.status.success} />
              <Text style={styles.benefitText}>Access to workout library</Text>
            </View>
            <View style={styles.benefit}>
              <Check size={16} color={colors.status.success} />
              <Text style={styles.benefitText}>Nutrition tracking tools</Text>
            </View>
            <View style={styles.benefit}>
              <Check size={16} color={colors.status.success} />
              <Text style={styles.benefitText}>Progress tracking</Text>
            </View>
            <View style={styles.benefit}>
              <Check size={16} color={colors.status.success} />
              <Text style={styles.benefitText}>Community forum access</Text>
            </View>
            <View style={styles.benefit}>
              <Check size={16} color={colors.status.success} />
              <Text style={styles.benefitText}>Mobile app access</Text>
            </View>
          </View>
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
  billingToggle: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 4,
  },
  billingOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  billingOptionActive: {
    backgroundColor: colors.accent.primary,
  },
  billingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  billingTextActive: {
    color: colors.text.primary,
  },
  savingsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tiersContainer: {
    padding: 20,
    paddingTop: 0,
    gap: 20,
  },
  tierCard: {
    position: 'relative',
    padding: 24,
  },
  popularTier: {
    borderWidth: 2,
    borderColor: colors.accent.primary,
  },
  currentTier: {
    borderWidth: 2,
    borderColor: colors.status.success,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
  },
  tierHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  tierIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  billingCycle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  savingsContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  savings: {
    fontSize: 14,
    color: colors.status.success,
    fontWeight: '600',
  },
  savingsAmount: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  tierActions: {
    alignItems: 'center',
  },
  currentMembershipContainer: {
    alignItems: 'center',
    gap: 12,
  },
  currentBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  manageButton: {
    paddingHorizontal: 24,
  },
  subscribeButton: {
    width: '100%',
    paddingVertical: 16,
  },
  popularButton: {
    backgroundColor: colors.accent.primary,
  },
  benefitsSection: {
    padding: 20,
    paddingTop: 0,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    color: colors.text.secondary,
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