import { CompanyUser } from './company-user';
import { StaffUser } from './staff-user';
import { Role, User } from './user';
import { WorkerUser } from './worker-user';

export interface UserContext {
  userContextId: string;
  cognitoId: string;
  userId: number;
  userType: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  //relations
  user: User;
  info: CompanyUser | StaffUser | WorkerUser;
  role: Role;
}
