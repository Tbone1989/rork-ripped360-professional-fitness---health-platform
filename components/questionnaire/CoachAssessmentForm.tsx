import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Plus,
  Trash2,
  FileText,
  User,
  Heart
} from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

import { 
  ClientQuestionnaire,
  CoachAssessmentForm as CoachAssessmentFormType,
  RiskAssessment,
  Recommendation
} from '@/types/questionnaire';

interface CoachAssessmentFormProps {
  questionnaire: ClientQuestionnaire;
  onSubmit: (assessment: CoachAssessmentFormType) => void;
  initialData?: Partial<CoachAssessmentFormType>;
}

export default function CoachAssessmentForm({ 
  questionnaire, 
  onSubmit, 
  initialData 
}: CoachAssessmentFormProps) {
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment>({
    overallRisk: initialData?.riskAssessment?.overallRisk || 'low',
    medicalRisks: initialData?.riskAssessment?.medicalRisks || [],
    injuryRisks: initialData?.riskAssessment?.injuryRisks || [],
    medicationInteractions: initialData?.riskAssessment?.medicationInteractions || [],
    supplementConcerns: initialData?.riskAssessment?.supplementConcerns || [],
    exerciseRestrictions: initialData?.riskAssessment?.exerciseRestrictions || [],
    monitoringRequired: initialData?.riskAssessment?.monitoringRequired || [],
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    initialData?.recommendations || []
  );

  const [clearanceStatus, setClearanceStatus] = useState<'cleared' | 'conditional' | 'medical-referral-required'>(
    initialData?.clearanceStatus || 'cleared'
  );

  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [followUpRequired, setFollowUpRequired] = useState<boolean>(
    initialData?.followUpRequired || false
  );
  const [followUpDate, setFollowUpDate] = useState<string>(
    initialData?.followUpDate || ''
  );

  const addRecommendation = () => {
    const newRecommendation: Recommendation = {
      category: 'training',
      priority: 'medium',
      recommendation: '',
      rationale: '',
      timeframe: '',
    };
    setRecommendations([...recommendations, newRecommendation]);
  };

  const removeRecommendation = (index: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const updateRecommendation = (index: number, field: keyof Recommendation, value: any) => {
    const updated = [...recommendations];
    updated[index] = { ...updated[index], [field]: value };
    setRecommendations(updated);
  };



  const removeRiskItem = (category: keyof RiskAssessment, index: number) => {
    const currentItems = riskAssessment[category] as string[];
    setRiskAssessment({
      ...riskAssessment,
      [category]: currentItems.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = () => {
    if (!notes.trim()) {
      Alert.alert('Missing Information', 'Please provide assessment notes.');
      return;
    }

    if (clearanceStatus === 'medical-referral-required' && recommendations.length === 0) {
      Alert.alert(
        'Medical Referral Required', 
        'Please add recommendations for medical referral.'
      );
      return;
    }

    const assessment: CoachAssessmentFormType = {
      id: initialData?.id || `assessment_${Date.now()}`,
      coachId: initialData?.coachId || 'current_coach',
      clientId: questionnaire.clientId,
      questionnaireId: questionnaire.id,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      riskAssessment,
      recommendations,
      clearanceStatus,
      notes,
      followUpRequired,
      followUpDate: followUpRequired ? followUpDate : undefined,
    };

    onSubmit(assessment);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#34C759';
      case 'moderate': return '#FF9500';
      case 'high': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getClearanceIcon = () => {
    switch (clearanceStatus) {
      case 'cleared': return <CheckCircle size={24} color="#34C759" />;
      case 'conditional': return <AlertTriangle size={24} color="#FF9500" />;
      case 'medical-referral-required': return <XCircle size={24} color="#FF3B30" />;
    }
  };

  const renderClientSummary = () => (
    <Card style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <User size={24} color="#007AFF" />
        <Text style={styles.summaryTitle}>Client Summary</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Age:</Text>
        <Text style={styles.summaryValue}>{questionnaire.personalInfo.age}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Gender:</Text>
        <Text style={styles.summaryValue}>{questionnaire.personalInfo.gender}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Activity Level:</Text>
        <Text style={styles.summaryValue}>{questionnaire.personalInfo.activityLevel}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Primary Goal:</Text>
        <Text style={styles.summaryValue}>{questionnaire.fitnessGoals.primaryGoal}</Text>
      </View>

      {questionnaire.currentMedications.length > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Medications:</Text>
          <Text style={styles.summaryValue}>
            {questionnaire.currentMedications.length} current
          </Text>
        </View>
      )}

      {questionnaire.injuries.length > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Injuries:</Text>
          <Text style={styles.summaryValue}>
            {questionnaire.injuries.length} reported
          </Text>
        </View>
      )}

      {questionnaire.healthHistory.chronicConditions.length > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Conditions:</Text>
          <Text style={styles.summaryValue}>
            {questionnaire.healthHistory.chronicConditions.join(', ')}
          </Text>
        </View>
      )}
    </Card>
  );

  const renderRiskAssessment = () => (
    <Card style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Heart size={24} color="#FF3B30" />
        <Text style={styles.sectionTitle}>Risk Assessment</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Overall Risk Level</Text>
        <View style={styles.radioGroup}>
          {['low', 'moderate', 'high'].map((risk) => (
            <Button
              key={risk}
              title={risk.toUpperCase()}
              onPress={() => setRiskAssessment({...riskAssessment, overallRisk: risk as any})}
              variant={riskAssessment.overallRisk === risk ? 'primary' : 'outline'}
              style={[
                styles.riskButton,
                { borderColor: getRiskColor(risk) }
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.riskSection}>
        <Text style={styles.riskSectionTitle}>Medical Risks</Text>
        <View style={styles.riskItems}>
          {riskAssessment.medicalRisks.map((risk, index) => (
            <View key={index} style={styles.riskItem}>
              <Text style={styles.riskItemText}>{risk}</Text>
              <Button
                title=""
                onPress={() => removeRiskItem('medicalRisks', index)}
                variant="outline"
                icon={<Trash2 size={14} color="#FF3B30" />}
                style={styles.removeButton}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.riskSection}>
        <Text style={styles.riskSectionTitle}>Injury Risks</Text>
        <View style={styles.riskItems}>
          {riskAssessment.injuryRisks.map((risk, index) => (
            <View key={index} style={styles.riskItem}>
              <Text style={styles.riskItemText}>{risk}</Text>
              <Button
                title=""
                onPress={() => removeRiskItem('injuryRisks', index)}
                variant="outline"
                icon={<Trash2 size={14} color="#FF3B30" />}
                style={styles.removeButton}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.riskSection}>
        <Text style={styles.riskSectionTitle}>Exercise Restrictions</Text>
        <View style={styles.riskItems}>
          {riskAssessment.exerciseRestrictions.map((restriction, index) => (
            <View key={index} style={styles.riskItem}>
              <Text style={styles.riskItemText}>{restriction}</Text>
              <Button
                title=""
                onPress={() => removeRiskItem('exerciseRestrictions', index)}
                variant="outline"
                icon={<Trash2 size={14} color="#FF3B30" />}
                style={styles.removeButton}
              />
            </View>
          ))}
        </View>
      </View>
    </Card>
  );

  const renderRecommendations = () => (
    <Card style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <FileText size={24} color="#007AFF" />
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <Button
          title="Add"
          onPress={addRecommendation}
          variant="outline"
          icon={<Plus size={16} color="#007AFF" />}
        />
      </View>

      {recommendations.map((recommendation, index) => (
        <Card key={index} style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Text style={styles.recommendationTitle}>Recommendation {index + 1}</Text>
            <Button
              title=""
              onPress={() => removeRecommendation(index)}
              variant="outline"
              icon={<Trash2 size={16} color="#FF3B30" />}
              style={styles.deleteButton}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.radioGroup}>
              {['medical', 'nutrition', 'training', 'lifestyle', 'supplement'].map((category) => (
                <Button
                  key={category}
                  title={category.toUpperCase()}
                  onPress={() => updateRecommendation(index, 'category', category)}
                  variant={recommendation.category === category ? 'primary' : 'outline'}
                  style={styles.categoryButton}
                />
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.radioGroup}>
              {['low', 'medium', 'high', 'urgent'].map((priority) => (
                <Button
                  key={priority}
                  title={priority.toUpperCase()}
                  onPress={() => updateRecommendation(index, 'priority', priority)}
                  variant={recommendation.priority === priority ? 'primary' : 'outline'}
                  style={styles.priorityButton}
                />
              ))}
            </View>
          </View>

          <Input
            label="Recommendation"
            value={recommendation.recommendation}
            onChangeText={(text) => updateRecommendation(index, 'recommendation', text)}
            placeholder="Enter specific recommendation"
            multiline
          />

          <Input
            label="Rationale"
            value={recommendation.rationale}
            onChangeText={(text) => updateRecommendation(index, 'rationale', text)}
            placeholder="Explain the reasoning behind this recommendation"
            multiline
          />

          <Input
            label="Timeframe (optional)"
            value={recommendation.timeframe || ''}
            onChangeText={(text) => updateRecommendation(index, 'timeframe', text)}
            placeholder="e.g., within 2 weeks, before starting program"
          />
        </Card>
      ))}
    </Card>
  );

  const renderClearanceDecision = () => (
    <Card style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        {getClearanceIcon()}
        <Text style={styles.sectionTitle}>Clearance Decision</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Clearance Status</Text>
        <View style={styles.radioGroup}>
          {[
            { key: 'cleared', label: 'Cleared', color: '#34C759' },
            { key: 'conditional', label: 'Conditional', color: '#FF9500' },
            { key: 'medical-referral-required', label: 'Medical Referral', color: '#FF3B30' },
          ].map((status) => (
            <Button
              key={status.key}
              title={status.label}
              onPress={() => setClearanceStatus(status.key as any)}
              variant={clearanceStatus === status.key ? 'primary' : 'outline'}
              style={[
                styles.clearanceButton,
                { borderColor: status.color }
              ]}
            />
          ))}
        </View>
      </View>

      <Input
        label="Assessment Notes"
        value={notes}
        onChangeText={setNotes}
        placeholder="Provide detailed assessment notes and any additional observations"
        multiline
        numberOfLines={4}
      />

      <View style={styles.followUpSection}>
        <View style={styles.checkboxRow}>
          <Button
            title={followUpRequired ? 'Follow-up Required' : 'No Follow-up Needed'}
            onPress={() => setFollowUpRequired(!followUpRequired)}
            variant={followUpRequired ? 'primary' : 'outline'}
            icon={followUpRequired ? <CheckCircle size={16} color="#FFFFFF" /> : undefined}
          />
        </View>

        {followUpRequired && (
          <Input
            label="Follow-up Date"
            value={followUpDate}
            onChangeText={setFollowUpDate}
            placeholder="MM/DD/YYYY"
          />
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Coach Assessment',
          headerBackTitle: 'Back'
        }} 
      />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderClientSummary()}
          {renderRiskAssessment()}
          {renderRecommendations()}
          {renderClearanceDecision()}
        </ScrollView>

        <View style={styles.submitContainer}>
          <Button
            title="Submit Assessment"
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '600',
  },
  sectionCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 8,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  riskButton: {
    minWidth: 80,
  },
  riskSection: {
    marginBottom: 16,
  },
  riskSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  riskItems: {
    marginBottom: 8,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  riskItemText: {
    flex: 1,
    fontSize: 14,
    color: '#1C1C1E',
  },
  removeButton: {
    width: 32,
    height: 32,
    marginLeft: 8,
  },
  recommendationCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F8F9FA',
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  deleteButton: {
    width: 36,
    height: 36,
  },
  categoryButton: {
    minWidth: 80,
    marginBottom: 4,
  },
  priorityButton: {
    minWidth: 70,
    marginBottom: 4,
  },
  clearanceButton: {
    minWidth: 100,
    marginBottom: 8,
  },
  followUpSection: {
    marginTop: 16,
  },
  checkboxRow: {
    marginBottom: 12,
  },
  submitContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  submitButton: {
    width: '100%',
  },
});