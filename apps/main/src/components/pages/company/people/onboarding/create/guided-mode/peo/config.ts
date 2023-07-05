import { CountryCode, DaysOfWeek } from '@ayp/typings/commons';
import {
  Address,
  CitizenshipStatus,
  ContractType,
  EmploymentType,
  HireType,
  WorkerEmployment,
  WorkerSchedule,
  WorkerScheduleType,
  WorkplaceAddressType,
} from '@ayp/typings/entities';
import { CountryOption, CurrencyOption, Option } from '@ayp/typings/ui';
import {
  convertTimeToDateTime,
  fireGtmEvent,
  mapFilterObject,
  yupCustomValidation,
} from '@ayp/utils';
import { format } from 'date-fns';
import { omit } from 'lodash-es';
import * as yup from 'yup';

import {
  GP_BACKEND_DATE_FORMAT,
  GP_BACKEND_TIME_FORMAT,
} from '@configs/constants';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  EMAIL_FIELD_ERROR_MESSAGE,
  INVALID_DATE_FIELD_ERROR_MESSAGE,
  INVALID_NUMBER_FIELD_ERROR_MESSAGE,
  INVALID_POSTAL_CODE_ERROR_MESSAGE,
  INVALID_TIME_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export enum HireTypeQuery {
  EOR = 'eor',
  POM = 'pom',
}

export enum ModeQuery {
  GUIDED = 'guided',
  BULK_UPLOAD = 'bulk_upload',
}

interface AdditionalDetails {
  hiringCountryCode: string;
  [key: string]: unknown;
}

export enum ClientOnboardingPeoOrEorPage {
  CLASSIFY_YOUR_HIRE,
  HIRING_DETAILS,
  HIREE_DETAILS,
  CONTRACT_DETAILS,
  REMUNERATION_DETAILS,
  ADDITIONAL_DETAILS,
  EMPLOYMENT_CONTRACT,
}

export const HIDDEN_CITIZENSHIP_STATUS_OPTIONS: Record<
  string,
  CitizenshipStatus[]
> = {
  [CountryCode.HONGKONG]: [CitizenshipStatus.PERMANENT_RESIDENT],
  [CountryCode.INDONESIA]: [CitizenshipStatus.PERMANENT_RESIDENT],
  [CountryCode.MALAYSIA]: [CitizenshipStatus.PERMIT_HOLDER],
  [CountryCode.PHILIPPINES]: [
    CitizenshipStatus.PERMANENT_RESIDENT,
    CitizenshipStatus.PERMIT_HOLDER,
  ],
  [CountryCode.SINGAPORE]: [CitizenshipStatus.PERMIT_HOLDER],
  [CountryCode.THAILAND]: [
    CitizenshipStatus.PERMANENT_RESIDENT,
    CitizenshipStatus.PERMIT_HOLDER,
  ],
  [CountryCode.VIETNAM]: [
    CitizenshipStatus.PERMANENT_RESIDENT,
    CitizenshipStatus.PERMIT_HOLDER,
  ],
};

export const fireNextEventDependingOnStep = (
  step: ClientOnboardingPeoOrEorPage
) => {
  switch (step) {
    case ClientOnboardingPeoOrEorPage.CLASSIFY_YOUR_HIRE:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ELIGIBLE_HIRE_DONE,
      });
      break;
    case ClientOnboardingPeoOrEorPage.HIRING_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP1_DONE,
      });
      break;
    case ClientOnboardingPeoOrEorPage.HIREE_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP2_DONE,
      });
      break;
    case ClientOnboardingPeoOrEorPage.CONTRACT_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP3_DONE,
      });
      break;
    case ClientOnboardingPeoOrEorPage.REMUNERATION_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP4_DONE,
      });
      break;
    case ClientOnboardingPeoOrEorPage.ADDITIONAL_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP5_DONE,
      });
      break;
    case ClientOnboardingPeoOrEorPage.EMPLOYMENT_CONTRACT:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP6_DONE,
      });
      break;
    default:
      break;
  }
};

