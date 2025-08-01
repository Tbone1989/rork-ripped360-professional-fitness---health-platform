import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Info, 
  ExternalLink,
  Pill,
  Clock,
  Shield
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { popularSupplements } from '@/mocks/supplements';

export default function SupplementDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const supplement = popularSupplements.find(s => s.id === id);
  
  if (!supplement) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Supplement not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const openResearchLink = (url: string) => {
    Linking.openURL(url);
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
        
        <Image
          source={{ uri: supplement.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        
        <View style={styles.headerInfo}>
          <Badge
            label={supplement.category}
            variant="primary"
            style={styles.categoryBadge}
          />
          <Text style={styles.name}>{supplement.name}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Card style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{supplement.description}</Text>
        </Card>
        
        <Card style={styles.dosageCard}>
          <View style={styles.dosageHeader}>
            <Pill size={20} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Dosage</Text>
          </View>
          <Text style={styles.dosageText}>{supplement.dosage}</Text>
        </Card>
        
        <Card style={styles.benefitsCard}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          {supplement.benefits.map((benefit, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{benefit}</Text>
            </View>
          ))}
        </Card>
        
        <Card style={styles.sideEffectsCard}>
          <View style={styles.warningHeader}>
            <AlertTriangle size={20} color={colors.status.warning} />
            <Text style={styles.sectionTitle}>Side Effects</Text>
          </View>
          {supplement.sideEffects.map((effect, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{effect}</Text>
            </View>
          ))}
        </Card>
        
        <Card style={styles.interactionsCard}>
          <View style={styles.warningHeader}>
            <Shield size={20} color={colors.status.error} />
            <Text style={styles.sectionTitle}>Interactions</Text>
          </View>
          {supplement.interactions.map((interaction, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{interaction}</Text>
            </View>
          ))}
        </Card>
        
        <Card style={styles.warningsCard}>
          <View style={styles.warningHeader}>
            <AlertTriangle size={20} color={colors.status.error} />
            <Text style={styles.sectionTitle}>Warnings</Text>
          </View>
          {supplement.warnings.map((warning, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{warning}</Text>
            </View>
          ))}
        </Card>
        
        {supplement.researchUrls.length > 0 && (
          <Card style={styles.researchCard}>
            <View style={styles.researchHeader}>
              <Info size={20} color={colors.status.info} />
              <Text style={styles.sectionTitle}>Research</Text>
            </View>
            {supplement.researchUrls.map((url, index) => (
              <TouchableOpacity
                key={index}
                style={styles.researchLink}
                onPress={() => openResearchLink(url)}
              >
                <Text style={styles.researchText}>Research Study {index + 1}</Text>
                <ExternalLink size={16} color={colors.accent.primary} />
              </TouchableOpacity>
            ))}
          </Card>
        )}
        
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This information is for educational purposes only and should not replace professional medical advice. 
            Always consult with a healthcare provider before starting any new supplement regimen.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background.primary,
  },
  errorText: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 16,
  },
  header: {
    position: 'relative',
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    padding: 16,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  dosageCard: {
    marginBottom: 16,
  },
  dosageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dosageText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
    backgroundColor: colors.background.tertiary,
    padding: 12,
    borderRadius: 8,
  },
  benefitsCard: {
    marginBottom: 16,
  },
  sideEffectsCard: {
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.status.warning,
  },
  interactionsCard: {
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.status.error,
  },
  warningsCard: {
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.status.error,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: colors.text.secondary,
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  researchCard: {
    marginBottom: 16,
  },
  researchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  researchLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginBottom: 8,
  },
  researchText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  disclaimer: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.text.tertiary,
    lineHeight: 18,
    textAlign: 'center',
  },
});