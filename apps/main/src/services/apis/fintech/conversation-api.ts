import {
  Comment,
  Conversation,
  CreateConversationRequest,
  UserSession,
} from '@ayp/typings/commons';

import { BaseApi } from '@utils';

const resourceModel = 'fintech/v1/conversation';

export const ConversationApi = {
  create: async (session: UserSession, body: CreateConversationRequest) =>
    BaseApi.post<{ conversation: Pick<Conversation, 'conversationId'> }>({
      path: `/${resourceModel}`,
      body,
      session,
    }),
  reply: async (
    session: UserSession,
    conversationId: string,
    body: { content: string }
  ) =>
    BaseApi.post<{ comments: Pick<Comment, 'commentId'> }>({
      path: `/${resourceModel}/${conversationId}`,
      body,
      session,
    }),
  lookup: async (session: UserSession, conversationId: string) =>
    BaseApi.get<{ conversation: Conversation }>({
      path: `/${resourceModel}/${conversationId}`,
      session,
    }),
};
