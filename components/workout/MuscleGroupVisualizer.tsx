import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

interface MuscleGroup {
  id: string;
  name: string;
  muscles: string[];
  imageUrl: string;
  highlighted: boolean;
}

interface MuscleGroupVisualizerProps {
  targetedMuscles: string[];
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  showLabels?: boolean;
}

const muscleGroups: MuscleGroup[] = [
  {
    id: 'chest',
    name: 'Chest',
    muscles: ['Pectoralis Major', 'Pectoralis Minor'],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    highlighted: false,
  },
  {
    id: 'back',
    name: 'Back',
    muscles: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius', 'Erector Spinae'],
    imageUrl: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=400',
    highlighted: false,
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    muscles: ['Anterior Deltoid', 'Lateral Deltoid', 'Posterior Deltoid'],
    imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400',
    highlighted: false,
  },
  {
    id: 'arms',
    name: 'Arms',
    muscles: ['Biceps', 'Triceps', 'Forearms'],
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400',
    highlighted: false,
  },
  {
    id: 'legs',
    name: 'Legs',
    muscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400',
    highlighted: false,
  },
  {
    id: 'core',
    name: 'Core',
    muscles: ['Rectus Abdominis', 'Obliques', 'Transverse Abdominis'],
    imageUrl: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=400',
    highlighted: false,
  },
];

export default function MuscleGroupVisualizer({
  targetedMuscles,
  primaryMuscles = [],
  secondaryMuscles = [],
  showLabels = true,
}: MuscleGroupVisualizerProps) {
  const getMuscleIntensity = (muscleId: string) => {
    if (primaryMuscles.includes(muscleId)) return 'primary';
    if (secondaryMuscles.includes(muscleId)) return 'secondary';
    if (targetedMuscles.includes(muscleId)) return 'targeted';
    return 'inactive';
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'primary':
        return colors.accent.primary;
      case 'secondary':
        return '#FF6666';
      case 'targeted':
        return '#FF9999';
      default:
        return colors.background.card;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Targeted Muscle Groups</Text>
      
      {/* Muscle Anatomy View */}
      <View style={styles.anatomyContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=800' }}
          style={styles.anatomyImage}
          resizeMode="contain"
        />
        
        {/* Overlay indicators for targeted muscles */}
        <View style={styles.overlayContainer}>
          {targetedMuscles.map((muscle, index) => {
            const position = getMusclePosition(muscle);
            return (
              <View
                key={muscle}
                style={[
                  styles.muscleIndicator,
                  {
                    top: position.top,
                    left: position.left,
                    backgroundColor: getIntensityColor(getMuscleIntensity(muscle)),
                  },
                ]}
              >
                <View style={styles.pulseAnimation} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Muscle Groups Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.muscleGrid}>
        {muscleGroups.map((group) => {
          const intensity = getMuscleIntensity(group.id);
          const isActive = intensity !== 'inactive';
          
          return (
            <TouchableOpacity
              key={group.id}
              style={[
                styles.muscleCard,
                isActive && styles.muscleCardActive,
                { borderColor: isActive ? getIntensityColor(intensity) : colors.background.secondary },
              ]}
              activeOpacity={0.8}
            >
              <Image source={{ uri: group.imageUrl }} style={styles.muscleImage} />
              <View style={[
                styles.muscleOverlay,
                { backgroundColor: isActive ? getIntensityColor(intensity) + '40' : 'transparent' },
              ]} />
              <Text style={[styles.muscleName, isActive && styles.muscleNameActive]}>
                {group.name}
              </Text>
              {isActive && (
                <View style={[styles.intensityBadge, { backgroundColor: getIntensityColor(intensity) }]}>
                  <Text style={styles.intensityText}>
                    {intensity === 'primary' ? 'Primary' : intensity === 'secondary' ? 'Secondary' : 'Active'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Legend */}
      {showLabels && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.accent.primary }]} />
            <Text style={styles.legendText}>Primary</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF6666' }]} />
            <Text style={styles.legendText}>Secondary</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9999' }]} />
            <Text style={styles.legendText}>Supporting</Text>
          </View>
        </View>
      )}

      {/* Detailed Muscle List */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Muscles Worked</Text>
        {primaryMuscles.length > 0 && (
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Primary:</Text>
            <Text style={styles.detailText}>{primaryMuscles.join(', ')}</Text>
          </View>
        )}
        {secondaryMuscles.length > 0 && (
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Secondary:</Text>
            <Text style={styles.detailText}>{secondaryMuscles.join(', ')}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function getMusclePosition(muscle: string): { top: number; left: number } {
  // Map muscle groups to approximate positions on the anatomy image
  const positions: Record<string, { top: number; left: number }> = {
    chest: { top: 120, left: width / 2 - 20 },
    back: { top: 140, left: width / 2 + 40 },
    shoulders: { top: 100, left: width / 2 - 60 },
    arms: { top: 160, left: width / 2 - 80 },
    legs: { top: 280, left: width / 2 },
    core: { top: 200, left: width / 2 },
  };
  
  return positions[muscle] || { top: 150, left: width / 2 };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  anatomyContainer: {
    height: 400,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  anatomyImage: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  muscleIndicator: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  pulseAnimation: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accent.primary,
    opacity: 0.3,
  },
  muscleGrid: {
    marginBottom: 16,
  },
  muscleCard: {
    width: 100,
    height: 120,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.background.secondary,
  },
  muscleCardActive: {
    borderWidth: 2,
  },
  muscleImage: {
    width: '100%',
    height: '100%',
  },
  muscleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  muscleName: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    backgroundColor: colors.background.primary + 'CC',
    paddingVertical: 2,
  },
  muscleNameActive: {
    color: colors.text.primary,
  },
  intensityBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  intensityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  detailsContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  detailSection: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent.primary,
    marginRight: 8,
  },
  detailText: {
    fontSize: 12,
    color: colors.text.secondary,
    flex: 1,
  },
});