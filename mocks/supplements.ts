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
  // GLP-1 Agonists
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
    id: '2',
    name: 'Tirzepatide',
    genericName: 'Tirzepatide',
    category: 'GLP-1/GIP Agonist',
    description: 'Dual GLP-1 and GIP receptor agonist. Available as single-use pen injection.',
    usedFor: [
      'Weight management',
      'Type 2 diabetes',
      'Improved metabolic health',
      'Enhanced satiety',
    ],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Diarrhea',
      'Decreased appetite',
      'Injection site reactions',
    ],
    dosage: '2.5mg weekly, titrate up to 15mg weekly as tolerated',
    interactions: [
      'May affect absorption of oral medications',
      'Monitor with diabetes medications',
    ],
    warnings: [
      'Risk of thyroid C-cell tumors',
      'Monitor for pancreatitis',
      'Contraindicated in pregnancy',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '3',
    name: 'Retatrutide',
    genericName: 'Retatrutide',
    category: 'Triple Agonist',
    description: 'Triple receptor agonist (GLP-1, GIP, and glucagon) for advanced weight management.',
    usedFor: [
      'Significant weight loss',
      'Metabolic syndrome',
      'Advanced obesity treatment',
    ],
    sideEffects: [
      'Severe nausea',
      'Vomiting',
      'Diarrhea',
      'Fatigue',
      'Potential liver effects',
    ],
    dosage: 'Starting dose varies, typically 1-12mg weekly',
    interactions: [
      'Extensive drug interactions due to multiple pathways',
      'Monitor all concurrent medications',
    ],
    warnings: [
      'Experimental compound',
      'Limited long-term safety data',
      'Requires specialized monitoring',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '4',
    name: 'Cagrilintide',
    genericName: 'Cagrilintide',
    category: 'Amylin Analog',
    description: 'Long-acting amylin analog that works synergistically with GLP-1 agonists.',
    usedFor: [
      'Weight management (combination therapy)',
      'Appetite suppression',
      'Gastric emptying regulation',
    ],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Injection site reactions',
      'Hypoglycemia (when combined with insulin)',
    ],
    dosage: 'Typically 2.4mg weekly in combination protocols',
    interactions: [
      'Often combined with semaglutide',
      'May enhance hypoglycemic effects',
    ],
    warnings: [
      'Investigational compound',
      'Use only in clinical settings',
      'Monitor for severe hypoglycemia',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  // Melanocortin Peptides
  {
    id: '5',
    name: 'Melanotan 1',
    genericName: 'Afamelanotide',
    category: 'Melanocortin Peptide',
    description: 'Synthetic analog of α-melanocyte stimulating hormone for tanning and photoprotection.',
    usedFor: [
      'Photoprotection',
      'Tanning enhancement',
      'Erythropoietic protoporphyria treatment',
    ],
    sideEffects: [
      'Nausea',
      'Flushing',
      'Darkening of moles and freckles',
      'Injection site reactions',
    ],
    dosage: '0.25-1mg daily subcutaneous injection',
    interactions: [
      'May interact with photosensitizing medications',
    ],
    warnings: [
      'Not FDA approved for cosmetic use',
      'Monitor skin changes carefully',
      'Avoid excessive sun exposure',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '6',
    name: 'MT-2 (Melanotan 2)',
    genericName: 'Melanotan 2 Acetate',
    category: 'Melanocortin Peptide',
    description: 'Synthetic peptide that stimulates melanogenesis and has appetite suppressant effects.',
    usedFor: [
      'Tanning enhancement',
      'Appetite suppression',
      'Libido enhancement',
    ],
    sideEffects: [
      'Nausea',
      'Flushing',
      'Darkening of skin and moles',
      'Potential erectile dysfunction',
    ],
    dosage: '0.25-1mg daily, loading phase then maintenance',
    interactions: [
      'May interact with blood pressure medications',
    ],
    warnings: [
      'Not approved for human use',
      'Significant cardiovascular risks',
      'Monitor for skin changes and mole growth',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  // Growth Hormone Peptides
  {
    id: '7',
    name: 'Ipamorelin',
    genericName: 'Ipamorelin',
    category: 'GHRP',
    description: 'Growth hormone releasing peptide that stimulates natural GH production.',
    usedFor: [
      'Increased growth hormone production',
      'Improved recovery',
      'Enhanced sleep quality',
      'Anti-aging effects',
    ],
    sideEffects: [
      'Water retention',
      'Joint pain',
      'Increased hunger',
      'Injection site reactions',
    ],
    dosage: '200-300mcg, 2-3 times daily on empty stomach',
    interactions: [
      'May interact with diabetes medications',
      'Monitor with thyroid medications',
    ],
    warnings: [
      'Not FDA approved',
      'May affect glucose metabolism',
      'Avoid use with active cancer',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '8',
    name: 'CJC-1295 No DAC',
    genericName: 'CJC-1295 without DAC',
    category: 'GHRH Analog',
    description: 'Growth hormone releasing hormone analog without drug affinity complex.',
    usedFor: [
      'Natural GH pulse enhancement',
      'Improved recovery',
      'Fat loss',
      'Muscle growth',
    ],
    sideEffects: [
      'Water retention',
      'Joint discomfort',
      'Headache',
      'Injection site reactions',
    ],
    dosage: '100mcg, 1-3 times daily with GHRP',
    interactions: [
      'Often combined with Ipamorelin or GHRP-6',
      'Monitor with diabetes medications',
    ],
    warnings: [
      'Not FDA approved',
      'Requires proper storage and handling',
      'Monitor for glucose changes',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '9',
    name: 'CJC-1295 With DAC',
    genericName: 'CJC-1295 with Drug Affinity Complex',
    category: 'GHRH Analog',
    description: 'Long-acting growth hormone releasing hormone analog with extended half-life.',
    usedFor: [
      'Sustained GH elevation',
      'Fat loss',
      'Muscle growth',
      'Anti-aging effects',
    ],
    sideEffects: [
      'Water retention',
      'Joint pain',
      'Carpal tunnel symptoms',
      'Potential insulin resistance',
    ],
    dosage: '2mg per week, divided into 2-3 injections',
    interactions: [
      'May interact with diabetes medications',
      'Monitor with thyroid hormones',
    ],
    warnings: [
      'Not FDA approved',
      'May cause prolonged GH elevation',
      'Avoid with active tumors',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  // Healing and Recovery Peptides
  {
    id: '10',
    name: 'BPC-157',
    genericName: 'Body Protection Compound-157',
    category: 'Healing Peptide',
    description: 'Synthetic peptide derived from gastric protective protein with healing properties.',
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
      'Potential tumor growth acceleration',
    ],
    dosage: '250-500mcg daily, subcutaneous or oral',
    interactions: [
      'May interact with NSAIDs',
      'Potential interaction with blood thinners',
    ],
    warnings: [
      'Not FDA approved',
      'Limited long-term safety data',
      'Avoid with active cancer',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=500',
  },
  {
    id: '11',
    name: 'TB-500',
    genericName: 'Thymosin Beta-4 Acetate',
    category: 'Healing Peptide',
    description: 'Synthetic version of naturally occurring thymosin beta-4 for tissue repair.',
    usedFor: [
      'Accelerated wound healing',
      'Muscle and tendon repair',
      'Inflammation reduction',
      'Improved flexibility',
    ],
    sideEffects: [
      'Headache',
      'Fatigue',
      'Injection site pain',
      'Potential tumor growth',
    ],
    dosage: '2-2.5mg twice weekly for 4-6 weeks',
    interactions: [
      'May interact with blood thinners',
      'Potential interaction with immunosuppressants',
    ],
    warnings: [
      'Not FDA approved',
      'Limited human studies',
      'Avoid with cancer history',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  // Additional Peptides and Compounds
  {
    id: '12',
    name: 'Adipotide',
    genericName: 'Adipotide',
    category: 'Experimental Peptide',
    description: 'Experimental peptide that targets blood vessels in adipose tissue.',
    usedFor: [
      'Experimental fat loss',
      'Research purposes only',
    ],
    sideEffects: [
      'Severe dehydration',
      'Kidney damage',
      'Potential organ damage',
      'Death (in animal studies)',
    ],
    dosage: 'Not established for human use',
    interactions: [
      'Unknown - experimental compound',
    ],
    warnings: [
      'EXTREMELY DANGEROUS',
      'Not approved for human use',
      'Has caused deaths in animal studies',
      'DO NOT USE',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '13',
    name: 'NAD+',
    genericName: 'Nicotinamide Adenine Dinucleotide',
    category: 'Coenzyme',
    description: 'Essential coenzyme involved in cellular energy production and DNA repair.',
    usedFor: [
      'Anti-aging therapy',
      'Cellular energy enhancement',
      'DNA repair support',
      'Neurological health',
    ],
    sideEffects: [
      'Nausea',
      'Fatigue',
      'Headache',
      'Injection site reactions',
    ],
    dosage: '250-500mg IV infusion or 100-200mg subcutaneous',
    interactions: [
      'May interact with blood pressure medications',
      'Monitor with diabetes medications',
    ],
    warnings: [
      'Limited long-term safety data',
      'Quality varies between suppliers',
      'Expensive treatment',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '14',
    name: 'HCG',
    genericName: 'Human Chorionic Gonadotropin',
    category: 'Hormone',
    description: 'Hormone that mimics luteinizing hormone, used for fertility and testosterone support.',
    usedFor: [
      'Male fertility enhancement',
      'Testosterone production support',
      'Post-cycle therapy',
      'Weight loss (controversial)',
    ],
    sideEffects: [
      'Gynecomastia',
      'Water retention',
      'Mood changes',
      'Injection site reactions',
    ],
    dosage: '250-500 IU, 2-3 times weekly',
    interactions: [
      'May interact with testosterone therapy',
      'Monitor with fertility medications',
    ],
    warnings: [
      'Prescription required',
      'Monitor estrogen levels',
      'Not effective for weight loss',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '15',
    name: 'PT-141',
    genericName: 'Bremelanotide',
    category: 'Melanocortin Agonist',
    description: 'Melanocortin receptor agonist used for sexual dysfunction.',
    usedFor: [
      'Female sexual dysfunction',
      'Libido enhancement',
      'Sexual arousal disorders',
    ],
    sideEffects: [
      'Nausea',
      'Flushing',
      'Headache',
      'Injection site reactions',
    ],
    dosage: '1.75mg subcutaneous injection as needed',
    interactions: [
      'May interact with blood pressure medications',
      'Avoid with certain heart conditions',
    ],
    warnings: [
      'FDA approved for specific indications',
      'Monitor blood pressure',
      'Not for daily use',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  // Specialty Compounds
  {
    id: '16',
    name: 'Glutathione',
    genericName: 'Glutathione',
    category: 'Antioxidant',
    description: 'Master antioxidant that supports detoxification and cellular health.',
    usedFor: [
      'Antioxidant support',
      'Liver detoxification',
      'Skin lightening',
      'Immune system support',
    ],
    sideEffects: [
      'Rare allergic reactions',
      'Potential zinc depletion',
      'Asthma exacerbation (inhaled form)',
    ],
    dosage: '600-1200mg IV or 500mg oral daily',
    interactions: [
      'May interact with chemotherapy drugs',
      'Monitor with acetaminophen use',
    ],
    warnings: [
      'IV form requires medical supervision',
      'Oral bioavailability is limited',
      'Quality varies significantly',
    ],
    prescriptionRequired: false,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '17',
    name: 'B12 Injection',
    genericName: 'Cyanocobalamin/Methylcobalamin',
    category: 'Vitamin',
    description: 'Essential vitamin B12 for energy production and neurological function.',
    usedFor: [
      'B12 deficiency treatment',
      'Energy enhancement',
      'Neurological support',
      'Metabolic support',
    ],
    sideEffects: [
      'Injection site reactions',
      'Rare allergic reactions',
      'Potential acne flares',
    ],
    dosage: '1000mcg weekly to monthly injections',
    interactions: [
      'May interact with certain antibiotics',
      'Monitor with metformin use',
    ],
    warnings: [
      'Generally very safe',
      'Methylcobalamin preferred over cyanocobalamin',
      'Test B12 levels before supplementing',
    ],
    prescriptionRequired: false,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  // Combination Products
  {
    id: '18',
    name: 'GLOW Combination',
    genericName: 'GHK-CU + BPC-157 + TB-500',
    category: 'Combination Peptide',
    description: 'Combination of 35mg GHK-CU, 5mg BPC-157, and 10mg TB-500 for comprehensive healing.',
    usedFor: [
      'Comprehensive tissue repair',
      'Anti-aging effects',
      'Skin health improvement',
      'Recovery enhancement',
    ],
    sideEffects: [
      'Combined side effects of individual peptides',
      'Injection site reactions',
      'Potential interactions',
    ],
    dosage: 'As directed by healthcare provider',
    interactions: [
      'Multiple potential interactions',
      'Requires careful monitoring',
    ],
    warnings: [
      'Complex combination requiring expertise',
      'Not FDA approved',
      'Monitor for all individual peptide warnings',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '19',
    name: 'BPC-157 + TB-500',
    genericName: 'BPC-157 and TB-500 Combination',
    category: 'Combination Peptide',
    description: 'Synergistic combination of healing peptides for enhanced recovery.',
    usedFor: [
      'Accelerated healing',
      'Injury recovery',
      'Inflammation reduction',
      'Tissue repair',
    ],
    sideEffects: [
      'Combined effects of both peptides',
      'Potential enhanced side effects',
    ],
    dosage: 'Typically 250mcg BPC-157 + 2mg TB-500 twice weekly',
    interactions: [
      'Combined interactions of both peptides',
    ],
    warnings: [
      'Not FDA approved',
      'Limited safety data for combination',
      'Avoid with cancer history',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  {
    id: '20',
    name: 'CJC-1295 + Ipamorelin',
    genericName: 'CJC-1295 No DAC and Ipamorelin',
    category: 'Combination Peptide',
    description: 'Popular combination for natural growth hormone enhancement.',
    usedFor: [
      'Synergistic GH release',
      'Enhanced recovery',
      'Improved sleep quality',
      'Anti-aging benefits',
    ],
    sideEffects: [
      'Water retention',
      'Joint discomfort',
      'Increased hunger',
      'Injection site reactions',
    ],
    dosage: '100mcg CJC-1295 + 200mcg Ipamorelin, 2-3 times daily',
    interactions: [
      'Monitor with diabetes medications',
      'May affect thyroid function',
    ],
    warnings: [
      'Not FDA approved',
      'Requires proper timing and dosing',
      'Monitor glucose levels',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500',
  },
  // Muscle building / Myostatin pathway
  {
    id: '21',
    name: 'Follistatin-344',
    genericName: 'Follistatin-344',
    category: 'Myostatin Inhibitor',
    description: 'Experimental binding protein that inhibits myostatin, effectively removing the “myostatin brakes” on muscle growth. 2025-2026 pipelines include longer-acting variants.',
    usedFor: [
      'Muscle growth acceleration',
      'Body recomposition',
      'Strength enhancement',
    ],
    sideEffects: [
      'Unknown long-term safety',
      'Potential organomegaly',
      'Injection site reactions',
    ],
    dosage: 'Experimental; protocols vary widely in research settings',
    interactions: [
      'Potential synergy with IGF-1 analogs',
    ],
    warnings: [
      'Not FDA approved',
      'Human data limited; use restricted to research',
      'Monitor cardiac and hepatic markers if used clinically',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1559757175-08d9df0ae85f?q=80&w=500',
  },
  {
    id: '22',
    name: 'IGF-1 LR3',
    genericName: 'Insulin-like Growth Factor-1 Long R3',
    category: 'Growth Factor Analog',
    description: 'Long-acting IGF-1 analog that supports muscle hypertrophy and satellite cell activation. Often stacked with GH secretagogues. 2025 protocols emphasize safer micro-dosing.',
    usedFor: [
      'Lean muscle accrual',
      'Recovery enhancement',
      'Injury rehab support',
    ],
    sideEffects: [
      'Hypoglycemia risk',
      'Water retention',
      'Potential organ growth with abuse',
    ],
    dosage: '20-40mcg daily, cyclical use; medical supervision advised',
    interactions: [
      'Potentiated by GH-releasing peptides',
      'Caution with insulin or glucose-lowering drugs',
    ],
    warnings: [
      'Not FDA approved',
      'Monitor fasting glucose, IGF-1, and thyroid panel',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1578496781380-937e56b1fd7e?q=80&w=500',
  },
  {
    id: '23',
    name: 'PEG-MGF',
    genericName: 'PEGylated Mechano Growth Factor',
    category: 'Growth Factor Analog',
    description: 'Mechanical stress–responsive IGF-1 splice variant for localized muscle repair. PEGylation extends half-life; 2026 depot formulations under investigation.',
    usedFor: [
      'Localized muscle recovery',
      'Hypertrophy support',
      'Post-injury regeneration',
    ],
    sideEffects: [
      'Localized swelling',
      'Hypoglycemia potential',
      'Joint discomfort',
    ],
    dosage: '100-200mcg post-training, cyclical',
    interactions: [
      'Stacks with GH secretagogues and IGF-1 analogs',
    ],
    warnings: [
      'Research compound; medical monitoring recommended',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1603398749947-9f3f0f7b2c88?q=80&w=500',
  },
  // GH axis
  {
    id: '24',
    name: 'CJC-1295 (no DAC)',
    genericName: 'CJC-1295 without DAC',
    category: 'GHRH Analog',
    description: 'Provides natural GH pulses when timed around meals and sleep. Often paired with GHRPs like Ipamorelin. 2025 best-practice protocols focus on glucose neutrality.',
    usedFor: [
      'Natural GH pulse optimization',
      'Fat loss support',
      'Sleep and recovery quality',
    ],
    sideEffects: [
      'Water retention',
      'Headache',
      'Injection site irritation',
    ],
    dosage: '100mcg 1-3x daily, commonly with Ipamorelin',
    interactions: [
      'Synergy with GHRPs',
    ],
    warnings: [
      'Not FDA approved; monitor glucose and IGF-1',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1516826957135-700dedea698f?q=80&w=500',
  },
  // Cognitive / memory
  {
    id: '25',
    name: 'Semax',
    genericName: 'ACTH(4-7) Pro-Gly-Pro',
    category: 'Nootropic Peptide',
    description: 'Heptapeptide with neurotrophic and potentially procognitive effects. Used off-label for focus and neuroprotection.',
    usedFor: [
      'Memory and focus',
      'Neuroprotection',
      'Recovery from neurological stress',
    ],
    sideEffects: [
      'Irritation (intranasal)',
      'Headache',
      'Anxiety in sensitive users',
    ],
    dosage: 'Intranasal 200-400mcg per dose, cycles of 10-14 days',
    interactions: [
      'Caution with stimulants and MAO-affecting agents',
    ],
    warnings: [
      'Research peptide; human evidence mixed',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=500',
  },
  {
    id: '26',
    name: 'Selank',
    genericName: 'Thr-Lys-Pro-Arg-Pro-Gly-Pro',
    category: 'Anxiolytic Peptide',
    description: 'Tuftsin analog with reported anxiolytic and cognition-stabilizing effects; sometimes paired with Semax.',
    usedFor: [
      'Anxiety reduction',
      'Memory stabilization',
      'Stress resilience',
    ],
    sideEffects: [
      'Nasal irritation',
      'Fatigue',
    ],
    dosage: 'Intranasal 200-400mcg per dose, cycles of 10-14 days',
    interactions: [
      'Additive sedation with anxiolytics',
    ],
    warnings: [
      'Research peptide; limited large-scale trials',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=500',
  },
  // Recovery / healing (additional)
  {
    id: '27',
    name: 'GHK-Cu',
    genericName: 'Copper Tripeptide-1',
    category: 'Regenerative Peptide',
    description: 'Copper-binding tripeptide associated with wound healing, skin repair, and hair support.',
    usedFor: [
      'Skin and connective tissue repair',
      'Hair growth support',
      'Anti-inflammatory effects',
    ],
    sideEffects: [
      'Skin irritation (topical)',
      'Nausea (systemic use)',
    ],
    dosage: 'Topical daily; injectable protocols vary and remain investigational',
    interactions: [
      'May interact with chelating agents',
    ],
    warnings: [
      'Quality varies; verify source purity',
    ],
    prescriptionRequired: false,
    imageUrl: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=500',
  },
  // Testosterone / reproductive axis
  {
    id: '28',
    name: 'Kisspeptin-10',
    genericName: 'Metastin(45-54)',
    category: 'Reproductive Peptide',
    description: 'Stimulates GnRH release upstream, supporting LH/FSH and endogenous testosterone. 2025 male fertility trials expanding.',
    usedFor: [
      'Testosterone enhancement (endogenous)',
      'Male fertility support',
      'Cycle support and HPG axis activation',
    ],
    sideEffects: [
      'Nausea',
      'Headache',
      'Flushing',
    ],
    dosage: '100-200mcg SC 2-3x weekly (investigational)',
    interactions: [
      'May interact with exogenous testosterone or SERMs',
    ],
    warnings: [
      'Investigational; endocrine monitoring required',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1562243061-204550d8a2c2?q=80&w=500',
  },
  {
    id: '29',
    name: 'Gonadorelin',
    genericName: 'GnRH',
    category: 'Reproductive Peptide',
    description: 'Gonadotropin-releasing hormone analog used diagnostically and for short-term HPG axis stimulation.',
    usedFor: [
      'Testosterone support (diagnostic/therapeutic)',
      'Male and female hormone balance protocols',
    ],
    sideEffects: [
      'Headache',
      'Mood changes',
      'Nausea',
    ],
    dosage: 'Varies widely by protocol; medical supervision only',
    interactions: [
      'Interacts with HRT regimens',
    ],
    warnings: [
      'Endocrine specialist oversight recommended',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1612536379934-1e4f2d7b7d8a?q=80&w=500',
  },
  // Women’s hormone balance
  {
    id: '30',
    name: 'Sermorelin',
    genericName: 'GHRH(1-29)',
    category: 'GHRH Analog',
    description: 'Short-acting GHRH analog that supports nightly GH pulses; can aid body composition and sleep in both men and women.',
    usedFor: [
      'Hormone balance support',
      'Recovery and sleep quality',
      'Body fat reduction',
    ],
    sideEffects: [
      'Flushing',
      'Headache',
    ],
    dosage: '200-500mcg subcutaneous at bedtime',
    interactions: [
      'Synergy with GHRPs',
    ],
    warnings: [
      'Monitor IGF-1 and glucose',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=500',
  },
  // GLP and satiety axis (additional / upcoming)
  {
    id: '31',
    name: 'Amylin + GLP Combo (Cagrilintide + Semaglutide)',
    genericName: 'Cagrilintide with Semaglutide',
    category: 'Combination Peptide',
    description: 'Next-gen satiety protocol combining amylin analog and GLP-1 RA. Multiple 2025-2026 outcome studies incoming.',
    usedFor: [
      'Appetite control',
      'Weight management',
      'Metabolic health',
    ],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Hypoglycemia with insulin',
    ],
    dosage: 'Specialist-directed combination therapy',
    interactions: [
      'Affects gastric emptying and oral drug absorption',
    ],
    warnings: [
      'Medical supervision mandatory',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1628157588553-5e6e0a9ea9ae?q=80&w=500',
  },
  // Thyroid / metabolic support
  {
    id: '32',
    name: 'Thyrotropin-Releasing Hormone (TRH)',
    genericName: 'Protirelin',
    category: 'Hypothalamic Peptide',
    description: 'Historically diagnostic, emerging micro-dose interest for mood and metabolism; 2026 controlled trials anticipated.',
    usedFor: [
      'Metabolic rate modulation',
      'Mood and cognition (experimental)',
    ],
    sideEffects: [
      'Nausea',
      'Blood pressure changes',
    ],
    dosage: 'Diagnostic dosing established; therapeutic micro-dosing investigational',
    interactions: [
      'Interacts with thyroid medications',
    ],
    warnings: [
      'Use only under specialist care',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1542736667-069246bdbc8d?q=80&w=500',
  },
  // Anti-catabolic / performance
  {
    id: '33',
    name: 'AOD-9604',
    genericName: 'GH Fragment 176-191',
    category: 'GH Fragment',
    description: 'GH-derived fragment explored for lipolysis without full GH effects.',
    usedFor: [
      'Fat loss support',
      'Joint comfort (anecdotal)',
    ],
    sideEffects: [
      'Injection site irritation',
    ],
    dosage: '250-500mcg daily (investigational)',
    interactions: [
      'May be paired with GH secretagogues',
    ],
    warnings: [
      'Research status varies by region',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1544288070-fc77d6ea1dfd?q=80&w=500',
  },
  {
    id: '34',
    name: 'LL-37',
    genericName: 'Cathelicidin Antimicrobial Peptide',
    category: 'Immunomodulatory Peptide',
    description: 'Host-defense peptide explored for immune modulation and chronic infection adjunct. 2025 dermatology studies ongoing.',
    usedFor: [
      'Immune support (adjunct)',
      'Dermatologic conditions (investigational)',
    ],
    sideEffects: [
      'Inflammation at injection site',
      'Flu-like symptoms',
    ],
    dosage: 'Varies widely; investigational only',
    interactions: [
      'Potential interaction with immunosuppressants',
    ],
    warnings: [
      'Not FDA approved; monitor inflammatory markers',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=500',
  },
  // Coming soon tracker
  {
    id: '35',
    name: 'Next-Gen Myostatin Modulators (2025-2026)',
    genericName: 'FST variants / Anti-myostatin mAbs (pipeline)',
    category: 'Pipeline (2025-2026)',
    description: 'Updated tracker for upcoming myostatin-targeting therapies and peptide variants expected across 2025-2026. Will auto-update as data emerges.',
    usedFor: [
      'Muscle growth',
      'Sarcopenia research',
    ],
    sideEffects: [
      'Unknown; safety data pending',
    ],
    dosage: 'Not established',
    interactions: [
      'Unknown',
    ],
    warnings: [
      'Investigational; data to be updated as trials publish',
    ],
    prescriptionRequired: true,
    imageUrl: 'https://images.unsplash.com/photo-1535747790212-30c585ab4863?q=80&w=500',
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