export const firePreviousEventDependingOnStep = (
  step: ClientOnboardingPeoOrEorPage
) => {
  switch (step) {
    case ClientOnboardingPeoOrEorPage.CLASSIFY_YOUR_HIRE:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ELIGIBLE_HIRE_LEAVE,
      });
      break;
    case ClientOnboardingPeoOrEorPage.HIRING_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP1_LEAVE,
      });
      break;
    case ClientOnboardingPeoOrEorPage.HIREE_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP2_BACK,
      });
      break;
    case ClientOnboardingPeoOrEorPage.CONTRACT_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP3_BACK,
      });
      break;
    case ClientOnboardingPeoOrEorPage.REMUNERATION_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP4_BACK,
      });
      break;
    case ClientOnboardingPeoOrEorPage.ADDITIONAL_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP5_BACK,
      });
      break;
    case ClientOnboardingPeoOrEorPage.EMPLOYMENT_CONTRACT:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.CLIENT_PORTAL_ADD_EOR_SERVICE_STEP6_BACK,
      });
      break;
    default:
      break;
  }
};

export interface GuidedModePeoFormValues {
  hireType: HireType | '';
  hiringCountry: Nullable<CountryOption>;
  isHaveLegalEntity: Nullable<boolean | number>;
  isUseLegalEntity: Nullable<boolean | number>;

  nationality: Nullable<CountryOption>;
  citizenshipStatus: CitizenshipStatus | '';
  currency: Nullable<CurrencyOption>;
  isWorkPermitActive: boolean | '';

  firstName: string;
  lastName: string;
  email: string;
  title: string;
  description: Nullable<string>;
  employeeId: string;

  contractType: ContractType | '';
  startDate: Nullable<Date>;
  endDate: Nullable<Date>;
  employmentType: EmploymentType | '';
  startAt: Nullable<Date>;
  endAt: Nullable<Date>;
  workingHoursPerWeek: number | '';
  workerSchedule: Nullable<
    Omit<
      WorkerSchedule,
      'id' | 'createdAt' | 'updatedAt' | 'workerEmploymentId'
    >
  >;
  managerName: string;
  managerTitle: string;
  department: Nullable<Option>;
  workplaceAddressType: WorkplaceAddressType | '';
  workplaceAddress?: Omit<
    Address,
    | 'id'
    | 'countryCode'
    | 'country'
    | 'addressLineAlternate'
    | 'cityAlternate'
    | 'stateAlternate'
    | 'postalCodeAlternate'
  >;

  salaryPerMonth: string;
  salaryPayableDate: number | '';
  isEligibleForAdditionalIncome: boolean | '';
  additionalIncomeDescription: Nullable<string>;
  isEligibleForPaidExpenses: boolean | '';
  paidExpensesDescription: Nullable<string>;
  isEntitledToOvertime: boolean | '';
  overtimeDescription: Nullable<string>;

  additionalDetails: AdditionalDetails;

  isSigned: boolean;
}

export const initialValues: GuidedModePeoFormValues = {
  hireType: '',
  hiringCountry: null,
  isHaveLegalEntity: null,
  isUseLegalEntity: null,

  nationality: null,
  citizenshipStatus: '',
  currency: null,
  isWorkPermitActive: '',

  firstName: '',
  lastName: '',
  email: '',
  title: '',
  description: null,
  employeeId: '',

  contractType: '',
  startDate: null,
  endDate: null,
  employmentType: '',
  startAt: null,
  endAt: null,
  workingHoursPerWeek: '',
  workerSchedule: {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  },
  managerName: '',
  managerTitle: '',
  department: null,
  workplaceAddressType: '',
  workplaceAddress: {
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
  },
  salaryPerMonth: '',
  salaryPayableDate: '',
  isEligibleForAdditionalIncome: '',
  additionalIncomeDescription: null,
  isEligibleForPaidExpenses: '',
  paidExpensesDescription: null,
  isEntitledToOvertime: '',
  overtimeDescription: null,

  additionalDetails: {
    hiringCountryCode: '',
  },

  isSigned: false,
};

