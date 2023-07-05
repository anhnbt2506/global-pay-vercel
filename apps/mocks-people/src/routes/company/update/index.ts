import json200Success from '../../../fixtures/company/update/200-success.json';
import json403ForbiddenError from '../../../fixtures/common/403-forbidden-error.json';
import json400UnknownError from '../../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/company/update',
    url: '/people/v1/company',
    method: 'PATCH',
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
  {
    id: 'people/v1/company/update-by-id',
    url: '/people/v1/company/:id',
    method: 'PATCH',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200Success,
        },
        delay: 1000,
      },
      {
        id: '403-forbidden-error',
        type: 'json',
        options: {
          status: 403,
          body: json403ForbiddenError,
        },
        delay: 1000,
      },
      {
        id: '400-unknown-error',
        type: 'json',
        options: {
          status: 400,
          body: json400UnknownError,
        },
      },
    ],
  },
];

export default routes;
