import { ImageSourcePropType } from 'react-native';

export type DosageRange = {
  min: number;
  max: number;
  unit: 'mg' | 'g';
  timing?: string;
};

export interface IngredientGuide {
  id: string;
  name: string;
  purpose: string[];
  evidence: 'Strong' | 'Moderate' | 'Emerging';
  recommended: DosageRange | DosageRange[];
  notes?: string[];
}

export interface SectionGuide {
  id: string;
  title: string;
  subtitle?: string;
  items: IngredientGuide[];
}

export interface SimpleGuideItem {
  id: string;
  title: string;
  description: string;
  bullets: string[];
}

export const preworkoutGuide: SectionGuide = {
  id: 'preworkout',
  title: 'Pre-Workout Ingredients',
  subtitle: 'What to look for and evidence-backed dosages',
  items: [
    {
      id: 'caffeine',
      name: 'Caffeine (Anhydrous)',
      purpose: ['Energy', 'Focus', 'Performance'],
      evidence: 'Strong',
      recommended: { min: 150, max: 300, unit: 'mg', timing: '30–45 min pre-workout' },
      notes: [
        'Start low if caffeine sensitive',
        'Avoid within 6–8 hours of sleep',
      ],
    },
    {
      id: 'creatine-monohydrate',
      name: 'Creatine Monohydrate',
      purpose: ['Strength', 'Power', 'Lean mass'],
      evidence: 'Strong',
      recommended: { min: 3, max: 5, unit: 'g', timing: 'Daily, any time' },
      notes: ['Loading optional (20g/day split for 5–7 days)'],
    },
    {
      id: 'beta-alanine',
      name: 'Beta-Alanine',
      purpose: ['Muscular endurance'],
      evidence: 'Strong',
      recommended: { min: 3.2, max: 6.4, unit: 'g', timing: 'Split doses daily' },
      notes: ['May cause harmless tingling (paresthesia)'],
    },
    {
      id: 'l-citrulline',
      name: 'L-Citrulline (free form)',
      purpose: ['Blood flow', 'Pump'],
      evidence: 'Moderate',
      recommended: { min: 6, max: 8, unit: 'g', timing: '30–60 min pre-workout' },
      notes: ['Use 8g if using citrulline malate 2:1'],
    },
    {
      id: 'electrolytes',
      name: 'Electrolytes (Sodium/Potassium/Magnesium)',
      purpose: ['Hydration', 'Performance'],
      evidence: 'Moderate',
      recommended: [
        { min: 300, max: 600, unit: 'mg', timing: 'Sodium pre/intra-workout' },
        { min: 200, max: 400, unit: 'mg', timing: 'Potassium daily' },
      ],
      notes: ['Adjust sodium upward for heavy sweaters'],
    },
    {
      id: 'l-tyrosine',
      name: 'L-Tyrosine',
      purpose: ['Focus', 'Stress resilience'],
      evidence: 'Emerging',
      recommended: { min: 500, max: 1500, unit: 'mg', timing: '30–60 min pre-workout' },
    },
  ],
};

export const fiberGuide: SimpleGuideItem = {
  id: 'fiber',
  title: 'Dietary Fiber 101',
  description:
    'Aim for 14g of fiber per 1000 kcal. Blend soluble and insoluble sources to support gut health, glycemic control, and satiety.',
  bullets: [
    'Soluble fiber (oats, psyllium, beans): slows digestion and helps cholesterol control',
    'Insoluble fiber (whole grains, veg skins): adds bulk and promotes regularity',
    'Psyllium husk: 5–10g/day split; increase water to avoid GI distress',
    'Introduce gradually to mitigate bloating; spread across meals',
    'Prebiotic fibers (inulin, FOS, GOS): feed beneficial gut bacteria; start with 2–3g/day',
    'Viscous fibers (beta-glucans from oats/barley): 3g/day supports LDL reduction',
    'Hydration: drink an extra 250–500ml water per 5g added fiber',
    'Athletes: place higher-fiber meals away from training to reduce GI distress',
  ],
};

export const proteinGuide: SectionGuide = {
  id: 'protein',
  title: 'Protein Types & When To Use Them',
  subtitle: 'Choose based on digestion speed, tolerance, and goal',
  items: [
    {
      id: 'whey-isolate',
      name: 'Whey Isolate',
      purpose: ['Fast absorption', 'Post-workout'],
      evidence: 'Strong',
      recommended: { min: 20, max: 40, unit: 'g', timing: 'Post-workout or between meals' },
      notes: ['Lower lactose; good for cutting due to macros'],
    },
    {
      id: 'whey-concentrate',
      name: 'Whey Concentrate',
      purpose: ['Budget-friendly', 'Balanced amino profile'],
      evidence: 'Strong',
      recommended: { min: 20, max: 40, unit: 'g', timing: 'Any time' },
      notes: ['May bother lactose-sensitive individuals'],
    },
    {
      id: 'casein',
      name: 'Micellar Casein',
      purpose: ['Slow release', 'Overnight'],
      evidence: 'Moderate',
      recommended: { min: 25, max: 40, unit: 'g', timing: 'Before bed or long gaps between meals' },
      notes: ['Great for satiety and muscle protein synthesis overnight'],
    },
    {
      id: 'plant-protein',
      name: 'Plant Blend (Pea/Rice)',
      purpose: ['Dairy-free', 'Balanced EAA profile'],
      evidence: 'Moderate',
      recommended: { min: 25, max: 45, unit: 'g', timing: 'Any time' },
      notes: ['Look for added leucine or complete blends'],
    },
    {
      id: 'egg-protein',
      name: 'Egg White Protein',
      purpose: ['Dairy-free', 'High bioavailability'],
      evidence: 'Moderate',
      recommended: { min: 20, max: 40, unit: 'g', timing: 'Any time' },
    },
  ],
};

export const safetyNotes: SimpleGuideItem = {
  id: 'safety',
  title: 'Supplement Safety & Quality Checklist',
  description: 'Choose products that are third-party tested and dose-transparently labeled.',
  bullets: [
    'Look for NSF Certified for Sport, Informed Choice, or USP marks',
    'Avoid “proprietary blends” without exact amounts for stimulants',
    'Match labels to evidence-backed dosages; beware under-dosed products',
    'Check interactions if on medications; when in doubt, ask your clinician',
  ],
};

export const researchDisclaimer =
  'Educational content only. Not medical advice. Consult your healthcare provider before changes to supplements.';
