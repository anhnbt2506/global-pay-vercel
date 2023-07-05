import json200Success from '../../../fixtures/service-agreement/get-list/200-success.json';
import json200Empty from '../../../fixtures/service-agreement/get-list/200-empty.json';
import jsonGetByHireType200Success from '../../../fixtures/service-agreement/get-by-hire-type/200-success-peo-signed.json';

const routes = [
  {
    id: 'people/v1/service-agreement/get-list',
    url: '/people/v1/service-agreement',
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
        id: '200-empty',
        type: 'json',
        options: {
          status: 200,
          body: json200Empty,
        },
      },
    ],
  },
  {
    id: 'people/v1/service-agreement',
    url: '/people/v1/service-agreement',
    method: 'POST',
    variants: [
      {
        id: 'get-by-hire-type-200-success',
        type: 'json',
        options: {
          status: 200,
          body: jsonGetByHireType200Success,
        },
      },
    ],
  },
];

export default routes;
