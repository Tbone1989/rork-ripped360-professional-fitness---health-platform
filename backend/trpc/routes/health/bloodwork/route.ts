import { z } from "zod";
import { publicProcedure } from "../../../create-context";

interface AIBloodworkAnalysis {
  id: string;
  userId: string;
  bloodworkId: string;
  analysisDate: string;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  keyFindings: AIFinding[];
  nutritionalDeficiencies: NutritionalDeficiency[];
  supplementRecommendations: AISupplementRecommendation[];
  dietaryRecommendations: AIDietaryRecommendation[];
  lifestyleRecommendations: string[];
  followUpRecommendations: string[];
  riskAssessment: RiskAssessment[];
  bloodTypeRecommendations?: BloodTypeRecommendations;
  digestiveHealthInsights?: DigestiveHealthInsights;
  detoxRecommendations?: DetoxRecommendations;
  confidence: number;
  disclaimer: string;
}

interface AIFinding {
  marker: string;
  value: number;
  unit: string;
  status: 'optimal' | 'normal' | 'borderline' | 'abnormal' | 'critical';
  interpretation: string;
  clinicalSignificance: string;
  recommendations: string[];
  relatedMarkers: string[];
}

interface NutritionalDeficiency {
  nutrient: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  foodSources: string[];
  supplementForm: string;
  dosageRecommendation: string;
  duration: string;
  monitoringMarkers: string[];
}

interface AISupplementRecommendation {
  name: string;
  purpose: string;
  dosage: string;
  timing: string;
  duration: string;
  form: string;
  priority: 'high' | 'medium' | 'low';
  interactions: string[];
  contraindications: string[];
  expectedBenefits: string[];
  monitoringRequired: boolean;
}

interface AIDietaryRecommendation {
  category: string;
  recommendation: string;
  foods: string[];
  avoidFoods: string[];
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  duration: string;
  expectedOutcome: string;
}

interface RiskAssessment {
  condition: string;
  risk: 'low' | 'moderate' | 'high' | 'very-high';
  factors: string[];
  prevention: string[];
  monitoring: string[];
  timeframe: string;
}

interface BloodTypeRecommendations {
  bloodType: string;
  dietaryFocus: string[];
  supplementPriorities: string[];
  exerciseRecommendations: string[];
  healthRisks: string[];
}

interface DigestiveHealthInsights {
  markers: string[];
  recommendations: string[];
  probioticNeeds: string[];
  enzymeSupport: string[];
  dietaryChanges: string[];
}

interface DetoxRecommendations {
  liverSupport: string[];
  kidneySupport: string[];
  detoxPhases: string[];
  supplementProtocol: string[];
  lifestyleChanges: string[];
}

