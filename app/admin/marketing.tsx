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
  AlertCircle
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
  createdAt: Date;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'bogo' | 'free-trial';
  discountValue: number;
  code: string;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  usedCount: number;
  targetProducts: string[];
  targetUsers: string[];
  isActive: boolean;
}

interface UserSegment {
  id: string;
  name: string;
  criteria: string[];
  userCount: number;
  description: string;
}

export default function MarketingScreen() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'promotions' | 'analytics' | 'segments'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'New Year Fitness Challenge',
      type: 'email',
      status: 'active',
      targetAudience: 'All Users',
      message: 'Start your fitness journey with our exclusive New Year challenge!',
      subject: '🎊 New Year, New You - 30% OFF',
      sentCount: 5420,
      openRate: 42.3,
      clickRate: 18.7,
      conversionRate: 8.2,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Premium Upgrade Push',
      type: 'push',
      status: 'scheduled',
      targetAudience: 'Free Users',
      message: 'Unlock premium features and accelerate your progress!',
      scheduledDate: new Date('2024-02-01'),
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      createdAt: new Date('2024-01-15'),
    },
  ]);

  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      title: 'Valentine\'s Special',
      description: 'Get 30% off on all coaching plans',
      discountType: 'percentage',
      discountValue: 30,
      code: 'LOVE30',
      validFrom: new Date('2024-02-01'),
      validUntil: new Date('2024-02-29'),
      usageLimit: 500,
      usedCount: 127,
      targetProducts: ['coaching', 'meal-plans'],
      targetUsers: ['all'],
      isActive: true,
    },
  ]);

  const [segments, setSegments] = useState<UserSegment[]>([
    {
      id: '1',
      name: 'Active Premium Users',
      criteria: ['subscription:premium', 'lastActive:7days', 'workouts:>10'],
      userCount: 2341,
      description: 'Premium users active in the last 7 days with 10+ workouts',
    },
    {
      id: '2',
      name: 'Inactive Free Users',
      criteria: ['subscription:free', 'lastActive:>30days'],
      userCount: 8923,
      description: 'Free users who haven\'t been active in 30+ days',
    },
    {
      id: '3',
      name: 'High Spenders',
      criteria: ['totalSpent:>500', 'purchases:>3'],
      userCount: 456,
      description: 'Users who have spent over $500 with 3+ purchases',
    },
  ]);

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'email' as Campaign['type'],
    message: '',
    subject: '',
    targetAudience: 'all',
    scheduledDate: '',
  });

  const [promotionForm, setPromotionForm] = useState({
    title: '',
    description: '',
    discountType: 'percentage' as Promotion['discountType'],
    discountValue: '',
    code: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
  });

  const analytics = useMemo(() => ({
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalReach: campaigns.reduce((sum, c) => sum + c.sentCount, 0),
    avgOpenRate: campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length || 0,
    avgClickRate: campaigns.reduce((sum, c) => sum + c.clickRate, 0) / campaigns.length || 0,
    avgConversionRate: campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length || 0,
    totalPromotions: promotions.length,
    activePromotions: promotions.filter(p => p.isActive).length,
    totalRedemptions: promotions.reduce((sum, p) => sum + p.usedCount, 0),
  }), [campaigns, promotions]);

  const createCampaign = () => {
    if (!campaignForm.name || !campaignForm.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignForm.name,
      type: campaignForm.type,
      status: campaignForm.scheduledDate ? 'scheduled' : 'draft',
      targetAudience: campaignForm.targetAudience,
      message: campaignForm.message,
      subject: campaignForm.subject,
      scheduledDate: campaignForm.scheduledDate ? new Date(campaignForm.scheduledDate) : undefined,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      createdAt: new Date(),
    };

    setCampaigns([...campaigns, newCampaign]);
    setShowCampaignModal(false);
    setCampaignForm({
      name: '',
      type: 'email',
      message: '',
      subject: '',
      targetAudience: 'all',
      scheduledDate: '',
    });
    Alert.alert('Success', 'Campaign created successfully');
  };

  const createPromotion = () => {
    if (!promotionForm.title || !promotionForm.code || !promotionForm.discountValue) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newPromotion: Promotion = {
      id: Date.now().toString(),
      title: promotionForm.title,
      description: promotionForm.description,
      discountType: promotionForm.discountType,
      discountValue: parseFloat(promotionForm.discountValue),
      code: promotionForm.code.toUpperCase(),
      validFrom: new Date(promotionForm.validFrom),
      validUntil: new Date(promotionForm.validUntil),
      usageLimit: parseInt(promotionForm.usageLimit) || 0,
      usedCount: 0,
      targetProducts: ['all'],
      targetUsers: ['all'],
      isActive: true,
    };

    setPromotions([...promotions, newPromotion]);
    setShowPromotionModal(false);
    setPromotionForm({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      code: '',
      validFrom: '',
      validUntil: '',
      usageLimit: '',
    });
    Alert.alert('Success', 'Promotion created successfully');
  };

  const sendCampaign = (campaignId: string) => {
    Alert.alert(
      'Send Campaign',
      'Are you sure you want to send this campaign now?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            setCampaigns(campaigns.map(c => 
              c.id === campaignId 
                ? { ...c, status: 'active' as Campaign['status'], sentCount: Math.floor(Math.random() * 10000) }
                : c
            ));
            Alert.alert('Success', 'Campaign sent successfully');
          }
        }
      ]
    );
  };

  const deleteCampaign = (campaignId: string) => {
    Alert.alert(
      'Delete Campaign',
      'Are you sure you want to delete this campaign?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCampaigns(campaigns.filter(c => c.id !== campaignId));
          }
        }
      ]
    );
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

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} color={colors.status.success} />;
      case 'scheduled': return <Clock size={16} color={colors.accent.secondary} />;
      case 'completed': return <CheckCircle size={16} color={colors.text.secondary} />;
      case 'paused': return <AlertCircle size={16} color={colors.status.warning} />;
      default: return <XCircle size={16} color={colors.text.tertiary} />;
    }
  };

  const renderCampaigns = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setShowCampaignModal(true)}
      >
        <Plus size={20} color={colors.text.primary} />
        <Text style={styles.createButtonText}>Create Campaign</Text>
      </TouchableOpacity>

      <FlatList
        data={campaigns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.campaignCard}>
            <View style={styles.campaignHeader}>
              <View style={styles.campaignTitleRow}>
                <Text style={styles.campaignName}>{item.name}</Text>
                <View style={styles.statusBadge}>
                  {getStatusIcon(item.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.campaignType}>{item.type.toUpperCase()} • {item.targetAudience}</Text>
            </View>

            <Text style={styles.campaignMessage} numberOfLines={2}>{item.message}</Text>

            {item.sentCount > 0 && (
              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{item.sentCount.toLocaleString()}</Text>
                  <Text style={styles.metricLabel}>Sent</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{item.openRate.toFixed(1)}%</Text>
                  <Text style={styles.metricLabel}>Open Rate</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{item.clickRate.toFixed(1)}%</Text>
                  <Text style={styles.metricLabel}>Click Rate</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{item.conversionRate.toFixed(1)}%</Text>
                  <Text style={styles.metricLabel}>Conversion</Text>
                </View>
              </View>
            )}

            <View style={styles.campaignActions}>
              {item.status === 'draft' && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => sendCampaign(item.id)}
                >
                  <Send size={18} color={colors.accent.primary} />
                  <Text style={styles.actionButtonText}>Send Now</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.actionButton}>
                <Eye size={18} color={colors.text.secondary} />
                <Text style={styles.actionButtonText}>Preview</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Edit size={18} color={colors.text.secondary} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => deleteCampaign(item.id)}
              >
                <Trash2 size={18} color={colors.status.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );

  const renderPromotions = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setShowPromotionModal(true)}
      >
        <Plus size={20} color={colors.text.primary} />
        <Text style={styles.createButtonText}>Create Promotion</Text>
      </TouchableOpacity>

      <FlatList
        data={promotions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.promotionCard}>
            <View style={styles.promotionHeader}>
              <Text style={styles.promotionTitle}>{item.title}</Text>
              <Switch
                value={item.isActive}
                onValueChange={(value) => {
                  setPromotions(promotions.map(p => 
                    p.id === item.id ? { ...p, isActive: value } : p
                  ));
                }}
                trackColor={{ false: colors.border.light, true: colors.accent.primary }}
                thumbColor={colors.text.primary}
              />
            </View>

            <Text style={styles.promotionDescription}>{item.description}</Text>

            <View style={styles.promotionDetails}>
              <View style={styles.promoCodeBox}>
                <Text style={styles.promoCode}>{item.code}</Text>
                <Text style={styles.promoDiscount}>
                  {item.discountType === 'percentage' ? `${item.discountValue}% OFF` : `$${item.discountValue} OFF`}
                </Text>
              </View>

              <View style={styles.promotionStats}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Used:</Text>
                  <Text style={styles.statValue}>{item.usedCount} / {item.usageLimit}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Valid:</Text>
                  <Text style={styles.statValue}>
                    {item.validFrom.toLocaleDateString()} - {item.validUntil.toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.promotionActions}>
              <TouchableOpacity style={styles.actionButton}>
                <BarChart3 size={18} color={colors.text.secondary} />
                <Text style={styles.actionButtonText}>Analytics</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Edit size={18} color={colors.text.secondary} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Users size={18} color={colors.text.secondary} />
                <Text style={styles.actionButtonText}>Target Users</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );

  const renderAnalytics = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticsCard}>
          <Megaphone size={24} color={colors.accent.primary} />
          <Text style={styles.analyticsValue}>{analytics.totalCampaigns}</Text>
          <Text style={styles.analyticsLabel}>Total Campaigns</Text>
        </View>
        <View style={styles.analyticsCard}>
          <TrendingUp size={24} color={colors.status.success} />
          <Text style={styles.analyticsValue}>{analytics.activeCampaigns}</Text>
          <Text style={styles.analyticsLabel}>Active Campaigns</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Users size={24} color={colors.accent.secondary} />
          <Text style={styles.analyticsValue}>{analytics.totalReach.toLocaleString()}</Text>
          <Text style={styles.analyticsLabel}>Total Reach</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Mail size={24} color={colors.text.secondary} />
          <Text style={styles.analyticsValue}>{analytics.avgOpenRate.toFixed(1)}%</Text>
          <Text style={styles.analyticsLabel}>Avg Open Rate</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <View style={styles.metricsContainer}>
          <View style={styles.metricRow}>
            <Text style={styles.metricRowLabel}>Average Click Rate</Text>
            <Text style={styles.metricRowValue}>{analytics.avgClickRate.toFixed(1)}%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricRowLabel}>Average Conversion Rate</Text>
            <Text style={styles.metricRowValue}>{analytics.avgConversionRate.toFixed(1)}%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricRowLabel}>Active Promotions</Text>
            <Text style={styles.metricRowValue}>{analytics.activePromotions}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricRowLabel}>Total Redemptions</Text>
            <Text style={styles.metricRowValue}>{analytics.totalRedemptions}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Performing Campaigns</Text>
        {campaigns
          .sort((a, b) => b.conversionRate - a.conversionRate)
          .slice(0, 3)
          .map((campaign) => (
            <TouchableOpacity key={campaign.id} style={styles.topCampaignItem}>
              <View>
                <Text style={styles.topCampaignName}>{campaign.name}</Text>
                <Text style={styles.topCampaignType}>{campaign.type.toUpperCase()}</Text>
              </View>
              <View style={styles.topCampaignMetrics}>
                <Text style={styles.topCampaignConversion}>{campaign.conversionRate.toFixed(1)}%</Text>
                <ChevronRight size={20} color={colors.text.tertiary} />
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );

  const renderSegments = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity style={styles.createButton}>
        <Plus size={20} color={colors.text.primary} />
        <Text style={styles.createButtonText}>Create Segment</Text>
      </TouchableOpacity>

      <FlatList
        data={segments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.segmentCard,
              selectedSegment === item.id && styles.segmentCardSelected
            ]}
            onPress={() => setSelectedSegment(item.id)}
          >
            <View style={styles.segmentHeader}>
              <Text style={styles.segmentName}>{item.name}</Text>
              <Text style={styles.segmentCount}>{item.userCount.toLocaleString()} users</Text>
            </View>
            <Text style={styles.segmentDescription}>{item.description}</Text>
            <View style={styles.segmentCriteria}>
              {item.criteria.map((criterion, index) => (
                <View key={index} style={styles.criterionBadge}>
                  <Text style={styles.criterionText}>{criterion}</Text>
                </View>
              ))}
            </View>
            <View style={styles.segmentActions}>
              <TouchableOpacity style={styles.segmentAction}>
                <Target size={16} color={colors.accent.primary} />
                <Text style={styles.segmentActionText}>Target Campaign</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.segmentAction}>
                <BarChart3 size={16} color={colors.text.secondary} />
                <Text style={styles.segmentActionText}>View Analytics</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketing Center</Text>
        <Text style={styles.subtitle}>Manage campaigns, promotions & user engagement</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'campaigns' && styles.activeTab]}
          onPress={() => setActiveTab('campaigns')}
        >
          <Megaphone size={20} color={activeTab === 'campaigns' ? colors.accent.primary : colors.text.tertiary} />
          <Text style={[styles.tabText, activeTab === 'campaigns' && styles.activeTabText]}>
            Campaigns
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'promotions' && styles.activeTab]}
          onPress={() => setActiveTab('promotions')}
        >
          <Gift size={20} color={activeTab === 'promotions' ? colors.accent.primary : colors.text.tertiary} />
          <Text style={[styles.tabText, activeTab === 'promotions' && styles.activeTabText]}>
            Promotions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
          onPress={() => setActiveTab('analytics')}
        >
          <BarChart3 size={20} color={activeTab === 'analytics' ? colors.accent.primary : colors.text.tertiary} />
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'segments' && styles.activeTab]}
          onPress={() => setActiveTab('segments')}
        >
          <Filter size={20} color={activeTab === 'segments' ? colors.accent.primary : colors.text.tertiary} />
          <Text style={[styles.tabText, activeTab === 'segments' && styles.activeTabText]}>
            Segments
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'campaigns' && renderCampaigns()}
      {activeTab === 'promotions' && renderPromotions()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'segments' && renderSegments()}

      {/* Campaign Creation Modal */}
      <Modal
        visible={showCampaignModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCampaignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Campaign</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Campaign Name"
              placeholderTextColor={colors.text.tertiary}
              value={campaignForm.name}
              onChangeText={(text) => setCampaignForm({ ...campaignForm, name: text })}
            />

            <View style={styles.typeSelector}>
              {(['email', 'push', 'in-app', 'sms'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    campaignForm.type === type && styles.typeOptionSelected
                  ]}
                  onPress={() => setCampaignForm({ ...campaignForm, type })}
                >
                  <Text style={[
                    styles.typeOptionText,
                    campaignForm.type === type && styles.typeOptionTextSelected
                  ]}>
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {campaignForm.type === 'email' && (
              <TextInput
                style={styles.input}
                placeholder="Email Subject"
                placeholderTextColor={colors.text.tertiary}
                value={campaignForm.subject}
                onChangeText={(text) => setCampaignForm({ ...campaignForm, subject: text })}
              />
            )}

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Message"
              placeholderTextColor={colors.text.tertiary}
              value={campaignForm.message}
              onChangeText={(text) => setCampaignForm({ ...campaignForm, message: text })}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCampaignModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={createCampaign}
              >
                <Text style={styles.confirmButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Promotion Creation Modal */}
      <Modal
        visible={showPromotionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPromotionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Promotion</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Promotion Title"
              placeholderTextColor={colors.text.tertiary}
              value={promotionForm.title}
              onChangeText={(text) => setPromotionForm({ ...promotionForm, title: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor={colors.text.tertiary}
              value={promotionForm.description}
              onChangeText={(text) => setPromotionForm({ ...promotionForm, description: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Promo Code"
              placeholderTextColor={colors.text.tertiary}
              value={promotionForm.code}
              onChangeText={(text) => setPromotionForm({ ...promotionForm, code: text })}
              autoCapitalize="characters"
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Discount Value"
                placeholderTextColor={colors.text.tertiary}
                value={promotionForm.discountValue}
                onChangeText={(text) => setPromotionForm({ ...promotionForm, discountValue: text })}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Usage Limit"
                placeholderTextColor={colors.text.tertiary}
                value={promotionForm.usageLimit}
                onChangeText={(text) => setPromotionForm({ ...promotionForm, usageLimit: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPromotionModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={createPromotion}
              >
                <Text style={styles.confirmButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    fontWeight: 'bold' as const,
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.text.tertiary,
    fontWeight: '500' as const,
  },
  activeTabText: {
    color: colors.accent.primary,
  },
  tabContent: {
    flex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    margin: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  campaignCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  campaignHeader: {
    marginBottom: 12,
  },
  campaignTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  campaignName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  campaignType: {
    fontSize: 12,
    color: colors.text.tertiary,
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
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  campaignActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
  },
  actionButtonText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  promotionCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    flex: 1,
  },
  promotionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  promotionDetails: {
    gap: 12,
    marginBottom: 16,
  },
  promoCodeBox: {
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  promoCode: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: colors.accent.primary,
    letterSpacing: 2,
  },
  promoDiscount: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  promotionStats: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  statValue: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500' as const,
  },
  promotionActions: {
    flexDirection: 'row',
    gap: 10,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 15,
  },
  analyticsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text.primary,
    marginTop: 8,
  },
  analyticsLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: 15,
  },
  metricsContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  metricRowLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  metricRowValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  topCampaignItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  topCampaignName: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text.primary,
  },
  topCampaignType: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  topCampaignMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topCampaignConversion: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: colors.status.success,
  },
  segmentCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  segmentCardSelected: {
    borderColor: colors.accent.primary,
    borderWidth: 2,
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  segmentName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  segmentCount: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '500' as const,
  },
  segmentDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  segmentCriteria: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  criterionBadge: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  criterionText: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  segmentActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  segmentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  segmentActionText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: colors.text.primary,
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: colors.accent.primary,
  },
  typeOptionText: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: '500' as const,
  },
  typeOptionTextSelected: {
    color: colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background.secondary,
  },
  cancelButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '500' as const,
  },
  confirmButton: {
    backgroundColor: colors.accent.primary,
  },
  confirmButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});