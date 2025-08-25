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
  foodSources?: string[];
  contraindications?: string[];
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
      id: 'betaine',
      name: 'Betaine (Trimethylglycine, TMG)',
      purpose: ['Power output', 'Methylation support'],
      evidence: 'Emerging',
      recommended: { min: 2.5, max: 2.5, unit: 'g', timing: 'Daily, with a meal' },
      notes: ['Often split 1.25g twice daily'],
      foodSources: ['Beets', 'Spinach', 'Whole grains', 'Shellfish'],
      contraindications: ['Consult clinician if on homocysteine-lowering meds', 'May interact with SAMe regimens'],
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

export const aminoAcidsGuide: SectionGuide = {
  id: 'amino-acids',
  title: 'Amino Acids & Uses',
  subtitle: 'Evidence-backed roles, when to use, and practical dosing',
  items: [
    {
      id: 'tryptophan',
      name: 'L-Tryptophan',
      purpose: ['Serotonin precursor', 'Sleep support'],
      evidence: 'Emerging',
      recommended: { min: 500, max: 1000, unit: 'mg', timing: '30–60 min before bed' },
      notes: ['Alternative to 5-HTP for some'],
      foodSources: ['Turkey', 'Chicken', 'Eggs', 'Dairy', 'Pumpkin seeds'],
      contraindications: ['Do not combine with SSRIs, MAOIs, or other serotonergic agents unless medically supervised'],
    },
    {
      id: 'histidine',
      name: 'L-Histidine',
      purpose: ['Hemoglobin formation', 'Histamine synthesis', 'Potential joint support'],
      evidence: 'Emerging',
      recommended: { min: 1, max: 2, unit: 'g', timing: 'With meals' },
      notes: ['Generally obtained via protein intake; targeted supplementation is uncommon'],
      foodSources: ['Meat', 'Fish', 'Dairy', 'Legumes', 'Whole grains'],
      contraindications: ['Histamine intolerance individuals should be cautious'],
    },
    {
      id: 'eaas',
      name: 'Essential Amino Acids (EAAs)',
      purpose: ['Muscle protein synthesis', 'Recovery'],
      evidence: 'Moderate',
      recommended: { min: 10, max: 15, unit: 'g', timing: 'Intra- or post-workout' },
      notes: ['Look for ≥2.5g leucine per serving'],
    },
    {
      id: 'bcaas',
      name: 'BCAAs (Leucine/Isoleucine/Valine 2:1:1)',
      purpose: ['Intra-workout support', 'Perceived fatigue'],
      evidence: 'Emerging',
      recommended: { min: 5, max: 10, unit: 'g', timing: 'Pre- or intra-workout when fasted or low protein' },
      notes: ['Less useful if daily protein is sufficient'],
    },
    {
      id: 'leucine',
      name: 'L-Leucine',
      purpose: ['Triggers MPS'],
      evidence: 'Moderate',
      recommended: { min: 2.5, max: 3.5, unit: 'g', timing: 'With meals low in leucine' },
      notes: ['Best combined with complete protein source'],
    },
    {
      id: 'glutamine',
      name: 'L-Glutamine',
      purpose: ['Gut support', 'Recovery'],
      evidence: 'Emerging',
      recommended: { min: 5, max: 10, unit: 'g', timing: 'Post-workout or before bed' },
      notes: ['More support for GI health than direct hypertrophy'],
    },
    {
      id: 'taurine',
      name: 'Taurine',
      purpose: ['Cell hydration', 'Endurance', 'Cardiac support'],
      evidence: 'Moderate',
      recommended: { min: 1, max: 2, unit: 'g', timing: 'Pre- or post-workout' },
      notes: ['Pairs well with caffeine for smoother energy'],
    },
    {
      id: 'theanine',
      name: 'L-Theanine',
      purpose: ['Smooth focus', 'Reduce jitters'],
      evidence: 'Moderate',
      recommended: { min: 100, max: 200, unit: 'mg', timing: 'With caffeine pre-workout' },
      notes: ['~2:1 theanine:caffeine ratio can feel balanced'],
    },
    {
      id: 'arginine',
      name: 'L-Arginine',
      purpose: ['Nitric oxide'],
      evidence: 'Emerging',
      recommended: { min: 3, max: 6, unit: 'g', timing: '30–60 min pre-workout' },
      notes: ['Less effective than citrulline for NO'],
    },
    {
      id: 'citrulline',
      name: 'L-Citrulline',
      purpose: ['Blood flow', 'Pump'],
      evidence: 'Moderate',
      recommended: { min: 6, max: 8, unit: 'g', timing: '30–60 min pre-workout' },
      notes: ['Free-form citrulline preferred; malate 2:1 use ~8g'],
    },
    {
      id: 'carnitine-l-tartrate',
      name: 'L-Carnitine L-Tartrate',
      purpose: ['Recovery markers', 'Sperm health'],
      evidence: 'Emerging',
      recommended: { min: 1.5, max: 3, unit: 'g', timing: 'With meals' },
      notes: ['Not a fat-burner acutely; supports transport mechanisms'],
    },
    {
      id: 'glycine',
      name: 'Glycine',
      purpose: ['Sleep quality', 'Collagen synthesis'],
      evidence: 'Emerging',
      recommended: { min: 3, max: 5, unit: 'g', timing: 'Evening or with collagen' },
      notes: ['May improve sleep onset latency'],
    },
  ],
};

