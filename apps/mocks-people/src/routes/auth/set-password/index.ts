import json200Success from '../../../fixtures/auth/set-password/200-success.json';
import json400PasswordTooShort from '../../../fixtures/auth/set-password/400-password-too-short.json';
import json500UnknownError from '../../../fixtures/common/500-unknown-error.json';

const routes = [
  {
    id: 'people/v1/auth/set-password',
    url: '/people/v1/auth/set-password',
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
      {
        id: '400-password-too-short',
        type: 'json',
        options: {
          status: 400,
          body: json400PasswordTooShort,
        },
      },
      {
        id: '500-unknown-error',
        type: 'json',
        options: {
          status: 500,
          body: json500UnknownError,
        },
      },
    ],
  },
];

export default routes;
