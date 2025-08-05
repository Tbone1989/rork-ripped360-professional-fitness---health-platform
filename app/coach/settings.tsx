import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Settings, 
  DollarSign, 
  Eye, 
  EyeOff, 
  Phone, 
  MessageCircle,
  Save,
  Info
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

export default function CoachSettingsScreen() {
  const router = useRouter();
  const [pricingVisibility, setPricingVisibility] = useState<'upfront' | 'after_contact' | 'consultation_required'>('upfront');
  const [hourlyRate, setHourlyRate] = useState<string>('120');
  const [consultationFee, setConsultationFee] = useState<string>('50');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pricingOptions = [
    {
      id: 'upfront' as const,
      title: 'Show Prices Upfront',
      description: 'Display your hourly rate and package prices publicly',
      icon: <Eye size={20} color={colors.accent.primary} />,
      benefits: ['Attracts price-conscious clients', 'Transparent pricing', 'Quick booking decisions']
    },
    {
      id: 'after_contact' as const,
      title: 'Pricing After Contact',
      description: 'Reveal prices only after clients reach out to you',
      icon: <MessageCircle size={20} color={colors.accent.primary} />,
      benefits: ['Allows for custom pricing', 'Build relationship first', 'Negotiate based on needs']
    },
    {
      id: 'consultation_required' as const,
      title: 'Consultation Required',
      description: 'Require a paid consultation before revealing full pricing',
      icon: <Phone size={20} color={colors.accent.primary} />,
      benefits: ['Qualify serious clients', 'Earn from consultations', 'Personalized pricing strategy']
    }
  ];

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Settings Saved',
        'Your pricing preferences have been updated successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Settings size={24} color={colors.accent.primary} />
        <Text style={styles.title}>Pricing Settings</Text>
        <Text style={styles.subtitle}>
          Choose how you want to display your pricing to potential clients
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing Visibility</Text>
        
        {pricingOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              pricingVisibility === option.id && styles.selectedOption
            ]}
            onPress={() => setPricingVisibility(option.id)}
          >
            <View style={styles.optionHeader}>
              <View style={styles.optionIcon}>
                {option.icon}
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              {pricingVisibility === option.id && (
                <Badge label="Selected" variant="primary" size="small" />
              )}
            </View>
            
            <View style={styles.benefitsList}>
              {option.benefits.map((benefit, index) => (
                <Text key={index} style={styles.benefit}>• {benefit}</Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rate Configuration</Text>
        
        <Card style={styles.rateCard}>
          <View style={styles.rateHeader}>
            <DollarSign size={20} color={colors.accent.primary} />
            <Text style={styles.rateTitle}>Hourly Rate</Text>
          </View>
          
          <Input
            placeholder="Enter your hourly rate"
            value={hourlyRate}
            onChangeText={setHourlyRate}
            keyboardType="numeric"
            style={styles.rateInput}
          />
          
          <View style={styles.infoContainer}>
            <Info size={14} color={colors.text.secondary} />
            <Text style={styles.infoText}>
              {pricingVisibility === 'upfront' 
                ? 'This rate will be visible to all clients'
                : 'This rate will be used for internal calculations only'
              }
            </Text>
          </View>
        </Card>

        {pricingVisibility === 'consultation_required' && (
          <Card style={styles.rateCard}>
            <View style={styles.rateHeader}>
              <Phone size={20} color={colors.accent.primary} />
              <Text style={styles.rateTitle}>Consultation Fee</Text>
            </View>
            
            <Input
              placeholder="Enter consultation fee (optional)"
              value={consultationFee}
              onChangeText={setConsultationFee}
              keyboardType="numeric"
              style={styles.rateInput}
            />
            
            <View style={styles.infoContainer}>
              <Info size={14} color={colors.text.secondary} />
              <Text style={styles.infoText}>
                Charge a fee for initial consultations to qualify serious clients
              </Text>
            </View>
          </Card>
        )}
      </View>

      <View style={styles.previewSection}>
        <Text style={styles.sectionTitle}>Preview</Text>
        <Text style={styles.previewSubtitle}>How clients will see your pricing:</Text>
        
        <Card style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewName}>Your Coach Profile</Text>
            <View style={styles.previewRating}>
              <Text style={styles.previewRatingText}>4.9 (127 reviews)</Text>
            </View>
          </View>
          
          <View style={styles.previewPricing}>
            {pricingVisibility === 'upfront' ? (
              <Text style={styles.previewRate}>${hourlyRate}/hour</Text>
            ) : pricingVisibility === 'after_contact' ? (
              <Text style={styles.previewContact}>Contact for pricing</Text>
            ) : (
              <View style={styles.previewConsultation}>
                <Text style={styles.previewConsultationText}>Consultation required</Text>
                {consultationFee && (
                  <Text style={styles.previewConsultationFee}>${consultationFee}</Text>
                )}
              </View>
            )}
          </View>
        </Card>
      </View>

      <View style={styles.actionButtons}>
        <Button
          title="Save Settings"
          icon={<Save size={18} color={colors.text.primary} />}
          onPress={handleSaveSettings}
          loading={isLoading}
          fullWidth
        />
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
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  selectedOption: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.background.secondary,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  benefitsList: {
    gap: 4,
  },
  benefit: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  rateCard: {
    marginBottom: 16,
    padding: 16,
  },
  rateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  rateInput: {
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
    flex: 1,
  },
  previewSection: {
    padding: 16,
    paddingTop: 0,
  },
  previewSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  previewCard: {
    padding: 16,
    backgroundColor: colors.background.card,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  previewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewRatingText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  previewPricing: {
    alignItems: 'flex-end',
  },
  previewRate: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  previewContact: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  previewConsultation: {
    alignItems: 'flex-end',
  },
  previewConsultationText: {
    fontSize: 11,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  previewConsultationFee: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent.primary,
    marginTop: 2,
  },
  actionButtons: {
    padding: 16,
    marginBottom: 24,
  },
});