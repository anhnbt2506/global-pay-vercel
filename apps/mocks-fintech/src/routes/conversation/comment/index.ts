import json200Success from '../../../fixtures/conversation/comment/200-success.json';

const routes = [
  {
    id: 'fintech/v1/conversation/comment',
    url: '/fintech/v1/conversation/:conversationId',
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
    ],
  },
];

export default routes;
