import { UserContext } from './user-context';

export interface StaffUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  userContext: UserContext;
}
