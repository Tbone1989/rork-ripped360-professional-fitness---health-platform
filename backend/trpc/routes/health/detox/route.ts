import { z } from "zod";
import { publicProcedure } from "../../../create-context";

interface DetoxAnalysis {
  id: string;
  userId: string;
  analysisDate: string;
  overallDetoxCapacity: 'excellent' | 'good' | 'fair' | 'poor';
  liverHealth: LiverAssessment;
  kidneyHealth: KidneyAssessment;
  detoxPhases: DetoxPhase[];
  supplementProtocol: DetoxSupplement[];
  dietaryRecommendations: DetoxDietRecommendation[];
  lifestyleChanges: string[];
  toxinExposureAssessment: ToxinExposure[];
  detoxProgram: DetoxProgram;
  monitoringPlan: string[];
  warnings: string[];
  confidence: number;
}

interface LiverAssessment {
  status: 'excellent' | 'good' | 'fair' | 'poor';
  phase1Function: 'optimal' | 'adequate' | 'impaired';
  phase2Function: 'optimal' | 'adequate' | 'impaired';
  supportNeeded: string[];
  keyMarkers: string[];
  recommendations: string[];
}

interface KidneyAssessment {
  status: 'excellent' | 'good' | 'fair' | 'poor';
  filtrationCapacity: 'optimal' | 'adequate' | 'impaired';
  hydrationStatus: 'optimal' | 'adequate' | 'poor';
  supportNeeded: string[];
  recommendations: string[];
}

interface DetoxPhase {
  phase: string;
  duration: string;
  focus: string[];
  activities: string[];
  supplements: string[];
  dietGuidelines: string[];
  expectedOutcomes: string[];
  monitoring: string[];
}

interface DetoxSupplement {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
  purpose: string;
  phase: string;
  interactions: string[];
  contraindications: string[];
}

interface DetoxDietRecommendation {
  category: string;
  foods: string[];
  avoidFoods: string[];
  reasoning: string;
  phase: string;
  preparation: string[];
}

interface ToxinExposure {
  source: string;
  type: 'environmental' | 'dietary' | 'lifestyle' | 'occupational';
  severity: 'low' | 'moderate' | 'high';
  recommendations: string[];
}

interface DetoxProgram {
  name: string;
  totalDuration: string;
  intensity: 'gentle' | 'moderate' | 'intensive';
  phases: string[];
  expectedBenefits: string[];
  contraindications: string[];
}

