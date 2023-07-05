import json200Success from '../../../fixtures/industry/patch/200-success.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';

const routes = [
  {
    id: 'people/v1/industry/edit-industry',
    url: '/people/v1/industry/:industryId',
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
        id: '500-internal-server-error',
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
