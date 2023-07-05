import { Session } from 'next-auth';
import { Role } from '@entities';

export interface UserContext {
  userContextId: string;
  role: Role;
}

export interface SelectedUserContext extends UserContext {
  contextCompanyId?: string;
  contextCompanyName?: string;
  contextEmploymentId?: string;
}

export interface UserPayload {
  email: string;
  cognitoId: string;
  firstName: string;
  lastName: string;
  userContexts: UserContext[];
  selectedUserContext: SelectedUserContext;
}

export type UserSession = Nullable<Session & { user: UserPayload }>;
