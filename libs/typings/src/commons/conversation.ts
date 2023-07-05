import { UserSession } from './auth';
import { Comment } from './comment';

export interface Conversation {
  id: number;
  conversationId: string;
  comments: Comment[];
}

export interface CreateConversationRequest {
  content: string;
  contextId: string;
  contextType: string;
}

export interface CommonConversationApi {
  create: (
    session: UserSession,
    body: CreateConversationRequest
  ) => Promise<{ conversation: Pick<Conversation, 'conversationId'> }>;
  reply: (
    session: UserSession,
    conversationId: string,
    body: { content: string }
  ) => Promise<{ comments: Pick<Comment, 'commentId'> }>;
  lookup: (
    session: UserSession,
    conversationId: string
  ) => Promise<{ conversation: Conversation }>;
}
