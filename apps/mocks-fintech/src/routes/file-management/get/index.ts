import json200Success from '../../../fixtures/file-management/get/200-success.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';
import json500UnknownError from '../../../fixtures/common/500-unknown-error.json';

const routes = [
  {
    id: 'fintech/v1/file-management/get',
    url: '/fintech/v1/file-management/get',
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
        id: '500-unknown-error',
        type: 'json',
        options: {
          status: 500,
          body: json500UnknownError,
        },
      },
    ],
  },
];

export default routes;
