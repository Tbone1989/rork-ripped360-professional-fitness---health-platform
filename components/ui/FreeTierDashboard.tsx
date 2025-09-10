import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Share,
  Alert
} from 'react-native';
import {
  Gift,
  Star,
  Trophy,
  Users,
  Lock,
  Unlock,
  ChevronRight,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Award,
  Calendar,
  MessageCircle,
  Dumbbell,
  Brain,
  Utensils,
  Pill
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useFreeTierStore } from '@/store/freeTierStore';
import { useUserStore } from '@/store/userStore';

interface FreeTierDashboardProps {
  onUpgrade?: () => void;
}

export function FreeTierDashboard({ onUpgrade }: FreeTierDashboardProps) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const {
    currentStreak,
    dailyRewards,
    points,
    achievements,
    limits,
    trialFeatures,
    referralCode,
    referrals,
    checkIn,
    loadData,
    useFeature
  } = useFreeTierStore();

  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showLimitsModal, setShowLimitsModal] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  useEffect(() => {
    loadData();
    checkTodayCheckIn();
  }, []);

  const checkTodayCheckIn = () => {
    const today = new Date().toDateString();
    const lastCheckIn = useFreeTierStore.getState().lastCheckIn;
    setHasCheckedIn(lastCheckIn === today);
  };

  const handleCheckIn = async () => {
    await checkIn();
    setHasCheckedIn(true);
    Alert.alert(
      '✅ Checked In!',
      `Streak: ${currentStreak + 1} days\nReward claimed!`,
      [{ text: 'Awesome!' }]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on Ripped360! Use my code ${referralCode} for bonus rewards. Download: https://ripped360.app/invite/${referralCode}`,
        title: 'Join Ripped360'
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'workouts': return <Dumbbell size={16} color={colors.text.secondary} />;
      case 'ai': return <Brain size={16} color={colors.text.secondary} />;
      case 'meals': return <Utensils size={16} color={colors.text.secondary} />;
      case 'supplements': return <Pill size={16} color={colors.text.secondary} />;
      case 'coach': return <MessageCircle size={16} color={colors.text.secondary} />;
      default: return <Zap size={16} color={colors.text.secondary} />;
    }
  };

  const activeTrials = trialFeatures.filter(
    t => new Date(t.expiresAt) > new Date() && !t.used
  );

  return (
    <View style={styles.container}>
      {/* Daily Check-in Card */}
      <Card style={styles.checkInCard}>
        <View style={styles.checkInHeader}>
          <View style={styles.streakContainer}>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
          <View style={styles.checkInContent}>
            <Text style={styles.checkInTitle}>Daily Check-in</Text>
            <Text style={styles.checkInSubtitle}>
              {hasCheckedIn ? 'See you tomorrow!' : 'Claim your reward'}
            </Text>
            {!hasCheckedIn && (
              <TouchableOpacity
                style={styles.checkInButton}
                onPress={handleCheckIn}
              >
                <Calendar size={20} color={colors.text.primary} />
                <Text style={styles.checkInButtonText}>Check In</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.viewRewardsButton}
          onPress={() => setShowRewardsModal(true)}
        >
          <Gift size={16} color={colors.accent.primary} />
          <Text style={styles.viewRewardsText}>View Rewards Calendar</Text>
          <ChevronRight size={16} color={colors.accent.primary} />
        </TouchableOpacity>
      </Card>

      {/* Points & Progress */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Star size={20} color={colors.status.warning} />
          <Text style={styles.statNumber}>{points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Trophy size={20} color={colors.accent.primary} />
          <Text style={styles.statNumber}>
            {achievements.filter(a => a.completed).length}/{achievements.length}
          </Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Users size={20} color={colors.status.success} />
          <Text style={styles.statNumber}>{referrals}</Text>
          <Text style={styles.statLabel}>Referrals</Text>
        </Card>
      </View>

      {/* Usage Limits */}
      <Card style={styles.limitsCard}>
        <TouchableOpacity
          style={styles.limitsHeader}
          onPress={() => setShowLimitsModal(true)}
        >
          <View style={styles.limitsTitle}>
            <Zap size={18} color={colors.accent.primary} />
            <Text style={styles.limitsTitleText}>Today's Limits</Text>
          </View>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
        
        <View style={styles.limitsGrid}>
          <View style={styles.limitItem}>
            <Dumbbell size={14} color={colors.text.secondary} />
            <Text style={styles.limitText}>
              {limits.workoutsPerWeek - limits.workoutsUsed}/{limits.workoutsPerWeek} workouts
            </Text>
          </View>
          <View style={styles.limitItem}>
            <Brain size={14} color={colors.text.secondary} />
            <Text style={styles.limitText}>
              {limits.aiRequestsPerDay - limits.aiRequestsUsed}/{limits.aiRequestsPerDay} AI
            </Text>
          </View>
        </View>
      </Card>

      {/* Active Trials */}
      {activeTrials.length > 0 && (
        <Card style={styles.trialsCard}>
          <View style={styles.trialsHeader}>
            <Unlock size={18} color={colors.status.success} />
            <Text style={styles.trialsTitle}>Active Trials</Text>
          </View>
          {activeTrials.map((trial, index) => {
            const daysLeft = Math.ceil(
              (new Date(trial.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            return (
              <View key={index} style={styles.trialItem}>
                <Text style={styles.trialName}>{trial.feature}</Text>
                <Text style={styles.trialExpiry}>{daysLeft} days left</Text>
              </View>
            );
          })}
        </Card>
      )}

      {/* Share & Earn */}
      <Card style={styles.referralCard}>
        <View style={styles.referralContent}>
          <View>
            <Text style={styles.referralTitle}>Invite Friends</Text>
            <Text style={styles.referralSubtitle}>Earn rewards together</Text>
            <Text style={styles.referralCode}>Code: {referralCode}</Text>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Users size={20} color={colors.text.primary} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Upgrade CTA */}
      <TouchableOpacity
        style={styles.upgradeCard}
        onPress={onUpgrade || (() => router.push('/profile/subscription'))}
      >
        <View style={styles.upgradeContent}>
          <View style={styles.upgradeIcon}>
            <Lock size={20} color={colors.text.primary} />
          </View>
          <View style={styles.upgradeText}>
            <Text style={styles.upgradeTitle}>Unlock Full Potential</Text>
            <Text style={styles.upgradeSubtitle}>
              Unlimited access to all features
            </Text>
          </View>
          <ChevronRight size={20} color={colors.text.primary} />
        </View>
      </TouchableOpacity>

      {/* Rewards Modal */}
      <Modal
        visible={showRewardsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRewardsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>7-Day Rewards</Text>
            <ScrollView style={styles.rewardsList}>
              {dailyRewards.map((reward, index) => (
                <View
                  key={index}
                  style={[
                    styles.rewardItem,
                    reward.claimed && styles.rewardItemClaimed
                  ]}
                >
                  <View style={styles.rewardDay}>
                    <Text style={styles.rewardDayText}>Day {reward.day}</Text>
                    {reward.claimed && <Text style={styles.claimedBadge}>✓</Text>}
                  </View>
                  <View style={styles.rewardInfo}>
                    <Text style={styles.rewardIcon}>{reward.icon}</Text>
                    <Text style={styles.rewardText}>{reward.reward}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <Button
              title="Close"
              onPress={() => setShowRewardsModal(false)}
              variant="secondary"
            />
          </View>
        </View>
      </Modal>

      {/* Limits Modal */}
      <Modal
        visible={showLimitsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLimitsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Free Plan Limits</Text>
            <ScrollView style={styles.limitsList}>
              <View style={styles.limitDetailItem}>
                <Dumbbell size={20} color={colors.text.secondary} />
                <View style={styles.limitDetailInfo}>
                  <Text style={styles.limitDetailTitle}>Workouts</Text>
                  <Text style={styles.limitDetailText}>
                    {limits.workoutsUsed}/{limits.workoutsPerWeek} this week
                  </Text>
                  <ProgressBar
                    progress={limits.workoutsUsed / limits.workoutsPerWeek}
                    style={styles.limitProgress}
                  />
                </View>
              </View>
              
              <View style={styles.limitDetailItem}>
                <Brain size={20} color={colors.text.secondary} />
                <View style={styles.limitDetailInfo}>
                  <Text style={styles.limitDetailTitle}>AI Requests</Text>
                  <Text style={styles.limitDetailText}>
                    {limits.aiRequestsUsed}/{limits.aiRequestsPerDay} today
                  </Text>
                  <ProgressBar
                    progress={limits.aiRequestsUsed / limits.aiRequestsPerDay}
                    style={styles.limitProgress}
                  />
                </View>
              </View>
              
              <View style={styles.limitDetailItem}>
                <MessageCircle size={20} color={colors.text.secondary} />
                <View style={styles.limitDetailInfo}>
                  <Text style={styles.limitDetailTitle}>Coach Messages</Text>
                  <Text style={styles.limitDetailText}>
                    {limits.coachMessagesUsed}/{limits.coachMessagesPerMonth} this month
                  </Text>
                  <ProgressBar
                    progress={limits.coachMessagesUsed / limits.coachMessagesPerMonth}
                    style={styles.limitProgress}
                  />
                </View>
              </View>
              
              <View style={styles.limitDetailItem}>
                <Utensils size={20} color={colors.text.secondary} />
                <View style={styles.limitDetailInfo}>
                  <Text style={styles.limitDetailTitle}>Meal Plans</Text>
                  <Text style={styles.limitDetailText}>
                    {limits.mealPlansUsed}/{limits.mealPlansPerWeek} this week
                  </Text>
                  <ProgressBar
                    progress={limits.mealPlansUsed / limits.mealPlansPerWeek}
                    style={styles.limitProgress}
                  />
                </View>
              </View>
              
              <View style={styles.limitDetailItem}>
                <Pill size={20} color={colors.text.secondary} />
                <View style={styles.limitDetailInfo}>
                  <Text style={styles.limitDetailTitle}>Supplement Scans</Text>
                  <Text style={styles.limitDetailText}>
                    {limits.supplementScansUsed}/{limits.supplementScansPerDay} today
                  </Text>
                  <ProgressBar
                    progress={limits.supplementScansUsed / limits.supplementScansPerDay}
                    style={styles.limitProgress}
                  />
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <Button
                title="Upgrade for Unlimited"
                onPress={() => {
                  setShowLimitsModal(false);
                  router.push('/profile/subscription');
                }}
                variant="primary"
              />
              <Button
                title="Close"
                onPress={() => setShowLimitsModal(false)}
                variant="secondary"
                style={styles.closeButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  checkInCard: {
    padding: 16,
  },
  checkInHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  streakContainer: {
    backgroundColor: colors.accent.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  streakLabel: {
    fontSize: 10,
    color: colors.text.primary,
    marginTop: 2,
  },
  checkInContent: {
    flex: 1,
    justifyContent: 'center',
  },
  checkInTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  checkInSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.status.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  checkInButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  viewRewardsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  viewRewardsText: {
    flex: 1,
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  limitsCard: {
    padding: 16,
  },
  limitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  limitsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  limitsTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  limitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  limitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  limitText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  trialsCard: {
    padding: 16,
  },
  trialsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  trialsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  trialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  trialName: {
    fontSize: 14,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  trialExpiry: {
    fontSize: 12,
    color: colors.status.success,
  },
  referralCard: {
    padding: 16,
  },
  referralContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referralTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  referralSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  referralCode: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  upgradeCard: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  upgradeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeText: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  rewardsList: {
    marginBottom: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.background.secondary,
  },
  rewardItemClaimed: {
    opacity: 0.6,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  rewardDay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  claimedBadge: {
    fontSize: 16,
    color: colors.status.success,
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardIcon: {
    fontSize: 20,
  },
  rewardText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  limitsList: {
    marginBottom: 16,
  },
  limitDetailItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  limitDetailInfo: {
    flex: 1,
  },
  limitDetailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  limitDetailText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  limitProgress: {
    height: 6,
  },
  modalActions: {
    gap: 8,
  },
  closeButton: {
    marginTop: 8,
  },
});