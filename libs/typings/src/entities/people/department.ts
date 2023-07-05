import { UserContext } from './user-context';
import { WorkerEmployment } from './worker-employment';

export interface Department {
  id: number;
  departmentId: string;
  name: string;
  workerEmployments: WorkerEmployment[];
  createdBy: UserContext;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: UserContext;
  createdById: string;
  updatedById: string;
}

export enum DepartmentAction {
  CREATE_NEW_DEPARTMENT = 'CREATE_NEW_DEPARTMENT',
}
export type DepartmentFilter = keyof Department;
export type DepartmentSortBy = keyof Department;
