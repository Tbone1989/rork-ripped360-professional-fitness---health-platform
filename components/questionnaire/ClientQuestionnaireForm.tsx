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
  User, 
  Heart, 
  Pill, 
  Activity, 
  Target, 
  Phone,
  FileCheck,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  ClientQuestionnaire, 
  PersonalInfo, 
  HealthHistory, 
  CurrentMedication,
  CurrentSupplement,
  InjuryHistory,
  LifestyleInfo,
  FitnessGoals,
  EmergencyContact,
  ConsentInfo
} from '@/types/questionnaire';

interface ClientQuestionnaireFormProps {
  onSubmit: (questionnaire: ClientQuestionnaire) => void;
  initialData?: Partial<ClientQuestionnaire>;
}

export default function ClientQuestionnaireForm({ 
  onSubmit, 
  initialData 
}: ClientQuestionnaireFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    age: initialData?.personalInfo?.age || 0,
    gender: initialData?.personalInfo?.gender || 'prefer-not-to-say',
    height: initialData?.personalInfo?.height || 0,
    weight: initialData?.personalInfo?.weight || 0,
    bodyFatPercentage: initialData?.personalInfo?.bodyFatPercentage,
    activityLevel: initialData?.personalInfo?.activityLevel || 'sedentary',
    occupation: initialData?.personalInfo?.occupation || '',
    stressLevel: initialData?.personalInfo?.stressLevel || 3,
  });

  const [healthHistory, setHealthHistory] = useState<HealthHistory>({
    chronicConditions: initialData?.healthHistory?.chronicConditions || [],
    pastSurgeries: initialData?.healthHistory?.pastSurgeries || [],
    familyHistory: initialData?.healthHistory?.familyHistory || [],
    allergies: initialData?.healthHistory?.allergies || [],
    bloodPressure: initialData?.healthHistory?.bloodPressure,
    restingHeartRate: initialData?.healthHistory?.restingHeartRate,
    smokingStatus: initialData?.healthHistory?.smokingStatus || 'never',
    alcoholConsumption: initialData?.healthHistory?.alcoholConsumption || 'none',
    sleepHours: initialData?.healthHistory?.sleepHours || 8,
    sleepQuality: initialData?.healthHistory?.sleepQuality || 'good',
  });

  const [medications, setMedications] = useState<CurrentMedication[]>(
    initialData?.currentMedications || []
  );

  const [supplements, setSupplements] = useState<CurrentSupplement[]>(
    initialData?.supplements || []
  );

  const [injuries, setInjuries] = useState<InjuryHistory[]>(
    initialData?.injuries || []
  );

  const [lifestyle, setLifestyle] = useState<LifestyleInfo>({
    workSchedule: initialData?.lifestyle?.workSchedule || 'regular-hours',
    travelFrequency: initialData?.lifestyle?.travelFrequency || 'rarely',
    gymAccess: initialData?.lifestyle?.gymAccess || 'commercial-gym',
    availableEquipment: initialData?.lifestyle?.availableEquipment || [],
    workoutExperience: initialData?.lifestyle?.workoutExperience || 'beginner',
    previousTrainingTypes: initialData?.lifestyle?.previousTrainingTypes || [],
    nutritionKnowledge: initialData?.lifestyle?.nutritionKnowledge || 'basic',
    cookingSkills: initialData?.lifestyle?.cookingSkills || 'basic',
    dietaryRestrictions: initialData?.lifestyle?.dietaryRestrictions || [],
    foodAllergies: initialData?.lifestyle?.foodAllergies || [],
  });

  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoals>({
    primaryGoal: initialData?.fitnessGoals?.primaryGoal || 'general-fitness',
    secondaryGoals: initialData?.fitnessGoals?.secondaryGoals || [],
    targetWeight: initialData?.fitnessGoals?.targetWeight,
    targetBodyFat: initialData?.fitnessGoals?.targetBodyFat,
    timeframe: initialData?.fitnessGoals?.timeframe || '',
    motivation: initialData?.fitnessGoals?.motivation || '',
    previousAttempts: initialData?.fitnessGoals?.previousAttempts || '',
    obstacles: initialData?.fitnessGoals?.obstacles || [],
    successMeasures: initialData?.fitnessGoals?.successMeasures || [],
  });

  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: initialData?.emergencyContact?.name || '',
    relationship: initialData?.emergencyContact?.relationship || '',
    phoneNumber: initialData?.emergencyContact?.phoneNumber || '',
    email: initialData?.emergencyContact?.email,
  });

  const [consent, setConsent] = useState<ConsentInfo>({
    medicalClearance: initialData?.consent?.medicalClearance || false,
    riskAcknowledgment: initialData?.consent?.riskAcknowledgment || false,
    dataSharing: initialData?.consent?.dataSharing || false,
    photographyConsent: initialData?.consent?.photographyConsent || false,
    communicationConsent: initialData?.consent?.communicationConsent || false,
    signedDate: initialData?.consent?.signedDate || new Date().toISOString(),
  });

  const steps = [
    { title: 'Personal Info', icon: User },
    { title: 'Health History', icon: Heart },
    { title: 'Medications', icon: Pill },
    { title: 'Supplements', icon: Activity },
    { title: 'Injuries', icon: Activity },
    { title: 'Lifestyle', icon: Target },
    { title: 'Fitness Goals', icon: Target },
    { title: 'Emergency Contact', icon: Phone },
    { title: 'Consent', icon: FileCheck },
  ];

  const addMedication = () => {
    const newMedication: CurrentMedication = {
      name: '',
      dosage: '',
      frequency: '',
      prescribedBy: '',
      startDate: '',
      purpose: '',
      sideEffects: [],
    };
    setMedications([...medications, newMedication]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof CurrentMedication, value: any) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const addSupplement = () => {
    const newSupplement: CurrentSupplement = {
      name: '',
      dosage: '',
      frequency: '',
      brand: '',
      purpose: '',
      duration: '',
    };
    setSupplements([...supplements, newSupplement]);
  };

  const removeSupplement = (index: number) => {
    setSupplements(supplements.filter((_, i) => i !== index));
  };

  const updateSupplement = (index: number, field: keyof CurrentSupplement, value: any) => {
    const updated = [...supplements];
    updated[index] = { ...updated[index], [field]: value };
    setSupplements(updated);
  };

  const addInjury = () => {
    const newInjury: InjuryHistory = {
      bodyPart: '',
      injuryType: '',
      dateOccurred: '',
      treatment: '',
      currentStatus: 'fully-healed',
      limitations: [],
      painLevel: 1,
      triggerActivities: [],
    };
    setInjuries([...injuries, newInjury]);
  };

  const removeInjury = (index: number) => {
    setInjuries(injuries.filter((_, i) => i !== index));
  };

  const updateInjury = (index: number, field: keyof InjuryHistory, value: any) => {
    const updated = [...injuries];
    updated[index] = { ...updated[index], [field]: value };
    setInjuries(updated);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const questionnaire: ClientQuestionnaire = {
      id: initialData?.id || `questionnaire_${Date.now()}`,
      clientId: initialData?.clientId || 'current_user',
      coachId: initialData?.coachId,
      completedAt: new Date().toISOString(),
      personalInfo,
      healthHistory,
      currentMedications: medications,
      supplements,
      injuries,
      lifestyle,
      fitnessGoals,
      emergencyContact,
      consent,
    };

    if (!consent.medicalClearance || !consent.riskAcknowledgment) {
      Alert.alert(
        'Required Consent',
        'Please acknowledge medical clearance and risk acknowledgment to proceed.'
      );
      return;
    }

    onSubmit(questionnaire);
  };

  const renderPersonalInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      
      <Input
        label="Age"
        value={personalInfo.age.toString()}
        onChangeText={(text) => setPersonalInfo({...personalInfo, age: parseInt(text) || 0})}
        keyboardType="numeric"
        placeholder="Enter your age"
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioGroup}>
          {['male', 'female', 'other', 'prefer-not-to-say'].map((option) => (
            <Button
              key={option}
              title={option.replace('-', ' ').toUpperCase()}
              onPress={() => setPersonalInfo({...personalInfo, gender: option as any})}
              variant={personalInfo.gender === option ? 'primary' : 'outline'}
              style={styles.radioButton}
            />
          ))}
        </View>
      </View>

      <Input
        label="Height (cm)"
        value={personalInfo.height.toString()}
        onChangeText={(text) => setPersonalInfo({...personalInfo, height: parseInt(text) || 0})}
        keyboardType="numeric"
        placeholder="Enter height in centimeters"
      />

      <Input
        label="Weight (kg)"
        value={personalInfo.weight.toString()}
        onChangeText={(text) => setPersonalInfo({...personalInfo, weight: parseInt(text) || 0})}
        keyboardType="numeric"
        placeholder="Enter weight in kilograms"
      />

      <Input
        label="Body Fat % (optional)"
        value={personalInfo.bodyFatPercentage?.toString() || ''}
        onChangeText={(text) => setPersonalInfo({...personalInfo, bodyFatPercentage: parseInt(text) || undefined})}
        keyboardType="numeric"
        placeholder="Enter body fat percentage if known"
      />

      <Input
        label="Occupation"
        value={personalInfo.occupation}
        onChangeText={(text) => setPersonalInfo({...personalInfo, occupation: text})}
        placeholder="Enter your occupation"
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Activity Level</Text>
        <View style={styles.radioGroup}>
          {[
            { key: 'sedentary', label: 'Sedentary' },
            { key: 'lightly-active', label: 'Lightly Active' },
            { key: 'moderately-active', label: 'Moderately Active' },
            { key: 'very-active', label: 'Very Active' },
            { key: 'extremely-active', label: 'Extremely Active' },
          ].map((option) => (
            <Button
              key={option.key}
              title={option.label}
              onPress={() => setPersonalInfo({...personalInfo, activityLevel: option.key as any})}
              variant={personalInfo.activityLevel === option.key ? 'primary' : 'outline'}
              style={styles.radioButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Stress Level (1-5)</Text>
        <View style={styles.scaleContainer}>
          {[1, 2, 3, 4, 5].map((level) => (
            <Button
              key={level}
              title={level.toString()}
              onPress={() => setPersonalInfo({...personalInfo, stressLevel: level as any})}
              variant={personalInfo.stressLevel === level ? 'primary' : 'outline'}
              style={styles.scaleButton}
            />
          ))}
        </View>
      </View>
    </View>
  );

  const renderHealthHistory = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Health History</Text>
      
      <Input
        label="Chronic Conditions (comma separated)"
        value={healthHistory.chronicConditions.join(', ')}
        onChangeText={(text) => setHealthHistory({
          ...healthHistory, 
          chronicConditions: text.split(',').map(s => s.trim()).filter(s => s)
        })}
        placeholder="e.g., diabetes, hypertension, asthma"
        multiline
      />

      <Input
        label="Blood Pressure (optional)"
        value={healthHistory.bloodPressure || ''}
        onChangeText={(text) => setHealthHistory({...healthHistory, bloodPressure: text})}
        placeholder="e.g., 120/80"
      />

      <Input
        label="Resting Heart Rate (optional)"
        value={healthHistory.restingHeartRate?.toString() || ''}
        onChangeText={(text) => setHealthHistory({
          ...healthHistory, 
          restingHeartRate: parseInt(text) || undefined
        })}
        keyboardType="numeric"
        placeholder="beats per minute"
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Smoking Status</Text>
        <View style={styles.radioGroup}>
          {['never', 'former', 'current'].map((option) => (
            <Button
              key={option}
              title={option.toUpperCase()}
              onPress={() => setHealthHistory({...healthHistory, smokingStatus: option as any})}
              variant={healthHistory.smokingStatus === option ? 'primary' : 'outline'}
              style={styles.radioButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Alcohol Consumption</Text>
        <View style={styles.radioGroup}>
          {['none', 'occasional', 'moderate', 'heavy'].map((option) => (
            <Button
              key={option}
              title={option.toUpperCase()}
              onPress={() => setHealthHistory({...healthHistory, alcoholConsumption: option as any})}
              variant={healthHistory.alcoholConsumption === option ? 'primary' : 'outline'}
              style={styles.radioButton}
            />
          ))}
        </View>
      </View>

      <Input
        label="Sleep Hours per Night"
        value={healthHistory.sleepHours.toString()}
        onChangeText={(text) => setHealthHistory({
          ...healthHistory, 
          sleepHours: parseInt(text) || 8
        })}
        keyboardType="numeric"
        placeholder="Average hours of sleep"
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sleep Quality</Text>
        <View style={styles.radioGroup}>
          {['poor', 'fair', 'good', 'excellent'].map((option) => (
            <Button
              key={option}
              title={option.toUpperCase()}
              onPress={() => setHealthHistory({...healthHistory, sleepQuality: option as any})}
              variant={healthHistory.sleepQuality === option ? 'primary' : 'outline'}
              style={styles.radioButton}
            />
          ))}
        </View>
      </View>

      <Input
        label="Allergies (comma separated)"
        value={healthHistory.allergies.map(a => `${a.allergen} (${a.severity})`).join(', ')}
        onChangeText={(text) => {
          const allergies = text.split(',').map(s => s.trim()).filter(s => s).map(allergen => ({
            allergen,
            severity: 'mild' as const,
            reaction: ''
          }));
          setHealthHistory({...healthHistory, allergies});
        }}
        placeholder="e.g., peanuts, shellfish, pollen"
        multiline
      />
    </View>
  );

  const renderMedications = () => (
    <View style={styles.stepContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.stepTitle}>Current Medications</Text>
        <Button
          title="Add Medication"
          onPress={addMedication}
          variant="outline"
          icon={<Plus size={16} color="#007AFF" />}
        />
      </View>

      {medications.map((medication, index) => (
        <Card key={index} style={styles.medicationCard}>
          <View style={styles.medicationHeader}>
            <Text style={styles.medicationTitle}>Medication {index + 1}</Text>
            <Button
              title=""
              onPress={() => removeMedication(index)}
              variant="outline"
              icon={<Trash2 size={16} color="#FF3B30" />}
              style={styles.deleteButton}
            />
          </View>

          <Input
            label="Medication Name"
            value={medication.name}
            onChangeText={(text) => updateMedication(index, 'name', text)}
            placeholder="Enter medication name"
          />

          <Input
            label="Dosage"
            value={medication.dosage}
            onChangeText={(text) => updateMedication(index, 'dosage', text)}
            placeholder="e.g., 10mg, 1 tablet"
          />

          <Input
            label="Frequency"
            value={medication.frequency}
            onChangeText={(text) => updateMedication(index, 'frequency', text)}
            placeholder="e.g., twice daily, as needed"
          />

          <Input
            label="Prescribed By"
            value={medication.prescribedBy}
            onChangeText={(text) => updateMedication(index, 'prescribedBy', text)}
            placeholder="Doctor or healthcare provider"
          />

          <Input
            label="Start Date"
            value={medication.startDate}
            onChangeText={(text) => updateMedication(index, 'startDate', text)}
            placeholder="MM/DD/YYYY"
          />

          <Input
            label="Purpose"
            value={medication.purpose}
            onChangeText={(text) => updateMedication(index, 'purpose', text)}
            placeholder="What condition is this treating?"
            multiline
          />
        </Card>
      ))}

      {medications.length === 0 && (
        <Text style={styles.emptyState}>
          No medications added. Tap "Add Medication" to include any current medications.
        </Text>
      )}
    </View>
  );

  const renderSupplements = () => (
    <View style={styles.stepContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.stepTitle}>Current Supplements</Text>
        <Button
          title="Add Supplement"
          onPress={addSupplement}
          variant="outline"
          icon={<Plus size={16} color="#007AFF" />}
        />
      </View>

      {supplements.map((supplement, index) => (
        <Card key={index} style={styles.medicationCard}>
          <View style={styles.medicationHeader}>
            <Text style={styles.medicationTitle}>Supplement {index + 1}</Text>
            <Button
              title=""
              onPress={() => removeSupplement(index)}
              variant="outline"
              icon={<Trash2 size={16} color="#FF3B30" />}
              style={styles.deleteButton}
            />
          </View>

          <Input
            label="Supplement Name"
            value={supplement.name}
            onChangeText={(text) => updateSupplement(index, 'name', text)}
            placeholder="Enter supplement name"
          />

          <Input
            label="Brand (optional)"
            value={supplement.brand || ''}
            onChangeText={(text) => updateSupplement(index, 'brand', text)}
            placeholder="Brand name"
          />

          <Input
            label="Dosage"
            value={supplement.dosage}
            onChangeText={(text) => updateSupplement(index, 'dosage', text)}
            placeholder="e.g., 1000mg, 2 capsules"
          />

          <Input
            label="Frequency"
            value={supplement.frequency}
            onChangeText={(text) => updateSupplement(index, 'frequency', text)}
            placeholder="e.g., daily, twice daily"
          />

          <Input
            label="Purpose"
            value={supplement.purpose}
            onChangeText={(text) => updateSupplement(index, 'purpose', text)}
            placeholder="Why are you taking this supplement?"
            multiline
          />

          <Input
            label="Duration"
            value={supplement.duration}
            onChangeText={(text) => updateSupplement(index, 'duration', text)}
            placeholder="How long have you been taking this?"
          />
        </Card>
      ))}

      {supplements.length === 0 && (
        <Text style={styles.emptyState}>
          No supplements added. Tap "Add Supplement" to include any current supplements.
        </Text>
      )}
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderHealthHistory();
      case 2: return renderMedications();
      case 3: return renderSupplements();
      case 4: return <Text>Injuries step (implement similar to medications)</Text>;
      case 5: return <Text>Lifestyle step</Text>;
      case 6: return <Text>Fitness Goals step</Text>;
      case 7: return <Text>Emergency Contact step</Text>;
      case 8: return <Text>Consent step</Text>;
      default: return renderPersonalInfo();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Health Questionnaire',
          headerBackTitle: 'Back'
        }} 
      />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + 1) / steps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={styles.stepIcon}>
            {React.createElement(steps[currentStep].icon, { 
              size: 24, 
              color: '#007AFF' 
            })}
          </View>
          <Text style={styles.stepIndicatorText}>
            {steps[currentStep].title}
          </Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderCurrentStep()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <Button
            title="Previous"
            onPress={handlePrevious}
            variant="outline"
            disabled={currentStep === 0}
            style={[styles.navButton, { opacity: currentStep === 0 ? 0.5 : 1 }]}
          />
          
          {currentStep === steps.length - 1 ? (
            <Button
              title="Submit"
              onPress={handleSubmit}
              variant="primary"
              style={styles.navButton}
            />
          ) : (
            <Button
              title="Next"
              onPress={handleNext}
              variant="primary"
              style={styles.navButton}
              icon={<ChevronRight size={16} color="#FFFFFF" />}
            />
          )}
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
  progressContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  stepIcon: {
    marginRight: 12,
  },
  stepIndicatorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
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
  radioButton: {
    minWidth: 100,
    marginBottom: 8,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleButton: {
    width: 50,
    height: 50,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  medicationCard: {
    marginBottom: 16,
    padding: 16,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  medicationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  deleteButton: {
    width: 40,
    height: 40,
  },
  emptyState: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 32,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});