const generateAIBloodworkAnalysis = async (bloodworkData: any, userProfile?: any): Promise<AIBloodworkAnalysis> => {
  // Simulate AI analysis with comprehensive health insights
  const analysis: AIBloodworkAnalysis = {
    id: `analysis_${Date.now()}`,
    userId: bloodworkData.userId || 'user_123',
    bloodworkId: bloodworkData.id || 'bloodwork_123',
    analysisDate: new Date().toISOString(),
    overallHealth: 'good',
    keyFindings: [
      {
        marker: 'Vitamin D',
        value: 25,
        unit: 'ng/mL',
        status: 'borderline',
        interpretation: 'Vitamin D levels are below optimal range',
        clinicalSignificance: 'May affect immune function, bone health, and mood',
        recommendations: [
          'Increase sun exposure to 15-20 minutes daily',
          'Consider vitamin D3 supplementation',
          'Include fatty fish and fortified foods'
        ],
        relatedMarkers: ['Calcium', 'Parathyroid Hormone']
      },
      {
        marker: 'B12',
        value: 350,
        unit: 'pg/mL',
        status: 'normal',
        interpretation: 'B12 levels are within normal range but could be optimized',
        clinicalSignificance: 'Important for energy production and neurological function',
        recommendations: [
          'Maintain current B12 intake',
          'Monitor if following plant-based diet'
        ],
        relatedMarkers: ['Folate', 'Homocysteine']
      },
      {
        marker: 'Iron',
        value: 45,
        unit: 'μg/dL',
        status: 'abnormal',
        interpretation: 'Iron levels are below optimal range',
        clinicalSignificance: 'May cause fatigue, weakness, and reduced exercise performance',
        recommendations: [
          'Increase iron-rich foods (red meat, spinach, lentils)',
          'Consider iron supplementation with vitamin C',
          'Avoid tea/coffee with iron-rich meals'
        ],
        relatedMarkers: ['Ferritin', 'TIBC', 'Transferrin Saturation']
      }
    ],
    nutritionalDeficiencies: [
      {
        nutrient: 'Vitamin D',
        severity: 'moderate',
        symptoms: ['Fatigue', 'Mood changes', 'Bone pain'],
        foodSources: ['Fatty fish', 'Egg yolks', 'Fortified dairy'],
        supplementForm: 'Vitamin D3 (Cholecalciferol)',
        dosageRecommendation: '2000-4000 IU daily',
        duration: '3-6 months',
        monitoringMarkers: ['25(OH)D']
      },
      {
        nutrient: 'Iron',
        severity: 'mild',
        symptoms: ['Fatigue', 'Pale skin', 'Cold hands/feet'],
        foodSources: ['Red meat', 'Spinach', 'Lentils', 'Quinoa'],
        supplementForm: 'Iron bisglycinate',
        dosageRecommendation: '18-25 mg daily',
        duration: '2-3 months',
        monitoringMarkers: ['Serum Iron', 'Ferritin']
      }
    ],
    supplementRecommendations: [
      {
        name: 'Vitamin D3',
        purpose: 'Optimize vitamin D status for immune and bone health',
        dosage: '2000-4000 IU',
        timing: 'With fat-containing meal',
        duration: '3-6 months, then maintenance',
        form: 'Softgel or liquid',
        priority: 'high',
        interactions: ['May increase calcium absorption'],
        contraindications: ['Hypercalcemia', 'Kidney stones'],
        expectedBenefits: ['Improved immune function', 'Better mood', 'Stronger bones'],
        monitoringRequired: true
      },
      {
        name: 'Iron Bisglycinate',
        purpose: 'Address iron deficiency and improve energy levels',
        dosage: '18-25 mg',
        timing: 'On empty stomach or with vitamin C',
        duration: '2-3 months',
        form: 'Chelated iron supplement',
        priority: 'high',
        interactions: ['Avoid with calcium, tea, coffee'],
        contraindications: ['Hemochromatosis', 'Iron overload'],
        expectedBenefits: ['Increased energy', 'Better exercise performance'],
        monitoringRequired: true
      },
      {
        name: 'Omega-3 EPA/DHA',
        purpose: 'Support cardiovascular and brain health',
        dosage: '1000-2000 mg',
        timing: 'With meals',
        duration: 'Long-term',
        form: 'Fish oil or algae-based',
        priority: 'medium',
        interactions: ['May enhance blood-thinning medications'],
        contraindications: ['Fish allergies (if fish-based)'],
        expectedBenefits: ['Reduced inflammation', 'Heart health support'],
        monitoringRequired: false
      }
    ],
    dietaryRecommendations: [
      {
        category: 'Anti-inflammatory Foods',
        recommendation: 'Increase consumption of omega-3 rich foods and antioxidants',
        foods: ['Fatty fish', 'Walnuts', 'Berries', 'Leafy greens', 'Turmeric'],
        avoidFoods: ['Processed foods', 'Excess sugar', 'Trans fats'],
        reasoning: 'Support overall health and reduce inflammatory markers',
        priority: 'high',
        duration: 'Long-term lifestyle change',
        expectedOutcome: 'Reduced inflammation and improved energy'
      },
      {
        category: 'Iron Absorption',
        recommendation: 'Optimize iron absorption through food combinations',
        foods: ['Vitamin C sources with iron-rich foods', 'Citrus fruits', 'Bell peppers'],
        avoidFoods: ['Tea/coffee with iron-rich meals', 'Calcium supplements with iron'],
        reasoning: 'Enhance iron absorption to address deficiency',
        priority: 'high',
        duration: '2-3 months',
        expectedOutcome: 'Improved iron status and energy levels'
      }
    ],
    lifestyleRecommendations: [
      'Get 15-20 minutes of sunlight exposure daily for vitamin D synthesis',
      'Incorporate stress management techniques (meditation, yoga)',
      'Ensure 7-9 hours of quality sleep nightly',
      'Stay hydrated with 8-10 glasses of water daily',
      'Consider regular moderate exercise to improve circulation'
    ],
    followUpRecommendations: [
      'Retest vitamin D levels in 3 months',
      'Monitor iron markers in 2-3 months',
      'Annual comprehensive metabolic panel',
      'Consider thyroid function testing if fatigue persists'
    ],
    riskAssessment: [
      {
        condition: 'Osteoporosis',
        risk: 'moderate',
        factors: ['Low vitamin D', 'Age', 'Gender'],
        prevention: ['Vitamin D supplementation', 'Weight-bearing exercise', 'Adequate calcium'],
        monitoring: ['Bone density scan', 'Annual vitamin D testing'],
        timeframe: 'Monitor over next 5-10 years'
      }
    ],
    bloodTypeRecommendations: userProfile?.bloodType ? {
      bloodType: userProfile.bloodType,
      dietaryFocus: getBloodTypeDietRecommendations(userProfile.bloodType),
      supplementPriorities: getBloodTypeSupplements(userProfile.bloodType),
      exerciseRecommendations: getBloodTypeExercise(userProfile.bloodType),
      healthRisks: getBloodTypeHealthRisks(userProfile.bloodType)
    } : undefined,
    digestiveHealthInsights: {
      markers: ['B12', 'Folate', 'Iron'],
      recommendations: [
        'Consider digestive enzyme support',
        'Increase fiber intake gradually',
        'Monitor for food sensitivities'
      ],
      probioticNeeds: ['Multi-strain probiotic', 'Prebiotic fiber'],
      enzymeSupport: ['Digestive enzymes with meals'],
      dietaryChanges: ['Increase fermented foods', 'Reduce processed foods']
    },
    detoxRecommendations: {
      liverSupport: ['Milk thistle', 'N-acetyl cysteine', 'Alpha lipoic acid'],
      kidneySupport: ['Adequate hydration', 'Cranberry extract', 'Reduce sodium'],
      detoxPhases: ['Phase 1: Preparation (1 week)', 'Phase 2: Active detox (2 weeks)', 'Phase 3: Maintenance'],
      supplementProtocol: ['Glutathione support', 'B-complex vitamins', 'Magnesium'],
      lifestyleChanges: ['Reduce toxin exposure', 'Increase sweating through exercise', 'Improve sleep quality']
    },
    confidence: 0.85,
    disclaimer: 'This analysis is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider before making any changes to your health regimen.'
  };

  return analysis;
};

