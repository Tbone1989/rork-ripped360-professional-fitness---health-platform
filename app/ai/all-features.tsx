import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import {
  Scan,
  Eye,
  Camera,
  Bot,
  Sparkles,
  Brain,
  Heart,
  Mic,
  BarChart3,
  Target,
  Zap,
  TrendingUp,
  Calendar,
  Dna,
  Moon,
  ShoppingBag,
  Users,
  Trophy,
  ChevronRight,
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  route: string;
  badge?: string;
  isPremium?: boolean;
  comingSoon?: boolean;
}

export default function AllAIFeaturesScreen() {
  const router = useRouter();

  const coreFeatures: AIFeature[] = [
    {
      id: 'gym-companion',
      title: 'AI Gym Companion',
      description: 'Equipment scanner, anxiety support & motivation',
      icon: Brain,
      color: '#FF9F40',
      route: '/ai/gym-companion',
      badge: 'HOT',
    },
    {
      id: 'meal-accountability',
      title: 'Meal Accountability',
      description: 'AI tracks every meal & keeps you on track',
      icon: Camera,
      color: '#B39DDB',
      route: '/ai/meal-accountability',
      badge: 'NEW',
    },
    {
      id: 'physical-therapy',
      title: 'AI Physical Therapy',
      description: 'Posture analysis, stretching & injury recovery',
      icon: Heart,
      color: '#81C784',
      route: '/ai/physical-therapy',
      badge: 'MEDICAL',
    },
    {
      id: 'body-scan',
      title: 'AI Body Composition',
      description: 'Analyze body fat, muscle mass & get personalized recommendations',
      icon: Scan,
      color: '#8B5CF6',
      route: '/ai/body-scan',
      badge: 'POPULAR',
    },
    {
      id: 'form-check',
      title: 'Real-Time Form Check',
      description: 'Prevent injuries with instant exercise form corrections',
      icon: Eye,
      color: '#06B6D4',
      route: '/ai/form-check',
      badge: 'LIVE',
    },
    {
      id: 'meal-scan',
      title: 'Smart Meal Scanner',
      description: 'Point camera at any meal for instant macro breakdown',
      icon: Camera,
      color: '#10B981',
      route: '/ai/meal-scan',
    },
    {
      id: 'ai-coach',
      title: '24/7 AI Coach',
      description: 'Get instant answers to all your fitness questions',
      icon: Bot,
      color: '#FF69B4',
      route: '/ai/coach',
    },
    {
      id: 'supplement-optimizer',
      title: 'Supplement Stack AI',
      description: 'Optimize supplements for safety, efficacy & cost',
      icon: Sparkles,
      color: '#EC4899',
      route: '/ai/supplement-optimizer',
    },
  ];

  const advancedFeatures: AIFeature[] = [
    {
      id: 'voice-coach',
      title: 'AI Voice Coach',
      description: 'Real-time audio coaching during workouts',
      icon: Mic,
      color: '#F59E0B',
      route: '/ai/voice-coach',
      isPremium: true,
    },
    {
      id: 'physique-predictor',
      title: 'Physique Predictor',
      description: 'See your future physique based on current progress',
      icon: TrendingUp,
      color: '#8B5CF6',
      route: '/ai/physique-predictor',
      isPremium: true,
    },
    {
      id: 'bloodwork-ai',
      title: 'Bloodwork Analyzer',
      description: 'Upload lab results for AI health insights',
      icon: BarChart3,
      color: '#DC2626',
      route: '/medical/ai-analysis',
      badge: 'MEDICAL',
    },
    {
      id: 'genetics-training',
      title: 'DNA-Based Training',
      description: 'Personalized workouts based on your genetics',
      icon: Dna,
      color: '#7C3AED',
      route: '/ai/genetics',
      comingSoon: true,
      isPremium: true,
    },
    {
      id: 'sleep-optimizer',
      title: 'Sleep & Recovery AI',
      description: 'Optimize sleep patterns for maximum gains',
      icon: Moon,
      color: '#4B5563',
      route: '/ai/sleep',
      comingSoon: true,
    },
    {
      id: 'grocery-ai',
      title: 'Smart Grocery List',
      description: 'AI-generated shopping lists based on meal plans',
      icon: ShoppingBag,
      color: '#059669',
      route: '/ai/grocery',
      comingSoon: true,
    },
  ];

  const competitionFeatures: AIFeature[] = [
    {
      id: 'posing-coach',
      title: 'Virtual Posing Coach',
      description: 'Perfect your stage presence with AI analysis',
      icon: Trophy,
      color: '#FBBF24',
      route: '/ai/posing',
      badge: 'CONTEST',
      isPremium: true,
    },
    {
      id: 'peak-week',
      title: 'Peak Week AI',
      description: 'Automated peak week protocols for competitions',
      icon: Zap,
      color: '#F97316',
      route: '/ai/peak-week',
      badge: 'PRO',
      isPremium: true,
    },
    {
      id: 'stage-weight',
      title: 'Stage Weight Predictor',
      description: 'AI predicts your optimal competition weight',
      icon: Target,
      color: '#14B8A6',
      route: '/ai/stage-weight',
      isPremium: true,
    },
  ];

  const socialFeatures: AIFeature[] = [
    {
      id: 'workout-buddy',
      title: 'AI Workout Partner',
      description: 'Match with similar fitness level partners',
      icon: Users,
      color: '#3B82F6',
      route: '/ai/buddy',
      comingSoon: true,
    },
    {
      id: 'challenge-creator',
      title: 'Challenge Generator',
      description: 'AI creates personalized fitness challenges',
      icon: Calendar,
      color: '#A855F7',
      route: '/ai/challenges',
      comingSoon: true,
    },
  ];

  const renderFeatureCard = (feature: AIFeature) => (
    <TouchableOpacity
      key={feature.id}
      style={styles.featureCard}
      onPress={() => !feature.comingSoon && router.push(feature.route as any)}
      disabled={feature.comingSoon}
    >
      <Card style={[
        styles.featureCardContent,
        feature.comingSoon && styles.featureCardDisabled
      ]}>
        <View style={styles.featureHeader}>
          <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
            <feature.icon size={24} color={feature.color} />
          </View>
          <View style={styles.featureBadges}>
            {feature.badge && (
              <Badge 
                label={feature.badge} 
                variant={feature.badge === 'NEW' ? 'success' : 'default'}
                style={styles.badge}
              />
            )}
            {feature.isPremium && (
              <Badge label="PRO" variant="warning" style={styles.badge} />
            )}
            {feature.comingSoon && (
              <Badge label="SOON" variant="default" style={styles.badge} />
            )}
          </View>
        </View>
        
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
        
        {!feature.comingSoon && (
          <View style={styles.featureArrow}>
            <ChevronRight size={20} color={colors.text.secondary} />
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'AI Features',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <Brain size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.heroTitle}>AI-Powered Fitness</Text>
              <Text style={styles.heroSubtitle}>
                Revolutionary features that adapt to your body and goals
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>95%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>24/7</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>3x</Text>
            <Text style={styles.statLabel}>Faster Results</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>50K+</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
        </View>

        {/* Core Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core AI Features</Text>
          <Text style={styles.sectionSubtitle}>Essential tools for every fitness journey</Text>
          <View style={styles.featuresGrid}>
            {coreFeatures.map(renderFeatureCard)}
          </View>
        </View>

        {/* Advanced Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Analytics</Text>
          <Text style={styles.sectionSubtitle}>Take your training to the next level</Text>
          <View style={styles.featuresGrid}>
            {advancedFeatures.map(renderFeatureCard)}
          </View>
        </View>

        {/* Competition Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Competition Prep</Text>
          <Text style={styles.sectionSubtitle}>Professional bodybuilding tools</Text>
          <View style={styles.featuresGrid}>
            {competitionFeatures.map(renderFeatureCard)}
          </View>
        </View>

        {/* Social Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social & Community</Text>
          <Text style={styles.sectionSubtitle}>Train together, grow together</Text>
          <View style={styles.featuresGrid}>
            {socialFeatures.map(renderFeatureCard)}
          </View>
        </View>

        {/* CTA */}
        <Card style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Unlock All AI Features</Text>
          <Text style={styles.ctaDescription}>
            Get unlimited access to all AI features with our Pro membership
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/profile/subscription')}
          >
            <Text style={styles.ctaButtonText}>Upgrade to Pro</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  heroBanner: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: colors.background.secondary,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '47%',
  },
  featureCardContent: {
    padding: 16,
    position: 'relative',
  },
  featureCardDisabled: {
    opacity: 0.6,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  featureArrow: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  ctaCard: {
    margin: 16,
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});