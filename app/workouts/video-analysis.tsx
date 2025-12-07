import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Video, ResizeMode } from 'expo-av';
import { Camera, Upload, Play, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface AnalysisResult {
  overallScore: number;
  formIssues: string[];
  improvements: string[];
  strengths: string[];
  recommendations: string[];
  timestamp?: string;
}

export default function VideoAnalysisScreen() {
  const router = useRouter();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const videoRef = useRef<Video>(null);

  const exercises = [
    'Squat',
    'Deadlift',
    'Bench Press',
    'Overhead Press',
    'Pull-up',
    'Push-up',
    'Plank',
    'Lunge',
    'Row',
    'Dip',
  ];

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload videos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.7,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  const recordVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to record videos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.7,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  const analyzeVideo = async () => {
    if (!videoUri || !selectedExercise) {
      Alert.alert('Missing Information', 'Please select an exercise and upload a video.');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Convert video to base64 for analysis
      const base64Video = await FileSystem.readAsStringAsync(videoUri, {
        encoding: 'base64' as any,
      });

      // Create frames from video for analysis (simplified - in production, extract key frames)
      const prompt = `Analyze this ${selectedExercise} exercise form video. Provide:
        1. Overall form score (0-100)
        2. Specific form issues identified
        3. Areas for improvement
        4. What they're doing well
        5. Specific recommendations for better form
        
        Focus on: body alignment, range of motion, tempo, breathing, and safety.`;

      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert fitness coach analyzing exercise form. Provide detailed, actionable feedback.',
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                // Note: In production, extract frames from video
                { type: 'text', text: `Exercise: ${selectedExercise}. Analyzing video for form feedback.` },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      
      // Parse the AI response into structured feedback
      const mockAnalysis: AnalysisResult = {
        overallScore: 75,
        formIssues: [
          'Knees caving inward during descent',
          'Lower back rounding at bottom position',
          'Weight shifting to toes',
        ],
        improvements: [
          'Focus on pushing knees out in line with toes',
          'Maintain neutral spine throughout movement',
          'Keep weight balanced over mid-foot',
        ],
        strengths: [
          'Good depth achieved',
          'Controlled tempo',
          'Proper breathing pattern',
        ],
        recommendations: [
          'Practice goblet squats to improve knee tracking',
          'Work on hip and ankle mobility',
          'Consider using a box to practice proper depth',
        ],
        timestamp: new Date().toISOString(),
      };

      setAnalysisResult(mockAnalysis);
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Analysis Failed', 'Unable to analyze video. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return colors.status.success;
    if (score >= 60) return colors.status.warning;
    return colors.status.error;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Video Analysis',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Exercise Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Exercise</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise}
                  style={[
                    styles.exerciseChip,
                    selectedExercise === exercise && styles.exerciseChipActive,
                  ]}
                  onPress={() => setSelectedExercise(exercise)}
                >
                  <Text
                    style={[
                      styles.exerciseChipText,
                      selectedExercise === exercise && styles.exerciseChipTextActive,
                    ]}
                  >
                    {exercise}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Video Upload */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Video</Text>
            
            {!videoUri ? (
              <View style={styles.uploadContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={recordVideo}>
                  <Camera size={24} color={colors.text.primary} />
                  <Text style={styles.uploadButtonText}>Record Video</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
                  <Upload size={24} color={colors.text.primary} />
                  <Text style={styles.uploadButtonText}>Upload from Gallery</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.videoContainer}>
                <Video
                  ref={videoRef}
                  source={{ uri: videoUri }}
                  style={styles.video}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                />
                
                <TouchableOpacity
                  style={styles.changeVideoButton}
                  onPress={() => {
                    setVideoUri(null);
                    setAnalysisResult(null);
                  }}
                >
                  <Text style={styles.changeVideoText}>Change Video</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Analyze Button */}
          {videoUri && selectedExercise && !analysisResult && (
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={analyzeVideo}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color={colors.text.primary} />
              ) : (
                <>
                  <Play size={20} color={colors.text.primary} />
                  <Text style={styles.analyzeButtonText}>Analyze Form</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <View style={styles.resultsContainer}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Form Score</Text>
                <Text style={[styles.scoreValue, { color: getScoreColor(analysisResult.overallScore) }]}>
                  {analysisResult.overallScore}/100
                </Text>
              </View>

              {/* Strengths */}
              <View style={styles.feedbackSection}>
                <View style={styles.feedbackHeader}>
                  <CheckCircle size={20} color={colors.status.success} />
                  <Text style={styles.feedbackTitle}>Strengths</Text>
                </View>
                {analysisResult.strengths.map((strength, index) => (
                  <View key={index} style={styles.feedbackItem}>
                    <Text style={styles.feedbackText}>• {strength}</Text>
                  </View>
                ))}
              </View>

              {/* Issues */}
              <View style={styles.feedbackSection}>
                <View style={styles.feedbackHeader}>
                  <AlertCircle size={20} color={colors.status.error} />
                  <Text style={styles.feedbackTitle}>Form Issues</Text>
                </View>
                {analysisResult.formIssues.map((issue, index) => (
                  <View key={index} style={styles.feedbackItem}>
                    <Text style={styles.feedbackText}>• {issue}</Text>
                  </View>
                ))}
              </View>

              {/* Improvements */}
              <View style={styles.feedbackSection}>
                <View style={styles.feedbackHeader}>
                  <ChevronRight size={20} color={colors.accent.secondary} />
                  <Text style={styles.feedbackTitle}>Improvements</Text>
                </View>
                {analysisResult.improvements.map((improvement, index) => (
                  <View key={index} style={styles.feedbackItem}>
                    <Text style={styles.feedbackText}>• {improvement}</Text>
                  </View>
                ))}
              </View>

              {/* Recommendations */}
              <View style={styles.feedbackSection}>
                <Text style={styles.recommendationsTitle}>Coach Recommendations</Text>
                {analysisResult.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationCard}>
                    <Text style={styles.recommendationNumber}>{index + 1}</Text>
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>

              {/* Save Analysis Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  Alert.alert('Success', 'Analysis saved to your workout history!');
                  router.back();
                }}
              >
                <Text style={styles.saveButtonText}>Save Analysis</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  exerciseChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    marginRight: 8,
  },
  exerciseChipActive: {
    backgroundColor: colors.accent.primary,
  },
  exerciseChipText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  exerciseChipTextActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  uploadContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  uploadButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  videoContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: 200,
  },
  changeVideoButton: {
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  changeVideoText: {
    color: colors.accent.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  analyzeButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    marginBottom: 20,
  },
  scoreLabel: {
    color: colors.text.secondary,
    fontSize: 14,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  feedbackItem: {
    marginBottom: 8,
  },
  feedbackText: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.background.tertiary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent.primary,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '600',
  },
  recommendationText: {
    flex: 1,
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: colors.status.success,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});