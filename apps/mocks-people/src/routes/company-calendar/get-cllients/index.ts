import json200Success from '../../../fixtures/company-calendar/get-clients/200-success.json';
import json500InternalServerError from '../../../fixtures/common/500-internal-server-error.json';

const routes = [
  {
    id: 'people/v1/company-calendar/clients',
    url: '/people/v1/company-calendar/clients',
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
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500InternalServerError,
        },
      },
    ],
  },
];

export default routes;
