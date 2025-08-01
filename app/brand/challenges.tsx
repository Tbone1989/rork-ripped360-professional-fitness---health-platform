import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Trophy, Users, Calendar, Star, Lock, CheckCircle } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useBrandStore } from '@/store/brandStore';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { Challenge } from '@/types/brand';

const challengeTypes = [
  { id: 'all', label: 'All Challenges' },
  { id: 'workout', label: 'Workout' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'contest', label: 'Contest Prep' },
  { id: 'lifestyle', label: 'Lifestyle' },
];

const difficultyColors = {
  beginner: colors.status.success,
  intermediate: colors.status.warning,
  advanced: colors.accent.primary,
};

export default function ChallengesScreen() {
  const {
    challenges,
    userChallenges,
    userMembership,
    joinChallenge,
    leaveChallenge,
    canAccessChallenge,
  } = useBrandStore();
  const user = useUserStore((state) => state.user);
  
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showMyChallenge, setShowMyChallenges] = useState(false);
  
  const filteredChallenges = challenges.filter(challenge => {
    if (showMyChallenge && !userChallenges.includes(challenge.id)) return false;
    if (selectedType === 'all') return true;
    return challenge.type === selectedType;
  });
  
  const handleJoinChallenge = (challenge: Challenge) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to join challenges.');
      return;
    }
    
    if (!canAccessChallenge(challenge)) {
      Alert.alert(
        'Membership Required',
        'This challenge requires an active membership. Upgrade to access exclusive challenges.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Plans', onPress: () => router.push('/brand/membership') }
        ]
      );
      return;
    }
    
    if (challenge.maxParticipants && challenge.participants >= challenge.maxParticipants) {
      Alert.alert('Challenge Full', 'This challenge has reached maximum capacity.');
      return;
    }
    
    joinChallenge(challenge.id);
    Alert.alert('Success!', `You've joined the ${challenge.title} challenge!`);
  };
  
  const handleLeaveChallenge = (challengeId: string) => {
    Alert.alert(
      'Leave Challenge',
      'Are you sure you want to leave this challenge? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => leaveChallenge(challengeId) }
      ]
    );
  };
  
  const renderChallenge = (challenge: Challenge) => {
    const isJoined = userChallenges.includes(challenge.id);
    const canAccess = canAccessChallenge(challenge);
    const isFull = challenge.maxParticipants && challenge.participants >= challenge.maxParticipants;
    
    return (
      <Card key={challenge.id} style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <Image source={{ uri: challenge.image }} style={styles.challengeImage} />
          <View style={styles.challengeOverlay}>
            {challenge.featured && (
              <Badge label="Featured" variant="error" style={styles.featuredBadge} />
            )}
            {!canAccess && (
              <View style={styles.lockBadge}>
                <Lock size={12} color={colors.text.primary} />
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.challengeContent}>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDescription} numberOfLines={2}>
              {challenge.description}
            </Text>
            
            <View style={styles.challengeMeta}>
              <View style={styles.metaItem}>
                <Calendar size={14} color={colors.text.secondary} />
                <Text style={styles.metaText}>{challenge.duration} days</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Users size={14} color={colors.text.secondary} />
                <Text style={styles.metaText}>
                  {challenge.participants}
                  {challenge.maxParticipants && `/${challenge.maxParticipants}`}
                </Text>
              </View>
              
              <Badge
                label={challenge.difficulty}
                style={[styles.difficultyBadge, { backgroundColor: difficultyColors[challenge.difficulty] + '20' }]}
                textStyle={{ color: difficultyColors[challenge.difficulty] }}
              />
            </View>
            
            {challenge.rewards.length > 0 && (
              <View style={styles.rewardsSection}>
                <Text style={styles.rewardsTitle}>Rewards:</Text>
                {challenge.rewards.slice(0, 2).map((reward, index) => (
                  <Text key={index} style={styles.rewardText}>
                    • {reward.description}
                  </Text>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.challengeActions}>
            {isJoined ? (
              <View style={styles.joinedContainer}>
                <View style={styles.joinedIndicator}>
                  <CheckCircle size={16} color={colors.status.success} />
                  <Text style={styles.joinedText}>Joined</Text>
                </View>
                <Button
                  title="Leave"
                  variant="outline"
                  size="small"
                  onPress={() => handleLeaveChallenge(challenge.id)}
                  style={styles.leaveButton}
                />
              </View>
            ) : (
              <Button
                title={!canAccess ? 'Upgrade Required' : isFull ? 'Full' : 'Join Challenge'}
                onPress={() => handleJoinChallenge(challenge)}
                disabled={!canAccess || isFull}
                style={styles.joinButton}
              />
            )}
          </View>
        </View>
      </Card>
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Member Challenges',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/brand/membership')}>
              <Trophy size={24} color={colors.accent.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Exclusive Challenges</Text>
          <Text style={styles.headerSubtitle}>
            Join member-only challenges and earn exclusive rewards
          </Text>
          
          {userMembership && (
            <View style={styles.membershipBadge}>
              <Badge
                label={userMembership.tier.name}
                style={[styles.tierBadge, { backgroundColor: userMembership.tier.color + '20' }]}
                textStyle={{ color: userMembership.tier.color }}
              />
            </View>
          )}
        </View>
        
        {/* Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterTitle}>Filter by Type</Text>
          <ChipGroup
            options={challengeTypes}
            selectedIds={[selectedType]}
            onChange={(ids) => setSelectedType(ids[0])}
            multiSelect={false}
            style={styles.typeChips}
          />
          
          <TouchableOpacity
            style={styles.myChallenge}
            onPress={() => setShowMyChallenges(!showMyChallenge)}
          >
            <Text style={[styles.myChallengesText, showMyChallenge && styles.myChallengesActive]}>
              {showMyChallenge ? 'Show All' : 'My Challenges Only'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Challenges List */}
        <View style={styles.challengesList}>
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map(renderChallenge)
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {showMyChallenge ? 'No joined challenges found' : 'No challenges found'}
              </Text>
              {!userMembership && (
                <Button
                  title="Upgrade Membership"
                  onPress={() => router.push('/brand/membership')}
                  style={styles.upgradeButton}
                />
              )}
            </Card>
          )}
        </View>
      </ScrollView>
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  membershipBadge: {
    marginTop: 16,
  },
  tierBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filtersSection: {
    padding: 20,
    paddingTop: 0,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  typeChips: {
    marginBottom: 16,
  },
  myChallenge: {
    alignSelf: 'flex-start',
  },
  myChallengesText: {
    fontSize: 14,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
  myChallengesActive: {
    color: colors.accent.primary,
  },
  challengesList: {
    padding: 20,
    paddingTop: 0,
  },
  challengeCard: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  challengeHeader: {
    position: 'relative',
  },
  challengeImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  challengeOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
  },
  lockBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 6,
  },
  challengeContent: {
    padding: 16,
  },
  challengeInfo: {
    marginBottom: 16,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rewardsSection: {
    marginTop: 8,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  challengeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  joinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  joinedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  joinedText: {
    fontSize: 14,
    color: colors.status.success,
    fontWeight: '600',
  },
  leaveButton: {
    paddingHorizontal: 16,
  },
  joinButton: {
    paddingHorizontal: 20,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    paddingHorizontal: 24,
  },
});