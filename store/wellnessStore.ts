import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { 
  SleepData, 
  StressData, 
  RecoveryMetrics, 
  HormoneTracking, 
  SupplementInteraction,
  WellnessGoals,
  GymTestingScenario,
  NutritionTestScenario
} from '@/types/wellness';

interface WellnessState {
  sleepData: SleepData[];
  stressData: StressData[];
  recoveryMetrics: RecoveryMetrics[];
  hormoneData: HormoneTracking[];
  supplementInteractions: SupplementInteraction[];
  wellnessGoals: WellnessGoals;
  gymTestingScenarios: GymTestingScenario[];
  nutritionTestScenarios: NutritionTestScenario[];
  
  // Actions
  addSleepData: (data: Omit<SleepData, 'id'>) => void;
  addStressData: (data: Omit<StressData, 'id'>) => void;
  addRecoveryMetrics: (data: Omit<RecoveryMetrics, 'id'>) => void;
  addHormoneData: (data: Omit<HormoneTracking, 'id'>) => void;
  updateWellnessGoals: (goals: Partial<WellnessGoals>) => void;
  runGymTest: (scenarioId: string, testCaseId: string, result: 'passed' | 'failed', notes?: string) => void;
  runNutritionTest: (scenarioId: string, testCaseId: string, result: 'passed' | 'failed', notes?: string) => void;
}

