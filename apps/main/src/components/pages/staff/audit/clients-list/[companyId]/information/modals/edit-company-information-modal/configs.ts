import * as yup from 'yup';
import { CompanyCategory } from '@ayp/typings/entities';
import { mapFilterObject } from '@ayp/utils';

import {
  INVALID_POSTAL_CODE_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

import { CompanyOnboardingEditFormValues } from '../../configs';

export const mapToRequestBody = (
  state: CompanyOnboardingEditFormValues
): Record<string, unknown> =>
  mapFilterObject(
    Object.assign(
      {},
      {
        address: {
          addressLine: state.address?.addressLine,
          city: state.address?.city,
          state: state.address?.state,
          postalCode: state.address?.postalCode,
          countryCode: state.address?.country?.code,
        },
        category: state.category,
        industryId: state.industry?.industryId,
      }
    ),
    (value) => (value !== '' ? value : null)
  );

export const validationSchema = yup.object({
  address: yup.object({
    country: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    addressLine: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    city: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    state: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    postalCode: yup
      .number()
      .typeError(INVALID_POSTAL_CODE_ERROR_MESSAGE)
      .positive(INVALID_POSTAL_CODE_ERROR_MESSAGE)
      .required(INVALID_POSTAL_CODE_ERROR_MESSAGE),
  }),
  industry: yup.object({
    industryId: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
  }),
  category: yup
    .string()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .oneOf(Object.keys(CompanyCategory)),
});
