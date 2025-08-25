import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const mockClientAttachments: Record<string, Array<{ id: string; title: string; url: string; createdAt: string; visibleToCoaches: boolean }>> = {
  'user-1': [
    { id: 'a1', title: 'Bloodwork Jan 2024', url: 'https://example.com/bloodwork-jan.pdf', createdAt: '2024-01-05', visibleToCoaches: true },
    { id: 'a2', title: 'MRI Knee 2023', url: 'https://example.com/mri-knee.pdf', createdAt: '2023-10-12', visibleToCoaches: false },
  ],
  'user-2': [
    { id: 'a3', title: 'Allergy Panel', url: 'https://example.com/allergy.pdf', createdAt: '2024-02-20', visibleToCoaches: true },
  ],
  'user-3': [],
  'user-4': [],
};

// Shared mock assignments for both coaches and medical staff
const mockProfessionalAssignments: Array<{ professionalUserId: string; clientIds: string[] }> = [
  { professionalUserId: 'user-1-coach', clientIds: ['user-1', 'user-3'] },
  { professionalUserId: 'user-2-coach', clientIds: ['user-2'] },
  { professionalUserId: '1', clientIds: ['user-1', 'user-3'] },
  { professionalUserId: '2', clientIds: ['user-1'] },
];

export const clientAttachmentsRoute = publicProcedure
  .input(
    z.object({
      viewerId: z.string(),
      viewerRole: z.enum(['user', 'coach', 'medical', 'admin']),
      clientId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { viewerId, viewerRole, clientId } = input;

    let canView = false;

    if (viewerRole === 'admin') {
      canView = true;
    } else if (viewerRole === 'coach' || viewerRole === 'medical') {
      const mapping = mockProfessionalAssignments.find((m) => m.professionalUserId === viewerId);
      canView = !!mapping?.clientIds.includes(clientId);
    } else if (viewerRole === 'user') {
      canView = viewerId === clientId;
    }

    if (!canView) {
      return { attachments: [], total: 0 };
    }

    const all = mockClientAttachments[clientId] ?? [];

    const attachments = viewerRole === 'admin' || viewerRole === 'user'
      ? all
      : all.filter((a) => a.visibleToCoaches);

    return { attachments, total: attachments.length };
  });

export default clientAttachmentsRoute;
