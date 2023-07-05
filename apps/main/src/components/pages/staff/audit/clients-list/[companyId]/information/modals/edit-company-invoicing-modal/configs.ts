import { CountryCode } from '@ayp/typings/commons';
import { mapFilterObject } from '@ayp/utils';
import * as yup from 'yup';

import { REQUIRED_FIELD_ERROR_MESSAGE } from '@configs/forms';

import { CompanyOnboardingEditFormValues } from '../../configs';

export const mapToRequestBody = (
  state: CompanyOnboardingEditFormValues
): Record<string, unknown> =>
  mapFilterObject(
    Object.assign(
      {},
      {
        registrationId: state.registrationId,
        taxId: state.taxId,
        currency: state.currency?.code,
        hasSgEntity: state.hasSgEntity,
        sgEntityUen: state.sgEntityUen,
        sgEntityName: state.sgEntityName,
      }
    ),
    (value) => (value !== '' ? value : null)
  );

export const validationSchema = yup.object({
  registrationId: yup
    .string()
    .nullable()
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
  taxId: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  currency: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  hasSgEntity: yup
    .boolean()
    .nullable()
    .when('address.countryCode', (value, schema) =>
      value !== CountryCode.SINGAPORE
        ? yup.boolean().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE)
        : schema
    ),
  sgEntityUen: yup
    .string()
    .nullable()
    .when('hasSgEntity', {
      is: true,
      then: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .min(
          9,
          'company-onboarding:companyInvoicing.form.sgEntityUen.error.valueMustMeetRequiredLength'
        )
        .max(
          10,
          'company-onboarding:companyInvoicing.form.sgEntityUen.error.valueMustMeetRequiredLength'
        ),
    }),
  sgEntityName: yup
    .string()
    .nullable()
    .when('hasSgEntity', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
});
