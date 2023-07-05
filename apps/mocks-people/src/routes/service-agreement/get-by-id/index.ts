import json200SuccessWaitingConfirmationStatus from '../../../fixtures/service-agreement/get-by-id/200-success-waiting-confirmation-status.json';
import json200SuccessInReviewStatus from '../../../fixtures/service-agreement/get-by-id/200-success-in-review-status.json';

const routes = [
  {
    id: 'people/v1/service-agreement/get-by-id',
    url: '/people/v1/service-agreement/:serviceAgreementId',
    method: 'GET',
    variants: [
      {
        id: '200-success-waiting-confirmation-status',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessWaitingConfirmationStatus,
        },
      },
      {
        id: '200-success-in-review-status',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessInReviewStatus,
        },
      },
    ],
  },
];

export default routes;
