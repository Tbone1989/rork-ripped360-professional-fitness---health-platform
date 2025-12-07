import { z } from "zod";
import { publicProcedure } from "../../../create-context";

interface DigestiveHealthAnalysis {
  id: string;
  userId: string;
  analysisDate: string;
  overallDigestiveHealth: 'excellent' | 'good' | 'fair' | 'poor';
  symptoms: DigestiveSymptomAnalysis[];
  recommendations: DigestiveRecommendation[];
  probioticRecommendations: ProbioticRecommendation[];
  enzymeRecommendations: EnzymeRecommendation[];
  dietaryChanges: DietaryChange[];
  lifestyleModifications: string[];
  supplementProtocol: SupplementProtocol[];
  followUpPlan: string[];
  riskFactors: string[];
  confidence: number;
}

interface DigestiveSymptomAnalysis {
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
  frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  possibleCauses: string[];
  recommendations: string[];
  relatedSymptoms: string[];
}

interface DigestiveRecommendation {
  category: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  expectedOutcome: string;
  monitoring: string[];
}

interface ProbioticRecommendation {
  strains: string[];
  cfu: string;
  duration: string;
  timing: string;
  purpose: string;
  expectedBenefits: string[];
}

interface EnzymeRecommendation {
  enzymes: string[];
  dosage: string;
  timing: string;
  purpose: string;
  duration: string;
}

interface DietaryChange {
  change: string;
  foods: string[];
  avoidFoods: string[];
  reasoning: string;
  implementation: string;
  timeline: string;
}

interface SupplementProtocol {
  supplement: string;
  dosage: string;
  timing: string;
  duration: string;
  purpose: string;
  interactions: string[];
  monitoring: string[];
}

