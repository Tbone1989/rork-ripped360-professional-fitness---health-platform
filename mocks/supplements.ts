import { SupplementInfo, MedicineInfo, DrugInteraction, SupplementInteraction, HerbalInteraction } from '@/types/medical';

export const popularSupplements: (SupplementInfo | MedicineInfo)[] = [
  {
    id: '1',
    name: 'Creatine Monohydrate',
    category: 'Performance',
    description: 'Creatine is one of the most well-researched supplements for improving strength, power, and muscle mass. It works by increasing phosphocreatine stores in muscles, which helps produce more ATP (energy) during high-intensity exercise.',
    benefits: [
      'Increases strength and power output',
      'Enhances muscle growth',
      'Improves high-intensity exercise performance',
      'May provide cognitive benefits',
    ],
    sideEffects: [
      'Water retention',
      'Digestive discomfort in some individuals',
      'Potential cramping (though research is mixed)',
    ],
    dosage: '3-5g daily, no loading phase necessary',
    interactions: [
      'May increase the effect of stimulants',
      'Should be used cautiously with medications that affect kidney function',
    ],
    warnings: [
      'Those with kidney disorders should consult a physician before use',
      'Stay well hydrated when supplementing with creatine',
    ],
    researchUrls: [
      'https://pubmed.ncbi.nlm.nih.gov/14636102/',
      'https://pubmed.ncbi.nlm.nih.gov/12945830/',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?q=80&w=500',
  },
  {
    id: '2',
    name: 'Whey Protein',
    category: 'Protein',
    description: 'Whey protein is a complete protein derived from milk that contains all essential amino acids. It is quickly absorbed and has a high concentration of branched-chain amino acids (BCAAs), particularly leucine, which is important for muscle protein synthesis.',
    benefits: [
      'Supports muscle growth and recovery',
      'Convenient source of high-quality protein',
      'May help with weight management',
      'Contains bioactive compounds with potential health benefits',
    ],
    sideEffects: [
      'Digestive discomfort in some individuals',
      'Potential allergic reactions in those with milk allergies',
    ],
    dosage: '20-30g per serving, 1-2 servings daily depending on protein needs',
    interactions: [
      'May reduce absorption of certain medications',
      'Can interact with antibiotics (tetracyclines)',
    ],
    warnings: [
      'Those with dairy allergies or severe lactose intolerance should avoid',
      'Individuals with kidney disease should consult a physician before use',
    ],
    researchUrls: [
      'https://pubmed.ncbi.nlm.nih.gov/17240780/',
      'https://pubmed.ncbi.nlm.nih.gov/16988909/',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=500',
  },
  {
    id: '3',
    name: 'Fish Oil (Omega-3)',
    category: 'Health',
    description: 'Fish oil supplements contain omega-3 fatty acids EPA and DHA, which are essential fatty acids that must be obtained through diet. They have numerous health benefits including cardiovascular, cognitive, and anti-inflammatory effects.',
    benefits: [
      'Supports heart health',
      'Reduces inflammation',
      'May improve joint health',
      'Supports brain function and mood',
      'May enhance recovery from exercise',
    ],
    sideEffects: [
      'Fishy aftertaste or burps',
      'Digestive discomfort in some individuals',
      'Potential for increased bleeding time at high doses',
    ],
    dosage: '1-3g combined EPA and DHA daily',
    interactions: [
      'May enhance the effect of blood thinners',
      'May interact with blood pressure medications',
    ],
    warnings: [
      'Those on blood thinners should consult a physician before use',
      'Stop supplementation 1-2 weeks before surgery',
      'Choose products tested for heavy metals and contaminants',
    ],
    researchUrls: [
      'https://pubmed.ncbi.nlm.nih.gov/16531187/',
      'https://pubmed.ncbi.nlm.nih.gov/18072818/',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1535185384036-28bbc8035f28?q=80&w=500',
  },
  {
    id: '4',
    name: 'Vitamin D3',
    category: 'Vitamin',
    description: 'Vitamin D is a fat-soluble vitamin that functions as a hormone in the body. It plays a crucial role in calcium absorption, bone health, immune function, and numerous other physiological processes.',
    benefits: [
      'Supports bone health',
      'Enhances immune function',
      'May improve muscle function and reduce falls',
      'Associated with improved mood',
      'May support testosterone levels in men',
    ],
    sideEffects: [
      'Rare at recommended doses',
      'Toxicity possible with excessive supplementation (hypercalcemia)',
    ],
    dosage: '1,000-5,000 IU daily, depending on blood levels and sun exposure',
    interactions: [
      'May increase absorption of calcium',
      'May interact with certain blood pressure and heart medications',
    ],
    warnings: [
      'Those with certain conditions (sarcoidosis, hyperparathyroidism) should use with caution',
      'Best to test blood levels before supplementing with high doses',
      'Fat-soluble, so take with a meal containing fat for best absorption',
    ],
    researchUrls: [
      'https://pubmed.ncbi.nlm.nih.gov/21427040/',
      'https://pubmed.ncbi.nlm.nih.gov/20439679/',
    ],
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/4fstoxmxbl66beltouga5',
  },
  {
    id: '5',
    name: 'Beta-Alanine',
    category: 'Performance',
    description: 'Beta-alanine is an amino acid that, when combined with histidine, forms carnosine in the muscles. Carnosine acts as a buffer against acid buildup during high-intensity exercise, potentially delaying fatigue.',
    benefits: [
      'Increases muscle carnosine levels',
      'Improves performance in high-intensity exercise lasting 1-4 minutes',
      'May enhance endurance performance',
      'Can increase training volume',
    ],
    sideEffects: [
      'Harmless tingling sensation (paresthesia)',
      'Flushing',
    ],
    dosage: '3-6g daily, can be split into smaller doses to reduce tingling',
    interactions: [
      'No significant interactions with medications',
    ],
    warnings: [
      'Tingling sensation is normal and not harmful',
      'Benefits are seen with consistent use over time (2-4 weeks)',
    ],
    researchUrls: [
      'https://pubmed.ncbi.nlm.nih.gov/16868650/',
      'https://pubmed.ncbi.nlm.nih.gov/18548362/',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '6',
    name: 'Plant-Based Protein (Pea/Rice)',
    category: 'Protein - Plant-Based',
    description: 'Vegan protein blend from pea and brown rice providing a complete amino acid profile with good digestibility. Ideal for dairy-free users.',
    benefits: [
      'Supports muscle recovery and growth',
      'Dairy-free and easier on digestion for many',
      'Often includes fiber and micronutrients',
    ],
    sideEffects: [
      'Possible bloating if high in fiber',
    ],
    dosage: '20-30g per serving, 1-2 servings daily based on needs',
    interactions: [
      'May reduce absorption of certain medications when taken together',
    ],
    warnings: [
      'Check for added sweeteners and allergens',
    ],
    researchUrls: [
      'https://pubmed.ncbi.nlm.nih.gov/27874045/',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1543357480-c60d40007a6a?q=80&w=500',
  },
  {
    id: '50',
    name: 'DHEA (Dehydroepiandrosterone)',
    genericName: 'Dehydroepiandrosterone',
    category: 'Hormone - Adrenal',
    description: 'DHEA is a naturally occurring hormone produced by the adrenal glands that serves as a precursor to both testosterone and estrogen. It peaks in your mid-20s and declines with age. DHEA supplementation is used to support hormone balance, energy, mood, and body composition, particularly in individuals with low baseline levels.',
    benefits: [
      'Hormone balance support (low DHEA-S levels)',
      'Energy and vitality enhancement',
      'Mood and cognitive support',
      'Body composition (lean mass support)',
      'Adrenal support',
      'Bone density maintenance',
    ],
    sideEffects: [
      'Acne and oily skin (androgenic effects)',
      'Facial hair growth in women',
      'Voice deepening (high doses in women)',
      'Mood changes or irritability',
      'Insomnia (if taken late in day)',
      'Potential hormone-sensitive tissue stimulation',
    ],
    dosage: '10-50mg daily for women; 25-100mg daily for men. Start low and titrate based on blood work (DHEA-S levels). Best taken in the morning with food.',
    interactions: [
      'May interact with hormone therapies (testosterone, estrogen)',
      'Can affect hormone-sensitive medications',
      'May interact with psychiatric medications',
      'Caution with corticosteroids',
    ],
    warnings: [
      'Test baseline DHEA-S levels before supplementing',
      'Monitor hormone panels (testosterone, estradiol, DHEA-S) regularly',
      'Avoid in hormone-sensitive cancers (breast, prostate, ovarian)',
      'Not recommended during pregnancy or breastfeeding',
      'May worsen conditions affected by hormones (PCOS, endometriosis)',
      'Use lowest effective dose; more is not better',
      'Consult healthcare provider before use, especially if under 40',
    ],
    researchUrls: [
      'https://pubmed.ncbi.nlm.nih.gov/10468159/',
      'https://pubmed.ncbi.nlm.nih.gov/11836274/',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '51',
    name: '7-Keto DHEA',
    genericName: '7-Keto Dehydroepiandrosterone',
    category: 'Hormone - Metabolite',
    description: '7-Keto DHEA is a naturally occurring metabolite of DHEA that does NOT convert to testosterone or estrogen, making it a safer alternative for those concerned about hormonal side effects. It is primarily used to support metabolism, thermogenesis, and body composition without affecting sex hormone levels. Research suggests it may help with weight management and immune function.',
    benefits: [
      'Metabolic support and thermogenesis',
      'Weight management and fat loss',
      'Body composition improvement',
      'Immune system support',
      'Age-related metabolic decline',
      'Cortisol balance (may help with stress-related weight gain)',
    ],
    sideEffects: [
      'Generally well-tolerated',
      'Mild digestive upset (rare)',
      'Headache (uncommon)',
      'No androgenic or estrogenic effects',
      'Insomnia if taken late in day',
    ],
    dosage: '100-200mg daily, typically split into two doses (morning and early afternoon). Best taken with meals. Cycle 8-12 weeks on, 2-4 weeks off.',
    interactions: [
      'May interact with thyroid medications (monitor thyroid function)',
      'Potential interaction with diabetes medications (monitor blood sugar)',
      'Generally fewer interactions than regular DHEA',
      'Caution with stimulants (additive metabolic effects)',
    ],
    warnings: [
      'Does NOT convert to sex hormones (safer hormonal profile)',
      'May affect thyroid function; monitor TSH if on thyroid meds',
      'Limited long-term safety data',
      'Not recommended during pregnancy or breastfeeding',
      'Consult healthcare provider if you have thyroid disorders',
      'Choose reputable brands; quality varies significantly',
      'May enhance effects of fat-loss supplements',
    ],
    researchUrls: [
      'https://pubmed.ncbi.nlm.nih.gov/10999822/',
      'https://pubmed.ncbi.nlm.nih.gov/17353582/',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=500',
  },
];

export const peptidesMedicines: MedicineInfo[] = [
  {
    id: '1',
    name: 'Semaglutide',
    genericName: 'Semaglutide',
    category: 'GLP-1 Agonist',
    description: 'GLP-1 receptor agonist used for weight management and diabetes. Available as injection (multiple pen - 4 uses) or tablet form.',
    usedFor: [
      'Weight management',
      'Type 2 diabetes',
      'Appetite suppression',
      'Improved insulin sensitivity',
    ],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Diarrhea',
      'Constipation',
      'Potential pancreatitis',
    ],
    dosage: 'Injection: 0.25mg weekly, titrate up. Tablet: 3-14mg daily',
    interactions: [
      'May delay gastric emptying affecting oral medications',
      'Monitor with insulin and diabetes medications',
    ],
    warnings: [
      'Risk of thyroid C-cell tumors',
      'Contraindicated with personal/family history of medullary thyroid carcinoma',
      'Monitor for pancreatitis',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '47',
    name: 'DHEA (Prasterone)',
    genericName: 'Dehydroepiandrosterone',
    category: 'Hormone - Adrenal',
    description: 'Adrenal precursor hormone; local vaginal form approved for dyspareunia; systemic use varies by region.',
    usedFor: [
      'Vaginal atrophy-related discomfort (local prasterone)',
      'Energy/mood (systemic evidence mixed)',
    ],
    sideEffects: [
      'Acne or hirsutism (androgenic effects)',
      'Voice changes at high doses',
    ],
    dosage: 'Vaginal 6.5 mg nightly (product-specific); systemic dosing individualized',
    interactions: [
      'May affect hormone assays and interact with HRT',
    ],
    warnings: [
      'Monitor for androgenic side effects; avoid in hormone-sensitive cancers',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1542736667-069246bdbc8d?q=80&w=500',
  },
  {
    id: '52',
    name: 'DHEA vs 7-Keto DHEA: Which One?',
    genericName: 'Educational Overview',
    category: 'Education',
    description: 'Understanding the key differences between DHEA and 7-Keto DHEA to help you choose the right supplement for your goals. DHEA converts to sex hormones (testosterone/estrogen) and is best for hormone support, while 7-Keto DHEA does NOT convert to sex hormones and is preferred for metabolic support without hormonal effects.',
    usedFor: [
      'Choosing between DHEA and 7-Keto DHEA',
      'Understanding hormonal vs non-hormonal benefits',
      'Safety considerations for each compound',
    ],
    sideEffects: [
      'N/A (education)',
    ],
    dosage: 'DHEA: 10-100mg daily | 7-Keto DHEA: 100-200mg daily',
    interactions: [
      'DHEA: More hormone interactions | 7-Keto: Fewer interactions',
    ],
    warnings: [
      'Choose DHEA if: Low DHEA-S levels, hormone support needed, energy/libido goals',
      'Choose 7-Keto if: Metabolic support, weight management, want to avoid sex hormone effects',
      'DHEA requires hormone monitoring; 7-Keto generally does not',
      'Both: Test before supplementing, use quality brands, consult healthcare provider',
      'Educational content; not medical advice',
    ],
    prescriptionRequired: false,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500',
  },
];

export const drugInteractions: DrugInteraction[] = [
  {
    id: 'di1',
    drug1: 'Warfarin',
    drug2: 'Aspirin',
    interactionType: 'major',
    severity: 'serious',
    description: 'Concurrent use increases bleeding risk significantly',
    mechanism: 'Additive anticoagulant effects',
    clinicalEffects: ['Increased bleeding risk', 'Prolonged clotting time', 'Bruising'],
    management: 'Monitor INR closely, consider dose adjustment',
    references: ['FDA Drug Interactions Database', 'Clinical Pharmacology Review 2023'],
    lastUpdated: '2024-01-15T00:00:00Z'
  },
  {
    id: 'di2',
    drug1: 'Metformin',
    drug2: 'Alcohol',
    interactionType: 'moderate',
    severity: 'significant',
    description: 'Alcohol may increase risk of lactic acidosis',
    mechanism: 'Impaired lactate metabolism',
    clinicalEffects: ['Lactic acidosis risk', 'Hypoglycemia', 'GI upset'],
    management: 'Limit alcohol consumption, monitor blood glucose',
    references: ['Diabetes Care Journal 2023'],
    lastUpdated: '2024-01-10T00:00:00Z'
  },
  {
    id: 'di3',
    drug1: 'Lisinopril',
    drug2: 'Potassium Supplements',
    interactionType: 'moderate',
    severity: 'significant',
    description: 'May cause hyperkalemia',
    mechanism: 'Reduced potassium excretion',
    clinicalEffects: ['Hyperkalemia', 'Cardiac arrhythmias', 'Muscle weakness'],
    management: 'Monitor serum potassium levels regularly',
    references: ['Cardiology Review 2023'],
    lastUpdated: '2024-01-12T00:00:00Z'
  }
];

export const supplementInteractions: SupplementInteraction[] = [
  {
    id: 'si1',
    supplement: 'St. John\'s Wort',
    interactsWith: 'Birth Control Pills',
    interactionType: 'drug',
    severity: 'high',
    description: 'May reduce effectiveness of hormonal contraceptives',
    effects: ['Breakthrough bleeding', 'Reduced contraceptive efficacy', 'Unplanned pregnancy risk'],
    recommendations: ['Use additional contraceptive methods', 'Consult healthcare provider'],
    timing: 'Avoid concurrent use',
    dosageAdjustment: 'Consider alternative supplement'
  },
  {
    id: 'si2',
    supplement: 'Ginkgo Biloba',
    interactsWith: 'Warfarin',
    interactionType: 'drug',
    severity: 'high',
    description: 'Increases bleeding risk when combined with anticoagulants',
    effects: ['Increased bleeding', 'Bruising', 'Prolonged clotting'],
    recommendations: ['Monitor INR closely', 'Report unusual bleeding'],
    timing: 'Take at least 2 hours apart',
    dosageAdjustment: 'May need to reduce warfarin dose'
  },
  {
    id: 'si3',
    supplement: 'Calcium',
    interactsWith: 'Iron',
    interactionType: 'supplement',
    severity: 'moderate',
    description: 'Calcium can reduce iron absorption',
    effects: ['Reduced iron absorption', 'Potential iron deficiency'],
    recommendations: ['Take iron and calcium at different times', 'Space doses by 2+ hours'],
    timing: 'Take 2-4 hours apart',
    dosageAdjustment: 'No dose adjustment needed'
  },
  {
    id: 'si4',
    supplement: 'Caffeine',
    interactsWith: 'Ephedrine',
    interactionType: 'supplement',
    severity: 'high',
    description: 'Combined stimulants can cause dangerous cardiovascular effects',
    effects: ['Rapid heart rate', 'High blood pressure', 'Anxiety', 'Insomnia'],
    recommendations: ['Avoid combination', 'Monitor heart rate and blood pressure'],
    timing: 'Avoid concurrent use',
    dosageAdjustment: 'Reduce or eliminate one supplement'
  },
  {
    id: 'si5',
    supplement: 'Protein Powder',
    interactsWith: 'Levodopa',
    interactionType: 'drug',
    severity: 'moderate',
    description: 'High protein intake may reduce levodopa absorption',
    effects: ['Reduced medication effectiveness', 'Worsening Parkinson symptoms'],
    recommendations: ['Take levodopa 30-60 minutes before protein', 'Distribute protein throughout day'],
    timing: 'Take medication 30-60 minutes before protein',
    dosageAdjustment: 'May need medication timing adjustment'
  },
  {
    id: 'si6',
    supplement: 'DHEA',
    interactsWith: 'Testosterone/Estrogen Therapy',
    interactionType: 'drug',
    severity: 'high',
    description: 'DHEA converts to sex hormones and may interfere with hormone therapy',
    effects: ['Unpredictable hormone levels', 'Reduced therapy effectiveness', 'Increased side effects'],
    recommendations: ['Consult endocrinologist before combining', 'Monitor hormone panels closely'],
    timing: 'Medical supervision required',
    dosageAdjustment: 'May need to adjust hormone therapy doses'
  },
  {
    id: 'si7',
    supplement: '7-Keto DHEA',
    interactsWith: 'Thyroid Medications',
    interactionType: 'drug',
    severity: 'moderate',
    description: 'May affect thyroid function and interact with thyroid medications',
    effects: ['Altered thyroid hormone levels', 'Changes in medication effectiveness'],
    recommendations: ['Monitor TSH and thyroid hormones', 'Consult healthcare provider'],
    timing: 'Regular monitoring required',
    dosageAdjustment: 'May need thyroid medication adjustment'
  },
];

export const herbalInteractions: HerbalInteraction[] = [
  {
    id: 'hi1',
    herb: 'Echinacea',
    commonName: 'Purple Coneflower',
    scientificName: 'Echinacea purpurea',
    interactsWith: ['Immunosuppressants', 'Autoimmune medications'],
    contraindications: ['Autoimmune diseases', 'HIV/AIDS', 'Tuberculosis'],
    warnings: ['May stimulate immune system', 'Avoid with immunosuppressive therapy'],
    pregnancySafety: 'caution',
    breastfeedingSafety: 'caution',
    dosageGuidelines: '300-500mg, 3 times daily for up to 10 days',
    qualityStandards: ['USP verified', 'Third-party tested', 'Standardized extract']
  },
  {
    id: 'hi2',
    herb: 'Ginseng',
    commonName: 'Asian Ginseng',
    scientificName: 'Panax ginseng',
    interactsWith: ['Warfarin', 'Diabetes medications', 'Stimulants'],
    contraindications: ['High blood pressure', 'Heart conditions', 'Insomnia'],
    warnings: ['May affect blood sugar', 'Can increase blood pressure', 'May cause insomnia'],
    pregnancySafety: 'avoid',
    breastfeedingSafety: 'avoid',
    dosageGuidelines: '200-400mg daily of standardized extract',
    qualityStandards: ['Standardized to ginsenosides', 'Heavy metal tested', 'Pesticide free']
  },
];
