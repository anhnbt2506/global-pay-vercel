import { HireType } from '../entities';

export interface WorkerEmploymentPostCsvBody {
  key: string;
  hireType: HireType;
  companyId: string;
  originalFileName: string;
}

export interface WorkerEmploymentCsvRow {
  row: number;
  values: Record<string, unknown>;
}

export interface WorkerEmploymentUploadCsvBody {
  hireType: HireType;
  data: WorkerEmploymentCsvRow[];
}

export interface WorkerEmploymentValidateCsvError {
  row: number;
  messages: Record<string, string[]>;
}
