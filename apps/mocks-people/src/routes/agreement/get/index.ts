import json200Success from '../../../fixtures/agreement/get/200-sucess.json';
const routes = [
  {
    id: 'people/v1/agreement/get',
    url: '/people/v1/agreement/:agreementId',
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
