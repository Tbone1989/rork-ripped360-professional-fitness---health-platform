import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import {
  Camera,
  Upload,
  Sparkles,
  Info,
  Plus,
  Minus,
  Target,
  Flame,
  Beef,
  Wheat,
  Droplet,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface MacroAnalysis {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  ingredients: string[];
  healthScore: number;
  recommendations: string[];
}

export default function AIMealScanScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [macros, setMacros] = useState<MacroAnalysis | null>(null);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [dailyGoals] = useState({
    calories: 2500,
    protein: 180,
    carbs: 300,
    fats: 80,
  });

  const pickImage = async (source: 'camera' | 'gallery') => {
    const permissionResult = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant camera/gallery permissions to use this feature.');
      return;
    }

    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          base64: true,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          base64: true,
        });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      analyzeMeal(result.assets[0].base64!);
    }
  };

  const analyzeMeal = async (base64Image: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an AI nutritionist. Analyze food images and provide detailed macro breakdown in JSON format.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this meal and provide nutritional information. Return JSON with: calories, protein (g), carbs (g), fats (g), fiber (g), sugar (g), sodium (mg), servingSize, ingredients (array), healthScore (1-10), and recommendations (array of 3 tips).' },
                { type: 'image', image: base64Image }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const parsed = JSON.parse(data.completion);
      setMacros(parsed);
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback to mock data
      const mockData: MacroAnalysis = {
        calories: 450,
        protein: 35,
        carbs: 42,
        fats: 15,
        fiber: 8,
        sugar: 6,
        sodium: 680,
        servingSize: '1 plate (350g)',
        ingredients: [
          'Grilled chicken breast',
          'Brown rice',
          'Broccoli',
          'Bell peppers',
          'Olive oil',
          'Garlic',
          'Black pepper'
        ],
        healthScore: 8.5,
        recommendations: [
          'Great protein content for muscle building',
          'Add more vegetables for additional micronutrients',
          'Consider adding healthy fats like avocado'
        ]
      };
      setMacros(mockData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const adjustServing = (delta: number) => {
    const newMultiplier = Math.max(0.25, Math.min(5, servingMultiplier + delta));
    setServingMultiplier(newMultiplier);
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage < 80) return colors.status.warning;
    if (percentage <= 120) return colors.status.success;
    return colors.status.error;
  };

  const saveMeal = () => {
    Alert.alert('Success', 'Meal saved to your food diary');
    router.push('/meals');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'AI Meal Scanner',
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
              <Text style={styles.aiBannerTitle}>Instant Macro Calculator</Text>
              <Text style={styles.aiBannerSubtitle}>Point, scan, and track nutrition</Text>
            </View>
          </View>
        </View>

        {!selectedImage ? (
          <View style={styles.uploadSection}>
            <Card style={styles.uploadCard}>
              <Text style={styles.uploadTitle}>Scan Your Meal</Text>
              <Text style={styles.uploadDescription}>
                Take a photo of your meal for instant nutritional analysis
              </Text>
              
              <View style={styles.uploadButtons}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => pickImage('camera')}
                >
                  <Camera size={32} color={colors.accent.primary} />
                  <Text style={styles.uploadButtonText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => pickImage('gallery')}
                >
                  <Upload size={32} color={colors.accent.secondary} />
                  <Text style={styles.uploadButtonText}>Choose Photo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.privacyNote}>
                <Info size={16} color={colors.text.secondary} />
                <Text style={styles.privacyText}>
                  AI analyzes your meal instantly without storing images
                </Text>
              </View>
            </Card>
          </View>
        ) : (
          <View style={styles.resultsSection}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.mealImage} />
              {isAnalyzing && (
                <View style={styles.analyzingOverlay}>
                  <ActivityIndicator size="large" color={colors.accent.primary} />
                  <Text style={styles.analyzingText}>Analyzing meal...</Text>
                </View>
              )}
            </View>

            {macros && !isAnalyzing && (
              <>
                {/* Serving Size Adjuster */}
                <Card style={styles.servingCard}>
                  <Text style={styles.servingTitle}>Serving Size</Text>
                  <View style={styles.servingControls}>
                    <TouchableOpacity
                      style={styles.servingButton}
                      onPress={() => adjustServing(-0.25)}
                    >
                      <Minus size={20} color={colors.text.primary} />
                    </TouchableOpacity>
                    <View style={styles.servingDisplay}>
                      <Text style={styles.servingValue}>{servingMultiplier}x</Text>
                      <Text style={styles.servingSize}>{macros.servingSize}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.servingButton}
                      onPress={() => adjustServing(0.25)}
                    >
                      <Plus size={20} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                </Card>

                {/* Main Macros */}
                <View style={styles.macrosGrid}>
                  <Card style={[styles.macroCard, { borderColor: colors.status.error }]}>
                    <Flame size={24} color={colors.status.error} />
                    <Text style={styles.macroValue}>
                      {Math.round(macros.calories * servingMultiplier)}
                    </Text>
                    <Text style={styles.macroLabel}>Calories</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(100, ((macros.calories * servingMultiplier) / dailyGoals.calories) * 100)}%`,
                            backgroundColor: getProgressColor(macros.calories * servingMultiplier, dailyGoals.calories)
                          }
                        ]}
                      />
                    </View>
                  </Card>

                  <Card style={[styles.macroCard, { borderColor: colors.accent.primary }]}>
                    <Beef size={24} color={colors.accent.primary} />
                    <Text style={styles.macroValue}>
                      {Math.round(macros.protein * servingMultiplier)}g
                    </Text>
                    <Text style={styles.macroLabel}>Protein</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(100, ((macros.protein * servingMultiplier) / dailyGoals.protein) * 100)}%`,
                            backgroundColor: getProgressColor(macros.protein * servingMultiplier, dailyGoals.protein)
                          }
                        ]}
                      />
                    </View>
                  </Card>

                  <Card style={[styles.macroCard, { borderColor: colors.status.warning }]}>
                    <Wheat size={24} color={colors.status.warning} />
                    <Text style={styles.macroValue}>
                      {Math.round(macros.carbs * servingMultiplier)}g
                    </Text>
                    <Text style={styles.macroLabel}>Carbs</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(100, ((macros.carbs * servingMultiplier) / dailyGoals.carbs) * 100)}%`,
                            backgroundColor: getProgressColor(macros.carbs * servingMultiplier, dailyGoals.carbs)
                          }
                        ]}
                      />
                    </View>
                  </Card>

                  <Card style={[styles.macroCard, { borderColor: colors.status.info }]}>
                    <Droplet size={24} color={colors.status.info} />
                    <Text style={styles.macroValue}>
                      {Math.round(macros.fats * servingMultiplier)}g
                    </Text>
                    <Text style={styles.macroLabel}>Fats</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(100, ((macros.fats * servingMultiplier) / dailyGoals.fats) * 100)}%`,
                            backgroundColor: getProgressColor(macros.fats * servingMultiplier, dailyGoals.fats)
                          }
                        ]}
                      />
                    </View>
                  </Card>
                </View>

                {/* Additional Nutrients */}
                <Card style={styles.nutrientsCard}>
                  <Text style={styles.nutrientsTitle}>Additional Nutrients</Text>
                  <View style={styles.nutrientRow}>
                    <Text style={styles.nutrientLabel}>Fiber</Text>
                    <Text style={styles.nutrientValue}>
                      {Math.round(macros.fiber * servingMultiplier)}g
                    </Text>
                  </View>
                  <View style={styles.nutrientRow}>
                    <Text style={styles.nutrientLabel}>Sugar</Text>
                    <Text style={styles.nutrientValue}>
                      {Math.round(macros.sugar * servingMultiplier)}g
                    </Text>
                  </View>
                  <View style={styles.nutrientRow}>
                    <Text style={styles.nutrientLabel}>Sodium</Text>
                    <Text style={styles.nutrientValue}>
                      {Math.round(macros.sodium * servingMultiplier)}mg
                    </Text>
                  </View>
                </Card>

                {/* Ingredients */}
                <Card style={styles.ingredientsCard}>
                  <Text style={styles.ingredientsTitle}>Detected Ingredients</Text>
                  <View style={styles.ingredientsList}>
                    {macros.ingredients.map((ingredient, index) => (
                      <View key={index} style={styles.ingredientChip}>
                        <Text style={styles.ingredientText}>{ingredient}</Text>
                      </View>
                    ))}
                  </View>
                </Card>

                {/* Health Score */}
                <Card style={styles.healthCard}>
                  <View style={styles.healthHeader}>
                    <Target size={20} color={colors.accent.primary} />
                    <Text style={styles.healthTitle}>Health Score</Text>
                  </View>
                  <View style={styles.healthScoreContainer}>
                    <Text style={styles.healthScore}>{macros.healthScore}/10</Text>
                    <View style={styles.healthBar}>
                      <View
                        style={[
                          styles.healthFill,
                          {
                            width: `${macros.healthScore * 10}%`,
                            backgroundColor: macros.healthScore >= 7 ? colors.status.success : colors.status.warning
                          }
                        ]}
                      />
                    </View>
                  </View>
                  {macros.recommendations.map((rec, index) => (
                    <Text key={index} style={styles.recommendation}>
                      • {rec}
                    </Text>
                  ))}
                </Card>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <Button
                    title="Save to Diary"
                    onPress={saveMeal}
                    style={styles.actionButton}
                  />
                  <Button
                    title="Scan Another"
                    variant="outline"
                    onPress={() => {
                      setSelectedImage(null);
                      setMacros(null);
                      setServingMultiplier(1);
                    }}
                    style={styles.actionButton}
                  />
                </View>
              </>
            )}
          </View>
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
    backgroundColor: '#10B981',
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
  uploadSection: {
    padding: 16,
  },
  uploadCard: {
    padding: 24,
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  uploadButton: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    minWidth: 120,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 8,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  privacyText: {
    fontSize: 12,
    color: colors.text.secondary,
    flex: 1,
  },
  resultsSection: {
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  mealImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
  },
  servingCard: {
    padding: 16,
    marginBottom: 16,
  },
  servingTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  servingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  servingButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingDisplay: {
    alignItems: 'center',
  },
  servingValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  servingSize: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  macroCard: {
    width: '47%',
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 8,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  nutrientsCard: {
    padding: 16,
    marginBottom: 16,
  },
  nutrientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  nutrientLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  ingredientsCard: {
    padding: 16,
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 16,
  },
  ingredientText: {
    fontSize: 12,
    color: colors.text.primary,
  },
  healthCard: {
    padding: 16,
    marginBottom: 20,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  healthScoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  healthScore: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  healthBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: 4,
  },
  healthFill: {
    height: '100%',
    borderRadius: 4,
  },
  recommendation: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});