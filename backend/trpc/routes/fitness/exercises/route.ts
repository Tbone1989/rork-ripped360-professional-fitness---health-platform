import { z } from "zod";
import { publicProcedure } from "../../../create-context";

interface WorkoutData {
  id: string;
  name: string;
  type: string;
  muscle: string[];
  equipment: string;
  difficulty: string;
  instructions: string[];
}

const getMockExercises = (): WorkoutData[] => {
  return [
    {
      id: '1',
      name: 'Push-ups',
      type: 'strength',
      muscle: ['chest', 'shoulders', 'triceps'],
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: [
        'Start in a plank position with hands slightly wider than shoulders',
        'Lower your body until chest nearly touches the floor',
        'Push back up to starting position',
        'Repeat for desired reps'
      ],
    },
    {
      id: '2',
      name: 'Squats',
      type: 'strength',
      muscle: ['quadriceps', 'glutes', 'hamstrings'],
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep chest up and knees behind toes',
        'Return to starting position'
      ],
    },
    {
      id: '3',
      name: 'Deadlifts',
      type: 'strength',
      muscle: ['hamstrings', 'glutes', 'lower_back'],
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: [
        'Stand with feet hip-width apart, barbell over mid-foot',
        'Bend at hips and knees to grip the bar',
        'Keep chest up and back straight',
        'Drive through heels to lift the bar'
      ],
    },
    {
      id: '4',
      name: 'Pull-ups',
      type: 'strength',
      muscle: ['lats', 'biceps', 'rhomboids'],
      equipment: 'pull_up_bar',
      difficulty: 'intermediate',
      instructions: [
        'Hang from pull-up bar with palms facing away',
        'Pull your body up until chin clears the bar',
        'Lower yourself with control',
        'Repeat for desired reps'
      ],
    },
    {
      id: '5',
      name: 'Plank',
      type: 'strength',
      muscle: ['core', 'shoulders'],
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: [
        'Start in push-up position',
        'Lower to forearms, keeping body straight',
        'Hold position, engaging core',
        'Breathe normally throughout'
      ],
    },
  ];
};

export default publicProcedure
  .input(z.object({ 
    muscle: z.string().optional(),
    type: z.string().optional() 
  }))
  .query(async ({ input }) => {
    console.log(`🔍 Searching exercises - muscle: ${input.muscle}, type: ${input.type}`);
    
    let exercises = getMockExercises();
    
    // Filter by muscle if provided
    if (input.muscle) {
      exercises = exercises.filter(exercise => 
        exercise.muscle.some(m => m.toLowerCase().includes(input.muscle!.toLowerCase()))
      );
    }
    
    // Filter by type if provided
    if (input.type) {
      exercises = exercises.filter(exercise => 
        exercise.type.toLowerCase().includes(input.type!.toLowerCase())
      );
    }
    
    console.log(`✅ Found ${exercises.length} exercises`);
    return exercises;
  });