import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, PlusCircle, FileText, Pill, Camera, Brain, Leaf, Info } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TabBar } from '@/components/ui/TabBar';
import { BloodworkCard } from '@/components/medical/BloodworkCard';
import { SupplementCard } from '@/components/medical/SupplementCard';
import { HerbCard } from '@/components/medical/HerbCard';
import { recentBloodworkResults } from '@/mocks/bloodwork';
import { popularSupplements, peptidesMedicines, herbalInteractions } from '@/mocks/supplements';

const tabs = [
  { key: 'bloodwork', label: 'Bloodwork' },
  { key: 'supplements', label: 'Supplements' },
  { key: 'medicines', label: 'Medicines' },
];

export default function MedicalScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bloodwork');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Medical & Health</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => router.push('/medical/scan')}
          >
            <Camera size={20} color={colors.accent.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            inputStyle={styles.searchInputText}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.tabBar}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'bloodwork' && (
          <>
            <View style={styles.actionSection}>
              <View style={styles.actionButtons}>
                <Button
                  title="Upload Results"
                  icon={<PlusCircle size={18} color={colors.text.primary} />}
                  onPress={() => router.push('/medical/upload')}
                  style={[styles.actionButton, styles.actionButtonHalf]}
                  testID="btn-upload-results"
                />
                <Button
                  title="AI Analysis"
                  icon={<Brain size={18} color={colors.text.primary} />}
                  onPress={() => router.push('/medical/ai-analysis')}
                  style={[styles.actionButton, styles.actionButtonHalf, styles.aiButton]}
                  testID="btn-ai-analysis"
                />
              </View>
              <View style={styles.actionButtonsSecondary}>
                <Button
                  title="Holistic Care"
                  icon={<Leaf size={18} color={colors.text.primary} />}
                  onPress={() => router.push('/medical/holistic')}
                  style={[styles.actionButton]}
                  testID="btn-holistic-care"
                />
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Results</Text>
              {recentBloodworkResults.map((result) => (
                <BloodworkCard key={result.id} result={result} />
              ))}
            </View>
          </>
        )}

        {activeTab === 'supplements' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Supplements</Text>
              {popularSupplements.map((supplement) => (
                <SupplementCard 
                  key={supplement.id} 
                  item={supplement} 
                  type="supplement" 
                />
              ))}
            </View>
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.guideLink}
                onPress={() => {
                  console.log('[MedicalScreen] Navigate to /supplements/guide');
                  router.push('/supplements/guide');
                }}
                testID="btn-supplement-guide"
                activeOpacity={0.8}
              >
                <View style={styles.guideIconWrap}>
                  <Info size={18} color={colors.accent.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guideTitle}>Pre-Workout, Protein & Fiber Guides</Text>
                  <Text style={styles.guideSubtitle}>What to look for, evidence-backed dosages, and safety checklist</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Herbal Medicine</Text>
              {herbalInteractions.map((herb) => (
                <HerbCard key={herb.id} herb={herb} />
              ))}
            </View>
          </>
        )}

        {activeTab === 'medicines' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Peptides & Medicines</Text>
              {peptidesMedicines.map((medicine) => (
                <SupplementCard 
                  key={medicine.id} 
                  item={medicine} 
                  type="medicine"
                  initialExpanded={true}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {activeTab === 'bloodwork' && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => router.push('/medical/upload')}
        >
          <PlusCircle size={24} color={colors.text.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 16,
    paddingBottom: 0,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  scanButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  searchInputText: {
    paddingVertical: 10,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tabBar: {
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  actionSection: {
    padding: 16,
    paddingBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButtonsSecondary: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
  actionButtonHalf: {
    flex: 1,
  },
  aiButton: {
    backgroundColor: '#3498db',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  guideLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  guideIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  guideSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});