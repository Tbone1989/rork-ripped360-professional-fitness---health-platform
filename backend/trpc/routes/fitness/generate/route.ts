import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const getMockWorkout = (inputDuration: number) => {
  return {
    id: 'workout-1',
    name: 'Upper Body Strength',
    duration: inputDuration,
    exercises: [
      {
        name: 'Push-ups',
        sets: 3,
        reps: 12,
        rest: 60,
      },
      {
        name: 'Pull-ups',
        sets: 3,
        reps: 8,
        rest: 90,
      },
      {
        name: 'Dumbbell Rows',
        sets: 3,
        reps: 10,
        rest: 75,
      },
    ],
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
    
    const workout = getMockWorkout(input.duration);
    console.log(`✅ Generated workout: ${workout.name}`);
    
    return workout;
  });