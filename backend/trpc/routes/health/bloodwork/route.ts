import { z } from "zod";
import { publicProcedure } from "../../../create-context";

interface BloodworkAnalysis {
  id: string;
  testName: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
  };
  status: 'normal' | 'low' | 'high' | 'critical';
  recommendations: string[];
}

const getMockBloodworkAnalysis = (): BloodworkAnalysis[] => {
  return [
    {
      id: '1',
      testName: 'Total Cholesterol',
      value: 180,
      unit: 'mg/dL',
      referenceRange: { min: 125, max: 200 },
      status: 'normal',
      recommendations: [
        'Maintain current diet and exercise routine',
        'Continue regular monitoring'
      ],
    },
    {
      id: '2',
      testName: 'Vitamin D',
      value: 25,
      unit: 'ng/mL',
      referenceRange: { min: 30, max: 100 },
      status: 'low',
      recommendations: [
        'Consider vitamin D supplementation',
        'Increase sun exposure',
        'Include vitamin D rich foods in diet'
      ],
    },
    {
      id: '3',
      testName: 'Testosterone',
      value: 450,
      unit: 'ng/dL',
      referenceRange: { min: 300, max: 1000 },
      status: 'normal',
      recommendations: [
        'Levels are within normal range',
        'Continue current lifestyle habits'
      ],
    },
  ];
};

export default publicProcedure
  .input(z.any())
  .mutation(async ({ input }) => {
    console.log(`🩸 Analyzing bloodwork data`);
    
    const analysis = getMockBloodworkAnalysis();
    console.log(`✅ Generated analysis for ${analysis.length} tests`);
    
    return analysis;
  });