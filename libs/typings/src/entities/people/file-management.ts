import { UserContext } from './user-context';

export interface FileManagement {
  id: string;
  key: string;
  type: string;
  filePath?: string;
  createdAt?: Date;
  createdBy?: UserContext;
  lastModified: Date;
  lastModifiedBy?: {
    email: string;
    cognitoId: string;
    firstName: string;
    lastName: string;
  };
}

export type FileManagementSortBy = keyof FileManagement;
