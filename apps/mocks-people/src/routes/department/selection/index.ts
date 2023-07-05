import json200Success from '../../../fixtures/department/selection/200-success.json';
import json403Error from '../../../fixtures/common/403-forbidden-error.json';
import json400Error from '../../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/department/selection',
    url: '/people/v1/department/selection',
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
        id: '403-error',
        type: 'json',
        options: {
          status: 403,
          body: json403Error,
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
    ],
  },
];

export default routes;
