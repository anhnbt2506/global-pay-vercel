import jsonSuccessHk from '../../../fixtures/worker-employment/get-csv-template/200-success-hk.json';
import jsonSuccessSg from '../../../fixtures/worker-employment/get-csv-template/200-success-sg.json';
import jsonSuccessTh from '../../../fixtures/worker-employment/get-csv-template/200-success-th.json';
import jsonSuccessVn from '../../../fixtures/worker-employment/get-csv-template/200-success-vn.json';
import jsonSuccessId from '../../../fixtures/worker-employment/get-csv-template/200-success-id.json';
import jsonSuccessMy from '../../../fixtures/worker-employment/get-csv-template/200-success-my.json';
import jsonSuccessPh from '../../../fixtures/worker-employment/get-csv-template/200-success-ph.json';

import json404NotFound from '../../../fixtures/common/404-not-found-error.json';

const routes = [
  {
    id: 'people/v1/worker-employment/csv-template',
    url: '/people/v1/worker-employment/csv-template/:countryCode',
    method: 'GET',
    variants: [
      {
        id: '200-success-hk',
        type: 'json',
        options: {
          status: 200,
          body: jsonSuccessHk,
        },
      },
      {
        id: '200-success-sg',
        type: 'json',
        options: {
          status: 200,
          body: jsonSuccessSg,
        },
      },
      {
        id: '200-success-th',
        type: 'json',
        options: {
          status: 200,
          body: jsonSuccessTh,
        },
      },
      {
        id: '200-success-vn',
        type: 'json',
        options: {
          status: 200,
          body: jsonSuccessVn,
        },
      },
      {
        id: '200-success-id',
        type: 'json',
        options: {
          status: 200,
          body: jsonSuccessId,
        },
      },
      {
        id: '200-success-my',
        type: 'json',
        options: {
          status: 200,
          body: jsonSuccessMy,
        },
      },
      {
        id: '200-success-ph',
        type: 'json',
        options: {
          status: 200,
          body: jsonSuccessPh,
        },
      },
      {
        id: '404-not-found-error',
        type: 'json',
        options: {
          status: 404,
          body: json404NotFound,
        },
      },
    ],
  },
];

export default routes;
