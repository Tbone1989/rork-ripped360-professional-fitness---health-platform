import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Play, Heart, Share, Target, Dumbbell, AlertCircle } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { popularExercises } from '@/mocks/workouts';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isFavorited, setIsFavorited] = useState(false);
  
  // In a real app, you would fetch the exercise data based on the ID
  const exercise = popularExercises.find(ex => ex.id === id) || popularExercises[0];

  const handleStartExercise = () => {
    Alert.alert(
      'Start Exercise',
      'This would start the exercise with video guidance and timer.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: () => console.log('Starting exercise...') },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'This would open the share dialog.');
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return colors.status.success;
      case 'intermediate':
        return colors.status.warning;
      case 'advanced':
        return colors.status.error;
      default:
        return colors.status.info;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: exercise.thumbnailUrl }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <Badge
                label={exercise.difficulty}
                size="small"
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(exercise.difficulty) },
                ]}
              />
              <View style={styles.heroActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleFavorite}
                >
                  <Heart
                    size={20}
                    color={isFavorited ? colors.status.error : colors.text.primary}
                    fill={isFavorited ? colors.status.error : 'transparent'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleShare}
                >
                  <Share size={20} color={colors.text.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.heroFooter}>
              <Text style={styles.heroTitle}>{exercise.name}</Text>
              <Text style={styles.heroDescription}>{exercise.description}</Text>
            </View>
          </View>
        </View>

        {/* Equipment */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Dumbbell size={20} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Equipment Needed</Text>
          </View>
          <View style={styles.equipmentContainer}>
            {exercise.equipment.map((item, index) => (
              <Badge
                key={index}
                label={item}
                variant="secondary"
                style={styles.equipmentBadge}
              />
            ))}
          </View>
        </Card>

        {/* Target Muscles */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={20} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Target Muscles</Text>
          </View>
          <View style={styles.muscleContainer}>
            {exercise.muscleGroups.map((muscle, index) => (
              <View key={index} style={styles.muscleItem}>
                <View style={styles.muscleDot} />
                <Text style={styles.muscleText}>{muscle}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Instructions */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>How to Perform</Text>
          <View style={styles.instructionsContainer}>
            {exercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Tips */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={20} color={colors.status.warning} />
            <Text style={styles.sectionTitle}>Pro Tips</Text>
          </View>
          <View style={styles.tipsContainer}>
            {exercise.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Start Exercise Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Start Exercise"
          onPress={handleStartExercise}
          style={styles.startButton}
          leftIcon={<Play size={20} color={colors.text.primary} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'space-between',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroFooter: {
    gap: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  heroDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  difficultyBadge: {
    backgroundColor: colors.status.warning,
  },
  section: {
    margin: 16,
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentBadge: {
    marginBottom: 0,
  },
  muscleContainer: {
    gap: 8,
  },
  muscleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  muscleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.primary,
  },
  muscleText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  instructionsContainer: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.primary,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 22,
  },
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.status.warning,
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  startButton: {
    width: '100%',
  },
});