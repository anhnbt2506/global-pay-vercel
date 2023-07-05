import { WorkerType } from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';

export enum EmploymentDetailTabs {
  INFORMATION = 'information',
  DOCUMENTS = 'documents',
}

export const EMPLOYMENT_DETAIL_LABEL_TABS_PREFIX =
  'staff-audit-client-hires-employment-id:';

export const EMPLOYMENT_DETAIL_TAB_OPTIONS: Option<EmploymentDetailTabs>[] = [
  {
    id: EmploymentDetailTabs.INFORMATION,
    value: EmploymentDetailTabs.INFORMATION,
    label: `${EMPLOYMENT_DETAIL_LABEL_TABS_PREFIX}${EmploymentDetailTabs.INFORMATION}`,
  },
  {
    id: EmploymentDetailTabs.DOCUMENTS,
    label: `${EMPLOYMENT_DETAIL_LABEL_TABS_PREFIX}${EmploymentDetailTabs.DOCUMENTS}`,
  },
];

const LIST_COUNTRIES_HAVE_ADD_ON_INFORMATION = [
  WorkerType.HONGKONG,
  WorkerType.INDONESIA,
  WorkerType.PHILIPPINES,
  WorkerType.MALAYSIA,
  WorkerType.SINGAPORE,
  WorkerType.THAILAND,
  WorkerType.VIETNAM,
];

export const isCountryHasAddOnInformation = (workerType: WorkerType) =>
  LIST_COUNTRIES_HAVE_ADD_ON_INFORMATION.includes(workerType);

type InformationFields = {
  employmentDetails: Record<string, string>[];
  addOnEmploymentDetails: Record<string, Record<string, string>[]>;
  personalProfile: Record<string, string>[];
  identification: Record<string, string>[];
  emergencyContact: Record<string, string>[];
  bankDetails: Record<string, string>[];
};

