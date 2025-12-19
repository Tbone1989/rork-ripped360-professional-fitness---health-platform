import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const API_KEYS = {
  RIP360_NINJA: process.env.EXPO_PUBLIC_RIP360_NINJA_API_KEY || '',
  API_NINJAS: process.env.EXPO_PUBLIC_API_NINJAS_KEY || '',
};

const API_ENDPOINTS = {
  RIP360_NINJA: process.env.EXPO_PUBLIC_NINJA_API_URL || 'https://api.rip360.com/fitness',
  API_NINJAS: 'https://api.api-ninjas.com/v1',
};

const makeApiRequest = async (url: string, headers: Record<string, string>, method: string = 'GET', body?: string): Promise<any> => {
  console.log(`🌐 Making ${method} API request to: ${url}`);
  console.log(`🔑 Headers:`, Object.keys(headers));
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Rip360-Mobile-App/1.0',
      ...headers,
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ API Success: Received data`);
  return data;
};

const generateWithRip360 = async (input: { type: string; muscle: string[]; difficulty: string; duration: number }) => {
  if (!API_KEYS.RIP360_NINJA) throw new Error('RIP360_NINJA API key not found');
  
  const url = `${API_ENDPOINTS.RIP360_NINJA}/workout/generate`;
  const data = await makeApiRequest(url, {
    'X-API-Key': API_KEYS.RIP360_NINJA,
  }, 'POST', JSON.stringify(input));
  
  return data;
};

const generateWithApiNinjas = async (input: { type: string; muscle: string[]; difficulty: string; duration: number }) => {
  if (!API_KEYS.API_NINJAS) throw new Error('API Ninjas key not found');
  
  // API Ninjas doesn't have workout generation, so we'll use their exercises endpoint
  // and create a workout from the exercises
  const exercises = [];
  
  for (const muscle of input.muscle.slice(0, 3)) { // Limit to 3 muscle groups
    try {
      const url = `${API_ENDPOINTS.API_NINJAS}/exercises?muscle=${encodeURIComponent(muscle)}&type=${encodeURIComponent(input.type)}`;
      const muscleExercises = await makeApiRequest(url, {
        'X-Api-Key': API_KEYS.API_NINJAS,
      });
      
      if (Array.isArray(muscleExercises) && muscleExercises.length > 0) {
        // Take 2-3 exercises per muscle group
        const selectedExercises = muscleExercises.slice(0, 3).map((exercise: any) => ({
          name: exercise.name,
          sets: input.difficulty === 'beginner' ? 3 : input.difficulty === 'advanced' ? 5 : 4,
          reps: input.type === 'strength' ? '4-6' : input.type === 'hypertrophy' ? '8-12' : '12-15',
          rest: input.type === 'strength' ? 180 : input.type === 'hypertrophy' ? 90 : 60,
          muscle: exercise.muscle,
          instructions: exercise.instructions?.split('. ') || [],
        }));
        
        exercises.push(...selectedExercises);
      }
    } catch (error) {
      console.warn(`Failed to get exercises for ${muscle}:`, error);
    }
  }
  
  if (exercises.length === 0) {
    throw new Error('No exercises found');
  }
  
  return {
    id: `workout-${Date.now()}`,
    name: `${input.type.charAt(0).toUpperCase() + input.type.slice(1)} Workout`,
    duration: input.duration,
    exercises: exercises.slice(0, Math.min(10, exercises.length)), // Limit to 10 exercises
    success: true,
    timestamp: new Date().toISOString()
  };
};

const getMockWorkout = (input: { type: string; muscle: string[]; difficulty: string; duration: number }) => {
  const exercisesByType = {
    strength: [
      { name: 'Barbell Bench Press', sets: 4, reps: '4-6', rest: 180, muscle: 'chest' },
      { name: 'Deadlifts', sets: 4, reps: '3-5', rest: 180, muscle: 'back' },
      { name: 'Squats', sets: 4, reps: '5-8', rest: 120, muscle: 'legs' },
      { name: 'Pull-ups', sets: 3, reps: '6-10', rest: 90, muscle: 'back' },
      { name: 'Overhead Press', sets: 3, reps: '6-8', rest: 90, muscle: 'shoulders' },
      { name: 'Barbell Rows', sets: 3, reps: '6-8', rest: 90, muscle: 'back' },
      { name: 'Dips', sets: 3, reps: '8-12', rest: 75, muscle: 'triceps' },
      { name: 'Close-Grip Bench Press', sets: 3, reps: '6-8', rest: 90, muscle: 'triceps' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '8-10', rest: 90, muscle: 'hamstrings' },
      { name: 'Weighted Chin-ups', sets: 3, reps: '5-8', rest: 120, muscle: 'biceps' },
      { name: 'Front Squats', sets: 3, reps: '6-8', rest: 120, muscle: 'legs' },
      { name: 'Incline Barbell Press', sets: 3, reps: '6-8', rest: 90, muscle: 'chest' },
    ],
    hypertrophy: [
      { name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', rest: 90, muscle: 'chest' },
      { name: 'Lat Pulldowns', sets: 4, reps: '10-15', rest: 75, muscle: 'back' },
      { name: 'Leg Press', sets: 4, reps: '12-20', rest: 90, muscle: 'legs' },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-15', rest: 75, muscle: 'shoulders' },
      { name: 'Cable Rows', sets: 3, reps: '10-15', rest: 75, muscle: 'back' },
      { name: 'Leg Curls', sets: 3, reps: '12-20', rest: 60, muscle: 'hamstrings' },
      { name: 'Bicep Curls', sets: 3, reps: '10-15', rest: 60, muscle: 'biceps' },
      { name: 'Tricep Extensions', sets: 3, reps: '10-15', rest: 60, muscle: 'triceps' },
      { name: 'Lateral Raises', sets: 3, reps: '12-20', rest: 60, muscle: 'shoulders' },
      { name: 'Leg Extensions', sets: 3, reps: '12-20', rest: 60, muscle: 'quadriceps' },
      { name: 'Chest Flyes', sets: 3, reps: '10-15', rest: 75, muscle: 'chest' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', rest: 60, muscle: 'rear-delts' },
    ],
    endurance: [
      { name: 'Burpees', sets: 3, reps: '15-25', rest: 45, muscle: 'full-body' },
      { name: 'Mountain Climbers', sets: 3, reps: '20-30', rest: 30, muscle: 'core' },
      { name: 'Jump Squats', sets: 3, reps: '20-30', rest: 45, muscle: 'legs' },
      { name: 'Push-ups', sets: 3, reps: '15-25', rest: 30, muscle: 'chest' },
      { name: 'High Knees', sets: 3, reps: '30-45', rest: 30, muscle: 'cardio' },
      { name: 'Plank', sets: 3, reps: '45-90s', rest: 45, muscle: 'core' },
      { name: 'Jumping Jacks', sets: 3, reps: '25-40', rest: 30, muscle: 'cardio' },
      { name: 'Lunges', sets: 3, reps: '20-30', rest: 45, muscle: 'legs' },
      { name: 'Russian Twists', sets: 3, reps: '30-50', rest: 30, muscle: 'core' },
      { name: 'Bear Crawls', sets: 3, reps: '15-25', rest: 45, muscle: 'full-body' },
    ],
    'fat-loss': [
      { name: 'HIIT Sprints', sets: 5, reps: '30s', rest: 60, muscle: 'cardio' },
      { name: 'Kettlebell Swings', sets: 4, reps: '20-30', rest: 45, muscle: 'full-body' },
      { name: 'Battle Ropes', sets: 4, reps: '30s', rest: 60, muscle: 'full-body' },
      { name: 'Box Jumps', sets: 3, reps: '15-20', rest: 60, muscle: 'legs' },
      { name: 'Thrusters', sets: 3, reps: '12-20', rest: 45, muscle: 'full-body' },
      { name: 'Rowing Machine', sets: 4, reps: '250m', rest: 90, muscle: 'cardio' },
      { name: 'Bike Sprints', sets: 5, reps: '20s', rest: 40, muscle: 'cardio' },
      { name: 'Burpee Box Jumps', sets: 3, reps: '10-15', rest: 60, muscle: 'full-body' },
      { name: 'Turkish Get-ups', sets: 3, reps: '5-8', rest: 75, muscle: 'full-body' },
      { name: 'Medicine Ball Slams', sets: 4, reps: '15-25', rest: 45, muscle: 'full-body' },
    ],
    yoga: [
      { name: 'Downward Dog', sets: 3, reps: '45-60s', rest: 30, muscle: 'full-body' },
      { name: 'Warrior I', sets: 2, reps: '30-45s each side', rest: 30, muscle: 'legs' },
      { name: 'Warrior II', sets: 2, reps: '30-45s each side', rest: 30, muscle: 'legs' },
      { name: 'Tree Pose', sets: 2, reps: '30-60s each side', rest: 30, muscle: 'balance' },
      { name: 'Cat-Cow Stretch', sets: 3, reps: '8-12 cycles', rest: 30, muscle: 'spine' },
      { name: 'Cobra Pose', sets: 3, reps: '30-45s', rest: 30, muscle: 'back' },
      { name: 'Child\'s Pose', sets: 3, reps: '60-90s', rest: 0, muscle: 'relaxation' },
      { name: 'Seated Forward Fold', sets: 2, reps: '45-60s', rest: 30, muscle: 'hamstrings' },
      { name: 'Bridge Pose', sets: 3, reps: '30-45s', rest: 30, muscle: 'glutes' },
      { name: 'Pigeon Pose', sets: 2, reps: '60-90s each side', rest: 30, muscle: 'hips' },
    ],
    general: [
      { name: 'Push-ups', sets: 3, reps: '10-15', rest: 60, muscle: 'chest' },
      { name: 'Squats', sets: 3, reps: '12-20', rest: 60, muscle: 'legs' },
      { name: 'Plank', sets: 3, reps: '30-60s', rest: 60, muscle: 'core' },
      { name: 'Lunges', sets: 3, reps: '10-15', rest: 60, muscle: 'legs' },
      { name: 'Glute Bridges', sets: 3, reps: '12-20', rest: 45, muscle: 'glutes' },
      { name: 'Wall Sit', sets: 3, reps: '30-60s', rest: 60, muscle: 'legs' },
      { name: 'Calf Raises', sets: 3, reps: '15-25', rest: 45, muscle: 'calves' },
      { name: 'Side Plank', sets: 2, reps: '20-45s', rest: 45, muscle: 'core' },
      { name: 'Pike Push-ups', sets: 3, reps: '8-15', rest: 60, muscle: 'shoulders' },
      { name: 'Dead Bug', sets: 3, reps: '10-15', rest: 45, muscle: 'core' },
    ],
  };

  const exercises = exercisesByType[input.type as keyof typeof exercisesByType] || exercisesByType.general;
  
  // Always aim for 8-10 exercises for maximum growth
  const minExercises = 8;
  const maxExercises = 10;
  const exerciseCount = Math.min(
    Math.max(minExercises, Math.floor(input.duration / 6)), // More exercises for longer workouts
    Math.min(maxExercises, exercises.length)
  );
  
  // Shuffle and select exercises, ensuring variety
  const selectedExercises = exercises
    .sort(() => Math.random() - 0.5)
    .slice(0, exerciseCount)
    .map(exercise => ({
      ...exercise,
      // Adjust sets/reps based on difficulty
      sets: input.difficulty === 'beginner' ? Math.max(2, exercise.sets - 1) : 
             input.difficulty === 'advanced' ? exercise.sets + 1 : exercise.sets,
      rest: input.difficulty === 'beginner' ? exercise.rest + 15 : 
             input.difficulty === 'advanced' ? exercise.rest - 15 : exercise.rest
    }));

  return {
    id: `workout-${Date.now()}`,
    name: `${input.type.charAt(0).toUpperCase() + input.type.slice(1)} Workout`,
    duration: input.duration,
    exercises: selectedExercises,
  };
};

export const generateWorkoutRoute = publicProcedure
  .input(z.object({
    type: z.string(),
    muscle: z.array(z.string()),
    difficulty: z.string(),
    duration: z.number(),
    equipment: z.array(z.string()).optional()
  }))
  .mutation(async ({ input }) => {
    try {
      console.log(`🏋️ Generating workout - type: ${input.type}, muscles: ${input.muscle.join(', ')}, difficulty: ${input.difficulty}, duration: ${input.duration}min, equipment: ${input.equipment?.join(', ') || 'none specified'}`);
      
      // Validate input
      if (!input.type || !input.difficulty || !input.duration) {
        console.warn('⚠️ Missing required parameters, using defaults');
      }
      
      const forceMockData = !API_KEYS.RIP360_NINJA && !API_KEYS.API_NINJAS;

      if (!forceMockData) {
        // Try APIs in order of preference
        const apiAttempts = [
          { name: 'RIP360', fn: () => generateWithRip360(input) },
          { name: 'API Ninjas', fn: () => generateWithApiNinjas(input) },
        ];
        
        for (const api of apiAttempts) {
          try {
            console.log(`🔄 Trying ${api.name} API...`);
            const result = await api.fn();
            if (result && result.exercises && result.exercises.length > 0) {
              console.log(`✅ ${api.name} API success: Generated workout with ${result.exercises.length} exercises`);
              return {
                id: result.id || `workout-${Date.now()}`,
                name: result.name || `${input.type} Workout`,
                duration: result.duration || input.duration,
                exercises: result.exercises,
                success: true,
                timestamp: new Date().toISOString(),
                source: api.name
              };
            }
          } catch (error) {
            console.warn(`⚠️ ${api.name} API failed:`, error instanceof Error ? error.message : 'Unknown error');
            continue;
          }
        }
      }
      
      // Fallback to mock data
      console.log(forceMockData ? '🔄 Using mock data (no API keys configured)' : '🔄 All APIs failed, using mock data');
      const workout = getMockWorkout(input);
      console.log(`✅ Mock data: Generated workout with ${workout.exercises.length} exercises`);
      
      return {
        id: workout.id,
        name: workout.name,
        duration: workout.duration,
        exercises: workout.exercises,
        success: true,
        timestamp: new Date().toISOString(),
        source: forceMockData ? 'Mock (No Keys)' : 'Mock (Fallback)'
      };
    } catch (error) {
      console.error('❌ Error generating workout:', error);
      
      // As a last resort, return a basic workout - ensure we never throw
      try {
        const basicWorkout = getMockWorkout({
          type: input.type || 'general',
          muscle: input.muscle || ['general'],
          difficulty: input.difficulty || 'intermediate',
          duration: input.duration || 45
        });
        
        return {
          id: basicWorkout.id,
          name: basicWorkout.name,
          duration: basicWorkout.duration,
          exercises: basicWorkout.exercises,
          success: false,
          timestamp: new Date().toISOString(),
          source: 'Emergency Fallback',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      } catch (fallbackError) {
        // Absolute last resort - hardcoded workout
        console.error('❌ Even fallback failed:', fallbackError);
        return {
          id: `emergency-${Date.now()}`,
          name: 'Basic Workout',
          duration: 30,
          exercises: [
            { name: 'Push-ups', sets: 3, reps: '10-15', rest: 60, muscle: 'chest' },
            { name: 'Squats', sets: 3, reps: '12-20', rest: 60, muscle: 'legs' },
            { name: 'Plank', sets: 3, reps: '30-60s', rest: 60, muscle: 'core' },
            { name: 'Lunges', sets: 3, reps: '10-15', rest: 60, muscle: 'legs' },
            { name: 'Glute Bridges', sets: 3, reps: '12-20', rest: 45, muscle: 'glutes' }
          ],
          success: false,
          timestamp: new Date().toISOString(),
          source: 'Hardcoded Emergency',
          error: 'All generation methods failed'
        };
      }
    }
  });