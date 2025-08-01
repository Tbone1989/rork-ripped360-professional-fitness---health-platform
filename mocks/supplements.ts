import { SupplementInfo, MedicineInfo, DrugInteraction, SupplementInteraction, HerbalInteraction } from '@/types/medical';

export const popularSupplements: SupplementInfo[] = [
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
    imageUrl: 'https://images.unsplash.com/photo-1577460551100-907fc6e6d955?q=80&w=500',
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
];

export const peptidesMedicines: MedicineInfo[] = [
  {
    id: '1',
    name: 'BPC-157',
    genericName: 'Body Protection Compound-157',
    category: 'Peptide',
    description: 'BPC-157 is a synthetic peptide derived from a protective protein found in gastric juice. It has been studied for its potential healing properties, particularly for tendons, muscles, nerves, and digestive tissue.',
    usedFor: [
      'Tendon and ligament healing',
      'Muscle recovery',
      'Digestive health',
      'Nerve regeneration',
    ],
    sideEffects: [
      'Nausea',
      'Dizziness',
      'Gastrointestinal discomfort',
      'Potential for increased growth in pre-existing cancerous tissues',
    ],
    dosage: 'Typically 250-500mcg daily, subcutaneous or oral',
    interactions: [
      'May interact with medications affecting blood vessels or healing',
      'Potential interaction with NSAIDs',
    ],
    warnings: [
      'Not FDA approved for human use',
      'Limited long-term safety data',
      'Should be avoided by those with cancer or pre-cancerous conditions',
      'Quality and purity vary significantly between suppliers',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=500',
  },
  {
    id: '2',
    name: 'TB-500',
    genericName: 'Thymosin Beta-4',
    category: 'Peptide',
    description: 'TB-500 is a synthetic version of the naturally occurring peptide Thymosin Beta-4. It plays a role in cellular migration, blood vessel formation, and tissue repair.',
    usedFor: [
      'Accelerated wound healing',
      'Recovery from muscle and tendon injuries',
      'Reduction of inflammation',
      'Improved flexibility',
    ],
    sideEffects: [
      'Headache',
      'Fatigue',
      'Pain at injection site',
      'Potential for increased growth in pre-existing cancerous tissues',
    ],
    dosage: 'Typically 2-2.5mg twice weekly for 4-6 weeks, then maintenance',
    interactions: [
      'May interact with blood thinners',
      'Potential interaction with immunosuppressants',
    ],
    warnings: [
      'Not FDA approved for human use',
      'Limited human clinical trials',
      'Should be avoided by those with cancer or pre-cancerous conditions',
      'Quality and purity vary significantly between suppliers',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '3',
    name: 'CJC-1295 with DAC',
    genericName: 'Growth Hormone Releasing Hormone Analog',
    category: 'Peptide',
    description: 'CJC-1295 is a synthetic analog of growth hormone-releasing hormone (GHRH) that stimulates the release of growth hormone from the pituitary gland. The DAC (Drug Affinity Complex) version has a longer half-life.',
    usedFor: [
      'Increased growth hormone production',
      'Fat loss',
      'Muscle growth',
      'Improved recovery and sleep',
    ],
    sideEffects: [
      'Water retention',
      'Headache',
      'Joint pain',
      'Increased insulin resistance',
      'Potential impact on existing tumors',
    ],
    dosage: 'Typically 2mg per week, divided into 2-3 injections',
    interactions: [
      'May interact with diabetes medications',
      'Potential interaction with thyroid medications',
    ],
    warnings: [
      'Not FDA approved for human use',
      'Should be avoided by those with cancer, diabetes, or active tumors',
      'May impact glucose metabolism',
      'Quality and purity vary significantly between suppliers',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '4',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    category: 'Medication',
    description: 'Metformin is a medication primarily used to treat type 2 diabetes by improving insulin sensitivity and reducing glucose production in the liver. It has gained interest for potential anti-aging and performance benefits.',
    usedFor: [
      'Type 2 diabetes management',
      'Insulin resistance',
      'Polycystic ovary syndrome (PCOS)',
      'Potential longevity benefits',
    ],
    sideEffects: [
      'Gastrointestinal discomfort',
      'Nausea',
      'Diarrhea',
      'Vitamin B12 deficiency with long-term use',
      'Lactic acidosis (rare but serious)',
    ],
    dosage: 'Typically 500-2000mg daily, divided into 1-3 doses with meals',
    interactions: [
      'Numerous drug interactions including contrast dyes',
      'Alcohol may increase risk of lactic acidosis',
      'May affect absorption of certain vitamins and medications',
    ],
    warnings: [
      'Should not be used by those with kidney disease or heart failure',
      'Temporarily discontinue before surgery or procedures with contrast dye',
      'Monitor vitamin B12 levels with long-term use',
      'Lactic acidosis risk increases with kidney or liver impairment',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '5',
    name: 'Rapamycin',
    genericName: 'Sirolimus',
    category: 'Medication',
    description: 'Rapamycin is an immunosuppressant medication that inhibits the mTOR pathway. Originally used to prevent organ transplant rejection, it has gained interest for potential anti-aging and longevity effects.',
    usedFor: [
      'Preventing organ transplant rejection',
      'Treating certain rare diseases',
      'Potential longevity and anti-aging research',
      'Some autoimmune conditions',
    ],
    sideEffects: [
      'Increased susceptibility to infections',
      'Mouth sores',
      'Elevated cholesterol and triglycerides',
      'Impaired wound healing',
      'Potential lung inflammation',
    ],
    dosage: 'Varies widely based on indication, typically 1-5mg weekly for longevity purposes',
    interactions: [
      'Numerous drug interactions with antibiotics, antifungals, and other medications',
      'Grapefruit juice significantly increases blood levels',
      'May interact with vaccines',
    ],
    warnings: [
      'Powerful immunosuppressant that increases infection risk',
      'Regular blood work required to monitor effects',
      'Not FDA approved for anti-aging purposes',
      'Should be used under close medical supervision',
      'May increase risk of certain cancers with long-term use',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
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
  }
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
  {
    id: 'hi3',
    herb: 'Turmeric',
    commonName: 'Turmeric Root',
    scientificName: 'Curcuma longa',
    interactsWith: ['Blood thinners', 'Diabetes medications', 'Chemotherapy drugs'],
    contraindications: ['Gallstones', 'Bile duct obstruction', 'Bleeding disorders'],
    warnings: ['May increase bleeding risk', 'Can lower blood sugar', 'May interfere with chemotherapy'],
    pregnancySafety: 'safe',
    breastfeedingSafety: 'safe',
    dosageGuidelines: '500-1000mg curcumin daily with black pepper extract',
    qualityStandards: ['Standardized to curcumin', 'Contains piperine', 'Organic certified']
  },
  {
    id: 'hi4',
    herb: 'Ashwagandha',
    commonName: 'Indian Winter Cherry',
    scientificName: 'Withania somnifera',
    interactsWith: ['Sedatives', 'Blood pressure medications', 'Immunosuppressants'],
    contraindications: ['Autoimmune diseases', 'Thyroid disorders', 'Surgery (2 weeks prior)'],
    warnings: ['May lower blood pressure', 'Can affect thyroid function', 'May cause drowsiness'],
    pregnancySafety: 'avoid',
    breastfeedingSafety: 'avoid',
    dosageGuidelines: '300-600mg daily of root extract',
    qualityStandards: ['KSM-66 or Sensoril extract', 'Third-party tested', 'Heavy metal free']
  }
];