const getBloodTypeDietRecommendations = (bloodType: string): string[] => {
  const recommendations: Record<string, string[]> = {
    'O+': ['High protein diet', 'Lean meats', 'Fish', 'Vegetables', 'Limit grains'],
    'O-': ['High protein diet', 'Lean meats', 'Fish', 'Vegetables', 'Limit grains'],
    'A+': ['Plant-based diet', 'Vegetables', 'Fruits', 'Whole grains', 'Limit red meat'],
    'A-': ['Plant-based diet', 'Vegetables', 'Fruits', 'Whole grains', 'Limit red meat'],
    'B+': ['Balanced diet', 'Dairy products', 'Green vegetables', 'Meat', 'Avoid chicken'],
    'B-': ['Balanced diet', 'Dairy products', 'Green vegetables', 'Meat', 'Avoid chicken'],
    'AB+': ['Mixed diet', 'Seafood', 'Dairy', 'Vegetables', 'Small frequent meals'],
    'AB-': ['Mixed diet', 'Seafood', 'Dairy', 'Vegetables', 'Small frequent meals']
  };
  return recommendations[bloodType] || ['Balanced, whole foods diet'];
};

const getBloodTypeSupplements = (bloodType: string): string[] => {
  const supplements: Record<string, string[]> = {
    'O+': ['B-complex', 'Vitamin K', 'Calcium', 'Iodine'],
    'O-': ['B-complex', 'Vitamin K', 'Calcium', 'Iodine'],
    'A+': ['Vitamin B12', 'Iron', 'Calcium', 'Vitamin E'],
    'A-': ['Vitamin B12', 'Iron', 'Calcium', 'Vitamin E'],
    'B+': ['Magnesium', 'Lecithin', 'Vitamin C', 'Licorice root'],
    'B-': ['Magnesium', 'Lecithin', 'Vitamin C', 'Licorice root'],
    'AB+': ['Vitamin C', 'Vitamin E', 'Calcium', 'Zinc'],
    'AB-': ['Vitamin C', 'Vitamin E', 'Calcium', 'Zinc']
  };
  return supplements[bloodType] || ['Multivitamin', 'Omega-3'];
};

