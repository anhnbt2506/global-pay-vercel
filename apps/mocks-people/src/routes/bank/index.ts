import json200Success from '../../fixtures/bank/get/200-success.json';
import json200SuccessEmpty from '../../fixtures/bank/get/200-success-empty.json';

const routes = [
  {
    id: 'people/v1/get-banks',
    url: '/people/v1/bank',
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
        id: '200-success-empty',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessEmpty,
        },
      },
    ],
  },
];

export default routes;
