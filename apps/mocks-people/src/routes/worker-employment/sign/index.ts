import json200SignSuccess from '../../../fixtures/worker-employment/sign/200-success.json';

const routes = [
  {
    id: 'people/v1/worker-employment/sign',
    url: '/people/v1/worker-employment',
    method: 'POST',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200SignSuccess,
        },
      },
    ],
  },
];

export default routes;
