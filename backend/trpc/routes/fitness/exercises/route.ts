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

const API_KEYS = {
  RIP360_FITNESS: process.env.EXPO_PUBLIC_RIP360_FITNESS_API_KEY ?? '',
  API_NINJAS: process.env.EXPO_PUBLIC_API_NINJAS_KEY ?? '',
};

const API_ENDPOINTS = {
  RIP360_FITNESS: process.env.EXPO_PUBLIC_FITNESS_API_URL ?? 'https://api.rip360.com/fitness',
  API_NINJAS: 'https://api.api-ninjas.com/v1',
};

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
  ];
};

const makeApiRequest = async (url: string, headers: Record<string, string>): Promise<any> => {
  console.log(`🌐 Making API request to: ${url}`);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Rip360-Mobile-App/1.0',
      ...headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ API Error: ${res.status} ${res.statusText}`, text);
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('✅ API Success for exercises');
  return data;
};

const fetchWithRip360 = async (muscle?: string, type?: string): Promise<WorkoutData[]> => {
  if (!API_KEYS.RIP360_FITNESS) throw new Error('RIP360_FITNESS API key not found');
  const params = new URLSearchParams();
  if (muscle) params.append('muscle', muscle);
  if (type) params.append('type', type ?? '');
  const url = `${API_ENDPOINTS.RIP360_FITNESS}/exercises?${params.toString()}`;
  const data = await makeApiRequest(url, { 'X-API-Key': API_KEYS.RIP360_FITNESS });
  const results: WorkoutData[] = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
  return results.map((e: any, idx: number) => ({
    id: String(e.id ?? idx),
    name: String(e.name ?? 'Exercise'),
    type: String(e.type ?? type ?? 'general'),
    muscle: Array.isArray(e.muscle) ? e.muscle.map((m: any) => String(m)) : (e.muscle ? [String(e.muscle)] : []),
    equipment: String(e.equipment ?? 'body_only'),
    difficulty: String(e.difficulty ?? 'intermediate'),
    instructions: Array.isArray(e.instructions) ? e.instructions.map((i: any) => String(i)) : (typeof e.instructions === 'string' ? String(e.instructions).split('. ').filter(Boolean) : []),
  }));
};

const fetchWithApiNinjas = async (muscle?: string, type?: string): Promise<WorkoutData[]> => {
  if (!API_KEYS.API_NINJAS) throw new Error('API Ninjas key not found');
  const params = new URLSearchParams();
  if (muscle) params.append('muscle', muscle);
  if (type) params.append('type', type);
  const url = `${API_ENDPOINTS.API_NINJAS}/exercises?${params.toString()}`;
  const data = await makeApiRequest(url, { 'X-Api-Key': API_KEYS.API_NINJAS });
  return (Array.isArray(data) ? data : []).map((e: any, idx: number) => ({
    id: String(e.id ?? idx),
    name: String(e.name ?? 'Exercise'),
    type: String(e.type ?? type ?? 'general'),
    muscle: Array.isArray(e.muscle) ? e.muscle.map((m: any) => String(m)) : (e.muscle ? [String(e.muscle)] : []),
    equipment: String(e.equipment ?? 'body_only'),
    difficulty: 'intermediate',
    instructions: typeof e.instructions === 'string' ? e.instructions.split('. ').filter(Boolean) : [],
  }));
};

export default publicProcedure
  .input(z.object({ 
    muscle: z.string().optional(),
    type: z.string().optional() 
  }))
  .query(async ({ input }) => {
    console.log(`🔍 Searching exercises - muscle: ${input.muscle}, type: ${input.type}`);

    const attempts = [
      { name: 'RIP360', fn: () => fetchWithRip360(input.muscle, input.type) },
      { name: 'API Ninjas', fn: () => fetchWithApiNinjas(input.muscle, input.type) },
    ];

    for (const api of attempts) {
      try {
        console.log(`🔄 Trying ${api.name} API...`);
        const results = await api.fn();
        if (results.length > 0) {
          console.log(`✅ ${api.name} success: Found ${results.length} exercises`);
          return results;
        }
      } catch (e) {
        console.warn(`⚠️ ${api.name} failed:`, e instanceof Error ? e.message : 'Unknown error');
        continue;
      }
    }

    let exercises = getMockExercises();
    if (input.muscle) {
      exercises = exercises.filter(exercise => 
        exercise.muscle.some(m => m.toLowerCase().includes(input.muscle!.toLowerCase()))
      );
    }
    if (input.type) {
      exercises = exercises.filter(exercise => 
        exercise.type.toLowerCase().includes(input.type!.toLowerCase())
      );
    }
    console.log(`✅ Mock fallback: Found ${exercises.length} exercises`);
    return exercises;
  });