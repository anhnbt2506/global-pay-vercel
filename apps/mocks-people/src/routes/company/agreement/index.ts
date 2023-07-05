import json200Success from '../../../fixtures/company/agreement/200-success.json';
import json404Error from '../../../fixtures/common/404-not-found-error.json';
import json403Error from '../../../fixtures/common/403-forbidden-error.json';

const routes = [
  {
    id: 'people/v1/company/agreement',
    url: '/people/v1/agreement/:id',
    method: 'GET',
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
        id: '403-forbidden-error',
        type: 'json',
        options: {
          status: 403,
          body: json403Error,
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
];

export default routes;
