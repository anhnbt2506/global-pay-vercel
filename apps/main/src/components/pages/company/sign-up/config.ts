import { mapFilterObject } from '@ayp/utils';

import { AuthRegisterRequest } from '@services/apis/people';
import { CreateCompanyAccountFormValues } from '@components/commons/create-company-account-form/config';

export enum CompanySignUpPage {
  CREATE_ACCOUNT,
  EMAIL_VERIFICATION,
}

export const mapToRequestBody = (
  state: CreateCompanyAccountFormValues,
  hubspotUtk = ''
): AuthRegisterRequest =>
  mapFilterObject(
    Object.assign(
      {},
      {
        type: 'company',
        firstName: state.firstName,
        lastName: state.lastName,
        name: state.companyName,
        countryCode: state.country?.code,
        jobTitle: state.jobTitle,
        email: state.email,
        password: state.password,
        interest: state.interest,
        hubspotUtk,
      }
    ),
    (value) => (value ? value : null)
  ) as AuthRegisterRequest;
