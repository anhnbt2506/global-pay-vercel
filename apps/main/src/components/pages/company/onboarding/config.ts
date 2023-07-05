import { CountryCode } from '@ayp/typings/commons';
import { Company } from '@ayp/typings/entities';
import { CurrencyOption } from '@ayp/typings/ui';
import { mapFilterObject } from '@ayp/utils';
import * as yup from 'yup';

import {
  INVALID_POSTAL_CODE_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export interface CompanyOnboardingFormValues
  extends Omit<
    Company,
    | 'id'
    | 'companyId'
    | 'industryId'
    | 'status'
    | 'name'
    | 'addressId'
    | 'currency'
    | 'industry'
    | 'signedAgreements'
    | 'registeredById'
    | 'registeredBy'
    | 'createdById'
    | 'createdBy'
    | 'billingAddressType'
    | 'billingAddressId'
    | 'billingAddress'
  > {
  currency: Nullable<CurrencyOption>;
}

export const mapToCompanyOnboardingFormValues = (
  company: Omit<
    Company,
    | 'id'
    | 'companyId'
    | 'status'
    | 'registeredById'
    | 'registeredBy'
    | 'createdById'
    | 'createdBy'
  >,
  currencies: CurrencyOption[]
): CompanyOnboardingFormValues => ({
  address: company.address,
  registrationId: company.registrationId ?? '',
  taxId: company.taxId ?? '',
  hasSgEntity: company.hasSgEntity,
  sgEntityUen: company.sgEntityUen,
  sgEntityName: company.sgEntityName,
  currency: company.currency
    ? (currencies.find(
        (currency) => currency.code === company.currency
      ) as CurrencyOption)
    : null,
  category: company.category,
  entityLinkStatus: company.entityLinkStatus,
  parentId: company.parentId,
});

export const mapToRequestBody = (state: CompanyOnboardingFormValues) =>
  mapFilterObject(
    Object.assign(
      {},
      {
        address: {
          addressLine: state.address?.addressLine,
          city: state.address?.city,
          state: state.address?.state,
          postalCode: state.address?.postalCode,
          countryCode: state.address?.countryCode,
        },
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

export const validationSchema = [
  yup.object({
    address: yup.object({
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
  yup.object({
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
  }),
];
