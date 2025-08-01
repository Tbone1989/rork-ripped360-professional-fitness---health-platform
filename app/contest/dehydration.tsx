import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Dimensions
} from 'react-native';
import { Stack, router } from 'expo-router';
import { 
  Droplets, 
  Plus, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Scale,
  Thermometer
} from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';

import { colors } from '@/constants/colors';
import { useContestStore } from '@/store/contestStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DehydrationLog } from '@/types/contest';

const { width } = Dimensions.get('window');

const URINE_COLORS = [
  { value: 1, label: 'Pale Yellow', color: '#FFF9C4', status: 'excellent' },
  { value: 2, label: 'Light Yellow', color: '#FFF176', status: 'good' },
  { value: 3, label: 'Yellow', color: '#FFEB3B', status: 'fair' },
  { value: 4, label: 'Dark Yellow', color: '#FFC107', status: 'poor' },
  { value: 5, label: 'Amber', color: '#FF8F00', status: 'dehydrated' },
  { value: 6, label: 'Orange', color: '#FF6F00', status: 'severely-dehydrated' },
  { value: 7, label: 'Brown', color: '#8D6E63', status: 'dangerously-dehydrated' },
  { value: 8, label: 'Dark Brown', color: '#5D4037', status: 'medical-attention' },
];

const SYMPTOMS = [
  'Headache',
  'Dizziness',
  'Fatigue',
  'Dry mouth',
  'Muscle cramps',
  'Nausea',
  'Rapid heartbeat',
  'Confusion'
];

