import json200Success from '../../../fixtures/company-payroll/list/200-success.json';
import json200EmptySuccess from '../../../fixtures/company-payroll/list/200-success-empty.json';
import json403Error from '../../../fixtures/common/403-forbidden-error.json';
import json500Error from '../../../fixtures/common/500-unknown-error.json';

const routes = [
  {
    id: 'fintech/v1/company-payroll',
    url: '/fintech/v1/company-payroll',
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
        id: '200-empty-success',
        type: 'json',
        options: {
          status: 200,
          body: json200EmptySuccess,
        },
      },
      {
        id: '403-error',
        type: 'json',
        options: {
          status: 500,
          body: json403Error,
        },
      },
      {
        id: '500-error',
        type: 'json',
        options: {
          status: 500,
          body: json500Error,
        },
      },
    ],
  },
];

export default routes;
