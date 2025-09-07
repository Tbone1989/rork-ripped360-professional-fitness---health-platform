import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Users,
  Trophy,
  Target,
  MessageCircle,
  TrendingUp,
  Calendar,
  Star,
  Plus,
  File,
  Award,
  Zap,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TabBar } from '@/components/ui/TabBar';
import { Avatar } from '@/components/ui/Avatar';

const { width } = Dimensions.get('window');

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'fitness' | 'nutrition' | 'wellness';
  participants: number;
  duration: string;
  reward: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  startDate: string;
  endDate: string;
  progress?: number;
  isJoined?: boolean;
}

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
  tags: string[];
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Push-Up Challenge',
    description: 'Build upper body strength with progressive push-up training',
    type: 'fitness',
    participants: 1247,
    duration: '30 days',
    reward: 'Exclusive badge + 500 points',
    difficulty: 'intermediate',
    startDate: '2024-01-15',
    endDate: '2024-02-14',
    progress: 65,
    isJoined: true,
  },
  {
    id: '2',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water daily for 2 weeks',
    type: 'wellness',
    participants: 892,
    duration: '14 days',
    reward: 'Wellness badge + 300 points',
    difficulty: 'beginner',
    startDate: '2024-01-20',
    endDate: '2024-02-03',
  },
  {
    id: '3',
    title: 'Plant-Based Week',
    description: 'Try plant-based meals for 7 consecutive days',
    type: 'nutrition',
    participants: 634,
    duration: '7 days',
    reward: 'Nutrition badge + 250 points',
    difficulty: 'intermediate',
    startDate: '2024-01-22',
    endDate: '2024-01-29',
  },
];

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=500',
    content: 'Just completed my first 5K run! 🏃‍♀️ The training program from my coach really paid off. Feeling stronger every day! #FitnessJourney #5K',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000',
    likes: 24,
    comments: 8,
    timestamp: '2 hours ago',
    isLiked: true,
    tags: ['fitness', 'running', 'achievement'],
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Mike Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500',
    content: 'Meal prep Sunday! 🥗 Prepared healthy meals for the entire week. Consistency is key to reaching our goals. What\'s your favorite meal prep recipe?',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000',
    likes: 18,
    comments: 12,
    timestamp: '4 hours ago',
    tags: ['nutrition', 'mealprep', 'healthy'],
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Emily Rodriguez',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=500',
    content: 'Yoga session complete! 🧘‍♀️ 30 minutes of mindfulness and stretching. Remember, fitness isn\'t just about lifting heavy - it\'s about balance.',
    likes: 31,
    comments: 6,
    timestamp: '6 hours ago',
    tags: ['yoga', 'mindfulness', 'balance'],
  },
];

