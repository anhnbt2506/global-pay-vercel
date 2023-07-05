import json200SignAgreementSuccess from '../../../fixtures/worker-employment/sign-agreement/200-success.json';
import json500InternalServerError from '../../../fixtures/common/500-internal-server-error.json';
import json403ForbiddenError from '../../../fixtures/common/403-forbidden-error.json';
import json400UnknownError from '../../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/worker-employment/sign-agreement',
    url: '/people/v1/worker-employment/:employmentId/sign-agreement',
    method: 'PATCH',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200SignAgreementSuccess,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500InternalServerError,
        },
      },
      {
        id: '403-forbidden-error',
        type: 'json',
        options: {
          status: 403,
          body: json403ForbiddenError,
        },
      },
      {
        id: '400-unknown-error',
        type: 'json',
        options: {
          status: 400,
          body: json400UnknownError,
        },
      },
    ],
  },
];

export default routes;
