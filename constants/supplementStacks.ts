export type StackCategory = 'Sleep' | 'Stress' | 'Muscle' | 'Fat loss' | 'Gut' | 'Joint' | 'Metabolic';

export interface StackItem {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  contraindications?: string;
  notes?: string;
}

export interface StackDefinition {
  category: StackCategory;
  title: string;
  items: StackItem[];
}

export interface PeptideItem {
  id: string;
  name: string;
  protocol: string;
  dosage: string;
  timing: string;
  contraindications?: string;
  notes?: string;
}

export const SUPPLEMENT_STACKS: StackDefinition[] = [
  {
    category: 'Sleep',
    title: 'Sleep Optimization',
    items: [
      { id: 'mag-glycinate', name: 'Magnesium Glycinate', dosage: '200–400 mg', timing: '30–60 min before bed', contraindications: 'Caution with kidney issues or if using magnesium-containing laxatives' },
      { id: 'melatonin', name: 'Melatonin', dosage: '0.3–3 mg', timing: '30–60 min before bed', contraindications: 'Avoid if on anticoagulants or immunosuppressants; may cause daytime drowsiness' },
      { id: 'glycine', name: 'Glycine', dosage: '3 g', timing: '30–60 min before bed', contraindications: 'Generally well-tolerated' },
      { id: 'theanine', name: 'L-Theanine', dosage: '100–200 mg', timing: 'Evening or pre-bed', contraindications: 'May lower blood pressure; caution with antihypertensives' },
      { id: 'valerian', name: 'Valerian Root', dosage: '300–600 mg', timing: '60 min before bed', contraindications: 'Avoid with sedatives or alcohol' },
      { id: 'gaba', name: 'GABA', dosage: '250–500 mg', timing: '30–60 min before bed', contraindications: 'May cause tingling/sedation; caution with other CNS depressants' },
    ],
  },
  {
    category: 'Stress',
    title: 'Stress Resilience',
    items: [
      { id: 'ashwagandha', name: 'Ashwagandha (KSM-66/Sensoril)', dosage: '300–600 mg', timing: 'AM or PM with food', contraindications: 'Avoid in hyperthyroidism, pregnancy; may potentiate sedatives' },
      { id: 'l-theanine', name: 'L-Theanine', dosage: '100–200 mg', timing: '1–2x/day', contraindications: 'May lower blood pressure' },
      { id: 'rhodiola', name: 'Rhodiola', dosage: '200–400 mg (3% rosavins)', timing: 'AM or pre-stress', contraindications: 'Avoid in bipolar disorder; may be stimulating' },
      { id: 'phosphatidylserine', name: 'Phosphatidylserine', dosage: '100–300 mg', timing: 'Evening or post-intense training', contraindications: 'May interact with blood thinners' },
      { id: 'kava', name: 'Kava', dosage: '100–250 mg kavalactones', timing: 'Evening as needed', contraindications: 'Avoid with liver disease or alcohol; interacts with sedatives' },
    ],
  },
  {
    category: 'Muscle',
    title: 'Muscle & Recovery',
    items: [
      { id: 'creatine', name: 'Creatine Monohydrate', dosage: '3–5 g/day', timing: 'Daily, anytime (with carbs optional)', contraindications: 'Ensure hydration; caution with kidney issues' },
      { id: 'betaine', name: 'Betaine (TMG)', dosage: '2.5 g/day', timing: 'Pre-workout or with a meal', contraindications: 'May raise LDL in some; monitor' },
      { id: 'eaa', name: 'EAAs/BCAAs', dosage: '6–10 g', timing: 'Intra-workout or between meals', contraindications: 'Generally safe; adjust for total protein' },
      { id: 'omega3', name: 'Omega-3 (EPA/DHA)', dosage: '1–3 g combined EPA+DHA', timing: 'With meals', contraindications: 'Caution with anticoagulants' },
      { id: 'histidine', name: 'Histidine', dosage: '1–2 g/day', timing: 'With meals', contraindications: 'Limited data; generally safe at moderate doses' },
      { id: 'tryptophan', name: 'Tryptophan', dosage: '500–1000 mg', timing: 'Evening', contraindications: 'Avoid with SSRIs/MAOIs (serotonin syndrome risk)' },
    ],
  },
  {
    category: 'Fat loss',
    title: 'Fat Loss Support',
    items: [
      { id: 'caffeine', name: 'Caffeine', dosage: '100–200 mg', timing: 'AM or pre-workout', contraindications: 'Avoid late; caution with anxiety, hypertension' },
      { id: 'green-tea', name: 'Green Tea Extract (EGCG)', dosage: '200–400 mg EGCG', timing: 'AM with food', contraindications: 'Avoid with liver issues; do not combine with fasting on empty stomach' },
      { id: 'berberine', name: 'Berberine', dosage: '500 mg x 2–3/day', timing: 'With meals', contraindications: 'Interacts with many meds; caution with hypoglycemics' },
      { id: 'yohimbine', name: 'Yohimbine', dosage: '2.5–5 mg', timing: 'Fastest state pre-cardio', contraindications: 'Avoid with anxiety, hypertension; interacts with stimulants' },
    ],
  },
  {
    category: 'Gut',
    title: 'Gut Health',
    items: [
      { id: 'probiotic', name: 'Probiotic (multi-strain)', dosage: '10–20B CFU', timing: 'With food daily', contraindications: 'Immunocompromised caution' },
      { id: 'digestive-enzymes', name: 'Digestive Enzymes', dosage: 'Label as directed', timing: 'With meals', contraindications: 'Avoid if pancreatitis unless directed' },
      { id: 'slippery-elm', name: 'Slippery Elm/DGL', dosage: 'As directed', timing: 'Before meals', contraindications: 'May affect med absorption' },
      { id: 'fiber', name: 'Psyllium Husk', dosage: '5–10 g', timing: 'With water away from meds', contraindications: 'Separate from meds by 2 hrs' },
    ],
  },
  {
    category: 'Joint',
    title: 'Joint Support',
    items: [
      { id: 'curcumin', name: 'Curcumin (with piperine)', dosage: '500–1000 mg', timing: 'With meals', contraindications: 'Caution with anticoagulants, gallbladder disease' },
      { id: 'collagen', name: 'Collagen + Vitamin C', dosage: '10–15 g', timing: 'Daily; pre-rehab beneficial', contraindications: 'Generally safe' },
      { id: 'glucosamine', name: 'Glucosamine + Chondroitin', dosage: '1500/1200 mg', timing: 'With meals', contraindications: 'Shellfish allergy caution' },
    ],
  },
  {
    category: 'Metabolic',
    title: 'Metabolic & Glucose',
    items: [
      { id: 'magnesium', name: 'Magnesium (glycinate/citrate)', dosage: '200–400 mg', timing: 'Evening or split', contraindications: 'Kidney disease caution' },
      { id: 'alpha-lipoic', name: 'Alpha Lipoic Acid', dosage: '300–600 mg', timing: 'With meals', contraindications: 'May lower blood sugar; monitor' },
      { id: 'cinnamon', name: 'Cinnamon Extract', dosage: '500–1000 mg', timing: 'With carb meals', contraindications: 'Coumarin content varies; monitor liver enzymes if high dose' },
    ],
  },
];

