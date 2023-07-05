import { FileManagement } from './file-management';

export interface WorkerAddendumFiles {
  id: number;
  uploadBatchId: number;
  workerEmploymentId: string;
  fileManagementId: number;
  fileManagement: FileManagement;
}
