import json200Success from '../../../fixtures/worker-employment/unassigned-department/200-success.json';

const routes = [
  {
    id: 'people/v1/worker-employment/unassigned-department',
    url: '/people/v1/worker-employment/unassigned-department',
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
