import json200Success from '../../../fixtures/worker-user/get-home/200-success.json';
import json400RedirectError from '../../../fixtures/worker-user/get-home/400-redirect-error.json';

const routes = [
  {
    id: 'people/v1/worker-user/get-home',
    url: '/people/v1/worker-user/home',
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
        id: '400-redirect-error',
        type: 'json',
        options: {
          status: 500,
          body: json400RedirectError,
        },
      },
    ],
  },
];

export default routes;
