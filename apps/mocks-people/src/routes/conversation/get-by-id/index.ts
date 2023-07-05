import json200Success from '../../../fixtures/conversation/get-by-id/200-success.json';
import json200SuccessNoConversation from '../../../fixtures/conversation/get-by-id/200-success-no-conversation.json';
import json404NotFound from '../../../fixtures/conversation/get-by-id/404-not-found.json';
import json200SuccessReplyComment from '../../../fixtures/conversation/get-by-id/200-success-reply-comment.json';

const routes = [
  {
    id: 'people/v1/conversation/get-by-id',
    url: '/people/v1/conversation/:conversationId',
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
        id: '200-success-no-conversation',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessNoConversation,
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
