import json200HasSubmittedSuccess from '../../../fixtures/company/hire-type/200-success-check-country-service-detail-has-submitted.json';
import json200HasNotSubmittedSuccess from '../../../fixtures/company/hire-type/200-success-check-country-service-detail-has-not-submitted.json';
import json200CreateServiceSuccess from '../../../fixtures/company/hire-type/200-success-create-country-service.json';
import json200UpdateServiceSuccess from '../../../fixtures/company/hire-type/200-success-update-country-service.json';
import json200UpdateServiceSuccessNullData from '../../../fixtures/company/hire-type/200-success-update-country-service-null-data.json';
import json500InternalSeverError from '../../../fixtures/common/500-internal-server-error.json';
import json400UnknownError from '../../../fixtures/common/400-unknown-error.json';
import json200SuccessUpdateServiceDetails from '../../../fixtures/company/hire-type/200-success-update-country-service-details.json';
import json404NotFound from '../../../fixtures/company/hire-type/404-not-found.json';
import json403Forbidden from '../../../fixtures/company/hire-type/403-forbidden.json';

const routes = [
  {
    id: 'people/v1/company/hire-type/check',
    url: '/people/v1/company/hire-type/:hireType/:countryCode/check',
    method: 'GET',
    variants: [
      {
        id: '200-success-has-submitted',
        type: 'json',
        options: {
          status: 200,
          body: json200HasSubmittedSuccess,
        },
      },
      {
        id: '200-success-has-not-submitted',
        type: 'json',
        options: {
          status: 200,
          body: json200HasNotSubmittedSuccess,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500InternalSeverError,
        },
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
  {
    id: 'people/v1/company/hire-type/create-country-service',
    url: '/people/v1/company/hire-type/:hireType/:countryCode',
    method: 'POST',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200CreateServiceSuccess,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500InternalSeverError,
        },
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
  {
    id: 'people/v1/company/hire-type/update-service',
    url: '/people/v1/company/hire-type/:hireType/:countryCode/get',
    method: 'POST',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200UpdateServiceSuccess,
        },
      },
      {
        id: '200-success-null-data',
        type: 'json',
        options: {
          status: 200,
          body: json200UpdateServiceSuccessNullData,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500InternalSeverError,
        },
      },
      {
        id: '400-unknown-error',
        type: 'json',
        options: {
          status: 400,
          body: json400UnknownError,
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
        id: '403-forbidden',
        type: 'json',
        options: {
          status: 403,
          body: json403Forbidden,
        },
      },
    ],
  },
  {
    id: 'people/v1/company/hire-type/update-service-details',
    url: '/people/v1/company/hire-type/:hireType/:countryCode',
    method: 'PATCH',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessUpdateServiceDetails,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500InternalSeverError,
        },
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
