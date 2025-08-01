import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { DollarSign, Users, TrendingUp, Share2, CheckCircle, ExternalLink } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { affiliateProgram } from '@/mocks/challenges';

export default function AffiliateScreen() {
  const user = useUserStore((state) => state.user);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [applicationData, setApplicationData] = useState({
    socialMedia: '',
    followers: '',
    contentType: '',
    experience: '',
  });
  
  const handleApply = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to apply for the affiliate program.');
      return;
    }
    
    if (!applicationData.socialMedia || !applicationData.followers) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    Alert.alert(
      'Application Submitted',
      'Thank you for your interest! We\'ll review your application and get back to you within 3-5 business days.',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };
  
  const mockStats = {
    totalEarnings: 2847.50,
    monthlyEarnings: 485.20,
    totalClicks: 1247,
    conversions: 89,
    conversionRate: 7.1,
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Affiliate Program',
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ripped City Partner Program</Text>
          <Text style={styles.headerSubtitle}>
            Earn commissions by promoting our premium fitness products and services
          </Text>
        </View>
        
        {isAffiliate ? (
          // Affiliate Dashboard
          <>
            {/* Stats Overview */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Your Performance</Text>
              
              <View style={styles.statsGrid}>
                <Card style={styles.statCard}>
                  <DollarSign size={24} color={colors.status.success} />
                  <Text style={styles.statValue}>${mockStats.totalEarnings}</Text>
                  <Text style={styles.statLabel}>Total Earnings</Text>
                </Card>
                
                <Card style={styles.statCard}>
                  <TrendingUp size={24} color={colors.accent.primary} />
                  <Text style={styles.statValue}>${mockStats.monthlyEarnings}</Text>
                  <Text style={styles.statLabel}>This Month</Text>
                </Card>
                
                <Card style={styles.statCard}>
                  <Users size={24} color={colors.status.info} />
                  <Text style={styles.statValue}>{mockStats.conversions}</Text>
                  <Text style={styles.statLabel}>Conversions</Text>
                </Card>
                
                <Card style={styles.statCard}>
                  <Share2 size={24} color={colors.status.warning} />
                  <Text style={styles.statValue}>{mockStats.conversionRate}%</Text>
                  <Text style={styles.statLabel}>Conversion Rate</Text>
                </Card>
              </View>
            </View>
            
            {/* Quick Actions */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              
              <Card style={styles.actionCard}>
                <Text style={styles.actionTitle}>Your Affiliate Link</Text>
                <Text style={styles.affiliateLink}>
                  https://rippedcityinc.com/ref/{user?.id || 'USER123'}
                </Text>
                <Button
                  title="Copy Link"
                  variant="outline"
                  onPress={() => {
                    // In a real app, copy to clipboard
                    Alert.alert('Copied!', 'Affiliate link copied to clipboard');
                  }}
                  style={styles.copyButton}
                />
              </Card>
              
              <View style={styles.actionButtons}>
                <Button
                  title="View Analytics"
                  variant="outline"
                  onPress={() => router.push('/brand/affiliate/analytics')}
                  style={styles.actionButton}
                />
                <Button
                  title="Marketing Materials"
                  variant="outline"
                  onPress={() => router.push('/brand/affiliate/materials')}
                  style={styles.actionButton}
                />
              </View>
            </View>
          </>
        ) : (
          // Application Form
          <>
            {/* Program Benefits */}
            <View style={styles.benefitsSection}>
              <Text style={styles.sectionTitle}>Program Benefits</Text>
              
              <Card style={styles.benefitCard}>
                <View style={styles.benefitHeader}>
                  <DollarSign size={20} color={colors.status.success} />
                  <Text style={styles.benefitTitle}>
                    {affiliateProgram.commissionRate}% Commission Rate
                  </Text>
                </View>
                <Text style={styles.benefitDescription}>
                  Earn {affiliateProgram.commissionRate}% on every sale you generate
                </Text>
              </Card>
              
              <Card style={styles.benefitCard}>
                <View style={styles.benefitHeader}>
                  <TrendingUp size={20} color={colors.accent.primary} />
                  <Text style={styles.benefitTitle}>Performance Bonuses</Text>
                </View>
                <Text style={styles.benefitDescription}>
                  Earn up to 10% bonus commission based on monthly sales volume
                </Text>
              </Card>
              
              <Card style={styles.benefitCard}>
                <View style={styles.benefitHeader}>
                  <Share2 size={20} color={colors.status.info} />
                  <Text style={styles.benefitTitle}>Marketing Support</Text>
                </View>
                <Text style={styles.benefitDescription}>
                  Access to professional marketing materials and product images
                </Text>
              </Card>
            </View>
            
            {/* Commission Structure */}
            <View style={styles.commissionSection}>
              <Text style={styles.sectionTitle}>Commission Structure</Text>
              
              {affiliateProgram.bonusStructure.map((bonus, index) => (
                <Card key={index} style={styles.commissionCard}>
                  <View style={styles.commissionHeader}>
                    <Badge
                      label={`+${bonus.bonusRate}%`}
                      variant="success"
                      style={styles.bonusBadge}
                    />
                    <Text style={styles.commissionThreshold}>
                      ${bonus.threshold}+ monthly sales
                    </Text>
                  </View>
                  <Text style={styles.commissionDescription}>
                    {bonus.description}
                  </Text>
                </Card>
              ))}
            </View>
            
            {/* Requirements */}
            <View style={styles.requirementsSection}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              
              {affiliateProgram.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirement}>
                  <CheckCircle size={16} color={colors.status.success} />
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
            
            {/* Application Form */}
            <View style={styles.applicationSection}>
              <Text style={styles.sectionTitle}>Apply Now</Text>
              
              <Card style={styles.applicationCard}>
                <Input
                  label="Social Media Profile *"
                  placeholder="Instagram, YouTube, TikTok, etc."
                  value={applicationData.socialMedia}
                  onChangeText={(text) => setApplicationData(prev => ({ ...prev, socialMedia: text }))}
                  style={styles.input}
                />
                
                <Input
                  label="Follower Count *"
                  placeholder="e.g., 10,000"
                  value={applicationData.followers}
                  onChangeText={(text) => setApplicationData(prev => ({ ...prev, followers: text }))}
                  keyboardType="numeric"
                  style={styles.input}
                />
                
                <Input
                  label="Content Type"
                  placeholder="Fitness, lifestyle, nutrition, etc."
                  value={applicationData.contentType}
                  onChangeText={(text) => setApplicationData(prev => ({ ...prev, contentType: text }))}
                  style={styles.input}
                />
                
                <Input
                  label="Previous Affiliate Experience"
                  placeholder="Describe your experience with affiliate marketing"
                  value={applicationData.experience}
                  onChangeText={(text) => setApplicationData(prev => ({ ...prev, experience: text }))}
                  multiline
                  numberOfLines={3}
                  style={styles.input}
                />
                
                <Button
                  title="Submit Application"
                  onPress={handleApply}
                  style={styles.submitButton}
                />
                
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://rippedcityinc.com/affiliate-terms')}
                  style={styles.termsLink}
                >
                  <ExternalLink size={16} color={colors.accent.primary} />
                  <Text style={styles.termsText}>View Terms & Conditions</Text>
                </TouchableOpacity>
              </Card>
            </View>
          </>
        )}
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
    fontSize: 24,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  
  // Stats Section
  statsSection: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  // Actions Section
  actionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  actionCard: {
    padding: 16,
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  affiliateLink: {
    fontSize: 14,
    color: colors.text.secondary,
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  copyButton: {
    alignSelf: 'flex-start',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  
  // Benefits Section
  benefitsSection: {
    padding: 20,
  },
  benefitCard: {
    padding: 16,
    marginBottom: 12,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
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
  
  // Commission Section
  commissionSection: {
    padding: 20,
    paddingTop: 0,
  },
  commissionCard: {
    padding: 16,
    marginBottom: 12,
  },
  commissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  bonusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  commissionThreshold: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  commissionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  
  // Requirements Section
  requirementsSection: {
    padding: 20,
    paddingTop: 0,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  requirementText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  
  // Application Section
  applicationSection: {
    padding: 20,
    paddingTop: 0,
  },
  applicationCard: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  termsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  termsText: {
    fontSize: 14,
    color: colors.accent.primary,
    textDecorationLine: 'underline',
  },
});