export const neuroSleepGuide: SectionGuide = {
  id: 'neuro-sleep',
  title: 'Calm, Mood, and Sleep Support',
  subtitle: 'Evidence-informed options and practical dosing',
  items: [
    {
      id: 'ashwagandha',
      name: 'Ashwagandha (Withania somnifera, KSM-66/Sensoril)',
      purpose: ['Stress resilience', 'Sleep quality', 'Cortisol support'],
      evidence: 'Moderate',
      recommended: { min: 300, max: 600, unit: 'mg', timing: 'Evening or split AM/PM with food' },
      notes: ['Standardized root extracts (5% withanolides) are commonly studied'],
      foodSources: [],
      contraindications: ['Avoid in hyperthyroidism unless supervised', 'Caution with sedatives; may enhance effects', 'Not for pregnancy unless medically advised'],
    },
    {
      id: 'magnesium-glycinate',
      name: 'Magnesium Glycinate (Bisglycinate)',
      purpose: ['Relaxation', 'Sleep quality', 'Muscle cramps'],
      evidence: 'Moderate',
      recommended: { min: 200, max: 400, unit: 'mg', timing: 'Evening, with food' },
      notes: ['Elemental magnesium amount varies by brand; check label'],
      foodSources: ['Pumpkin seeds', 'Almonds', 'Spinach', 'Dark chocolate', 'Legumes'],
      contraindications: ['Caution in kidney disease; consult clinician', 'May interact with certain antibiotics (separate dosing by 2–4 hours)'],
    },
    {
      id: 'melatonin',
      name: 'Melatonin',
      purpose: ['Sleep onset', 'Circadian adjustment (jet lag)'],
      evidence: 'Moderate',
      recommended: { min: 0.3, max: 3, unit: 'mg', timing: '30–60 min before bed' },
      notes: ['Use lowest effective dose; higher doses may cause grogginess'],
      foodSources: [],
      contraindications: ['Caution with anticoagulants, immunosuppressants, and in autoimmune conditions'],
    },
    {
      id: 'valerian',
      name: 'Valerian Root (Valeriana officinalis)',
      purpose: ['Sleep latency', 'Calm'],
      evidence: 'Emerging',
      recommended: { min: 300, max: 600, unit: 'mg', timing: '30–60 min before bed' },
      notes: ['Standardized extract preferred; may cause vivid dreams'],
      foodSources: [],
      contraindications: ['Avoid combining with alcohol or sedatives; may cause daytime drowsiness'],
    },
    {
      id: 'kava',
      name: 'Kava (Piper methysticum)',
      purpose: ['Anxiety reduction', 'Calm'],
      evidence: 'Emerging',
      recommended: { min: 100, max: 250, unit: 'mg', timing: 'Evening; standardized to kavalactones' },
      notes: ['Use only solvent-free, noble cultivars from reputable sources'],
      foodSources: [],
      contraindications: ['Do not combine with alcohol or hepatotoxic meds', 'Avoid if liver disease present', 'May enhance effects of CNS depressants'],
    },
    {
      id: '5-htp',
      name: '5-HTP (5-Hydroxytryptophan)',
      purpose: ['Sleep quality', 'Mood support', 'Appetite regulation'],
      evidence: 'Emerging',
      recommended: { min: 50, max: 200, unit: 'mg', timing: 'Evening or 30–60 min before bed' },
      notes: [
        'Do not combine with SSRIs, MAOIs, or other serotonergic meds unless cleared by your clinician',
        'Start at 50 mg; increase gradually based on tolerance and effect',
      ],
    },
    {
      id: 'gaba',
      name: 'GABA (Gamma-Aminobutyric Acid)',
      purpose: ['Calm', 'Sleep onset'],
      evidence: 'Emerging',
      recommended: { min: 100, max: 300, unit: 'mg', timing: '30–60 min before bed or during acute stress' },
      notes: [
        'PharmaGABA forms (naturally fermented) are often used in studies',
        'Limited BBB penetration; effects may be via peripheral/vagal pathways',
      ],
      foodSources: ['Fermented foods (kimchi, yogurt)', 'Brown rice germ'],
      contraindications: ['May enhance sedatives; caution with driving until you know your response'],
    },
  ],
};

export const researchDisclaimer =
  'Educational content only. Not medical advice. Consult your healthcare provider before changes to supplements.';
