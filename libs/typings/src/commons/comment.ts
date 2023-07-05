import { User } from '@entities';

export enum CommentType {
  COMMENT = 'COMMENT',
  FILE_ADDED = 'FILE_ADDED',
}

export interface Comment {
  id: number;
  commentId: string;
  content: string;
  createdAt: Date;
  createdBy: Pick<User, 'cognitoId' | 'firstName' | 'lastName'>;
  type: CommentType;
}
