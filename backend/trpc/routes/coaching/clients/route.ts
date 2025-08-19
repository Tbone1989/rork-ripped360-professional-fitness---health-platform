import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const mockClients = [
  { id: 'user-1', name: 'Sarah Johnson', email: 'sarah.j@email.com', profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200', status: 'active' as const, joinDate: '2024-01-15', totalSessions: 24, plan: 'Premium Training', progress: 85, lastSession: '2024-01-20', nextSession: '2024-01-22T09:00:00Z' },
  { id: 'user-2', name: 'Mike Rodriguez', email: 'mike.r@email.com', profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', status: 'active' as const, joinDate: '2023-11-08', totalSessions: 45, plan: 'Strength & Conditioning', progress: 92, lastSession: '2024-01-19', nextSession: '2024-01-22T10:30:00Z' },
  { id: 'user-3', name: 'Emily Chen', email: 'emily.c@email.com', profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', status: 'trial' as const, joinDate: '2024-01-18', totalSessions: 3, plan: 'Trial Package', progress: 30, lastSession: '2024-01-19', nextSession: '2024-01-22T14:00:00Z' },
  { id: 'user-4', name: 'David Park', email: 'david.p@email.com', profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200', status: 'inactive' as const, joinDate: '2023-09-12', totalSessions: 18, plan: 'Basic Training', progress: 60, lastSession: '2024-01-10' },
];

const mockCoachAssignments: Array<{ coachUserId: string; clientIds: string[] }> = [
  { coachUserId: 'user-1-coach', clientIds: ['user-1', 'user-3'] },
  { coachUserId: 'user-2-coach', clientIds: ['user-2'] },
  { coachUserId: '1', clientIds: ['user-1', 'user-3'] },
  { coachUserId: '2', clientIds: ['user-1'] },
];

export const listClientsRoute = publicProcedure
  .input(
    z.object({
      viewerId: z.string(),
      viewerRole: z.enum(['user', 'coach', 'medical', 'admin']),
      coachUserId: z.string().optional(),
      status: z.enum(['all', 'active', 'inactive', 'trial']).optional().default('all'),
      search: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    const { viewerId, viewerRole, coachUserId, status, search } = input;

    let allowedClientIds: string[];

    if (viewerRole === 'admin') {
      allowedClientIds = mockClients.map((c) => c.id);
    } else if (viewerRole === 'coach') {
      const coachId = coachUserId ?? viewerId;
      const mapping = mockCoachAssignments.find((m) => m.coachUserId === coachId);
      allowedClientIds = mapping?.clientIds ?? [];
    } else if (viewerRole === 'user') {
      allowedClientIds = [viewerId];
    } else {
      allowedClientIds = [];
    }

    let clients = mockClients.filter((c) => allowedClientIds.includes(c.id));

    if (status && status !== 'all') {
      clients = clients.filter((c) => c.status === status);
    }

    if (search && search.trim().length > 0) {
      const q = search.toLowerCase();
      clients = clients.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }

    return { clients, total: clients.length };
  });

export default listClientsRoute;
