import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  MessageSquare,
  Bug,
  Lightbulb,
  HelpCircle,
  Send,
  Camera,
  Paperclip,
  CheckCircle,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface IssueType {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

export default function ReportIssueScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const issueTypes: IssueType[] = [
    {
      id: 'bug',
      title: 'Bug Report',
      description: 'Something is not working correctly',
      icon: Bug,
      color: colors.status.error
    },
    {
      id: 'feature',
      title: 'Feature Request',
      description: 'Suggest a new feature or improvement',
      icon: Lightbulb,
      color: colors.status.info
    },
    {
      id: 'support',
      title: 'Need Help',
      description: 'Get assistance with using the app',
      icon: HelpCircle,
      color: colors.status.warning
    },
    {
      id: 'feedback',
      title: 'General Feedback',
      description: 'Share your thoughts and suggestions',
      icon: MessageSquare,
      color: colors.status.success
    }
  ];

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Missing Information', 'Please select an issue type.');
      return;
    }
    
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please provide a title for your issue.');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please describe your issue in detail.');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Missing Information', 'Please provide your email address so we can follow up.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Issue Submitted Successfully!',
        'Thank you for your feedback. Our team will review your submission and get back to you within 24-48 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setSelectedType('');
              setTitle('');
              setDescription('');
              setEmail('');
              router.back();
            }
          }
        ]
      );
    }, 2000);
  };

  const getSelectedType = () => {
    return issueTypes.find(type => type.id === selectedType);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Report Issue',
          headerBackTitle: 'Back'
        }}
      />
      
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MessageSquare size={32} color={colors.accent.primary} />
        </View>
        <Text style={styles.title}>How can we help?</Text>
        <Text style={styles.subtitle}>
          Let us know about any issues, suggestions, or feedback you have
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What type of issue is this?</Text>
          <View style={styles.typeGrid}>
            {issueTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.typeCardSelected
                ]}
                onPress={() => setSelectedType(type.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.typeIcon, { backgroundColor: `${type.color}20` }]}>
                  <type.icon size={24} color={type.color} />
                </View>
                <Text style={[
                  styles.typeTitle,
                  selectedType === type.id && styles.typeTitleSelected
                ]}>
                  {type.title}
                </Text>
                <Text style={styles.typeDescription}>{type.description}</Text>
                {selectedType === type.id && (
                  <View style={styles.selectedIndicator}>
                    <CheckCircle size={20} color={colors.accent.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedType && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Issue Details</Text>
              <Card style={styles.formCard}>
                <Input
                  label="Title"
                  placeholder={`Brief summary of your ${getSelectedType()?.title.toLowerCase()}`}
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                />
                
                <Input
                  label="Description"
                  placeholder="Please provide as much detail as possible. Include steps to reproduce if it's a bug, or explain your idea if it's a feature request."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={6}
                  style={styles.textArea}
                />
                
                <Input
                  label="Email Address"
                  placeholder="your.email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </Card>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <Card style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Camera size={20} color={colors.text.secondary} />
                  <Text style={styles.infoText}>
                    Screenshots help us understand issues better
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Paperclip size={20} color={colors.text.secondary} />
                  <Text style={styles.infoText}>
                    Include device model and app version if relevant
                  </Text>
                </View>
              </Card>
            </View>

            <View style={styles.submitSection}>
              <Button
                title="Submit Issue"
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                icon={<Send size={18} color={colors.text.primary} />}
                style={styles.submitButton}
              />
              <Text style={styles.submitNote}>
                We typically respond within 24-48 hours. For urgent issues, please contact support directly.
              </Text>
            </View>
          </>
        )}
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
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.accent.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  typeGrid: {
    gap: 16,
  },
  typeCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: colors.border.light,
    position: 'relative',
  },
  typeCardSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: `${colors.accent.primary}08`,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  typeTitleSelected: {
    color: colors.accent.primary,
  },
  typeDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  formCard: {
    padding: 20,
    gap: 16,
  },
  input: {
    marginBottom: 0,
  },
  textArea: {
    minHeight: 120,
    marginBottom: 0,
  },
  infoCard: {
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  submitSection: {
    marginBottom: 32,
  },
  submitButton: {
    width: '100%',
    marginBottom: 16,
  },
  submitNote: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});