import {
  CitizenshipStatus,
  EmergencyContactRelationship,
  Gender,
  MaritalStatus,
  Race,
  Religion,
  WorkerContact,
  WorkerCountry,
  WorkerEmployment,
  WorkerIdentity,
  WorkerType,
  WorkerUser,
} from '@ayp/typings/entities';
import { Option } from '@ayp/typings/ui';
import {
  fireGtmEvent,
  getWorkerCountryCode,
  isTypeOf,
  mapFilterObject,
  yupCustomValidation,
} from '@ayp/utils';
import { format } from 'date-fns';
import * as yup from 'yup';

import { GP_BACKEND_DATE_FORMAT } from '@configs/constants';
import { GTM_EVENTS } from '@configs/constants/gtm-events';
import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
  CONTAIN_SPACES_ERROR_MESSAGE,
  INVALID_CONTACT_NUMBER_FIELD_ERROR_MESSAGE,
  INVALID_DATE_FIELD_ERROR_MESSAGE,
  INVALID_EMERGENCY_CONTACT_RELATIONSHIP_FIELD_ERROR_MESSAGE,
  INVALID_GENDER_FIELD_ERROR_MESSAGE,
  INVALID_MARITAL_STATUS_FIELD_ERROR_MESSAGE,
  INVALID_POSTAL_CODE_ERROR_MESSAGE,
  INVALID_RACE_FIELD_ERROR_MESSAGE,
  INVALID_RELIGION_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

interface WorkerContactFormType
  extends Omit<
    WorkerContact,
    | 'id'
    | 'workerEmploymentId'
    | 'contactNumberCountryCode'
    | 'emergencyContactNumberCountryCode'
    | 'createdAt'
    | 'updatedAt'
  > {
  contactNumberCountryCode: Nullable<Option>;
  emergencyContactNumberCountryCode: Nullable<Option>;
}

type WorkerIdentityFormType = Omit<
  WorkerIdentity,
  | 'id'
  | 'workerEmploymentId'
  | 'createdAt'
  | 'updatedAt'
  | 'isWorkPermitActive'
  | 'nationalIdIssuedPlace'
  | 'nationalIdIssuedPlaceAlternate'
  | 'passportIssuedDate'
  | 'passportIssuedPlace'
  | 'passportIssuedPlaceAlternate'
  | 'permitIssuedPlaceAlternate'
>;

export enum WorkerOnboardingPage {
  PERSONAL_PROFILE,
  IDENTIFICATION,
  EMERGENCY_CONTACT,
  BANK_DETAILS,
  ADDITIONAL_INFORMATION,
  IN_REVIEW,
}

export const firePreviousEventDependingOnStepWorkerPortal = (
  step: WorkerOnboardingPage
) => {
  switch (step) {
    case WorkerOnboardingPage.IDENTIFICATION:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.WORKER_PORTAL_ONBOARDING_STEP2_BACK,
      });
      break;
    case WorkerOnboardingPage.EMERGENCY_CONTACT:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.WORKER_PORTAL_ONBOARDING_STEP3_BACK,
      });
      break;
    case WorkerOnboardingPage.BANK_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.WORKER_PORTAL_ONBOARDING_STEP4_BACK,
      });
      break;
    case WorkerOnboardingPage.ADDITIONAL_INFORMATION:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.WORKER_PORTAL_ONBOARDING_STEP5_BACK,
      });
      break;
    default:
      break;
  }
};

export const fireNextEventDependingOnStepWorkerPortal = (
  step: WorkerOnboardingPage
) => {
  switch (step) {
    case WorkerOnboardingPage.PERSONAL_PROFILE:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.WORKER_PORTAL_ONBOARDING_STEP1_DONE,
      });
      break;
    case WorkerOnboardingPage.IDENTIFICATION:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.WORKER_PORTAL_ONBOARDING_STEP2_DONE,
      });
      break;
    case WorkerOnboardingPage.EMERGENCY_CONTACT:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.WORKER_PORTAL_ONBOARDING_STEP3_DONE,
      });
      break;
    case WorkerOnboardingPage.BANK_DETAILS:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.WORKER_PORTAL_ONBOARDING_STEP4_DONE,
      });
      break;
    case WorkerOnboardingPage.ADDITIONAL_INFORMATION:
      fireGtmEvent<GTM_EVENTS>({
        event: GTM_EVENTS.WORKER_PORTAL_ONBOARDING_STEP5_DONE,
      });
      break;
    default:
      break;
  }
};

