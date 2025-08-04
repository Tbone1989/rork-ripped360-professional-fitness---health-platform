import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Zap, ChevronRight, Clock, Dumbbell, BarChart, Sparkles, TestTube, Users, BookOpen } from 'lucide-react-native';

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
  { id: 'full-gym', label: 'Full Gym' },
  { id: 'home', label: 'Home' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'bodyweight', label: 'Bodyweight Only' },
  { id: 'bands', label: 'Resistance Bands' },
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
  const [equipment, setEquipment] = useState<string[]>(['full-gym']);
  const [duration, setDuration] = useState<string[]>(['45']);
  const [difficulty, setDifficulty] = useState<string[]>(['intermediate']);
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);

  const generateWorkoutMutation = trpc.fitness.generate.useMutation();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setApiTestResult(null);
    
    try {
      const preferences = {
        type: goals[0] || 'strength',
        muscle: goals,
        difficulty: difficulty[0] || 'intermediate',
        duration: parseInt(duration[0]) || 45
      };
      
      const startTime = Date.now();
      const workoutData = await generateWorkoutMutation.mutateAsync(preferences);
      const responseTime = Date.now() - startTime;
      
      // Transform the backend response to match the expected format
      const transformedWorkout = {
        name: `${preferences.type.charAt(0).toUpperCase() + preferences.type.slice(1)} Workout`,
        description: `A comprehensive ${preferences.type} workout with ${workoutData.exercises.length} exercises designed for maximum growth and development.`,
        exercises: workoutData.exercises.map((exercise: any) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          rest: `${exercise.rest}s`,
          muscle: exercise.muscle,
        })),
        duration: `${preferences.duration} minutes`,
        difficulty: preferences.difficulty.charAt(0).toUpperCase() + preferences.difficulty.slice(1),
        notes: `This ${workoutData.exercises.length}-exercise routine is optimized for ${preferences.type === 'hypertrophy' ? 'muscle growth' : preferences.type}. Focus on proper form and progressive overload. Rest periods are adjusted based on your ${preferences.difficulty} level.`,
      };
      
      setGeneratedWorkout(transformedWorkout);
      setApiTestResult(`✓ tRPC Response: ${responseTime}ms`);
    } catch (error) {
      console.error('Error generating workout:', error);
      setApiTestResult(`✗ tRPC Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback to mock data with 8-10 exercises
      setGeneratedWorkout({
        name: 'Complete Strength Training Workout',
        description: 'A comprehensive 10-exercise workout designed for maximum muscle growth and strength development.',
        exercises: [
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
        duration: '60-75 minutes',
        difficulty: 'Intermediate',
        notes: 'This 10-exercise routine targets all major muscle groups for maximum growth. Focus on progressive overload and proper form. Adjust rest periods based on your recovery needs.',
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
            <Text style={styles.sectionTitle}>Available equipment</Text>
            <ChipGroup
              options={equipmentOptions}
              selectedIds={equipment}
              onChange={setEquipment}
              scrollable={false}
            />
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
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
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