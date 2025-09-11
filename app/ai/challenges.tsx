import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import {
  Zap,
  Target,
  Calendar,
  Trophy,
  Users,
  Star,
  Clock,
  Dumbbell,
  Heart,
  Brain,
  Sparkles,
  Plus,
  Filter,
  CheckCircle,
  Award,
  TrendingUp,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/ChipGroup';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'fitness' | 'nutrition' | 'wellness' | 'mindset';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // days
  participants: number;
  reward: string;
  rules: string[];
  dailyTasks: string[];
  isActive: boolean;
  progress?: number;
  startDate?: string;
  endDate?: string;
  category: string;
  aiGenerated: boolean;
}

interface ChallengePreferences {
  goals: string[];
  fitnessLevel: string[];
  timeCommitment: string[];
  challengeTypes: string[];
  duration: string[];
}

export default function AIChallengeGeneratorScreen() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [preferences, setPreferences] = useState<ChallengePreferences>({
    goals: ['strength'],
    fitnessLevel: ['intermediate'],
    timeCommitment: ['30-min'],
    challengeTypes: ['fitness'],
    duration: ['7-days'],
  });

  const goalOptions = [
    { id: 'strength', label: 'Build Strength' },
    { id: 'endurance', label: 'Improve Endurance' },
    { id: 'flexibility', label: 'Increase Flexibility' },
    { id: 'weight-loss', label: 'Lose Weight' },
    { id: 'muscle-gain', label: 'Gain Muscle' },
    { id: 'wellness', label: 'Overall Wellness' },
  ];

  const fitnessLevelOptions = [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const timeCommitmentOptions = [
    { id: '15-min', label: '15 minutes/day' },
    { id: '30-min', label: '30 minutes/day' },
    { id: '45-min', label: '45 minutes/day' },
    { id: '60-min', label: '1 hour/day' },
  ];

  const challengeTypeOptions = [
    { id: 'fitness', label: 'Fitness' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'wellness', label: 'Wellness' },
    { id: 'mindset', label: 'Mindset' },
  ];

  const durationOptions = [
    { id: '7-days', label: '7 Days' },
    { id: '14-days', label: '14 Days' },
    { id: '21-days', label: '21 Days' },
    { id: '30-days', label: '30 Days' },
  ];

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setIsLoading(true);
    try {
      // Simulate loading existing challenges
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockChallenges: Challenge[] = [
        {
          id: '1',
          title: '30-Day Strength Builder',
          description: 'Build functional strength with progressive bodyweight and dumbbell exercises',
          type: 'fitness',
          difficulty: 'intermediate',
          duration: 30,
          participants: 1247,
          reward: 'Strength Master Badge + 1000 points',
          rules: [
            'Complete daily workout (30-45 minutes)',
            'Track your progress with photos',
            'Rest days are mandatory - no skipping!',
            'Share weekly progress updates'
          ],
          dailyTasks: [
            'Complete strength workout',
            'Log workout details',
            'Take progress photo',
            'Drink 8 glasses of water'
          ],
          isActive: true,
          progress: 67,
          startDate: '2024-01-01',
          endDate: '2024-01-30',
          category: 'Strength Training',
          aiGenerated: true,
        },
        {
          id: '2',
          title: 'Mindful Movement Week',
          description: 'Combine yoga, meditation, and gentle movement for mental clarity',
          type: 'wellness',
          difficulty: 'beginner',
          duration: 7,
          participants: 892,
          reward: 'Zen Master Badge + Meditation Guide',
          rules: [
            '20 minutes of mindful movement daily',
            '10 minutes of meditation',
            'Journal your feelings',
            'No intense workouts during this week'
          ],
          dailyTasks: [
            'Morning meditation (10 min)',
            'Yoga or stretching (20 min)',
            'Gratitude journaling',
            'Evening reflection'
          ],
          isActive: false,
          category: 'Mindfulness',
          aiGenerated: true,
        },
        {
          id: '3',
          title: 'Nutrition Reset Challenge',
          description: 'Reset your eating habits with whole foods and mindful eating',
          type: 'nutrition',
          difficulty: 'intermediate',
          duration: 21,
          participants: 2156,
          reward: 'Nutrition Expert Badge + Meal Plan Guide',
          rules: [
            'Eat 5 servings of vegetables daily',
            'No processed foods',
            'Drink water before each meal',
            'Plan meals in advance'
          ],
          dailyTasks: [
            'Plan tomorrow meals',
            'Eat 5 servings of vegetables',
            'Drink 8 glasses of water',
            'Take food photos'
          ],
          isActive: false,
          category: 'Healthy Eating',
          aiGenerated: true,
        },
      ];
      
      setChallenges(mockChallenges);
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIChallenge = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const challengeTypes = ['fitness', 'nutrition', 'wellness', 'mindset'] as const;
      const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
      const durations = [7, 14, 21, 30];
      
      const randomType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
      const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const randomDuration = durations[Math.floor(Math.random() * durations.length)];
      
      const challengeTemplates = {
        fitness: {
          titles: ['Ultimate Strength Challenge', 'Cardio Blast Challenge', 'Flexibility Master', 'Core Power Challenge'],
          descriptions: [
            'Transform your strength with progressive workouts designed by AI',
            'Boost your cardiovascular fitness with high-energy routines',
            'Improve flexibility and mobility with targeted stretching',
            'Build a rock-solid core with focused exercises'
          ],
          categories: ['Strength Training', 'Cardio', 'Flexibility', 'Core Training'],
        },
        nutrition: {
          titles: ['Clean Eating Challenge', 'Hydration Hero Challenge', 'Macro Balance Challenge', 'Plant Power Challenge'],
          descriptions: [
            'Reset your nutrition with whole, unprocessed foods',
            'Master proper hydration for optimal performance',
            'Learn to balance macronutrients for your goals',
            'Discover the power of plant-based nutrition'
          ],
          categories: ['Clean Eating', 'Hydration', 'Macro Tracking', 'Plant-Based'],
        },
        wellness: {
          titles: ['Sleep Optimization Challenge', 'Stress Buster Challenge', 'Energy Boost Challenge', 'Recovery Master Challenge'],
          descriptions: [
            'Optimize your sleep for better recovery and performance',
            'Learn effective stress management techniques',
            'Naturally boost your energy levels throughout the day',
            'Master the art of recovery and regeneration'
          ],
          categories: ['Sleep Health', 'Stress Management', 'Energy', 'Recovery'],
        },
        mindset: {
          titles: ['Confidence Builder Challenge', 'Gratitude Practice Challenge', 'Goal Crusher Challenge', 'Mindfulness Master Challenge'],
          descriptions: [
            'Build unshakeable confidence in all areas of life',
            'Develop a powerful gratitude practice',
            'Learn to set and achieve ambitious goals',
            'Master mindfulness for mental clarity'
          ],
          categories: ['Confidence', 'Gratitude', 'Goal Setting', 'Mindfulness'],
        },
      };
      
      const template = challengeTemplates[randomType];
      const randomIndex = Math.floor(Math.random() * template.titles.length);
      
      const newChallenge: Challenge = {
        id: Date.now().toString(),
        title: template.titles[randomIndex],
        description: template.descriptions[randomIndex],
        type: randomType,
        difficulty: randomDifficulty,
        duration: randomDuration,
        participants: Math.floor(Math.random() * 1000) + 100,
        reward: `${template.titles[randomIndex]} Badge + ${randomDuration * 50} points`,
        rules: [
          'Complete daily tasks consistently',
          'Track your progress daily',
          'Share weekly updates with the community',
          'Support other participants'
        ],
        dailyTasks: [
          'Complete main challenge activity',
          'Log your progress',
          'Share motivation with community',
          'Reflect on daily wins'
        ],
        isActive: false,
        category: template.categories[randomIndex],
        aiGenerated: true,
      };
      
      setChallenges(prev => [newChallenge, ...prev]);
      setSelectedChallenge(newChallenge);
      setShowChallengeModal(true);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to generate challenge. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const joinChallenge = (challenge: Challenge) => {
    Alert.alert(
      'Join Challenge',
      `Are you ready to start "${challenge.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join Challenge',
          onPress: () => {
            const updatedChallenge = {
              ...challenge,
              isActive: true,
              progress: 0,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + challenge.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            };
            
            setChallenges(prev => prev.map(c => c.id === challenge.id ? updatedChallenge : c));
            Alert.alert('Success!', `You've joined "${challenge.title}". Good luck!`);
          },
        },
      ]
    );
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'fitness': return colors.accent.primary;
      case 'nutrition': return colors.status.success;
      case 'wellness': return colors.status.info;
      case 'mindset': return colors.status.warning;
      default: return colors.text.secondary;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return colors.status.success;
      case 'intermediate': return colors.status.warning;
      case 'advanced': return colors.status.error;
      default: return colors.text.secondary;
    }
  };

  const renderChallengeCard = (challenge: Challenge) => (
    <TouchableOpacity
      key={challenge.id}
      style={styles.challengeCard}
      onPress={() => {
        setSelectedChallenge(challenge);
        setShowChallengeModal(true);
      }}
    >
      <Card style={styles.challengeCardContent}>
        <View style={styles.challengeHeader}>
          <View style={styles.challengeTypeContainer}>
            <View style={[styles.typeIcon, { backgroundColor: getChallengeTypeColor(challenge.type) + '20' }]}>
              {challenge.type === 'fitness' && <Dumbbell size={16} color={getChallengeTypeColor(challenge.type)} />}
              {challenge.type === 'nutrition' && <Target size={16} color={getChallengeTypeColor(challenge.type)} />}
              {challenge.type === 'wellness' && <Heart size={16} color={getChallengeTypeColor(challenge.type)} />}
              {challenge.type === 'mindset' && <Brain size={16} color={getChallengeTypeColor(challenge.type)} />}
            </View>
            <Text style={[styles.challengeType, { color: getChallengeTypeColor(challenge.type) }]}>
              {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
            </Text>
          </View>
          
          <View style={styles.challengeBadges}>
            {challenge.aiGenerated && (
              <View style={styles.aiBadge}>
                <Sparkles size={12} color={colors.status.warning} />
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            )}
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
              <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDescription} numberOfLines={2}>{challenge.description}</Text>
        
        <View style={styles.challengeMeta}>
          <View style={styles.metaItem}>
            <Calendar size={14} color={colors.text.secondary} />
            <Text style={styles.metaText}>{challenge.duration} days</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={14} color={colors.text.secondary} />
            <Text style={styles.metaText}>{challenge.participants.toLocaleString()} joined</Text>
          </View>
          <View style={styles.metaItem}>
            <Trophy size={14} color={colors.text.secondary} />
            <Text style={styles.metaText}>{challenge.reward.split(' + ')[1] || 'Rewards'}</Text>
          </View>
        </View>
        
        {challenge.isActive && challenge.progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercentage}>{challenge.progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${challenge.progress}%` }]} />
            </View>
          </View>
        )}
        
        <View style={styles.challengeActions}>
          {challenge.isActive ? (
            <Button
              title="Continue Challenge"
              variant="primary"
              size="small"
              onPress={() => router.push('/community/index')}
              fullWidth
              icon={<TrendingUp size={16} color="white" />}
            />
          ) : (
            <Button
              title="Join Challenge"
              variant="outline"
              size="small"
              onPress={() => joinChallenge(challenge)}
              fullWidth
              icon={<Plus size={16} color={colors.accent.primary} />}
            />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderFiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilters(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Challenge Preferences</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.modalClose}>Done</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Goals</Text>
            <ChipGroup
              options={goalOptions}
              selectedIds={preferences.goals}
              onChange={(selected) => setPreferences(prev => ({ ...prev, goals: selected }))}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Fitness Level</Text>
            <ChipGroup
              options={fitnessLevelOptions}
              selectedIds={preferences.fitnessLevel}
              onChange={(selected) => setPreferences(prev => ({ ...prev, fitnessLevel: selected }))}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Time Commitment</Text>
            <ChipGroup
              options={timeCommitmentOptions}
              selectedIds={preferences.timeCommitment}
              onChange={(selected) => setPreferences(prev => ({ ...prev, timeCommitment: selected }))}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Challenge Types</Text>
            <ChipGroup
              options={challengeTypeOptions}
              selectedIds={preferences.challengeTypes}
              onChange={(selected) => setPreferences(prev => ({ ...prev, challengeTypes: selected }))}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Duration</Text>
            <ChipGroup
              options={durationOptions}
              selectedIds={preferences.duration}
              onChange={(selected) => setPreferences(prev => ({ ...prev, duration: selected }))}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderChallengeModal = () => (
    <Modal
      visible={showChallengeModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowChallengeModal(false)}
    >
      {selectedChallenge && (
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedChallenge.title}</Text>
            <TouchableOpacity onPress={() => setShowChallengeModal(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.challengeDetail}>
              <View style={styles.detailHeader}>
                <View style={[styles.typeIcon, { backgroundColor: getChallengeTypeColor(selectedChallenge.type) + '20' }]}>
                  {selectedChallenge.type === 'fitness' && <Dumbbell size={20} color={getChallengeTypeColor(selectedChallenge.type)} />}
                  {selectedChallenge.type === 'nutrition' && <Target size={20} color={getChallengeTypeColor(selectedChallenge.type)} />}
                  {selectedChallenge.type === 'wellness' && <Heart size={20} color={getChallengeTypeColor(selectedChallenge.type)} />}
                  {selectedChallenge.type === 'mindset' && <Brain size={20} color={getChallengeTypeColor(selectedChallenge.type)} />}
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailCategory}>{selectedChallenge.category}</Text>
                  <Text style={styles.detailDuration}>{selectedChallenge.duration} days • {selectedChallenge.difficulty}</Text>
                </View>
              </View>
              
              <Text style={styles.detailDescription}>{selectedChallenge.description}</Text>
              
              <View style={styles.detailStats}>
                <View style={styles.detailStat}>
                  <Users size={18} color={colors.accent.primary} />
                  <Text style={styles.detailStatValue}>{selectedChallenge.participants.toLocaleString()}</Text>
                  <Text style={styles.detailStatLabel}>Participants</Text>
                </View>
                <View style={styles.detailStat}>
                  <Award size={18} color={colors.status.warning} />
                  <Text style={styles.detailStatValue}>{selectedChallenge.reward.split(' + ')[1]?.split(' ')[0] || '500'}</Text>
                  <Text style={styles.detailStatLabel}>Points</Text>
                </View>
                <View style={styles.detailStat}>
                  <Star size={18} color={colors.status.success} />
                  <Text style={styles.detailStatValue}>4.8</Text>
                  <Text style={styles.detailStatLabel}>Rating</Text>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Challenge Rules</Text>
                {selectedChallenge.rules.map((rule, index) => (
                  <View key={index} style={styles.ruleItem}>
                    <CheckCircle size={16} color={colors.status.success} />
                    <Text style={styles.ruleText}>{rule}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Daily Tasks</Text>
                {selectedChallenge.dailyTasks.map((task, index) => (
                  <View key={index} style={styles.taskItem}>
                    <Clock size={16} color={colors.accent.primary} />
                    <Text style={styles.taskText}>{task}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.rewardSection}>
                <Trophy size={24} color={colors.status.warning} />
                <Text style={styles.rewardTitle}>Challenge Reward</Text>
                <Text style={styles.rewardText}>{selectedChallenge.reward}</Text>
              </View>
              
              <View style={styles.detailActions}>
                {selectedChallenge.isActive ? (
                  <Button
                    title="Continue Challenge"
                    onPress={() => {
                      setShowChallengeModal(false);
                      router.push('/community/index');
                    }}
                    fullWidth
                    icon={<TrendingUp size={18} color="white" />}
                  />
                ) : (
                  <Button
                    title="Join This Challenge"
                    onPress={() => {
                      setShowChallengeModal(false);
                      joinChallenge(selectedChallenge);
                    }}
                    fullWidth
                    icon={<Plus size={18} color="white" />}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'AI Challenge Generator',
          headerStyle: { backgroundColor: colors.accent.primary },
          headerTintColor: 'white',
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowFilters(true)}>
              <Filter size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personalized Challenges</Text>
        <Text style={styles.headerSubtitle}>
          AI-generated challenges tailored to your goals and preferences
        </Text>
        
        <Button
          title={isGenerating ? 'Generating...' : 'Generate New Challenge'}
          onPress={generateAIChallenge}
          loading={isGenerating}
          disabled={isGenerating}
          fullWidth
          style={styles.generateButton}
          icon={<Sparkles size={18} color="white" />}
        />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={styles.loadingText}>Loading challenges...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.challengesHeader}>
            <Text style={styles.challengesTitle}>Available Challenges</Text>
            <Text style={styles.challengesSubtitle}>
              {challenges.length} challenges available
            </Text>
          </View>
          
          {challenges.map(renderChallengeCard)}
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Want a specific type of challenge? Use the filter button to customize your preferences.
            </Text>
          </View>
        </ScrollView>
      )}
      
      {renderFiltersModal()}
      {renderChallengeModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  generateButton: {
    marginBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  challengesHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  challengesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  challengesSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  challengeCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  challengeCardContent: {
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  challengeType: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  challengeBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.status.warning + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.status.warning,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'capitalize',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  challengeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.secondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: 3,
  },
  challengeActions: {
    marginTop: 8,
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  modalClose: {
    fontSize: 16,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  challengeDetail: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailInfo: {
    flex: 1,
    marginLeft: 12,
  },
  detailCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  detailDuration: {
    fontSize: 14,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  detailDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailStat: {
    alignItems: 'center',
  },
  detailStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 4,
    marginBottom: 2,
  },
  detailStatLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
    lineHeight: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
    lineHeight: 20,
  },
  rewardSection: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  detailActions: {
    marginTop: 16,
  },
});