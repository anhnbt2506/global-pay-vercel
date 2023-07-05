import { PermitType } from '@ayp/typings/entities';
import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  CONTAIN_ONLY_ALPHA_AND_NUMERIC_ERROR_MESSAGE,
  CONTAIN_SPACES_ERROR_MESSAGE,
  INVALID_PERMIT_TYPE_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export const mapIdentification = (
  workerIdentity: Record<string, unknown>
): Record<string, unknown> => Object.assign({}, workerIdentity);

export const validationSchema = yup.object({
  workerIdentity: yup.object({
    permitId: yup
      .string()
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
    permitExpiryDate: yup
      .date()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    permitIssuedPlace: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
    permitType: yup
      .mixed()
      .oneOf(Object.values(PermitType), INVALID_PERMIT_TYPE_FIELD_ERROR_MESSAGE)
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
