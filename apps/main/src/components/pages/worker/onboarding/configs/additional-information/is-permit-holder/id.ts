import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export const mapAdditionalInformation = (
  additionalInfo: Record<string, unknown>
): Record<string, unknown> => Object.assign({}, { additionalInfo });

export const validationSchema = yup.object({
  additionalInfo: yup.object({
    numberOfChildren: yup.number().required(REQUIRED_FIELD_ERROR_MESSAGE),
    familyCardFile: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    npwpCardFile: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    bpjsKetenagakerjaanCardFile: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
    bpjsKesehatanCardFile: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
  workerIdentity: yup.object({
    permitIdFile: yup
      .string()
      .nullable()
      .required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
