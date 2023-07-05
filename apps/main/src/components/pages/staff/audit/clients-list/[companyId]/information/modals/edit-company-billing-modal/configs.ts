import * as yup from 'yup';
import { CompanyBillingAddressType } from '@ayp/typings/entities';
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
        billingAddressType: state.billingAddressType,
        billingAddress: {
          addressLine: state.billingAddress?.addressLine,
          city: state.billingAddress?.city,
          state: state.billingAddress?.state,
          postalCode: state.billingAddress?.postalCode,
          countryCode: state.billingAddress?.country?.code,
        },
      }
    ),
    (value) => (value !== '' ? value : null)
  );

export const validationSchema = yup.object({
  billingAddressType: yup
    .string()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .oneOf(Object.keys(CompanyBillingAddressType)),
  billingAddress: yup.object().when('billingAddressType', {
    is: CompanyBillingAddressType.ALTERNATE_ADDRESS,
    then: (schema) =>
      schema.shape({
        country: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
        addressLine: yup
          .string()
          .nullable()
          .required(REQUIRED_FIELD_ERROR_MESSAGE),
        city: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
        state: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
        postalCode: yup
          .number()
          .typeError(INVALID_POSTAL_CODE_ERROR_MESSAGE)
          .positive(INVALID_POSTAL_CODE_ERROR_MESSAGE)
          .required(INVALID_POSTAL_CODE_ERROR_MESSAGE),
      }),
  }),
});