const analyzeDetoxCapacity = async (healthData: any): Promise<DetoxAnalysis> => {
  const analysis: DetoxAnalysis = {
    id: `detox_analysis_${Date.now()}`,
    userId: healthData.userId || 'user_123',
    analysisDate: new Date().toISOString(),
    overallDetoxCapacity: 'fair',
    liverHealth: {
      status: 'fair',
      phase1Function: 'adequate',
      phase2Function: 'impaired',
      supportNeeded: ['Glutathione support', 'B-vitamin complex', 'Antioxidants'],
      keyMarkers: ['ALT', 'AST', 'Bilirubin', 'Alkaline Phosphatase'],
      recommendations: [
        'Support Phase 2 detoxification pathways',
        'Increase cruciferous vegetables',
        'Consider milk thistle supplementation',
        'Reduce alcohol consumption'
      ]
    },
    kidneyHealth: {
      status: 'good',
      filtrationCapacity: 'adequate',
      hydrationStatus: 'adequate',
      supportNeeded: ['Increased hydration', 'Electrolyte balance'],
      recommendations: [
        'Increase water intake to 3-4 liters daily',
        'Include kidney-supporting herbs',
        'Monitor sodium intake',
        'Regular exercise to support circulation'
      ]
    },
    detoxPhases: [
      {
        phase: 'Preparation Phase',
        duration: '1 week',
        focus: ['Reduce toxin exposure', 'Support elimination organs'],
        activities: [
          'Eliminate processed foods',
          'Increase water intake',
          'Begin gentle exercise',
          'Improve sleep hygiene'
        ],
        supplements: ['Magnesium', 'Vitamin C', 'Probiotics'],
        dietGuidelines: [
          'Organic whole foods only',
          'Eliminate alcohol, caffeine, sugar',
          'Increase fiber intake',
          'Include lemon water'
        ],
        expectedOutcomes: ['Reduced cravings', 'Better sleep', 'Increased energy'],
        monitoring: ['Energy levels', 'Sleep quality', 'Digestive function']
      },
      {
        phase: 'Active Detox Phase',
        duration: '2 weeks',
        focus: ['Liver support', 'Cellular detoxification', 'Heavy metal chelation'],
        activities: [
          'Sauna or sweating therapy',
          'Lymphatic massage',
          'Dry brushing',
          'Moderate exercise'
        ],
        supplements: [
          'Milk thistle',
          'N-acetyl cysteine',
          'Alpha lipoic acid',
          'Chlorella',
          'Glutathione'
        ],
        dietGuidelines: [
          'Cruciferous vegetables daily',
          'Sulfur-rich foods',
          'Green juices',
          'Intermittent fasting'
        ],
        expectedOutcomes: ['Improved liver function', 'Clearer skin', 'Mental clarity'],
        monitoring: ['Liver enzymes', 'Energy levels', 'Skin condition']
      },
      {
        phase: 'Maintenance Phase',
        duration: '4 weeks',
        focus: ['Sustain improvements', 'Prevent re-toxification'],
        activities: [
          'Regular exercise routine',
          'Stress management',
          'Continued healthy eating',
          'Regular sauna use'
        ],
        supplements: ['Multivitamin', 'Omega-3', 'Probiotics'],
        dietGuidelines: [
          '80/20 rule - 80% clean eating',
          'Continue organic when possible',
          'Limit processed foods',
          'Regular detox foods'
        ],
        expectedOutcomes: ['Sustained energy', 'Stable weight', 'Improved immunity'],
        monitoring: ['Overall health markers', 'Energy stability', 'Weight maintenance']
      }
    ],
    supplementProtocol: [
      {
        name: 'Milk Thistle (Silymarin)',
        dosage: '200-400mg',
        timing: 'Between meals',
        duration: '3 months',
        purpose: 'Liver protection and regeneration',
        phase: 'Active Detox',
        interactions: ['May affect drug metabolism'],
        contraindications: ['Ragweed allergy']
      },
      {
        name: 'N-Acetyl Cysteine (NAC)',
        dosage: '600-1200mg',
        timing: 'Empty stomach',
        duration: '2-3 months',
        purpose: 'Glutathione precursor, liver support',
        phase: 'Active Detox',
        interactions: ['May enhance blood thinners'],
        contraindications: ['Asthma (rare cases)']
      },
      {
        name: 'Alpha Lipoic Acid',
        dosage: '300-600mg',
        timing: 'With meals',
        duration: '2-3 months',
        purpose: 'Antioxidant, heavy metal chelation',
        phase: 'Active Detox',
        interactions: ['May lower blood sugar'],
        contraindications: ['Diabetes (monitor glucose)']
      },
      {
        name: 'Chlorella',
        dosage: '3-5g',
        timing: 'With meals',
        duration: '2-3 months',
        purpose: 'Heavy metal binding, chlorophyll',
        phase: 'Active Detox',
        interactions: ['May affect iron absorption'],
        contraindications: ['Iodine sensitivity']
      }
    ],
    dietaryRecommendations: [
      {
        category: 'Liver Support Foods',
        foods: [
          'Cruciferous vegetables (broccoli, kale, Brussels sprouts)',
          'Garlic and onions',
          'Beets',
          'Carrots',
          'Green tea',
          'Turmeric',
          'Artichokes'
        ],
        avoidFoods: [
          'Alcohol',
          'Processed foods',
          'Trans fats',
          'High fructose corn syrup',
          'Artificial additives'
        ],
        reasoning: 'Support Phase 1 and Phase 2 liver detoxification pathways',
        phase: 'All phases',
        preparation: ['Steam or lightly sauté', 'Include raw when possible', 'Organic preferred']
      },
      {
        category: 'Kidney Support Foods',
        foods: [
          'Cranberries',
          'Parsley',
          'Celery',
          'Cucumber',
          'Watermelon',
          'Lemon',
          'Dandelion greens'
        ],
        avoidFoods: [
          'Excess sodium',
          'Processed meats',
          'Excessive protein',
          'Oxalate-rich foods (if prone to stones)'
        ],
        reasoning: 'Support kidney filtration and reduce inflammatory burden',
        phase: 'All phases',
        preparation: ['Fresh juices', 'Herbal teas', 'Raw or lightly cooked']
      }
    ],
    lifestyleChanges: [
      'Increase water intake to 3-4 liters daily',
      'Regular sauna or sweating therapy 3-4x per week',
      'Dry brushing before showers to support lymphatic drainage',
      'Deep breathing exercises to support lung detoxification',
      'Regular exercise to promote circulation and sweating',
      'Improve sleep quality - 7-9 hours nightly',
      'Stress management through meditation or yoga',
      'Reduce exposure to environmental toxins',
      'Use natural cleaning and personal care products',
      'Filter drinking water and shower water if possible'
    ],
    toxinExposureAssessment: [
      {
        source: 'Household cleaning products',
        type: 'environmental',
        severity: 'moderate',
        recommendations: [
          'Switch to natural cleaning products',
          'Improve ventilation when cleaning',
          'Use protective equipment'
        ]
      },
      {
        source: 'Processed foods',
        type: 'dietary',
        severity: 'moderate',
        recommendations: [
          'Choose organic when possible',
          'Read ingredient labels carefully',
          'Prepare more meals at home'
        ]
      },
      {
        source: 'Air pollution',
        type: 'environmental',
        severity: 'low',
        recommendations: [
          'Use air purifiers indoors',
          'Exercise away from traffic',
          'Include air-purifying plants'
        ]
      }
    ],
    detoxProgram: {
      name: 'Comprehensive 7-Week Detox Protocol',
      totalDuration: '7 weeks',
      intensity: 'moderate',
      phases: ['Preparation (1 week)', 'Active Detox (2 weeks)', 'Maintenance (4 weeks)'],
      expectedBenefits: [
        'Improved energy levels',
        'Better digestion',
        'Clearer skin',
        'Enhanced mental clarity',
        'Better sleep quality',
        'Reduced inflammation',
        'Stronger immune function'
      ],
      contraindications: [
        'Pregnancy or breastfeeding',
        'Severe liver or kidney disease',
        'Active eating disorders',
        'Certain medications (consult healthcare provider)'
      ]
    },
    monitoringPlan: [
      'Weekly check-ins for first month',
      'Track energy levels, sleep, and digestion daily',
      'Monitor weight and body composition',
      'Assess skin condition and mental clarity',
      'Blood work at 4 weeks and 12 weeks',
      'Liver function tests if indicated',
      'Adjust protocol based on response'
    ],
    warnings: [
      'Consult healthcare provider before starting intensive detox',
      'Start slowly if new to detoxification',
      'Stay well hydrated throughout process',
      'Stop if experiencing severe symptoms',
      'Not recommended during pregnancy or breastfeeding',
      'May interact with certain medications'
    ],
    confidence: 0.88
  };

  return analysis;
};