export default function DehydrationScreen() {
  const { currentPrep, addDehydrationLog } = useContestStore();
  const [showAddLog, setShowAddLog] = useState(false);
  const [newLog, setNewLog] = useState({
    waterIntake: '',
    urineColor: 3,
    weight: '',
    bodyTemp: '',
    symptoms: [] as string[],
    notes: ''
  });

  if (!currentPrep) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Dehydration Tracking' }} />
        <View style={styles.emptyState}>
          <Droplets size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Contest Prep Selected</Text>
          <Text style={styles.emptyDescription}>
            Please select a contest prep to track hydration levels.
          </Text>
        </View>
      </View>
    );
  }

  const logs = currentPrep.dehydrationTracking.sort((a, b) => 
    new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
  );

  const handleAddLog = () => {
    if (!newLog.waterIntake || !newLog.weight) {
      Alert.alert('Error', 'Please fill in water intake and weight');
      return;
    }

    const log: Omit<DehydrationLog, 'id'> = {
      contestPrepId: currentPrep.id,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      waterIntake: parseInt(newLog.waterIntake),
      urineColor: newLog.urineColor as DehydrationLog['urineColor'],
      weight: parseFloat(newLog.weight),
      bodyTemp: newLog.bodyTemp ? parseFloat(newLog.bodyTemp) : undefined,
      symptoms: newLog.symptoms,
      notes: newLog.notes
    };

    addDehydrationLog(log);
    
    setNewLog({
      waterIntake: '',
      urineColor: 3,
      weight: '',
      bodyTemp: '',
      symptoms: [],
      notes: ''
    });
    setShowAddLog(false);
    
    Alert.alert('Success', 'Hydration log added successfully');
  };

  const toggleSymptom = (symptom: string) => {
    setNewLog(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const getHydrationStatus = (urineColor: number) => {
    const color = URINE_COLORS.find(c => c.value === urineColor);
    return color?.status || 'unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good': return colors.success;
      case 'fair': return colors.warning;
      case 'poor':
      case 'dehydrated': return '#FF8F00';
      case 'severely-dehydrated':
      case 'dangerously-dehydrated':
      case 'medical-attention': return colors.error;
      default: return colors.text.tertiary;
    }
  };

  const renderChart = () => {
    if (logs.length < 2) return null;

    const chartData = logs.slice(0, 7).reverse();
    
    return (
      <Card style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Hydration Trend (Last 7 Days)</Text>
        <LineChart
          data={{
            labels: chartData.map(log => 
              new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            ),
            datasets: [
              {
                data: chartData.map(log => log.waterIntake / 1000), // Convert to liters
                color: (opacity = 1) => colors.accent.primary,
                strokeWidth: 3
              }
            ]
          }}
          width={width - 80}
          height={200}
          chartConfig={{
            backgroundColor: colors.background.secondary,
            backgroundGradientFrom: colors.background.secondary,
            backgroundGradientTo: colors.background.secondary,
            decimalPlaces: 1,
            color: (opacity = 1) => colors.text.primary,
            labelColor: (opacity = 1) => colors.text.secondary,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: colors.accent.primary
            }
          }}
          bezier
          style={styles.chart}
        />
      </Card>
    );
  };

  const renderCurrentStatus = () => {
    if (logs.length === 0) return null;

    const latestLog = logs[0];
    const status = getHydrationStatus(latestLog.urineColor);
    const statusColor = getStatusColor(status);
    const urineColorData = URINE_COLORS.find(c => c.value === latestLog.urineColor);

    return (
      <Card style={styles.statusCard}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Droplets size={20} color={colors.accent.primary} />
            <Text style={styles.statusValue}>{latestLog.waterIntake}ml</Text>
            <Text style={styles.statusLabel}>Last Intake</Text>
          </View>
          
          <View style={styles.statusItem}>
            <Scale size={20} color={colors.accent.primary} />
            <Text style={styles.statusValue}>{latestLog.weight}kg</Text>
            <Text style={styles.statusLabel}>Weight</Text>
          </View>
          
          {latestLog.bodyTemp && (
            <View style={styles.statusItem}>
              <Thermometer size={20} color={colors.accent.primary} />
              <Text style={styles.statusValue}>{latestLog.bodyTemp}°C</Text>
              <Text style={styles.statusLabel}>Body Temp</Text>
            </View>
          )}
        </View>

        <View style={styles.urineColorContainer}>
          <Text style={styles.urineColorLabel}>Urine Color:</Text>
          <View style={styles.urineColorIndicator}>
            <View 
              style={[
                styles.urineColorSwatch, 
                { backgroundColor: urineColorData?.color || colors.text.tertiary }
              ]} 
            />
            <Text style={styles.urineColorText}>{urineColorData?.label}</Text>
            <Badge 
              text={status.replace('-', ' ')} 
              variant="secondary"
              style={{ backgroundColor: statusColor }}
            />
          </View>
        </View>

        {latestLog.symptoms.length > 0 && (
          <View style={styles.symptomsContainer}>
            <Text style={styles.symptomsLabel}>Symptoms:</Text>
            <View style={styles.symptomsRow}>
              {latestLog.symptoms.map((symptom, index) => (
                <Badge 
                  key={index}
                  text={symptom} 
                  variant="secondary"
                  style={styles.symptomBadge}
                />
              ))}
            </View>
          </View>
        )}

        <Text style={styles.lastUpdated}>
          Last updated: {new Date(latestLog.date + 'T' + latestLog.time).toLocaleString()}
        </Text>
      </Card>
    );
  };

  const renderAddLogForm = () => {
    if (!showAddLog) return null;

    return (
      <Card style={styles.addLogCard}>
        <Text style={styles.sectionTitle}>Add Hydration Log</Text>
        
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Water Intake (ml) *</Text>
            <TextInput
              style={styles.input}
              value={newLog.waterIntake}
              onChangeText={(text) => setNewLog(prev => ({ ...prev, waterIntake: text }))}
              placeholder="500"
              keyboardType="numeric"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight (kg) *</Text>
            <TextInput
              style={styles.input}
              value={newLog.weight}
              onChangeText={(text) => setNewLog(prev => ({ ...prev, weight: text }))}
              placeholder="70.5"
              keyboardType="numeric"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Body Temperature (°C)</Text>
          <TextInput
            style={styles.input}
            value={newLog.bodyTemp}
            onChangeText={(text) => setNewLog(prev => ({ ...prev, bodyTemp: text }))}
            placeholder="36.5"
            keyboardType="numeric"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Urine Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {URINE_COLORS.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorOption,
                  newLog.urineColor === color.value && styles.colorOptionSelected
                ]}
                onPress={() => setNewLog(prev => ({ ...prev, urineColor: color.value }))}
              >
                <View style={[styles.colorSwatch, { backgroundColor: color.color }]} />
                <Text style={styles.colorLabel}>{color.value}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Symptoms</Text>
          <View style={styles.symptomsGrid}>
            {SYMPTOMS.map((symptom) => (
              <TouchableOpacity
                key={symptom}
                style={[
                  styles.symptomOption,
                  newLog.symptoms.includes(symptom) && styles.symptomOptionSelected
                ]}
                onPress={() => toggleSymptom(symptom)}
              >
                <Text style={[
                  styles.symptomOptionText,
                  newLog.symptoms.includes(symptom) && styles.symptomOptionTextSelected
                ]}>
                  {symptom}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={newLog.notes}
            onChangeText={(text) => setNewLog(prev => ({ ...prev, notes: text }))}
            placeholder="Any additional notes..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <View style={styles.formButtons}>
          <Button
            title="Cancel"
            onPress={() => setShowAddLog(false)}
            variant="secondary"
            style={styles.formButton}
          />
          <Button
            title="Add Log"
            onPress={handleAddLog}
            style={styles.formButton}
          />
        </View>
      </Card>
    );
  };

  const renderLogHistory = () => {
    if (logs.length === 0) return null;

    return (
      <Card style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Recent Logs</Text>
        {logs.slice(0, 5).map((log) => {
          const status = getHydrationStatus(log.urineColor);
          const statusColor = getStatusColor(status);
          const urineColorData = URINE_COLORS.find(c => c.value === log.urineColor);
          
          return (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.logHeader}>
                <Text style={styles.logDate}>
                  {new Date(log.date + 'T' + log.time).toLocaleDateString()}
                </Text>
                <Text style={styles.logTime}>{log.time}</Text>
              </View>
              
              <View style={styles.logDetails}>
                <Text style={styles.logDetail}>
                  💧 {log.waterIntake}ml • ⚖️ {log.weight}kg
                </Text>
                <View style={styles.logUrineColor}>
                  <View 
                    style={[
                      styles.logColorSwatch, 
                      { backgroundColor: urineColorData?.color || colors.text.tertiary }
                    ]} 
                  />
                  <Badge 
                    text={status.replace('-', ' ')} 
                    variant="secondary"
                    style={{ backgroundColor: statusColor }}
                  />
                </View>
              </View>
              
              {log.symptoms.length > 0 && (
                <Text style={styles.logSymptoms}>
                  Symptoms: {log.symptoms.join(', ')}
                </Text>
              )}
              
              {log.notes && (
                <Text style={styles.logNotes}>{log.notes}</Text>
              )}
            </View>
          );
        })}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Dehydration Tracking',
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowAddLog(true)}>
              <Plus size={24} color={colors.accent.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.contestName}>{currentPrep.contestName}</Text>
          <Text style={styles.headerDescription}>
            Monitor hydration levels during peak week preparation
          </Text>
        </View>

        {renderCurrentStatus()}
        {renderChart()}
        {renderAddLogForm()}
        {renderLogHistory()}

        <Card style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <AlertTriangle size={20} color={colors.error} />
            <Text style={styles.warningTitle}>Important Warning</Text>
          </View>
          <Text style={styles.warningText}>
            Severe dehydration can be dangerous. If you experience confusion, rapid heartbeat, 
            or other serious symptoms, seek medical attention immediately.
          </Text>
        </Card>
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
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  contestName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  statusCard: {
    margin: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  urineColorContainer: {
    marginBottom: 16,
  },
  urineColorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  urineColorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urineColorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  urineColorText: {
    fontSize: 14,
    color: colors.text.primary,
    marginRight: 12,
    flex: 1,
  },
  symptomsContainer: {
    marginBottom: 16,
  },
  symptomsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  symptomsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  symptomBadge: {
    marginRight: 8,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  chartCard: {
    margin: 20,
    marginTop: 0,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  addLogCard: {
    margin: 20,
    marginTop: 0,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    marginBottom: 16,
    flex: 1,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    fontSize: 16,
    color: colors.text.primary,
  },
  notesInput: {
    minHeight: 80,
  },
  colorOption: {
    alignItems: 'center',
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
  },
  colorOptionSelected: {
    backgroundColor: colors.accent.primary + '20',
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  colorLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  symptomOption: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  symptomOptionSelected: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  symptomOptionText: {
    fontSize: 12,
    color: colors.text.primary,
  },
  symptomOptionTextSelected: {
    color: colors.text.primary,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  historyCard: {
    margin: 20,
    marginTop: 0,
  },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    paddingBottom: 12,
    marginBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  logTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  logDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logDetail: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  logUrineColor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logColorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  logSymptoms: {
    fontSize: 12,
    color: colors.warning,
    marginBottom: 4,
  },
  logNotes: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  warningCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: colors.error + '10',
    borderColor: colors.error,
    borderWidth: 1,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});