import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import {
  Sparkles,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  Zap,
  Info,
  ShoppingCart,
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Supplement {
  name: string;
  dosage: string;
  timing: string;
}

interface OptimizationResult {
  score: number;
  interactions: string[];
  redundancies: string[];
  missing: string[];
  optimizedStack: Supplement[];
  savings: number;
  recommendations: string[];
}

export default function AISupplementOptimizerScreen() {
  const router = useRouter();
  const [currentStack, setCurrentStack] = useState<Supplement[]>([
    { name: 'Whey Protein', dosage: '30g', timing: 'Post-workout' },
    { name: 'Creatine', dosage: '5g', timing: 'Anytime' },
    { name: 'Multivitamin', dosage: '1 tablet', timing: 'Morning' },
  ]);
  const [newSupplement, setNewSupplement] = useState({ name: '', dosage: '', timing: '' });
  const [goals, setGoals] = useState({
    muscleGain: true,
    fatLoss: false,
    performance: true,
    recovery: true,
    health: false,
  });
  const [budget, setBudget] = useState('150');
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const timingOptions = ['Morning', 'Pre-workout', 'Post-workout', 'Before bed', 'With meals', 'Anytime'];

  const addSupplement = () => {
    if (newSupplement.name && newSupplement.dosage) {
      setCurrentStack([...currentStack, { ...newSupplement, timing: newSupplement.timing || 'Anytime' }]);
      setNewSupplement({ name: '', dosage: '', timing: '' });
    }
  };

  const removeSupplement = (index: number) => {
    setCurrentStack(currentStack.filter((_, i) => i !== index));
  };

  const optimizeStack = async () => {
    setIsOptimizing(true);
    
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an AI supplement expert. Analyze supplement stacks for interactions, redundancies, and optimization. Return JSON with: score (0-100), interactions (array), redundancies (array), missing (array), optimizedStack (array of {name, dosage, timing}), savings (number), recommendations (array).'
            },
            {
              role: 'user',
              content: `Analyze this supplement stack: ${JSON.stringify(currentStack)}. Goals: ${JSON.stringify(goals)}. Budget: $${budget}/month. Optimize for safety, efficacy, and cost.`
            }
          ]
        })
      });

      const data = await response.json();
      const parsed = JSON.parse(data.completion);
      setOptimization(parsed);
    } catch (error) {
      // Fallback mock data
      const mockOptimization: OptimizationResult = {
        score: 85,
        interactions: [],
        redundancies: ['Multiple sources of B vitamins detected'],
        missing: ['Omega-3', 'Vitamin D3', 'Magnesium'],
        optimizedStack: [
          { name: 'Whey Protein', dosage: '30g', timing: 'Post-workout' },
          { name: 'Creatine Monohydrate', dosage: '5g', timing: 'Anytime' },
          { name: 'Omega-3', dosage: '2g', timing: 'With meals' },
          { name: 'Vitamin D3', dosage: '2000 IU', timing: 'Morning' },
          { name: 'Magnesium Glycinate', dosage: '400mg', timing: 'Before bed' },
          { name: 'Multivitamin', dosage: '1 tablet', timing: 'Morning' },
        ],
        savings: 25,
        recommendations: [
          'Add Omega-3 for anti-inflammatory benefits',
          'Consider Vitamin D3 for immune support',
          'Magnesium will improve sleep and recovery',
          'Current protein timing is optimal',
        ]
      };
      setOptimization(mockOptimization);
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyOptimization = () => {
    if (optimization) {
      setCurrentStack(optimization.optimizedStack);
      Alert.alert('Success', 'Your stack has been optimized!');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'AI Stack Optimizer',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* AI Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiBannerContent}>
            <Sparkles size={24} color="#FFFFFF" />
            <View style={styles.aiBannerText}>
              <Text style={styles.aiBannerTitle}>Smart Supplement Analysis</Text>
              <Text style={styles.aiBannerSubtitle}>Optimize for safety, efficacy & cost</Text>
            </View>
          </View>
        </View>

        {/* Goals Selection */}
        <Card style={styles.goalsCard}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          <View style={styles.goalsGrid}>
            {Object.entries(goals).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[styles.goalChip, value && styles.goalChipActive]}
                onPress={() => setGoals({ ...goals, [key]: !value })}
              >
                <Text style={[styles.goalText, value && styles.goalTextActive]}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Budget Input */}
        <Card style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <DollarSign size={20} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Monthly Budget</Text>
          </View>
          <View style={styles.budgetInput}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.budgetField}
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              placeholder="150"
              placeholderTextColor={colors.text.secondary}
            />
            <Text style={styles.budgetPeriod}>/month</Text>
          </View>
        </Card>

        {/* Current Stack */}
        <Card style={styles.stackCard}>
          <Text style={styles.sectionTitle}>Current Stack</Text>
          
          {currentStack.map((supp, index) => (
            <View key={index} style={styles.supplementRow}>
              <View style={styles.supplementInfo}>
                <Text style={styles.supplementName}>{supp.name}</Text>
                <View style={styles.supplementDetails}>
                  <Text style={styles.supplementDosage}>{supp.dosage}</Text>
                  <Text style={styles.supplementTiming}>• {supp.timing}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeSupplement(index)}>
                <X size={20} color={colors.status.error} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Supplement Form */}
          <View style={styles.addForm}>
            <TextInput
              style={styles.addInput}
              placeholder="Supplement name"
              placeholderTextColor={colors.text.secondary}
              value={newSupplement.name}
              onChangeText={(text) => setNewSupplement({ ...newSupplement, name: text })}
            />
            <TextInput
              style={styles.addInput}
              placeholder="Dosage"
              placeholderTextColor={colors.text.secondary}
              value={newSupplement.dosage}
              onChangeText={(text) => setNewSupplement({ ...newSupplement, dosage: text })}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timingScroll}>
              {timingOptions.map((timing) => (
                <TouchableOpacity
                  key={timing}
                  style={[
                    styles.timingChip,
                    newSupplement.timing === timing && styles.timingChipActive
                  ]}
                  onPress={() => setNewSupplement({ ...newSupplement, timing })}
                >
                  <Text style={[
                    styles.timingText,
                    newSupplement.timing === timing && styles.timingTextActive
                  ]}>
                    {timing}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={addSupplement}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Supplement</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Optimize Button */}
        <Button
          title={isOptimizing ? "Analyzing..." : "Optimize My Stack"}
          onPress={optimizeStack}
          disabled={isOptimizing || currentStack.length === 0}
          style={styles.optimizeButton}
        />

        {/* Optimization Results */}
        {optimization && (
          <>
            {/* Score Card */}
            <Card style={styles.scoreCard}>
              <Text style={styles.scoreTitle}>Stack Score</Text>
              <Text style={[
                styles.scoreValue,
                { color: optimization.score >= 80 ? colors.status.success : colors.status.warning }
              ]}>
                {optimization.score}/100
              </Text>
              <Text style={styles.scoreSubtitle}>
                {optimization.score >= 80 ? 'Excellent Stack!' : 'Room for Improvement'}
              </Text>
            </Card>

            {/* Issues & Warnings */}
            {(optimization.interactions.length > 0 || optimization.redundancies.length > 0) && (
              <Card style={styles.warningsCard}>
                <View style={styles.warningsHeader}>
                  <AlertTriangle size={20} color={colors.status.warning} />
                  <Text style={styles.warningsTitle}>Issues Found</Text>
                </View>
                
                {optimization.interactions.map((interaction, index) => (
                  <View key={index} style={styles.warning}>
                    <Text style={styles.warningText}>⚠️ {interaction}</Text>
                  </View>
                ))}
                
                {optimization.redundancies.map((redundancy, index) => (
                  <View key={index} style={styles.warning}>
                    <Text style={styles.warningText}>🔄 {redundancy}</Text>
                  </View>
                ))}
              </Card>
            )}

            {/* Missing Supplements */}
            {optimization.missing.length > 0 && (
              <Card style={styles.missingCard}>
                <View style={styles.missingHeader}>
                  <Info size={20} color={colors.status.info} />
                  <Text style={styles.missingTitle}>Recommended Additions</Text>
                </View>
                {optimization.missing.map((supp, index) => (
                  <View key={index} style={styles.missingSupplement}>
                    <CheckCircle size={16} color={colors.status.success} />
                    <Text style={styles.missingText}>{supp}</Text>
                  </View>
                ))}
              </Card>
            )}

            {/* Optimized Stack */}
            <Card style={styles.optimizedCard}>
              <View style={styles.optimizedHeader}>
                <Zap size={20} color={colors.accent.primary} />
                <Text style={styles.optimizedTitle}>Optimized Stack</Text>
                {optimization.savings > 0 && (
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>Save ${optimization.savings}/mo</Text>
                  </View>
                )}
              </View>
              
              {optimization.optimizedStack.map((supp, index) => (
                <View key={index} style={styles.optimizedSupplement}>
                  <View style={styles.timingIndicator}>
                    <Clock size={14} color={colors.text.secondary} />
                    <Text style={styles.optimizedTiming}>{supp.timing}</Text>
                  </View>
                  <View style={styles.optimizedInfo}>
                    <Text style={styles.optimizedName}>{supp.name}</Text>
                    <Text style={styles.optimizedDosage}>{supp.dosage}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.optimizedActions}>
                <Button
                  title="Apply Changes"
                  onPress={applyOptimization}
                  style={styles.applyButton}
                />
                <Button
                  title="Shop Stack"
                  variant="outline"
                  onPress={() => router.push('/shop')}
                  style={styles.shopButton}
                />
              </View>
            </Card>

            {/* Recommendations */}
            <Card style={styles.recommendationsCard}>
              <Text style={styles.recommendationsTitle}>AI Recommendations</Text>
              {optimization.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendation}>
                  <Target size={14} color={colors.accent.secondary} />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  aiBanner: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EC4899',
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  aiBannerText: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiBannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  goalsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  goalChipActive: {
    backgroundColor: colors.accent.primary + '15',
    borderColor: colors.accent.primary,
  },
  goalText: {
    fontSize: 13,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  goalTextActive: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  budgetCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  budgetInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 4,
  },
  budgetField: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  budgetPeriod: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  stackCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  supplementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  supplementInfo: {
    flex: 1,
  },
  supplementName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  supplementDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  supplementDosage: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  supplementTiming: {
    fontSize: 13,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  addForm: {
    marginTop: 16,
  },
  addInput: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 12,
  },
  timingScroll: {
    marginBottom: 12,
  },
  timingChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    marginRight: 8,
  },
  timingChipActive: {
    backgroundColor: colors.accent.primary + '15',
  },
  timingText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  timingTextActive: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optimizeButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  scoreCard: {
    margin: 16,
    padding: 24,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    marginVertical: 8,
  },
  scoreSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  warningsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: colors.status.warning + '10',
  },
  warningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  warningsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  warning: {
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  missingCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  missingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  missingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  missingSupplement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  missingText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  optimizedCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  optimizedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  optimizedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    marginLeft: 8,
  },
  savingsBadge: {
    backgroundColor: colors.status.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.status.success,
  },
  optimizedSupplement: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  timingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 100,
  },
  optimizedTiming: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  optimizedInfo: {
    flex: 1,
  },
  optimizedName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  optimizedDosage: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  optimizedActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  applyButton: {
    flex: 1,
  },
  shopButton: {
    flex: 1,
  },
  recommendationsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
});