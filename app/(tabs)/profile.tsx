import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform, Linking, Image } from 'react-native';
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
  Paperclip,
  AlertTriangle,
  Camera,
  TestTube,
  Trophy,
  ShoppingBag,
  ExternalLink
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

  const showAttachments = user?.role === 'user';
  const menuItems = [
    {
      icon: <User size={20} color={colors.text.secondary} />,
      title: 'Account Settings',
      onPress: () => router.push('/profile/account'),
      testID: 'menu-account-settings',
    },
    ...(showAttachments ? [{
      icon: <Paperclip size={20} color={colors.text.secondary} />,
      title: 'Attachments',
      onPress: () => router.push('/profile/attachments'),
      testID: 'menu-attachments',
    }] as const : []),
    {
      icon: <Trophy size={20} color={colors.status.warning} />,
      title: 'Contest Prep',
      onPress: () => router.push('/(tabs)/contest'),
      testID: 'menu-contest-prep',
    },
    {
      icon: <ShoppingBag size={20} color={colors.accent.primary} />,
      title: 'Ripped City Store',
      onPress: () => router.push('/(tabs)/shop'),
      testID: 'menu-store',
    },
    {
      icon: <Bell size={20} color={colors.text.secondary} />,
      title: 'Notifications',
      onPress: () => router.push('/profile/notifications'),
      testID: 'menu-notifications',
    },
    {
      icon: <CreditCard size={20} color={colors.text.secondary} />,
      title: 'Subscription',
      onPress: () => router.push('/profile/subscription'),
      badge: user?.subscription?.plan === 'premium' ? 'Premium' : undefined,
      testID: 'menu-subscription',
    },
    {
      icon: <HelpCircle size={20} color={colors.text.secondary} />,
      title: 'Help & Support',
      onPress: () => router.push('/profile/support'),
      testID: 'menu-support',
    },
    {
      icon: <Shield size={20} color={colors.text.secondary} />,
      title: 'Privacy & Security',
      onPress: () => router.push('/profile/privacy'),
      testID: 'menu-privacy',
    },
    ...(user?.role === 'admin'
      ? [{
        icon: <TestTube size={20} color={colors.status.info} />,
        title: 'API Test Suite',
        onPress: () => router.push('/test-apis'),
        isSpecial: true as const,
        testID: 'menu-api-tests',
      }] as const
      : []),

  ];

  const openExternal = async (url: string) => {
    try {
      console.log('Opening URL', url);
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert('Unable to open link');
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      console.error('openExternal error', e);
      Alert.alert('Something went wrong opening the link.');
    }
  };

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

      {/* About the Founder */}
      <View style={styles.statsSection}>
        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>About the Founder</Text>
          </View>

          <View style={styles.founderContainer}>
            <View style={styles.logoWrap}>
              <View style={styles.logoBg}>
                <Image
                  source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8noce6pnnzgzdwl870mr3' }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.founderContent}>
              <Text style={styles.founderTitle}>Ripped City Inc. Mission</Text>
              <Text style={styles.founderTagline}>"Born from Rock Bottom, Built for Champions"</Text>
              <Text style={styles.founderText}>
                Ripped City Inc. was founded by Tyrone Hayes after a life-changing transformation from 338 pounds to a champion mindset.
                With the support of mentors Mark Alvisi and Duveuil Valcena, he lost 97 pounds in 12 months and discovered a profound truth:
                "It's better to suffer in the gym than suffer in the hospital." We build for athletes who demand more—through daily commitment,
                resilience, and community support.
              </Text>
              <View style={styles.ctaRow}>
                <Button
                  title="Shop Collection"
                  onPress={() => router.push('/(tabs)/shop')}
                  testID="rci-shop-button"
                />
              </View>

              <Text style={[styles.founderTitle, { marginTop: 12 }]}>Digesting Life Balance Mission</Text>
              <Text style={styles.founderTagline}>"From Personal Struggle to Community Healing"</Text>
              <Text style={styles.founderText}>
                Digesting Life Balance was born from firsthand experience with the devastating effects of poor nutrition and emotional eating.
                Our nonprofit raises awareness about obesity while mobilizing communities toward healthier eating and social diversity. Our mission:
                to break cycles of unhealthy eating by providing education, resources, and community support that address the whole person—mind, body, and spirit.
              </Text>

              <View style={styles.linkRow}>
                <TouchableOpacity
                  onPress={() => openExternal('https://facebook.com/profile.php?id=100029187646814')}
                  style={styles.linkButton}
                  testID="dlb-facebook-link"
                >
                  <ExternalLink size={16} color={colors.text.primary} />
                  <Text style={styles.linkLabel}>Learn More</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openExternal('https://zeffy.com/en-US/donation-form/e41efe15-414a-4aaa-be55-0376ff88a404')}
                  style={[styles.linkButton, styles.linkPrimary]}
                  testID="dlb-donate-link"
                >
                  <ExternalLink size={16} color={colors.text.primary} />
                  <Text style={styles.linkLabel}>Donate</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.quote}>
                "Better to suffer in the gym than suffer in the hospital"
              </Text>
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
            testID={item.testID ?? `menu-item-${index}`}
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
  founderContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12 as unknown as number,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoBg: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 64,
    height: 64,
  },
  founderContent: {
    flex: 1,
  },
  founderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  founderText: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  founderTagline: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 2,
  },
  quote: {
    marginTop: 8,
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.text.secondary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as unknown as number,
    marginTop: 4,
    marginBottom: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.background.tertiary,
    marginRight: 8,
  },
  linkPrimary: {
    backgroundColor: colors.accent.primary,
  },
  linkLabel: {
    marginLeft: 6,
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  mission: {
    fontSize: 13,
    color: colors.text.secondary,
  },
});