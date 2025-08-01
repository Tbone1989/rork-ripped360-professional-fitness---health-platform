import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play, Clock, Target, AlertTriangle, CheckCircle } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { rehabExercises } from '@/mocks/injuries';

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'instructions' | 'precautions' | 'progressions'>('instructions');

  const exercise = rehabExercises.find(ex => ex.id === id);

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text>Exercise not found</Text>
      </View>
    );
  }

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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.exerciseCard}>
          {exercise.imageUrl && (
            <Image source={{ uri: exercise.imageUrl }} style={styles.exerciseImage} />
          )}
          
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseBodyParts}>
                {exercise.bodyParts.join(' • ')}
              </Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(exercise.difficulty)}20` }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(exercise.difficulty) }]}>
                {exercise.difficulty}
              </Text>
            </View>
          </View>

          <Text style={styles.exerciseDescription}>{exercise.description}</Text>

          <View style={styles.exerciseStats}>
            <View style={styles.statItem}>
              <Clock size={16} color={colors.text.secondary} />
              <Text style={styles.statText}>{exercise.duration} min</Text>
            </View>
            <View style={styles.statItem}>
              <Target size={16} color={colors.text.secondary} />
              <Text style={styles.statText}>{exercise.sets} sets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statText}>{exercise.reps}</Text>
            </View>
          </View>

          {exercise.videoUrl && (
            <Button
              title="Watch Video Tutorial"
              onPress={() => {}}
              style={styles.videoButton}
              icon={<Play size={20} color={colors.text.primary} />}
            />
          )}
        </Card>

        <Card style={styles.tabCard}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'instructions' && styles.activeTab]}
              onPress={() => setActiveTab('instructions')}
            >
              <Text style={[styles.tabText, activeTab === 'instructions' && styles.activeTabText]}>
                Instructions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'precautions' && styles.activeTab]}
              onPress={() => setActiveTab('precautions')}
            >
              <Text style={[styles.tabText, activeTab === 'precautions' && styles.activeTabText]}>
                Precautions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'progressions' && styles.activeTab]}
              onPress={() => setActiveTab('progressions')}
            >
              <Text style={[styles.tabText, activeTab === 'progressions' && styles.activeTabText]}>
                Progressions
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContent}>
            {activeTab === 'instructions' && (
              <View>
                <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
                {exercise.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
                
                {exercise.holdTime && (
                  <View style={styles.holdTimeContainer}>
                    <Clock size={16} color={colors.accent.primary} />
                    <Text style={styles.holdTimeText}>
                      Hold for {exercise.holdTime} seconds
                    </Text>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'precautions' && (
              <View>
                <Text style={styles.sectionTitle}>Safety Precautions</Text>
                {exercise.precautions.map((precaution, index) => (
                  <View key={index} style={styles.precautionItem}>
                    <AlertTriangle size={16} color="#F59E0B" />
                    <Text style={styles.precautionText}>{precaution}</Text>
                  </View>
                ))}
                
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                  Modifications
                </Text>
                {exercise.modifications.map((modification, index) => (
                  <View key={index} style={styles.modificationItem}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.modificationText}>{modification}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'progressions' && (
              <View>
                <Text style={styles.sectionTitle}>Exercise Progressions</Text>
                {exercise.progressions.map((progression, index) => (
                  <View key={index} style={styles.progressionItem}>
                    <View style={styles.progressionNumber}>
                      <Text style={styles.progressionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.progressionText}>{progression}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Card>

        <Card style={styles.equipmentCard}>
          <Text style={styles.sectionTitle}>Required Equipment</Text>
          <View style={styles.equipmentList}>
            {exercise.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentItem}>
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.targetInjuriesCard}>
          <Text style={styles.sectionTitle}>Target Injuries</Text>
          <View style={styles.injuriesList}>
            {exercise.targetInjuries.map((injuryId, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.injuryTag}
                onPress={() => router.push(`/coach/rehab/injury/${injuryId}`)}
              >
                <Text style={styles.injuryTagText}>
                  {injuryId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  exerciseCard: {
    marginBottom: 20,
    padding: 0,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 4,
  },
  exerciseBodyParts: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  exerciseDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  exerciseStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 4,
    fontWeight: '600',
  },
  videoButton: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tabCard: {
    marginBottom: 20,
    padding: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.accent.primary,
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.primary,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
  },
  holdTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.accent.primary}10`,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  holdTimeText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  precautionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  precautionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
    lineHeight: 20,
  },
  modificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modificationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
    lineHeight: 20,
  },
  progressionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  progressionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  progressionNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.primary,
  },
  progressionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
  },
  equipmentCard: {
    marginBottom: 20,
    padding: 20,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentItem: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
  targetInjuriesCard: {
    marginBottom: 20,
    padding: 20,
  },
  injuriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  injuryTag: {
    backgroundColor: `${colors.accent.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  injuryTagText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
  },
});