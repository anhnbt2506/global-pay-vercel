import json200OnboardingSuccess from '../../../fixtures/company/people/200-onboarding-list-success.json';
import json200EmptyOnboardingSuccess from '../../../fixtures/company/people/200-onboarding-list-empty-success.json';
import json404Error from '../../../fixtures/common/404-not-found-error.json';
import json200CompanySuccess from '../../../fixtures/company/people/200-get-company-success.json';
import json200AgreementTemplateSuccess from '../../../fixtures/company/people/200-get-agreement-template-success.json';

const routes = [
  {
    id: 'people/v1/company/people/onboarding/get-company',
    url: '/people/v1/company',
    method: 'GET',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200CompanySuccess,
        },
      },
    ],
  },
  {
    id: 'people/v1/company/people/onboarding/get-list',
    url: '/people/v1/worker-employment',
    method: 'GET',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200OnboardingSuccess,
        },
      },
      {
        id: '200-empty-success',
        type: 'json',
        options: {
          status: 200,
          body: json200EmptyOnboardingSuccess,
        },
      },
      {
        id: '404-not-found-error',
        type: 'json',
        options: {
          status: 404,
          body: json404Error,
        },
      },
    ],
  },
  {
    id: 'people/v1/company/people/onboarding/get-agreement-template',
    url: '/people/v1/agreement-template/:agreementTemplateId/preview',
    method: 'POST',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200AgreementTemplateSuccess,
        },
      },
    ],
  },
];

export default routes;
