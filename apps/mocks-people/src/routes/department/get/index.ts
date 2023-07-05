import json200Success from '../../../fixtures/department/get/200-success.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';
import json400Error from '../../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/department',
    url: '/people/v1/department',
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
          body: json500Error,
        },
      },
      {
        id: '400-unknown-error',
        type: 'json',
        options: {
          status: 400,
          body: json400Error,
        },
      },
    ],
  },
];

export default routes;