const initialGymTestingScenarios: GymTestingScenario[] = [
  {
    id: '1',
    name: 'Bright Gym Environment',
    description: 'Testing app visibility and touch responsiveness in bright gym lighting',
    environment: 'bright',
    temperature: 'hot',
    humidity: 'high',
    noiseLevel: 'loud',
    testCases: [
      {
        id: '1-1',
        name: 'Screen Visibility',
        description: 'Check if workout timer and exercise details are clearly visible',
        expectedBehavior: 'All text should be readable with high contrast',
        status: 'pending'
      },
      {
        id: '1-2',
        name: 'Touch Responsiveness',
        description: 'Test button taps with sweaty fingers',
        expectedBehavior: 'Buttons should respond accurately to touch',
        status: 'pending'
      },
      {
        id: '1-3',
        name: 'Battery Usage',
        description: 'Monitor battery drain during 60-minute workout',
        expectedBehavior: 'Battery should not drain more than 15%',
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    name: 'Outdoor Workout',
    description: 'Testing app performance during outdoor training sessions',
    environment: 'outdoor',
    temperature: 'normal',
    humidity: 'normal',
    noiseLevel: 'moderate',
    testCases: [
      {
        id: '2-1',
        name: 'Sunlight Readability',
        description: 'Check screen visibility in direct sunlight',
        expectedBehavior: 'Screen should auto-adjust brightness or have manual override',
        status: 'pending'
      },
      {
        id: '2-2',
        name: 'GPS Accuracy',
        description: 'Test location tracking for outdoor workouts',
        expectedBehavior: 'Location should be accurate within 5 meters',
        status: 'pending'
      }
    ]
  }
];

const initialNutritionTestScenarios: NutritionTestScenario[] = [
  {
    id: '1',
    name: 'Meal Prep Session',
    scenario: 'meal_prep',
    testCases: [
      {
        id: '1-1',
        name: 'Bulk Food Logging',
        description: 'Log multiple meals prepared at once',
        expectedBehavior: 'Should allow batch entry and portion calculations',
        status: 'pending'
      },
      {
        id: '1-2',
        name: 'Recipe Scaling',
        description: 'Scale recipes for multiple servings',
        expectedBehavior: 'Macros should scale proportionally',
        status: 'pending'
      },
      {
        id: '1-3',
        name: 'Meal Storage Planning',
        description: 'Plan storage containers and portions',
        expectedBehavior: 'Should calculate container sizes and portions',
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    name: 'Restaurant Dining',
    scenario: 'restaurant',
    testCases: [
      {
        id: '2-1',
        name: 'Menu Item Search',
        description: 'Find restaurant items in database',
        expectedBehavior: 'Should find common restaurant chains and items',
        status: 'pending'
      },
      {
        id: '2-2',
        name: 'Photo Recognition',
        description: 'Identify food from photo',
        expectedBehavior: 'Should accurately identify main food items',
        status: 'pending'
      },
      {
        id: '2-3',
        name: 'Portion Estimation',
        description: 'Estimate portions when exact measurements unavailable',
        expectedBehavior: 'Should provide reasonable portion size estimates',
        status: 'pending'
      }
    ]
  },
  {
    id: '3',
    name: 'Supplement Timing',
    scenario: 'supplement_timing',
    testCases: [
      {
        id: '3-1',
        name: 'Pre-Workout Timing',
        description: 'Set reminders for pre-workout supplements',
        expectedBehavior: 'Should remind 30-45 minutes before workout',
        status: 'pending'
      },
      {
        id: '3-2',
        name: 'Post-Workout Window',
        description: 'Track post-workout supplement timing',
        expectedBehavior: 'Should remind within 30 minutes post-workout',
        status: 'pending'
      },
      {
        id: '3-3',
        name: 'Daily Supplement Schedule',
        description: 'Manage daily supplement routine',
        expectedBehavior: 'Should track all daily supplements with timing',
        status: 'pending'
      }
    ]
  },
  {
    id: '4',
    name: 'Hydration Tracking',
    scenario: 'hydration',
    testCases: [
      {
        id: '4-1',
        name: 'Water Intake Logging',
        description: 'Quick water intake logging during workouts',
        expectedBehavior: 'Should allow quick entry with preset amounts',
        status: 'pending'
      },
      {
        id: '4-2',
        name: 'Hydration Reminders',
        description: 'Set up hydration reminders throughout day',
        expectedBehavior: 'Should remind every 1-2 hours based on activity',
        status: 'pending'
      },
      {
        id: '4-3',
        name: 'Electrolyte Tracking',
        description: 'Track electrolyte intake during intense training',
        expectedBehavior: 'Should track sodium, potassium, and magnesium',
        status: 'pending'
      }
    ]
  }
];

export const [WellnessProvider, useWellnessStore] = createContextHook(() => {
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [stressData, setStressData] = useState<StressData[]>([]);
  const [recoveryMetrics, setRecoveryMetrics] = useState<RecoveryMetrics[]>([]);
  const [hormoneData, setHormoneData] = useState<HormoneTracking[]>([]);
  const [supplementInteractions, setSupplementInteractions] = useState<SupplementInteraction[]>([]);
  const [wellnessGoals, setWellnessGoals] = useState<WellnessGoals>({
    sleepHours: 8,
    stressLevel: 2,
    recoveryScore: 8,
    hydration: 3000,
    steps: 10000,
    meditation: 10
  });
  const [gymTestingScenarios, setGymTestingScenarios] = useState<GymTestingScenario[]>(initialGymTestingScenarios);
  const [nutritionTestScenarios, setNutritionTestScenarios] = useState<NutritionTestScenario[]>(initialNutritionTestScenarios);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem('wellness-data');
        if (stored) {
          const data = JSON.parse(stored);
          setSleepData(data.sleepData || []);
          setStressData(data.stressData || []);
          setRecoveryMetrics(data.recoveryMetrics || []);
          setHormoneData(data.hormoneData || []);
          setWellnessGoals(data.wellnessGoals || wellnessGoals);
        }
      } catch (error) {
        console.error('Error loading wellness data:', error);
      }
    };
    loadData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const data = {
          sleepData,
          stressData,
          recoveryMetrics,
          hormoneData,
          wellnessGoals
        };
        await AsyncStorage.setItem('wellness-data', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving wellness data:', error);
      }
    };
    saveData();
  }, [sleepData, stressData, recoveryMetrics, hormoneData, wellnessGoals]);

  const addSleepData = (data: Omit<SleepData, 'id'>) => {
    setSleepData(prev => [...prev, { ...data, id: Date.now().toString() }]);
  };

  const addStressData = (data: Omit<StressData, 'id'>) => {
    setStressData(prev => [...prev, { ...data, id: Date.now().toString() }]);
  };

  const addRecoveryMetrics = (data: Omit<RecoveryMetrics, 'id'>) => {
    setRecoveryMetrics(prev => [...prev, { ...data, id: Date.now().toString() }]);
  };

  const addHormoneData = (data: Omit<HormoneTracking, 'id'>) => {
    setHormoneData(prev => [...prev, { ...data, id: Date.now().toString() }]);
  };

  const updateWellnessGoals = (goals: Partial<WellnessGoals>) => {
    setWellnessGoals(prev => ({ ...prev, ...goals }));
  };

  const runGymTest = (scenarioId: string, testCaseId: string, result: 'passed' | 'failed', notes?: string) => {
    setGymTestingScenarios(prev => prev.map(scenario => 
      scenario.id === scenarioId 
        ? {
            ...scenario,
            testCases: scenario.testCases.map(testCase =>
              testCase.id === testCaseId
                ? { ...testCase, status: result, actualBehavior: notes }
                : testCase
            )
          }
        : scenario
    ));
  };

  const runNutritionTest = (scenarioId: string, testCaseId: string, result: 'passed' | 'failed', notes?: string) => {
    setNutritionTestScenarios(prev => prev.map(scenario => 
      scenario.id === scenarioId 
        ? {
            ...scenario,
            testCases: scenario.testCases.map(testCase =>
              testCase.id === testCaseId
                ? { ...testCase, status: result, actualBehavior: notes }
                : testCase
            )
          }
        : scenario
    ));
  };

  return {
    sleepData,
    stressData,
    recoveryMetrics,
    hormoneData,
    supplementInteractions,
    wellnessGoals,
    gymTestingScenarios,
    nutritionTestScenarios,
    addSleepData,
    addStressData,
    addRecoveryMetrics,
    addHormoneData,
    updateWellnessGoals,
    runGymTest,
    runNutritionTest
  };
});