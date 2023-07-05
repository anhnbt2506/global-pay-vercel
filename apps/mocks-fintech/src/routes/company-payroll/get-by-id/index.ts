import json200Success from '../../../fixtures/company-payroll/get-by-id/200-success.json';
import json200SuccessFilesEmpty from '../../../fixtures/company-payroll/get-by-id/200-success-files-empty.json';
import json200SuccessNoConverastion from '../../../fixtures/company-payroll/get-by-id/200-success-no-conversation.json';
import json500InternalServerError from '../../../fixtures/common/500-internal-server-error.json';
import json500UnknownError from '../../../fixtures/common/500-unknown-error.json';

const routes = [
  {
    id: 'fintech/v1/company-payroll/get-by-id',
    url: '/fintech/v1/company-payroll/:id',
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
        id: '200-success-files-empty',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessFilesEmpty,
        },
      },
      {
        id: '200-success-no-conversation',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessNoConverastion,
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
