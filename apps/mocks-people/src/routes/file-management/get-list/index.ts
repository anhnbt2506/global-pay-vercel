import json200Success from '../../../fixtures/file-management/get-list/200-success.json';
import json200UploadFileSuccess from '../../../fixtures/file-management/upload/200-success.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';
import json400UnknownError from '../../../fixtures/common/400-unknown-error.json';
import jsonEmploymentDocs200Success from '../../../fixtures/file-management/get-list/employment-docs-200-success.json';
import jsonEmploymentDocsAddendum200Success from '../../../fixtures/file-management/get-list/employment-docs-addendum-200-success.json';

const routes = [
  {
    id: 'people/v1/file-management/get-list',
    url: '/people/v1/file-management/get-list',
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
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500Error,
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
    id: 'people/v1/file-management/get-list-employment-documents',
    url: '/people/v1/file-management/get-list',
    method: 'GET',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: jsonEmploymentDocs200Success,
        },
      },
      {
        id: '200-success-addendum',
        type: 'json',
        options: {
          status: 200,
          body: jsonEmploymentDocsAddendum200Success,
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
    id: 'people/v1/file-management',
    url: '/people/v1/file-management/upload',
    method: 'POST',
    variants: [
      {
        id: '200-upload-file-success',
        type: 'json',
        options: {
          status: 200,
          body: json200UploadFileSuccess,
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
    id: 'people/v1/file-management-s3',
    url: '/people/v1/file-management/upload-s3',
    method: 'POST',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200UploadFileSuccess,
        },
      },
    ],
  },
];

export default routes;
