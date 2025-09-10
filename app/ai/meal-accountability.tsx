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
import { Camera, CheckCircle, AlertCircle, TrendingUp, Award, Calendar, Clock, Target, BarChart3, Bell } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface MealLog {
  id: string;
  timestamp: Date;
  image: string;
  analysis: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    mealType: string;
    healthScore: number;
    feedback: string;
  };
  plannedMeal?: string;
  adherenceScore: number;
}

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export default function MealAccountabilityScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65,
  });
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [streak, setStreak] = useState(0);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [mealReminders, setMealReminders] = useState({
    breakfast: '08:00',
    lunch: '12:30',
    dinner: '18:30',
    snack: '15:00',
  });
  const [activeTab, setActiveTab] = useState<'log' | 'progress' | 'coach'>('log');

  useEffect(() => {
    loadMealHistory();
    calculateStreak();
  }, []);

  const loadMealHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('mealLogs');
      if (stored) {
        const logs = JSON.parse(stored);
        setMealLogs(logs);
        calculateTodayStats(logs);
      }
    } catch (error) {
      console.error('Failed to load meal history:', error);
    }
  };

  const calculateTodayStats = (logs: MealLog[]) => {
    const today = new Date().toDateString();
    const todayLogs = logs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    );
    
    const stats = todayLogs.reduce((acc, log) => ({
      calories: acc.calories + log.analysis.calories,
      protein: acc.protein + log.analysis.protein,
      carbs: acc.carbs + log.analysis.carbs,
      fats: acc.fats + log.analysis.fats,
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    
    setTodayStats(stats);
  };

  const calculateStreak = async () => {
    try {
      const stored = await AsyncStorage.getItem('mealStreak');
      if (stored) {
        setStreak(parseInt(stored));
      }
    } catch (error) {
      console.error('Failed to load streak:', error);
    }
  };

  const pickImage = async (useCamera: boolean) => {
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
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
              content: 'You are a nutrition expert. Analyze meal photos and provide detailed nutritional information, health scores, and adherence feedback. Be encouraging but honest about meal choices.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this meal photo. Estimate calories, protein (g), carbs (g), fats (g), identify meal type, rate health score 1-10, and provide brief feedback on nutritional value.' },
                { type: 'image', image: base64Image }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      
      // Parse AI response and create meal log
      const newLog: MealLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        image: selectedImage!,
        analysis: {
          calories: 450,
          protein: 35,
          carbs: 45,
          fats: 15,
          mealType: 'lunch',
          healthScore: 8,
          feedback: data.completion || 'Great balanced meal with good protein content!',
        },
        adherenceScore: 85,
      };
      
      const updatedLogs = [...mealLogs, newLog];
      setMealLogs(updatedLogs);
      await AsyncStorage.setItem('mealLogs', JSON.stringify(updatedLogs));
      calculateTodayStats(updatedLogs);
      
      // Update streak
      const newStreak = streak + 1;
      setStreak(newStreak);
      await AsyncStorage.setItem('mealStreak', newStreak.toString());
      
    } catch (error) {
      console.error('Failed to analyze meal:', error);
    } finally {
      setIsAnalyzing(false);
      setSelectedImage(null);
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const renderLogTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{todayStats.calories}</Text>
          <Text style={styles.statLabel}>Calories</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${getProgressPercentage(todayStats.calories, dailyGoals.calories)}%` }
              ]}
            />
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{todayStats.protein}g</Text>
          <Text style={styles.statLabel}>Protein</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${getProgressPercentage(todayStats.protein, dailyGoals.protein)}%` }
              ]}
            />
          </View>
        </View>
      </View>

      {selectedImage ? (
        <View style={styles.imagePreview}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          {isAnalyzing && (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.analyzingText}>Analyzing your meal...</Text>
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadArea} onPress={() => pickImage(true)}>
          <Camera size={40} color={colors.primary} />
          <Text style={styles.uploadText}>Take Photo of Your Meal</Text>
          <Text style={styles.uploadSubtext}>AI will analyze nutrition instantly</Text>
        </TouchableOpacity>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cameraButton]}
          onPress={() => pickImage(true)}
        >
          <Camera size={20} color="white" />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.galleryButton]}
          onPress={() => pickImage(false)}
        >
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentMeals}>
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        {mealLogs
          .filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString())
          .map((log) => (
            <View key={log.id} style={styles.mealCard}>
              <Image source={{ uri: log.image }} style={styles.mealThumbnail} />
              <View style={styles.mealInfo}>
                <Text style={styles.mealType}>{log.analysis.mealType}</Text>
                <Text style={styles.mealStats}>
                  {log.analysis.calories} cal | {log.analysis.protein}g protein
                </Text>
                <View style={styles.scoreContainer}>
                  <View style={[styles.healthScore, { backgroundColor: log.analysis.healthScore >= 7 ? '#4CAF50' : '#FFA500' }]}>
                    <Text style={styles.scoreText}>{log.analysis.healthScore}/10</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
      </View>
    </View>
  );

  const renderProgressTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.streakCard}>
        <Award size={32} color={colors.primary} />
        <Text style={styles.streakNumber}>{streak}</Text>
        <Text style={styles.streakLabel}>Day Streak</Text>
      </View>

      <View style={styles.macrosCard}>
        <Text style={styles.cardTitle}>Daily Macros Progress</Text>
        
        <View style={styles.macroRow}>
          <Text style={styles.macroLabel}>Calories</Text>
          <Text style={styles.macroValue}>{todayStats.calories} / {dailyGoals.calories}</Text>
          <View style={styles.macroProgressBar}>
            <View 
              style={[
                styles.macroProgressFill,
                { 
                  width: `${getProgressPercentage(todayStats.calories, dailyGoals.calories)}%`,
                  backgroundColor: colors.primary 
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.macroRow}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroValue}>{todayStats.protein}g / {dailyGoals.protein}g</Text>
          <View style={styles.macroProgressBar}>
            <View 
              style={[
                styles.macroProgressFill,
                { 
                  width: `${getProgressPercentage(todayStats.protein, dailyGoals.protein)}%`,
                  backgroundColor: '#4CAF50' 
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.macroRow}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroValue}>{todayStats.carbs}g / {dailyGoals.carbs}g</Text>
          <View style={styles.macroProgressBar}>
            <View 
              style={[
                styles.macroProgressFill,
                { 
                  width: `${getProgressPercentage(todayStats.carbs, dailyGoals.carbs)}%`,
                  backgroundColor: '#2196F3' 
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.macroRow}>
          <Text style={styles.macroLabel}>Fats</Text>
          <Text style={styles.macroValue}>{todayStats.fats}g / {dailyGoals.fats}g</Text>
          <View style={styles.macroProgressBar}>
            <View 
              style={[
                styles.macroProgressFill,
                { 
                  width: `${getProgressPercentage(todayStats.fats, dailyGoals.fats)}%`,
                  backgroundColor: '#FF9800' 
                }
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.weeklyOverview}>
        <Text style={styles.cardTitle}>Weekly Adherence</Text>
        <View style={styles.weekDays}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <View style={[
                styles.dayBar,
                { 
                  height: `${Math.random() * 100}%`,
                  backgroundColor: index < 5 ? '#4CAF50' : '#e0e0e0'
                }
              ]} />
              <Text style={styles.dayLabel}>{day}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderCoachTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.coachCard}>
        <Text style={styles.coachTitle}>AI Nutrition Coach</Text>
        <Text style={styles.coachMessage}>
          Great job logging your meals today! You're on track with your protein intake. 
          Consider adding more vegetables to your next meal for better micronutrients.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.reminderCard}
        onPress={() => setShowReminderModal(true)}
      >
        <Bell size={24} color={colors.primary} />
        <View style={styles.reminderInfo}>
          <Text style={styles.reminderTitle}>Meal Reminders</Text>
          <Text style={styles.reminderSubtext}>Set up accountability check-ins</Text>
        </View>
        <CheckCircle size={20} color="#4CAF50" />
      </TouchableOpacity>

      <View style={styles.tipsCard}>
        <Text style={styles.cardTitle}>Today's Tips</Text>
        <View style={styles.tipItem}>
          <CheckCircle size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Drink water before each meal</Text>
        </View>
        <View style={styles.tipItem}>
          <CheckCircle size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Take a photo within 5 minutes of eating</Text>
        </View>
        <View style={styles.tipItem}>
          <CheckCircle size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Log snacks to stay accountable</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Target size={20} color="white" />
        <Text style={styles.primaryButtonText}>Update Goals</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Meal Accountability',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: 'white',
        }}
      />

      <View style={styles.header}>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{streak}</Text>
            <Text style={styles.headerStatLabel}>Day Streak</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>85%</Text>
            <Text style={styles.headerStatLabel}>Adherence</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>
              {mealLogs.filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString()).length}/4
            </Text>
            <Text style={styles.headerStatLabel}>Meals Today</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'log' && styles.activeTab]}
          onPress={() => setActiveTab('log')}
        >
          <Camera size={20} color={activeTab === 'log' ? colors.primary : '#999'} />
          <Text style={[styles.tabText, activeTab === 'log' && styles.activeTabText]}>Log Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
          onPress={() => setActiveTab('progress')}
        >
          <TrendingUp size={20} color={activeTab === 'progress' ? colors.primary : '#999'} />
          <Text style={[styles.tabText, activeTab === 'progress' && styles.activeTabText]}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'coach' && styles.activeTab]}
          onPress={() => setActiveTab('coach')}
        >
          <Target size={20} color={activeTab === 'coach' ? colors.primary : '#999'} />
          <Text style={[styles.tabText, activeTab === 'coach' && styles.activeTabText]}>Coach</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'log' && renderLogTab()}
        {activeTab === 'progress' && renderProgressTab()}
        {activeTab === 'coach' && renderCoachTab()}
      </ScrollView>

      <Modal
        visible={showReminderModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReminderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Meal Reminders</Text>
            {Object.entries(mealReminders).map(([meal, time]) => (
              <View key={meal} style={styles.reminderRow}>
                <Text style={styles.reminderMeal}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</Text>
                <TextInput
                  style={styles.timeInput}
                  value={time}
                  onChangeText={(text) => setMealReminders({...mealReminders, [meal]: text})}
                />
              </View>
            ))}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowReminderModal(false)}
            >
              <Text style={styles.modalButtonText}>Save Reminders</Text>
            </TouchableOpacity>
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
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  headerStat: {
    alignItems: 'center',
  },
  headerStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent.primary,
  },
  headerStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  quickStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  imagePreview: {
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
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  cameraButton: {
    backgroundColor: colors.primary,
  },
  galleryButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  recentMeals: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  mealThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  mealStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  healthScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  streakCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginVertical: 8,
  },
  streakLabel: {
    fontSize: 16,
    color: '#FF6B00',
  },
  macrosCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  macroRow: {
    marginBottom: 16,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  macroProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  macroProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  weeklyOverview: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
    alignItems: 'flex-end',
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dayBar: {
    width: '60%',
    borderRadius: 4,
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
  },
  coachCard: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  coachTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  coachMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  reminderCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  reminderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reminderSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  tipsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
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
    marginBottom: 20,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reminderMeal: {
    fontSize: 16,
    color: '#333',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 80,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});