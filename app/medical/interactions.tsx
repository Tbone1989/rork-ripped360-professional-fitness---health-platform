import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { AlertTriangle, Search, Filter, Shield, Info, X, CheckCircle } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { colors } from '@/constants/colors';
import { drugInteractions, supplementInteractions, herbalInteractions } from '@/mocks/supplements';
import { DrugInteraction, SupplementInteraction, HerbalInteraction, InteractionAlert } from '@/types/medical';

type InteractionType = 'all' | 'drug-drug' | 'drug-supplement' | 'supplement-supplement' | 'herbal';
type SeverityFilter = 'all' | 'critical' | 'major' | 'moderate' | 'minor';

export default function InteractionsScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<InteractionType>('all');
  const [selectedSeverity, setSeverityFilter] = useState<SeverityFilter>('all');
  const [userMedications, setUserMedications] = useState<string[]>(['Warfarin', 'Metformin']);
  const [userSupplements, setUserSupplements] = useState<string[]>(['Fish Oil', 'Creatine', 'Ginkgo Biloba']);
  const [activeAlerts, setActiveAlerts] = useState<InteractionAlert[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    checkForInteractions();
  }, [userMedications, userSupplements]);

  const checkForInteractions = () => {
    const alerts: InteractionAlert[] = [];
    
    // Check drug-drug interactions
    drugInteractions.forEach(interaction => {
      if (userMedications.includes(interaction.drug1) && userMedications.includes(interaction.drug2)) {
        alerts.push({
          id: `alert-${interaction.id}`,
          userId: 'current-user',
          type: 'drug-drug',
          severity: interaction.severity as 'critical' | 'major' | 'moderate' | 'minor',
          substances: [interaction.drug1, interaction.drug2],
          description: interaction.description,
          recommendation: interaction.management,
          acknowledged: false,
          createdAt: new Date().toISOString()
        });
      }
    });

    // Check supplement-drug interactions
    supplementInteractions.forEach(interaction => {
      const hasSupplement = userSupplements.some(supp => 
        supp.toLowerCase().includes(interaction.supplement.toLowerCase())
      );
      const hasDrug = userMedications.some(med => 
        med.toLowerCase().includes(interaction.interactsWith.toLowerCase())
      );
      
      if (hasSupplement && hasDrug && interaction.interactionType === 'drug') {
        alerts.push({
          id: `alert-${interaction.id}`,
          userId: 'current-user',
          type: 'drug-supplement',
          severity: interaction.severity === 'high' ? 'major' : interaction.severity === 'moderate' ? 'moderate' : 'minor',
          substances: [interaction.supplement, interaction.interactsWith],
          description: interaction.description,
          recommendation: interaction.recommendations.join('. '),
          acknowledged: false,
          createdAt: new Date().toISOString()
        });
      }
    });

    setActiveAlerts(alerts);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'serious':
        return '#DC2626';
      case 'major':
      case 'significant':
        return '#EA580C';
      case 'moderate':
        return '#D97706';
      case 'minor':
        return '#65A30D';
      default:
        return '#6B7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'serious':
        return <AlertTriangle size={20} color="#DC2626" />;
      case 'major':
      case 'significant':
        return <AlertTriangle size={20} color="#EA580C" />;
      case 'moderate':
        return <Info size={20} color="#D97706" />;
      case 'minor':
        return <CheckCircle size={20} color="#65A30D" />;
      default:
        return <Info size={20} color="#6B7280" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setActiveAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true, dismissedAt: new Date().toISOString() }
          : alert
      )
    );
  };

  const filteredDrugInteractions = drugInteractions.filter(interaction => {
    const matchesSearch = 
      interaction.drug1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.drug2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || selectedType === 'drug-drug';
    const matchesSeverity = selectedSeverity === 'all' || interaction.severity === selectedSeverity;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const filteredSupplementInteractions = supplementInteractions.filter(interaction => {
    const matchesSearch = 
      interaction.supplement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.interactsWith.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || 
      (selectedType === 'drug-supplement' && interaction.interactionType === 'drug') ||
      (selectedType === 'supplement-supplement' && interaction.interactionType === 'supplement');
    
    const severityMap = { high: 'major', moderate: 'moderate', low: 'minor' };
    const mappedSeverity = severityMap[interaction.severity as keyof typeof severityMap];
    const matchesSeverity = selectedSeverity === 'all' || mappedSeverity === selectedSeverity;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const filteredHerbalInteractions = herbalInteractions.filter(interaction => {
    const matchesSearch = 
      interaction.herb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || selectedType === 'herbal';
    
    return matchesSearch && matchesType;
  });

  const unacknowledgedAlerts = activeAlerts.filter(alert => !alert.acknowledged);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Drug Interactions',
          headerStyle: { backgroundColor: '#1F2937' },
          headerTintColor: '#FFFFFF',
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
              <Filter size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )
        }} 
      />

      <ScrollView style={styles.content}>
        {/* Critical Alerts */}
        {unacknowledgedAlerts.length > 0 && (
          <View style={styles.alertsSection}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={20} color="#DC2626" />
              <Text style={styles.sectionTitle}>Critical Interactions Detected</Text>
            </View>
            {unacknowledgedAlerts.map(alert => (
              <Card key={alert.id} style={[styles.alertCard, { borderLeftColor: getSeverityColor(alert.severity) }]}>
                <View style={styles.alertHeader}>
                  {getSeverityIcon(alert.severity)}
                  <Text style={styles.alertTitle}>{alert.substances.join(' + ')}</Text>
                  <TouchableOpacity onPress={() => acknowledgeAlert(alert.id)}>
                    <X size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.alertDescription}>{alert.description}</Text>
                <Text style={styles.alertRecommendation}>
                  <Text style={styles.recommendationLabel}>Recommendation: </Text>
                  {alert.recommendation}
                </Text>
                <Badge 
                  label={alert.severity.toUpperCase()} 
                  variant={alert.severity === 'critical' ? 'error' : alert.severity === 'major' ? 'warning' : 'info'}
                  style={styles.severityBadge}
                />
              </Card>
            ))}
          </View>
        )}

        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <Input
            placeholder="Search interactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color="#6B7280" />}
            style={styles.searchInput}
          />
        </View>

        {showFilters && (
          <View style={styles.filtersSection}>
            <Text style={styles.filterLabel}>Interaction Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {(['all', 'drug-drug', 'drug-supplement', 'supplement-supplement', 'herbal'] as InteractionType[]).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.filterChip, selectedType === type && styles.filterChipActive]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[styles.filterChipText, selectedType === type && styles.filterChipTextActive]}>
                    {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.filterLabel}>Severity</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {(['all', 'critical', 'major', 'moderate', 'minor'] as SeverityFilter[]).map(severity => (
                <TouchableOpacity
                  key={severity}
                  style={[styles.filterChip, selectedSeverity === severity && styles.filterChipActive]}
                  onPress={() => setSeverityFilter(severity)}
                >
                  <Text style={[styles.filterChipText, selectedSeverity === severity && styles.filterChipTextActive]}>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Drug-Drug Interactions */}
        {(selectedType === 'all' || selectedType === 'drug-drug') && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Drug-Drug Interactions</Text>
            </View>
            {filteredDrugInteractions.map(interaction => (
              <Card key={interaction.id} style={styles.interactionCard}>
                <View style={styles.interactionHeader}>
                  <Text style={styles.interactionTitle}>
                    {interaction.drug1} + {interaction.drug2}
                  </Text>
                  <Badge 
                    label={interaction.severity.toUpperCase()} 
                    variant={interaction.severity === 'serious' || interaction.severity === 'significant' ? 'error' : interaction.severity === 'contraindicated' ? 'warning' : 'info'}
                  />
                </View>
                <Text style={styles.interactionDescription}>{interaction.description}</Text>
                <Text style={styles.interactionMechanism}>
                  <Text style={styles.mechanismLabel}>Mechanism: </Text>
                  {interaction.mechanism}
                </Text>
                <View style={styles.effectsList}>
                  <Text style={styles.effectsLabel}>Clinical Effects:</Text>
                  {interaction.clinicalEffects.map((effect, index) => (
                    <Text key={index} style={styles.effectItem}>• {effect}</Text>
                  ))}
                </View>
                <Text style={styles.management}>
                  <Text style={styles.managementLabel}>Management: </Text>
                  {interaction.management}
                </Text>
              </Card>
            ))}
          </View>
        )}

        {/* Supplement Interactions */}
        {(selectedType === 'all' || selectedType === 'drug-supplement' || selectedType === 'supplement-supplement') && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Supplement Interactions</Text>
            </View>
            {filteredSupplementInteractions.map(interaction => (
              <Card key={interaction.id} style={styles.interactionCard}>
                <View style={styles.interactionHeader}>
                  <Text style={styles.interactionTitle}>
                    {interaction.supplement} + {interaction.interactsWith}
                  </Text>
                  <Badge 
                    label={interaction.severity.toUpperCase()} 
                    variant={interaction.severity === 'high' ? 'error' : interaction.severity === 'moderate' ? 'warning' : 'info'}
                  />
                </View>
                <Text style={styles.interactionDescription}>{interaction.description}</Text>
                <View style={styles.effectsList}>
                  <Text style={styles.effectsLabel}>Effects:</Text>
                  {interaction.effects.map((effect, index) => (
                    <Text key={index} style={styles.effectItem}>• {effect}</Text>
                  ))}
                </View>
                <View style={styles.recommendationsList}>
                  <Text style={styles.effectsLabel}>Recommendations:</Text>
                  {interaction.recommendations.map((rec, index) => (
                    <Text key={index} style={styles.effectItem}>• {rec}</Text>
                  ))}
                </View>
                {interaction.timing && (
                  <Text style={styles.timing}>
                    <Text style={styles.timingLabel}>Timing: </Text>
                    {interaction.timing}
                  </Text>
                )}
              </Card>
            ))}
          </View>
        )}

        {/* Herbal Interactions */}
        {(selectedType === 'all' || selectedType === 'herbal') && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Herbal Interactions</Text>
            </View>
            {filteredHerbalInteractions.map(interaction => (
              <Card key={interaction.id} style={styles.interactionCard}>
                <View style={styles.interactionHeader}>
                  <Text style={styles.interactionTitle}>
                    {interaction.herb} ({interaction.commonName})
                  </Text>
                </View>
                <Text style={styles.scientificName}>{interaction.scientificName}</Text>
                <View style={styles.effectsList}>
                  <Text style={styles.effectsLabel}>Interacts With:</Text>
                  {interaction.interactsWith.map((item, index) => (
                    <Text key={index} style={styles.effectItem}>• {item}</Text>
                  ))}
                </View>
                <View style={styles.effectsList}>
                  <Text style={styles.effectsLabel}>Contraindications:</Text>
                  {interaction.contraindications.map((item, index) => (
                    <Text key={index} style={styles.effectItem}>• {item}</Text>
                  ))}
                </View>
                <Text style={styles.dosage}>
                  <Text style={styles.dosageLabel}>Dosage Guidelines: </Text>
                  {interaction.dosageGuidelines}
                </Text>
                <View style={styles.safetyInfo}>
                  <Text style={styles.safetyLabel}>Pregnancy: </Text>
                  <Badge 
                    label={interaction.pregnancySafety.toUpperCase()} 
                    variant={interaction.pregnancySafety === 'safe' ? 'success' : interaction.pregnancySafety === 'avoid' ? 'error' : 'warning'}
                  />
                  <Text style={styles.safetyLabel}>Breastfeeding: </Text>
                  <Badge 
                    label={interaction.breastfeedingSafety.toUpperCase()} 
                    variant={interaction.breastfeedingSafety === 'safe' ? 'success' : interaction.breastfeedingSafety === 'avoid' ? 'error' : 'warning'}
                  />
                </View>
              </Card>
            ))}
          </View>
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
    padding: 16,
  },
  alertsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  alertCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
    backgroundColor: colors.background.secondary,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginLeft: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  alertRecommendation: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  recommendationLabel: {
    fontWeight: '600',
    color: '#DC2626',
  },
  severityBadge: {
    alignSelf: 'flex-start',
  },
  searchSection: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  interactionCard: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  interactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  interactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  interactionDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  interactionMechanism: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  mechanismLabel: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  effectsList: {
    marginBottom: 8,
  },
  effectsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  effectItem: {
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 8,
    lineHeight: 18,
  },
  recommendationsList: {
    marginBottom: 8,
  },
  management: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  managementLabel: {
    fontWeight: '600',
    color: '#10B981',
  },
  timing: {
    fontSize: 14,
    color: '#1F2937',
    marginTop: 8,
    lineHeight: 20,
  },
  timingLabel: {
    fontWeight: '600',
    color: '#8B5CF6',
  },
  scientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#6B7280',
    marginBottom: 8,
  },
  dosage: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  dosageLabel: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  safetyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  safetyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
});