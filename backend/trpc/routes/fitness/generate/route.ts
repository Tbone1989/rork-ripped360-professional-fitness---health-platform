import { z } from "zod";
import { publicProcedure } from "../../../create-context";

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

export default publicProcedure
  .input(z.object({
    type: z.string(),
    muscle: z.array(z.string()),
    difficulty: z.string(),
    duration: z.number()
  }))
  .mutation(async ({ input }) => {
    console.log(`🏋️ Generating workout - type: ${input.type}, muscles: ${input.muscle.join(', ')}, difficulty: ${input.difficulty}, duration: ${input.duration}min`);
    
    const workout = getMockWorkout(input);
    console.log(`✅ Generated workout: ${workout.name} with ${workout.exercises.length} exercises`);
    
    return workout;
  });