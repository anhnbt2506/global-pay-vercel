import json200Success from '../../../fixtures/company/get/200-success.json';
import json403Error from '../../../fixtures/common/403-forbidden-error.json';
import json400UnknownError from '../../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/company/get',
    url: '/people/v1/company',
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
        id: '403-forbidden-error',
        type: 'json',
        options: {
          status: 403,
          body: json403Error,
        },
      },
      {
        id: '400-unknown-error',
        type: 'json',
        options: {
          status: 400,
          body: json400UnknownError,
        },
      },
    ],
  },
];

export default routes;