export const INFORMATION_FIELDS: InformationFields = {
  employmentDetails: [
    {
      fieldName: 'hireType',
      labelKey: 'hireType',
    },
    {
      fieldName: 'title',
      labelKey: 'workerPosition',
    },
    {
      fieldName: 'titleAlternate',
      labelKey: 'workerTitleAlternate',
    },
    {
      fieldName: 'contractType',
      labelKey: 'workerContractType',
    },
    {
      fieldName: 'startDate',
      labelKey: 'workerContractStartDate',
    },
    {
      fieldName: 'endDate',
      labelKey: 'workerContractEndDate',
    },
    {
      fieldName: 'employmentType',
      labelKey: 'workerEmploymentType',
    },
    {
      fieldName: 'workingHoursPerWeek',
      labelKey: 'workerWorkingHoursPerWeek',
    },
    {
      fieldName: 'startAt',
      labelKey: 'workerStartEmploymentTime',
    },
    {
      fieldName: 'endAt',
      labelKey: 'workerEndEmploymentTime',
    },
    {
      fieldName: 'managerName',
      labelKey: 'workerReportingManagerName',
    },
    {
      fieldName: 'managerTitle',
      labelKey: 'workerReportingManagerTitle',
    },
    {
      fieldName: 'workerRemuneration.salaryPerMonth',
      labelKey: 'workerMonthlySalary',
    },
    {
      fieldName: 'workerRemuneration.isEligibleForInsurance',
      labelKey: 'workerEligibleForInsurance',
    },
    {
      fieldName: 'workerRemuneration.isEligibleForAdditionalIncome',
      labelKey: 'workerEligibleForAdditionalIncome',
    },
    {
      fieldName: 'workerRemuneration.isEligibleForPaidExpenses',
      labelKey: 'workerEligibleForPaidExpenses',
    },
    {
      fieldName: 'workerRemuneration.isEntitledToOvertime',
      labelKey: 'workerEligibleForOvertime',
    },
    {
      fieldName: 'workerRemuneration.isEligibleForVariablePay',
      labelKey: 'workerEligibleForVariablePay',
    },
    {
      fieldName: 'workerRemuneration.isEligibleForAnnualBonus',
      labelKey: 'workerEligibleForAnnualBonus',
    },
    {
      fieldName: 'workerRemuneration.isEligibleForCommission',
      labelKey: 'workerEligibleForCommission',
    },
  ],
  addOnEmploymentDetails: {
    hk: [
      { fieldName: 'probationPeriod', labelKey: 'workerProbationPeriod' },
      { fieldName: 'additionalInfo.mpfId', labelKey: 'workerMpfId' },
    ],
    my: [
      { fieldName: 'probationPeriod', labelKey: 'workerProbationPeriod' },
      { fieldName: 'additionalInfo.epfId', labelKey: 'workerEpfId' },
    ],
    id: [
      { fieldName: 'probationPeriod', labelKey: 'workerProbationPeriod' },
      {
        fieldName: 'additionalInfo.religiousFestivityAllowance',
        labelKey: 'workerReligiousFestivityAllowance',
      },
    ],
    ph: [
      { fieldName: 'probationPeriod', labelKey: 'workerProbationPeriod' },
      {
        fieldName: 'additionalInfo.fieldManagerialType',
        labelKey: 'workerFieldManagerialType',
      },
      {
        fieldName: 'workerRemuneration.monthlyAllowance',
        labelKey: 'workerMonthlyAllowance',
      },
      { fieldName: 'additionalInfo.sssId', labelKey: 'workerSssId' },
      { fieldName: 'additionalInfo.tinId', labelKey: 'workerTinId' },
      {
        fieldName: 'additionalInfo.isEntitledToOvertimeDifferential',
        labelKey: 'workerEntitledToOvertimeNightDayDifferential',
      },
      { fieldName: 'additionalInfo.healthId', labelKey: 'workerPhilhealthId' },
      { fieldName: 'additionalInfo.hdmfId', labelKey: 'workerMidHdmfId' },
    ],
    sg: [{ fieldName: 'probationPeriod', labelKey: 'workerProbationPeriod' }],
    th: [{ fieldName: 'probationPeriod', labelKey: 'workerProbationPeriod' }],
    vn: [
      { fieldName: 'probationStartDate', labelKey: 'workerProbationStartDate' },
      { fieldName: 'probationEndDate', labelKey: 'workerProbationEndDate' },
      {
        fieldName: 'additionalInfo.socialInsuranceBookNo',
        labelKey: 'workerSocialInsuranceBookNo',
      },
      {
        fieldName: 'additionalInfo.localHospitalForStatutoryMedicalInsurance',
        labelKey: 'workerLocalHospitalForStatutoryMedicalInsurance',
      },
    ],
  },
  personalProfile: [
    {
      fieldName: 'workerUser.userContext.user.firstName',
      labelKey: 'workerFirstName',
    },
    {
      fieldName: 'workerUser.userContext.user.lastName',
      labelKey: 'workerLastName',
    },
    {
      fieldName: 'workerUser.userContext.user.firstNameAlternate',
      labelKey: 'workerFirstNameAlternate',
    },
    {
      fieldName: 'workerUser.userContext.user.lastNameAlternate',
      labelKey: 'workerLastNameAlternate',
    },
    {
      fieldName: 'nationalityCode',
      labelKey: 'workerNationality',
    },
    {
      fieldName: 'workerUser.dateOfBirth',
      labelKey: 'workerDateOfBirth',
    },
    {
      fieldName: 'workerUser.gender',
      labelKey: 'workerGender',
    },
    {
      fieldName: 'workerUser.race',
      labelKey: 'workerRace',
    },
    {
      fieldName: 'workerUser.religion',
      labelKey: 'workerReligion',
    },
    {
      fieldName: 'workerUser.maritalStatus',
      labelKey: 'maritalStatus',
    },
    {
      fieldName: 'workerContact.contactNumber',
      labelKey: 'contactNumber',
    },
    {
      fieldName: 'workerUser.address.addressLine',
      labelKey: 'workerAddress',
    },
    {
      fieldName: 'workerUser.address.city',
      labelKey: 'workerCity',
    },
    {
      fieldName: 'workerUser.address.state',
      labelKey: 'workerState',
    },
    {
      fieldName: 'workerUser.address.postalCode',
      labelKey: 'workerPostalCode',
    },
    {
      fieldName: 'workerUser.address.addressLineAlternate',
      labelKey: 'workerAddressLineAlternate',
    },
    {
      fieldName: 'workerUser.address.cityAlternate',
      labelKey: 'workerCityAlternate',
    },
    {
      fieldName: 'workerUser.address.stateAlternate',
      labelKey: 'workerStateAlternate',
    },
    {
      fieldName: 'workerUser.address.postalCodeAlternate',
      labelKey: 'workerPostalCodeAlternate',
    },
  ],
  identification: [
    {
      fieldName: 'workerUser.userContext.user.email',
      labelKey: 'workerEmail',
    },
    {
      fieldName: 'citizenshipStatus',
      labelKey: 'workerCitizenshipStatus',
    },
    {
      fieldName: 'workerIdentity.taxId',
      labelKey: 'workerTaxId',
    },
    {
      fieldName: 'workerIdentity.nationalId',
      labelKey: 'workerNationalId',
    },
    {
      fieldName: 'workerIdentity.nationalIdIssuedDate',
      labelKey: 'workerNationalIdIssueDate',
    },
    {
      fieldName: 'workerIdentity.nationalIdIssuedPlace',
      labelKey: 'workerNationalIdPlaceOfIssue',
    },
    {
      fieldName: 'workerIdentity.nationalIdIssuedPlaceAlternate',
      labelKey: 'workerNationalIdIssuedPlaceAlternate',
    },
    {
      fieldName: 'workerIdentity.passportNumber',
      labelKey: 'workerPassportId',
    },
    {
      fieldName: 'workerIdentity.passportIssuedDate',
      labelKey: 'workerPassportIssuedDate',
    },
    {
      fieldName: 'workerIdentity.passportIssuedPlace',
      labelKey: 'workerPassportIssuedPlace',
    },
    {
      fieldName: 'workerIdentity.passportIssuedPlaceAlternate',
      labelKey: 'workerPassportIssuedPlaceAlternate',
    },
    {
      fieldName: 'workerIdentity.permitType',
      labelKey: 'workerPermitType',
    },
    {
      fieldName: 'workerIdentity.permitId',
      labelKey: 'workerLatestPermitId',
    },
    {
      fieldName: 'workerIdentity.permitIssuedDate',
      labelKey: 'workerLatestPermitIssueDate',
    },
    {
      fieldName: 'workerIdentity.permitIssuedPlace',
      labelKey: 'workerLatestPermitPlaceOfIssue',
    },
    {
      fieldName: 'workerIdentity.permitIssuedPlaceAlternate',
      labelKey: 'workerPermitIssuedPlaceAlternate',
    },
  ],
  emergencyContact: [
    {
      fieldName: 'workerContact.emergencyContactName',
      labelKey: 'workerEmergencyName',
    },
    {
      fieldName: 'workerContact.emergencyContactRelationship',
      labelKey: 'workerEmergencyRelationship',
    },
    {
      fieldName: 'workerContact.emergencyContactNumber',
      labelKey: 'workerEmergencyNumber',
    },
  ],
  bankDetails: [
    {
      fieldName: 'workerUser.bankAccount.beneficiaryName',
      labelKey: 'workerBankAccountHolder',
    },
    {
      fieldName: 'workerUser.bankAccount.accountNumber',
      labelKey: 'workerBankAccountNumber',
    },
    {
      fieldName: 'workerUser.bankAccount.bank.bankName',
      labelKey: 'workerBankName',
    },
    {
      fieldName: 'workerUser.bankAccount.branchCode',
      labelKey: 'workerBankBranchCode',
    },
  ],
};