const getBloodTypeExercise = (bloodType: string): string[] => {
  const exercise: Record<string, string[]> = {
    'O+': ['High-intensity cardio', 'Weight training', 'Running', 'Martial arts'],
    'O-': ['High-intensity cardio', 'Weight training', 'Running', 'Martial arts'],
    'A+': ['Gentle exercise', 'Yoga', 'Tai chi', 'Walking', 'Swimming'],
    'A-': ['Gentle exercise', 'Yoga', 'Tai chi', 'Walking', 'Swimming'],
    'B+': ['Moderate exercise', 'Tennis', 'Cycling', 'Hiking', 'Dancing'],
    'B-': ['Moderate exercise', 'Tennis', 'Cycling', 'Hiking', 'Dancing'],
    'AB+': ['Mixed intensity', 'Yoga', 'Pilates', 'Light cardio', 'Strength training'],
    'AB-': ['Mixed intensity', 'Yoga', 'Pilates', 'Light cardio', 'Strength training']
  };
  return exercise[bloodType] || ['Moderate cardio', 'Strength training'];
};

const getBloodTypeHealthRisks = (bloodType: string): string[] => {
  const risks: Record<string, string[]> = {
    'O+': ['Heart disease', 'Ulcers', 'Thyroid disorders'],
    'O-': ['Heart disease', 'Ulcers', 'Thyroid disorders'],
    'A+': ['Heart disease', 'Cancer', 'Diabetes'],
    'A-': ['Heart disease', 'Cancer', 'Diabetes'],
    'B+': ['Diabetes', 'Autoimmune disorders', 'Slow metabolism'],
    'B-': ['Diabetes', 'Autoimmune disorders', 'Slow metabolism'],
    'AB+': ['Heart disease', 'Cancer', 'Cognitive decline'],
    'AB-': ['Heart disease', 'Cancer', 'Cognitive decline']
  };
  return risks[bloodType] || ['General health monitoring recommended'];
};

export const analyzeBloodworkProcedure = publicProcedure
  .input(z.object({
    bloodworkData: z.any(),
    userProfile: z.any().optional(),
    includeBloodType: z.boolean().optional(),
    includeDigestiveHealth: z.boolean().optional(),
    includeDetoxRecommendations: z.boolean().optional()
  }))
  .mutation(async ({ input }) => {
    console.log(`🩸 Analyzing bloodwork with AI-powered insights`);
    
    try {
      // Simulate API call to AI service
      const analysis = await generateAIBloodworkAnalysis(
        input.bloodworkData,
        input.userProfile
      );
      
      console.log(`✅ Generated comprehensive analysis with ${analysis.keyFindings.length} key findings`);
      
      return {
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error analyzing bloodwork:', error);
      return {
        success: false,
        error: 'Failed to analyze bloodwork',
        timestamp: new Date().toISOString()
      };
    }
  });

export default analyzeBloodworkProcedure;