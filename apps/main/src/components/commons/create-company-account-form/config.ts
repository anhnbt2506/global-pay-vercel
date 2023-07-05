import { CompanyCategory, CompanyInterest } from '@ayp/typings/entities';
import { CountryOption } from '@ayp/typings/ui';
import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import {
  BUSINESS_EMAIL_FIELD_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

import { EMAIL_DOMAIN_ADDRESS_BLACKLIST } from '@configs/constants';

export const initialValues: CreateCompanyAccountFormValues = {
  firstName: '',
  lastName: '',
  companyName: '',
  country: null,
  jobTitle: '',
  email: '',
  password: '',
  interest: '',
  hasCategoryField: false,
  category: null,
  industry: null,
  hasIndustryField: false,
};

export interface CreateCompanyAccountFormValues {
  firstName: string;
  lastName: string;
  companyName: string;
  country: Nullable<CountryOption>;
  jobTitle: string;
  email: string;
  password: string;
  interest: string;
  hasCategoryField: boolean;
  category: Nullable<CompanyCategory>;
  hasIndustryField?: boolean;
  industry: Nullable<string>;
}

export const validationSchema = yup.object({
  firstName: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
  lastName: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
  companyName: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  country: yup.object().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
  jobTitle: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
  email: yup
    .string()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .email(BUSINESS_EMAIL_FIELD_ERROR_MESSAGE)
    .test({
      message: BUSINESS_EMAIL_FIELD_ERROR_MESSAGE,
      test: (value) =>
        yupCustomValidation.isValidBusinessEmail(
          value,
          EMAIL_DOMAIN_ADDRESS_BLACKLIST
        ),
    }),
  password: yup
    .string()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .test({
      message: INVALID_PASSWORD_ERROR_MESSAGE,
      test: (value) => yupCustomValidation.isMinPasswordRequirementMeet(value),
    }),
  interest: yup
    .string()
    .required(REQUIRED_FIELD_ERROR_MESSAGE)
    .oneOf(Object.keys(CompanyInterest)),
  industry: yup
    .string()
    .nullable()
    .when('hasIndustryField', {
      is: true,
      then: yup.string().nullable().required(REQUIRED_FIELD_ERROR_MESSAGE),
    }),
  category: yup
    .string()
    .nullable()
    .when('hasCategoryField', {
      is: true,
      then: yup
        .string()
        .nullable()
        .required(REQUIRED_FIELD_ERROR_MESSAGE)
        .oneOf(Object.keys(CompanyCategory)),
    }),
});
