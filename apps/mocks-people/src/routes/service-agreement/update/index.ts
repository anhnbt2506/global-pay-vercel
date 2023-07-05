import json200Success from '../../../fixtures/service-agreement/update/200-success.json';
import json404NotFound from '../../../fixtures/common/404-not-found-error.json';
import json500Unknown from '../../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/service-agreement/update',
    url: '/people/v1/service-agreement/:serviceAgreementId',
    method: 'PATCH',
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
        id: '404-not-found',
        type: 'json',
        options: {
          status: 404,
          body: json404NotFound,
        },
      },
      {
        id: '500-unknown',
        type: 'json',
        options: {
          status: 500,
          body: json500Unknown,
        },
      },
    ],
  },
];

export default routes;
