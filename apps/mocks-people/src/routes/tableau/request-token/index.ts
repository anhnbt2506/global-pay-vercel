import json200Success from '../../../fixtures/tableau/request-token/200-success.json';
import json400UsernameIsInvalid from '../../../fixtures/tableau/request-token/400-username-is-invalid.json';
import json400RedirectOnboardingCompanyError from '../../../fixtures/tableau/request-token/400-redirect-onboarding-company-error.json';

const routes = [
  {
    id: 'people/v1/tableau/request-token',
    url: '/people/v1/tableau/request-token',
    method: 'POST',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200Success,
        },
      },
      {
        id: '400-username-is-invalid',
        type: 'json',
        options: {
          status: 400,
          body: json400UsernameIsInvalid,
        },
      },
      {
        id: '400-redirect-onboarding-company-error',
        type: 'json',
        options: {
          status: 400,
          body: json400RedirectOnboardingCompanyError,
        },
      },
    ],
  },
];

export default routes;
