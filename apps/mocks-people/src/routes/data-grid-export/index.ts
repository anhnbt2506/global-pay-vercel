import json200Success from '../../fixtures/data-grid-export/200-success.json';
import json429Error from '../../fixtures/common/429-too-many-request-error.json';
import json500Error from '../../fixtures/common/500-internal-server-error.json';
import json400Error from '../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/data-grid-export',
    url: '/people/v1/export/data-grid',
    method: 'POST',
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
        id: '429-error',
        type: 'json',
        options: {
          status: 429,
          body: json429Error,
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
        id: '400-error',
        type: 'json',
        options: {
          status: 500,
          body: json400Error,
        },
      },
    ],
  },
];

export default routes;
