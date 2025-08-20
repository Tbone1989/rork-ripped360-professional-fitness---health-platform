import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Settings, 
  LogOut, 
  User, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  Shield, 
  ChevronRight,
  Award,
  Calendar,
  Clock,
  Dumbbell,
  Activity,
  Heart,
  Target,
  TrendingUp,
  Zap,
  Users,
  BookOpen,
  Pill,

  AlertTriangle,
  Camera,
  TestTube,
  Trophy,
  ShoppingBag
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { colors } from '@/constants/colors';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import { useMedicalStore } from '@/store/medicalStore';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const updateUser = useUserStore((state) => state.updateUser);
  const { bloodworkResults, medicalProfile } = useMedicalStore();

  // Calculate additional stats
  const weeklyGoalProgress = 0.65; // Mock data
  const monthlyGoalProgress = 0.42; // Mock data
  const totalCoachingSessions = 15; // Mock data
  const activeMedications = 3; // Mock data
  const lastBloodworkDate = bloodworkResults[0]?.date || null;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };



  const handleChangePhoto = () => {
    const options = [
      {
        text: 'Photo Library',
        onPress: () => pickImage('library'),
      },
      {
        text: 'Go to Account Settings',
        onPress: () => router.push('/profile/account'),
      },
      {
        text: 'Cancel',
        style: 'cancel' as const,
      },
    ];

    // Add camera option only on mobile
    if (Platform.OS !== 'web') {
      options.unshift({
        text: 'Camera',
        onPress: () => pickImage('camera'),
      });
    }

    Alert.alert(
      'Change Profile Photo',
      'Choose how you want to update your profile photo',
      options
    );
  };

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      // On web, camera is not supported, so always use library
      if (Platform.OS === 'web' && source === 'camera') {
        Alert.alert('Not supported', 'Camera is not supported on web. Please select from photo library.');
        return;
      }

      // Request permissions (not needed on web)
      if (Platform.OS !== 'web') {
        if (source === 'camera') {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required to take photos.');
            return;
          }
        } else {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Photo library permission is required to select photos.');
            return;
          }
        }
      }

      let result;
      if (source === 'camera' && Platform.OS !== 'web') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        // Update user profile with new image
        updateUser({ profileImageUrl: imageUri });
        Alert.alert('Success', 'Profile photo updated successfully!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update profile photo. Please try again.');
    }
  };

  const menuItems = [
    {
      icon: <User size={20} color={colors.text.secondary} />,
      title: 'Account Settings',
      onPress: () => router.push('/profile/account'),
    },
    {
      icon: <Trophy size={20} color={colors.status.warning} />,
      title: 'Contest Prep',
      onPress: () => router.push('/(tabs)/contest'),
    },
    {
      icon: <ShoppingBag size={20} color={colors.accent.primary} />,
      title: 'Ripped City Store',
      onPress: () => router.push('/(tabs)/shop'),
    },
    {
      icon: <Bell size={20} color={colors.text.secondary} />,
      title: 'Notifications',
      onPress: () => router.push('/profile/notifications'),
    },
    {
      icon: <CreditCard size={20} color={colors.text.secondary} />,
      title: 'Subscription',
      onPress: () => router.push('/profile/subscription'),
      badge: user?.subscription?.plan === 'premium' ? 'Premium' : undefined,
    },
    {
      icon: <HelpCircle size={20} color={colors.text.secondary} />,
      title: 'Help & Support',
      onPress: () => router.push('/profile/support'),
    },
    {
      icon: <Shield size={20} color={colors.text.secondary} />,
      title: 'Privacy & Security',
      onPress: () => router.push('/profile/privacy'),
    },
    {
      icon: <TestTube size={20} color={colors.status.info} />,
      title: 'API Test Suite',
      onPress: () => router.push('/test-apis'),
      isSpecial: true,
    },

  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleChangePhoto} style={styles.avatarContainer}>
            <Avatar
              source={user?.profileImageUrl}
              name={user?.name}
              size="xlarge"
            />
            <View style={styles.cameraOverlay}>
              <Camera size={20} color={colors.text.primary} />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionText}>
                {user?.subscription?.plan === 'premium' ? 'Premium' : 'Free'}
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/profile/settings')}>
          <Settings size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Fitness Overview */}
      <View style={styles.statsSection}>
        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Fitness Overview</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Dumbbell size={18} color={colors.accent.primary} />
              </View>
              <Text style={styles.statValue}>{user?.stats.workoutsCompleted || 0}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Clock size={18} color={colors.status.info} />
              </View>
              <Text style={styles.statValue}>{Math.round((user?.stats.totalWorkoutTime || 0) / 60)}</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Calendar size={18} color={colors.status.success} />
              </View>
              <Text style={styles.statValue}>{user?.stats.streakDays || 0}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Award size={18} color={colors.status.warning} />
              </View>
              <Text style={styles.statValue}>{user?.stats.longestStreak || 0}</Text>
              <Text style={styles.statLabel}>Best</Text>
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <ProgressBar
                progress={weeklyGoalProgress}
                showPercentage
                label="Weekly Goal"
                height={8}
              />
            </View>
            <View style={styles.progressRow}>
              <ProgressBar
                progress={monthlyGoalProgress}
                showPercentage
                label="Monthly Goal"
                height={8}
              />
            </View>
          </View>
        </Card>
      </View>

      {/* Health & Medical Overview */}
      <View style={styles.statsSection}>
        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Health Overview</Text>
          </View>
          
          <View style={styles.healthGrid}>
            <View style={styles.healthItem}>
              <View style={styles.healthIconContainer}>
                <Heart size={16} color={colors.status.error} />
              </View>
              <Text style={styles.healthLabel}>Last Bloodwork</Text>
              <Text style={styles.healthValue}>
                {lastBloodworkDate ? new Date(lastBloodworkDate).toLocaleDateString() : 'Not available'}
              </Text>
            </View>
            
            <View style={styles.healthItem}>
              <View style={styles.healthIconContainer}>
                <Pill size={16} color={colors.accent.secondary} />
              </View>
              <Text style={styles.healthLabel}>Active Medications</Text>
              <Text style={styles.healthValue}>{activeMedications}</Text>
            </View>
            
            <View style={styles.healthItem}>
              <View style={styles.healthIconContainer}>
                <Activity size={16} color={colors.status.success} />
              </View>
              <Text style={styles.healthLabel}>Health Score</Text>
              <Text style={styles.healthValue}>85/100</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Coaching & Progress */}
      <View style={styles.statsSection}>
        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Coaching & Progress</Text>
          </View>
          
          <View style={styles.coachingGrid}>
            <View style={styles.coachingItem}>
              <View style={styles.coachingIconContainer}>
                <Users size={18} color={colors.accent.primary} />
              </View>
              <Text style={styles.coachingValue}>{totalCoachingSessions}</Text>
              <Text style={styles.coachingLabel}>Sessions</Text>
            </View>
            
            <View style={styles.coachingItem}>
              <View style={styles.coachingIconContainer}>
                <Target size={18} color={colors.status.warning} />
              </View>
              <Text style={styles.coachingValue}>3</Text>
              <Text style={styles.coachingLabel}>Active Goals</Text>
            </View>
            
            <View style={styles.coachingItem}>
              <View style={styles.coachingIconContainer}>
                <TrendingUp size={18} color={colors.status.success} />
              </View>
              <Text style={styles.coachingValue}>+12%</Text>
              <Text style={styles.coachingLabel}>Progress</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Achievements */}
      <View style={styles.statsSection}>
        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Recent Achievements</Text>
          </View>
          
          <View style={styles.achievementsList}>
            <View style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Award size={16} color={colors.status.warning} />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>30-Day Streak</Text>
                <Text style={styles.achievementDate}>Completed 2 days ago</Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Zap size={16} color={colors.accent.primary} />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Personal Best</Text>
                <Text style={styles.achievementDate}>Deadlift: 315 lbs</Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <BookOpen size={16} color={colors.status.info} />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Knowledge Seeker</Text>
                <Text style={styles.achievementDate}>Read 10 articles</Text>
              </View>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={[
                styles.menuItemTitle,
                item.isSpecial && { color: colors.accent.primary }
              ]}>{item.title}</Text>
            </View>
            
            <View style={styles.menuItemRight}>
              {item.badge && (
                <View style={styles.menuItemBadge}>
                  <Text style={styles.menuItemBadgeText}>{item.badge}</Text>
                </View>
              )}
              <ChevronRight size={20} color={colors.text.tertiary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutSection}>
        <Button
          title="Log Out"
          variant="outline"
          onPress={handleLogout}
          icon={<LogOut size={18} color={colors.accent.primary} />}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>© 2023 Ripped360. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  subscriptionBadge: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  subscriptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    padding: 16,
  },
  statsCard: {
    padding: 0,
  },
  statsHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  progressSection: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  progressRow: {
    marginBottom: 12,
  },
  healthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  healthItem: {
    alignItems: 'center',
    flex: 1,
  },
  healthIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  healthValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  coachingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  coachingItem: {
    alignItems: 'center',
  },
  coachingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  coachingValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  coachingLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  achievementsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  achievementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  menuSection: {
    padding: 16,
    paddingTop: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemBadge: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  menuItemBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  logoutSection: {
    padding: 16,
    paddingTop: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  version: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
});