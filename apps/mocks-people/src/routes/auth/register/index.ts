import json200Success from '../../../fixtures/auth/register/company/200-success.json';
import json400EmailAlreadyExist from '../../../fixtures/auth/register/company/400-email-already-exist.json';
import json500InternalServerError from '../../../fixtures/common/500-internal-server-error.json';
import json500UnknownError from '../../../fixtures/common/500-unknown-error.json';

const routes = [
  {
    id: 'people/v1/auth/register',
    url: '/people/v1/auth/register',
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
        id: '400-email-already-exist',
        type: 'json',
        options: {
          status: 400,
          body: json400EmailAlreadyExist,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500InternalServerError,
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
