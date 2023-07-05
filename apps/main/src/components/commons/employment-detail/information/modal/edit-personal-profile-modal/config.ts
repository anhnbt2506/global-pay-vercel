import {
  Gender,
  MaritalStatus,
  Race,
  Religion,
  WorkerUser,
} from '@ayp/typings/entities';
import { isTypeOf, mapFilterObject, yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';
import { format } from 'date-fns';

import {
  INVALID_CONTACT_NUMBER_FIELD_ERROR_MESSAGE,
  INVALID_DATE_FIELD_ERROR_MESSAGE,
  INVALID_GENDER_FIELD_ERROR_MESSAGE,
  INVALID_MARITAL_STATUS_FIELD_ERROR_MESSAGE,
  INVALID_POSTAL_CODE_ERROR_MESSAGE,
  INVALID_RACE_FIELD_ERROR_MESSAGE,
  INVALID_RELIGION_FIELD_ERROR_MESSAGE,
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
          ...state.workerUser,
          dateOfBirth: format(
            new Date(state.workerUser.dateOfBirth),
            GP_BACKEND_DATE_FORMAT
          ),
        },
      },
      { nationalityCode: state.nationalityCode?.code },
      {
        workerContact: {
          contactNumber: state.workerContact.contactNumber,
          contactNumberCountryCode:
            state.workerContact.contactNumberCountryCode?.code,
        },
      }
    ),
    (value, key) => mapFunction(value, key)
  );

export const validationSchema = yup.object({
  workerUser: yup.object().shape({
    userContext: yup.object().shape({
      user: yup.object().shape({
        firstName: yup
          .string()
          .nullable()
          .trim()
          .required(REQUIRED_FIELD_ERROR_MESSAGE),
        lastName: yup
          .string()
          .nullable()
          .trim()
          .required(REQUIRED_FIELD_ERROR_MESSAGE),
        firstNameAlternate: yup
          .string()
          .nullable()
          .trim()
          .required(REQUIRED_FIELD_ERROR_MESSAGE),
        lastNameAlternate: yup
          .string()
          .nullable()
          .trim()
          .required(REQUIRED_FIELD_ERROR_MESSAGE),
      }),
    }),
    address: yup.object().shape({
      addressLine: yup
        .string()
        .nullable()
        .trim()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      city: yup
        .string()
        .nullable()
        .trim()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      state: yup
        .string()
        .nullable()
        .trim()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      postalCode: yup
        .number()
        .nullable()
        .typeError(INVALID_POSTAL_CODE_ERROR_MESSAGE)
        .positive(INVALID_POSTAL_CODE_ERROR_MESSAGE)
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      addressLineAlternate: yup
        .string()
        .nullable()
        .trim()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      cityAlternate: yup
        .string()
        .nullable()
        .trim()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      stateAlternate: yup
        .string()
        .nullable()
        .trim()
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
      postalCodeAlternate: yup
        .number()
        .nullable()
        .typeError(INVALID_POSTAL_CODE_ERROR_MESSAGE)
        .positive(INVALID_POSTAL_CODE_ERROR_MESSAGE)
        .required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
    dateOfBirth: yup
      .date()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_DATE_FIELD_ERROR_MESSAGE),
    gender: yup
      .mixed()
      .nullable()
      .oneOf(Object.values(Gender), INVALID_GENDER_FIELD_ERROR_MESSAGE)
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_GENDER_FIELD_ERROR_MESSAGE),
    religion: yup
      .mixed()
      .nullable()
      .oneOf(Object.values(Religion))
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_RELIGION_FIELD_ERROR_MESSAGE),
    race: yup
      .mixed()
      .nullable()
      .oneOf(Object.values(Race))
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_RACE_FIELD_ERROR_MESSAGE),
    maritalStatus: yup
      .mixed()
      .nullable()
      .oneOf(Object.values(MaritalStatus))
      .required(REQUIRED_FIELD_ERROR_MESSAGE)
      .typeError(INVALID_MARITAL_STATUS_FIELD_ERROR_MESSAGE),
  }),
  nationalityCode: yup
    .object()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
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
});
