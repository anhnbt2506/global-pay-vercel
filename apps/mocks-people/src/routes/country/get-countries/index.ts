import json200Success from '../../../fixtures/country/get-countries/200-success.json';

const routes = [
  {
    id: 'people/v1/country/get-countries',
    url: '/people/v1/country',
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