const tabs = [
  { key: 'feed', label: 'Feed' },
  { key: 'challenges', label: 'Challenges' },
  { key: 'leaderboard', label: 'Leaderboard' },
];

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState(mockPosts);
  const [challenges, setChallenges] = useState(mockChallenges);

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          isJoined: !challenge.isJoined,
          participants: challenge.isJoined 
            ? challenge.participants - 1 
            : challenge.participants + 1,
        };
      }
      return challenge;
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return colors.status.success;
      case 'intermediate': return colors.status.warning;
      case 'advanced': return colors.status.error;
      default: return colors.text.secondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fitness': return <Zap size={16} color={colors.accent.primary} />;
      case 'nutrition': return <Target size={16} color={colors.status.success} />;
      case 'wellness': return <Star size={16} color={colors.status.warning} />;
      default: return <Trophy size={16} color={colors.text.secondary} />;
    }
  };

  const renderFeed = () => (
    <View style={styles.tabContent}>
      <Card style={styles.createPostCard}>
        <TouchableOpacity 
          style={styles.createPostButton}
          onPress={() => router.push('/community/create-post')}
        >
          <Avatar
            source="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500"
            size="medium"
          />
          <Text style={styles.createPostText}>Share your fitness journey...</Text>
          <Plus size={20} color={colors.accent.primary} />
        </TouchableOpacity>
      </Card>

      {posts.map((post) => (
        <Card key={post.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <Avatar
              source={post.userAvatar}
              size="medium"
            />
            <View style={styles.postUserInfo}>
              <Text style={styles.postUserName}>{post.userName}</Text>
              <Text style={styles.postTimestamp}>{post.timestamp}</Text>
            </View>
          </View>
          
          <Text style={styles.postContent}>{post.content}</Text>
          
          <View style={styles.postTags}>
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                label={`#${tag}`}
                variant="default"
                size="small"
                style={styles.tagBadge}
              />
            ))}
          </View>
          
          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.postAction}
              onPress={() => handleLikePost(post.id)}
            >
              <Star 
                size={20} 
                color={post.isLiked ? colors.status.warning : colors.text.secondary}
                fill={post.isLiked ? colors.status.warning : 'none'}
              />
              <Text style={styles.postActionText}>{post.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.postAction}
              onPress={() => router.push(`/community/post/${post.id}` as any)}
            >
              <MessageCircle size={20} color={colors.text.secondary} />
              <Text style={styles.postActionText}>{post.comments}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </View>
  );

  const renderChallenges = () => (
    <View style={styles.tabContent}>
      <View style={styles.challengesHeader}>
        <Text style={styles.sectionTitle}>Active Challenges</Text>
        <Button
          title="Create Challenge"
          variant="outline"
          size="small"
          onPress={() => router.push('/community/create-challenge' as any)}
        />
      </View>

      {challenges.map((challenge) => (
        <Card key={challenge.id} style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View style={styles.challengeTypeContainer}>
              {getTypeIcon(challenge.type)}
              <Text style={styles.challengeType}>{challenge.type}</Text>
            </View>
            <Badge
              label={challenge.difficulty}
              variant="default"
              style={{ backgroundColor: getDifficultyColor(challenge.difficulty) }}
            />
          </View>
          
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeDescription}>{challenge.description}</Text>
          
          <View style={styles.challengeStats}>
            <View style={styles.challengeStat}>
              <Users size={16} color={colors.text.secondary} />
              <Text style={styles.challengeStatText}>{challenge.participants} joined</Text>
            </View>
            <View style={styles.challengeStat}>
              <Calendar size={16} color={colors.text.secondary} />
              <Text style={styles.challengeStatText}>{challenge.duration}</Text>
            </View>
          </View>
          
          {challenge.progress !== undefined && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${challenge.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{challenge.progress}% complete</Text>
            </View>
          )}
          
          <View style={styles.challengeReward}>
            <Award size={16} color={colors.status.warning} />
            <Text style={styles.challengeRewardText}>{challenge.reward}</Text>
          </View>
          
          <Button
            title={challenge.isJoined ? 'Leave Challenge' : 'Join Challenge'}
            variant={challenge.isJoined ? 'outline' : 'primary'}
            onPress={() => handleJoinChallenge(challenge.id)}
            style={styles.challengeButton}
          />
        </Card>
      ))}
    </View>
  );

  const renderLeaderboard = () => (
    <View style={styles.tabContent}>
      <Card style={styles.leaderboardCard}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e']}
          style={styles.leaderboardGradient}
        >
          <Text style={styles.leaderboardTitle}>Weekly Leaderboard</Text>
          <Text style={styles.leaderboardSubtitle}>Top performers this week</Text>
        </LinearGradient>
        
        <View style={styles.leaderboardList}>
          {[
            { rank: 1, name: 'Alex Thompson', points: 2450, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500' },
            { rank: 2, name: 'Sarah Johnson', points: 2380, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=500' },
            { rank: 3, name: 'Mike Chen', points: 2290, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500' },
            { rank: 4, name: 'Emily Rodriguez', points: 2180, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=500' },
            { rank: 5, name: 'David Wilson', points: 2050, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500' },
          ].map((user) => (
            <View key={user.rank} style={styles.leaderboardItem}>
              <View style={styles.leaderboardRank}>
                <Text style={[
                  styles.leaderboardRankText,
                  user.rank <= 3 && styles.leaderboardTopRank
                ]}>
                  #{user.rank}
                </Text>
              </View>
              
              <Avatar
                source={user.avatar}
                size="medium"
              />
              
              <View style={styles.leaderboardUserInfo}>
                <Text style={styles.leaderboardUserName}>{user.name}</Text>
                <Text style={styles.leaderboardUserPoints}>{user.points} points</Text>
              </View>
              
              {user.rank <= 3 && (
                <Trophy 
                  size={20} 
                  color={user.rank === 1 ? '#FFD700' : user.rank === 2 ? '#C0C0C0' : '#CD7F32'}
                />
              )}
            </View>
          ))}
        </View>
      </Card>
      
      <Card style={styles.userStatsCard}>
        <Text style={styles.userStatsTitle}>Your Stats</Text>
        <View style={styles.userStatsGrid}>
          <View style={styles.userStat}>
            <Text style={styles.userStatValue}>1,850</Text>
            <Text style={styles.userStatLabel}>Points</Text>
          </View>
          <View style={styles.userStat}>
            <Text style={styles.userStatValue}>#12</Text>
            <Text style={styles.userStatLabel}>Rank</Text>
          </View>
          <View style={styles.userStat}>
            <Text style={styles.userStatValue}>3</Text>
            <Text style={styles.userStatLabel}>Challenges</Text>
          </View>
          <View style={styles.userStat}>
            <Text style={styles.userStatValue}>15</Text>
            <Text style={styles.userStatLabel}>Badges</Text>
          </View>
        </View>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Community',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/community/notifications' as any)}>
              <MessageCircle size={24} color={colors.accent.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <View style={styles.header}>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.tabBar}
        />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'feed' && renderFeed()}
        {activeTab === 'challenges' && renderChallenges()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 16,
    paddingBottom: 0,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tabBar: {
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  createPostCard: {
    marginBottom: 16,
    padding: 0,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  createPostText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.secondary,
  },
  postCard: {
    marginBottom: 16,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  postTimestamp: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  postContent: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: 12,
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: colors.background.tertiary,
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postActionText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  challengesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  challengeCard: {
    marginBottom: 16,
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
    gap: 6,
  },
  challengeType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'capitalize',
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
    marginBottom: 16,
  },
  challengeStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  challengeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  challengeStatText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.secondary,
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'right',
  },
  challengeReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    padding: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  challengeRewardText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  challengeButton: {
    marginTop: 8,
  },
  leaderboardCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  leaderboardGradient: {
    padding: 20,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  leaderboardList: {
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  leaderboardRank: {
    width: 32,
    alignItems: 'center',
  },
  leaderboardRankText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  leaderboardTopRank: {
    color: colors.accent.primary,
  },
  leaderboardUserInfo: {
    flex: 1,
  },
  leaderboardUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  leaderboardUserPoints: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  userStatsCard: {
    padding: 16,
  },
  userStatsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  userStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userStat: {
    alignItems: 'center',
  },
  userStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  userStatLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
});