export interface WorkerOnboardingFormValues {
  workerUser: {
    userContext: {
      user: {
        firstName: Nullable<string>;
        lastName: Nullable<string>;
      };
    };
    address: {
      addressLine: Nullable<string>;
      city: Nullable<string>;
      state: Nullable<string>;
      postalCode: Nullable<string>;
    };
    dateOfBirth: Nullable<Date>;
    maritalStatus: Nullable<MaritalStatus>;
    religion: Nullable<Religion>;
    gender: Nullable<Gender>;
    bankAccount: {
      beneficiaryName: Nullable<string>;
      accountNumber: Nullable<string>;
      bank: Nullable<Option<string>>;
      branchCode: Nullable<string>;
    };
  };
  additionalInfo: Nullable<WorkerCountry>;
  workerType: WorkerType;
  citizenshipStatus: CitizenshipStatus;

  workerIdentity: WorkerIdentityFormType;
  workerContact: WorkerContactFormType;
}

export const getInitialValues = (
  workerEmployment: WorkerEmployment,
  dialingCodes: Option[]
): WorkerOnboardingFormValues => {
  return Object.assign(
    {},
    {
      workerUser: {
        userContext: {
          user: {
            firstName:
              workerEmployment.workerUser.userContext.user.firstName ?? '',
            lastName:
              workerEmployment.workerUser.userContext.user.lastName ?? '',
          },
        },
        address: {
          addressLine: workerEmployment.workerUser.address?.addressLine ?? '',
          city: workerEmployment.workerUser.address?.city ?? '',
          state: workerEmployment.workerUser.address?.state ?? '',
          postalCode: workerEmployment.workerUser.address?.postalCode ?? '',
        },
        dateOfBirth: workerEmployment.workerUser?.dateOfBirth
          ? new Date(workerEmployment.workerUser.dateOfBirth)
          : null,
        maritalStatus: workerEmployment.workerUser.maritalStatus,
        religion: workerEmployment.workerUser.religion,
        gender: workerEmployment.workerUser.gender,
        race: workerEmployment.workerUser.race,
        bankAccount: workerEmployment?.workerUser?.bankAccount
          ? {
              ...workerEmployment.workerUser.bankAccount,
              bank: workerEmployment.workerUser.bankAccount.bank
                ? {
                    id: workerEmployment.workerUser.bankAccount.bank.bankId,
                    label:
                      workerEmployment.workerUser.bankAccount.bank.bankName,
                  }
                : null,
            }
          : null,
      },
      workerIdentity: {
        permitId: workerEmployment.workerIdentity?.permitId ?? '',
        permitIdFile: workerEmployment.workerIdentity?.permitIdFile ?? '',
        permitIssuedDate: workerEmployment.workerIdentity?.permitIssuedDate
          ? new Date(workerEmployment.workerIdentity.permitIssuedDate)
          : null,
        permitExpiryDate: workerEmployment.workerIdentity?.permitExpiryDate
          ? new Date(workerEmployment.workerIdentity.permitExpiryDate)
          : null,
        permitIssuedPlace:
          workerEmployment.workerIdentity?.permitIssuedPlace ?? '',
        passportNumber: workerEmployment.workerIdentity?.passportNumber ?? '',
        passportFile: workerEmployment.workerIdentity?.passportFile ?? '',
        nationalId: workerEmployment.workerIdentity?.nationalId ?? '',
        nationalIdIssuedDate: workerEmployment.workerIdentity
          ?.nationalIdIssuedDate
          ? new Date(workerEmployment.workerIdentity.nationalIdIssuedDate)
          : null,
        nationalIdFile: workerEmployment.workerIdentity?.nationalIdFile ?? '',
        permitType: workerEmployment.workerIdentity?.permitType ?? '',
        taxId: workerEmployment.workerIdentity?.taxId ?? '',
      },
      workerContact: {
        contactNumberCountryCode:
          dialingCodes.find(
            (dialingCode) =>
              dialingCode.code ===
              workerEmployment.workerContact?.contactNumberCountryCode
          ) ?? null,
        contactNumber: workerEmployment.workerContact?.contactNumber ?? '',
        emergencyContactName:
          workerEmployment.workerContact?.emergencyContactName ?? '',
        emergencyContactRelationship:
          workerEmployment.workerContact?.emergencyContactRelationship ?? null,
        emergencyContactNumberCountryCode:
          dialingCodes.find(
            (dialingCode) =>
              dialingCode.code ===
              workerEmployment.workerContact?.emergencyContactNumberCountryCode
          ) ?? null,
        emergencyContactNumber:
          workerEmployment.workerContact?.emergencyContactNumber ?? '',
      },
      additionalInfo: workerEmployment.additionalInfo
        ? Object.assign(
            {},
            workerEmployment.additionalInfo,
            workerEmployment.additionalInfo?.fatherDateOfBirth && {
              fatherDateOfBirth: new Date(
                workerEmployment.additionalInfo.fatherDateOfBirth
              ),
            },
            workerEmployment.additionalInfo?.motherDateOfBirth && {
              motherDateOfBirth: new Date(
                workerEmployment.additionalInfo.motherDateOfBirth
              ),
            }
          )
        : null,
    },
    {
      workerType: workerEmployment.workerType,
      citizenshipStatus: workerEmployment.citizenshipStatus,
    }
  );
};

