import jsonSuccess from '../../../fixtures/worker-employment/validate/200-success.json';
import jsonFail from '../../../fixtures/worker-employment/validate/200-fail.json';
import json404NotFound from '../../../fixtures/common/404-not-found-error.json';

const routes = [
  {
    id: 'people/v1/worker-employment/validate',
    url: '/people/v1/worker-employment/validate',
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
        id: '200-fail',
        type: 'json',
        options: {
          status: 200,
          body: jsonFail,
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
