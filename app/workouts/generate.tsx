import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Zap, ChevronRight, Clock, Dumbbell, BarChart, Sparkles, TestTube, Users, BookOpen, Info, Settings } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { trpc } from '@/lib/trpc';

const goalOptions = [
  { id: 'strength', label: 'Strength' },
  { id: 'hypertrophy', label: 'Muscle Growth' },
  { id: 'endurance', label: 'Endurance' },
  { id: 'fat-loss', label: 'Fat Loss' },
  { id: 'general', label: 'General Fitness' },
];

const equipmentOptions = [
  { id: 'full-gym', label: 'Full Gym', description: 'Barbells, dumbbells, machines, cables' },
  { id: 'home', label: 'Home Gym', description: 'Dumbbells, bench, pull-up bar' },
  { id: 'minimal', label: 'Minimal', description: 'Basic dumbbells or kettlebells' },
  { id: 'bodyweight', label: 'Bodyweight Only', description: 'No equipment needed' },
  { id: 'bands', label: 'Resistance Bands', description: 'Bands and anchors only' },
  { id: 'barbell', label: 'Barbell', description: 'Barbell and plates' },
  { id: 'dumbbells', label: 'Dumbbells', description: 'Dumbbells only' },
  { id: 'kettlebells', label: 'Kettlebells', description: 'Kettlebells only' },
  { id: 'cables', label: 'Cable Machine', description: 'Cable station' },
  { id: 'trx', label: 'TRX/Suspension', description: 'Suspension trainer' },
  { id: 'outdoor', label: 'Outdoor/Park', description: 'Park equipment, bars' },
];

const durationOptions = [
  { id: '15', label: '15 min' },
  { id: '30', label: '30 min' },
  { id: '45', label: '45 min' },
  { id: '60', label: '60 min' },
  { id: '90', label: '90+ min' },
];