const mapAdditionalDetails = async (
  additionalDetails: AdditionalDetails
): Promise<Record<string, unknown>> => {
  const {
    hiringCountryCode,
    probationPeriod,
    paidTimeOff,
    sickTimeOff,
    terminationNotice,
    isEligibleForInsurance,
    monthlyAllowance,
    compassionateTimeOff,
    isEligibleForVariablePay,
    variablePayDescription,
    isEligibleForAnnualBonus,
    annualBonusDescription,
    isEligibleForCommission,
    commissionDescription,
    probationStartDate,
    probationEndDate,
    ...countryAdditionalDetails
  } = additionalDetails;
  const requestBody = Object.assign(
    {},
    {
      probationPeriod,
      paidTimeOff,
      sickTimeOff,
      terminationNotice,
      isEligibleForInsurance,
      monthlyAllowance,
      compassionateTimeOff,
      isEligibleForVariablePay,
      variablePayDescription,
      isEligibleForAnnualBonus,
      annualBonusDescription,
      isEligibleForCommission,
      commissionDescription,
      probationStartDate,
      probationEndDate,
    },
    probationStartDate && {
      probationStartDate: format(
        probationStartDate as Date,
        GP_BACKEND_DATE_FORMAT
      ),
    },
    probationEndDate && {
      probationEndDate: format(
        probationEndDate as Date,
        GP_BACKEND_DATE_FORMAT
      ),
    }
  );

  try {
    const { mapAdditionalDetails } = await import(
      `@components/pages/company/people/onboarding/create/guided-mode/peo/additional-details/configs/${hiringCountryCode.toLocaleLowerCase()}`
    );

    Object.assign(requestBody, mapAdditionalDetails(countryAdditionalDetails));
  } catch (e) {
    console.log(e);
    Object.assign(requestBody, countryAdditionalDetails);
  }

  return requestBody;
};

export const mapToPostRequestBody = async (
  values: GuidedModePeoFormValues
): Promise<Record<string, unknown>> => {
  const {
    hiringCountry,
    nationality,
    currency,
    startDate,
    endDate,
    startAt,
    endAt,
    additionalDetails,
    workplaceAddressType,
    department,
    ...data
  } = values;

  return mapFilterObject(
    Object.assign(
      {},
      data,
      {
        nationalityCode: nationality?.code,
        hiringCountryCode: hiringCountry?.code,
        currency: currency?.code,
        startDate: '',
        endDate: '',
        startAt: '',
        endAt: '',
        departmentId: department ? department.id : undefined,
        workplaceAddressType,
      },
      startDate && {
        startDate: format(startDate, GP_BACKEND_DATE_FORMAT),
      },
      endDate && {
        endDate: format(endDate, GP_BACKEND_DATE_FORMAT),
      },
      startAt && {
        startAt: format(startAt, GP_BACKEND_TIME_FORMAT),
      },
      endAt && {
        endAt: format(endAt, GP_BACKEND_TIME_FORMAT),
      },
      await mapAdditionalDetails(additionalDetails)
    ),
    (value, key) => (value !== '' || key === 'isUseLegalEntity' ? value : null),
    (_value, key) =>
      !!workplaceAddressType &&
      workplaceAddressType !== WorkplaceAddressType.OTHERS &&
      key !== 'workplaceAddress'
  );
};

