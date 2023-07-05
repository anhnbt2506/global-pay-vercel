import json200All from '../../../fixtures/feature-flag/get/200-all.json';

const routes = [
  {
    id: 'people/v1/feature-flag/get',
    url: '/people/v1/feature-flag',
    method: 'GET',
    variants: [
      {
        id: '200-all',
        type: 'json',
        options: {
          status: 200,
          body: json200All,
        },
      },
    ],
  },
];

export default routes;
