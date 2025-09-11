import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  Brain,
  Heart,
  Droplets,
  Pill,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Zap,
  Shield,
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { trpc } from '@/lib/trpc';

interface HealthAnalysisResult {
  bloodworkAnalysis?: {
    confidence: number;
    overallHealth: string;
    keyFindings: Array<{
      marker: string;
      value: number;
      unit: string;
      status: string;
      interpretation: string;
      clinicalSignificance: string;
    }>;
    supplementRecommendations: Array<{
      name: string;
      purpose: string;
      dosage: string;
      timing: string;
      duration: string;
      priority: string;
    }>;
    bloodTypeRecommendations?: {
      bloodType: string;
      dietaryFocus: string[];
      exerciseRecommendations: string[];
    };
    disclaimer: string;
  };
  digestiveAnalysis?: {
    confidence: number;
    overallDigestiveHealth: string;
    probioticRecommendations: Array<{
      strains: string[];
      cfu: string;
      purpose: string;
      duration: string;
    }>;
    dietaryChanges: Array<{
      change: string;
      reasoning: string;
      implementation: string;
      timeline: string;
    }>;
  };
  detoxAnalysis?: {
    confidence: number;
    overallDetoxCapacity: string;
    detoxProgram: {
      name: string;
      totalDuration: string;
      intensity: string;
    };
    detoxPhases: Array<{
      phase: string;
      duration: string;
      focus: string[];
      activities: string[];
    }>;
    liverHealth: {
      status: string;
      phase1Function: string;
      phase2Function: string;
    };
    lifestyleChanges: string[];
  };
  healthIssuesAnalysis?: {
    confidence: number;
    identifiedIssues: Array<{
      issue: string;
      severity: string;
      category: string;
      likelihood: string;
      symptoms: string[];
      possibleCauses: string[];
    }>;
    treatmentProtocol: Array<{
      condition: string;
      approach: string;
      duration: string;
      phases: Array<{
        phase: string;
        duration: string;
        goals: string[];
      }>;
    }>;
    disclaimer: string;
  };
}

