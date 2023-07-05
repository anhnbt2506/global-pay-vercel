import json200Success from '../../../fixtures/company/list/200-success.json';
import json200Empty from '../../../fixtures/company/list/200-empty.json';
import json400Error from '../../../fixtures/common/400-unknown-error.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';

const routes = [
  {
    id: 'people/v1/company/list',
    url: '/people/v1/company/list',
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
        id: '200-empty',
        type: 'json',
        options: {
          status: 200,
          body: json200Empty,
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
      {
        id: '500-internal-error',
        type: 'json',
        options: {
          status: 500,
          body: json500Error,
        },
      },
    ],
  },
  {
    id: 'people/v1/company/list-all',
    url: '/people/v1/company/list-all',
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
    ],
  },
];

export default routes;
