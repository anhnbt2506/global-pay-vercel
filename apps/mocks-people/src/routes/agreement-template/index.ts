import json200Success from '../../fixtures/agreement-template/get/200-success.json';
import json200SubmitAgreementTemplateSuccess from '../../fixtures/agreement-template/patch/200-success.json';
import json500Error from '../../fixtures/common/500-internal-server-error.json';
import json400UnknownError from '../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/agreement-template/get',
    url: '/people/v1/agreement-template/:agreementTemplateId',
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
    id: 'people/v1/agreement-template/patch',
    url: '/people/v1/agreement-template/:agreementTemplateId',
    method: 'PATCH',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200SubmitAgreementTemplateSuccess,
        },
      },
      {
        id: '500-internal-server-error',
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
