import json200Success from '../../../fixtures/currency/get-currencies/200-success.json';

const routes = [
  {
    id: 'people/v1/currency/get-currencies',
    url: '/people/v1/currency',
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
