import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { 
  Send, 
  Users, 
  Target, 
  TrendingUp, 
  Mail, 
  Bell, 
  Gift, 
  Calendar,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  BarChart3,
  MessageSquare,
  Megaphone,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Brain,
  Sparkles,
  Zap,
  UserCheck,
  Activity,
  Award,
  Heart,
  ShoppingBag,
} from 'lucide-react-native';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'push' | 'in-app' | 'sms';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  targetAudience: string;
  message: string;
  subject?: string;
  scheduledDate?: Date;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenue?: number;
  createdAt: Date;
  aiGenerated?: boolean;
  personalized?: boolean;
  abTest?: boolean;
}

interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  userCount: number;
  avgLTV?: number;
  engagementScore?: number;
  aiSuggested?: boolean;
}

interface AIInsight {
  id: string;
  type: 'opportunity' | 'trend' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: 'active' | 'paused';
  performance: {
    triggered: number;
    completed: number;
    conversion: number;
    revenue: number;
  };
}

export default function MarketingScreen() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'segments' | 'ai-insights' | 'automation'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Personalized Workout Recommendations',
      type: 'email',
      status: 'active',
      targetAudience: 'High-Engagement Users',
      subject: '🎯 Your Custom Workout Plan is Ready!',
      message: 'Based on your recent progress, we\'ve created a personalized workout plan just for you.',
      sentCount: 2450,
      openRate: 52.3,
      clickRate: 18.7,
      conversionRate: 8.2,
      revenue: 12500,
      createdAt: new Date('2024-01-01'),
      aiGenerated: true,
      personalized: true,
    },
    {
      id: '2',
      name: 'Win-Back Campaign',
      type: 'push',
      status: 'scheduled',
      targetAudience: 'Churned Users',
      message: 'We miss you! Come back with 50% off your next month 💪',
      scheduledDate: new Date('2024-02-01'),
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      createdAt: new Date('2024-01-15'),
      aiGenerated: true,
      abTest: true,
    },
    {
      id: '3',
      name: 'Premium Feature Spotlight',
      type: 'in-app',
      status: 'completed',
      targetAudience: 'Free Trial Users',
      message: 'Unlock AI-powered meal planning and save 30% today only!',
      sentCount: 5200,
      openRate: 68.4,
      clickRate: 24.3,
      conversionRate: 12.1,
      revenue: 8900,
      createdAt: new Date('2024-01-10'),
      personalized: true,
    },
  ]);

  const [segments] = useState<UserSegment[]>([
    {
      id: '1',
      name: 'High-Value Power Users',
      description: 'Most engaged users with high lifetime value',
      criteria: ['Daily active', 'Premium subscription', 'Completed 50+ workouts', 'Referred 2+ friends'],
      userCount: 1250,
      avgLTV: 450,
      engagementScore: 95,
      aiSuggested: true,
    },
    {
      id: '2',
      name: 'At-Risk Premium Members',
      description: 'Premium users showing signs of churn',
      criteria: ['Premium subscription', 'Decreased activity 30%', 'No login in 7 days'],
      userCount: 380,
      avgLTV: 280,
      engagementScore: 35,
      aiSuggested: true,
    },
    {
      id: '3',
      name: 'Conversion Ready Free Users',
      description: 'Free users most likely to convert',
      criteria: ['Free tier', 'High feature usage', 'Viewed pricing 3+ times', 'Account age > 14 days'],
      userCount: 2840,
      avgLTV: 0,
      engagementScore: 72,
      aiSuggested: true,
    },
    {
      id: '4',
      name: 'Fitness Enthusiasts',
      description: 'Users focused on workout features',
      criteria: ['Completed 20+ workouts', 'Uses tracking features', 'Views leaderboard'],
      userCount: 4560,
      avgLTV: 180,
      engagementScore: 78,
    },
    {
      id: '5',
      name: 'Nutrition Focused',
      description: 'Users primarily using meal planning',
      criteria: ['Uses meal planner', 'Logs meals daily', 'Views recipes'],
      userCount: 3200,
      avgLTV: 220,
      engagementScore: 82,
    },
  ]);

  const [aiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'opportunity',
      title: 'Weekend Engagement Spike Detected',
      description: 'Users are 3x more likely to upgrade on Sunday evenings. Schedule premium campaigns accordingly.',
      impact: 'high',
      actionable: true,
    },
    {
      id: '2',
      type: 'trend',
      title: 'Meal Planning Feature Driving Conversions',
      description: 'Users who try meal planning convert at 45% higher rate. Consider highlighting in onboarding.',
      impact: 'high',
      actionable: true,
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Re-engage Dormant Premium Users',
      description: '380 premium users haven\'t logged in for 7+ days. High churn risk - immediate action recommended.',
      impact: 'high',
      actionable: true,
    },
    {
      id: '4',
      type: 'opportunity',
      title: 'Cross-sell Supplements to Active Users',
      description: 'Users completing 5+ workouts/week show 68% interest in supplement recommendations.',
      impact: 'medium',
      actionable: true,
    },
  ]);

  const [automationFlows] = useState<AutomationFlow[]>([
    {
      id: '1',
      name: 'Welcome Series',
      description: '7-day onboarding sequence for new users',
      trigger: 'User signup',
      status: 'active',
      performance: {
        triggered: 3420,
        completed: 2804,
        conversion: 45,
        revenue: 28500,
      },
    },
    {
      id: '2',
      name: 'Win-Back Campaign',
      description: 'Re-engage users after 14 days of inactivity',
      trigger: '14 days inactive',
      status: 'active',
      performance: {
        triggered: 890,
        completed: 623,
        conversion: 28,
        revenue: 8500,
      },
    },
    {
      id: '3',
      name: 'Milestone Celebrations',
      description: 'Reward users for achievements with special offers',
      trigger: 'Achievement unlocked',
      status: 'paused',
      performance: {
        triggered: 1560,
        completed: 1435,
        conversion: 18,
        revenue: 4200,
      },
    },
  ]);

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'email' as Campaign['type'],
    message: '',
    subject: '',
    targetAudience: '',
    useAI: true,
    personalize: true,
    abTest: false,
  });

  const analytics = useMemo(() => ({
    totalRevenue: campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0),
    avgOpenRate: campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length || 0,
    avgConversionRate: campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length || 0,
    totalReach: campaigns.reduce((sum, c) => sum + c.sentCount, 0),
  }), [campaigns]);

  const generateAIContent = async () => {
    if (!campaignForm.targetAudience) {
      Alert.alert('Select Audience', 'Please select a target audience first');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert marketing copywriter for a fitness and wellness app. Create compelling, personalized marketing messages that drive engagement and conversions. Focus on benefits, urgency, and clear CTAs. Keep messages concise and action-oriented.`
            },
            {
              role: 'user',
              content: `Create a ${campaignForm.type} marketing message for the following audience segment: "${campaignForm.targetAudience}". 
              Campaign name: ${campaignForm.name || 'Fitness campaign'}
              Include: 
              - Compelling subject line (if email)
              - Personalized greeting
              - Key value propositions (2-3 points)
              - Clear call-to-action
              - Sense of urgency or exclusivity
              - Emoji for engagement
              Format as JSON with 'subject' and 'message' fields.`
            }
          ]
        })
      });

      const data = await response.json();
      if (data.completion) {
        try {
          const parsed = JSON.parse(data.completion);
          setCampaignForm(prev => ({
            ...prev,
            subject: parsed.subject || '',
            message: parsed.message || data.completion,
          }));
        } catch {
          setCampaignForm(prev => ({
            ...prev,
            message: data.completion,
          }));
        }
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      Alert.alert('Error', 'Failed to generate AI content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAISegment = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a data analyst expert in user segmentation for fitness apps. Suggest valuable user segments based on behavior patterns and business goals.'
            },
            {
              role: 'user',
              content: `Suggest 3 high-value user segments for cross-marketing in a fitness app. For each segment provide:
              - Name
              - Description
              - 3-4 specific criteria
              - Estimated engagement potential (high/medium/low)
              - Recommended campaign type
              Format as JSON array.`
            }
          ]
        })
      });

      const data = await response.json();
      if (data.completion) {
        Alert.alert('AI Segments Generated', 'New segment suggestions are ready for review!');
      }
    } catch (error) {
      console.error('Error generating segments:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const createCampaign = () => {
    if (!campaignForm.name || !campaignForm.message || !campaignForm.targetAudience) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignForm.name,
      type: campaignForm.type,
      status: 'draft',
      targetAudience: campaignForm.targetAudience,
      message: campaignForm.message,
      subject: campaignForm.subject,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      createdAt: new Date(),
      aiGenerated: campaignForm.useAI,
      personalized: campaignForm.personalize,
      abTest: campaignForm.abTest,
    };

    setCampaigns([newCampaign, ...campaigns]);
    setShowCampaignModal(false);
    setCampaignForm({
      name: '',
      type: 'email',
      message: '',
      subject: '',
      targetAudience: '',
      useAI: true,
      personalize: true,
      abTest: false,
    });
    Alert.alert('Success', 'AI Campaign created successfully! 🚀');
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return colors.status.success;
      case 'scheduled': return colors.accent.secondary;
      case 'completed': return colors.text.secondary;
      case 'paused': return colors.status.warning;
      default: return colors.text.tertiary;
    }
  };

  const renderCampaigns = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${(analytics.totalRevenue / 1000).toFixed(1)}K</Text>
          <Text style={styles.statLabel}>Revenue Generated</Text>
          <View style={styles.statChange}>
            <TrendingUp size={14} color={colors.status.success} />
            <Text style={styles.statChangeText}>+28%</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{analytics.avgOpenRate.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Avg Open Rate</Text>
          <View style={styles.statChange}>
            <TrendingUp size={14} color={colors.status.success} />
            <Text style={styles.statChangeText}>+12%</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{analytics.avgConversionRate.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Conversion Rate</Text>
          <View style={styles.statChange}>
            <TrendingUp size={14} color={colors.status.success} />
            <Text style={styles.statChangeText}>+5%</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setShowCampaignModal(true)}
      >
        <Plus size={20} color={colors.text.primary} />
        <Text style={styles.createButtonText}>Create AI Campaign</Text>
        <Sparkles size={16} color={colors.accent.secondary} />
      </TouchableOpacity>

      <FlatList
        data={campaigns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.campaignCard}>
            <View style={styles.campaignHeader}>
              <View style={styles.campaignTitleRow}>
                <Text style={styles.campaignName}>{item.name}</Text>
                {item.aiGenerated && (
                  <View style={styles.aiIndicator}>
                    <Brain size={14} color={colors.accent.secondary} />
                    <Text style={styles.aiText}>AI</Text>
                  </View>
                )}
              </View>
              <View style={styles.campaignMeta}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.typeBadge}>
                  {item.type === 'email' && <Mail size={14} color={colors.text.secondary} />}
                  {item.type === 'push' && <Bell size={14} color={colors.text.secondary} />}
                  {item.type === 'in-app' && <MessageSquare size={14} color={colors.text.secondary} />}
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
                {item.personalized && (
                  <View style={styles.personalizedBadge}>
                    <UserCheck size={12} color={colors.accent.primary} />
                    <Text style={styles.personalizedText}>Personalized</Text>
                  </View>
                )}
                {item.abTest && (
                  <View style={styles.abTestBadge}>
                    <Zap size={12} color={colors.accent.secondary} />
                    <Text style={styles.abTestText}>A/B Test</Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.campaignMessage} numberOfLines={2}>{item.message}</Text>

            {item.sentCount > 0 && (
              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Send size={14} color={colors.text.tertiary} />
                  <Text style={styles.metricValue}>{item.sentCount.toLocaleString()}</Text>
                  <Text style={styles.metricLabel}>Sent</Text>
                </View>
                <View style={styles.metric}>
                  <Eye size={14} color={colors.text.tertiary} />
                  <Text style={styles.metricValue}>{item.openRate.toFixed(1)}%</Text>
                  <Text style={styles.metricLabel}>Open</Text>
                </View>
                <View style={styles.metric}>
                  <Target size={14} color={colors.text.tertiary} />
                  <Text style={styles.metricValue}>{item.clickRate.toFixed(1)}%</Text>
                  <Text style={styles.metricLabel}>Click</Text>
                </View>
                {item.revenue && (
                  <View style={styles.metric}>
                    <DollarSign size={14} color={colors.status.success} />
                    <Text style={[styles.metricValue, styles.revenueNumber]}>
                      ${(item.revenue / 1000).toFixed(1)}k
                    </Text>
                    <Text style={styles.metricLabel}>Revenue</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );

  const renderSegments = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        style={styles.aiSegmentButton}
        onPress={generateAISegment}
        disabled={isGenerating}
      >
        <Brain size={20} color={colors.accent.secondary} />
        <Text style={styles.aiSegmentButtonText}>Generate AI Segments</Text>
        {isGenerating && <ActivityIndicator size="small" color={colors.accent.secondary} />}
      </TouchableOpacity>

      {segments.map(segment => (
        <TouchableOpacity key={segment.id} style={styles.segmentCard}>
          <View style={styles.segmentHeader}>
            <View style={styles.segmentTitleRow}>
              <Text style={styles.segmentName}>{segment.name}</Text>
              {segment.aiSuggested && (
                <View style={styles.aiSuggestedBadge}>
                  <Sparkles size={12} color={colors.accent.secondary} />
                  <Text style={styles.aiSuggestedText}>AI Suggested</Text>
                </View>
              )}
            </View>
            <Text style={styles.segmentDescription}>{segment.description}</Text>
          </View>
          
          <View style={styles.segmentMetrics}>
            <View style={styles.metricItem}>
              <Users size={16} color={colors.text.secondary} />
              <Text style={styles.metricItemValue}>{segment.userCount.toLocaleString()}</Text>
              <Text style={styles.metricItemLabel}>Users</Text>
            </View>
            {segment.avgLTV !== undefined && (
              <View style={styles.metricItem}>
                <DollarSign size={16} color={colors.status.success} />
                <Text style={styles.metricItemValue}>${segment.avgLTV}</Text>
                <Text style={styles.metricItemLabel}>Avg LTV</Text>
              </View>
            )}
            {segment.engagementScore && (
              <View style={styles.metricItem}>
                <Activity size={16} color={colors.accent.primary} />
                <Text style={styles.metricItemValue}>{segment.engagementScore}%</Text>
                <Text style={styles.metricItemLabel}>Engagement</Text>
              </View>
            )}
          </View>

          <View style={styles.criteriaList}>
            {segment.criteria.map((criterion, index) => (
              <View key={index} style={styles.criterion}>
                <CheckCircle size={12} color={colors.text.tertiary} />
                <Text style={styles.criterionText}>{criterion}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.segmentActions}>
            <TouchableOpacity 
              style={styles.targetButton}
              onPress={() => {
                setCampaignForm(prev => ({ ...prev, targetAudience: segment.name }));
                setShowCampaignModal(true);
              }}
            >
              <Target size={16} color={colors.text.primary} />
              <Text style={styles.targetButtonText}>Create Campaign</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.analyzeButton}>
              <BarChart3 size={16} color={colors.accent.primary} />
              <Text style={styles.analyzeButtonText}>Analyze</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderAIInsights = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.insightsHeader}>
        <Text style={styles.insightsTitle}>AI-Powered Marketing Intelligence</Text>
        <Text style={styles.insightsSubtitle}>Real-time insights to optimize your campaigns</Text>
      </View>

      {aiInsights.map(insight => (
        <View key={insight.id} style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.insightTypeContainer}>
              {insight.type === 'opportunity' && <Zap size={20} color={colors.accent.secondary} />}
              {insight.type === 'trend' && <TrendingUp size={20} color={colors.accent.primary} />}
              {insight.type === 'recommendation' && <Brain size={20} color={colors.status.success} />}
              <Text style={styles.insightType}>{insight.type.toUpperCase()}</Text>
            </View>
            <View style={[styles.impactBadge, styles[`${insight.impact}Impact`]]}>
              <Text style={styles.impactText}>{insight.impact.toUpperCase()} IMPACT</Text>
            </View>
          </View>
          
          <Text style={styles.insightTitle}>{insight.title}</Text>
          <Text style={styles.insightDescription}>{insight.description}</Text>
          
          {insight.actionable && (
            <TouchableOpacity style={styles.actionButton}>
              <Sparkles size={16} color={colors.text.primary} />
              <Text style={styles.actionButtonText}>Take Action</Text>
              <ChevronRight size={16} color={colors.text.primary} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );

  const renderAutomation = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.automationHeader}>
        <Text style={styles.automationTitle}>Marketing Automation Flows</Text>
        <Text style={styles.automationSubtitle}>Set up intelligent campaigns that run automatically</Text>
      </View>

      {automationFlows.map(flow => (
        <TouchableOpacity key={flow.id} style={styles.automationCard}>
          <View style={styles.automationIcon}>
            {flow.name.includes('Welcome') && <UserCheck size={24} color={colors.accent.primary} />}
            {flow.name.includes('Win-Back') && <Clock size={24} color={colors.status.warning} />}
            {flow.name.includes('Milestone') && <Award size={24} color={colors.status.success} />}
          </View>
          <View style={styles.automationContent}>
            <Text style={styles.automationName}>{flow.name}</Text>
            <Text style={styles.automationDescription}>{flow.description}</Text>
            <View style={styles.automationStats}>
              <Text style={styles.automationStat}>
                {flow.performance.conversion}% conversion
              </Text>
              <Text style={styles.automationStat}>• ${(flow.performance.revenue / 1000).toFixed(1)}k revenue</Text>
            </View>
          </View>
          <Switch
            value={flow.status === 'active'}
            onValueChange={() => {}}
            trackColor={{ false: colors.border.light, true: colors.accent.primary }}
          />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.createAutomationButton}>
        <Plus size={20} color={colors.text.primary} />
        <Text style={styles.createAutomationText}>Create AI Automation</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Marketing Center</Text>
        <Text style={styles.subtitle}>Intelligent cross-marketing powered by AI</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'campaigns' && styles.activeTab]}
            onPress={() => setActiveTab('campaigns')}
          >
            <Send size={18} color={activeTab === 'campaigns' ? colors.accent.primary : colors.text.secondary} />
            <Text style={[styles.tabText, activeTab === 'campaigns' && styles.activeTabText]}>Campaigns</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'segments' && styles.activeTab]}
            onPress={() => setActiveTab('segments')}
          >
            <Users size={18} color={activeTab === 'segments' ? colors.accent.primary : colors.text.secondary} />
            <Text style={[styles.tabText, activeTab === 'segments' && styles.activeTabText]}>Segments</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ai-insights' && styles.activeTab]}
            onPress={() => setActiveTab('ai-insights')}
          >
            <Brain size={18} color={activeTab === 'ai-insights' ? colors.accent.primary : colors.text.secondary} />
            <Text style={[styles.tabText, activeTab === 'ai-insights' && styles.activeTabText]}>AI Insights</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'automation' && styles.activeTab]}
            onPress={() => setActiveTab('automation')}
          >
            <Zap size={18} color={activeTab === 'automation' ? colors.accent.primary : colors.text.secondary} />
            <Text style={[styles.tabText, activeTab === 'automation' && styles.activeTabText]}>Automation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {activeTab === 'campaigns' && renderCampaigns()}
      {activeTab === 'segments' && renderSegments()}
      {activeTab === 'ai-insights' && renderAIInsights()}
      {activeTab === 'automation' && renderAutomation()}

      <Modal
        visible={showCampaignModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCampaignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create AI-Powered Campaign</Text>
                <TouchableOpacity onPress={() => setShowCampaignModal(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Campaign Name"
                placeholderTextColor={colors.text.tertiary}
                value={campaignForm.name}
                onChangeText={text => setCampaignForm(prev => ({ ...prev, name: text }))}
              />

              <View style={styles.typeSelector}>
                {(['email', 'push', 'in-app', 'sms'] as const).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      campaignForm.type === type && styles.typeOptionActive
                    ]}
                    onPress={() => setCampaignForm(prev => ({ ...prev, type }))}
                  >
                    <Text style={[
                      styles.typeOptionText,
                      campaignForm.type === type && styles.typeOptionTextActive
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.segmentSelector}>
                <Text style={styles.inputLabel}>Target Audience</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {segments.map(segment => (
                    <TouchableOpacity
                      key={segment.id}
                      style={[
                        styles.segmentOption,
                        campaignForm.targetAudience === segment.name && styles.segmentOptionActive
                      ]}
                      onPress={() => setCampaignForm(prev => ({ ...prev, targetAudience: segment.name }))}
                    >
                      <Text style={[
                        styles.segmentOptionText,
                        campaignForm.targetAudience === segment.name && styles.segmentOptionTextActive
                      ]}>
                        {segment.name}
                      </Text>
                      <Text style={styles.segmentOptionCount}>{segment.userCount.toLocaleString()} users</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {campaignForm.type === 'email' && (
                <TextInput
                  style={styles.input}
                  placeholder="Email Subject Line"
                  placeholderTextColor={colors.text.tertiary}
                  value={campaignForm.subject}
                  onChangeText={text => setCampaignForm(prev => ({ ...prev, subject: text }))}
                />
              )}

              <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="Message (or let AI generate it)"
                placeholderTextColor={colors.text.tertiary}
                value={campaignForm.message}
                onChangeText={text => setCampaignForm(prev => ({ ...prev, message: text }))}
                multiline
                numberOfLines={6}
              />

              <View style={styles.campaignOptions}>
                <View style={styles.aiToggle}>
                  <View style={styles.toggleLeft}>
                    <Brain size={18} color={colors.accent.secondary} />
                    <Text style={styles.aiToggleText}>AI Content Generation</Text>
                  </View>
                  <Switch
                    value={campaignForm.useAI}
                    onValueChange={value => setCampaignForm(prev => ({ ...prev, useAI: value }))}
                    trackColor={{ false: colors.border.light, true: colors.accent.primary }}
                  />
                </View>

                <View style={styles.aiToggle}>
                  <View style={styles.toggleLeft}>
                    <UserCheck size={18} color={colors.accent.primary} />
                    <Text style={styles.aiToggleText}>Personalization</Text>
                  </View>
                  <Switch
                    value={campaignForm.personalize}
                    onValueChange={value => setCampaignForm(prev => ({ ...prev, personalize: value }))}
                    trackColor={{ false: colors.border.light, true: colors.accent.primary }}
                  />
                </View>

                <View style={styles.aiToggle}>
                  <View style={styles.toggleLeft}>
                    <Zap size={18} color={colors.status.warning} />
                    <Text style={styles.aiToggleText}>A/B Testing</Text>
                  </View>
                  <Switch
                    value={campaignForm.abTest}
                    onValueChange={value => setCampaignForm(prev => ({ ...prev, abTest: value }))}
                    trackColor={{ false: colors.border.light, true: colors.accent.primary }}
                  />
                </View>
              </View>

              {campaignForm.useAI && (
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={generateAIContent}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <ActivityIndicator size="small" color={colors.text.primary} />
                      <Text style={styles.generateButtonText}>Generating AI Content...</Text>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} color={colors.text.primary} />
                      <Text style={styles.generateButtonText}>Generate AI Content</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowCampaignModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={createCampaign}
                >
                  <Send size={18} color={colors.text.primary} />
                  <Text style={styles.saveButtonText}>Launch Campaign</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  tabsContainer: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.accent.primary,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statChangeText: {
    fontSize: 12,
    color: colors.status.success,
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  listContent: {
    paddingBottom: 20,
  },
  campaignCard: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  campaignHeader: {
    marginBottom: 12,
  },
  campaignTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiText: {
    fontSize: 10,
    color: colors.accent.secondary,
    fontWeight: '600',
  },
  campaignMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  personalizedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  personalizedText: {
    fontSize: 11,
    color: colors.accent.primary,
  },
  abTestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  abTestText: {
    fontSize: 11,
    color: colors.accent.secondary,
  },
  campaignMessage: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  metric: {
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  revenueNumber: {
    color: colors.status.success,
    fontWeight: 'bold',
  },
  aiSegmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent.secondary,
    borderStyle: 'dashed',
  },
  aiSegmentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.secondary,
  },
  segmentCard: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  segmentHeader: {
    marginBottom: 12,
  },
  segmentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  segmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  aiSuggestedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiSuggestedText: {
    fontSize: 10,
    color: colors.accent.secondary,
    fontWeight: '600',
  },
  segmentDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 4,
  },
  segmentMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background.tertiary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
    gap: 4,
  },
  metricItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  metricItemLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  criteriaList: {
    marginBottom: 12,
  },
  criterion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  criterionText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  segmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  targetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  targetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  analyzeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
    padding: 10,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  analyzeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  insightsHeader: {
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  insightsSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  insightCard: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightType: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  impactBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highImpact: {
    backgroundColor: colors.status.error + '20',
  },
  mediumImpact: {
    backgroundColor: colors.status.warning + '20',
  },
  lowImpact: {
    backgroundColor: colors.status.success + '20',
  },
  impactText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  automationHeader: {
    marginBottom: 16,
  },
  automationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  automationSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  automationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  automationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  automationContent: {
    flex: 1,
  },
  automationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  automationDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  automationStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  automationStat: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  createAutomationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderStyle: 'dashed',
  },
  createAutomationText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  closeButton: {
    fontSize: 24,
    color: colors.text.secondary,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: colors.accent.primary + '20',
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  typeOptionText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  typeOptionTextActive: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  segmentSelector: {
    marginBottom: 12,
  },
  segmentOption: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  segmentOptionActive: {
    backgroundColor: colors.accent.primary + '20',
    borderColor: colors.accent.primary,
  },
  segmentOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  segmentOptionTextActive: {
    color: colors.accent.primary,
  },
  segmentOptionCount: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  campaignOptions: {
    marginBottom: 12,
  },
  aiToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiToggleText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.secondary,
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 12,
    gap: 8,
  },
  generateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.accent.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
});