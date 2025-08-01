import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, Plus, Play, Clock, Target, AlertTriangle } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TabBar } from '@/components/ui/TabBar';
import { commonInjuries, rehabExercises, rehabPrograms } from '@/mocks/injuries';

const tabs = [
  { key: 'injuries', label: 'Injuries' },
  { key: 'exercises', label: 'Exercises' },
  { key: 'programs', label: 'Programs' },
];

export default function RehabScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('injuries');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInjuries = commonInjuries.filter(injury =>
    injury.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    injury.bodyPart.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExercises = rehabExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.bodyParts.some(part => part.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPrograms = rehabPrograms.filter(program =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'severe': return '#EF4444';
      default: return colors.text.secondary;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return colors.text.secondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rehabilitation Center</Text>
        <Text style={styles.subtitle}>Injury management and recovery programs</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search injuries, exercises, or programs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.text.secondary}
            />
          </View>
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
        {activeTab === 'injuries' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Common Injuries</Text>
              <Button
                title="Add Injury"
                onPress={() => router.push('/coach/rehab/add-injury')}
                style={styles.addButton}
                icon={<Plus size={16} color={colors.text.primary} />}
              />
            </View>
            
            {filteredInjuries.map((injury) => (
              <Card key={injury.id} style={styles.injuryCard}>
                <TouchableOpacity 
                  onPress={() => router.push(`/coach/rehab/injury/${injury.id}`)}
                >
                  <View style={styles.injuryHeader}>
                    <View style={styles.injuryInfo}>
                      <Text style={styles.injuryName}>{injury.name}</Text>
                      <Text style={styles.injuryBodyPart}>{injury.bodyPart}</Text>
                    </View>
                    <View style={styles.injuryMeta}>
                      <View style={[styles.severityBadge, { backgroundColor: `${getSeverityColor(injury.severity)}20` }]}>
                        <Text style={[styles.severityText, { color: getSeverityColor(injury.severity) }]}>
                          {injury.severity}
                        </Text>
                      </View>
                      <Text style={styles.injuryType}>{injury.type}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.injuryDescription} numberOfLines={2}>
                    {injury.description}
                  </Text>
                  
                  <View style={styles.injuryFooter}>
                    <View style={styles.recoveryTime}>
                      <Clock size={14} color={colors.text.secondary} />
                      <Text style={styles.recoveryText}>{injury.recoveryTime}</Text>
                    </View>
                    <Text style={styles.symptomsCount}>
                      {injury.symptoms.length} symptoms
                    </Text>
                  </View>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'exercises' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rehabilitation Exercises</Text>
              <Button
                title="Add Exercise"
                onPress={() => router.push('/coach/rehab/add-exercise')}
                style={styles.addButton}
                icon={<Plus size={16} color={colors.text.primary} />}
              />
            </View>
            
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} style={styles.exerciseCard}>
                <TouchableOpacity 
                  onPress={() => router.push(`/coach/rehab/exercise/${exercise.id}`)}
                >
                  <View style={styles.exerciseHeader}>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseBodyParts}>
                        {exercise.bodyParts.join(', ')}
                      </Text>
                    </View>
                    <View style={styles.exerciseMeta}>
                      <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(exercise.difficulty)}20` }]}>
                        <Text style={[styles.difficultyText, { color: getDifficultyColor(exercise.difficulty) }]}>
                          {exercise.difficulty}
                        </Text>
                      </View>
                      {exercise.videoUrl && (
                        <TouchableOpacity style={styles.playButton}>
                          <Play size={16} color={colors.accent.primary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  
                  <Text style={styles.exerciseDescription} numberOfLines={2}>
                    {exercise.description}
                  </Text>
                  
                  <View style={styles.exerciseFooter}>
                    <View style={styles.exerciseDetails}>
                      <Text style={styles.exerciseDetail}>{exercise.duration} min</Text>
                      <Text style={styles.exerciseDetail}>•</Text>
                      <Text style={styles.exerciseDetail}>{exercise.sets} sets</Text>
                      <Text style={styles.exerciseDetail}>•</Text>
                      <Text style={styles.exerciseDetail}>{exercise.reps}</Text>
                    </View>
                    <Text style={styles.equipmentText}>
                      {exercise.equipment.join(', ')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'programs' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rehabilitation Programs</Text>
              <Button
                title="Create Program"
                onPress={() => router.push('/coach/rehab/create-program')}
                style={styles.addButton}
                icon={<Plus size={16} color={colors.text.primary} />}
              />
            </View>
            
            {filteredPrograms.map((program) => (
              <Card key={program.id} style={styles.programCard}>
                <TouchableOpacity 
                  onPress={() => router.push(`/coach/rehab/program/${program.id}`)}
                >
                  <View style={styles.programHeader}>
                    <View style={styles.programInfo}>
                      <Text style={styles.programName}>{program.name}</Text>
                      <Text style={styles.programPhase}>{program.phase} phase</Text>
                    </View>
                    <View style={styles.programMeta}>
                      <Text style={styles.programDuration}>{program.duration} weeks</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.programDescription} numberOfLines={2}>
                    {program.description}
                  </Text>
                  
                  <View style={styles.programFooter}>
                    <View style={styles.programDetails}>
                      <Target size={14} color={colors.text.secondary} />
                      <Text style={styles.programGoals}>
                        {program.goals.length} goals
                      </Text>
                    </View>
                    <Text style={styles.programFrequency}>{program.frequency}</Text>
                  </View>
                </TouchableOpacity>
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
  header: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  injuryCard: {
    marginBottom: 16,
    padding: 16,
  },
  injuryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  injuryInfo: {
    flex: 1,
  },
  injuryName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  injuryBodyPart: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  injuryMeta: {
    alignItems: 'flex-end',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  injuryType: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  injuryDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  injuryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recoveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recoveryText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  symptomsCount: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  exerciseCard: {
    marginBottom: 16,
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  exerciseBodyParts: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.accent.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseDetail: {
    fontSize: 12,
    color: colors.text.secondary,
    marginRight: 8,
  },
  equipmentText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  programCard: {
    marginBottom: 16,
    padding: 16,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  programPhase: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  programMeta: {
    alignItems: 'flex-end',
  },
  programDuration: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  programDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  programFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  programGoals: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  programFrequency: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});