import type { CalendarUnit } from '@commons';
import {
  Address,
  Agreement,
  Company,
  Country,
  WorkerContact,
  WorkerHongKong,
  WorkerIdentity,
  WorkerIndonesia,
  WorkerMalaysia,
  WorkerPhilippines,
  WorkerSingapore,
  WorkerThaiLand,
  WorkerVietNam,
  WorkerRemuneration,
  WorkerUser,
  WorkerSchedule,
  WorkerAddendumFiles,
} from '@entities';

export enum ContractType {
  FIXED = 'FIXED',
  INDEFINITE = 'INDEFINITE',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
}

export enum HireType {
  EOR = 'EOR',
  PEO = 'PEO',
  POM = 'POM',
  FREELANCER = 'FREELANCER',
}

export enum HireStatus {
  DRAFT = 'DRAFT',
  HIRING_REVIEW = 'HIRING_REVIEW',
  HIRING_UPDATE_REQUIRED = 'HIRING_UPDATE_REQUIRED',
  HIRING_REVIEW_PASSED = 'HIRING_REVIEW_PASSED',
  PERMIT_PROCESSING = 'PERMIT_PROCESSING',
  PERMIT_COMPLETED = 'PERMIT_COMPLETED',
  EMPLOYEE_INVITED = 'EMPLOYEE_INVITED',
  EMPLOYEE_DECLARATION = 'EMPLOYEE_DECLARATION',
  EMPLOYEE_REVIEW = 'EMPLOYEE_REVIEW',
  EMPLOYEE_UPDATE_REQUIRED = 'EMPLOYEE_UPDATE_REQUIRED',
  EMPLOYEE_REVIEW_PASSED = 'EMPLOYEE_REVIEW_PASSED',
  CONTRACT_ACCEPTANCE = 'CONTRACT_ACCEPTANCE',
  ONBOARDED = 'ONBOARDED',
  HIRING_STOPPED = 'HIRING_STOPPED',
  TERMINATED = 'TERMINATED',
}

export enum CitizenshipStatus {
  CITIZEN = 'CITIZEN',
  PERMANENT_RESIDENT = 'PERMANENT_RESIDENT',
  PERMIT_HOLDER = 'PERMIT_HOLDER',
}

export enum WorkplaceAddressType {
  COMPANY = 'COMPANY',
  EMPLOYEE = 'EMPLOYEE',
  OTHERS = 'OTHERS',
}

export enum WorkerType {
  HONGKONG = 'App\\Models\\Worker\\WorkerHongkong',
  INDONESIA = 'App\\Models\\Worker\\WorkerIndonesia',
  MALAYSIA = 'App\\Models\\Worker\\WorkerMalaysia',
  PHILIPPINES = 'App\\Models\\Worker\\WorkerPhilippines',
  SINGAPORE = 'App\\Models\\Worker\\WorkerSingapore',
  THAILAND = 'App\\Models\\Worker\\WorkerThailand',
  VIETNAM = 'App\\Models\\Worker\\WorkerVietnam',
}

export type WorkerCountry =
  | WorkerHongKong
  | WorkerIndonesia
  | WorkerMalaysia
  | WorkerPhilippines
  | WorkerSingapore
  | WorkerThaiLand
  | WorkerVietNam;

export interface WorkerEmployment {
  id: number;
  departmentId: string;
  employeeId: string;
  employmentId: string;
  companyId: string;
  workerUserId: number;
  workerTypeId: number;
  workerType: WorkerType;
  title: string;
  titleAlternate: string;
  description: string;
  managerName: string;
  managerTitle: string;
  managerEmail: string;
  contractType: ContractType;
  startDate: Date;
  endDate: Date;
  employmentType: EmploymentType;
  startAt: string;
  endAt: string;
  workingHoursPerWeek: number;
  workplaceAddressType: WorkplaceAddressType;
  workplaceAddressId: Nullable<number>;
  insuranceId: number;
  probationPeriod: number;
  probationStartDate: Date;
  probationEndDate: Date;
  hireType: HireType;
  status: HireStatus;
  hiringCountryCode: string;
  nationalityCode: string;
  citizenshipStatus: CitizenshipStatus;
  isPermitRequired: boolean;
  isAypAbleToContact: boolean;
  terminationNotice: number;
  terminationNoticeUnit: CalendarUnit;
  currency: string;
  hasSignedAgreement: boolean;
  createdAt: Date;
  updatedAt: Date;
  isHaveLegalEntity: boolean;
  isUseLegalEntity: boolean;

  // Relations
  company: Company;
  workerUser: WorkerUser;
  hiringCountry: Country;
  agreement: Agreement;
  workplaceAddress: Nullable<Address>;
  workerIdentity: WorkerIdentity;
  workerContact: Nullable<WorkerContact>;
  additionalInfo: Nullable<WorkerCountry>;
  workerRemuneration: Nullable<WorkerRemuneration>;
  workerSchedule: Nullable<WorkerSchedule>;
  workerAddendumFiles: Nullable<WorkerAddendumFiles[]>;
}

export interface WorkerEmploymentCompany {
  userContextId: string;
  companyId: string;
  companyName: string;
  countryName: string;
  employmentId: string;
}

export type WorkerEmploymentFilter =
  | keyof WorkerEmployment
  | 'workerUser.user:fullName'
  | 'workerUser.user:email';

export type WorkerEmploymentSortBy = keyof WorkerEmployment;
