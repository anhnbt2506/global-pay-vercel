import { mapFilterObject, yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  CONTAIN_SPACES_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
  CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
} from '@configs/forms';

import { WorkerEmploymentFormValues } from '../../config';

export const mapToRequestBody = (
  state: WorkerEmploymentFormValues
): Record<string, unknown> =>
  mapFilterObject(
    Object.assign(
      {},
      {
        workerUser: {
          bankAccount: {
            beneficiaryName: state.workerUser.bankAccount.beneficiaryName,
            accountNumber: state.workerUser.bankAccount.accountNumber,
            bankId: state.workerUser.bankAccount.bank?.id,
            branchCode: state.workerUser.bankAccount.branchCode,
          },
        },
      }
    ),
    (value) => (value !== '' ? value : null)
  );

export const validationSchema = yup.object({
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
});
