export enum PermitType {
  NA = 'NA',
  EMPLOYMENT_PASS = 'EMPLOYMENT_PASS',
  GENERAL_EMPLOYMENT_POLICY = 'GENERAL_EMPLOYMENT_POLICY',
  '9G_VISA' = '9G_VISA',
  ALIEN_EMPLOYMENT_PERMIT = 'ALIEN_EMPLOYMENT_PERMIT',
  DN_VISA = 'DN_VISA',
  NON_IMMIGRANT_VISA_B = 'NON_IMMIGRANT_VISA_B',
  C_312 = 'C_312',
}

export interface WorkerIdentity {
  id: number;
  isWorkPermitActive: boolean;
  workerEmploymentId: number;
  permitId: Nullable<string>;
  permitIdFile: Nullable<string>;
  permitIssuedDate: Nullable<Date>;
  permitExpiryDate: Nullable<Date>;
  permitIssuedPlace: Nullable<string>;
  nationalId: Nullable<string>;
  nationalIdFile: Nullable<string>;
  nationalIdIssuedDate: Nullable<Date>;
  passportNumber: Nullable<string>;
  passportFile: Nullable<string>;
  taxId: Nullable<string>;
  permitType: PermitType;
  nationalIdIssuedPlace: Nullable<string>;
  nationalIdIssuedPlaceAlternate: Nullable<string>;
  passportIssuedDate: Nullable<Date>;
  passportIssuedPlace: Nullable<string>;
  passportIssuedPlaceAlternate: Nullable<string>;
  permitIssuedPlaceAlternate: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;
}