export const mapToPatchRequestBody = async (
  values: GuidedModePeoFormValues
): Promise<Record<string, unknown>> => {
  const {
    nationality,
    currency,
    startDate,
    endDate,
    startAt,
    endAt,
    additionalDetails,
    workplaceAddressType,
    workplaceAddress,
    department,
    salaryPerMonth,
    salaryPayableDate,
    isEligibleForAdditionalIncome,
    additionalIncomeDescription,
    isEligibleForPaidExpenses,
    paidExpensesDescription,
    isEntitledToOvertime,
    overtimeDescription,
    firstName,
    lastName,
    email,
    isWorkPermitActive,
    ...data
  } = values;

  return mapFilterObject(
    Object.assign(
      {},
      omit(
        data,
        'hireType',
        'hiringCountry',
        'isHaveLegalEntity',
        'isUseLegalEntity'
      ),
      {
        nationalityCode: nationality?.code,
        currency: currency?.code,
        startDate: '',
        endDate: '',
        startAt: '',
        endAt: '',
        probationEndDate: '',
        probationStartDate: '',
        departmentId: department ? department.id : undefined,
        workplaceAddressType,
        probationPeriod: additionalDetails?.probationPeriod,
        terminationNotice: additionalDetails?.terminationNotice,
        workerUser: {
          user: {
            firstName,
            lastName,
            email,
          },
        },
        workerIdentity: {
          isWorkPermitActive,
        },
        additionalInfo: {
          fieldManagerialType: additionalDetails?.fieldManagerialType,
          religiousFestivityAllowance:
            additionalDetails?.religiousFestivityAllowance,
          isEntitledToOvertimeDifferential:
            additionalDetails?.isEntitledToOvertimeDifferential,
        },
        workerRemuneration: {
          salaryPerMonth,
          salaryPayableDate,
          isEligibleForAdditionalIncome,
          additionalIncomeDescription,
          isEligibleForPaidExpenses,
          paidExpensesDescription,
          isEntitledToOvertime,
          overtimeDescription,
          paidTimeOff: additionalDetails?.paidTimeOff,
          sickTimeOff: additionalDetails?.sickTimeOff,
          isEligibleForInsurance: additionalDetails?.isEligibleForInsurance,
          compassionateTimeOff: additionalDetails?.compassionateTimeOff,
          monthlyAllowance: additionalDetails?.monthlyAllowance,
          isEligibleForVariablePay: additionalDetails?.isEligibleForVariablePay,
          variablePayDescription: additionalDetails?.variablePayDescription,
          isEligibleForAnnualBonus: additionalDetails?.isEligibleForAnnualBonus,
          annualBonusDescription: additionalDetails?.annualBonusDescription,
          isEligibleForCommission: additionalDetails?.isEligibleForCommission,
          commissionDescription: additionalDetails?.commissionDescription,
        },
      },
      startDate && {
        startDate: format(startDate, GP_BACKEND_DATE_FORMAT),
      },
      endDate && {
        endDate: format(endDate, GP_BACKEND_DATE_FORMAT),
      },
      startAt && {
        startAt: format(startAt, GP_BACKEND_TIME_FORMAT),
      },
      endAt && {
        endAt: format(endAt, GP_BACKEND_TIME_FORMAT),
      },
      additionalDetails?.probationStartDate && {
        probationStartDate: format(
          additionalDetails.probationStartDate as Date,
          GP_BACKEND_DATE_FORMAT
        ),
      },
      additionalDetails?.probationEndDate && {
        probationEndDate: format(
          additionalDetails.probationEndDate as Date,
          GP_BACKEND_DATE_FORMAT
        ),
      },
      workplaceAddressType === WorkplaceAddressType.OTHERS && {
        workplaceAddress,
      }
    ),
    (value) => (value !== '' ? value : null)
  );
};

