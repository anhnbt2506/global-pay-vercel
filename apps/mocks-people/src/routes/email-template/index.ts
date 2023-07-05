import json500Error from '../../fixtures/common/500-internal-server-error.json';
import json403Error from '../../fixtures/common/403-forbidden-error.json';
import json200GetDetailTemplatesSuccessCc from '../../fixtures/email-templates/get-detail/200-success-cc.json';
import json200GetDetailTemplatesSuccess from '../../fixtures/email-templates/get-detail/200-success.json';
import json200GetDetailTemplatesByHkSuccess from '../../fixtures/email-templates/get-detail/200-success-by-hk.json';
import json200Success from '../../fixtures/email-templates/get/200-success.json';
import json200PatchEmailTemplateSuccessCc from '../../fixtures/email-templates/patch/200-success-cc.json';
import json200PatchDetailTemplatesByHkSuccess from '../../fixtures/email-templates/patch/200-success-by-hk.json';
import json200PatchEmailTemplateSuccess from '../../fixtures/email-templates/patch/200-success.json';

const routes = [
  {
    id: 'people/v1/email-template/get',
    url: '/people/v1/email-template',
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
    ],
  },
  {
    id: 'people/v1/email-template/get-detail',
    url: '/people/v1/email-template/:agreementTemplateId',
    method: 'GET',
    variants: [
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500Error,
        },
      },
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200GetDetailTemplatesSuccess,
        },
      },
      {
        id: '200-success-cc',
        type: 'json',
        options: {
          status: 200,
          body: json200GetDetailTemplatesSuccessCc,
        },
      },
      {
        id: '200-success-by-hk',
        type: 'json',
        options: {
          status: 200,
          body: json200GetDetailTemplatesByHkSuccess,
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
    ],
  },
  {
    id: 'people/v1/email-template/patch',
    url: '/people/v1/email-template/:agreementTemplateId',
    method: 'PATCH',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200PatchEmailTemplateSuccess,
        },
      },
      {
        id: '200-success-cc',
        type: 'json',
        options: {
          status: 200,
          body: json200PatchEmailTemplateSuccessCc,
        },
      },
      {
        id: '200-success-by-hk',
        type: 'json',
        options: {
          status: 200,
          body: json200PatchDetailTemplatesByHkSuccess,
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
