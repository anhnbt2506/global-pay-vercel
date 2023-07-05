import json200Success from '../../../fixtures/company-payroll/update-company-payroll-status/200-success.json';
import json500InternalServerError from '../../../fixtures/common/500-internal-server-error.json';
import json500UnknownError from '../../../fixtures/common/500-unknown-error.json';

const routes = [
  {
    id: 'fintech/v1/company-payroll/update-status',
    url: '/fintech/v1/company-payroll/:companyPayrollId',
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