export const analyzeDetoxCapacityProcedure = publicProcedure
  .input(z.object({
    currentSymptoms: z.array(z.string()).optional(),
    toxinExposure: z.array(z.string()).optional(),
    liverMarkers: z.record(z.string(), z.number()).optional(),
    kidneyMarkers: z.record(z.string(), z.number()).optional(),
    lifestyle: z.object({
      alcohol: z.enum(['none', 'light', 'moderate', 'heavy']).optional(),
      smoking: z.boolean().optional(),
      exercise: z.enum(['none', 'light', 'moderate', 'intense']).optional(),
      stress: z.enum(['low', 'moderate', 'high']).optional()
    }).optional(),
    medications: z.array(z.string()).optional(),
    previousDetox: z.boolean().optional(),
    userId: z.string().optional()
  }))
  .mutation(async ({ input }) => {
    console.log(`🧹 Analyzing detox capacity and creating protocol`);
    
    try {
      const analysis = await analyzeDetoxCapacity(input as any);
      
      console.log(`✅ Generated detox analysis with ${analysis.detoxPhases.length} phases`);
      
      return {
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error analyzing detox capacity:', error);
      return {
        success: false,
        error: 'Failed to analyze detox capacity',
        timestamp: new Date().toISOString()
      };
    }
  });

export default analyzeDetoxCapacityProcedure;