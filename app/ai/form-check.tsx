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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import {
  Camera as CameraIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Info,
} from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface FormAnalysis {
  score: number;
  issues: string[];
  corrections: string[];
  injuryRisk: 'low' | 'medium' | 'high';
  repCount: number;
}

export default function AIFormCheckScreen() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FormAnalysis | null>(null);
  const [selectedExercise, setSelectedExercise] = useState('squat');
  const cameraRef = useRef<any>(null);

  const exercises = [
    { id: 'squat', name: 'Squat', icon: '🏋️' },
    { id: 'deadlift', name: 'Deadlift', icon: '💪' },
    { id: 'bench', name: 'Bench Press', icon: '🎯' },
    { id: 'overhead', name: 'Overhead Press', icon: '🙌' },
    { id: 'row', name: 'Barbell Row', icon: '🚣' },
    { id: 'pullup', name: 'Pull-up', icon: '🤸' },
  ];

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <CameraIcon size={48} color={colors.text.secondary} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to analyze your exercise form in real-time
          </Text>
          <Button title="Grant Permission" onPress={requestPermission} />
        </View>
      </SafeAreaView>
    );
  }

  const startAnalysis = async () => {
    setIsRecording(true);
    setAnalysis(null);
    
    // Simulate recording and analysis
    setTimeout(() => {
      setIsRecording(false);
      setIsAnalyzing(true);
      
      // Mock AI analysis
      setTimeout(() => {
        const mockAnalysis: FormAnalysis = {
          score: 85,
          issues: [
            'Knees caving inward slightly',
            'Forward lean at bottom position',
            'Heels lifting slightly'
          ],
          corrections: [
            'Push knees out in line with toes',
            'Keep chest up and core tight',
            'Focus on driving through heels'
          ],
          injuryRisk: 'medium',
          repCount: 8
        };
        setAnalysis(mockAnalysis);
        setIsAnalyzing(false);
      }, 2000);
    }, 5000);
  };

  const stopAnalysis = () => {
    setIsRecording(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return colors.status.success;
    if (score >= 70) return colors.status.warning;
    return colors.status.error;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return colors.status.success;
      case 'medium': return colors.status.warning;
      case 'high': return colors.status.error;
      default: return colors.text.secondary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'AI Form Check',
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
              <Text style={styles.aiBannerTitle}>Real-Time Form Analysis</Text>
              <Text style={styles.aiBannerSubtitle}>AI-powered injury prevention</Text>
            </View>
          </View>
        </View>

        {/* Exercise Selection */}
        <View style={styles.exerciseSection}>
          <Text style={styles.sectionTitle}>Select Exercise</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={[
                  styles.exerciseCard,
                  selectedExercise === exercise.id && styles.exerciseCardActive
                ]}
                onPress={() => setSelectedExercise(exercise.id)}
              >
                <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
                <Text style={[
                  styles.exerciseName,
                  selectedExercise === exercise.id && styles.exerciseNameActive
                ]}>
                  {exercise.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Camera View */}
        <View style={styles.cameraSection}>
          {Platform.OS !== 'web' ? (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
            >
              <View style={styles.cameraOverlay}>
                {isRecording && (
                  <View style={styles.recordingIndicator}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.recordingText}>Recording...</Text>
                  </View>
                )}
                
                {isAnalyzing && (
                  <View style={styles.analyzingOverlay}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.analyzingText}>Analyzing form...</Text>
                  </View>
                )}

                {/* Guide overlay */}
                <View style={styles.guideOverlay}>
                  <View style={styles.guideLine} />
                  <View style={[styles.guideLine, styles.guideLineHorizontal]} />
                </View>
              </View>
            </CameraView>
          ) : (
            <View style={styles.webFallback}>
              <CameraIcon size={48} color={colors.text.secondary} />
              <Text style={styles.webFallbackText}>
                Camera preview not available on web.
                Use mobile app for real-time form analysis.
              </Text>
            </View>
          )}

          {/* Camera Controls */}
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            >
              <RotateCcw size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordButtonActive]}
              onPress={isRecording ? stopAnalysis : startAnalysis}
            >
              {isRecording ? (
                <Pause size={32} color="#FFFFFF" />
              ) : (
                <Play size={32} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <View style={styles.controlButton} />
          </View>
        </View>

        {/* Analysis Results */}
        {analysis && (
          <View style={styles.resultsSection}>
            {/* Score Card */}
            <Card style={styles.scoreCard}>
              <View style={styles.scoreHeader}>
                <Text style={styles.scoreTitle}>Form Score</Text>
                <Text style={[styles.scoreValue, { color: getScoreColor(analysis.score) }]}>
                  {analysis.score}/100
                </Text>
              </View>
              
              <View style={styles.scoreDetails}>
                <View style={styles.scoreDetail}>
                  <Text style={styles.scoreDetailLabel}>Reps Counted</Text>
                  <Text style={styles.scoreDetailValue}>{analysis.repCount}</Text>
                </View>
                <View style={styles.scoreDetail}>
                  <Text style={styles.scoreDetailLabel}>Injury Risk</Text>
                  <Text style={[
                    styles.scoreDetailValue,
                    { color: getRiskColor(analysis.injuryRisk) }
                  ]}>
                    {analysis.injuryRisk.toUpperCase()}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Issues */}
            <Card style={styles.issuesCard}>
              <View style={styles.issuesHeader}>
                <XCircle size={20} color={colors.status.error} />
                <Text style={styles.issuesTitle}>Form Issues Detected</Text>
              </View>
              {analysis.issues.map((issue, index) => (
                <View key={index} style={styles.issue}>
                  <AlertCircle size={16} color={colors.status.warning} />
                  <Text style={styles.issueText}>{issue}</Text>
                </View>
              ))}
            </Card>

            {/* Corrections */}
            <Card style={styles.correctionsCard}>
              <View style={styles.correctionsHeader}>
                <CheckCircle size={20} color={colors.status.success} />
                <Text style={styles.correctionsTitle}>How to Improve</Text>
              </View>
              {analysis.corrections.map((correction, index) => (
                <View key={index} style={styles.correction}>
                  <View style={styles.correctionNumber}>
                    <Text style={styles.correctionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.correctionText}>{correction}</Text>
                </View>
              ))}
            </Card>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                title="Save Analysis"
                onPress={() => Alert.alert('Success', 'Analysis saved to your profile')}
                style={styles.actionButton}
              />
              <Button
                title="Try Again"
                variant="outline"
                onPress={() => setAnalysis(null)}
                style={styles.actionButton}
              />
            </View>
          </View>
        )}

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Info size={20} color={colors.accent.primary} />
            <Text style={styles.tipsTitle}>Setup Tips</Text>
          </View>
          <Text style={styles.tip}>• Position camera 6-8 feet away</Text>
          <Text style={styles.tip}>• Ensure full body is visible</Text>
          <Text style={styles.tip}>• Use good lighting</Text>
          <Text style={styles.tip}>• Wear form-fitting clothes</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  aiBanner: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#06B6D4',
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
  exerciseSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  exerciseCard: {
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    minWidth: 80,
  },
  exerciseCardActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primary + '15',
  },
  exerciseIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  exerciseNameActive: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  cameraSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  camera: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cameraOverlay: {
    flex: 1,
    position: 'relative',
  },
  recordingIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
  },
  guideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  guideLineHorizontal: {
    width: '100%',
    height: 1,
  },
  webFallback: {
    height: 400,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  webFallbackText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: colors.status.error,
  },
  resultsSection: {
    padding: 16,
  },
  scoreCard: {
    padding: 20,
    marginBottom: 16,
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreDetail: {
    alignItems: 'center',
  },
  scoreDetailLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  scoreDetailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  issuesCard: {
    padding: 16,
    marginBottom: 16,
  },
  issuesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  issuesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  issue: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  issueText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  correctionsCard: {
    padding: 16,
    marginBottom: 16,
  },
  correctionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  correctionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  correction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  correctionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.status.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctionNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.status.success,
  },
  correctionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  tipsCard: {
    margin: 16,
    padding: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  tip: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});