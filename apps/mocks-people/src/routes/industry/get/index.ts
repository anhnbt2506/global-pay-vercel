import json200Success from '../../../fixtures/industry/get/200-success.json';
import json200EmptySuccess from '../../../fixtures/industry/get/200-success-empty.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';
import json400Error from '../../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/industry',
    url: '/people/v1/industry',
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
        id: '200-success-return-empty',
        type: 'json',
        options: {
          status: 200,
          body: json200EmptySuccess,
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
