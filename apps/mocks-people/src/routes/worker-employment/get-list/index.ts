import json200Success from '../../../fixtures/worker-employment/get-list/200-success.json';
import json200OnboardingSuccess from '../../../fixtures/worker-employment/get-list/200-onboarding-success.json';
import json200WorkforceSuccess from '../../../fixtures/worker-employment/get-list/200-workforce-success.json';
import json200Empty from '../../../fixtures/worker-employment/get-list/200-workforce-empty.json';
import json400Error from '../../../fixtures/common/400-unknown-error.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';

const routes = [
  {
    id: 'people/v1/worker-employment/get-list',
    url: '/people/v1/worker-employment',
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
    id: 'people/v1/worker-employment/get-list-onboarding',
    url: '/people/v1/worker-employment',
    method: 'GET',
    variants: [
      {
        id: '200-onboarding-success',
        type: 'json',
        options: {
          status: 200,
          body: json200OnboardingSuccess,
        },
      },
    ],
  },
  {
    id: 'people/v1/worker-employment/get-list-workforce',
    url: '/people/v1/worker-employment',
    method: 'GET',
    variants: [
      {
        id: '200-workforce-success',
        type: 'json',
        options: {
          status: 200,
          body: json200WorkforceSuccess,
        },
      },
      {
        id: '200-workforce-empty',
        type: 'json',
        options: {
          status: 200,
          body: json200Empty,
        },
      },
      {
        id: '400-unknown-error',
        type: 'json',
        options: {
          status: 400,
          body: json400Error,
        },
      },
      {
        id: '500-internal-error',
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
