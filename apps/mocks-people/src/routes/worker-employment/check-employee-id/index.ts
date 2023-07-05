import jsonSuccess from '../../../fixtures/worker-employment/check-employee-id/200-success.json';
import jsonFail from '../../../fixtures/worker-employment/check-employee-id/200-fail.json';
import json400UnknownError from '../../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/worker-employment/check-employee-id',
    url: '/people/v1/worker-employment/check-employee-id',
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
        id: '400-unknown-error',
        type: 'json',
        options: {
          status: 404,
          body: json400UnknownError,
        },
      },
    ],
  },
];

export default routes;
