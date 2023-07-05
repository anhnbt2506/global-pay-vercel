import jsonUpdateSuccess from '../../../fixtures/worker-employment/update/200-success.json';
import json403Error from '../../../fixtures/common/403-forbidden-error.json';

const routes = [
  {
    id: 'people/v1/worker-employment/update',
    url: '/people/v1/worker-employment/:employmentId',
    method: 'PATCH',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: jsonUpdateSuccess,
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
    ],
  },
];

export default routes;
