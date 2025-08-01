import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Book, 
  HelpCircle, 
  FileText, 
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Video
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SupportScreen() {
  const handleContactSupport = (method: string) => {
    switch (method) {
      case 'email':
        Linking.openURL('mailto:support@ripped360.com');
        break;
      case 'phone':
        Linking.openURL('tel:+1-800-RIPPED');
        break;
      case 'chat':
        Alert.alert('Live Chat', 'Live chat feature coming soon!');
        break;
      case 'video':
        Alert.alert('Video Call', 'Video support coming soon!');
        break;
    }
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const ContactOption = ({ 
    icon, 
    title, 
    description, 
    onPress 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.contactOption} onPress={onPress}>
      <View style={styles.contactIcon}>
        {icon}
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactDescription}>{description}</Text>
      </View>
      <ChevronRight size={20} color={colors.text.tertiary} />
    </TouchableOpacity>
  );

  const HelpItem = ({ 
    icon, 
    title, 
    description, 
    onPress 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.helpItem} onPress={onPress}>
      <View style={styles.helpIcon}>
        {icon}
      </View>
      <View style={styles.helpContent}>
        <Text style={styles.helpTitle}>{title}</Text>
        <Text style={styles.helpDescription}>{description}</Text>
      </View>
      <ExternalLink size={16} color={colors.text.tertiary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Help & Support' }} />

      {/* Contact Support */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <Text style={styles.sectionDescription}>
          Our support team is here to help you 24/7
        </Text>
        
        <ContactOption
          icon={<MessageSquare size={20} color={colors.accent.primary} />}
          title="Live Chat"
          description="Chat with our support team instantly"
          onPress={() => handleContactSupport('chat')}
        />
        
        <ContactOption
          icon={<Mail size={20} color={colors.status.info} />}
          title="Email Support"
          description="support@ripped360.com"
          onPress={() => handleContactSupport('email')}
        />
        
        <ContactOption
          icon={<Phone size={20} color={colors.status.success} />}
          title="Phone Support"
          description="+1 (800) RIPPED - Available 24/7"
          onPress={() => handleContactSupport('phone')}
        />
        
        <ContactOption
          icon={<Video size={20} color={colors.accent.secondary} />}
          title="Video Call"
          description="Schedule a video call with our experts"
          onPress={() => handleContactSupport('video')}
        />
      </Card>

      {/* Help Resources */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Help Resources</Text>
        
        <HelpItem
          icon={<Book size={20} color={colors.accent.primary} />}
          title="User Guide"
          description="Complete guide to using Ripped360"
          onPress={() => handleOpenLink('https://help.ripped360.com/guide')}
        />
        
        <HelpItem
          icon={<HelpCircle size={20} color={colors.status.info} />}
          title="FAQ"
          description="Frequently asked questions and answers"
          onPress={() => handleOpenLink('https://help.ripped360.com/faq')}
        />
        
        <HelpItem
          icon={<FileText size={20} color={colors.status.warning} />}
          title="Workout Tutorials"
          description="Video tutorials for exercises and workouts"
          onPress={() => handleOpenLink('https://help.ripped360.com/tutorials')}
        />
        
        <HelpItem
          icon={<MessageCircle size={20} color={colors.accent.secondary} />}
          title="Community Forum"
          description="Connect with other users and share tips"
          onPress={() => handleOpenLink('https://community.ripped360.com')}
        />
      </Card>

      {/* Quick Help */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Help</Text>
        
        <View style={styles.quickHelpGrid}>
          <TouchableOpacity 
            style={styles.quickHelpItem}
            onPress={() => Alert.alert('Getting Started', 'Welcome to Ripped360! Here are some quick tips to get you started...')}
          >
            <Text style={styles.quickHelpTitle}>Getting Started</Text>
            <Text style={styles.quickHelpDescription}>New to Ripped360?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickHelpItem}
            onPress={() => Alert.alert('Workout Help', 'Learn how to create and customize your workouts...')}
          >
            <Text style={styles.quickHelpTitle}>Workout Help</Text>
            <Text style={styles.quickHelpDescription}>Creating workouts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickHelpItem}
            onPress={() => Alert.alert('Coaching Help', 'Find and connect with certified coaches...')}
          >
            <Text style={styles.quickHelpTitle}>Coaching Help</Text>
            <Text style={styles.quickHelpDescription}>Finding coaches</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickHelpItem}
            onPress={() => Alert.alert('Medical Help', 'Upload and track your health data...')}
          >
            <Text style={styles.quickHelpTitle}>Medical Help</Text>
            <Text style={styles.quickHelpDescription}>Health tracking</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* App Information */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Build</Text>
          <Text style={styles.infoValue}>2024.01.15</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Platform</Text>
          <Text style={styles.infoValue}>React Native</Text>
        </View>
      </Card>

      {/* Emergency Contact */}
      <Card style={[styles.section, styles.emergencyCard]}>
        <Text style={styles.emergencyTitle}>Medical Emergency</Text>
        <Text style={styles.emergencyDescription}>
          If you're experiencing a medical emergency, please contact emergency services immediately.
        </Text>
        <Button
          title="Call Emergency Services"
          onPress={() => Linking.openURL('tel:911')}
          style={styles.emergencyButton}
        />
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Ripped City Inc. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  section: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  helpIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  quickHelpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickHelpItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.tertiary,
    padding: 16,
    borderRadius: 12,
  },
  quickHelpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  quickHelpDescription: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  emergencyCard: {
    borderColor: colors.status.error,
    borderWidth: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.status.error,
    marginBottom: 8,
  },
  emergencyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: colors.status.error,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
});