import { CountryCode, UserSession } from '@commons';
import { HireType } from '@entities';

export enum FileManagementContextType {
  COMPANY = 'COMPANY',
  COMPANY_PAYROLL_FILE = 'COMPANY_PAYROLL_FILE',
  S3_PATH = 'S3_PATH',
  WORKER_ADDENDUM = 'WORKER_ADDENDUM',
  WORKER_EMPLOYMENT = 'WORKER_EMPLOYMENT',
  WORKER_EMPLOYMENT_CSV = 'WORKER_EMPLOYMENT_CSV',
}

export type FileManagementContext =
  | CompanyContext
  | CompanyPayrollFileContext
  | S3PathContext
  | WorkerEmploymentCsvContext
  | WorkerEmploymentContext;

interface Context {
  type: FileManagementContextType;
}

type S3PathContext = Context;

interface CompanyContext extends Context {
  hireType: HireType;
  companyId: string;
  countryCode: CountryCode;
}

interface CompanyPayrollFileContext extends Context {
  companyPayrollId: string;
  originalFileName: string;
}

interface WorkerEmploymentCsvContext extends Context {
  hireType: HireType;
  companyId: string;
  originalFileName: string;
}

interface WorkerEmploymentContext extends Context {
  workerEmploymentId: string;
}

export interface FileManagementBody {
  key: string;
  context: FileManagementContext;
}

export interface FileManagementUploadResponse {
  key: string;
  presignedUrl: string;
  headers: Record<string, string>;
}

export interface CommonFileManagementApi {
  upload: (
    session: UserSession,
    body: FileManagementBody
  ) => Promise<FileManagementUploadResponse>;
}
