import { UserContext } from './user-context';

export interface CompanyUser {
  id: number;
  companyId: string;
  jobTitle: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  userContext: UserContext;
}
