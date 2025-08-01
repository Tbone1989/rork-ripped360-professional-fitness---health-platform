import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Users, 
  Clock, 
  Target, 
  Zap, 
  Calendar, 
  Settings, 
  Copy, 
  Save,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { Badge } from '@/components/ui/Badge';
import { 
  BulkWorkoutGeneration, 
  WorkoutTemplate, 
  GroupWorkout,
  TeamManagement 
} from '@/types/workout';

const classTypeOptions = [
  { id: 'group', label: 'Group Class' },
  { id: 'team', label: 'Team Training' },
  { id: 'bootcamp', label: 'Bootcamp' },
  { id: 'circuit', label: 'Circuit Training' },
];

const generationTypeOptions = [
  { id: 'single', label: 'Single Session' },
  { id: 'weekly', label: 'Weekly Program' },
  { id: 'monthly', label: 'Monthly Program' },
  { id: 'program', label: 'Full Program' },
];

const goalOptions = [
  { id: 'strength', label: 'Strength' },
  { id: 'conditioning', label: 'Conditioning' },
  { id: 'sport-specific', label: 'Sport Specific' },
  { id: 'fat-loss', label: 'Fat Loss' },
  { id: 'team-building', label: 'Team Building' },
  { id: 'rehabilitation', label: 'Rehabilitation' },
];

const equipmentOptions = [
  { id: 'full-gym', label: 'Full Gym' },
  { id: 'field', label: 'Field/Outdoor' },
  { id: 'court', label: 'Court/Indoor' },
  { id: 'minimal', label: 'Minimal Equipment' },
  { id: 'bodyweight', label: 'Bodyweight Only' },
  { id: 'bands-cones', label: 'Bands & Cones' },
];

const difficultyOptions = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'mixed', label: 'Mixed Levels' },
];

const participantRanges = [
  { id: '5-10', label: '5-10 people' },
  { id: '10-15', label: '10-15 people' },
  { id: '15-25', label: '15-25 people' },
  { id: '25-40', label: '25-40 people' },
  { id: '40+', label: '40+ people' },
];

