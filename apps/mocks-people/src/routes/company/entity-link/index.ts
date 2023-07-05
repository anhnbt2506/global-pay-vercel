import json200SuccessStandalone from '../../../fixtures/company/entity-link/standalone.json';
import json200SuccessParent from '../../../fixtures/company/entity-link/parent.json';
import json200SuccessSubsidiary from '../../../fixtures/company/entity-link/subsidiary.json';
import jsonUnlink200Success from '../../../fixtures/company/entity-link/unlinkSuccess.json';
import jsonUnlink500InternalServerError from '../../../fixtures/common/500-internal-server-error.json';
import jsonUnlink400UnknownError from '../../../fixtures/common/400-unknown-error.json';
import json200SuccessLinkedExistingEntity from '../../../fixtures/company/entity-link/existing-entity/success.json';
import json422SameEntityIdCannotBeLinked from '../../../fixtures/company/entity-link/existing-entity/sameEntityIdCannotBeLinked.json';
import json422LinkingCompanyIsNotFound from '../../../fixtures/company/entity-link/existing-entity/linkingCompanyIsNotFound.json';
import json422LinkingCompanyIsAlreadyASubsidiary from '../../../fixtures/company/entity-link/existing-entity/linkingCompanyIsAlreadyASubsidiary.json';
import json422LinkingCompanyIsAlreadyAParent from '../../../fixtures/company/entity-link/existing-entity/linkingCompanyIsAlreadyAParent.json';
import json422UnprocessableContent from '../../../fixtures/company/entity-link/existing-entity/unprocessableContent.json';

const routes = [
  {
    id: 'people/v1/company/entity',
    url: '/people/v1/company/:id/entity-link',
    method: 'GET',
    variants: [
      {
        id: '200-success-standalone',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessStandalone,
        },
      },
      {
        id: '200-success-parent',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessParent,
        },
      },
      {
        id: '200-success-subsidiary',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessSubsidiary,
        },
      },
    ],
  },
  {
    id: 'people/v1/company/entity-link/unlink',
    url: '/people/v1/company/:id/entity-link',
    method: 'DELETE',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: jsonUnlink200Success,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: jsonUnlink500InternalServerError,
        },
      },
      {
        id: '400-unknown-error',
        type: 'json',
        options: {
          status: 400,
          body: jsonUnlink400UnknownError,
        },
      },
    ],
  },
  {
    id: 'people/v1/company/entity-link/link-existing-entity',
    url: '/people/v1/company/:id/entity-link',
    method: 'PATCH',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessLinkedExistingEntity,
        },
      },
      {
        id: '422-same-entity-id-cannot-be-linked',
        type: 'json',
        options: {
          status: 422,
          body: json422SameEntityIdCannotBeLinked,
        },
      },
      {
        id: '422-linking-company-is-not-found',
        type: 'json',
        options: {
          status: 422,
          body: json422LinkingCompanyIsNotFound,
        },
      },
      {
        id: '422-linking-company-is-already-a-subsidiary',
        type: 'json',
        options: {
          status: 422,
          body: json422LinkingCompanyIsAlreadyASubsidiary,
        },
      },
      {
        id: '422-linking-company-is-already-a-parent',
        type: 'json',
        options: {
          status: 422,
          body: json422LinkingCompanyIsAlreadyAParent,
        },
      },
      {
        id: '422-unprocessable-content',
        type: 'json',
        options: {
          status: 422,
          body: json422UnprocessableContent,
        },
      },
    ],
  },
];

export default routes;
