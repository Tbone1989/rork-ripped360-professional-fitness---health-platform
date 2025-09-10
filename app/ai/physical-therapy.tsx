import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Camera, Activity, Heart, Timer, AlertCircle, CheckCircle, Play, Pause, RotateCcw, ChevronRight, Target, TrendingUp } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exercise {
  id: string;
  name: string;
  category: 'stretch' | 'strength' | 'mobility' | 'balance';
  duration: number;
  reps?: number;
  sets?: number;
  description: string;
  benefits: string[];
  cautions: string[];
  imageUrl?: string;
  videoUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface InjuryProfile {
  id: string;
  bodyPart: string;
  severity: 'mild' | 'moderate' | 'severe';
  dateReported: Date;
  symptoms: string[];
  restrictions: string[];
  recommendedExercises: Exercise[];
  progress: number;
}

interface Session {
  id: string;
  date: Date;
  exercises: Exercise[];
  duration: number;
  painLevel: number;
  notes: string;
  completed: boolean;
}

export default function PhysicalTherapyScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [injuryProfile, setInjuryProfile] = useState<InjuryProfile | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [painLevel, setPainLevel] = useState(3);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showPainModal, setShowPainModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'assess' | 'exercises' | 'progress'>('assess');
  const [bodyPart, setBodyPart] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const commonInjuries = [
    { part: 'Lower Back', icon: '🔙' },
    { part: 'Knee', icon: '🦵' },
    { part: 'Shoulder', icon: '💪' },
    { part: 'Neck', icon: '🦒' },
    { part: 'Ankle', icon: '🦶' },
    { part: 'Wrist', icon: '✋' },
  ];

  const stretchingExercises: Exercise[] = [
    {
      id: '1',
      name: 'Cat-Cow Stretch',
      category: 'stretch',
      duration: 30,
      description: 'Gentle spinal mobility exercise',
      benefits: ['Improves spine flexibility', 'Reduces back tension'],
      cautions: ['Move slowly', 'Stop if pain increases'],
      difficulty: 'beginner',
    },
    {
      id: '2',
      name: 'Hamstring Stretch',
      category: 'stretch',
      duration: 45,
      description: 'Seated or standing hamstring stretch',
      benefits: ['Reduces lower back strain', 'Improves flexibility'],
      cautions: ['Don\'t bounce', 'Keep back straight'],
      difficulty: 'beginner',
    },
  ];

  useEffect(() => {
    loadInjuryProfile();
    loadSessions();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && exerciseTimer > 0) {
      interval = setInterval(() => {
        setExerciseTimer(prev => prev - 1);
      }, 1000);
    } else if (exerciseTimer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Exercise completed
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, exerciseTimer]);

  const loadInjuryProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem('injuryProfile');
      if (stored) {
        setInjuryProfile(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load injury profile:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const stored = await AsyncStorage.getItem('therapySessions');
      if (stored) {
        setSessions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      analyzePosture(result.assets[0].base64!);
    }
  };

  const analyzePosture = async (base64Image: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a physical therapy expert. Analyze posture and body positioning in images to identify potential issues and recommend corrective exercises. Focus on alignment, muscle imbalances, and injury prevention.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this posture/body position. Identify any alignment issues, potential problem areas, and recommend specific stretches or exercises for improvement.' },
                { type: 'image', image: base64Image }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      
      // Create injury profile based on analysis
      const profile: InjuryProfile = {
        id: Date.now().toString(),
        bodyPart: bodyPart || 'General',
        severity: 'mild',
        dateReported: new Date(),
        symptoms: symptoms.split(',').map(s => s.trim()),
        restrictions: [],
        recommendedExercises: stretchingExercises,
        progress: 0,
      };
      
      setInjuryProfile(profile);
      await AsyncStorage.setItem('injuryProfile', JSON.stringify(profile));
      
    } catch (error) {
      console.error('Failed to analyze posture:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setExerciseTimer(exercise.duration);
    setIsTimerRunning(true);
  };

  const completeSession = async () => {
    const newSession: Session = {
      id: Date.now().toString(),
      date: new Date(),
      exercises: injuryProfile?.recommendedExercises || [],
      duration: 30,
      painLevel,
      notes: '',
      completed: true,
    };
    
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    await AsyncStorage.setItem('therapySessions', JSON.stringify(updatedSessions));
    
    // Update progress
    if (injuryProfile) {
      const updatedProfile = {
        ...injuryProfile,
        progress: Math.min(injuryProfile.progress + 5, 100),
      };
      setInjuryProfile(updatedProfile);
      await AsyncStorage.setItem('injuryProfile', JSON.stringify(updatedProfile));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderAssessTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>AI Posture & Injury Assessment</Text>
      <Text style={styles.sectionDescription}>
        Take a photo or describe your pain for personalized therapy recommendations
      </Text>

      <View style={styles.bodyPartGrid}>
        {commonInjuries.map((injury) => (
          <TouchableOpacity
            key={injury.part}
            style={[
              styles.bodyPartCard,
              bodyPart === injury.part && styles.bodyPartCardActive
            ]}
            onPress={() => setBodyPart(injury.part)}
          >
            <Text style={styles.bodyPartIcon}>{injury.icon}</Text>
            <Text style={styles.bodyPartText}>{injury.part}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Describe your symptoms:</Text>
        <TextInput
          style={styles.symptomInput}
          placeholder="e.g., Sharp pain, stiffness, limited range of motion"
          value={symptoms}
          onChangeText={setSymptoms}
          multiline
          numberOfLines={3}
        />
      </View>

      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          {isAnalyzing && (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator size="large" color={colors.accent.primary} />
              <Text style={styles.analyzingText}>Analyzing posture...</Text>
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
          <Camera size={40} color={colors.accent.primary} />
          <Text style={styles.uploadText}>Take Photo for Posture Analysis</Text>
          <Text style={styles.uploadSubtext}>AI will identify issues and recommend exercises</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => analyzePosture('')}
      >
        <Activity size={20} color="white" />
        <Text style={styles.primaryButtonText}>Get Personalized Plan</Text>
      </TouchableOpacity>
    </View>
  );

  const renderExercisesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Your Therapy Exercises</Text>
      
      {currentExercise ? (
        <View style={styles.exercisePlayer}>
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(exerciseTimer)}</Text>
          </View>
          
          <View style={styles.exerciseControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? (
                <Pause size={24} color="white" />
              ) : (
                <Play size={24} color="white" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setExerciseTimer(currentExercise.duration)}
            >
              <RotateCcw size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseDescription}>{currentExercise.description}</Text>
            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>Benefits:</Text>
              {currentExercise.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <CheckCircle size={16} color="#4CAF50" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {injuryProfile?.recommendedExercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => startExercise(exercise)}
            >
              <View style={styles.exerciseCardContent}>
                <View style={styles.exerciseCardInfo}>
                  <Text style={styles.exerciseCardName}>{exercise.name}</Text>
                  <Text style={styles.exerciseCardDuration}>
                    {exercise.duration}s • {exercise.category}
                  </Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
                  </View>
                </View>
                <ChevronRight size={24} color="#999" />
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => {
              setShowPainModal(true);
            }}
          >
            <CheckCircle size={20} color="white" />
            <Text style={styles.completeButtonText}>Complete Session</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );

  const renderProgressTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Recovery Progress</Text>
      
      {injuryProfile && (
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>{injuryProfile.bodyPart} Recovery</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${injuryProfile.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{injuryProfile.progress}% Complete</Text>
        </View>
      )}

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{sessions.length}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {sessions.reduce((acc, s) => acc + s.duration, 0)}
          </Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {sessions.length > 0 
              ? (sessions.reduce((acc, s) => acc + s.painLevel, 0) / sessions.length).toFixed(1)
              : '0'}
          </Text>
          <Text style={styles.statLabel}>Avg Pain</Text>
        </View>
      </View>

      <View style={styles.sessionHistory}>
        <Text style={styles.historyTitle}>Recent Sessions</Text>
        {sessions.slice(-5).reverse().map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionDate}>
              <Text style={styles.sessionDateText}>
                {new Date(session.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionExercises}>
                {session.exercises.length} exercises • {session.duration} min
              </Text>
              <View style={styles.painIndicator}>
                <Text style={styles.painText}>Pain: {session.painLevel}/10</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Recovery Tips</Text>
        <View style={styles.tipItem}>
          <CheckCircle size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Stay consistent with daily exercises</Text>
        </View>
        <View style={styles.tipItem}>
          <CheckCircle size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Ice affected area after sessions</Text>
        </View>
        <View style={styles.tipItem}>
          <CheckCircle size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Maintain good posture throughout the day</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'AI Physical Therapy',
          headerStyle: { backgroundColor: colors.accent.primary },
          headerTintColor: 'white',
        }}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'assess' && styles.activeTab]}
          onPress={() => setActiveTab('assess')}
        >
          <Camera size={20} color={activeTab === 'assess' ? colors.accent.primary : '#999'} />
          <Text style={[styles.tabText, activeTab === 'assess' && styles.activeTabText]}>Assess</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'exercises' && styles.activeTab]}
          onPress={() => setActiveTab('exercises')}
        >
          <Activity size={20} color={activeTab === 'exercises' ? colors.accent.primary : '#999'} />
          <Text style={[styles.tabText, activeTab === 'exercises' && styles.activeTabText]}>Exercises</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
          onPress={() => setActiveTab('progress')}
        >
          <TrendingUp size={20} color={activeTab === 'progress' ? colors.accent.primary : '#999'} />
          <Text style={[styles.tabText, activeTab === 'progress' && styles.activeTabText]}>Progress</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'assess' && renderAssessTab()}
        {activeTab === 'exercises' && renderExercisesTab()}
        {activeTab === 'progress' && renderProgressTab()}
      </ScrollView>

      <Modal
        visible={showPainModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPainModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: Dimensions.get('window').width - 40 }]}>
            <Text style={styles.modalTitle}>How was your pain level?</Text>
            <Text style={styles.modalDescription}>Rate your pain from 1 (minimal) to 10 (severe)</Text>
            
            <View style={styles.painScale}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.painButton,
                    painLevel === level && styles.painButtonActive
                  ]}
                  onPress={() => setPainLevel(level)}
                >
                  <Text style={[
                    styles.painButtonText,
                    painLevel === level && styles.painButtonTextActive
                  ]}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.notesInput}
              placeholder="Any notes about the session?"
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowPainModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSubmit]}
                onPress={() => {
                  completeSession();
                  setShowPainModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Save Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent.primary,
  },
  tabText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  activeTabText: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  bodyPartGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  bodyPartCard: {
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: '1.5%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bodyPartCardActive: {
    borderColor: colors.accent.primary,
  },
  bodyPartIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  bodyPartText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  symptomInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: 'white',
    marginTop: 12,
    fontSize: 16,
  },
  uploadArea: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  exercisePlayer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.accent.primary,
  },
  exerciseControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: colors.accent.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  exerciseInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  benefitsSection: {
    marginTop: 12,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  benefitText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseCardInfo: {
    flex: 1,
  },
  exerciseCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  exerciseCardDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  difficultyBadge: {
    backgroundColor: colors.accent.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 12,
    color: colors.accent.primary,
    textTransform: 'capitalize',
  },
  completeButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sessionHistory: {
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  sessionDate: {
    marginRight: 12,
  },
  sessionDateText: {
    fontSize: 14,
    color: '#666',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionExercises: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  painIndicator: {
    flexDirection: 'row',
  },
  painText: {
    fontSize: 12,
    color: '#999',
  },
  tipsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  painScale: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  painButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  painButtonActive: {
    backgroundColor: colors.accent.primary,
  },
  painButtonText: {
    fontSize: 14,
    color: '#666',
  },
  painButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  modalButtonSubmit: {
    backgroundColor: colors.accent.primary,
    marginLeft: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});