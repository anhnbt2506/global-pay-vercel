import { CompanyUser } from './company-user';
import { StaffUser } from './staff-user';
import { WorkerUser } from './worker-user';

export enum Role {
  '*' = '*',

  GP = 'gp:*',

  GP_STAFF = 'gp:staff:*',
  GP_STAFF_ADMIN = 'gp:staff:admin',
  GP_STAFF_AUDITOR = 'gp:staff:auditor',
  GP_STAFF_LEGAL = 'gp:staff:legal',
  GP_STAFF_MARKETING = 'gp:staff:marketing',

  GP_COMPANY = 'gp:company:*',
  GP_COMPANY_OWNER = 'gp:company:owner',

  GP_WORKER = 'gp:worker:*',
}

export enum UserType {
  STAFF = 'App\\Models\\StaffUser',
  WORKER = 'App\\Models\\WorkerUser',
  COMPANY = 'App\\Models\\CompanyUser',
}

export interface User {
  id: number;
  cognitoId: string;
  userId: number;
  userType: UserType;
  firstName: string;
  firstNameAlternate: string;
  lastNameAlternate: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  // Relations
  info: CompanyUser | StaffUser | WorkerUser;
}
