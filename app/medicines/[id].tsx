import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Shield,
  Pill,
  FileText,
  AlertCircle
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { peptidesMedicines } from '@/mocks/supplements';

export default function MedicineDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const medicine = peptidesMedicines.find(m => m.id === id);
  
  if (!medicine) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Medicine not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

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
          source={{ uri: medicine.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        
        <View style={styles.headerInfo}>
          <View style={styles.badgeContainer}>
            <Badge
              label={medicine.category}
              variant="primary"
              style={styles.categoryBadge}
            />
            {medicine.prescriptionRequired && (
              <Badge
                label="Prescription Required"
                variant="error"
                style={styles.rxBadge}
              />
            )}
          </View>
          <Text style={styles.name}>{medicine.name}</Text>
          <Text style={styles.genericName}>{medicine.genericName}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Card style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{medicine.description}</Text>
        </Card>
        
        <Card style={styles.dosageCard}>
          <View style={styles.dosageHeader}>
            <Pill size={20} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Dosage</Text>
          </View>
          <Text style={styles.dosageText}>{medicine.dosage}</Text>
        </Card>
        
        <Card style={styles.usedForCard}>
          <View style={styles.usedForHeader}>
            <FileText size={20} color={colors.status.info} />
            <Text style={styles.sectionTitle}>Used For</Text>
          </View>
          {medicine.usedFor.map((use, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{use}</Text>
            </View>
          ))}
        </Card>
        
        <Card style={styles.sideEffectsCard}>
          <View style={styles.warningHeader}>
            <AlertTriangle size={20} color={colors.status.warning} />
            <Text style={styles.sectionTitle}>Side Effects</Text>
          </View>
          {medicine.sideEffects.map((effect, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{effect}</Text>
            </View>
          ))}
        </Card>
        
        <Card style={styles.interactionsCard}>
          <View style={styles.warningHeader}>
            <Shield size={20} color={colors.status.error} />
            <Text style={styles.sectionTitle}>Drug Interactions</Text>
          </View>
          {medicine.interactions.map((interaction, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{interaction}</Text>
            </View>
          ))}
        </Card>
        
        <Card style={styles.warningsCard}>
          <View style={styles.warningHeader}>
            <AlertCircle size={20} color={colors.status.error} />
            <Text style={styles.sectionTitle}>Important Warnings</Text>
          </View>
          {medicine.warnings.map((warning, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{warning}</Text>
            </View>
          ))}
        </Card>
        
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>⚠️ Medical Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This information is for educational purposes only and should not replace professional medical advice. 
            {medicine.prescriptionRequired && ' This medication requires a prescription from a licensed healthcare provider.'} 
            Always consult with a qualified healthcare professional before starting, stopping, or changing any medication.
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
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  rxBadge: {
    alignSelf: 'flex-start',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 4,
  },
  genericName: {
    fontSize: 16,
    color: colors.text.secondary,
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
  usedForCard: {
    marginBottom: 16,
  },
  usedForHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
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
  disclaimer: {
    backgroundColor: colors.status.error,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.text.primary,
    lineHeight: 18,
  },
});