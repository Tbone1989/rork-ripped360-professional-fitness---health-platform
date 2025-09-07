import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Target,
  Star,
  Zap,
  Calendar,
  Users,
  Award,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/ChipGroup';

interface ChallengeForm {
  title: string;
  description: string;
  type: 'fitness' | 'nutrition' | 'wellness' | '';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | '';
  duration: string;
  reward: string;
  rules: string[];
}

const challengeTypes = [
  { key: 'fitness', label: 'Fitness', icon: <Zap size={16} color={colors.accent.primary} /> },
  { key: 'nutrition', label: 'Nutrition', icon: <Target size={16} color={colors.status.success} /> },
  { key: 'wellness', label: 'Wellness', icon: <Star size={16} color={colors.status.warning} /> },
];

const difficultyLevels = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

const durationOptions = [
  { id: '7', label: '7 days' },
  { id: '14', label: '14 days' },
  { id: '21', label: '21 days' },
  { id: '30', label: '30 days' },
];

export default function CreateChallengeScreen() {
  const router = useRouter();
  const [form, setForm] = useState<ChallengeForm>({
    title: '',
    description: '',
    type: '',
    difficulty: '',
    duration: '',
    reward: '',
    rules: [''],
  });

  const handleInputChange = (field: keyof ChallengeForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeSelect = (type: string) => {
    setForm(prev => ({ ...prev, type: type as ChallengeForm['type'] }));
  };

  const handleDifficultySelect = (selectedIds: string[]) => {
    const difficulty = selectedIds[0] as ChallengeForm['difficulty'];
    setForm(prev => ({ ...prev, difficulty }));
  };

  const handleDurationSelect = (selectedIds: string[]) => {
    const duration = selectedIds[0];
    setForm(prev => ({ ...prev, duration }));
  };

  const addRule = () => {
    setForm(prev => ({ ...prev, rules: [...prev.rules, ''] }));
  };

  const updateRule = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule),
    }));
  };

  const removeRule = (index: number) => {
    if (form.rules.length > 1) {
      setForm(prev => ({
        ...prev,
        rules: prev.rules.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      Alert.alert('Error', 'Please enter a challenge title');
      return false;
    }
    if (!form.description.trim()) {
      Alert.alert('Error', 'Please enter a challenge description');
      return false;
    }
    if (!form.type) {
      Alert.alert('Error', 'Please select a challenge type');
      return false;
    }
    if (!form.difficulty) {
      Alert.alert('Error', 'Please select a difficulty level');
      return false;
    }
    if (!form.duration) {
      Alert.alert('Error', 'Please select a duration');
      return false;
    }
    if (!form.reward.trim()) {
      Alert.alert('Error', 'Please enter a reward');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Creating challenge:', form);
      Alert.alert(
        'Success',
        'Challenge created successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return colors.status.success;
      case 'intermediate': return colors.status.warning;
      case 'advanced': return colors.status.error;
      default: return colors.text.secondary;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Create Challenge',
          headerRight: () => (
            <Button
              title="Create"
              variant="primary"
              size="small"
              onPress={handleSubmit}
            />
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Challenge Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter challenge title..."
                placeholderTextColor={colors.text.secondary}
                value={form.title}
                onChangeText={(value) => handleInputChange('title', value)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Describe your challenge..."
                placeholderTextColor={colors.text.secondary}
                value={form.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={4}
              />
            </View>
          </Card>
          
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Challenge Type</Text>
            <View style={styles.typeGrid}>
              {challengeTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeCard,
                    form.type === type.key && styles.typeCardSelected,
                  ]}
                  onPress={() => handleTypeSelect(type.key)}
                >
                  {type.icon}
                  <Text style={[
                    styles.typeLabel,
                    form.type === type.key && styles.typeLabelSelected,
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
          
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Difficulty Level</Text>
            <ChipGroup
              options={difficultyLevels}
              selectedId={form.difficulty}
              onSelect={handleDifficultySelect}
              style={styles.chipGroup}
            />
          </Card>
          
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Duration</Text>
            <ChipGroup
              options={durationOptions}
              selectedId={form.duration}
              onSelect={handleDurationSelect}
              style={styles.chipGroup}
            />
          </Card>
          
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Reward</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Exclusive badge + 500 points"
                placeholderTextColor={colors.text.secondary}
                value={form.reward}
                onChangeText={(value) => handleInputChange('reward', value)}
              />
            </View>
          </Card>
          
          <Card style={styles.section}>
            <View style={styles.rulesHeader}>
              <Text style={styles.sectionTitle}>Rules & Guidelines</Text>
              <Button
                title="Add Rule"
                variant="outline"
                size="small"
                onPress={addRule}
              />
            </View>
            
            {form.rules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <TextInput
                  style={[styles.textInput, styles.ruleInput]}
                  placeholder={`Rule ${index + 1}...`}
                  placeholderTextColor={colors.text.secondary}
                  value={rule}
                  onChangeText={(value) => updateRule(index, value)}
                />
                {form.rules.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeRule(index)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </Card>
          
          <Card style={styles.previewCard}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.challengePreview}>
              <View style={styles.challengeHeader}>
                <View style={styles.challengeTypeContainer}>
                  {form.type && challengeTypes.find(t => t.key === form.type)?.icon}
                  <Text style={styles.challengeType}>{form.type || 'Type'}</Text>
                </View>
                {form.difficulty && (
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(form.difficulty) }
                  ]}>
                    <Text style={styles.difficultyText}>{form.difficulty}</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.challengeTitle}>
                {form.title || 'Challenge Title'}
              </Text>
              <Text style={styles.challengeDescription}>
                {form.description || 'Challenge description will appear here...'}
              </Text>
              
              <View style={styles.challengeStats}>
                <View style={styles.challengeStat}>
                  <Users size={16} color={colors.text.secondary} />
                  <Text style={styles.challengeStatText}>0 joined</Text>
                </View>
                <View style={styles.challengeStat}>
                  <Calendar size={16} color={colors.text.secondary} />
                  <Text style={styles.challengeStatText}>
                    {form.duration ? `${form.duration} days` : 'Duration'}
                  </Text>
                </View>
              </View>
              
              {form.reward && (
                <View style={styles.challengeReward}>
                  <Award size={16} color={colors.status.warning} />
                  <Text style={styles.challengeRewardText}>{form.reward}</Text>
                </View>
              )}
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    gap: 8,
  },
  typeCardSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.background.tertiary,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  typeLabelSelected: {
    color: colors.accent.primary,
  },
  chipGroup: {
    marginTop: 8,
  },
  rulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  ruleInput: {
    flex: 1,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.status.error,
    borderRadius: 4,
  },
  removeButtonText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '600',
  },
  previewCard: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: colors.background.secondary,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  challengePreview: {
    padding: 16,
    backgroundColor: colors.background.primary,
    borderRadius: 8,
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
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
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
  challengeReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  challengeRewardText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});