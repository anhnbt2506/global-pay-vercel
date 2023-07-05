import json200Success from '../../../fixtures/worker-employment/patch/200-success.json';
import json400Error from '../../../fixtures/common/400-unknown-error.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';
import json403Error from '../../../fixtures/common/403-forbidden-error.json';

const routes = [
  {
    id: 'people/v1/worker-employment/patch',
    url: '/people/v1/worker-employment/:employmentId',
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
        id: '400-error',
        type: 'json',
        options: {
          status: 400,
          body: json400Error,
        },
      },
      {
        id: '403-error',
        type: 'json',
        options: {
          status: 400,
          body: json403Error,
        },
      },
      {
        id: '500-error',
        type: 'json',
        options: {
          status: 500,
          body: json500Error,
        },
      },
    ],
  },
];

export default routes;
