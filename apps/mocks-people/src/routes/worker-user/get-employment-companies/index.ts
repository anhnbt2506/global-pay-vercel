import json200Success from '../../../fixtures/worker-user/get-employment-companies/200-success.json';
import json200HasOneCompany from '../../../fixtures/worker-user/get-employment-companies/200-has-one-company.json';
import json200HasOneCompanyId from '../../../fixtures/worker-user/get-employment-companies/200-has-one-company-id.json';

const routes = [
  {
    id: 'people/v1/worker-user/get-employment-companies',
    url: '/people/v1/worker-user/employment-companies',
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
        id: '200-has-one-company',
        type: 'json',
        options: {
          status: 200,
          body: json200HasOneCompany,
        },
      },
      {
        id: '200-has-one-company-id',
        type: 'json',
        options: {
          status: 200,
          body: json200HasOneCompanyId,
        },
      },
    ],
  },
];

export default routes;
