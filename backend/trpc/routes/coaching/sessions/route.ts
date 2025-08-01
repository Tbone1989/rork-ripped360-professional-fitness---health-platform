import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const mockSessions = [
  {
    id: 'session-1',
    coachId: '1',
    clientId: 'user-1',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '11:00',
    status: 'scheduled' as const,
    notes: 'Focus on upper body strength training',
    videoCallUrl: 'https://meet.google.com/abc-def-ghi',
    price: 85,
    paymentStatus: 'paid' as const,
  },
  {
    id: 'session-2',
    coachId: '2',
    clientId: 'user-1',
    date: '2024-01-18',
    startTime: '14:00',
    endTime: '15:00',
    status: 'completed' as const,
    notes: 'Great progress on deadlifts',
    price: 120,
    paymentStatus: 'paid' as const,
  },
];

export const listSessionsRoute = publicProcedure
  .input(
    z.object({
      clientId: z.string().optional(),
      coachId: z.string().optional(),
      status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
    })
  )
  .query(async ({ input }) => {
    let filteredSessions = [...mockSessions];

    if (input.clientId) {
      filteredSessions = filteredSessions.filter(session => 
        session.clientId === input.clientId
      );
    }

    if (input.coachId) {
      filteredSessions = filteredSessions.filter(session => 
        session.coachId === input.coachId
      );
    }

    if (input.status) {
      filteredSessions = filteredSessions.filter(session => 
        session.status === input.status
      );
    }

    return {
      sessions: filteredSessions,
      total: filteredSessions.length,
    };
  });

export const bookSessionRoute = publicProcedure
  .input(
    z.object({
      coachId: z.string(),
      date: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      notes: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const newSession = {
      id: `session-${Date.now()}`,
      clientId: 'current-user',
      ...input,
      status: 'scheduled' as const,
      price: 85,
      paymentStatus: 'pending' as const,
      videoCallUrl: `https://meet.google.com/${Math.random().toString(36).substring(7)}`,
    };

    return {
      success: true,
      session: newSession,
    };
  });

export default { listSessionsRoute, bookSessionRoute };