export default function GenerateGroupWorkoutScreen() {
  const router = useRouter();
  
  // Form state
  const [classType, setClassType] = useState<string[]>(['group']);
  const [generationType, setGenerationType] = useState<string[]>(['single']);
  const [goals, setGoals] = useState<string[]>(['strength']);
  const [equipment, setEquipment] = useState<string[]>(['full-gym']);
  const [difficulty, setDifficulty] = useState<string[]>(['mixed']);
  const [participantRange, setParticipantRange] = useState<string[]>(['15-25']);
  const [sessionDuration, setSessionDuration] = useState('60');
  const [sessionsPerWeek, setSessionsPerWeek] = useState('3');
  const [programWeeks, setProgramWeeks] = useState('4');
  const [specialRequirements, setSpecialRequirements] = useState('');
  
  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [variations, setVariations] = useState(true);
  const [progressiveOverload, setProgressiveOverload] = useState(true);
  const [equipmentRotation, setEquipmentRotation] = useState(false);
  const [includeWarmup, setIncludeWarmup] = useState(true);
  const [includeCooldown, setIncludeCooldown] = useState(true);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkouts, setGeneratedWorkouts] = useState<GroupWorkout[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  
  // Mock teams data
  const [availableTeams] = useState<TeamManagement[]>([
    {
      id: '1',
      name: 'Basketball Team A',
      coachId: 'coach1',
      members: [],
      skillLevel: 'intermediate',
      sport: 'Basketball',
      season: 'inseason',
      goals: ['strength', 'conditioning'],
      trainingPhase: 'Competition Phase',
      meetingSchedule: [],
      equipment: ['full-gym'],
      facility: 'Main Gym',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Fitness Bootcamp',
      coachId: 'coach1',
      members: [],
      skillLevel: 'mixed',
      goals: ['fat-loss', 'conditioning'],
      trainingPhase: 'General Fitness',
      meetingSchedule: [],
      equipment: ['minimal'],
      facility: 'Outdoor Field',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ]);
  
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockWorkouts: GroupWorkout[] = [
        {
          id: '1',
          name: `${classType[0]} ${goals[0]} Workout`,
          description: `A comprehensive ${classType[0]} workout focusing on ${goals.join(', ')} for ${participantRange[0]} participants.`,
          coachId: 'coach1',
          classType: classType[0] as any,
          maxParticipants: parseInt(participantRange[0].split('-')[1] || '25'),
          currentParticipants: 0,
          duration: parseInt(sessionDuration),
          difficulty: difficulty[0] as any,
          exercises: [
            {
              exerciseId: '1',
              name: 'Dynamic Warm-up Circuit',
              description: 'Full body activation and mobility',
              sets: 1,
              duration: 600, // 10 minutes
              restTime: 0,
              intensity: 'low',
              modifications: [],
              equipment: ['cones', 'bands'],
              instructions: ['Set up stations', 'Rotate every 2 minutes'],
              coachingCues: ['Focus on form', 'Increase range of motion'],
              safetyNotes: ['Watch for proper alignment']
            },
            {
              exerciseId: '2',
              name: 'Strength Circuit',
              description: 'Multi-station strength training',
              sets: 3,
              duration: 1200, // 20 minutes
              restTime: 60,
              intensity: 'high',
              modifications: [],
              equipment: ['dumbbells', 'kettlebells', 'resistance bands'],
              instructions: ['4 stations', '5 minutes per station'],
              coachingCues: ['Maintain proper form', 'Control the weight'],
              safetyNotes: ['Spot heavy lifts', 'Check form regularly']
            }
          ],
          equipment: equipment,
          targetMuscles: ['full-body'],
          scheduledDates: [],
          participants: [],
          modifications: [],
          progressTracking: {
            averageIntensity: 0,
            completionRate: 0,
            participantFeedback: [],
            commonModifications: [],
            injuryReports: []
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      if (generationType[0] === 'weekly') {
        // Generate 3 different workouts for the week
        for (let i = 2; i <= parseInt(sessionsPerWeek); i++) {
          mockWorkouts.push({
            ...mockWorkouts[0],
            id: i.toString(),
            name: `${classType[0]} Workout - Day ${i}`,
            description: `Day ${i} of weekly ${classType[0]} program`
          });
        }
      }
      
      setGeneratedWorkouts(mockWorkouts);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to generate workouts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTemplate = () => {
    Alert.alert(
      'Save as Template',
      'Save this configuration as a reusable template?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: () => {
          Alert.alert('Success', 'Template saved successfully!');
        }}
      ]
    );
  };

  const handleBulkGenerate = () => {
    Alert.alert(
      'Bulk Generation',
      `Generate ${generationType[0]} program for ${selectedTeams.length} teams?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: handleGenerate }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {generatedWorkouts.length === 0 ? (
        <>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Users size={24} color={colors.accent.primary} />
            </View>
            <Text style={styles.title}>Group Workout Generator</Text>
            <Text style={styles.subtitle}>
              Create workouts for teams, groups, and classes with advanced coaching features
            </Text>
          </View>

          {/* Team Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Teams (Optional)</Text>
            <View style={styles.teamGrid}>
              {availableTeams.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  style={[
                    styles.teamCard,
                    selectedTeams.includes(team.id) && styles.teamCardSelected
                  ]}
                  onPress={() => {
                    setSelectedTeams(prev => 
                      prev.includes(team.id) 
                        ? prev.filter(id => id !== team.id)
                        : [...prev, team.id]
                    );
                  }}
                >
                  <Text style={styles.teamName}>{team.name}</Text>
                  <Text style={styles.teamInfo}>{team.members.length} members</Text>
                  <Badge 
                    text={team.skillLevel} 
                    variant={team.skillLevel === 'advanced' ? 'success' : 'default'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Class Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Class Type</Text>
            <ChipGroup
              options={classTypeOptions}
              selectedIds={classType}
              onChange={setClassType}
              multiSelect={false}
              scrollable={false}
            />
          </View>

          {/* Generation Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Generation Type</Text>
            <ChipGroup
              options={generationTypeOptions}
              selectedIds={generationType}
              onChange={setGenerationType}
              multiSelect={false}
              scrollable={false}
            />
          </View>

          {/* Program Settings */}
          {generationType[0] !== 'single' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Program Settings</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Sessions per week</Text>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity 
                      style={styles.counterButton}
                      onPress={() => setSessionsPerWeek(Math.max(1, parseInt(sessionsPerWeek) - 1).toString())}
                    >
                      <Minus size={16} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{sessionsPerWeek}</Text>
                    <TouchableOpacity 
                      style={styles.counterButton}
                      onPress={() => setSessionsPerWeek(Math.min(7, parseInt(sessionsPerWeek) + 1).toString())}
                    >
                      <Plus size={16} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {generationType[0] !== 'weekly' && (
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>Program weeks</Text>
                    <View style={styles.counterContainer}>
                      <TouchableOpacity 
                        style={styles.counterButton}
                        onPress={() => setProgramWeeks(Math.max(1, parseInt(programWeeks) - 1).toString())}
                      >
                        <Minus size={16} color={colors.text.primary} />
                      </TouchableOpacity>
                      <Text style={styles.counterValue}>{programWeeks}</Text>
                      <TouchableOpacity 
                        style={styles.counterButton}
                        onPress={() => setProgramWeeks(Math.min(52, parseInt(programWeeks) + 1).toString())}
                      >
                        <Plus size={16} color={colors.text.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Participants */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Number of Participants</Text>
            <ChipGroup
              options={participantRanges}
              selectedIds={participantRange}
              onChange={setParticipantRange}
              multiSelect={false}
              scrollable={false}
            />
          </View>

          {/* Session Duration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Duration (minutes)</Text>
            <Input
              value={sessionDuration}
              onChangeText={setSessionDuration}
              keyboardType="numeric"
              placeholder="60"
            />
          </View>

          {/* Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training Goals</Text>
            <ChipGroup
              options={goalOptions}
              selectedIds={goals}
              onChange={setGoals}
              scrollable={false}
            />
          </View>

          {/* Equipment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Equipment</Text>
            <ChipGroup
              options={equipmentOptions}
              selectedIds={equipment}
              onChange={setEquipment}
              scrollable={false}
            />
          </View>

          {/* Difficulty */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skill Level</Text>
            <ChipGroup
              options={difficultyOptions}
              selectedIds={difficulty}
              onChange={setDifficulty}
              multiSelect={false}
              scrollable={false}
            />
          </View>

          {/* Advanced Options */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.advancedToggle}
              onPress={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings size={20} color={colors.text.primary} />
              <Text style={styles.advancedToggleText}>Advanced Options</Text>
              <ChevronRight 
                size={20} 
                color={colors.text.tertiary} 
                style={[styles.chevron, showAdvanced && styles.chevronRotated]}
              />
            </TouchableOpacity>
            
            {showAdvanced && (
              <View style={styles.advancedOptions}>
                <View style={styles.optionRow}>
                  <TouchableOpacity 
                    style={styles.optionToggle}
                    onPress={() => setVariations(!variations)}
                  >
                    <View style={[styles.checkbox, variations && styles.checkboxActive]}>
                      {variations && <CheckCircle size={16} color={colors.background.primary} />}
                    </View>
                    <Text style={styles.optionText}>Generate skill level variations</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.optionRow}>
                  <TouchableOpacity 
                    style={styles.optionToggle}
                    onPress={() => setProgressiveOverload(!progressiveOverload)}
                  >
                    <View style={[styles.checkbox, progressiveOverload && styles.checkboxActive]}>
                      {progressiveOverload && <CheckCircle size={16} color={colors.background.primary} />}
                    </View>
                    <Text style={styles.optionText}>Progressive overload</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.optionRow}>
                  <TouchableOpacity 
                    style={styles.optionToggle}
                    onPress={() => setEquipmentRotation(!equipmentRotation)}
                  >
                    <View style={[styles.checkbox, equipmentRotation && styles.checkboxActive]}>
                      {equipmentRotation && <CheckCircle size={16} color={colors.background.primary} />}
                    </View>
                    <Text style={styles.optionText}>Equipment rotation</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.optionRow}>
                  <TouchableOpacity 
                    style={styles.optionToggle}
                    onPress={() => setIncludeWarmup(!includeWarmup)}
                  >
                    <View style={[styles.checkbox, includeWarmup && styles.checkboxActive]}>
                      {includeWarmup && <CheckCircle size={16} color={colors.background.primary} />}
                    </View>
                    <Text style={styles.optionText}>Include warm-up</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.optionRow}>
                  <TouchableOpacity 
                    style={styles.optionToggle}
                    onPress={() => setIncludeCooldown(!includeCooldown)}
                  >
                    <View style={[styles.checkbox, includeCooldown && styles.checkboxActive]}>
                      {includeCooldown && <CheckCircle size={16} color={colors.background.primary} />}
                    </View>
                    <Text style={styles.optionText}>Include cool-down</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Special Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Requirements (Optional)</Text>
            <Input
              placeholder="Injuries, space limitations, specific focus areas..."
              value={specialRequirements}
              onChangeText={setSpecialRequirements}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title={isGenerating ? 'Generating...' : `Generate ${generationType[0]} Workout${generationType[0] !== 'single' ? 's' : ''}`}
              onPress={selectedTeams.length > 0 ? handleBulkGenerate : handleGenerate}
              loading={isGenerating}
              disabled={isGenerating}
              fullWidth
              icon={isGenerating ? undefined : <Zap size={18} color={colors.text.primary} />}
            />
            
            <View style={styles.secondaryButtons}>
              <Button
                title="Save as Template"
                variant="outline"
                onPress={handleSaveTemplate}
                style={styles.halfButton}
                icon={<Save size={16} color={colors.accent.primary} />}
              />
              
              <Button
                title="Load Template"
                variant="outline"
                onPress={() => Alert.alert('Coming Soon', 'Template loading will be available soon!')}
                style={styles.halfButton}
                icon={<Copy size={16} color={colors.accent.primary} />}
              />
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Generated Workouts Display */}
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>
              Generated {generationType[0]} Program
            </Text>
            <Text style={styles.resultDescription}>
              {generatedWorkouts.length} workout{generatedWorkouts.length > 1 ? 's' : ''} created for {participantRange[0]} participants
            </Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Clock size={16} color={colors.text.secondary} />
                <Text style={styles.metaText}>{sessionDuration} min sessions</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Users size={16} color={colors.text.secondary} />
                <Text style={styles.metaText}>{participantRange[0]} people</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Target size={16} color={colors.text.secondary} />
                <Text style={styles.metaText}>{difficulty[0]} level</Text>
              </View>
            </View>
          </View>
          
          {/* Workout Cards */}
          <View style={styles.workoutsContainer}>
            {generatedWorkouts.map((workout, index) => (
              <Card key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutHeader}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Badge text={workout.classType} variant="default" />
                </View>
                
                <Text style={styles.workoutDescription}>{workout.description}</Text>
                
                <View style={styles.workoutMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={14} color={colors.text.secondary} />
                    <Text style={styles.metaTextSmall}>{workout.duration} min</Text>
                  </View>
                  
                  <View style={styles.metaItem}>
                    <Users size={14} color={colors.text.secondary} />
                    <Text style={styles.metaTextSmall}>Max {workout.maxParticipants}</Text>
                  </View>
                  
                  <View style={styles.metaItem}>
                    <Target size={14} color={colors.text.secondary} />
                    <Text style={styles.metaTextSmall}>{workout.exercises.length} exercises</Text>
                  </View>
                </View>
                
                <View style={styles.exercisePreview}>
                  <Text style={styles.exercisePreviewTitle}>Exercises:</Text>
                  {workout.exercises.slice(0, 3).map((exercise, idx) => (
                    <Text key={idx} style={styles.exercisePreviewItem}>
                      • {exercise.name}
                    </Text>
                  ))}
                  {workout.exercises.length > 3 && (
                    <Text style={styles.exercisePreviewMore}>
                      +{workout.exercises.length - 3} more exercises
                    </Text>
                  )}
                </View>
                
                <View style={styles.workoutActions}>
                  <Button
                    title="View Details"
                    variant="outline"
                    size="small"
                    onPress={() => router.push(`/workout/${workout.id}`)}
                  />
                  
                  <Button
                    title="Schedule"
                    size="small"
                    onPress={() => Alert.alert('Schedule', 'Scheduling feature coming soon!')}
                    icon={<Calendar size={14} color={colors.text.primary} />}
                  />
                </View>
              </Card>
            ))}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.resultActions}>
            <Button
              title="Save All Workouts"
              fullWidth
              icon={<Save size={18} color={colors.text.primary} />}
              onPress={() => Alert.alert('Success', 'All workouts saved successfully!')}
            />
            
            <View style={styles.secondaryButtons}>
              <Button
                title="Generate More"
                variant="outline"
                onPress={() => setGeneratedWorkouts([])}
                style={styles.halfButton}
                icon={<RotateCcw size={16} color={colors.accent.primary} />}
              />
              
              <Button
                title="Share Program"
                variant="outline"
                onPress={() => Alert.alert('Share', 'Sharing feature coming soon!')}
                style={styles.halfButton}
                icon={<Copy size={16} color={colors.accent.primary} />}
              />
            </View>
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
    lineHeight: 22,
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
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  teamCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  teamCardSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: 'rgba(229, 57, 53, 0.05)',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  teamInfo: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 8,
    padding: 4,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background.card,
    borderRadius: 8,
    gap: 12,
  },
  advancedToggleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '90deg' }],
  },
  advancedOptions: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    gap: 12,
  },
  optionRow: {
    marginBottom: 8,
  },
  optionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 8,
    marginBottom: 24,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  halfButton: {
    flex: 1,
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
  metaTextSmall: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  workoutsContainer: {
    padding: 16,
    paddingTop: 0,
    gap: 16,
  },
  workoutCard: {
    padding: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  workoutName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 12,
  },
  workoutDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  exercisePreview: {
    marginBottom: 16,
  },
  exercisePreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  exercisePreviewItem: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  exercisePreviewMore: {
    fontSize: 13,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  workoutActions: {
    flexDirection: 'row',
    gap: 12,
  },
  resultActions: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 24,
  },
});