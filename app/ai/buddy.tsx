import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import {
  Users,
  MessageCircle,
  Star,
  MapPin,
  Clock,
  Dumbbell,
  Target,
  Filter,
  Search,
  Heart,
  UserPlus,
  Calendar,
  Trophy,
  Zap,
  CheckCircle,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/ChipGroup';

interface WorkoutPartner {
  id: string;
  name: string;
  avatar: string;
  age: number;
  location: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  workoutTimes: string[];
  rating: number;
  matchPercentage: number;
  bio: string;
  workoutTypes: string[];
  isOnline: boolean;
  lastActive: string;
  mutualConnections: number;
  completedWorkouts: number;
}

interface MatchPreferences {
  fitnessLevel: string[];
  goals: string[];
  workoutTimes: string[];
  location: string;
  maxDistance: number;
}

export default function AIWorkoutPartnerScreen() {
  const [partners, setPartners] = useState<WorkoutPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<WorkoutPartner | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [isGeneratingMatches, setIsGeneratingMatches] = useState(false);
  const [preferences, setPreferences] = useState<MatchPreferences>({
    fitnessLevel: ['intermediate'],
    goals: ['strength'],
    workoutTimes: ['morning'],
    location: 'New York, NY',
    maxDistance: 10,
  });

  const fitnessLevelOptions = [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const goalOptions = [
    { id: 'strength', label: 'Strength' },
    { id: 'hypertrophy', label: 'Muscle Growth' },
    { id: 'endurance', label: 'Endurance' },
    { id: 'fat-loss', label: 'Fat Loss' },
    { id: 'yoga', label: 'Yoga' },
    { id: 'general', label: 'General Fitness' },
  ];

  const timeOptions = [
    { id: 'early-morning', label: 'Early Morning (5-7 AM)' },
    { id: 'morning', label: 'Morning (7-10 AM)' },
    { id: 'midday', label: 'Midday (10 AM-2 PM)' },
    { id: 'afternoon', label: 'Afternoon (2-6 PM)' },
    { id: 'evening', label: 'Evening (6-9 PM)' },
    { id: 'night', label: 'Night (9+ PM)' },
  ];

  useEffect(() => {
    generateMatches();
  }, []);

  const generateMatches = async () => {
    setIsGeneratingMatches(true);
    setIsLoading(true);
    
    try {
      // Simulate AI matching with realistic data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPartners: WorkoutPartner[] = [
        {
          id: '1',
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          age: 28,
          location: 'Manhattan, NY',
          fitnessLevel: 'intermediate',
          goals: ['strength', 'hypertrophy'],
          workoutTimes: ['morning', 'evening'],
          rating: 4.8,
          matchPercentage: 95,
          bio: 'Passionate about powerlifting and helping others reach their goals. Looking for a consistent workout partner!',
          workoutTypes: ['Strength Training', 'Powerlifting'],
          isOnline: true,
          lastActive: 'Active now',
          mutualConnections: 3,
          completedWorkouts: 127,
        },
        {
          id: '2',
          name: 'Mike Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          age: 32,
          location: 'Brooklyn, NY',
          fitnessLevel: 'advanced',
          goals: ['strength', 'endurance'],
          workoutTimes: ['morning'],
          rating: 4.9,
          matchPercentage: 88,
          bio: 'CrossFit athlete and personal trainer. Love pushing limits and motivating others!',
          workoutTypes: ['CrossFit', 'HIIT', 'Strength'],
          isOnline: false,
          lastActive: '2 hours ago',
          mutualConnections: 1,
          completedWorkouts: 203,
        },
        {
          id: '3',
          name: 'Emma Johnson',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          age: 25,
          location: 'Queens, NY',
          fitnessLevel: 'intermediate',
          goals: ['fat-loss', 'endurance'],
          workoutTimes: ['evening'],
          rating: 4.7,
          matchPercentage: 82,
          bio: 'Running enthusiast transitioning to strength training. Looking for guidance and motivation!',
          workoutTypes: ['Running', 'Cardio', 'Strength'],
          isOnline: true,
          lastActive: 'Active now',
          mutualConnections: 2,
          completedWorkouts: 89,
        },
        {
          id: '4',
          name: 'Alex Kim',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          age: 29,
          location: 'Manhattan, NY',
          fitnessLevel: 'intermediate',
          goals: ['hypertrophy', 'general'],
          workoutTimes: ['afternoon', 'evening'],
          rating: 4.6,
          matchPercentage: 79,
          bio: 'Bodybuilding enthusiast who loves trying new workout routines. Always up for a challenge!',
          workoutTypes: ['Bodybuilding', 'Hypertrophy'],
          isOnline: false,
          lastActive: '1 day ago',
          mutualConnections: 0,
          completedWorkouts: 156,
        },
      ];
      
      setPartners(mockPartners);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate matches. Please try again.');
    } finally {
      setIsLoading(false);
      setIsGeneratingMatches(false);
    }
  };

  const handleConnect = (partner: WorkoutPartner) => {
    Alert.alert(
      'Send Connection Request',
      `Send a workout partner request to ${partner.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: () => {
            Alert.alert('Request Sent!', `Your connection request has been sent to ${partner.name}`);
          },
        },
      ]
    );
  };

  const handleMessage = (partner: WorkoutPartner) => {
    Alert.alert(
      'Start Conversation',
      `Start a conversation with ${partner.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Message',
          onPress: () => {
            router.push('/coaching');
          },
        },
      ]
    );
  };

  const getFitnessLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return colors.status.success;
      case 'intermediate': return colors.status.warning;
      case 'advanced': return colors.status.error;
      default: return colors.text.secondary;
    }
  };

  const renderPartnerCard = (partner: WorkoutPartner) => (
    <TouchableOpacity
      key={partner.id}
      style={styles.partnerCard}
      onPress={() => {
        setSelectedPartner(partner);
        setShowPartnerModal(true);
      }}
    >
      <Card style={styles.partnerCardContent}>
        <View style={styles.partnerHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: partner.avatar }} style={styles.avatar} />
            <View style={[styles.onlineIndicator, { backgroundColor: partner.isOnline ? '#4CAF50' : '#999' }]} />
          </View>
          
          <View style={styles.partnerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <View style={styles.matchBadge}>
                <Text style={styles.matchPercentage}>{partner.matchPercentage}%</Text>
              </View>
            </View>
            
            <View style={styles.partnerMeta}>
              <Text style={styles.partnerAge}>{partner.age} years old</Text>
              <Text style={styles.separator}>•</Text>
              <View style={styles.locationContainer}>
                <MapPin size={12} color={colors.text.secondary} />
                <Text style={styles.partnerLocation}>{partner.location}</Text>
              </View>
            </View>
            
            <View style={styles.fitnessLevel}>
              <View style={[styles.levelBadge, { backgroundColor: getFitnessLevelColor(partner.fitnessLevel) }]}>
                <Text style={styles.levelText}>{partner.fitnessLevel}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Star size={12} color={colors.status.warning} fill={colors.status.warning} />
                <Text style={styles.rating}>{partner.rating}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <Text style={styles.partnerBio} numberOfLines={2}>{partner.bio}</Text>
        
        <View style={styles.workoutTypes}>
          {partner.workoutTypes.slice(0, 2).map((type, index) => (
            <View key={index} style={styles.workoutTypeChip}>
              <Text style={styles.workoutTypeText}>{type}</Text>
            </View>
          ))}
          {partner.workoutTypes.length > 2 && (
            <Text style={styles.moreTypes}>+{partner.workoutTypes.length - 2} more</Text>
          )}
        </View>
        
        <View style={styles.partnerStats}>
          <View style={styles.stat}>
            <Trophy size={14} color={colors.text.secondary} />
            <Text style={styles.statText}>{partner.completedWorkouts} workouts</Text>
          </View>
          <View style={styles.stat}>
            <Users size={14} color={colors.text.secondary} />
            <Text style={styles.statText}>{partner.mutualConnections} mutual</Text>
          </View>
          <View style={styles.stat}>
            <Clock size={14} color={colors.text.secondary} />
            <Text style={styles.statText}>{partner.lastActive}</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <Button
            title="Connect"
            variant="primary"
            size="small"
            onPress={() => handleConnect(partner)}
            style={styles.connectButton}
            icon={<UserPlus size={16} color="white" />}
          />
          <Button
            title="Message"
            variant="outline"
            size="small"
            onPress={() => handleMessage(partner)}
            style={styles.messageButton}
            icon={<MessageCircle size={16} color={colors.accent.primary} />}
          />
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
          <Text style={styles.modalTitle}>Match Preferences</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.modalClose}>Done</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Fitness Level</Text>
            <ChipGroup
              options={fitnessLevelOptions}
              selectedIds={preferences.fitnessLevel}
              onChange={(selected) => setPreferences(prev => ({ ...prev, fitnessLevel: selected }))}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Goals</Text>
            <ChipGroup
              options={goalOptions}
              selectedIds={preferences.goals}
              onChange={(selected) => setPreferences(prev => ({ ...prev, goals: selected }))}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Preferred Workout Times</Text>
            <ChipGroup
              options={timeOptions}
              selectedIds={preferences.workoutTimes}
              onChange={(selected) => setPreferences(prev => ({ ...prev, workoutTimes: selected }))}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Location</Text>
            <TextInput
              style={styles.locationInput}
              value={preferences.location}
              onChangeText={(text) => setPreferences(prev => ({ ...prev, location: text }))}
              placeholder="Enter your location"
            />
          </View>
          
          <Button
            title="Apply Filters & Find Matches"
            onPress={() => {
              setShowFilters(false);
              generateMatches();
            }}
            fullWidth
            style={styles.applyButton}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderPartnerModal = () => (
    <Modal
      visible={showPartnerModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowPartnerModal(false)}
    >
      {selectedPartner && (
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedPartner.name}</Text>
            <TouchableOpacity onPress={() => setShowPartnerModal(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.partnerProfile}>
              <View style={styles.profileHeader}>
                <Image source={{ uri: selectedPartner.avatar }} style={styles.profileAvatar} />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{selectedPartner.name}</Text>
                  <Text style={styles.profileAge}>{selectedPartner.age} years old</Text>
                  <View style={styles.profileLocation}>
                    <MapPin size={16} color={colors.text.secondary} />
                    <Text style={styles.profileLocationText}>{selectedPartner.location}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.profileStats}>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatValue}>{selectedPartner.matchPercentage}%</Text>
                  <Text style={styles.profileStatLabel}>Match</Text>
                </View>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatValue}>{selectedPartner.rating}</Text>
                  <Text style={styles.profileStatLabel}>Rating</Text>
                </View>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatValue}>{selectedPartner.completedWorkouts}</Text>
                  <Text style={styles.profileStatLabel}>Workouts</Text>
                </View>
              </View>
              
              <Text style={styles.profileBio}>{selectedPartner.bio}</Text>
              
              <View style={styles.profileSection}>
                <Text style={styles.profileSectionTitle}>Workout Types</Text>
                <View style={styles.profileChips}>
                  {selectedPartner.workoutTypes.map((type, index) => (
                    <View key={index} style={styles.profileChip}>
                      <Text style={styles.profileChipText}>{type}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.profileSection}>
                <Text style={styles.profileSectionTitle}>Goals</Text>
                <View style={styles.profileChips}>
                  {selectedPartner.goals.map((goal, index) => (
                    <View key={index} style={styles.profileChip}>
                      <Text style={styles.profileChipText}>{goal}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.profileActions}>
                <Button
                  title="Send Connection Request"
                  onPress={() => {
                    setShowPartnerModal(false);
                    handleConnect(selectedPartner);
                  }}
                  fullWidth
                  style={styles.profileActionButton}
                  icon={<UserPlus size={18} color="white" />}
                />
                <Button
                  title="Start Conversation"
                  variant="outline"
                  onPress={() => {
                    setShowPartnerModal(false);
                    handleMessage(selectedPartner);
                  }}
                  fullWidth
                  style={styles.profileActionButton}
                  icon={<MessageCircle size={18} color={colors.accent.primary} />}
                />
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
          title: 'AI Workout Partner',
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
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workout partners..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.headerActions}>
          <Button
            title="Find New Matches"
            variant="primary"
            size="small"
            onPress={generateMatches}
            loading={isGeneratingMatches}
            icon={<Zap size={16} color="white" />}
          />
        </View>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={styles.loadingText}>Finding your perfect workout partners...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.matchesHeader}>
            <Text style={styles.matchesTitle}>Your Matches</Text>
            <Text style={styles.matchesSubtitle}>
              {partners.length} potential workout partners found
            </Text>
          </View>
          
          {partners.map(renderPartnerCard)}
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Can't find the right partner? Adjust your preferences or try again later.
            </Text>
          </View>
        </ScrollView>
      )}
      
      {renderFiltersModal()}
      {renderPartnerModal()}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text.primary,
  },
  headerActions: {
    alignItems: 'center',
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
  matchesHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  matchesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  matchesSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  partnerCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  partnerCardContent: {
    padding: 16,
  },
  partnerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  partnerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  matchBadge: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  partnerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  partnerAge: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  separator: {
    marginHorizontal: 8,
    color: colors.text.secondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerLocation: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  fitnessLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 4,
  },
  partnerBio: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  workoutTypes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutTypeChip: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  workoutTypeText: {
    fontSize: 12,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  moreTypes: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  partnerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  connectButton: {
    flex: 1,
  },
  messageButton: {
    flex: 1,
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
  locationInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text.primary,
  },
  applyButton: {
    marginTop: 16,
  },
  partnerProfile: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileAge: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  profileLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLocationText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent.primary,
    marginBottom: 4,
  },
  profileStatLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  profileBio: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  profileSection: {
    marginBottom: 24,
  },
  profileSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  profileChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  profileChip: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  profileChipText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  profileActions: {
    gap: 12,
    marginTop: 24,
  },
  profileActionButton: {
    marginBottom: 0,
  },
});