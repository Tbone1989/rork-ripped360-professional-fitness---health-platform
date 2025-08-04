import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const getMockWorkout = (input: { type: string; muscle: string[]; difficulty: string; duration: number }) => {
  const exercisesByType = {
    strength: [
      { name: 'Barbell Bench Press', sets: 4, reps: 6, rest: 180 },
      { name: 'Deadlifts', sets: 4, reps: 5, rest: 180 },
      { name: 'Squats', sets: 4, reps: 8, rest: 120 },
      { name: 'Pull-ups', sets: 3, reps: 8, rest: 90 },
      { name: 'Overhead Press', sets: 3, reps: 8, rest: 90 },
      { name: 'Barbell Rows', sets: 3, reps: 10, rest: 90 },
      { name: 'Dips', sets: 3, reps: 10, rest: 75 },
      { name: 'Close-Grip Bench Press', sets: 3, reps: 8, rest: 90 },
    ],
    hypertrophy: [
      { name: 'Incline Dumbbell Press', sets: 4, reps: 10, rest: 90 },
      { name: 'Lat Pulldowns', sets: 4, reps: 12, rest: 75 },
      { name: 'Leg Press', sets: 4, reps: 15, rest: 90 },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: 12, rest: 75 },
      { name: 'Cable Rows', sets: 3, reps: 12, rest: 75 },
      { name: 'Leg Curls', sets: 3, reps: 15, rest: 60 },
      { name: 'Bicep Curls', sets: 3, reps: 12, rest: 60 },
      { name: 'Tricep Extensions', sets: 3, reps: 12, rest: 60 },
    ],
    endurance: [
      { name: 'Burpees', sets: 3, reps: 15, rest: 45 },
      { name: 'Mountain Climbers', sets: 3, reps: 20, rest: 30 },
      { name: 'Jump Squats', sets: 3, reps: 20, rest: 45 },
      { name: 'Push-ups', sets: 3, reps: 15, rest: 30 },
      { name: 'High Knees', sets: 3, reps: 30, rest: 30 },
      { name: 'Plank', sets: 3, reps: 60, rest: 45 },
      { name: 'Jumping Jacks', sets: 3, reps: 25, rest: 30 },
      { name: 'Lunges', sets: 3, reps: 20, rest: 45 },
    ],
    'fat-loss': [
      { name: 'HIIT Sprints', sets: 5, reps: 30, rest: 60 },
      { name: 'Kettlebell Swings', sets: 4, reps: 20, rest: 45 },
      { name: 'Battle Ropes', sets: 4, reps: 30, rest: 60 },
      { name: 'Box Jumps', sets: 3, reps: 15, rest: 60 },
      { name: 'Thrusters', sets: 3, reps: 12, rest: 45 },
      { name: 'Rowing Machine', sets: 4, reps: 250, rest: 90 },
      { name: 'Bike Sprints', sets: 5, reps: 20, rest: 40 },
      { name: 'Bear Crawls', sets: 3, reps: 15, rest: 45 },
    ],
    general: [
      { name: 'Push-ups', sets: 3, reps: 12, rest: 60 },
      { name: 'Squats', sets: 3, reps: 15, rest: 60 },
      { name: 'Plank', sets: 3, reps: 45, rest: 60 },
      { name: 'Lunges', sets: 3, reps: 12, rest: 60 },
      { name: 'Glute Bridges', sets: 3, reps: 15, rest: 45 },
      { name: 'Wall Sit', sets: 3, reps: 30, rest: 60 },
      { name: 'Calf Raises', sets: 3, reps: 20, rest: 45 },
      { name: 'Side Plank', sets: 2, reps: 30, rest: 45 },
    ],
  };

  const exercises = exercisesByType[input.type as keyof typeof exercisesByType] || exercisesByType.general;
  
  // Calculate number of exercises based on duration
  const exerciseCount = Math.min(
    Math.max(Math.floor(input.duration / 8), 4), // At least 4 exercises
    exercises.length
  );
  
  // Shuffle and select exercises
  const selectedExercises = exercises
    .sort(() => Math.random() - 0.5)
    .slice(0, exerciseCount);

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