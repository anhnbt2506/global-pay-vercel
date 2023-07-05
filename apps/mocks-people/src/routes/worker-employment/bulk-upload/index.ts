import jsonSuccess from '../../../fixtures/worker-employment/bulk-upload/200-success.json';
import json404NotFound from '../../../fixtures/common/404-not-found-error.json';

const routes = [
  {
    id: 'people/v1/worker-employment/bulk-upload',
    url: '/people/v1/worker-employment/bulk-upload',
    method: 'POST',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: jsonSuccess,
        },
      },
      {
        id: '404-not-found-error',
        type: 'json',
        options: {
          status: 404,
          body: json404NotFound,
        },
      },
    ],
  },
];

export default routes;
