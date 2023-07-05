import { HireType, Company } from '@entities';

export enum ServiceAgreementStatus {
  IN_REVIEW = 'IN_REVIEW',
  WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
  SIGNED = 'SIGNED',
}

export enum ServiceAgreementType {
  PEO = 'peo-service-agreement',
  FREELANCER = 'freelancer-service-agreement',
  POM = 'pom-service-agreement',
}

export interface ServiceAgreement {
  id: number;
  serviceAgreementId: string;
  companyId: string;
  conversationId: Nullable<string>;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: Nullable<ServiceAgreementStatus>;
  hireType: HireType;
  iterationCount: number;
  lastInReviewAt: Nullable<Date>;

  // Relations
  company: Company;
}

export type ServiceAgreementsFilter = keyof ServiceAgreement;

export type ServiceAgreementsSortBy = keyof ServiceAgreement;
