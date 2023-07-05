import {
  CompanyCategory,
  CompanyInterest,
  EntityLinkOptionsType,
  EntityLinkStatus,
} from '@ayp/typings/entities';
import { yupCustomValidation } from '@ayp/utils';
import * as yup from 'yup';

import { CreateCompanyAccountFormValues } from '@components/commons/create-company-account-form/config';
import { EMAIL_DOMAIN_ADDRESS_BLACKLIST } from '@configs/constants';
import {
  BUSINESS_EMAIL_FIELD_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
  INVALID_PERMIT_TYPE_FIELD_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from '@configs/forms';

export interface LinkEntityBaseFormValues {
  entityLinkOptions: string;
}

export interface LinkNewEntityFormValues
  extends LinkEntityBaseFormValues,
    CreateCompanyAccountFormValues {
  linkingType: Nullable<EntityLinkStatus>;
}

export interface LinkExistingEntityFormValues extends LinkEntityBaseFormValues {
  linkingCompanyId: string;
  linkingType: Nullable<EntityLinkStatus>;
}

export type LinkEntityFormValues =
  | LinkNewEntityFormValues
  | LinkExistingEntityFormValues
  | LinkEntityBaseFormValues;

export const initialLinkEntityBaseFormValues = {
  entityLinkOptions: '',
};

export const initialNewEntityFormValues: LinkNewEntityFormValues = {
  entityLinkOptions: EntityLinkOptionsType.NEW_ENTITY,
  firstName: '',
  lastName: '',
  companyName: '',
  country: null,
  jobTitle: '',
  email: '',
  password: '',
  interest: '',
  hasCategoryField: true,
  category: null,
  hasIndustryField: true,
  industry: null,
  linkingType: null,
};

export const initialExistingEntityFormValues: LinkExistingEntityFormValues = {
  entityLinkOptions: EntityLinkOptionsType.EXISTING_ENTITY,
  linkingCompanyId: '',
  linkingType: null,
};

export const validationExistingEntitySchema = yup.object({
  linkingCompanyId: yup.string().required(REQUIRED_FIELD_ERROR_MESSAGE),
  linkingType: yup
    .mixed()
    .oneOf(
      Object.values(EntityLinkStatus),
      INVALID_PERMIT_TYPE_FIELD_ERROR_MESSAGE
    )
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
});

export const validationBaseLinkEntitySchema = yup.object({
  entityLinkOptions: yup
    .mixed()
    .oneOf(
      Object.values(EntityLinkOptionsType),
      INVALID_PERMIT_TYPE_FIELD_ERROR_MESSAGE
    )
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
});

export const validationNewEntitySchema = yup.object({
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
  linkingType: yup
    .mixed()
    .oneOf(
      Object.values(EntityLinkStatus),
      INVALID_PERMIT_TYPE_FIELD_ERROR_MESSAGE
    )
    .required(REQUIRED_FIELD_ERROR_MESSAGE),
});

export enum LinkEntityModalErrorMessages {
  LINKING_COMPANY_IS_ALREADY_A_SUBSIDIARY = 'LinkingCompanyIsAlreadyASubsidiary',
  LINKING_COMPANY_IS_ALREADY_A_PARENT = 'LinkingCompanyIsAlreadyAParent',
  LINKING_COMPANY_IS_NOT_FOUND = 'LinkingCompanyIsNotFound',
  SAME_ENTITY_ID_CAN_NOT_BE_LINKED = 'SameEntityIdCannotBeLinked',
}
