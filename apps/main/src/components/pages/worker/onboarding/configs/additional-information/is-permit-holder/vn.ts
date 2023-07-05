import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

export const mapAdditionalInformation = (
  additionalInfo: Record<string, unknown>
): Record<string, unknown> => Object.assign({}, { additionalInfo });

export const validationSchema = yup.object({
  workerIdentity: yup.object({
    permitIdFile: yup.mixed().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
});
