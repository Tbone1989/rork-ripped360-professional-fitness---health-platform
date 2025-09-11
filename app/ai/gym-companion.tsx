import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Camera, Info, Heart, Brain, Zap, CheckCircle, AlertCircle, Play, Pause, Volume2, ChevronRight, Target, TrendingUp, Award, Users } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';

const { width } = Dimensions.get('window');

interface ExerciseInfo {
  name: string;
  muscleGroups: string[];
  difficulty: string;
  properForm: string[];
  commonMistakes: string[];
  benefits: string[];
  alternatives: string[];
}

interface AnxietyTip {
  id: string;
  title: string;
  description: string;
  icon: string;
  audioUrl?: string;
}

export default function GymCompanionScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [exerciseInfo, setExerciseInfo] = useState<ExerciseInfo | null>(null);
  const [anxietyLevel, setAnxietyLevel] = useState<number>(3);
  const [showAnxietyModal, setShowAnxietyModal] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [activeTab, setActiveTab] = useState<'scan' | 'anxiety' | 'motivation' | 'companion'>('scan');
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [showAudioDisclaimer, setShowAudioDisclaimer] = useState<boolean>(false);
  const [acceptedAudioDisclaimer, setAcceptedAudioDisclaimer] = useState<boolean>(false);

  const anxietyTips: AnxietyTip[] = [
    {
      id: '1',
      title: 'Breathing Exercise',
      description: '4-7-8 breathing technique to calm nerves',
      icon: '🧘',
    },
    {
      id: '2',
      title: 'Progressive Muscle Relaxation',
      description: 'Tense and release muscle groups',
      icon: '💪',
    },
    {
      id: '3',
      title: 'Visualization',
      description: 'Picture yourself succeeding',
      icon: '🎯',
    },
    {
      id: '4',
      title: 'Positive Affirmations',
      description: 'Repeat confidence-building phrases',
      icon: '✨',
    },
  ];

  const motivationalQuotes = [
    "Every rep counts. You're stronger than yesterday.",
    "The only bad workout is the one you didn't do.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Success starts with showing up.",
    "You're one workout away from a good mood.",
  ];

  useEffect(() => {
    // Load daily motivation
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentMotivation(randomQuote);

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (workoutStarted) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutStarted]);

  const pickImage = async (useCamera: boolean) => {
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant camera/gallery permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      analyzeEquipment(result.assets[0].base64!);
    }
  };

  const analyzeEquipment = async (base64Image: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a fitness expert. Analyze gym equipment or exercise areas and provide detailed information about proper usage, target muscles, and safety tips. Be specific and helpful.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'What exercise or equipment is shown in this image? Provide detailed information about proper form, muscles worked, common mistakes, and alternatives.' },
                { type: 'image', image: base64Image }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      
      // Parse AI response into structured format
      const info: ExerciseInfo = {
        name: 'Identified Exercise/Equipment',
        muscleGroups: ['Primary', 'Secondary'],
        difficulty: 'Intermediate',
        properForm: data.completion.split('\n').slice(0, 3),
        commonMistakes: ['Mistake 1', 'Mistake 2'],
        benefits: ['Benefit 1', 'Benefit 2'],
        alternatives: ['Alternative 1', 'Alternative 2'],
      };
      
      setExerciseInfo(info);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playAnxietyAudio = async (tipId: string) => {
    if (!acceptedAudioDisclaimer) {
      setShowAudioDisclaimer(true);
      return;
    }
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      
      // In production, these would be actual audio files
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: 'https://example.com/breathing-exercise.mp3' },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlayingAudio(true);
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlayingAudio(false);
        }
      });
    } catch (error) {
      console.log('Audio playback error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderScanTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.scanSection}>
        <Text style={styles.sectionTitle}>Equipment & Exercise Scanner</Text>
        <Text style={styles.sectionDescription}>
          Take a photo of any gym equipment or exercise area to learn proper usage
        </Text>

        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            {isAnalyzing && (
              <View style={styles.analyzingOverlay}>
                <ActivityIndicator size="large" color={colors.accent.primary} />
                <Text style={styles.analyzingText}>Analyzing equipment...</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Camera size={60} color={colors.accent.primary} />
            <Text style={styles.placeholderText}>No image selected</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, { flex: 1, marginRight: 8 }]}
            onPress={() => pickImage(true)}
          >
            <Camera size={20} color="white" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { flex: 1, marginLeft: 8 }]}
            onPress={() => pickImage(false)}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/20' }}
              style={{ width: 20, height: 20, tintColor: 'white' }}
            />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {exerciseInfo && (
          <ScrollView style={styles.resultsContainer}>
            <View style={styles.resultCard}>
              <Text style={styles.exerciseName}>{exerciseInfo.name}</Text>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Target Muscles</Text>
                <View style={styles.tagContainer}>
                  {exerciseInfo.muscleGroups.map((muscle, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{muscle}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Proper Form</Text>
                {exerciseInfo.properForm.map((tip, index) => (
                  <View key={index} style={styles.tipRow}>
                    <CheckCircle size={16} color={colors.accent.primary} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Common Mistakes</Text>
                {exerciseInfo.commonMistakes.map((mistake, index) => (
                  <View key={index} style={styles.tipRow}>
                    <AlertCircle size={16} color="#FFA500" />
                    <Text style={styles.tipText}>{mistake}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );

  const renderAnxietyTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Gym Anxiety Support</Text>
      <Text style={styles.sectionDescription}>
        We're here to help you feel confident and comfortable
      </Text>

      <View style={styles.anxietyLevelContainer}>
        <Text style={styles.anxietyLabel}>How anxious are you feeling?</Text>
        <View style={styles.anxietyScale}>
          {[1, 2, 3, 4, 5].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.anxietyButton,
                anxietyLevel === level && styles.anxietyButtonActive
              ]}
              onPress={() => setAnxietyLevel(level)}
            >
              <Text style={[
                styles.anxietyButtonText,
                anxietyLevel === level && styles.anxietyButtonTextActive
              ]}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.anxietyLabels}>
          <Text style={styles.anxietyLabelText}>Low</Text>
          <Text style={styles.anxietyLabelText}>High</Text>
        </View>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Calming Techniques</Text>
        {anxietyTips.map((tip) => (
          <TouchableOpacity
            key={tip.id}
            style={styles.tipCard}
            onPress={() => playAnxietyAudio(tip.id)}
          >
            <View style={styles.tipIcon}>
              <Text style={styles.tipEmoji}>{tip.icon}</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
            <Volume2 size={20} color={colors.accent.primary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setShowAnxietyModal(true)}
      >
        <Brain size={20} color="white" />
        <Text style={styles.primaryButtonText}>Get Personalized Support</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMotivationTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Daily Motivation</Text>
      
      <View style={styles.motivationCard}>
        <Zap size={30} color={colors.accent.primary} />
        <Text style={styles.motivationQuote}>{currentMotivation}</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => {
            const newQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
            setCurrentMotivation(newQuote);
          }}
        >
          <Text style={styles.refreshButtonText}>New Quote</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.streakContainer}>
        <Award size={24} color={colors.accent.primary} />
        <Text style={styles.streakText}>7 Day Streak! 🔥</Text>
      </View>

      <View style={styles.goalsSection}>
        <Text style={styles.goalsSectionTitle}>Today's Goals</Text>
        <View style={styles.goalCard}>
          <Target size={20} color={colors.accent.primary} />
          <Text style={styles.goalText}>Complete 30 min workout</Text>
          <CheckCircle size={20} color="#4CAF50" />
        </View>
        <View style={styles.goalCard}>
          <Target size={20} color={colors.accent.primary} />
          <Text style={styles.goalText}>Try one new exercise</Text>
          <View style={styles.goalProgress} />
        </View>
      </View>
    </View>
  );

  const renderCompanionTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Workout Companion</Text>
      
      <View style={styles.companionCard}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Workout Time</Text>
          <Text style={styles.timerText}>{formatTime(workoutTimer)}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.startButton, workoutStarted && styles.stopButton]}
          onPress={() => setWorkoutStarted(!workoutStarted)}
        >
          {workoutStarted ? (
            <>
              <Pause size={24} color="white" />
              <Text style={styles.startButtonText}>Pause Workout</Text>
            </>
          ) : (
            <>
              <Play size={24} color="white" />
              <Text style={styles.startButtonText}>Start Workout</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.exerciseTracker}>
        <Text style={styles.trackerTitle}>Exercise Checklist</Text>
        {['Warm-up', 'Squats', 'Bench Press', 'Deadlifts', 'Cool-down'].map((exercise) => (
          <TouchableOpacity
            key={exercise}
            style={styles.exerciseItem}
            onPress={() => {
              if (completedExercises.includes(exercise)) {
                setCompletedExercises(completedExercises.filter(e => e !== exercise));
              } else {
                setCompletedExercises([...completedExercises, exercise]);
              }
            }}
          >
            <View style={[
              styles.checkbox,
              completedExercises.includes(exercise) && styles.checkboxChecked
            ]}>
              {completedExercises.includes(exercise) && (
                <CheckCircle size={16} color="white" />
              )}
            </View>
            <Text style={[
              styles.exerciseItemText,
              completedExercises.includes(exercise) && styles.exerciseItemCompleted
            ]}>{exercise}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.finishButton}>
        <Text style={styles.finishButtonText}>Finish & Log Workout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'AI Gym Companion',
          headerStyle: { backgroundColor: colors.accent.primary },
          headerTintColor: 'white',
        }}
      />
      
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scan' && styles.activeTab]}
          onPress={() => setActiveTab('scan')}
        >
          <Camera size={20} color={activeTab === 'scan' ? colors.accent.primary : '#999'} />
          <Text style={[styles.tabText, activeTab === 'scan' && styles.activeTabText]}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'anxiety' && styles.activeTab]}
          onPress={() => setActiveTab('anxiety')}
        >
          <Heart size={20} color={activeTab === 'anxiety' ? colors.accent.primary : '#999'} />
          <Text style={[styles.tabText, activeTab === 'anxiety' && styles.activeTabText]}>Anxiety</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'motivation' && styles.activeTab]}
          onPress={() => setActiveTab('motivation')}
        >
          <Zap size={20} color={activeTab === 'motivation' ? colors.accent.primary : '#999'} />
          <Text style={[styles.tabText, activeTab === 'motivation' && styles.activeTabText]}>Motivate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'companion' && styles.activeTab]}
          onPress={() => setActiveTab('companion')}
        >
          <Users size={20} color={activeTab === 'companion' ? colors.accent.primary : '#999'} />
          <Text style={[styles.tabText, activeTab === 'companion' && styles.activeTabText]}>Track</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'scan' && renderScanTab()}
        {activeTab === 'anxiety' && renderAnxietyTab()}
        {activeTab === 'motivation' && renderMotivationTab()}
        {activeTab === 'companion' && renderCompanionTab()}
      </ScrollView>

      <Modal
        visible={showAnxietyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAnxietyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Personalized Support</Text>
            <Text style={styles.modalDescription}>
              Our AI coach can provide personalized strategies based on your specific concerns.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="What makes you anxious about the gym?"
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowAnxietyModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSubmit]}
                onPress={() => {
                  Alert.alert('Support Sent', 'Our AI coach will provide personalized tips');
                  setShowAnxietyModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Get Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LegalDisclaimer
        visible={showAudioDisclaimer}
        type="audio"
        onClose={() => setShowAudioDisclaimer(false)}
        onAccept={() => {
          setAcceptedAudioDisclaimer(true);
          setShowAudioDisclaimer(false);
        }}
        title="Audio Safety & Consent"
        testID="gymAudioDisclaimerModal"
      />
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
  scanSection: {
    flex: 1,
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
  placeholderContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#999',
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.accent.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: colors.accent.primary,
    fontSize: 14,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  anxietyLevelContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  anxietyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  anxietyScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  anxietyButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  anxietyButtonActive: {
    backgroundColor: colors.accent.primary,
  },
  anxietyButtonText: {
    fontSize: 16,
    color: '#666',
  },
  anxietyButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  anxietyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  anxietyLabelText: {
    fontSize: 12,
    color: '#999',
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  tipIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
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
  motivationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  motivationQuote: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.accent.primary + '20',
  },
  refreshButtonText: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  streakContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginLeft: 8,
  },
  goalsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  goalsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  goalText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  goalProgress: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  companionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.accent.primary,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#FF5252',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  exerciseTracker: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  trackerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  exerciseItemText: {
    fontSize: 16,
    color: '#333',
  },
  exerciseItemCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  finishButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
    width: width - 40,
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
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
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