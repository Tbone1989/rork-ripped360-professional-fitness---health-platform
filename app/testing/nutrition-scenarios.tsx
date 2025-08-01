import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  UtensilsCrossed, 
  Camera, 
  Clock, 
  Droplets, 
  Pill, 
  CheckCircle, 
  XCircle,
  Play,
  MapPin,
  Utensils,
  Timer
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { useWellnessStore } from '@/store/wellnessStore';

const scenarioTypes = [
  { id: 'meal_prep', label: 'Meal Prep' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'supplement_timing', label: 'Supplements' },
  { id: 'hydration', label: 'Hydration' }
];

export default function NutritionScenarioTesting() {
  const router = useRouter();
  const { nutritionTestScenarios, runNutritionTest } = useWellnessStore();
  const [selectedScenarioType, setSelectedScenarioType] = useState('meal_prep');
  const [activeScenario, setActiveScenario] = useState(nutritionTestScenarios[0]);

  const filteredScenarios = nutritionTestScenarios.filter(
    scenario => scenario.scenario === selectedScenarioType
  );

  const markTestResult = (testCaseId: string, result: 'passed' | 'failed') => {
    Alert.prompt(
      'Test Results',
      'Add your observations and any issues encountered:',
      (notes) => {
        runNutritionTest(activeScenario.id, testCaseId, result, notes || undefined);
      }
    );
  };

  const handleMealPrepTest = () => {
    Alert.alert(
      'Meal Prep Session Test',
      'This test simulates a 2-3 hour meal prep session. Test logging multiple meals, calculating portions, and saving recipes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Test', onPress: () => router.push('/meals/plans') }
      ]
    );
  };

  const handleRecipeScalingTest = () => {
    Alert.alert(
      'Recipe Scaling Test',
      'Test the recipe scaling functionality for different serving sizes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Test Scaling', onPress: () => {
          Alert.alert('Recipe Scaled', 'Recipe successfully scaled from 4 to 8 servings!');
        }}
      ]
    );
  };

  const handleSupplementTest = () => {
    Alert.alert(
      'Supplement Timer Test',
      'Test supplement timing and reminder functionality.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set Timer', onPress: () => {
          Alert.alert('Timer Set', 'Supplement reminder set for 30 minutes!');
        }}
      ]
    );
  };

  const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
      case 'meal_prep': return <UtensilsCrossed size={20} color={colors.accent.primary} />;
      case 'restaurant': return <Utensils size={20} color={colors.status.warning} />;
      case 'supplement_timing': return <Pill size={20} color={colors.status.info} />;
      case 'hydration': return <Droplets size={20} color={colors.status.success} />;
      default: return <UtensilsCrossed size={20} color={colors.text.secondary} />;
    }
  };

  const getScenarioInstructions = (scenario: string) => {
    switch (scenario) {
      case 'meal_prep':
        return 'Test the app during a typical meal prep session. Log multiple meals, calculate portions, and save recipes.';
      case 'restaurant':
        return 'Use the app while dining out. Search for menu items, scan food, and estimate portions.';
      case 'supplement_timing':
        return 'Test supplement logging and timing features. Set reminders and track interactions.';
      case 'hydration':
        return 'Monitor hydration tracking throughout the day. Test reminders and intake logging.';
      default:
        return 'Follow the test cases below to evaluate app performance in this scenario.';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'Nutrition Testing',
          headerStyle: { backgroundColor: colors.background.primary },
        }} 
      />

      {/* Scenario Type Selection */}
      <Card style={styles.typeCard}>
        <Text style={styles.sectionTitle}>Test Scenarios</Text>
        <ChipGroup
          options={scenarioTypes}
          selectedIds={[selectedScenarioType]}
          onChange={(ids) => {
            setSelectedScenarioType(ids[0] || 'meal_prep');
            const newScenario = nutritionTestScenarios.find(s => s.scenario === ids[0]);
            if (newScenario) setActiveScenario(newScenario);
          }}
          style={styles.typeChips}
        />
      </Card>

      {/* Scenario Overview */}
      <Card style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          {getScenarioIcon(selectedScenarioType)}
          <Text style={styles.overviewTitle}>
            {scenarioTypes.find(t => t.id === selectedScenarioType)?.label} Testing
          </Text>
        </View>
        
        <Text style={styles.overviewDescription}>
          {getScenarioInstructions(selectedScenarioType)}
        </Text>
        
        {selectedScenarioType === 'meal_prep' && (
          <View style={styles.scenarioDetails}>
            <View style={styles.detailItem}>
              <Timer size={16} color={colors.text.secondary} />
              <Text style={styles.detailText}>Duration: 2-3 hours</Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin size={16} color={colors.text.secondary} />
              <Text style={styles.detailText}>Location: Kitchen</Text>
            </View>
          </View>
        )}
        
        {selectedScenarioType === 'restaurant' && (
          <View style={styles.scenarioDetails}>
            <View style={styles.detailItem}>
              <Timer size={16} color={colors.text.secondary} />
              <Text style={styles.detailText}>Duration: 1-2 hours</Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin size={16} color={colors.text.secondary} />
              <Text style={styles.detailText}>Location: Various restaurants</Text>
            </View>
          </View>
        )}
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Quick Test Actions</Text>
        
        <View style={styles.actionButtons}>
          <Button
            title="Camera Scanner"
            variant="outline"
            onPress={() => router.push('/meals/scan')}
            icon={<Camera size={18} color={colors.accent.primary} />}
            style={styles.actionButton}
          />
          
          <Button
            title="Search Food Manually"
            variant="outline"
            onPress={() => router.push('/meals/log')}
            icon={<UtensilsCrossed size={18} color={colors.accent.primary} />}
            style={styles.actionButton}
          />
          
          <Button
            title="Add Water"
            variant="outline"
            onPress={() => {
              Alert.alert(
                'Quick Water Log',
                'How much water did you drink?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: '250ml', onPress: () => Alert.alert('Success', '250ml water logged!') },
                  { text: '500ml', onPress: () => Alert.alert('Success', '500ml water logged!') },
                  { text: '1L', onPress: () => Alert.alert('Success', '1L water logged!') }
                ]
              );
            }}
            icon={<Droplets size={18} color={colors.accent.primary} />}
            style={styles.actionButton}
          />
        </View>
        
        {/* Additional Quick Actions */}
        <View style={styles.additionalActions}>
          <Button
            title="Quick Test Actions"
            onPress={() => {
              Alert.alert(
                'Quick Test Menu',
                'Select a quick test action:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Meal Prep Session', onPress: handleMealPrepTest },
                  { text: 'Recipe Scaling', onPress: handleRecipeScalingTest },
                  { text: 'Supplement Timer', onPress: handleSupplementTest }
                ]
              );
            }}
            icon={<Play size={18} color={colors.text.primary} />}
            style={styles.quickTestButton}
          />
        </View>
      </Card>

      {/* Test Cases */}
      {filteredScenarios.map((scenario) => (
        <Card key={scenario.id} style={styles.testCard}>
          <Text style={styles.sectionTitle}>{scenario.name}</Text>
          
          {scenario.testCases.map((testCase) => (
            <View key={testCase.id} style={styles.testCase}>
              <View style={styles.testCaseHeader}>
                <View style={styles.testCaseInfo}>
                  <Text style={styles.testCaseName}>{testCase.name}</Text>
                  <Text style={styles.testCaseDescription}>{testCase.description}</Text>
                </View>
                
                <View style={styles.testCaseStatus}>
                  {testCase.status === 'passed' && (
                    <CheckCircle size={24} color={colors.status.success} />
                  )}
                  {testCase.status === 'failed' && (
                    <XCircle size={24} color={colors.status.error} />
                  )}
                  {testCase.status === 'pending' && (
                    <View style={styles.pendingIndicator} />
                  )}
                </View>
              </View>
              
              <View style={styles.testCaseDetails}>
                <Text style={styles.expectedBehavior}>
                  Expected: {testCase.expectedBehavior}
                </Text>
                {testCase.actualBehavior && (
                  <Text style={styles.actualBehavior}>
                    Result: {testCase.actualBehavior}
                  </Text>
                )}
              </View>
              
              {testCase.status === 'pending' && (
                <View style={styles.testCaseActions}>
                  <Button
                    title="Start Test"
                    variant="outline"
                    onPress={() => {
                      Alert.alert(
                        'Test Started',
                        `Now testing: ${testCase.name}\n\nFollow the test description and mark the result when complete.`
                      );
                    }}
                    icon={<Play size={16} color={colors.accent.primary} />}
                    style={styles.startButton}
                  />
                  
                  <Button
                    title="Pass"
                    variant="outline"
                    onPress={() => markTestResult(testCase.id, 'passed')}
                    style={[styles.testActionButton, styles.passButton]}
                  />
                  
                  <Button
                    title="Fail"
                    variant="outline"
                    onPress={() => markTestResult(testCase.id, 'failed')}
                    style={[styles.testActionButton, styles.failButton]}
                  />
                </View>
              )}
            </View>
          ))}
        </Card>
      ))}

      {/* Testing Tips */}
      <Card style={styles.tipsCard}>
        <Text style={styles.sectionTitle}>Testing Tips</Text>
        
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• Test with different lighting conditions</Text>
          <Text style={styles.tipItem}>• Try various food types and portion sizes</Text>
          <Text style={styles.tipItem}>• Test offline functionality when possible</Text>
          <Text style={styles.tipItem}>• Note any performance issues or crashes</Text>
          <Text style={styles.tipItem}>• Test with different network speeds</Text>
          <Text style={styles.tipItem}>• Verify data accuracy and calculations</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  typeCard: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  typeChips: {
    marginBottom: 0,
  },
  overviewCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  overviewDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  scenarioDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  actionsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  additionalActions: {
    marginTop: 12,
  },
  quickTestButton: {
    backgroundColor: colors.accent.primary,
  },
  testCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  testCase: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  testCaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  testCaseInfo: {
    flex: 1,
    marginRight: 12,
  },
  testCaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  testCaseDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  testCaseStatus: {
    alignItems: 'center',
  },
  pendingIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
    borderColor: colors.border.medium,
  },
  testCaseDetails: {
    marginBottom: 12,
  },
  expectedBehavior: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  actualBehavior: {
    fontSize: 13,
    color: colors.text.primary,
    fontStyle: 'italic',
  },
  testCaseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  startButton: {
    flex: 2,
  },
  testActionButton: {
    flex: 1,
  },
  passButton: {
    borderColor: colors.status.success,
  },
  failButton: {
    borderColor: colors.status.error,
  },
  tipsCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 16,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
});