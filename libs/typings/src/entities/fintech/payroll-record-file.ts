import { FileManagement } from '@entities';

export interface PayrollRecordFile {
  id: number;
  uploadBatchId: string;
  companyPayrollId: string;
  fileManagement: FileManagement;
}