const mapIdentification = async (
  workerIdentity: WorkerIdentityFormType,
  citizenshipStatus: CitizenshipStatus,
  workerType: WorkerType
): Promise<Record<string, unknown>> => {
  try {
    const { mapIdentification } = await import(
      `@components/pages/worker/onboarding/configs/identification/${
        citizenshipStatus === CitizenshipStatus.PERMIT_HOLDER
          ? `is-permit-holder`
          : `is-not-permit-holder`
      }/${getWorkerCountryCode(workerType).toLocaleLowerCase()}`
    );

    return mapIdentification(workerIdentity);
  } catch (e) {
    return workerIdentity;
  }
};

const mapAdditionalInformation = async (
  additionalInfo: Nullable<WorkerCountry>,
  citizenshipStatus: CitizenshipStatus,
  workerType: WorkerType
): Promise<Record<string, unknown>> => {
  try {
    const { mapAdditionalInformation } = await import(
      `@components/pages/worker/onboarding/configs/additional-information/${
        citizenshipStatus === CitizenshipStatus.PERMIT_HOLDER
          ? `is-permit-holder`
          : `is-not-permit-holder`
      }/${getWorkerCountryCode(workerType).toLocaleLowerCase()}`
    );

    return mapAdditionalInformation(additionalInfo);
  } catch (e) {
    return { additionalInfo };
  }
};

const mapFunction = (value: unknown, key: string) => {
  return key === 'workerUser' &&
    isTypeOf<Partial<WorkerUser>>(value, ['userContext'])
    ? Object.assign(
        {},
        value,
        {
          user: value?.userContext?.user,
        },
        { userContext: undefined }
      )
    : value !== ''
    ? value
    : null;
};

export const mapToRequestBody = async (
  values: WorkerOnboardingFormValues,
  activeStep: WorkerOnboardingPage
): Promise<Record<string, unknown>> => {
  const {
    citizenshipStatus,
    workerType,
    workerIdentity,
    workerContact,
    workerUser,
    additionalInfo,
    ...data
  } = values;

  return mapFilterObject(
    Object.assign(
      {},
      data,
      {
        workerUser: Object.assign(
          {},
          workerUser,
          workerUser.dateOfBirth && {
            dateOfBirth: format(
              new Date(workerUser.dateOfBirth),
              GP_BACKEND_DATE_FORMAT
            ),
          },
          {
            bankAccount: {
              beneficiaryName: workerUser.bankAccount.beneficiaryName,
              accountNumber: workerUser.bankAccount.accountNumber,
              bankId: workerUser.bankAccount.bank?.id,
              branchCode: workerUser.bankAccount.branchCode,
            },
          }
        ),
      },
      {
        workerContact: {
          ...workerContact,
          contactNumberCountryCode:
            values.workerContact.contactNumberCountryCode?.code,
          emergencyContactNumberCountryCode:
            values.workerContact.emergencyContactNumberCountryCode?.code,
        },
      },
      {
        workerIdentity: Object.assign(
          {},
          await mapIdentification(
            workerIdentity,
            citizenshipStatus,
            workerType
          ),
          {
            permitIssuedDate: workerIdentity.permitIssuedDate
              ? format(
                  new Date(workerIdentity.permitIssuedDate),
                  GP_BACKEND_DATE_FORMAT
                )
              : null,
            nationalIdIssuedDate: workerIdentity.nationalIdIssuedDate
              ? format(
                  new Date(workerIdentity.nationalIdIssuedDate),
                  GP_BACKEND_DATE_FORMAT
                )
              : null,
            permitExpiryDate: workerIdentity.permitExpiryDate
              ? format(
                  new Date(workerIdentity.permitExpiryDate),
                  GP_BACKEND_DATE_FORMAT
                )
              : null,
          }
        ),
      },
      additionalInfo &&
        (await mapAdditionalInformation(
          additionalInfo,
          citizenshipStatus,
          workerType
        )),
      activeStep === WorkerOnboardingPage.ADDITIONAL_INFORMATION && {
        isOnboardingCompleted: true,
      }
    ),
    (value, key) => mapFunction(value, key)
  );
};

