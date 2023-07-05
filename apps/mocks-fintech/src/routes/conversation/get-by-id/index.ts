import json200Success from '../../../fixtures/conversation/get-by-id/200-success.json';
import json404NotFound from '../../../fixtures/common/404-not-found-error.json';
import json200SuccessReplyComment from '../../../fixtures/conversation/get-by-id/200-success-reply-comment.json';

const routes = [
  {
    id: 'fintech/v1/conversation/get-by-id',
    url: '/fintech/v1/conversation/:conversationId',
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
        id: '404-not-found',
        type: 'json',
        options: {
          status: 404,
          body: json404NotFound,
        },
      },
      {
        id: '200-success-replying-comment',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessReplyComment,
        },
      },
    ],
  },
];

export default routes;