const AIHealthAnalysisScreen: React.FC = () => {
  const [analysisType, setAnalysisType] = useState<'bloodwork' | 'digestive' | 'detox' | 'issues'>('bloodwork');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<HealthAnalysisResult>({});
  const [userInput, setUserInput] = useState({
    symptoms: '',
    bloodType: 'O+',
    medications: '',
    lifestyle: '',
    concerns: '',
  });

  const bloodworkMutation = trpc.health.bloodwork.useMutation();
  const digestiveMutation = trpc.health.digestive.useMutation();
  const detoxMutation = trpc.health.detox.useMutation();
  const issuesMutation = trpc.health.issues.useMutation();

  const handleAnalysis = async () => {
    setLoading(true);
    try {
      const symptoms = userInput.symptoms.split(',').map(s => s.trim()).filter(Boolean);
      const medications = userInput.medications.split(',').map(m => m.trim()).filter(Boolean);

      let result: any;
      switch (analysisType) {
        case 'bloodwork':
          result = await bloodworkMutation.mutateAsync({
            bloodworkData: {
              userId: 'user_123',
              markers: [
                { name: 'Vitamin D', value: 25, unit: 'ng/mL' },
                { name: 'Iron', value: 45, unit: 'μg/dL' },
                { name: 'B12', value: 350, unit: 'pg/mL' },
              ]
            },
            userProfile: {
              bloodType: userInput.bloodType,
              symptoms,
              medications,
            },
            includeBloodType: true,
            includeDigestiveHealth: true,
            includeDetoxRecommendations: true,
          });
          setResults(prev => ({ ...prev, bloodworkAnalysis: result.analysis as HealthAnalysisResult['bloodworkAnalysis'] }));
          break;

        case 'digestive':
          result = await digestiveMutation.mutateAsync({
            symptoms,
            frequency: symptoms.reduce((acc, symptom) => ({ ...acc, [symptom]: 'daily' }), {}),
            triggers: ['stress', 'certain foods'],
            currentDiet: userInput.lifestyle,
            medications,
            stressLevel: 'moderate',
          });
          setResults(prev => ({ ...prev, digestiveAnalysis: result.analysis as HealthAnalysisResult['digestiveAnalysis'] }));
          break;

        case 'detox':
          result = await detoxMutation.mutateAsync({
            currentSymptoms: symptoms,
            toxinExposure: ['household cleaners', 'processed foods'],
            lifestyle: {
              alcohol: 'light',
              smoking: false,
              exercise: 'moderate',
              stress: 'moderate',
            },
            medications,
          });
          setResults(prev => ({ ...prev, detoxAnalysis: result.analysis as HealthAnalysisResult['detoxAnalysis'] }));
          break;

        case 'issues':
          result = await issuesMutation.mutateAsync({
            symptoms,
            medicalHistory: medications,
            lifestyle: {
              diet: userInput.lifestyle,
              exercise: 'moderate',
              sleep: 'fair',
              stress: 'moderate',
            },
            concerns: userInput.concerns.split(',').map(c => c.trim()).filter(Boolean),
          });
          setResults(prev => ({ ...prev, healthIssuesAnalysis: result.analysis as HealthAnalysisResult['healthIssuesAnalysis'] }));
          break;
      }

      Alert.alert('Analysis Complete', 'Your AI health analysis has been generated successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      const mock = createMockResults(analysisType);
      setResults(prev => ({ ...prev, ...mock }));
      Alert.alert('Network issue', 'Showing a sample AI analysis so you can keep going.');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysisTypeSelector = () => (
    <Card style={styles.selectorCard}>
      <Text style={styles.selectorTitle}>Select Analysis Type</Text>
      <View style={styles.selectorGrid}>
        {[
          { type: 'bloodwork', icon: Droplets, label: 'Bloodwork Analysis', color: '#e74c3c' },
          { type: 'digestive', icon: Heart, label: 'Digestive Health', color: '#f39c12' },
          { type: 'detox', icon: Shield, label: 'Detox Analysis', color: '#27ae60' },
          { type: 'issues', icon: Brain, label: 'Health Issues', color: '#3498db' },
        ].map(({ type, icon: Icon, label, color }) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.selectorButton,
              analysisType === type && { backgroundColor: color + '20', borderColor: color }
            ]}
            onPress={() => setAnalysisType(type as any)}
          >
            <Icon size={24} color={analysisType === type ? color : '#666'} />
            <Text style={[
              styles.selectorButtonText,
              analysisType === type && { color }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );

  const renderInputForm = () => (
    <Card style={styles.inputCard}>
      <Text style={styles.inputTitle}>Health Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Symptoms (comma-separated)</Text>
        <TextInput
          style={styles.textInput}
          value={userInput.symptoms}
          onChangeText={(text) => setUserInput(prev => ({ ...prev, symptoms: text }))}
          placeholder="fatigue, bloating, headaches..."
          multiline
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Blood Type</Text>
        <View style={styles.bloodTypeSelector}>
          {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.bloodTypeButton,
                userInput.bloodType === type && styles.bloodTypeButtonActive
              ]}
              onPress={() => setUserInput(prev => ({ ...prev, bloodType: type }))}
            >
              <Text style={[
                styles.bloodTypeButtonText,
                userInput.bloodType === type && styles.bloodTypeButtonTextActive
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Current Medications/Supplements</Text>
        <TextInput
          style={styles.textInput}
          value={userInput.medications}
          onChangeText={(text) => setUserInput(prev => ({ ...prev, medications: text }))}
          placeholder="vitamin D, metformin, omega-3..."
          multiline
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Lifestyle/Diet</Text>
        <TextInput
          style={styles.textInput}
          value={userInput.lifestyle}
          onChangeText={(text) => setUserInput(prev => ({ ...prev, lifestyle: text }))}
          placeholder="Mediterranean diet, regular exercise..."
          multiline
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Health Concerns</Text>
        <TextInput
          style={styles.textInput}
          value={userInput.concerns}
          onChangeText={(text) => setUserInput(prev => ({ ...prev, concerns: text }))}
          placeholder="energy levels, digestive issues, sleep..."
          multiline
        />
      </View>

      <Button
        title={loading ? 'Analyzing...' : 'Generate AI Analysis'}
        onPress={handleAnalysis}
        disabled={loading}
        style={styles.analyzeButton}
      />
      {loading && <ActivityIndicator size="large" color="#3498db" style={styles.loader} />}
    </Card>
  );

  const renderBloodworkResults = (analysis: any) => (
    <View style={styles.resultsContainer}>
      <Card style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Droplets size={24} color="#e74c3c" />
          <Text style={styles.resultTitle}>Bloodwork Analysis</Text>
          <Badge variant="success">{`${Math.round(analysis.confidence * 100)}% Confidence`}</Badge>
        </View>
        
        <View style={styles.healthStatus}>
          <Text style={styles.healthStatusLabel}>Overall Health:</Text>
          <Badge 
            variant={analysis.overallHealth === 'excellent' ? 'success' : 
                   analysis.overallHealth === 'good' ? 'info' : 'warning'}
          >
            {analysis.overallHealth?.toUpperCase()}
          </Badge>
        </View>

        <Text style={styles.sectionTitle}>Key Findings</Text>
        {analysis.keyFindings?.map((finding: any, index: number) => (
          <View key={index} style={styles.findingCard}>
            <View style={styles.findingHeader}>
              <Text style={styles.findingMarker}>{finding.marker}</Text>
              <Badge 
                variant={finding.status === 'optimal' ? 'success' : 
                       finding.status === 'normal' ? 'info' : 'warning'}
              >
                {finding.status}
              </Badge>
            </View>
            <Text style={styles.findingValue}>{finding.value} {finding.unit}</Text>
            <Text style={styles.findingInterpretation}>{finding.interpretation}</Text>
            <Text style={styles.findingSignificance}>{finding.clinicalSignificance}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Supplement Recommendations</Text>
        {analysis.supplementRecommendations?.map((supp: any, index: number) => (
          <View key={index} style={styles.supplementCard}>
            <View style={styles.supplementHeader}>
              <Pill size={20} color="#f39c12" />
              <Text style={styles.supplementName}>{supp.name}</Text>
              <Badge 
                variant={supp.priority === 'high' ? 'error' : 
                       supp.priority === 'medium' ? 'warning' : 'info'}
              >
                {supp.priority}
              </Badge>
            </View>
            <Text style={styles.supplementPurpose}>{supp.purpose}</Text>
            <Text style={styles.supplementDosage}>Dosage: {supp.dosage}</Text>
            <Text style={styles.supplementTiming}>Timing: {supp.timing}</Text>
            <Text style={styles.supplementDuration}>Duration: {supp.duration}</Text>
          </View>
        ))}

        {analysis.bloodTypeRecommendations && (
          <>
            <Text style={styles.sectionTitle}>Blood Type Recommendations ({analysis.bloodTypeRecommendations.bloodType})</Text>
            <View style={styles.bloodTypeRecommendations}>
              <Text style={styles.bloodTypeCategory}>Dietary Focus:</Text>
              {analysis.bloodTypeRecommendations.dietaryFocus?.map((item: string, index: number) => (
                <Text key={index} style={styles.bloodTypeItem}>• {item}</Text>
              ))}
              
              <Text style={styles.bloodTypeCategory}>Exercise:</Text>
              {analysis.bloodTypeRecommendations.exerciseRecommendations?.map((item: string, index: number) => (
                <Text key={index} style={styles.bloodTypeItem}>• {item}</Text>
              ))}
            </View>
          </>
        )}

        <Text style={styles.disclaimer}>{analysis.disclaimer}</Text>
      </Card>
    </View>
  );

  const renderDigestiveResults = (analysis: any) => (
    <View style={styles.resultsContainer}>
      <Card style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Heart size={24} color="#f39c12" />
          <Text style={styles.resultTitle}>Digestive Health Analysis</Text>
          <Badge variant="info">{`${Math.round(analysis.confidence * 100)}% Confidence`}</Badge>
        </View>

        <View style={styles.healthStatus}>
          <Text style={styles.healthStatusLabel}>Digestive Health:</Text>
          <Badge 
            variant={analysis.overallDigestiveHealth === 'excellent' ? 'success' : 
                   analysis.overallDigestiveHealth === 'good' ? 'info' : 'warning'}
          >
            {analysis.overallDigestiveHealth?.toUpperCase()}
          </Badge>
        </View>

        <Text style={styles.sectionTitle}>Probiotic Recommendations</Text>
        {analysis.probioticRecommendations?.map((probiotic: any, index: number) => (
          <View key={index} style={styles.probioticCard}>
            <Text style={styles.probioticStrains}>Strains: {probiotic.strains.join(', ')}</Text>
            <Text style={styles.probioticCfu}>CFU: {probiotic.cfu}</Text>
            <Text style={styles.probioticPurpose}>{probiotic.purpose}</Text>
            <Text style={styles.probioticDuration}>Duration: {probiotic.duration}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Dietary Changes</Text>
        {analysis.dietaryChanges?.map((change: any, index: number) => (
          <View key={index} style={styles.dietaryChangeCard}>
            <Text style={styles.dietaryChangeTitle}>{change.change}</Text>
            <Text style={styles.dietaryChangeReasoning}>{change.reasoning}</Text>
            <Text style={styles.dietaryChangeImplementation}>{change.implementation}</Text>
            <Text style={styles.dietaryChangeTimeline}>Timeline: {change.timeline}</Text>
          </View>
        ))}
      </Card>
    </View>
  );

  const renderDetoxResults = (analysis: any) => (
    <View style={styles.resultsContainer}>
      <Card style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Shield size={24} color="#27ae60" />
          <Text style={styles.resultTitle}>Detox Analysis</Text>
          <Badge variant="success">{`${Math.round(analysis.confidence * 100)}% Confidence`}</Badge>
        </View>

        <View style={styles.healthStatus}>
          <Text style={styles.healthStatusLabel}>Detox Capacity:</Text>
          <Badge 
            variant={analysis.overallDetoxCapacity === 'excellent' ? 'success' : 
                   analysis.overallDetoxCapacity === 'good' ? 'info' : 'warning'}
          >
            {analysis.overallDetoxCapacity?.toUpperCase()}
          </Badge>
        </View>

        <Text style={styles.sectionTitle}>Detox Program: {analysis.detoxProgram?.name}</Text>
        <Text style={styles.detoxDuration}>Duration: {analysis.detoxProgram?.totalDuration}</Text>
        <Text style={styles.detoxIntensity}>Intensity: {analysis.detoxProgram?.intensity}</Text>

        <Text style={styles.sectionTitle}>Detox Phases</Text>
        {analysis.detoxPhases?.map((phase: any, index: number) => (
          <View key={index} style={styles.detoxPhaseCard}>
            <Text style={styles.detoxPhaseTitle}>{phase.phase}</Text>
            <Text style={styles.detoxPhaseDuration}>Duration: {phase.duration}</Text>
            <Text style={styles.detoxPhaseFocus}>Focus: {phase.focus.join(', ')}</Text>
            <Text style={styles.detoxPhaseActivities}>Activities:</Text>
            {phase.activities?.map((activity: string, actIndex: number) => (
              <Text key={actIndex} style={styles.detoxPhaseActivity}>• {activity}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Liver Health</Text>
        <View style={styles.organHealthCard}>
          <Text style={styles.organStatus}>Status: {analysis.liverHealth?.status}</Text>
          <Text style={styles.organFunction}>Phase 1: {analysis.liverHealth?.phase1Function}</Text>
          <Text style={styles.organFunction}>Phase 2: {analysis.liverHealth?.phase2Function}</Text>
        </View>

        <Text style={styles.sectionTitle}>Lifestyle Changes</Text>
        {analysis.lifestyleChanges?.map((change: string, index: number) => (
          <Text key={index} style={styles.lifestyleChange}>• {change}</Text>
        ))}
      </Card>
    </View>
  );

  const renderHealthIssuesResults = (analysis: any) => (
    <View style={styles.resultsContainer}>
      <Card style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Brain size={24} color="#3498db" />
          <Text style={styles.resultTitle}>Health Issues Analysis</Text>
          <Badge variant="info">{`${Math.round(analysis.confidence * 100)}% Confidence`}</Badge>
        </View>

        <Text style={styles.sectionTitle}>Identified Issues</Text>
        {analysis.identifiedIssues?.map((issue: any, index: number) => (
          <View key={index} style={styles.healthIssueCard}>
            <View style={styles.healthIssueHeader}>
              <Text style={styles.healthIssueName}>{issue.issue}</Text>
              <Badge 
                variant={issue.severity === 'severe' ? 'error' : 
                       issue.severity === 'moderate' ? 'warning' : 'info'}
              >
                {issue.severity}
              </Badge>
            </View>
            <Text style={styles.healthIssueCategory}>Category: {issue.category}</Text>
            <Text style={styles.healthIssueLikelihood}>Likelihood: {issue.likelihood}</Text>
            <Text style={styles.healthIssueSymptoms}>Symptoms: {issue.symptoms.join(', ')}</Text>
            <Text style={styles.healthIssueCauses}>Possible Causes:</Text>
            {issue.possibleCauses?.map((cause: string, causeIndex: number) => (
              <Text key={causeIndex} style={styles.healthIssueCause}>• {cause}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Treatment Protocol</Text>
        {analysis.treatmentProtocol?.map((treatment: any, index: number) => (
          <View key={index} style={styles.treatmentCard}>
            <Text style={styles.treatmentCondition}>{treatment.condition}</Text>
            <Text style={styles.treatmentApproach}>Approach: {treatment.approach}</Text>
            <Text style={styles.treatmentDuration}>Duration: {treatment.duration}</Text>
            
            <Text style={styles.treatmentPhasesTitle}>Treatment Phases:</Text>
            {treatment.phases?.map((phase: any, phaseIndex: number) => (
              <View key={phaseIndex} style={styles.treatmentPhase}>
                <Text style={styles.treatmentPhaseTitle}>{phase.phase}</Text>
                <Text style={styles.treatmentPhaseDuration}>Duration: {phase.duration}</Text>
                <Text style={styles.treatmentPhaseGoals}>Goals: {phase.goals.join(', ')}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.disclaimer}>{analysis.disclaimer}</Text>
      </Card>
    </View>
  );

  const renderResults = () => {
    const { bloodworkAnalysis, digestiveAnalysis, detoxAnalysis, healthIssuesAnalysis } = results;

    return (
      <ScrollView style={styles.resultsScroll}>
        {bloodworkAnalysis && renderBloodworkResults(bloodworkAnalysis)}
        {digestiveAnalysis && renderDigestiveResults(digestiveAnalysis)}
        {detoxAnalysis && renderDetoxResults(detoxAnalysis)}
        {healthIssuesAnalysis && renderHealthIssuesResults(healthIssuesAnalysis)}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'AI Health Analysis',
          headerStyle: { backgroundColor: '#f8f9fa' },
          headerTintColor: '#2c3e50',
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Brain size={32} color="#3498db" />
          <Text style={styles.headerTitle}>AI-Powered Health Analysis</Text>
          <Text style={styles.headerSubtitle}>
            Get personalized insights based on your health data, blood type, and symptoms
          </Text>
        </View>

        {renderAnalysisTypeSelector()}
        {renderInputForm()}
        
        {Object.keys(results).length > 0 && renderResults()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  selectorCard: {
    margin: 15,
    padding: 20,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  selectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  selectorButton: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ecf0f1',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectorButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  inputCard: {
    margin: 15,
    padding: 20,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 40,
  },
  bloodTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bloodTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  bloodTypeButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  bloodTypeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  bloodTypeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  analyzeButton: {
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  },
  resultsContainer: {
    margin: 15,
  },
  resultsScroll: {
    flex: 1,
  },
  resultCard: {
    padding: 20,
    marginBottom: 15,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  healthStatusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  findingCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  findingMarker: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  findingValue: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  findingInterpretation: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
  },
  findingSignificance: {
    fontSize: 13,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  supplementCard: {
    backgroundColor: '#fff9e6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  supplementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  supplementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  supplementPurpose: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
  },
  supplementDosage: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  supplementTiming: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  supplementDuration: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  bloodTypeRecommendations: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  bloodTypeCategory: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 5,
  },
  bloodTypeItem: {
    fontSize: 14,
    color: '#34495e',
    marginLeft: 10,
    marginBottom: 2,
  },
  probioticCard: {
    backgroundColor: '#fff5e6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  probioticStrains: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  probioticCfu: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  probioticPurpose: {
    fontSize: 14,
    color: '#34495e',
    marginVertical: 5,
  },
  probioticDuration: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  dietaryChangeCard: {
    backgroundColor: '#f0fff0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  dietaryChangeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  dietaryChangeReasoning: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
  },
  dietaryChangeImplementation: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  dietaryChangeTimeline: {
    fontSize: 13,
    color: '#27ae60',
    fontWeight: '600',
  },
  detoxDuration: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  detoxIntensity: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  detoxPhaseCard: {
    backgroundColor: '#f0fff4',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  detoxPhaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  detoxPhaseDuration: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  detoxPhaseFocus: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 8,
  },
  detoxPhaseActivities: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  detoxPhaseActivity: {
    fontSize: 13,
    color: '#34495e',
    marginLeft: 10,
    marginBottom: 2,
  },
  organHealthCard: {
    backgroundColor: '#f8fff8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  organStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  organFunction: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  lifestyleChange: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
    marginLeft: 10,
  },
  healthIssueCard: {
    backgroundColor: '#f8f9ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  healthIssueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthIssueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  healthIssueCategory: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  healthIssueLikelihood: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  healthIssueSymptoms: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 8,
  },
  healthIssueCauses: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  healthIssueCause: {
    fontSize: 13,
    color: '#34495e',
    marginLeft: 10,
    marginBottom: 2,
  },
  treatmentCard: {
    backgroundColor: '#fff8f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  treatmentCondition: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  treatmentApproach: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  treatmentDuration: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  treatmentPhasesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  treatmentPhase: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  treatmentPhaseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 3,
  },
  treatmentPhaseDuration: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  treatmentPhaseGoals: {
    fontSize: 13,
    color: '#34495e',
  },
  disclaimer: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
});

function createMockResults(type: 'bloodwork' | 'digestive' | 'detox' | 'issues'): Partial<HealthAnalysisResult> {
  if (type === 'bloodwork') {
    return {
      bloodworkAnalysis: {
        confidence: 0.8,
        overallHealth: 'good',
        keyFindings: [
          { marker: 'Vitamin D', value: 25, unit: 'ng/mL', status: 'borderline', interpretation: 'Slightly low; consider D3', clinicalSignificance: 'Mood, immunity' } as any,
          { marker: 'Iron', value: 45, unit: 'μg/dL', status: 'borderline', interpretation: 'Low-normal iron', clinicalSignificance: 'Energy levels' } as any,
        ],
        supplementRecommendations: [
          { name: 'Vitamin D3', purpose: 'Optimize D levels', dosage: '2000 IU', timing: 'With fat', duration: '3 months', priority: 'high' } as any,
        ],
        bloodTypeRecommendations: { bloodType: 'O+', dietaryFocus: ['Lean proteins', 'Veggies'], exerciseRecommendations: ['Strength + HIIT'] } as any,
        disclaimer: 'Sample analysis for demo.'
      } as any
    } as Partial<HealthAnalysisResult>;
  }
  if (type === 'digestive') {
    return {
      digestiveAnalysis: {
        confidence: 0.78,
        overallDigestiveHealth: 'fair',
        probioticRecommendations: [{ strains: ['L. plantarum'], cfu: '50B CFU', purpose: 'Bloating', duration: '8 weeks' }],
        dietaryChanges: [{ change: 'Add fiber gradually', reasoning: 'Gut health', implementation: '5g/week', timeline: '6 weeks' }],
      } as any,
    } as Partial<HealthAnalysisResult>;
  }
  if (type === 'detox') {
    return {
      detoxAnalysis: {
        confidence: 0.75,
        overallDetoxCapacity: 'good',
        detoxProgram: { name: 'Gentle 2-week reset', totalDuration: '14 days', intensity: 'light' },
        detoxPhases: [{ phase: 'Prep', duration: '3 days', focus: ['Hydration'], activities: ['Walk', 'Sauna (optional)'] }],
        liverHealth: { status: 'ok', phase1Function: 'normal', phase2Function: 'normal' },
        lifestyleChanges: ['Sleep 7-9h', 'Limit alcohol'],
      } as any,
    } as Partial<HealthAnalysisResult>;
  }
  return {
    healthIssuesAnalysis: {
      confidence: 0.72,
      identifiedIssues: [{ issue: 'Low energy', severity: 'moderate', category: 'metabolic', likelihood: 'possible', symptoms: ['fatigue'], possibleCauses: ['sleep', 'diet'] }],
      treatmentProtocol: [{ condition: 'Fatigue', approach: 'Sleep + nutrition', duration: '4 weeks', phases: [{ phase: 'Week 1-2', duration: '2w', goals: ['Sleep hygiene'] }] }],
      disclaimer: 'Sample analysis for demo.'
    } as any,
  } as Partial<HealthAnalysisResult>;
}

export default AIHealthAnalysisScreen;