export const validationSchema = [
  yup.object({
    hireType: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    hiringCountry: yup
      .object()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    isHaveLegalEntity: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    isUseLegalEntity: yup
      .boolean()
      .nullable()
      .when('isHaveLegalEntity', {
        is: true,
        then: yup.boolean().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
  }),
  yup.object({
    nationality: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    citizenshipStatus: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    currency: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    isWorkPermitActive: yup
      .boolean()
      .nullable()
      .when('citizenshipStatus', {
        is: CitizenshipStatus.PERMIT_HOLDER,
        then: yup.boolean().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
  }),
  yup.object({
    firstName: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    lastName: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    email: yup
      .string()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .email(EMAIL_FIELD_ERROR_MESSAGE),
    title: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    description: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    employeeId: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .test({
        message: CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
        test: (value) => yupCustomValidation.isAlphaNumeric(value),
      }),
  }),
  yup.object({
    contractType: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    startDate: yup
      .date()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE),
    endDate: yup
      .date()
      .nullable()
      .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE)
      .when('contractType', {
        is: ContractType.FIXED,
        then: yup
          .date()
          .nullable()
          .required(REQUIRED_FIELD_ERROR_MESSAGE)
          .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE)
          .test({
            message:
              'company-people-onboarding-create:contractDetails.form.endDate.error.endDateMustBeLaterThanStartDate',
            test: function (value) {
              return yupCustomValidation.isDateAfter(
                value,
                this.parent.startDate
              );
            },
          }),
      }),
    employmentType: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    startAt: yup
      .date()
      .nullable()
      .typeError(INVALID_TIME_FIELD_ERROR_MESSAGE)
      .when('employmentType', {
        is: EmploymentType.FULL_TIME,
        then: yup
          .date()
          .nullable()
          .required(REQUIRED_FIELD_ERROR_MESSAGE)
          .typeError(INVALID_TIME_FIELD_ERROR_MESSAGE),
      }),
    endAt: yup
      .date()
      .nullable()
      .typeError(INVALID_TIME_FIELD_ERROR_MESSAGE)
      .when('employmentType', {
        is: EmploymentType.FULL_TIME,
        then: yup
          .date()
          .nullable()
          .required(REQUIRED_FIELD_ERROR_MESSAGE)
          .typeError(INVALID_TIME_FIELD_ERROR_MESSAGE),
      }),
    workingHoursPerWeek: yup
      .number()
      .min(0, '')
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_NUMBER_FIELD_ERROR_MESSAGE),
    workerSchedule: yup.object({
      [DaysOfWeek.MONDAY]: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .oneOf(Object.values(WorkerScheduleType)),
      [DaysOfWeek.TUESDAY]: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .oneOf(Object.values(WorkerScheduleType)),
      [DaysOfWeek.WEDNESDAY]: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .oneOf(Object.values(WorkerScheduleType)),
      [DaysOfWeek.THURSDAY]: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .oneOf(Object.values(WorkerScheduleType)),
      [DaysOfWeek.FRIDAY]: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .oneOf(Object.values(WorkerScheduleType)),
      [DaysOfWeek.SATURDAY]: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .oneOf(Object.values(WorkerScheduleType)),
      [DaysOfWeek.SUNDAY]: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .oneOf(Object.values(WorkerScheduleType)),
    }),
    managerName: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    managerTitle: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    department: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    workplaceAddressType: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    workplaceAddress: yup.object().when('workplaceAddressType', {
      is: WorkplaceAddressType.OTHERS,
      then: yup.object().shape({
        addressLine: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
        city: yup.string().notRequired(),
        state: yup.string().notRequired(),
        postalCode: yup
          .number()
          .typeError(INVALID_POSTAL_CODE_ERROR_MESSAGE)
          .positive(INVALID_POSTAL_CODE_ERROR_MESSAGE)
          .notRequired(),
      }),
    }),
  }),
  yup.object({
    salaryPerMonth: yup.number().required(REQUIRED_FIELD_ERROR_MESSAGE),
    salaryPayableDate: yup.number().required(REQUIRED_FIELD_ERROR_MESSAGE),
    isEligibleForAdditionalIncome: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    additionalIncomeDescription: yup
      .string()
      .nullable()
      .when('isEligibleForAdditionalIncome', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
    isEligibleForPaidExpenses: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    paidExpensesDescription: yup
      .string()
      .nullable()
      .when('isEligibleForPaidExpenses', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
    isEntitledToOvertime: yup
      .boolean()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    overtimeDescription: yup
      .string()
      .nullable()
      .when('isEntitledToOvertime', {
        is: true,
        then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
  }),
  undefined,
  yup.object({
    isSigned: yup.boolean().nullable().oneOf([true], ''),
  }),
];

export const mapToGuidedModePeoFormValue = (
  workerEmployment: WorkerEmployment,
  countryOptions: CountryOption[],
  currencyOptions: CurrencyOption[],
  departmentOptions: Option[]
): GuidedModePeoFormValues => ({
  hireType: workerEmployment.hireType,
  hiringCountry: workerEmployment.hiringCountryCode
    ? (countryOptions.find(
        (option) => option.code === workerEmployment.hiringCountryCode
      ) as CountryOption)
    : null,
  isHaveLegalEntity: workerEmployment.isHaveLegalEntity,
  isUseLegalEntity: workerEmployment.isUseLegalEntity,
  nationality: workerEmployment.nationalityCode
    ? (countryOptions.find(
        (option) => option.code === workerEmployment.nationalityCode
      ) as CountryOption)
    : null,
  citizenshipStatus: workerEmployment.citizenshipStatus,
  currency: workerEmployment.currency
    ? (currencyOptions.find(
        (option) => option.code === workerEmployment.currency
      ) as CurrencyOption)
    : null,
  isWorkPermitActive: workerEmployment.workerIdentity?.isWorkPermitActive,
  firstName: workerEmployment.workerUser?.userContext?.user?.firstName,
  lastName: workerEmployment.workerUser?.userContext?.user?.lastName,
  email: workerEmployment.workerUser?.userContext?.user?.email,
  title: workerEmployment.title,
  description: workerEmployment.description,
  employeeId: workerEmployment.employeeId,
  contractType: workerEmployment.contractType,
  startDate: workerEmployment?.startDate
    ? new Date(workerEmployment.startDate)
    : null,
  endDate: workerEmployment?.endDate
    ? new Date(workerEmployment.endDate)
    : null,
  employmentType: workerEmployment.employmentType,
  startAt: workerEmployment?.startAt
    ? convertTimeToDateTime(workerEmployment.startAt)
    : null,
  endAt: workerEmployment?.endAt
    ? convertTimeToDateTime(workerEmployment.endAt)
    : null,
  workingHoursPerWeek: workerEmployment.workingHoursPerWeek,
  workerSchedule: {
    monday: workerEmployment?.workerSchedule?.monday,
    tuesday: workerEmployment?.workerSchedule?.tuesday,
    wednesday: workerEmployment?.workerSchedule?.wednesday,
    thursday: workerEmployment?.workerSchedule?.thursday,
    friday: workerEmployment?.workerSchedule?.friday,
    saturday: workerEmployment?.workerSchedule?.saturday,
    sunday: workerEmployment?.workerSchedule?.sunday,
  },
  managerName: workerEmployment.managerName,
  managerTitle: workerEmployment.managerTitle,
  department: workerEmployment.departmentId
    ? (departmentOptions.find(
        (option) => option.id === workerEmployment.departmentId
      ) as Option)
    : null,
  workplaceAddressType: workerEmployment.workplaceAddressType,
  workplaceAddress: {
    addressLine: workerEmployment?.workplaceAddress?.addressLine,
    city: workerEmployment?.workplaceAddress?.city,
    state: workerEmployment?.workplaceAddress?.state,
    postalCode: workerEmployment?.workplaceAddress?.postalCode,
  },
  salaryPerMonth: workerEmployment?.workerRemuneration?.salaryPerMonth,
  salaryPayableDate: workerEmployment?.workerRemuneration?.salaryPayableDate,
  isEligibleForAdditionalIncome:
    workerEmployment?.workerRemuneration?.isEligibleForAdditionalIncome,
  additionalIncomeDescription:
    workerEmployment?.workerRemuneration?.additionalIncomeDescription,
  isEligibleForPaidExpenses:
    workerEmployment?.workerRemuneration?.isEligibleForPaidExpenses,
  paidExpensesDescription:
    workerEmployment?.workerRemuneration?.paidExpensesDescription,
  isEntitledToOvertime:
    workerEmployment?.workerRemuneration?.isEntitledToOvertime,
  overtimeDescription:
    workerEmployment?.workerRemuneration?.overtimeDescription,
  additionalDetails: {
    probationEndDate: workerEmployment?.probationEndDate
      ? new Date(workerEmployment.probationEndDate)
      : null,
    probationStartDate: workerEmployment?.probationStartDate
      ? new Date(workerEmployment.probationStartDate)
      : null,
    paidTimeOff: workerEmployment?.workerRemuneration?.paidTimeOff,
    sickTimeOff: workerEmployment?.workerRemuneration?.sickTimeOff,
    probationPeriod: workerEmployment?.probationPeriod,
    terminationNotice: workerEmployment?.terminationNotice,
    isEligibleForInsurance:
      workerEmployment?.workerRemuneration?.isEligibleForInsurance,
    hiringCountryCode: workerEmployment?.hiringCountryCode,
    fieldManagerialType: workerEmployment?.additionalInfo?.fieldManagerialType,
    religiousFestivityAllowance:
      workerEmployment?.additionalInfo?.religiousFestivityAllowance,
    isEntitledToOvertimeDifferential:
      workerEmployment?.additionalInfo?.isEntitledToOvertimeDifferential,
    compassionateTimeOff:
      workerEmployment?.workerRemuneration?.compassionateTimeOff,
    monthlyAllowance: workerEmployment?.workerRemuneration?.monthlyAllowance,
    isEligibleForVariablePay:
      workerEmployment?.workerRemuneration?.isEligibleForVariablePay,
    variablePayDescription:
      workerEmployment?.workerRemuneration?.variablePayDescription,
    isEligibleForAnnualBonus:
      workerEmployment?.workerRemuneration?.isEligibleForAnnualBonus,
    annualBonusDescription:
      workerEmployment?.workerRemuneration?.annualBonusDescription,
    isEligibleForCommission:
      workerEmployment?.workerRemuneration?.isEligibleForCommission,
    commissionDescription:
      workerEmployment?.workerRemuneration?.commissionDescription,
  },
  isSigned: false,
});

export const daysOfWeek = [
  DaysOfWeek.MONDAY,
  DaysOfWeek.TUESDAY,
  DaysOfWeek.WEDNESDAY,
  DaysOfWeek.THURSDAY,
  DaysOfWeek.FRIDAY,
  DaysOfWeek.SATURDAY,
  DaysOfWeek.SUNDAY,
];
