import type {} from 'next-auth';
import { SelectedUserContext, UserContext } from '@ayp/typings/commons';

declare module 'next-auth' {
  interface User {
    email: string;
    cognitoId: string;
    firstName: string;
    lastName: string;
    userContexts: UserContext[];
    selectedUserContext: SelectedUserContext;
  }

  interface Session {
    user: User;
    accessToken: string;
    refreshToken: string;
    authorization: string;
    contextCompanyId: string;
  }
}
