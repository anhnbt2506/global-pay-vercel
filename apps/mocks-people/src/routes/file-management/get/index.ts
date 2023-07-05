import json200Success from '../../../fixtures/file-management/get/200-success.json';
import json404Error from '../../../fixtures/common/404-not-found-error.json';
import json403Error from '../../../fixtures/common/403-forbidden-error.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';
import jsonUnknownError from '../../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/file-management/get',
    url: '/people/v1/file-management/get',
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
        id: '404-error',
        type: 'json',
        options: {
          status: 404,
          body: json404Error,
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
        id: '500-error',
        type: 'json',
        options: {
          status: 500,
          body: json500Error,
        },
      },
      {
        id: 'unknown-error',
        type: 'json',
        options: {
          status: 400,
          body: jsonUnknownError,
        },
      },
    ],
  },
];

export default routes;