export const validationSchema = {
  [WorkerOnboardingPage.PERSONAL_PROFILE]: yup.object({
    workerUser: yup.object().shape({
      userContext: yup.object().shape({
        user: yup.object().shape({
          firstName: yup.string().trim().required(REQUIRED_FIELD_ERROR_MESSAGE),
          lastName: yup.string().trim().required(REQUIRED_FIELD_ERROR_MESSAGE),
        }),
      }),
      address: yup.object().shape({
        addressLine: yup.string().trim().required(REQUIRED_FIELD_ERROR_MESSAGE),
        city: yup.string().trim().required(REQUIRED_FIELD_ERROR_MESSAGE),
        state: yup.string().trim().required(REQUIRED_FIELD_ERROR_MESSAGE),
        postalCode: yup
          .number()
          .typeError(INVALID_POSTAL_CODE_ERROR_MESSAGE)
          .positive(INVALID_POSTAL_CODE_ERROR_MESSAGE)
          .notRequired(),
      }),
      dateOfBirth: yup
        .date()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE),
      gender: yup
        .mixed()
        .oneOf(Object.values(Gender), INVALID_GENDER_FIELD_ERROR_MESSAGE)
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .typeError(INVALID_GENDER_FIELD_ERROR_MESSAGE),
      race: yup
        .mixed()
        .nullable()
        .oneOf(Object.values(Race))
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .typeError(INVALID_RACE_FIELD_ERROR_MESSAGE),
      religion: yup
        .mixed()
        .oneOf(Object.values(Religion))
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .typeError(INVALID_RELIGION_FIELD_ERROR_MESSAGE),
      maritalStatus: yup
        .mixed()
        .oneOf(Object.values(MaritalStatus))
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .typeError(INVALID_MARITAL_STATUS_FIELD_ERROR_MESSAGE),
    }),
    workerContact: yup.object().shape({
      contactNumberCountryCode: yup
        .mixed()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      contactNumber: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .test({
          message: INVALID_CONTACT_NUMBER_FIELD_ERROR_MESSAGE,
          test: (value) => yupCustomValidation.isValidNumber(value),
        }),
    }),
  }),
  [WorkerOnboardingPage.IDENTIFICATION]: yup.object({
    workerIdentity: yup.object().shape({
      taxId: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .test({
          message: CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
          test: (value) => yupCustomValidation.isAlphaNumeric(value),
        })
        .test({
          message: CONTAIN_SPACES_ERROR_MESSAGE,
          test: (value) => yupCustomValidation.isNotContainSpaces(value),
        }),
    }),
  }),
  [WorkerOnboardingPage.EMERGENCY_CONTACT]: yup.object({
    workerContact: yup.object().shape({
      emergencyContactName: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
      emergencyContactRelationship: yup
        .mixed()
        .nullable()
        .oneOf(Object.values(EmergencyContactRelationship))
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .typeError(INVALID_EMERGENCY_CONTACT_RELATIONSHIP_FIELD_ERROR_MESSAGE),
      emergencyContactNumberCountryCode: yup
        .object()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      emergencyContactNumber: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .test({
          message: CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
          test: (value) => yupCustomValidation.isAlphaNumeric(value),
        })
        .test({
          message: CONTAIN_SPACES_ERROR_MESSAGE,
          test: (value) => yupCustomValidation.isNotContainSpaces(value),
        }),
    }),
  }),
  [WorkerOnboardingPage.BANK_DETAILS]: yup.object({
    workerUser: yup.object().shape({
      bankAccount: yup.object().shape({
        beneficiaryName: yup
          .string()
          .nullable()
          .required(REQUIRED_FIELD_ERROR_MESSAGE),
        accountNumber: yup
          .string()
          .nullable()
          .required(REQUIRED_FIELD_ERROR_MESSAGE)
          .test({
            message: CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
            test: (value) => yupCustomValidation.isNumeric(value),
          })
          .test({
            message: CONTAIN_SPACES_ERROR_MESSAGE,
            test: (value) => yupCustomValidation.isNotContainSpaces(value),
          }),
        bank: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
        branchCode: yup
          .string()
          .nullable()
          .required(REQUIRED_FIELD_ERROR_MESSAGE)
          .test({
            message: CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
            test: (value) => yupCustomValidation.isAlphaNumeric(value),
          })
          .test({
            message: CONTAIN_SPACES_ERROR_MESSAGE,
            test: (value) => yupCustomValidation.isNotContainSpaces(value),
          }),
      }),
    }),
  }),
};