export const PEPTIDES: PeptideItem[] = [
  { id: 'melanotan-2', name: 'Melanotan II', protocol: 'Tanning/photoprotection', dosage: '250–500 mcg', timing: 'Evening; titrate 2–4x/week', contraindications: 'Not medical advice; associated risks (nausea, BP changes). Often non-prescription/gray-market.' },
  { id: 'bpc-157', name: 'BPC-157', protocol: 'Tissue healing', dosage: '250–500 mcg', timing: '1–2x/day', contraindications: 'Research peptide; human data limited.' },
  { id: 'tb-500', name: 'TB-500 (Thymosin Beta-4 fragment)', protocol: 'Recovery', dosage: '2–5 mg/week', timing: 'Split doses weekly', contraindications: 'Research peptide; monitor for side effects.' },
  { id: 'cjc-ipam', name: 'CJC-1295 + Ipamorelin', protocol: 'GH secretagogue', dosage: '100–200 mcg each', timing: '1–2x/day, away from carbs/fats', contraindications: 'May affect glucose/edema; medical supervision advised.' },
  { id: 'semaglutide', name: 'Semaglutide', protocol: 'GLP-1 for weight loss', dosage: '0.25 mg weekly titration', timing: 'Weekly', contraindications: 'Avoid in medullary thyroid carcinoma hx; GI effects common.' },
  { id: 'tesamorelin', name: 'Tesamorelin', protocol: 'GH releasing factor', dosage: '2 mg/day', timing: 'Bedtime', contraindications: 'Glucose effects; edema; medical supervision.' },
];
