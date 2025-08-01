import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  CreditCard, 
  Lock, 
  Check,
  ArrowLeft,
  Shield
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/userStore';

export default function PaymentScreen() {
  const { plan, billing } = useLocalSearchParams();
  const router = useRouter();
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [processing, setProcessing] = useState(false);

  const planDetails = {
    premium: { 
      name: 'Premium', 
      price: 29.99, 
      yearlyPrice: 299.99 
    },
    medical: { 
      name: 'Medical Pro', 
      price: 99.99, 
      yearlyPrice: 999.99 
    }
  };

  const selectedPlan = planDetails[plan as keyof typeof planDetails];
  const isYearly = billing === 'yearly';
  const displayPrice = isYearly && selectedPlan?.yearlyPrice ? selectedPlan.yearlyPrice : selectedPlan?.price;
  const displayPeriod = isYearly ? 'year' : 'month';

  const updateSubscription = useUserStore((state) => state.updateSubscription);
  
  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Update the user's subscription
      updateSubscription(plan as 'premium' | 'medical', billing as 'monthly' | 'yearly');
      
      setProcessing(false);
      router.replace('/profile/subscription');
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <CreditCard size={24} color={colors.accent.primary} />
          </View>
          <Text style={styles.title}>Complete Payment</Text>
          <Text style={styles.subtitle}>
            Upgrade to {selectedPlan?.name} plan
          </Text>
        </View>
      </View>

      <View style={styles.orderSummary}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{selectedPlan?.name} Plan ({displayPeriod}ly)</Text>
            <Text style={styles.summaryValue}>${displayPrice}/{displayPeriod}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>7-day free trial</Text>
            <Text style={styles.summaryDiscount}>-${displayPrice}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total due today</Text>
            <Text style={styles.totalValue}>$0.00</Text>
          </View>
          
          <Text style={styles.trialNote}>
            Your free trial starts today. You'll be charged ${displayPrice} on {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
          </Text>
        </Card>
      </View>

      <View style={styles.paymentForm}>
        <Text style={styles.formTitle}>Payment Method</Text>
        
        <Input
          label="Cardholder Name"
          placeholder="John Doe"
          value={cardholderName}
          onChangeText={setCardholderName}
        />
        
        <Input
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
        />
        
        <View style={styles.cardDetailsRow}>
          <Input
            label="Expiry Date"
            placeholder="MM/YY"
            value={expiryDate}
            onChangeText={setExpiryDate}
            style={styles.halfInput}
          />
          
          <Input
            label="CVV"
            placeholder="123"
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
            style={styles.halfInput}
          />
        </View>
      </View>

      <View style={styles.securityInfo}>
        <Card style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <Shield size={20} color={colors.status.success} />
            <Text style={styles.securityTitle}>Secure Payment</Text>
          </View>
          
          <View style={styles.securityFeatures}>
            <View style={styles.securityFeature}>
              <Check size={16} color={colors.status.success} />
              <Text style={styles.securityText}>256-bit SSL encryption</Text>
            </View>
            
            <View style={styles.securityFeature}>
              <Check size={16} color={colors.status.success} />
              <Text style={styles.securityText}>PCI DSS compliant</Text>
            </View>
            
            <View style={styles.securityFeature}>
              <Check size={16} color={colors.status.success} />
              <Text style={styles.securityText}>Cancel anytime</Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.actionButtons}>
        <Button
          title="Start Free Trial"
          onPress={handlePayment}
          loading={processing}
          disabled={processing}
          fullWidth
          icon={<Lock size={18} color={colors.text.primary} />}
        />
        
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy. 
          You can cancel your subscription at any time.
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
    position: 'relative',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
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
  },
  orderSummary: {
    padding: 16,
    paddingTop: 0,
  },
  summaryCard: {
    backgroundColor: colors.background.secondary,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  summaryDiscount: {
    fontSize: 14,
    color: colors.status.success,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  trialNote: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 12,
    lineHeight: 16,
  },
  paymentForm: {
    padding: 16,
    paddingTop: 0,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  securityInfo: {
    padding: 16,
    paddingTop: 0,
  },
  securityCard: {
    backgroundColor: colors.background.secondary,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  securityFeatures: {
    gap: 8,
  },
  securityFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  actionButtons: {
    padding: 16,
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});