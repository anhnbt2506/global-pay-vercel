import {
  CitizenshipStatus,
  PermitType,
  WorkerUser,
} from '@ayp/typings/entities';
import { isTypeOf, mapFilterObject, yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';
import { format } from 'date-fns';

import {
  INVALID_PERMIT_TYPE_FIELD_ERROR_MESSAGE,
  INVALID_DATE_FIELD_ERROR_MESSAGE,
  CONTAIN_SPACES_ERROR_MESSAGE,
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';
import { GP_BACKEND_DATE_FORMAT } from '@configs/constants';

import { WorkerEmploymentFormValues } from '../../config';

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

export const mapToRequestBody = (
  state: WorkerEmploymentFormValues
): Record<string, unknown> =>
  mapFilterObject(
    Object.assign(
      {},
      {
        workerUser: {
          userContext: {
            user: {
              email: state.workerUser.userContext.user.email,
            },
          },
        },
      },
      {
        citizenshipStatus: state.citizenshipStatus,
      },
      {
        workerIdentity: Object.assign(
          {},
          state?.workerIdentity,
          state?.workerIdentity?.nationalIdIssuedDate && {
            nationalIdIssuedDate: format(
              new Date(state.workerIdentity.nationalIdIssuedDate),
              GP_BACKEND_DATE_FORMAT
            ),
          },
          state?.workerIdentity?.passportIssuedDate && {
            passportIssuedDate: format(
              new Date(state.workerIdentity.passportIssuedDate),
              GP_BACKEND_DATE_FORMAT
            ),
          },
          state?.workerIdentity?.permitIssuedDate && {
            permitIssuedDate: format(
              new Date(state.workerIdentity.permitIssuedDate),
              GP_BACKEND_DATE_FORMAT
            ),
          }
        ),
      },
      {
        additionalInfo: {
          oldPermitId: state?.additionalInfo?.oldPermitId,
        },
      }
    ),
    (value, key) => mapFunction(value, key)
  );

export const permitHolderValidationSchema = yup.object({
  permitType: yup
    .mixed()
    .nullable()
    .oneOf(Object.values(PermitType), INVALID_PERMIT_TYPE_FIELD_ERROR_MESSAGE)
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  permitId: yup
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
  permitIssuedDate: yup
    .date()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  permitIssuedPlace: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  permitIssuedPlaceAlternate: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  oldPermitId: yup
    .string()
    .nullable()
    .test({
      message: CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isAlphaNumeric(value),
    })
    .test({
      message: CONTAIN_SPACES_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isNotContainSpaces(value),
    }),
});

export const validationSchema = yup.object({
  workerUser: yup.object().shape({
    userContext: yup.object().shape({
      user: yup.object().shape({
        email: yup
          .string()
          .nullable()
          .trim()
          .required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
    }),
  }),
  citizenshipStatus: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
  workerIdentity: yup
    .object({
      taxId: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
      nationalId: yup
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
      nationalIdIssuedDate: yup
        .date()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE),
      nationalIdIssuedPlace: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      nationalIdIssuedPlaceAlternate: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      passportNumber: yup
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
      passportIssuedDate: yup
        .date()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE),
      passportIssuedPlace: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      passportIssuedPlaceAlternate: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
    })
    .when('citizenshipStatus', {
      is: CitizenshipStatus.PERMIT_HOLDER,
      then: (schema) => schema.concat(permitHolderValidationSchema),
    }),
});
