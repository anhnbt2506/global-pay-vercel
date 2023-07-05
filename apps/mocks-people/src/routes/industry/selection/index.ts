import json200Success from '../../../fixtures/industry/selection/200-success.json';

const routes = [
  {
    id: 'people/v1/industry/selection',
    url: '/people/v1/industry/selection',
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
