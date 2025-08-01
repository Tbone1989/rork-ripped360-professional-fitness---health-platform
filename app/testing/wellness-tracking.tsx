import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Moon, 
  Brain, 
  Heart, 
  Thermometer, 
  Activity, 
  Plus, 
  TrendingUp,
  Calendar,
  Clock,
  Zap,
  Droplets,
  Pill
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { useWellnessStore } from '@/store/wellnessStore';

const wellnessCategories = [
  { id: 'sleep', label: 'Sleep Quality' },
  { id: 'stress', label: 'Stress Levels' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'hormones', label: 'Hormones' },
  { id: 'supplements', label: 'Supplements' }
];

const stressTriggers = [
  'Work pressure', 'Lack of sleep', 'Poor nutrition', 'Overtraining',
  'Relationship issues', 'Financial concerns', 'Health issues', 'Time pressure'
];

const stressSymptoms = [
  'Headache', 'Muscle tension', 'Fatigue', 'Irritability',
  'Anxiety', 'Poor concentration', 'Sleep issues', 'Appetite changes'
];

export default function WellnessTracking() {
  const router = useRouter();
  const { 
    sleepData, 
    stressData, 
    recoveryMetrics, 
    hormoneData,
    wellnessGoals,
    addSleepData, 
    addStressData, 
    addRecoveryMetrics,
    addHormoneData,
    updateWellnessGoals
  } = useWellnessStore();
  
  const [activeCategory, setActiveCategory] = useState('sleep');
  const [sleepForm, setSleepForm] = useState({
    bedTime: '',
    wakeTime: '',
    quality: 3,
    notes: ''
  });
  const [stressForm, setStressForm] = useState({
    level: 3,
    selectedTriggers: [] as string[],
    selectedSymptoms: [] as string[],
    notes: ''
  });
  const [recoveryForm, setRecoveryForm] = useState({
    heartRateVariability: '',
    restingHeartRate: '',
    bodyTemperature: '',
    muscleStiffness: 3,
    energyLevel: 3,
    motivation: 3
  });

  const handleSleepSubmit = () => {
    if (!sleepForm.bedTime || !sleepForm.wakeTime) {
      Alert.alert('Error', 'Please enter both bed time and wake time');
      return;
    }
    
    // Calculate duration (simplified)
    const duration = 480; // 8 hours in minutes - would calculate from actual times
    
    addSleepData({
      date: new Date().toISOString().split('T')[0],
      bedTime: sleepForm.bedTime,
      wakeTime: sleepForm.wakeTime,
      duration,
      quality: sleepForm.quality as 1 | 2 | 3 | 4 | 5,
      deepSleep: 25,
      remSleep: 20,
      lightSleep: 55,
      awakenings: 2,
      notes: sleepForm.notes
    });
    
    setSleepForm({ bedTime: '', wakeTime: '', quality: 3, notes: '' });
    Alert.alert('Success', 'Sleep data recorded');
  };

  const handleStressSubmit = () => {
    addStressData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      level: stressForm.level as 1 | 2 | 3 | 4 | 5,
      triggers: stressForm.selectedTriggers,
      symptoms: stressForm.selectedSymptoms,
      copingStrategies: [],
      notes: stressForm.notes
    });
    
    setStressForm({ level: 3, selectedTriggers: [], selectedSymptoms: [], notes: '' });
    Alert.alert('Success', 'Stress data recorded');
  };

  const handleRecoverySubmit = () => {
    addRecoveryMetrics({
      date: new Date().toISOString().split('T')[0],
      heartRateVariability: parseFloat(recoveryForm.heartRateVariability) || 0,
      restingHeartRate: parseFloat(recoveryForm.restingHeartRate) || 0,
      bodyTemperature: parseFloat(recoveryForm.bodyTemperature) || 0,
      muscleStiffness: recoveryForm.muscleStiffness as 1 | 2 | 3 | 4 | 5,
      energyLevel: recoveryForm.energyLevel as 1 | 2 | 3 | 4 | 5,
      motivation: recoveryForm.motivation as 1 | 2 | 3 | 4 | 5,
      overallRecovery: Math.round((recoveryForm.energyLevel + recoveryForm.motivation + (6 - recoveryForm.muscleStiffness)) / 3) as 1 | 2 | 3 | 4 | 5
    });
    
    setRecoveryForm({
      heartRateVariability: '',
      restingHeartRate: '',
      bodyTemperature: '',
      muscleStiffness: 3,
      energyLevel: 3,
      motivation: 3
    });
    Alert.alert('Success', 'Recovery metrics recorded');
  };

  const getRecentAverage = (data: any[], field: string) => {
    if (data.length === 0) return 0;
    const recent = data.slice(-7); // Last 7 entries
    return recent.reduce((sum, item) => sum + (item[field] || 0), 0) / recent.length;
  };

  const renderStarRating = (value: number, onChange: (value: number) => void) => {
    return (
      <View style={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onChange(star)}
            style={styles.star}
          >
            <Text style={[
              styles.starText,
              star <= value && styles.starActive
            ]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'Wellness Tracking',
          headerStyle: { backgroundColor: colors.background.primary },
        }} 
      />

      {/* Category Selection */}
      <Card style={styles.categoryCard}>
        <Text style={styles.sectionTitle}>Wellness Categories</Text>
        <ChipGroup
          options={wellnessCategories}
          selectedIds={[activeCategory]}
          onChange={(ids) => {
            console.log('Wellness category changed to:', ids);
            setActiveCategory(ids[0] || 'sleep');
          }}
          scrollable={false}
          style={styles.categoryChips}
        />
      </Card>

      {/* Overview Stats */}
      <Card style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Recent Averages (7 days)</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Moon size={20} color={colors.status.info} />
            <Text style={styles.statValue}>{getRecentAverage(sleepData, 'quality').toFixed(1)}/5</Text>
            <Text style={styles.statLabel}>Sleep Quality</Text>
          </View>
          
          <View style={styles.statItem}>
            <Brain size={20} color={colors.status.warning} />
            <Text style={styles.statValue}>{getRecentAverage(stressData, 'level').toFixed(1)}/5</Text>
            <Text style={styles.statLabel}>Stress Level</Text>
          </View>
          
          <View style={styles.statItem}>
            <Activity size={20} color={colors.status.success} />
            <Text style={styles.statValue}>{getRecentAverage(recoveryMetrics, 'overallRecovery').toFixed(1)}/5</Text>
            <Text style={styles.statLabel}>Recovery</Text>
          </View>
          
          <View style={styles.statItem}>
            <Heart size={20} color={colors.accent.primary} />
            <Text style={styles.statValue}>{Math.round(getRecentAverage(recoveryMetrics, 'restingHeartRate'))}</Text>
            <Text style={styles.statLabel}>Resting HR</Text>
          </View>
        </View>
      </Card>

      {/* Sleep Quality Tracking */}
      {activeCategory === 'sleep' && (
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <Moon size={20} color={colors.status.info} />
            <Text style={styles.sectionTitle}>Sleep Quality</Text>
          </View>
          
          <View style={styles.formRow}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Bed Time</Text>
              <Input
                placeholder="10:30 PM"
                value={sleepForm.bedTime}
                onChangeText={(text) => setSleepForm(prev => ({ ...prev, bedTime: text }))}
                style={styles.timeInput}
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Wake Time</Text>
              <Input
                placeholder="6:30 AM"
                value={sleepForm.wakeTime}
                onChangeText={(text) => setSleepForm(prev => ({ ...prev, wakeTime: text }))}
                style={styles.timeInput}
              />
            </View>
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Sleep Quality (1-5)</Text>
            {renderStarRating(sleepForm.quality, (value) => 
              setSleepForm(prev => ({ ...prev, quality: value }))
            )}
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Notes (optional)</Text>
            <Input
              placeholder="How did you sleep? Any disturbances?"
              value={sleepForm.notes}
              onChangeText={(text) => setSleepForm(prev => ({ ...prev, notes: text }))}
              multiline
              style={styles.notesInput}
            />
          </View>
          
          <Button
            title="Record Sleep Data"
            onPress={handleSleepSubmit}
            icon={<Plus size={18} color={colors.text.primary} />}
            style={styles.submitButton}
          />
        </Card>
      )}

      {/* Stress Level Tracking */}
      {activeCategory === 'stress' && (
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <Brain size={20} color={colors.status.warning} />
            <Text style={styles.sectionTitle}>Stress Levels</Text>
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Current Stress Level (1-5)</Text>
            {renderStarRating(stressForm.level, (value) => 
              setStressForm(prev => ({ ...prev, level: value }))
            )}
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Stress Triggers</Text>
            <ChipGroup
              options={stressTriggers.map(trigger => ({ id: trigger, label: trigger }))}
              selectedIds={stressForm.selectedTriggers}
              onChange={(ids) => {
                console.log('Stress triggers changed to:', ids);
                setStressForm(prev => ({ ...prev, selectedTriggers: ids }));
              }}
              multiSelect
              scrollable={false}
              style={styles.triggerChips}
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Symptoms</Text>
            <ChipGroup
              options={stressSymptoms.map(symptom => ({ id: symptom, label: symptom }))}
              selectedIds={stressForm.selectedSymptoms}
              onChange={(ids) => {
                console.log('Stress symptoms changed to:', ids);
                setStressForm(prev => ({ ...prev, selectedSymptoms: ids }));
              }}
              multiSelect
              scrollable={false}
              style={styles.symptomChips}
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Additional Notes</Text>
            <Input
              placeholder="What's causing stress today?"
              value={stressForm.notes}
              onChangeText={(text) => setStressForm(prev => ({ ...prev, notes: text }))}
              multiline
              style={styles.notesInput}
            />
          </View>
          
          <Button
            title="Record Stress Data"
            onPress={handleStressSubmit}
            icon={<Plus size={18} color={colors.text.primary} />}
            style={styles.submitButton}
          />
        </Card>
      )}

      {/* Recovery Metrics */}
      {activeCategory === 'recovery' && (
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <Activity size={20} color={colors.status.success} />
            <Text style={styles.sectionTitle}>Recovery Metrics</Text>
          </View>
          
          <View style={styles.formRow}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>HRV (ms)</Text>
              <Input
                placeholder="45"
                value={recoveryForm.heartRateVariability}
                onChangeText={(text) => setRecoveryForm(prev => ({ ...prev, heartRateVariability: text }))}
                keyboardType="numeric"
                style={styles.numberInput}
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Resting HR</Text>
              <Input
                placeholder="65"
                value={recoveryForm.restingHeartRate}
                onChangeText={(text) => setRecoveryForm(prev => ({ ...prev, restingHeartRate: text }))}
                keyboardType="numeric"
                style={styles.numberInput}
              />
            </View>
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Body Temperature (°F)</Text>
            <Input
              placeholder="98.6"
              value={recoveryForm.bodyTemperature}
              onChangeText={(text) => setRecoveryForm(prev => ({ ...prev, bodyTemperature: text }))}
              keyboardType="numeric"
              style={styles.numberInput}
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Muscle Stiffness (1-5)</Text>
            {renderStarRating(recoveryForm.muscleStiffness, (value) => 
              setRecoveryForm(prev => ({ ...prev, muscleStiffness: value }))
            )}
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Energy Level (1-5)</Text>
            {renderStarRating(recoveryForm.energyLevel, (value) => 
              setRecoveryForm(prev => ({ ...prev, energyLevel: value }))
            )}
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Motivation (1-5)</Text>
            {renderStarRating(recoveryForm.motivation, (value) => 
              setRecoveryForm(prev => ({ ...prev, motivation: value }))
            )}
          </View>
          
          <Button
            title="Record Recovery Data"
            onPress={handleRecoverySubmit}
            icon={<Plus size={18} color={colors.text.primary} />}
            style={styles.submitButton}
          />
        </Card>
      )}

      {/* Hormone Tracking */}
      {activeCategory === 'hormones' && (
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <Thermometer size={20} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>Hormone Tracking</Text>
          </View>
          
          <Text style={styles.comingSoon}>Hormone tracking coming soon...</Text>
          <Text style={styles.comingSoonDesc}>
            Upload bloodwork results to track testosterone, cortisol, thyroid hormones, and more.
          </Text>
          
          <Button
            title="Upload Bloodwork"
            variant="outline"
            onPress={() => router.push('/medical/upload')}
            icon={<Plus size={18} color={colors.accent.primary} />}
            style={styles.uploadButton}
          />
        </Card>
      )}

      {/* Supplement Interactions */}
      {activeCategory === 'supplements' && (
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <Pill size={20} color={colors.status.info} />
            <Text style={styles.sectionTitle}>Supplement Interactions</Text>
          </View>
          
          <Text style={styles.comingSoon}>Supplement interaction checker coming soon...</Text>
          <Text style={styles.comingSoonDesc}>
            Check for interactions between supplements, medications, and hormones.
          </Text>
          
          <Button
            title="View Supplements"
            variant="outline"
            onPress={() => router.push('/(tabs)/medical')}
            icon={<Pill size={18} color={colors.accent.primary} />}
            style={styles.uploadButton}
          />
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionButtons}>
          <Button
            title="View Trends"
            variant="outline"
            onPress={() => Alert.alert('Coming Soon', 'Wellness trends and analytics')}
            icon={<TrendingUp size={18} color={colors.accent.primary} />}
            style={styles.actionButton}
          />
          
          <Button
            title="Set Goals"
            variant="outline"
            onPress={() => Alert.alert('Coming Soon', 'Set wellness goals and reminders')}
            icon={<Calendar size={18} color={colors.accent.primary} />}
            style={styles.actionButton}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  categoryCard: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  categoryChips: {
    marginBottom: 0,
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  formCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formField: {
    flex: 1,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  timeInput: {
    marginBottom: 0,
  },
  numberInput: {
    marginBottom: 0,
  },
  notesInput: {
    marginBottom: 0,
    minHeight: 80,
  },
  starRating: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    padding: 4,
  },
  starText: {
    fontSize: 24,
    color: colors.border.medium,
  },
  starActive: {
    color: colors.status.warning,
  },
  triggerChips: {
    marginBottom: 0,
  },
  symptomChips: {
    marginBottom: 0,
  },
  submitButton: {
    marginTop: 8,
  },
  comingSoon: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  comingSoonDesc: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  uploadButton: {
    alignSelf: 'center',
  },
  actionsCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});