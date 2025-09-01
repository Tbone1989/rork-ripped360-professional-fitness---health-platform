import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  MessageSquare,
  AlertTriangle,
  Bug,
  Lightbulb,
  Clock,
  CheckCircle,
  X,
  User,
  Calendar,
  Tag,
  Filter,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface UserIssue {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'bug' | 'feature' | 'support' | 'feedback';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  title: string;
  description: string;
  timestamp: string;
  assignedTo?: string;
  tags: string[];
  attachments?: string[];
}

export default function UserIssuesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'bug' | 'feature' | 'support' | 'feedback'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userIssues: UserIssue[] = [
    {
      id: '1',
      userId: 'user_123',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      type: 'bug',
      priority: 'high',
      status: 'open',
      title: 'App crashes when uploading bloodwork',
      description: 'The app consistently crashes when I try to upload multiple bloodwork images. This happens on both camera and gallery uploads.',
      timestamp: '2 hours ago',
      tags: ['bloodwork', 'upload', 'crash'],
      attachments: ['crash_log.txt', 'screenshot.png']
    },
    {
      id: '2',
      userId: 'user_456',
      userName: 'Sarah Johnson',
      userEmail: 'sarah@example.com',
      type: 'feature',
      priority: 'medium',
      status: 'in-progress',
      title: 'Add meal planning templates',
      description: 'Would love to have pre-made meal planning templates for different dietary preferences like keto, vegan, etc.',
      timestamp: '5 hours ago',
      assignedTo: 'dev_team',
      tags: ['meal-planning', 'templates', 'nutrition']
    },
    {
      id: '3',
      userId: 'user_789',
      userName: 'Mike Chen',
      userEmail: 'mike@example.com',
      type: 'support',
      priority: 'medium',
      status: 'open',
      title: 'Cannot connect with assigned coach',
      description: 'I was assigned a coach but cannot see their profile or send messages. The coaching tab shows empty.',
      timestamp: '1 day ago',
      tags: ['coaching', 'connection', 'messaging']
    },
    {
      id: '4',
      userId: 'user_101',
      userName: 'Emily Rodriguez',
      userEmail: 'emily@example.com',
      type: 'feedback',
      priority: 'low',
      status: 'resolved',
      title: 'Love the new workout generator!',
      description: 'The AI workout generator is amazing! It created perfect workouts for my home gym setup. Maybe add more equipment options?',
      timestamp: '2 days ago',
      tags: ['workout', 'ai', 'positive']
    },
    {
      id: '5',
      userId: 'user_202',
      userName: 'David Wilson',
      userEmail: 'david@example.com',
      type: 'bug',
      priority: 'urgent',
      status: 'in-progress',
      title: 'Payment processing error',
      description: 'Unable to upgrade to premium subscription. Payment fails with error code 500. Tried multiple cards.',
      timestamp: '3 hours ago',
      assignedTo: 'payment_team',
      tags: ['payment', 'subscription', 'error']
    },
    {
      id: '6',
      userId: 'user_303',
      userName: 'Lisa Park',
      userEmail: 'lisa@example.com',
      type: 'feature',
      priority: 'low',
      status: 'open',
      title: 'Dark mode for the app',
      description: 'Please add a dark mode option. The current light theme is too bright for evening workouts.',
      timestamp: '1 week ago',
      tags: ['ui', 'dark-mode', 'accessibility']
    },
  ];

  const filteredIssues = userIssues.filter(issue => {
    const matchesStatus = selectedFilter === 'all' || issue.status === selectedFilter;
    const matchesType = selectedType === 'all' || issue.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleIssueClick = (issue: UserIssue) => {
    Alert.alert(
      issue.title,
      `User: ${issue.userName} (${issue.userEmail})\nType: ${issue.type}\nPriority: ${issue.priority}\nStatus: ${issue.status}\n\nDescription:\n${issue.description}\n\nTags: ${issue.tags.join(', ')}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Update Status', onPress: () => handleStatusUpdate(issue) },
        { text: 'Contact User', onPress: () => handleContactUser(issue) },
      ]
    );
  };

  const handleStatusUpdate = (issue: UserIssue) => {
    Alert.alert(
      'Update Status',
      `Current status: ${issue.status}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'In Progress', onPress: () => Alert.alert('Updated', 'Status updated to In Progress') },
        { text: 'Resolved', onPress: () => Alert.alert('Updated', 'Status updated to Resolved') },
        { text: 'Closed', onPress: () => Alert.alert('Updated', 'Status updated to Closed') },
      ]
    );
  };

  const handleContactUser = (issue: UserIssue) => {
    Alert.alert(
      'Contact User',
      `Send message to ${issue.userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Email', onPress: () => Alert.alert('Email Sent', `Email sent to ${issue.userEmail}`) },
        { text: 'In-App Message', onPress: () => Alert.alert('Message Sent', 'In-app message sent to user') },
      ]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return <Bug size={20} color={colors.status.error} />;
      case 'feature':
        return <Lightbulb size={20} color={colors.status.info} />;
      case 'support':
        return <MessageSquare size={20} color={colors.status.warning} />;
      case 'feedback':
        return <User size={20} color={colors.status.success} />;
      default:
        return <MessageSquare size={20} color={colors.text.secondary} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return colors.status.error;
      case 'high':
        return '#FF6B35';
      case 'medium':
        return colors.status.warning;
      default:
        return colors.status.success;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return colors.status.error;
      case 'in-progress':
        return colors.status.warning;
      case 'resolved':
        return colors.status.success;
      case 'closed':
        return colors.text.secondary;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusCounts = () => {
    const counts = {
      all: userIssues.length,
      open: userIssues.filter(i => i.status === 'open').length,
      'in-progress': userIssues.filter(i => i.status === 'in-progress').length,
      resolved: userIssues.filter(i => i.status === 'resolved').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'User Issues & Requests',
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterButton}>
              <Filter size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Issue Management</Text>
        <Text style={styles.subtitle}>Track and resolve user issues and feature requests</Text>
        
        <Input
          placeholder="Search issues..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.statusTabs}>
        {(['all', 'open', 'in-progress', 'resolved'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusTab,
              selectedFilter === status && styles.statusTabActive
            ]}
            onPress={() => setSelectedFilter(status)}
          >
            <Text style={[
              styles.statusTabText,
              selectedFilter === status && styles.statusTabTextActive
            ]}>
              {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
            <Badge variant="info" style={styles.statusCount}>
              {statusCounts[status]}
            </Badge>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredIssues.map((issue) => (
          <TouchableOpacity
            key={issue.id}
            onPress={() => handleIssueClick(issue)}
            activeOpacity={0.9}
          >
            <Card style={styles.issueCard}>
              <View style={styles.issueHeader}>
                <View style={styles.issueTypeIcon}>
                  {getTypeIcon(issue.type)}
                </View>
                <View style={styles.issueInfo}>
                  <Text style={styles.issueTitle}>{issue.title}</Text>
                  <Text style={styles.issueUser}>{issue.userName}</Text>
                </View>
                <View style={styles.issueMeta}>
                  <Text style={styles.issueTime}>{issue.timestamp}</Text>
                  <View style={styles.issueBadges}>
                    <Badge 
                      variant="outline" 
                      style={[styles.priorityBadge, { borderColor: getPriorityColor(issue.priority) }]}
                    >
                      <Text style={[styles.priorityText, { color: getPriorityColor(issue.priority) }]}>
                        {issue.priority.toUpperCase()}
                      </Text>
                    </Badge>
                    <Badge 
                      variant="outline"
                      style={[styles.statusBadge, { borderColor: getStatusColor(issue.status) }]}
                    >
                      <Text style={[styles.statusText, { color: getStatusColor(issue.status) }]}>
                        {issue.status.toUpperCase()}
                      </Text>
                    </Badge>
                  </View>
                </View>
              </View>
              
              <Text style={styles.issueDescription} numberOfLines={2}>
                {issue.description}
              </Text>
              
              <View style={styles.issueFooter}>
                <View style={styles.issueTags}>
                  {issue.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Tag size={12} color={colors.text.tertiary} />
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                  {issue.tags.length > 3 && (
                    <Text style={styles.moreTagsText}>+{issue.tags.length - 3} more</Text>
                  )}
                </View>
                
                {issue.assignedTo && (
                  <View style={styles.assignedTo}>
                    <User size={12} color={colors.text.tertiary} />
                    <Text style={styles.assignedText}>{issue.assignedTo}</Text>
                  </View>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        
        {filteredIssues.length === 0 && (
          <View style={styles.emptyState}>
            <MessageSquare size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No issues found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search or filters' : 'All issues have been resolved!'}
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Issues</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Issue Type</Text>
            <View style={styles.filterOptions}>
              {(['all', 'bug', 'feature', 'support', 'feedback'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    selectedType === type && styles.filterOptionActive
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedType === type && styles.filterOptionTextActive
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.modalFooter}>
            <Button
              title="Apply Filters"
              onPress={() => setShowFilters(false)}
              style={styles.applyButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  filterButton: {
    padding: 8,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  statusTabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 8,
  },
  statusTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    gap: 6,
  },
  statusTabActive: {
    backgroundColor: colors.accent.primary,
  },
  statusTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  statusTabTextActive: {
    color: colors.text.primary,
  },
  statusCount: {
    minWidth: 20,
    height: 16,
    paddingHorizontal: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  issueCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  issueTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueInfo: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  issueUser: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  issueMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  issueTime: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  issueBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  issueDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  moreTagsText: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  assignedTo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assignedText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  filterSection: {
    padding: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterOptionActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  filterOptionTextActive: {
    color: colors.text.primary,
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  applyButton: {
    width: '100%',
  },
});