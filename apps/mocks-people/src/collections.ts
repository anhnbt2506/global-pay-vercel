const baseRoutes = [
  'root:200',
  'people/v1/feature-flag/get:200-all',
  'people/v1/country/get-countries:200-success',
];

const collections = [
  {
    id: 'base',
    routes: baseRoutes,
  },
  {
    id: 'base-people-onboarding',
    routes: [
      ...baseRoutes,
      'people/v1/company/people/onboarding/get-company:200-success',
      'people/v1/company/people/onboarding/get-list:200-success',
      'people/v1/currency/get-currencies:200-success',
      'people/v1/company/people/onboarding/get-agreement-template:200-success',
      'people/v1/worker-employment/sign:200-success',
    ],
  },
  {
    id: 'base-worker-onboarding',
    routes: [
      ...baseRoutes,
      'people/v1/worker-user/get-employment-companies:200-has-one-company-id',
      'people/v1/worker-user/get-home:400-redirect-error',
      'people/v1/auth/check-email:200-has-set-password',
      'people/v1/worker-employment/update:200-success',
      'people/v1/file-management:200-upload-file-success',
      's3Api-upload:200-success',
    ],
  },
  {
    id: 'base-worker-inreview',
    routes: [
      ...baseRoutes,
      'people/v1/worker-user/get-employment-companies:200-has-one-company-id',
      'people/v1/worker-user/get-home:400-redirect-error',
      'people/v1/auth/check-email:200-has-set-password',
    ],
  },
];

export default collections;
