import json200Success from '../../../fixtures/department/patch/200-success.json';
import json200SuccessUpdateEmployees from '../../../fixtures/department/patch/200-success-update-employees.json';
import json400BadRequest from '../../../fixtures/department/patch/400-bad-request.json';
import json422Unprocessable from '../../../fixtures/department/patch/422-unprocessable.json';
import json500InternalError from '../../../fixtures/common/500-internal-server-error.json';
import json500UnknownError from '../../../fixtures/common/500-unknown-error.json';

const routes = [
  {
    id: 'people/v1/department/patch',
    url: '/people/v1/department/:departmentId',
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
        id: '400-bad-request',
        type: 'json',
        options: {
          status: 400,
          body: json400BadRequest,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500InternalError,
        },
      },
    ],
  },
  {
    id: 'people/v1/department/departmentId/employees',
    url: '/people/v1/department/:departmentId/employees',
    method: 'PATCH',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessUpdateEmployees,
        },
      },
      {
        id: '400-bad-request',
        type: 'json',
        options: {
          status: 400,
          body: json400BadRequest,
        },
      },
      {
        id: '422-unprocessable',
        type: 'json',
        options: {
          status: 422,
          body: json422Unprocessable,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500InternalError,
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
