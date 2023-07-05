import json200SuccessOnboardingStepInformation from '../../../fixtures/company/onboard/200-success-onboarding-step-information.json';
import json200SuccessOnboardingStepInvoicing from '../../../fixtures/company/onboard/200-success-onboarding-step-invoicing.json';
import json200SuccessOnboardingStepInreview from '../../../fixtures/company/onboard/200-success-onboarding-step-inreview.json';

const routes = [
  {
    id: 'people/v1/company/onboard',
    url: '/people/v1/company/onboard',
    method: 'GET',
    variants: [
      {
        id: '200-success-onboarding-step-information',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessOnboardingStepInformation,
        },
      },
      {
        id: '200-success-onboarding-step-invoicing',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessOnboardingStepInvoicing,
        },
      },
      {
        id: '200-success-onboarding-step-inreview',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessOnboardingStepInreview,
        },
      },
    ],
  },
];

export default routes;
