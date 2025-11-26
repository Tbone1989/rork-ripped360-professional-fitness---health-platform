import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput
} from 'react-native';
import { Stack, router } from 'expo-router';
import { 
  UtensilsCrossed, 
  Clock, 
  AlertTriangle, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Target
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useContestStore } from '@/store/contestStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { NutritionTiming, EmergencyProtocol } from '@/types/contest';

export default function NutritionScreen() {
  const { currentPrep, updateContestPrep } = useContestStore();
  const [selectedTab, setSelectedTab] = useState<'contest-day' | 'backup' | 'emergency'>('contest-day');
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<NutritionTiming | null>(null);
  const [mealType, setMealType] = useState<'preShow' | 'postShow'>('preShow');

  const [newMeal, setNewMeal] = useState({
    time: '',
    food: '',
    amount: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    sodium: '',
    purpose: ''
  });

  if (!currentPrep) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Stage Nutrition' }} />
        <View style={styles.emptyState}>
          <UtensilsCrossed size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Contest Prep Selected</Text>
          <Text style={styles.emptyDescription}>
            Please select a contest prep to manage stage nutrition plans.
          </Text>
        </View>
      </View>
    );
  }

  const nutrition = currentPrep.stageReadyNutrition;

  const handleAddMeal = () => {
    if (!newMeal.time || !newMeal.food || !newMeal.amount) {
      Alert.alert('Error', 'Please fill in time, food, and amount');
      return;
    }

    const meal: NutritionTiming = {
      time: newMeal.time,
      food: newMeal.food,
      amount: newMeal.amount,
      macros: {
        calories: parseInt(newMeal.calories) || 0,
        protein: parseInt(newMeal.protein) || 0,
        carbs: parseInt(newMeal.carbs) || 0,
        fat: parseInt(newMeal.fat) || 0,
        sodium: parseInt(newMeal.sodium) || 0,
      },
      purpose: newMeal.purpose
    };

    const updatedNutrition = {
      ...nutrition,
      contestDay: {
        ...nutrition.contestDay,
        [mealType]: [...nutrition.contestDay[mealType], meal]
      }
    };

    updateContestPrep(currentPrep.id, { stageReadyNutrition: updatedNutrition });
    
    setNewMeal({
      time: '',
      food: '',
      amount: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      sodium: '',
      purpose: ''
    });
    setShowAddMeal(false);
    
    Alert.alert('Success', 'Meal added successfully');
  };

  const handleDeleteMeal = (index: number, type: 'preShow' | 'postShow') => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedMeals = nutrition.contestDay[type].filter((_, i) => i !== index);
            const updatedNutrition = {
              ...nutrition,
              contestDay: {
                ...nutrition.contestDay,
                [type]: updatedMeals
              }
            };
            updateContestPrep(currentPrep.id, { stageReadyNutrition: updatedNutrition });
          }
        }
      ]
    );
  };

  const renderMealCard = (meal: NutritionTiming, index: number, type: 'preShow' | 'postShow') => (
    <Card key={index} style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <View style={styles.mealTime}>
          <Clock size={16} color={colors.accent.primary} />
          <Text style={styles.mealTimeText}>{meal.time}</Text>
        </View>
        <View style={styles.mealActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setEditingMeal(meal);
              setMealType(type);
              setShowAddMeal(true);
            }}
          >
            <Edit size={16} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteMeal(index, type)}
          >
            <Trash2 size={16} color={colors.status.error} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.mealFood}>{meal.food}</Text>
      <Text style={styles.mealAmount}>Amount: {meal.amount}</Text>
      
      {meal.purpose && (
        <Text style={styles.mealPurpose}>Purpose: {meal.purpose}</Text>
      )}

      <View style={styles.macrosRow}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.macros.calories}</Text>
          <Text style={styles.macroLabel}>Cal</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.macros.protein}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.macros.carbs}g</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.macros.fat}g</Text>
          <Text style={styles.macroLabel}>Fat</Text>
        </View>
        {meal.macros.sodium > 0 && (
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.macros.sodium}mg</Text>
            <Text style={styles.macroLabel}>Sodium</Text>
          </View>
        )}
      </View>
    </Card>
  );

  const renderContestDay = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pre-Show Meals</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setMealType('preShow');
            setShowAddMeal(true);
          }}
        >
          <Plus size={20} color={colors.accent.primary} />
        </TouchableOpacity>
      </View>
      
      {nutrition.contestDay.preShow.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyCardText}>No pre-show meals planned</Text>
          <Text style={styles.emptyCardSubtext}>
            Add meals to eat before your competition
          </Text>
        </Card>
      ) : (
        nutrition.contestDay.preShow
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((meal, index) => renderMealCard(meal, index, 'preShow'))
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Post-Show Meals</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setMealType('postShow');
            setShowAddMeal(true);
          }}
        >
          <Plus size={20} color={colors.accent.primary} />
        </TouchableOpacity>
      </View>
      
      {nutrition.contestDay.postShow.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyCardText}>No post-show meals planned</Text>
          <Text style={styles.emptyCardSubtext}>
            Plan your celebration meals after competition
          </Text>
        </Card>
      ) : (
        nutrition.contestDay.postShow
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((meal, index) => renderMealCard(meal, index, 'postShow'))
      )}
    </View>
  );

  const renderBackupPlans = () => (
    <View style={styles.tabContent}>
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Backup Nutrition Plans</Text>
        <Text style={styles.infoText}>
          Prepare for common contest day scenarios with backup meal plans.
        </Text>
      </Card>

      <View style={styles.backupSection}>
        <Text style={styles.backupTitle}>Flat Muscles Protocol</Text>
        <Text style={styles.backupDescription}>
          If muscles appear flat or lacking fullness
        </Text>
        {/* Add backup plan items here */}
      </View>

      <View style={styles.backupSection}>
        <Text style={styles.backupTitle}>Spillover Protocol</Text>
        <Text style={styles.backupDescription}>
          If holding too much water or appearing soft
        </Text>
        {/* Add backup plan items here */}
      </View>

      <View style={styles.backupSection}>
        <Text style={styles.backupTitle}>Low Energy Protocol</Text>
        <Text style={styles.backupDescription}>
          If feeling weak or lacking energy
        </Text>
        {/* Add backup plan items here */}
      </View>
    </View>
  );

  const renderEmergencyProtocols = () => (
    <View style={styles.tabContent}>
      <Card style={styles.warningCard}>
        <View style={styles.warningHeader}>
          <AlertTriangle size={20} color={colors.status.error} />
          <Text style={styles.warningTitle}>Emergency Protocols</Text>
        </View>
        <Text style={styles.warningText}>
          Quick fixes for last-minute issues. Use only when necessary and under coach guidance.
        </Text>
      </Card>

      {nutrition.emergencyProtocols.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyCardText}>No emergency protocols set</Text>
          <Text style={styles.emptyCardSubtext}>
            Work with your coach to create emergency backup plans
          </Text>
        </Card>
      ) : (
        nutrition.emergencyProtocols.map((protocol, index) => (
          <Card key={index} style={styles.protocolCard}>
            <Text style={styles.protocolScenario}>{protocol.scenario}</Text>
            <Text style={styles.protocolAction}>{protocol.action}</Text>
            <Text style={styles.protocolTiming}>Timing: {protocol.timing}</Text>
            <Text style={styles.protocolFoods}>
              Foods: {protocol.foods.join(', ')}
            </Text>
            {protocol.notes && (
              <Text style={styles.protocolNotes}>{protocol.notes}</Text>
            )}
          </Card>
        ))
      )}
    </View>
  );

  const renderAddMealForm = () => {
    if (!showAddMeal) return null;

    return (
      <Card style={styles.addMealCard}>
        <Text style={styles.formTitle}>
          {editingMeal ? 'Edit Meal' : `Add ${mealType === 'preShow' ? 'Pre-Show' : 'Post-Show'} Meal`}
        </Text>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Time *</Text>
            <TextInput
              style={styles.input}
              value={newMeal.time}
              onChangeText={(text) => setNewMeal(prev => ({ ...prev, time: text }))}
              placeholder="7:00 AM"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount *</Text>
            <TextInput
              style={styles.input}
              value={newMeal.amount}
              onChangeText={(text) => setNewMeal(prev => ({ ...prev, amount: text }))}
              placeholder="1 cup"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Food *</Text>
          <TextInput
            style={styles.input}
            value={newMeal.food}
            onChangeText={(text) => setNewMeal(prev => ({ ...prev, food: text }))}
            placeholder="Rice cakes with honey"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Purpose</Text>
          <TextInput
            style={styles.input}
            value={newMeal.purpose}
            onChangeText={(text) => setNewMeal(prev => ({ ...prev, purpose: text }))}
            placeholder="Quick energy and muscle fullness"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <Text style={styles.macrosTitle}>Macros (Optional)</Text>
        
        <View style={styles.macrosInputRow}>
          <View style={styles.macroInputGroup}>
            <Text style={styles.inputLabel}>Calories</Text>
            <TextInput
              style={styles.input}
              value={newMeal.calories}
              onChangeText={(text) => setNewMeal(prev => ({ ...prev, calories: text }))}
              placeholder="120"
              keyboardType="numeric"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          <View style={styles.macroInputGroup}>
            <Text style={styles.inputLabel}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              value={newMeal.protein}
              onChangeText={(text) => setNewMeal(prev => ({ ...prev, protein: text }))}
              placeholder="2"
              keyboardType="numeric"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>

        <View style={styles.macrosInputRow}>
          <View style={styles.macroInputGroup}>
            <Text style={styles.inputLabel}>Carbs (g)</Text>
            <TextInput
              style={styles.input}
              value={newMeal.carbs}
              onChangeText={(text) => setNewMeal(prev => ({ ...prev, carbs: text }))}
              placeholder="28"
              keyboardType="numeric"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          <View style={styles.macroInputGroup}>
            <Text style={styles.inputLabel}>Fat (g)</Text>
            <TextInput
              style={styles.input}
              value={newMeal.fat}
              onChangeText={(text) => setNewMeal(prev => ({ ...prev, fat: text }))}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Sodium (mg)</Text>
          <TextInput
            style={styles.input}
            value={newMeal.sodium}
            onChangeText={(text) => setNewMeal(prev => ({ ...prev, sodium: text }))}
            placeholder="50"
            keyboardType="numeric"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <View style={styles.formButtons}>
          <Button
            title="Cancel"
            onPress={() => {
              setShowAddMeal(false);
              setEditingMeal(null);
              setNewMeal({
                time: '',
                food: '',
                amount: '',
                calories: '',
                protein: '',
                carbs: '',
                fat: '',
                sodium: '',
                purpose: ''
              });
            }}
            variant="secondary"
            style={styles.formButton}
          />
          <Button
            title={editingMeal ? 'Update' : 'Add Meal'}
            onPress={handleAddMeal}
            style={styles.formButton}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Stage Nutrition' }} />
      
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'contest-day' && styles.tabActive]}
          onPress={() => setSelectedTab('contest-day')}
        >
          <Text style={[styles.tabText, selectedTab === 'contest-day' && styles.tabTextActive]}>
            Contest Day
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'backup' && styles.tabActive]}
          onPress={() => setSelectedTab('backup')}
        >
          <Text style={[styles.tabText, selectedTab === 'backup' && styles.tabTextActive]}>
            Backup Plans
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'emergency' && styles.tabActive]}
          onPress={() => setSelectedTab('emergency')}
        >
          <Text style={[styles.tabText, selectedTab === 'emergency' && styles.tabTextActive]}>
            Emergency
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.contestName}>{currentPrep.contestName}</Text>
          <Text style={styles.headerDescription}>
            Plan your contest day nutrition strategy
          </Text>
        </View>

        {renderAddMealForm()}
        
        {selectedTab === 'contest-day' && renderContestDay()}
        {selectedTab === 'backup' && renderBackupPlans()}
        {selectedTab === 'emergency' && renderEmergencyProtocols()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  contestName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  tabContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addButton: {
    padding: 8,
  },
  mealCard: {
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
    marginLeft: 8,
  },
  mealActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  mealFood: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  mealAmount: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  mealPurpose: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  macroLabel: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCardText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  emptyCardSubtext: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  addMealCard: {
    margin: 20,
    marginBottom: 0,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    marginBottom: 16,
    flex: 1,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    fontSize: 16,
    color: colors.text.primary,
  },
  macrosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  macrosInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroInputGroup: {
    flex: 1,
    marginRight: 8,
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  infoCard: {
    marginBottom: 20,
    backgroundColor: colors.accent.primary + '10',
    borderColor: colors.accent.primary,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  backupSection: {
    marginBottom: 24,
  },
  backupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  backupDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  warningCard: {
    marginBottom: 20,
    backgroundColor: colors.status.error + '10',
    borderColor: colors.status.error,
    borderWidth: 1,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.status.error,
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  protocolCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.warning,
  },
  protocolScenario: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  protocolAction: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  protocolTiming: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  protocolFoods: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  protocolNotes: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});