import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const mockMessages = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-1',
    receiverId: '1',
    content: 'Hi Sarah! I wanted to ask about my workout plan for next week.',
    timestamp: '2024-01-15T10:30:00Z',
    read: true,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: '1',
    receiverId: 'user-1',
    content: 'Hello! I\'d be happy to help. What specific questions do you have about your plan?',
    timestamp: '2024-01-15T10:35:00Z',
    read: true,
  },
];

const mockConversations = [
  {
    id: 'conv-1',
    participants: ['user-1', '1'],
    lastMessage: mockMessages[1],
    unreadCount: 0,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:35:00Z',
  },
];

export const listConversationsRoute = publicProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const userConversations = mockConversations.filter(conv =>
      conv.participants.includes(input.userId)
    );

    return {
      conversations: userConversations,
      total: userConversations.length,
    };
  });

export const getMessagesRoute = publicProcedure
  .input(
    z.object({
      conversationId: z.string(),
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
    })
  )
  .query(async ({ input }) => {
    const conversationMessages = mockMessages
      .filter(msg => msg.conversationId === input.conversationId)
      .slice(input.offset, input.offset + input.limit);

    return {
      messages: conversationMessages,
      total: conversationMessages.length,
    };
  });

export const sendMessageRoute = publicProcedure
  .input(
    z.object({
      conversationId: z.string(),
      receiverId: z.string(),
      content: z.string(),
      attachmentUrls: z.array(z.string()).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: input.conversationId,
      senderId: 'current-user',
      receiverId: input.receiverId,
      content: input.content,
      attachmentUrls: input.attachmentUrls,
      timestamp: new Date().toISOString(),
      read: false,
    };

    return {
      success: true,
      message: newMessage,
    };
  });

export default { listConversationsRoute, getMessagesRoute, sendMessageRoute };