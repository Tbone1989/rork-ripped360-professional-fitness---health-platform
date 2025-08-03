import { z } from "zod";
import { publicProcedure } from "../../../create-context";

interface HealthIssueAnalysis {
  id: string;
  userId: string;
  analysisDate: string;
  identifiedIssues: IdentifiedHealthIssue[];
  riskAssessment: HealthRiskAssessment[];
  recommendedTests: RecommendedTest[];
  treatmentProtocol: TreatmentProtocol[];
  lifestyleModifications: LifestyleModification[];
  supplementRecommendations: HealthSupplementRecommendation[];
  dietaryInterventions: DietaryIntervention[];
  monitoringPlan: MonitoringPlan[];
  referrals: ProfessionalReferral[];
  followUpSchedule: string[];
  confidence: number;
  disclaimer: string;
}

interface IdentifiedHealthIssue {
  issue: string;
  category: 'digestive' | 'metabolic' | 'hormonal' | 'immune' | 'cardiovascular' | 'neurological' | 'other';
  severity: 'mild' | 'moderate' | 'severe';
  likelihood: 'low' | 'moderate' | 'high';
  symptoms: string[];
  possibleCauses: string[];
  relatedConditions: string[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

interface HealthRiskAssessment {
  condition: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  riskFactors: string[];
  protectiveFactors: string[];
  timeframe: string;
  prevention: string[];
  earlyDetection: string[];
}

interface RecommendedTest {
  test: string;
  purpose: string;
  urgency: 'routine' | 'soon' | 'urgent';
  frequency: string;
  preparation: string[];
  expectedFindings: string[];
}

interface TreatmentProtocol {
  condition: string;
  approach: 'conservative' | 'moderate' | 'aggressive';
  phases: TreatmentPhase[];
  duration: string;
  successMetrics: string[];
  alternatives: string[];
}

interface TreatmentPhase {
  phase: string;
  duration: string;
  interventions: string[];
  goals: string[];
  monitoring: string[];
}

interface LifestyleModification {
  area: string;
  currentStatus: string;
  targetStatus: string;
  steps: string[];
  timeline: string;
  barriers: string[];
  support: string[];
}

interface HealthSupplementRecommendation {
  supplement: string;
  purpose: string;
  dosage: string;
  timing: string;
  duration: string;
  priority: 'essential' | 'beneficial' | 'optional';
  interactions: string[];
  monitoring: string[];
}

interface DietaryIntervention {
  intervention: string;
  purpose: string;
  foods: string[];
  avoidFoods: string[];
  mealTiming: string[];
  duration: string;
  expectedOutcomes: string[];
}

interface MonitoringPlan {
  parameter: string;
  method: string;
  frequency: string;
  targets: string[];
  alerts: string[];
}

interface ProfessionalReferral {
  specialist: string;
  reason: string;
  urgency: 'routine' | 'soon' | 'urgent';
  preparation: string[];
  questions: string[];
}

const analyzeHealthIssues = async (healthData: any): Promise<HealthIssueAnalysis> => {
  const symptoms = healthData.symptoms || [];
  const medicalHistory = healthData.medicalHistory || [];
  const familyHistory = healthData.familyHistory || [];
  
  const analysis: HealthIssueAnalysis = {
    id: `health_analysis_${Date.now()}`,
    userId: healthData.userId || 'user_123',
    analysisDate: new Date().toISOString(),
    identifiedIssues: [
      {
        issue: 'Chronic Fatigue',
        category: 'metabolic',
        severity: 'moderate',
        likelihood: 'high',
        symptoms: ['Persistent tiredness', 'Low energy', 'Difficulty concentrating'],
        possibleCauses: [
          'Iron deficiency',
          'Thyroid dysfunction',
          'Sleep disorders',
          'Chronic stress',
          'Nutrient deficiencies'
        ],
        relatedConditions: ['Adrenal fatigue', 'Depression', 'Fibromyalgia'],
        urgency: 'medium'
      },
      {
        issue: 'Digestive Issues',
        category: 'digestive',
        severity: 'mild',
        likelihood: 'moderate',
        symptoms: ['Bloating', 'Gas', 'Irregular bowel movements'],
        possibleCauses: [
          'Food intolerances',
          'SIBO',
          'Low stomach acid',
          'Stress',
          'Poor diet'
        ],
        relatedConditions: ['IBS', 'Leaky gut syndrome', 'GERD'],
        urgency: 'low'
      },
      {
        issue: 'Hormonal Imbalance',
        category: 'hormonal',
        severity: 'moderate',
        likelihood: 'moderate',
        symptoms: ['Mood swings', 'Sleep disturbances', 'Weight changes'],
        possibleCauses: [
          'Stress',
          'Poor diet',
          'Lack of exercise',
          'Environmental toxins',
          'Age-related changes'
        ],
        relatedConditions: ['PCOS', 'Thyroid disorders', 'Adrenal dysfunction'],
        urgency: 'medium'
      }
    ],
    riskAssessment: [
      {
        condition: 'Type 2 Diabetes',
        riskLevel: 'moderate',
        riskFactors: ['Family history', 'Sedentary lifestyle', 'Poor diet'],
        protectiveFactors: ['Regular exercise', 'Healthy weight', 'Good sleep'],
        timeframe: '5-10 years',
        prevention: [
          'Maintain healthy weight',
          'Regular physical activity',
          'Balanced diet',
          'Regular monitoring'
        ],
        earlyDetection: ['Annual glucose testing', 'HbA1c monitoring']
      },
      {
        condition: 'Cardiovascular Disease',
        riskLevel: 'low',
        riskFactors: ['Stress', 'Family history'],
        protectiveFactors: ['Active lifestyle', 'Healthy diet', 'Non-smoker'],
        timeframe: '10-20 years',
        prevention: [
          'Regular cardio exercise',
          'Mediterranean diet',
          'Stress management',
          'Regular check-ups'
        ],
        earlyDetection: ['Lipid panels', 'Blood pressure monitoring', 'ECG']
      }
    ],
    recommendedTests: [
      {
        test: 'Comprehensive Metabolic Panel',
        purpose: 'Assess overall metabolic health and organ function',
        urgency: 'soon',
        frequency: 'Annually',
        preparation: ['12-hour fast', 'Avoid alcohol 24 hours prior'],
        expectedFindings: ['Glucose levels', 'Kidney function', 'Liver function', 'Electrolytes']
      },
      {
        test: 'Complete Blood Count (CBC)',
        purpose: 'Check for anemia, infections, and blood disorders',
        urgency: 'soon',
        frequency: 'Annually',
        preparation: ['No special preparation needed'],
        expectedFindings: ['Red blood cell count', 'White blood cell count', 'Platelet count']
      },
      {
        test: 'Thyroid Function Panel',
        purpose: 'Evaluate thyroid hormone levels and function',
        urgency: 'soon',
        frequency: 'Every 2 years or as needed',
        preparation: ['Morning collection preferred'],
        expectedFindings: ['TSH', 'Free T4', 'Free T3', 'Reverse T3']
      },
      {
        test: 'Vitamin D 25(OH)D',
        purpose: 'Assess vitamin D status',
        urgency: 'routine',
        frequency: 'Every 6 months initially, then annually',
        preparation: ['No special preparation'],
        expectedFindings: ['Vitamin D levels', 'Deficiency assessment']
      }
    ],
    treatmentProtocol: [
      {
        condition: 'Chronic Fatigue',
        approach: 'moderate',
        phases: [
          {
            phase: 'Assessment and Foundation',
            duration: '4 weeks',
            interventions: [
              'Comprehensive testing',
              'Sleep hygiene optimization',
              'Basic supplementation',
              'Stress assessment'
            ],
            goals: ['Identify root causes', 'Establish baseline', 'Improve sleep quality'],
            monitoring: ['Energy levels', 'Sleep quality', 'Mood']
          },
          {
            phase: 'Active Treatment',
            duration: '8-12 weeks',
            interventions: [
              'Targeted supplementation',
              'Dietary modifications',
              'Gentle exercise program',
              'Stress management techniques'
            ],
            goals: ['Address deficiencies', 'Improve energy', 'Build resilience'],
            monitoring: ['Energy levels', 'Exercise tolerance', 'Lab markers']
          },
          {
            phase: 'Maintenance and Optimization',
            duration: 'Ongoing',
            interventions: [
              'Lifestyle maintenance',
              'Regular monitoring',
              'Preventive measures',
              'Periodic reassessment'
            ],
            goals: ['Sustain improvements', 'Prevent relapse', 'Optimize health'],
            monitoring: ['Long-term energy stability', 'Quality of life measures']
          }
        ],
        duration: '4-6 months initial treatment',
        successMetrics: [
          'Sustained energy levels',
          'Improved sleep quality',
          'Better exercise tolerance',
          'Enhanced mood and cognition'
        ],
        alternatives: ['Functional medicine approach', 'Integrative treatment', 'Specialist referral']
      }
    ],
    lifestyleModifications: [
      {
        area: 'Sleep Hygiene',
        currentStatus: 'Poor - irregular sleep schedule, screen time before bed',
        targetStatus: 'Consistent 7-9 hours nightly with good sleep quality',
        steps: [
          'Establish consistent bedtime and wake time',
          'Create relaxing bedtime routine',
          'Optimize sleep environment',
          'Limit screen time 2 hours before bed',
          'Avoid caffeine after 2 PM'
        ],
        timeline: '2-4 weeks to establish routine',
        barriers: ['Work schedule', 'Stress', 'Technology habits'],
        support: ['Sleep tracking app', 'Blackout curtains', 'Blue light blocking glasses']
      },
      {
        area: 'Stress Management',
        currentStatus: 'High stress levels with limited coping strategies',
        targetStatus: 'Effective stress management with regular practice',
        steps: [
          'Learn and practice deep breathing techniques',
          'Incorporate daily meditation or mindfulness',
          'Regular physical activity',
          'Time management improvements',
          'Social support network development'
        ],
        timeline: '4-8 weeks to develop habits',
        barriers: ['Time constraints', 'Skepticism', 'Lack of knowledge'],
        support: ['Meditation apps', 'Stress management courses', 'Counseling if needed']
      }
    ],
    supplementRecommendations: [
      {
        supplement: 'Iron Bisglycinate',
        purpose: 'Address potential iron deficiency contributing to fatigue',
        dosage: '18-25 mg daily',
        timing: 'On empty stomach with vitamin C',
        duration: '3 months, then reassess',
        priority: 'essential',
        interactions: ['Avoid with calcium, tea, coffee'],
        monitoring: ['Iron studies', 'Energy levels', 'Digestive tolerance']
      },
      {
        supplement: 'Vitamin D3',
        purpose: 'Optimize vitamin D status for energy and immune function',
        dosage: '2000-4000 IU daily',
        timing: 'With fat-containing meal',
        duration: '3-6 months, then maintenance',
        priority: 'essential',
        interactions: ['May increase calcium absorption'],
        monitoring: ['25(OH)D levels', 'Calcium levels']
      },
      {
        supplement: 'B-Complex',
        purpose: 'Support energy metabolism and nervous system function',
        dosage: 'High-potency formula',
        timing: 'With breakfast',
        duration: '3-6 months',
        priority: 'beneficial',
        interactions: ['May interact with certain medications'],
        monitoring: ['Energy levels', 'Mood', 'Cognitive function']
      }
    ],
    dietaryInterventions: [
      {
        intervention: 'Anti-Inflammatory Diet',
        purpose: 'Reduce systemic inflammation and support overall health',
        foods: [
          'Fatty fish',
          'Leafy greens',
          'Berries',
          'Nuts and seeds',
          'Olive oil',
          'Turmeric',
          'Ginger'
        ],
        avoidFoods: [
          'Processed foods',
          'Refined sugars',
          'Trans fats',
          'Excessive omega-6 oils',
          'Alcohol'
        ],
        mealTiming: [
          'Regular meal times',
          'Avoid late-night eating',
          'Consider intermittent fasting'
        ],
        duration: '3-6 months minimum',
        expectedOutcomes: [
          'Reduced inflammation markers',
          'Improved energy',
          'Better digestion',
          'Enhanced mood'
        ]
      }
    ],
    monitoringPlan: [
      {
        parameter: 'Energy Levels',
        method: 'Daily self-assessment scale (1-10)',
        frequency: 'Daily for first month, then weekly',
        targets: ['Consistent energy >6/10', 'No afternoon crashes'],
        alerts: ['Energy <4/10 for >3 days', 'Worsening fatigue']
      },
      {
        parameter: 'Sleep Quality',
        method: 'Sleep diary and tracking device',
        frequency: 'Daily',
        targets: ['7-9 hours nightly', 'Sleep efficiency >85%'],
        alerts: ['<6 hours sleep', 'Frequent night wakings']
      },
      {
        parameter: 'Laboratory Markers',
        method: 'Blood tests',
        frequency: 'Every 3 months initially',
        targets: ['Iron studies in normal range', 'Vitamin D >30 ng/mL'],
        alerts: ['Worsening deficiencies', 'New abnormal values']
      }
    ],
    referrals: [
      {
        specialist: 'Endocrinologist',
        reason: 'Evaluate thyroid function and hormonal status',
        urgency: 'routine',
        preparation: [
          'Bring symptom diary',
          'List all medications and supplements',
          'Family history of thyroid disorders'
        ],
        questions: [
          'Could thyroid dysfunction explain my symptoms?',
          'What additional tests might be helpful?',
          'Are there other hormonal imbalances to consider?'
        ]
      }
    ],
    followUpSchedule: [
      '2 weeks: Initial response assessment',
      '4 weeks: Supplement tolerance and early effects',
      '8 weeks: Mid-treatment evaluation',
      '12 weeks: Comprehensive reassessment',
      '6 months: Long-term progress review',
      'Annually: Preventive health assessment'
    ],
    confidence: 0.78,
    disclaimer: 'This analysis is for educational purposes only and should not replace professional medical advice. Please consult with qualified healthcare providers for proper diagnosis and treatment of any health conditions.'
  };

  return analysis;
};

export const analyzeHealthIssuesProcedure = publicProcedure
  .input(z.object({
    symptoms: z.array(z.string()),
    duration: z.record(z.string()).optional(),
    severity: z.record(z.string()).optional(),
    medicalHistory: z.array(z.string()).optional(),
    familyHistory: z.array(z.string()).optional(),
    currentMedications: z.array(z.string()).optional(),
    lifestyle: z.object({
      diet: z.string().optional(),
      exercise: z.string().optional(),
      sleep: z.string().optional(),
      stress: z.string().optional(),
      smoking: z.boolean().optional(),
      alcohol: z.string().optional()
    }).optional(),
    previousTests: z.array(z.string()).optional(),
    concerns: z.array(z.string()).optional(),
    userId: z.string().optional()
  }))
  .mutation(async ({ input }) => {
    console.log(`🏥 Analyzing health issues and symptoms`);
    
    try {
      const analysis = await analyzeHealthIssues(input);
      
      console.log(`✅ Generated health analysis with ${analysis.identifiedIssues.length} identified issues`);
      
      return {
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error analyzing health issues:', error);
      return {
        success: false,
        error: 'Failed to analyze health issues',
        timestamp: new Date().toISOString()
      };
    }
  });

export default analyzeHealthIssuesProcedure;