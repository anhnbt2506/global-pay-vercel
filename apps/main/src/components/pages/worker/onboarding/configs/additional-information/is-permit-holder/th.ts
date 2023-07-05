import * as yup from 'yup';
import type { YupTestContext } from '@ayp/typings/commons';
import { MaritalStatus } from '@ayp/typings/entities';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';
import { WorkerOnboardingFormValues } from '@components/pages/worker/onboarding/config';

export const mapAdditionalInformation = (
  additionalInfo: Record<string, unknown>
): Record<string, unknown> => Object.assign({}, { additionalInfo });

export const validationSchema = yup.object({
  additionalInfo: yup.object({
    fatherAllowance: yup
      .string()
      .nullable()
      .trim()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    motherAllowance: yup
      .string()
      .nullable()
      .trim()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    spouseFatherAllowance: yup
      .string()
      .nullable()
      .test({
        message: REQUIRED_FIELD_ERROR_MESSAGE,
        test: function (value) {
          const parent = (this as YupTestContext<WorkerOnboardingFormValues>)
            .from[1].value;

          if (parent?.workerUser?.maritalStatus === MaritalStatus.MARRIED) {
            return !!value;
          }

          return true;
        },
      }),
    spouseMotherAllowance: yup
      .string()
      .nullable()
      .test({
        message: REQUIRED_FIELD_ERROR_MESSAGE,
        test: function (value) {
          const parent = (this as YupTestContext<WorkerOnboardingFormValues>)
            .from[1].value;

          if (parent?.workerUser?.maritalStatus === MaritalStatus.MARRIED) {
            return !!value;
          }

          return true;
        },
      }),
    insurancePremium: yup
      .string()
      .nullable()
      .trim()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    spouseInsurancePremium: yup
      .string()
      .nullable()
      .test({
        message: REQUIRED_FIELD_ERROR_MESSAGE,
        test: function (value) {
          const parent = (this as YupTestContext<WorkerOnboardingFormValues>)
            .from[1].value;

          if (parent?.workerUser?.maritalStatus === MaritalStatus.MARRIED) {
            return !!value;
          }

          return true;
        },
      }),
    fatherInsurancePremium: yup
      .string()
      .nullable()
      .trim()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    motherInsurancePremium: yup
      .string()
      .nullable()
      .trim()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    interestHousingLoan: yup
      .string()
      .nullable()
      .trim()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    educationDonationAmount: yup
      .string()
      .nullable()
      .trim()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    rmfAllowance: yup
      .string()
      .nullable()
      .trim()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    ltfAllowance: yup
      .string()
      .nullable()
      .trim()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    hospitalForUnemploymentInsurance: yup
      .string()
      .nullable()
      .trim()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    houseRegistrationFile: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
  workerIdentity: yup.object({
    permitIdFile: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
