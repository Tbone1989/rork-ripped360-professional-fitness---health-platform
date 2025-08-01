import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Switch,
  Dimensions
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Pill, 
  Camera,
  Save,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useContestStore } from '@/store/contestStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AutomatedProtocol, AUTOMATED_PROTOCOL_TEMPLATES } from '@/types/contest';

const { width } = Dimensions.get('window');

export default function CreateProtocolScreen() {
  const { template } = useLocalSearchParams();
  const { currentPrep, createAutomatedProtocol } = useContestStore();
  
  const [protocolName, setProtocolName] = useState('');
  const [protocolType, setProtocolType] = useState<AutomatedProtocol['type']>('calorie-cycling');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'bi-weekly'>('daily');
  const [isActive, setIsActive] = useState(true);
  
  // Calorie Cycling Parameters
  const [calorieHigh, setCalorieHigh] = useState('2200');
  const [calorieMedium, setCalorieMedium] = useState('1800');
  const [calorieLow, setCalorieLow] = useState('1400');
  const [cyclePattern, setCyclePattern] = useState([3, 3, 1]); // low, medium, high days
  
  // Cardio Parameters
  const [startDuration, setStartDuration] = useState('20');
  const [maxDuration, setMaxDuration] = useState('60');
  const [weeklyIncrease, setWeeklyIncrease] = useState('5');
  const [intensityLevels, setIntensityLevels] = useState<('low' | 'moderate' | 'high')[]>(['moderate', 'high']);
  
  // Supplement Parameters
  const [supplements, setSupplements] = useState([
    { name: 'Whey Protein', dosage: '30g', timing: ['Post-workout'] }
  ]);
  
  // Progress Photo Parameters
  const [photoPoses, setPhotoPoses] = useState(['Front', 'Side', 'Back']);
  const [photoTime, setPhotoTime] = useState('08:00');
  const [reminderTime, setReminderTime] = useState('07:30');

  useEffect(() => {
    if (template && typeof template === 'string') {
      loadTemplate(template);
    }
  }, [template]);

  const loadTemplate = (templateName: string) => {
    const templateData = AUTOMATED_PROTOCOL_TEMPLATES[templateName as keyof typeof AUTOMATED_PROTOCOL_TEMPLATES];
    if (!templateData) return;

    setProtocolName(templateData.name);
    
    if (templateName.includes('cut') || templateName.includes('prep')) {
      setProtocolType('calorie-cycling');
      setCalorieHigh(templateData.calorieRange.high.toString());
      setCalorieMedium(templateData.calorieRange.medium.toString());
      setCalorieLow(templateData.calorieRange.low.toString());
      setCyclePattern(templateData.cyclePattern);
      
      if (templateData.cardioProgression) {
        setStartDuration(templateData.cardioProgression.startDuration.toString());
        setMaxDuration(templateData.cardioProgression.maxDuration.toString());
        setWeeklyIncrease(templateData.cardioProgression.weeklyIncrease.toString());
        setIntensityLevels(templateData.cardioProgression.intensityLevels);
      }
    }
  };

  const handleSave = () => {
    if (!protocolName.trim()) {
      Alert.alert('Error', 'Please enter a protocol name');
      return;
    }

    if (!currentPrep) {
      Alert.alert('Error', 'No contest prep selected');
      return;
    }

    let parameters: any = {};

    switch (protocolType) {
      case 'calorie-cycling':
        parameters = {
          calorieRange: {
            high: parseInt(calorieHigh),
            medium: parseInt(calorieMedium),
            low: parseInt(calorieLow)
          },
          cyclePattern
        };
        break;
        
      case 'cardio-programming':
        parameters = {
          cardioProgression: {
            startDuration: parseInt(startDuration),
            maxDuration: parseInt(maxDuration),
            weeklyIncrease: parseInt(weeklyIncrease),
            intensityLevels
          }
        };
        break;
        
      case 'supplement-timing':
        parameters = {
          supplementSchedule: supplements
        };
        break;
        
      case 'progress-photos':
        parameters = {
          photoSettings: {
            poses: photoPoses,
            lighting: 'Natural',
            timeOfDay: photoTime,
            reminderTime
          }
        };
        break;
    }

    const newProtocol: Omit<AutomatedProtocol, 'id' | 'createdAt' | 'updatedAt'> = {
      contestPrepId: currentPrep.id,
      name: protocolName,
      type: protocolType,
      isActive,
      schedule: {
        frequency,
        timeOfDay: '08:00'
      },
      parameters,
      history: []
    };

    createAutomatedProtocol(newProtocol);
    
    Alert.alert(
      'Protocol Created',
      'Your automated protocol has been created successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderCalorieCyclingForm = () => (
    <Card style={styles.formCard}>
      <Text style={styles.formTitle}>Calorie Cycling Settings</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>High Calorie Days</Text>
        <TextInput
          style={styles.textInput}
          value={calorieHigh}
          onChangeText={setCalorieHigh}
          placeholder="2200"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Medium Calorie Days</Text>
        <TextInput
          style={styles.textInput}
          value={calorieMedium}
          onChangeText={setCalorieMedium}
          placeholder="1800"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Low Calorie Days</Text>
        <TextInput
          style={styles.textInput}
          value={calorieLow}
          onChangeText={setCalorieLow}
          placeholder="1400"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cycle Pattern (Low, Medium, High days)</Text>
        <View style={styles.cyclePatternContainer}>
          {cyclePattern.map((days, index) => (
            <View key={index} style={styles.cyclePatternItem}>
              <Text style={styles.cyclePatternLabel}>
                {index === 0 ? 'Low' : index === 1 ? 'Medium' : 'High'}
              </Text>
              <View style={styles.cyclePatternControls}>
                <TouchableOpacity
                  style={styles.cyclePatternButton}
                  onPress={() => {
                    const newPattern = [...cyclePattern];
                    newPattern[index] = Math.max(1, newPattern[index] - 1);
                    setCyclePattern(newPattern);
                  }}
                >
                  <Minus size={16} color={colors.text.secondary} />
                </TouchableOpacity>
                <Text style={styles.cyclePatternValue}>{days}</Text>
                <TouchableOpacity
                  style={styles.cyclePatternButton}
                  onPress={() => {
                    const newPattern = [...cyclePattern];
                    newPattern[index] = Math.min(7, newPattern[index] + 1);
                    setCyclePattern(newPattern);
                  }}
                >
                  <Plus size={16} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );

  const renderCardioForm = () => (
    <Card style={styles.formCard}>
      <Text style={styles.formTitle}>Cardio Programming</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Starting Duration (minutes)</Text>
        <TextInput
          style={styles.textInput}
          value={startDuration}
          onChangeText={setStartDuration}
          placeholder="20"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Maximum Duration (minutes)</Text>
        <TextInput
          style={styles.textInput}
          value={maxDuration}
          onChangeText={setMaxDuration}
          placeholder="60"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Weekly Increase (minutes)</Text>
        <TextInput
          style={styles.textInput}
          value={weeklyIncrease}
          onChangeText={setWeeklyIncrease}
          placeholder="5"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Intensity Levels</Text>
        <View style={styles.intensityContainer}>
          {(['low', 'moderate', 'high'] as const).map((intensity) => (
            <TouchableOpacity
              key={intensity}
              style={[
                styles.intensityButton,
                intensityLevels.includes(intensity) && styles.intensityButtonActive
              ]}
              onPress={() => {
                if (intensityLevels.includes(intensity)) {
                  setIntensityLevels(intensityLevels.filter(i => i !== intensity));
                } else {
                  setIntensityLevels([...intensityLevels, intensity]);
                }
              }}
            >
              <Text style={[
                styles.intensityButtonText,
                intensityLevels.includes(intensity) && styles.intensityButtonTextActive
              ]}>
                {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Card>
  );

  const renderSupplementForm = () => (
    <Card style={styles.formCard}>
      <Text style={styles.formTitle}>Supplement Schedule</Text>
      
      {supplements.map((supplement, index) => (
        <View key={index} style={styles.supplementItem}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Supplement Name</Text>
            <TextInput
              style={styles.textInput}
              value={supplement.name}
              onChangeText={(text) => {
                const newSupplements = [...supplements];
                newSupplements[index].name = text;
                setSupplements(newSupplements);
              }}
              placeholder="Supplement name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Dosage</Text>
            <TextInput
              style={styles.textInput}
              value={supplement.dosage}
              onChangeText={(text) => {
                const newSupplements = [...supplements];
                newSupplements[index].dosage = text;
                setSupplements(newSupplements);
              }}
              placeholder="30g"
            />
          </View>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              if (supplements.length > 1) {
                setSupplements(supplements.filter((_, i) => i !== index));
              }
            }}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSupplements([...supplements, { name: '', dosage: '', timing: ['Morning'] }]);
        }}
      >
        <Plus size={16} color={colors.accent.primary} />
        <Text style={styles.addButtonText}>Add Supplement</Text>
      </TouchableOpacity>
    </Card>
  );

  const renderProgressPhotoForm = () => (
    <Card style={styles.formCard}>
      <Text style={styles.formTitle}>Progress Photo Settings</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Photo Time</Text>
        <TextInput
          style={styles.textInput}
          value={photoTime}
          onChangeText={setPhotoTime}
          placeholder="08:00"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Reminder Time</Text>
        <TextInput
          style={styles.textInput}
          value={reminderTime}
          onChangeText={setReminderTime}
          placeholder="07:30"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Required Poses</Text>
        <View style={styles.posesContainer}>
          {['Front', 'Side', 'Back', 'Front Double Bicep', 'Back Double Bicep', 'Side Chest'].map((pose) => (
            <TouchableOpacity
              key={pose}
              style={[
                styles.poseButton,
                photoPoses.includes(pose) && styles.poseButtonActive
              ]}
              onPress={() => {
                if (photoPoses.includes(pose)) {
                  setPhotoPoses(photoPoses.filter(p => p !== pose));
                } else {
                  setPhotoPoses([...photoPoses, pose]);
                }
              }}
            >
              <Text style={[
                styles.poseButtonText,
                photoPoses.includes(pose) && styles.poseButtonTextActive
              ]}>
                {pose}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Create Protocol',
          headerRight: () => (
            <TouchableOpacity onPress={handleSave}>
              <Save size={24} color={colors.accent.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.basicInfoCard}>
          <Text style={styles.formTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Protocol Name</Text>
            <TextInput
              style={styles.textInput}
              value={protocolName}
              onChangeText={setProtocolName}
              placeholder="Enter protocol name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Protocol Type</Text>
            <View style={styles.typeSelector}>
              {[
                { type: 'calorie-cycling', label: 'Calorie Cycling', icon: TrendingUp },
                { type: 'cardio-programming', label: 'Cardio Programming', icon: Calendar },
                { type: 'macro-adjustment', label: 'Macro Adjustment', icon: BarChart3 },
                { type: 'supplement-timing', label: 'Supplement Timing', icon: Pill },
                { type: 'progress-photos', label: 'Progress Photos', icon: Camera }
              ].map(({ type, label, icon: IconComponent }) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    protocolType === type && styles.typeButtonActive
                  ]}
                  onPress={() => setProtocolType(type as AutomatedProtocol['type'])}
                >
                  <IconComponent 
                    size={20} 
                    color={protocolType === type ? colors.accent.primary : colors.text.secondary} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    protocolType === type && styles.typeButtonTextActive
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.inputLabel}>Start Active</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: colors.border.light, true: colors.accent.primary + '40' }}
                thumbColor={isActive ? colors.accent.primary : colors.text.tertiary}
              />
            </View>
          </View>
        </Card>

        {protocolType === 'calorie-cycling' && renderCalorieCyclingForm()}
        {protocolType === 'cardio-programming' && renderCardioForm()}
        {protocolType === 'supplement-timing' && renderSupplementForm()}
        {protocolType === 'progress-photos' && renderProgressPhotoForm()}

        <View style={styles.saveButtonContainer}>
          <Button
            title="Create Protocol"
            onPress={handleSave}
            style={styles.saveButton}
          />
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
  basicInfoCard: {
    margin: 20,
  },
  formCard: {
    margin: 20,
    marginTop: 0,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  typeSelector: {
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  typeButtonActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primary + '10',
  },
  typeButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  typeButtonTextActive: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cyclePatternContainer: {
    gap: 12,
  },
  cyclePatternItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
  },
  cyclePatternLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  cyclePatternControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cyclePatternButton: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 6,
    padding: 8,
  },
  cyclePatternValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  intensityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  intensityButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    flex: 1,
    alignItems: 'center',
  },
  intensityButtonActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primary + '10',
  },
  intensityButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  intensityButtonTextActive: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  supplementItem: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  removeButtonText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.accent.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  posesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  poseButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  poseButtonActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primary + '10',
  },
  poseButtonText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  poseButtonTextActive: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  saveButtonContainer: {
    padding: 20,
  },
  saveButton: {
    width: '100%',
  },
});