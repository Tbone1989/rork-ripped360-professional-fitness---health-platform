import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  CheckCircle,
  Circle,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  Scale,
  Activity,
  Heart,
  Zap,
  AlertTriangle,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CheckInQuestion {
  id: string;
  type: 'scale' | 'multiple_choice' | 'text' | 'boolean' | 'rating';
  question: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
}

interface CheckInResponse {
  questionId: string;
  value: string | number | boolean;
}

export default function CoachClientCheckInScreen() {
  const [responses, setResponses] = useState<CheckInResponse[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkInQuestions: CheckInQuestion[] = [
    {
      id: 'energy_level',
      type: 'scale',
      question: 'How would you rate your energy levels this week?',
      required: true,
      min: 1,
      max: 10
    },
    {
      id: 'sleep_quality',
      type: 'scale',
      question: 'How has your sleep quality been?',
      required: true,
      min: 1,
      max: 10
    },
    {
      id: 'workout_completion',
      type: 'multiple_choice',
      question: 'How many scheduled workouts did you complete this week?',
      required: true,
      options: ['0', '1', '2', '3', '4', '5', '6+']
    },
    {
      id: 'nutrition_adherence',
      type: 'scale',
      question: 'How well did you stick to your nutrition plan?',
      required: true,
      min: 1,
      max: 10
    },
    {
      id: 'stress_level',
      type: 'scale',
      question: 'What has your stress level been like?',
      required: true,
      min: 1,
      max: 10
    },
    {
      id: 'weight_change',
      type: 'multiple_choice',
      question: 'How has your weight changed this week?',
      required: false,
      options: ['Increased', 'Stayed the same', 'Decreased', 'Not sure']
    },
    {
      id: 'motivation_level',
      type: 'scale',
      question: 'How motivated are you feeling about your fitness goals?',
      required: true,
      min: 1,
      max: 10
    },
    {
      id: 'pain_discomfort',
      type: 'boolean',
      question: 'Have you experienced any pain or discomfort during workouts?',
      required: true
    },
    {
      id: 'challenges',
      type: 'text',
      question: 'What were your biggest challenges this week?',
      required: false,
      placeholder: 'Describe any challenges you faced...'
    },
    {
      id: 'wins',
      type: 'text',
      question: 'What were your biggest wins or achievements this week?',
      required: false,
      placeholder: 'Share your victories, no matter how small...'
    },
    {
      id: 'coach_support',
      type: 'text',
      question: 'How can your coach better support you next week?',
      required: false,
      placeholder: 'Any specific areas where you need more guidance...'
    }
  ];

  const getResponse = (questionId: string) => {
    return responses.find(r => r.questionId === questionId);
  };

  const updateResponse = (questionId: string, value: string | number | boolean) => {
    setResponses(prev => {
      const existing = prev.find(r => r.questionId === questionId);
      if (existing) {
        return prev.map(r => 
          r.questionId === questionId ? { ...r, value } : r
        );
      } else {
        return [...prev, { questionId, value }];
      }
    });
  };

  const handleNext = () => {
    const currentQuestion = checkInQuestions[currentStep];
    const response = getResponse(currentQuestion.id);
    
    if (currentQuestion.required && !response) {
      Alert.alert('Required Field', 'Please answer this question before continuing.');
      return;
    }
    
    if (currentStep < checkInQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Check-in Complete!',
        'Your responses have been sent to your coach. They will review and provide feedback soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back or to success screen
              console.log('Check-in submitted:', responses);
            }
          }
        ]
      );
    }, 2000);
  };

  const renderScaleQuestion = (question: CheckInQuestion) => {
    const response = getResponse(question.id);
    const value = response?.value as number || 0;
    
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.scaleContainer}>
          <Text style={styles.scaleLabel}>Low</Text>
          <View style={styles.scaleButtons}>
            {Array.from({ length: question.max! - question.min! + 1 }, (_, i) => {
              const scaleValue = question.min! + i;
              const isSelected = value === scaleValue;
              
              return (
                <TouchableOpacity
                  key={scaleValue}
                  style={[
                    styles.scaleButton,
                    isSelected && styles.scaleButtonSelected
                  ]}
                  onPress={() => updateResponse(question.id, scaleValue)}
                >
                  <Text style={[
                    styles.scaleButtonText,
                    isSelected && styles.scaleButtonTextSelected
                  ]}>
                    {scaleValue}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.scaleLabel}>High</Text>
        </View>
      </View>
    );
  };

  const renderMultipleChoiceQuestion = (question: CheckInQuestion) => {
    const response = getResponse(question.id);
    const value = response?.value as string;
    
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.optionsContainer}>
          {question.options!.map((option) => {
            const isSelected = value === option;
            
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected
                ]}
                onPress={() => updateResponse(question.id, option)}
              >
                <View style={styles.optionContent}>
                  {isSelected ? (
                    <CheckCircle size={20} color={colors.accent.primary} />
                  ) : (
                    <Circle size={20} color={colors.text.secondary} />
                  )}
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderBooleanQuestion = (question: CheckInQuestion) => {
    const response = getResponse(question.id);
    const value = response?.value as boolean;
    
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.booleanContainer}>
          <TouchableOpacity
            style={[
              styles.booleanButton,
              value === true && styles.booleanButtonSelected
            ]}
            onPress={() => updateResponse(question.id, true)}
          >
            <Text style={[
              styles.booleanButtonText,
              value === true && styles.booleanButtonTextSelected
            ]}>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.booleanButton,
              value === false && styles.booleanButtonSelected
            ]}
            onPress={() => updateResponse(question.id, false)}
          >
            <Text style={[
              styles.booleanButtonText,
              value === false && styles.booleanButtonTextSelected
            ]}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTextQuestion = (question: CheckInQuestion) => {
    const response = getResponse(question.id);
    const value = response?.value as string || '';
    
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        <Input
          value={value}
          onChangeText={(text) => updateResponse(question.id, text)}
          placeholder={question.placeholder}
          multiline
          numberOfLines={4}
          style={styles.textInput}
        />
      </View>
    );
  };

  const renderQuestion = (question: CheckInQuestion) => {
    switch (question.type) {
      case 'scale':
        return renderScaleQuestion(question);
      case 'multiple_choice':
        return renderMultipleChoiceQuestion(question);
      case 'boolean':
        return renderBooleanQuestion(question);
      case 'text':
        return renderTextQuestion(question);
      default:
        return null;
    }
  };

  const getQuestionIcon = (questionId: string) => {
    switch (questionId) {
      case 'energy_level':
        return <Zap size={24} color={colors.status.warning} />;
      case 'sleep_quality':
        return <Activity size={24} color={colors.accent.primary} />;
      case 'workout_completion':
        return <TrendingUp size={24} color={colors.status.success} />;
      case 'nutrition_adherence':
        return <Heart size={24} color={colors.status.error} />;
      case 'stress_level':
        return <AlertTriangle size={24} color={colors.status.warning} />;
      case 'weight_change':
        return <Scale size={24} color={colors.text.secondary} />;
      case 'motivation_level':
        return <TrendingUp size={24} color={colors.accent.primary} />;
      case 'pain_discomfort':
        return <AlertTriangle size={24} color={colors.status.error} />;
      default:
        return <MessageSquare size={24} color={colors.text.secondary} />;
    }
  };

  const currentQuestion = checkInQuestions[currentStep];
  const progress = ((currentStep + 1) / checkInQuestions.length) * 100;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Weekly Check-in',
          headerBackTitle: 'Back'
        }}
      />
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} of {checkInQuestions.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.questionIconContainer}>
              {getQuestionIcon(currentQuestion.id)}
            </View>
            <View style={styles.questionInfo}>
              <Text style={styles.questionTitle}>Question {currentStep + 1}</Text>
              {currentQuestion.required && (
                <Text style={styles.requiredText}>Required</Text>
              )}
            </View>
          </View>
          
          {renderQuestion(currentQuestion)}
        </Card>
      </ScrollView>

      <View style={styles.navigationContainer}>
        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <Button
              title="Previous"
              variant="outline"
              onPress={handlePrevious}
              style={styles.navButton}
            />
          )}
          <Button
            title={currentStep === checkInQuestions.length - 1 ? 'Submit Check-in' : 'Next'}
            onPress={handleNext}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={[styles.navButton, styles.nextButton]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  progressContainer: {
    padding: 24,
    paddingBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.secondary,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  questionCard: {
    padding: 24,
    marginBottom: 24,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  questionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionInfo: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  requiredText: {
    fontSize: 12,
    color: colors.status.error,
    fontWeight: '500',
  },
  questionContainer: {
    gap: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 26,
  },
  scaleContainer: {
    alignItems: 'center',
    gap: 16,
  },
  scaleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  scaleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleButtonSelected: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  scaleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  scaleButtonTextSelected: {
    color: colors.text.primary,
  },
  scaleLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  optionButtonSelected: {
    backgroundColor: `${colors.accent.primary}15`,
    borderColor: colors.accent.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  booleanContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  booleanButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  booleanButtonSelected: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  booleanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  booleanButtonTextSelected: {
    color: colors.text.primary,
  },
  textInput: {
    minHeight: 100,
  },
  navigationContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});