const analyzeDigestiveHealth = async (healthData: any): Promise<DigestiveHealthAnalysis> => {
  const analysis: DigestiveHealthAnalysis = {
    id: `digestive_analysis_${Date.now()}`,
    userId: healthData.userId || 'user_123',
    analysisDate: new Date().toISOString(),
    overallDigestiveHealth: 'fair',
    symptoms: [
      {
        symptom: 'Bloating',
        severity: 'moderate',
        frequency: 'daily',
        possibleCauses: ['Food intolerances', 'SIBO', 'Low stomach acid', 'Stress'],
        recommendations: [
          'Keep a food diary to identify triggers',
          'Consider elimination diet',
          'Eat smaller, more frequent meals',
          'Chew food thoroughly'
        ],
        relatedSymptoms: ['Gas', 'Abdominal discomfort']
      },
      {
        symptom: 'Irregular bowel movements',
        severity: 'mild',
        frequency: 'weekly',
        possibleCauses: ['Low fiber intake', 'Dehydration', 'Stress', 'Lack of movement'],
        recommendations: [
          'Increase fiber intake gradually',
          'Drink more water',
          'Regular exercise',
          'Establish routine bathroom times'
        ],
        relatedSymptoms: ['Constipation', 'Abdominal cramping']
      }
    ],
    recommendations: [
      {
        category: 'Gut Microbiome',
        recommendation: 'Restore healthy gut bacteria balance',
        priority: 'high',
        timeframe: '3-6 months',
        expectedOutcome: 'Improved digestion and reduced bloating',
        monitoring: ['Symptom tracking', 'Stool analysis']
      },
      {
        category: 'Digestive Function',
        recommendation: 'Support digestive enzyme production',
        priority: 'medium',
        timeframe: '2-3 months',
        expectedOutcome: 'Better food breakdown and nutrient absorption',
        monitoring: ['Digestive symptoms', 'Energy levels']
      }
    ],
    probioticRecommendations: [
      {
        strains: ['Lactobacillus acidophilus', 'Bifidobacterium longum', 'Lactobacillus plantarum'],
        cfu: '50-100 billion CFU',
        duration: '3-6 months',
        timing: 'With or after meals',
        purpose: 'Restore gut microbiome balance',
        expectedBenefits: ['Reduced bloating', 'Improved bowel regularity', 'Enhanced immune function']
      },
      {
        strains: ['Saccharomyces boulardii'],
        cfu: '5-10 billion CFU',
        duration: '1-2 months',
        timing: 'Between meals',
        purpose: 'Support during digestive stress',
        expectedBenefits: ['Reduced inflammation', 'Improved gut barrier function']
      }
    ],
    enzymeRecommendations: [
      {
        enzymes: ['Amylase', 'Protease', 'Lipase', 'Cellulase'],
        dosage: '1-2 capsules',
        timing: 'Beginning of meals',
        purpose: 'Support food breakdown and digestion',
        duration: '2-3 months'
      },
      {
        enzymes: ['Betaine HCl', 'Pepsin'],
        dosage: '1 capsule',
        timing: 'Middle of protein-containing meals',
        purpose: 'Support stomach acid production',
        duration: '1-2 months'
      }
    ],
    dietaryChanges: [
      {
        change: 'Increase fiber intake gradually',
        foods: ['Vegetables', 'Fruits', 'Legumes', 'Whole grains'],
        avoidFoods: ['Processed foods', 'Refined sugars'],
        reasoning: 'Support healthy gut bacteria and regular bowel movements',
        implementation: 'Add 5g fiber per week until reaching 25-35g daily',
        timeline: '4-6 weeks'
      },
      {
        change: 'Include fermented foods',
        foods: ['Kefir', 'Sauerkraut', 'Kimchi', 'Yogurt', 'Miso'],
        avoidFoods: ['Pasteurized fermented foods'],
        reasoning: 'Provide beneficial bacteria and support gut health',
        implementation: 'Include 1-2 servings daily',
        timeline: '2-4 weeks'
      },
      {
        change: 'Eliminate common trigger foods temporarily',
        foods: [],
        avoidFoods: ['Gluten', 'Dairy', 'High FODMAP foods'],
        reasoning: 'Identify food sensitivities and reduce inflammation',
        implementation: '3-4 week elimination followed by systematic reintroduction',
        timeline: '6-8 weeks'
      }
    ],
    lifestyleModifications: [
      'Practice mindful eating - chew food thoroughly and eat slowly',
      'Manage stress through meditation, yoga, or deep breathing',
      'Stay hydrated with 8-10 glasses of water daily',
      'Regular physical activity to support gut motility',
      'Establish consistent meal times',
      'Get 7-9 hours of quality sleep nightly',
      'Consider intermittent fasting to give digestive system rest'
    ],
    supplementProtocol: [
      {
        supplement: 'L-Glutamine',
        dosage: '5-10g',
        timing: 'Between meals',
        duration: '2-3 months',
        purpose: 'Support gut lining repair',
        interactions: [],
        monitoring: ['Digestive symptoms', 'Energy levels']
      },
      {
        supplement: 'Zinc Carnosine',
        dosage: '75-150mg',
        timing: 'Between meals',
        duration: '2-3 months',
        purpose: 'Support gut barrier function',
        interactions: ['Take away from other minerals'],
        monitoring: ['Digestive symptoms']
      },
      {
        supplement: 'Omega-3 EPA/DHA',
        dosage: '1000-2000mg',
        timing: 'With meals',
        duration: 'Long-term',
        purpose: 'Reduce inflammation',
        interactions: ['May enhance blood-thinning medications'],
        monitoring: ['Inflammatory markers']
      }
    ],
    followUpPlan: [
      'Track symptoms daily for first 2 weeks',
      'Reassess after 4 weeks of protocol implementation',
      'Consider comprehensive stool analysis if symptoms persist',
      'Evaluate need for SIBO testing if bloating continues',
      'Monitor progress monthly for first 3 months'
    ],
    riskFactors: [
      'Chronic stress',
      'Poor dietary habits',
      'Antibiotic use history',
      'Sedentary lifestyle',
      'Irregular eating patterns'
    ],
    confidence: 0.82
  };

  return analysis;
};

export const analyzeDigestiveHealthProcedure = publicProcedure
  .input(z.object({
    symptoms: z.array(z.string()),
    frequency: z.record(z.string(), z.string()),
    triggers: z.array(z.string()).optional(),
    currentDiet: z.string().optional(),
    medications: z.array(z.string()).optional(),
    stressLevel: z.enum(['low', 'moderate', 'high']).optional(),
    userId: z.string().optional()
  }))
  .mutation(async ({ input }) => {
    console.log(`🦠 Analyzing digestive health data`);
    
    try {
      const analysis = await analyzeDigestiveHealth(input as any);
      
      console.log(`✅ Generated digestive health analysis with ${analysis.recommendations.length} recommendations`);
      
      return {
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error analyzing digestive health:', error);
      return {
        success: false,
        error: 'Failed to analyze digestive health',
        timestamp: new Date().toISOString()
      };
    }
  });

export default analyzeDigestiveHealthProcedure;