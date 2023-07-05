import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  CONTAIN_ONLY_NUMERIC_ERROR_MESSAGE,
  CONTAIN_SPACES_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export const initialBankAccount = {
  beneficiaryName: null,
  accountNumber: null,
  bankId: null,
  branchCode: null,
};

export const bankAccountValidationSchema = yup
  .object()
  .nullable()
  .shape({
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
    bankId: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
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
  });
