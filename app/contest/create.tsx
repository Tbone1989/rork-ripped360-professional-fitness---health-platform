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
import { Calendar, ChevronDown, Save } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '@/constants/colors';
import { useContestStore } from '@/store/contestStore';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ContestPrep } from '@/types/contest';

const CATEGORIES = [
  { value: 'mens-physique', label: 'Men\'s Physique' },
  { value: 'classic-physique', label: 'Classic Physique' },
  { value: 'bodybuilding', label: 'Bodybuilding' },
  { value: 'bikini', label: 'Bikini' },
  { value: 'figure', label: 'Figure' },
  { value: 'wellness', label: 'Wellness' }
];

export default function CreateContestScreen() {
  const { user } = useUserStore();
  const { createContestPrep } = useContestStore();
  
  const [formData, setFormData] = useState({
    contestName: '',
    contestDate: new Date(),
    category: 'mens-physique' as ContestPrep['category'],
    startWeight: '',
    targetWeight: '',
    startBodyFat: '',
    targetBodyFat: '',
    notes: ''
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, contestDate: selectedDate }));
    }
  };

  const calculateWeeksOut = () => {
    const today = new Date();
    const contest = formData.contestDate;
    const diffTime = contest.getTime() - today.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.max(0, diffWeeks);
  };

  const handleSubmit = async () => {
    if (!formData.contestName.trim()) {
      Alert.alert('Error', 'Please enter a contest name');
      return;
    }

    if (formData.contestDate <= new Date()) {
      Alert.alert('Error', 'Contest date must be in the future');
      return;
    }

    setIsLoading(true);

    try {
      const weeksOut = calculateWeeksOut();
      
      const newPrep: Omit<ContestPrep, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user?.id || '',
        coachId: user?.role === 'coach' ? user.id : undefined,
        contestName: formData.contestName.trim(),
        contestDate: formData.contestDate.toISOString(),
        category: formData.category,
        status: 'planning',
        startDate: new Date().toISOString(),
        weeksOut,
        currentPhase: {
          id: 'initial-phase',
          name: 'Initial Assessment',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          weeksOut,
          goals: ['Establish baseline measurements', 'Create training plan', 'Set nutrition targets'],
          macros: {
            calories: 2200,
            protein: 180,
            carbs: 200,
            fat: 80
          },
          cardio: {
            type: 'steady-state',
            duration: 30,
            frequency: 4
          },
          supplements: ['Whey Protein', 'Multivitamin'],
          notes: 'Initial phase to establish baseline and create foundation'
        },
        phases: [],
        posingPractice: [],
        dehydrationTracking: [],
        stageReadyNutrition: {
          id: 'nutrition-' + Date.now(),
          contestPrepId: '',
          contestDay: {
            preShow: [],
            postShow: []
          },
          backupPlans: {
            flatMuscles: [],
            spillover: [],
            lowEnergy: []
          },
          emergencyProtocols: []
        },
        progress: {
          startWeight: parseFloat(formData.startWeight) || 0,
          currentWeight: parseFloat(formData.startWeight) || 0,
          targetWeight: parseFloat(formData.targetWeight) || 0,
          startBodyFat: parseFloat(formData.startBodyFat) || 0,
          currentBodyFat: parseFloat(formData.startBodyFat) || 0,
          targetBodyFat: parseFloat(formData.targetBodyFat) || 0,
          measurements: [],
          photos: [],
          milestones: []
        }
      };

      createContestPrep(newPrep);
      
      Alert.alert(
        'Success',
        'Contest prep created successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create contest prep');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Create Contest Prep',
          headerRight: () => (
            <TouchableOpacity onPress={handleSubmit} disabled={isLoading}>
              <Save size={24} color={colors.accent.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Contest Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contest Name *</Text>
            <Input
              value={formData.contestName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, contestName: text }))}
              placeholder="e.g., NPC Regional Championships"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contest Date *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.contestDate.toLocaleDateString()}
              </Text>
              <Calendar size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.contestDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <Text style={styles.pickerText}>
                {CATEGORIES.find(c => c.value === formData.category)?.label}
              </Text>
              <ChevronDown size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            {showCategoryPicker && (
              <View style={styles.pickerOptions}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={styles.pickerOption}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, category: category.value as ContestPrep['category'] }));
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.weeksOutContainer}>
            <Text style={styles.weeksOutLabel}>Weeks Out:</Text>
            <Text style={styles.weeksOutValue}>{calculateWeeksOut()}</Text>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Starting Measurements</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Start Weight (kg)</Text>
              <Input
                value={formData.startWeight}
                onChangeText={(text) => setFormData(prev => ({ ...prev, startWeight: text }))}
                placeholder="75"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
            
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Target Weight (kg)</Text>
              <Input
                value={formData.targetWeight}
                onChangeText={(text) => setFormData(prev => ({ ...prev, targetWeight: text }))}
                placeholder="70"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Start Body Fat (%)</Text>
              <Input
                value={formData.startBodyFat}
                onChangeText={(text) => setFormData(prev => ({ ...prev, startBodyFat: text }))}
                placeholder="15"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
            
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Target Body Fat (%)</Text>
              <Input
                value={formData.targetBodyFat}
                onChangeText={(text) => setFormData(prev => ({ ...prev, targetBodyFat: text }))}
                placeholder="6"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Add any additional notes about your contest prep goals..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={colors.text.tertiary}
          />
        </Card>

        <Button
          title={isLoading ? "Creating..." : "Create Contest Prep"}
          onPress={handleSubmit}
          disabled={isLoading}
          style={styles.submitButton}
        />
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
  formCard: {
    margin: 20,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  pickerText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  pickerOptions: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  pickerOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  pickerOptionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  weeksOutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.accent.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  weeksOutLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  weeksOutValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  notesInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 100,
  },
  submitButton: {
    margin: 20,
    marginTop: 10,
  },
});