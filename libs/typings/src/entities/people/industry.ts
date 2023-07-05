import { UserContext } from './user-context';

export interface Industry {
  id: number;
  name: string;
  industryId: string;
  createdById: number;
  createdBy: UserContext;
  createdAt: Date;
  updatedById: number;
  updatedBy: UserContext;
  updatedAt: Date;
}

export type IndustryFilter = keyof Industry;

export type IndustrySortBy = keyof Industry;