const difficultyOptions = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export default function GenerateWorkoutScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<string[]>(['strength']);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [duration, setDuration] = useState<string[]>(['45']);
  const [difficulty, setDifficulty] = useState<string[]>(['intermediate']);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [showEquipmentDetails, setShowEquipmentDetails] = useState(false);
  const [savedEquipment, setSavedEquipment] = useState<string[]>([]);

  useEffect(() => {
    loadSavedEquipment();
  }, []);

  const loadSavedEquipment = async () => {
    try {
      const saved = await AsyncStorage.getItem('user_equipment');
      if (saved) {
        const equipment = JSON.parse(saved);
        setEquipment(equipment);
        setSavedEquipment(equipment);
      }
    } catch (error) {
      console.log('Failed to load saved equipment:', error);
    }
  };

  const saveEquipmentPreferences = async () => {
    try {
      await AsyncStorage.setItem('user_equipment', JSON.stringify(equipment));
      setSavedEquipment(equipment);
      Alert.alert('Success', 'Your equipment preferences have been saved');
    } catch (error) {
      Alert.alert('Error', 'Failed to save equipment preferences');
    }
  };

  const showEquipmentInfo = () => {
    Alert.alert(
      'Equipment Selection',
      'Select all equipment you have access to. The AI will generate workouts using only the equipment you select. You can save your preferences for future use.',
      [
        { text: 'Got it', style: 'default' },
        { text: 'Save Current Selection', onPress: saveEquipmentPreferences }
      ]
    );
  };
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);

  const generateWorkoutMutation = trpc.fitness.generate.useMutation();

  const handleGenerate = async () => {
    if (equipment.length === 0) {
      Alert.alert('Equipment Required', 'Please select at least one type of equipment to generate a workout');
      return;
    }

    setIsGenerating(true);
    setApiTestResult(null);
    
    try {
      const preferences = {
        type: goals[0] || 'strength',
        muscle: goals,
        difficulty: difficulty[0] || 'intermediate',
        duration: parseInt(duration[0]) || 45,
        equipment: equipment
      };
      
      console.log('🔄 Starting workout generation with preferences:', preferences);
      
      const startTime = Date.now();
      const workoutData = await generateWorkoutMutation.mutateAsync(preferences);
      const responseTime = Date.now() - startTime;
      
      console.log('✅ Workout generated successfully:', workoutData);
      
      // Transform the backend response to match the expected format
      const transformedWorkout = {
        name: workoutData.name || `${preferences.type.charAt(0).toUpperCase() + preferences.type.slice(1)} Workout`,
        description: `A comprehensive ${preferences.type} workout with ${workoutData.exercises.length} exercises designed for maximum growth and development.`,
        exercises: workoutData.exercises.map((exercise: any) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          rest: typeof exercise.rest === 'number' ? `${exercise.rest}s` : exercise.rest,
          muscle: exercise.muscle,
        })),
        duration: `${preferences.duration} minutes`,
        difficulty: preferences.difficulty.charAt(0).toUpperCase() + preferences.difficulty.slice(1),
        notes: `This ${workoutData.exercises.length}-exercise routine is optimized for ${preferences.type === 'hypertrophy' ? 'muscle growth' : preferences.type}. Focus on proper form and progressive overload. Rest periods are adjusted based on your ${preferences.difficulty} level.`,
      };
      
      setGeneratedWorkout(transformedWorkout);
      setApiTestResult(`✓ Backend Connected: ${responseTime}ms`);
    } catch (error) {
      console.error('❌ Error generating workout:', error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more specific error messages
        if (errorMessage.includes('Backend server is not running')) {
          errorMessage = 'Backend server offline - using fallback data';
        } else if (errorMessage.includes('Failed to fetch')) {
          errorMessage = 'Network connection failed - using fallback data';
        } else if (errorMessage.includes('<!DOCTYPE') || errorMessage.includes('Unexpected token')) {
          errorMessage = 'Backend routing error - using fallback data';
        } else if (errorMessage.includes('TRPCClientError')) {
          errorMessage = 'API connection failed - using fallback data';
        }
      }
      
      setApiTestResult(`✗ ${errorMessage}`);
      
      // Enhanced fallback with 8-10 exercises based on user preferences
      const preferences = {
        type: goals[0] || 'strength',
        difficulty: difficulty[0] || 'intermediate',
        duration: parseInt(duration[0]) || 45
      };
      
      const fallbackExercises = {
        strength: [
          { name: 'Barbell Bench Press', sets: 4, reps: '4-6', rest: '3 min', muscle: 'chest' },
          { name: 'Deadlifts', sets: 4, reps: '3-5', rest: '3 min', muscle: 'back' },
          { name: 'Squats', sets: 4, reps: '5-8', rest: '2-3 min', muscle: 'legs' },
          { name: 'Pull-ups', sets: 3, reps: '6-10', rest: '90s', muscle: 'back' },
          { name: 'Overhead Press', sets: 3, reps: '6-8', rest: '90s', muscle: 'shoulders' },
          { name: 'Barbell Rows', sets: 3, reps: '6-8', rest: '90s', muscle: 'back' },
          { name: 'Dips', sets: 3, reps: '8-12', rest: '75s', muscle: 'triceps' },
          { name: 'Romanian Deadlifts', sets: 3, reps: '8-10', rest: '90s', muscle: 'hamstrings' },
          { name: 'Close-Grip Bench Press', sets: 3, reps: '6-8', rest: '90s', muscle: 'triceps' },
          { name: 'Weighted Chin-ups', sets: 3, reps: '5-8', rest: '2 min', muscle: 'biceps' },
        ],
        hypertrophy: [
          { name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', rest: '90s', muscle: 'chest' },
          { name: 'Lat Pulldowns', sets: 4, reps: '10-15', rest: '75s', muscle: 'back' },
          { name: 'Leg Press', sets: 4, reps: '12-20', rest: '90s', muscle: 'legs' },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-15', rest: '75s', muscle: 'shoulders' },
          { name: 'Cable Rows', sets: 3, reps: '10-15', rest: '75s', muscle: 'back' },
          { name: 'Leg Curls', sets: 3, reps: '12-20', rest: '60s', muscle: 'hamstrings' },
          { name: 'Bicep Curls', sets: 3, reps: '10-15', rest: '60s', muscle: 'biceps' },
          { name: 'Tricep Extensions', sets: 3, reps: '10-15', rest: '60s', muscle: 'triceps' },
          { name: 'Lateral Raises', sets: 3, reps: '12-20', rest: '60s', muscle: 'shoulders' },
          { name: 'Chest Flyes', sets: 3, reps: '10-15', rest: '75s', muscle: 'chest' },
        ],
        endurance: [
          { name: 'Burpees', sets: 3, reps: '15-25', rest: '45s', muscle: 'full-body' },
          { name: 'Mountain Climbers', sets: 3, reps: '20-30', rest: '30s', muscle: 'core' },
          { name: 'Jump Squats', sets: 3, reps: '20-30', rest: '45s', muscle: 'legs' },
          { name: 'Push-ups', sets: 3, reps: '15-25', rest: '30s', muscle: 'chest' },
          { name: 'High Knees', sets: 3, reps: '30-45', rest: '30s', muscle: 'cardio' },
          { name: 'Plank', sets: 3, reps: '45-90s', rest: '45s', muscle: 'core' },
          { name: 'Jumping Jacks', sets: 3, reps: '25-40', rest: '30s', muscle: 'cardio' },
          { name: 'Lunges', sets: 3, reps: '20-30', rest: '45s', muscle: 'legs' },
          { name: 'Russian Twists', sets: 3, reps: '30-50', rest: '30s', muscle: 'core' },
          { name: 'Bear Crawls', sets: 3, reps: '15-25', rest: '45s', muscle: 'full-body' },
        ],
        'fat-loss': [
          { name: 'HIIT Sprints', sets: 5, reps: '30s', rest: '60s', muscle: 'cardio' },
          { name: 'Kettlebell Swings', sets: 4, reps: '20-30', rest: '45s', muscle: 'full-body' },
          { name: 'Battle Ropes', sets: 4, reps: '30s', rest: '60s', muscle: 'full-body' },
          { name: 'Box Jumps', sets: 3, reps: '15-20', rest: '60s', muscle: 'legs' },
          { name: 'Thrusters', sets: 3, reps: '12-20', rest: '45s', muscle: 'full-body' },
          { name: 'Rowing Machine', sets: 4, reps: '250m', rest: '90s', muscle: 'cardio' },
          { name: 'Bike Sprints', sets: 5, reps: '20s', rest: '40s', muscle: 'cardio' },
          { name: 'Burpee Box Jumps', sets: 3, reps: '10-15', rest: '60s', muscle: 'full-body' },
          { name: 'Turkish Get-ups', sets: 3, reps: '5-8', rest: '75s', muscle: 'full-body' },
          { name: 'Medicine Ball Slams', sets: 4, reps: '15-25', rest: '45s', muscle: 'full-body' },
        ],
        general: [
          { name: 'Push-ups', sets: 3, reps: '10-15', rest: '60s', muscle: 'chest' },
          { name: 'Squats', sets: 3, reps: '12-20', rest: '60s', muscle: 'legs' },
          { name: 'Plank', sets: 3, reps: '30-60s', rest: '60s', muscle: 'core' },
          { name: 'Lunges', sets: 3, reps: '10-15', rest: '60s', muscle: 'legs' },
          { name: 'Glute Bridges', sets: 3, reps: '12-20', rest: '45s', muscle: 'glutes' },
          { name: 'Wall Sit', sets: 3, reps: '30-60s', rest: '60s', muscle: 'legs' },
          { name: 'Calf Raises', sets: 3, reps: '15-25', rest: '45s', muscle: 'calves' },
          { name: 'Side Plank', sets: 2, reps: '20-45s', rest: '45s', muscle: 'core' },
          { name: 'Pike Push-ups', sets: 3, reps: '8-15', rest: '60s', muscle: 'shoulders' },
          { name: 'Dead Bug', sets: 3, reps: '10-15', rest: '45s', muscle: 'core' },
        ]
      };
      
      const selectedExercises = fallbackExercises[preferences.type as keyof typeof fallbackExercises] || fallbackExercises.general;
      
      setGeneratedWorkout({
        name: `${preferences.type.charAt(0).toUpperCase() + preferences.type.slice(1)} Workout (Offline)`,
        description: `A comprehensive ${preferences.type} workout with ${selectedExercises.length} exercises designed for maximum growth and development. Generated using offline data.`,
        exercises: selectedExercises,
        duration: `${preferences.duration} minutes`,
        difficulty: preferences.difficulty.charAt(0).toUpperCase() + preferences.difficulty.slice(1),
        notes: `This ${selectedExercises.length}-exercise routine is optimized for ${preferences.type === 'hypertrophy' ? 'muscle growth' : preferences.type}. Focus on proper form and progressive overload. Rest periods are adjusted based on your ${preferences.difficulty} level. Note: This workout was generated offline due to backend connectivity issues.`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {!generatedWorkout ? (
        <>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Zap size={24} color={colors.accent.primary} />
            </View>
            <Text style={styles.title}>AI Workout Generator</Text>
            <Text style={styles.subtitle}>
              Create a personalized workout based on your preferences
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's your goal?</Text>
            <ChipGroup
              options={goalOptions}
              selectedIds={goals}
              onChange={setGoals}
              scrollable={false}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available equipment</Text>
              <View style={styles.equipmentActions}>
                <TouchableOpacity onPress={showEquipmentInfo} style={styles.infoButton}>
                  <Info size={18} color={colors.text.secondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={saveEquipmentPreferences} style={styles.equipmentSaveButton}>
                  <Settings size={18} color={colors.accent.primary} />
                </TouchableOpacity>
              </View>
            </View>
            {equipment.length === 0 && (
              <View style={styles.equipmentWarning}>
                <Info size={16} color={colors.status.warning} />
                <Text style={styles.equipmentWarningText}>
                  Please select at least one equipment type
                </Text>
              </View>
            )}
            <ChipGroup
              options={equipmentOptions.map(opt => ({
                ...opt,
                label: `${opt.label}${savedEquipment.includes(opt.id) ? ' ✓' : ''}`
              }))}
              selectedIds={equipment}
              onChange={setEquipment}
              scrollable={false}
            />
            {showEquipmentDetails && equipment.map(eq => {
              const option = equipmentOptions.find(o => o.id === eq);
              return option ? (
                <Text key={eq} style={styles.equipmentDescription}>
                  • {option.label}: {option.description}
                </Text>
              ) : null;
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout duration</Text>
            <ChipGroup
              options={durationOptions}
              selectedIds={duration}
              onChange={setDuration}
              multiSelect={false}
              scrollable={false}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience level</Text>
            <ChipGroup
              options={difficultyOptions}
              selectedIds={difficulty}
              onChange={setDifficulty}
              multiSelect={false}
              scrollable={false}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional information (optional)</Text>
            <Input
              placeholder="Any injuries, preferences, or specific focus areas..."
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={isGenerating ? 'Generating...' : 'Generate Workout'}
              onPress={handleGenerate}
              loading={isGenerating}
              disabled={isGenerating}
              fullWidth
              icon={isGenerating ? undefined : <Sparkles size={18} color={colors.text.primary} />}
            />
            
            {apiTestResult && (
              <View style={styles.apiTestResult}>
                <TestTube size={16} color={apiTestResult.startsWith('✓') ? colors.status.success : colors.status.error} />
                <Text style={[styles.apiTestText, {
                  color: apiTestResult.startsWith('✓') ? colors.status.success : colors.status.error
                }]}>{apiTestResult}</Text>
              </View>
            )}
            
            <View style={styles.secondaryButtons}>
              <Button
                title="Group Workouts"
                variant="outline"
                onPress={() => router.push('/workouts/generate-group')}
                style={styles.halfButton}
                icon={<Users size={16} color={colors.accent.primary} />}
              />
              
              <Button
                title="Templates"
                variant="outline"
                onPress={() => router.push('/workouts/templates')}
                style={styles.halfButton}
                icon={<BookOpen size={16} color={colors.accent.primary} />}
              />
            </View>
            
            <Button
              title="Open Full API Test Suite"
              variant="outline"
              onPress={() => router.push('/test-apis')}
              style={styles.testButton}
              icon={<TestTube size={18} color={colors.accent.primary} />}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>{generatedWorkout.name}</Text>
            <Text style={styles.resultDescription}>{generatedWorkout.description}</Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Clock size={16} color={colors.text.secondary} />
                <Text style={styles.metaText}>{generatedWorkout.duration}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <BarChart size={16} color={colors.text.secondary} />
                <Text style={styles.metaText}>{generatedWorkout.difficulty}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Dumbbell size={16} color={colors.text.secondary} />
                <Text style={styles.metaText}>{generatedWorkout.exercises.length} exercises</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.exercisesContainer}>
            {generatedWorkout.exercises.map((exercise: any, index: number) => (
              <TouchableOpacity 
                key={index}
                style={styles.exerciseCard}
                onPress={() => {}}
                activeOpacity={0.8}
              >
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseDetail}>{exercise.sets} sets</Text>
                    <Text style={styles.exerciseDetail}>•</Text>
                    <Text style={styles.exerciseDetail}>{exercise.reps} reps</Text>
                    <Text style={styles.exerciseDetail}>•</Text>
                    <Text style={styles.exerciseDetail}>{exercise.rest} rest</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </View>
          
          <Card style={styles.notesCard}>
            <Text style={styles.notesTitle}>Workout Notes</Text>
            <Text style={styles.notesText}>{generatedWorkout.notes}</Text>
          </Card>
          
          <View style={styles.actionButtons}>
            <Button
              title="Save Workout"
              onPress={() => console.log('Save workout')}
              style={styles.saveButton}
              fullWidth
            />
            <Button
              title="Regenerate"
              variant="outline"
              onPress={() => setGeneratedWorkout(null)}
              style={styles.regenerateButton}
              fullWidth
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  equipmentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  infoButton: {
    padding: 4,
  },
  equipmentSaveButton: {
    padding: 4,
  },
  equipmentWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  equipmentWarningText: {
    flex: 1,
    fontSize: 14,
    color: colors.status.warning,
  },
  equipmentDescription: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
    marginLeft: 8,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 8,
    marginBottom: 24,
  },
  resultHeader: {
    padding: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  exercisesContainer: {
    padding: 16,
    paddingTop: 0,
  },
  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseDetail: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  notesCard: {
    margin: 16,
    marginTop: 0,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  actionButtons: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 24,
    gap: 12,
  },
  saveButton: {
    marginBottom: 0,
  },
  regenerateButton: {
    marginBottom: 0,
  },
  apiTestResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  apiTestText: {
    fontSize: 14,
    fontWeight: '500',
  },
  testButton: {
    marginTop: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  halfButton: {
    flex: 1,
  },
});