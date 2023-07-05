import json200Success from '../../../fixtures/company/detail/200-success.json';
import json200SuccessCoverOtherCases from '../../../fixtures/company/detail/200-success-cover-other-cases.json';

const routes = [
  {
    id: 'people/v1/company/information',
    url: '/people/v1/company/:id',
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
        id: '200-success-cover-other-cases',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessCoverOtherCases,
        },
      },
    ],
  },
];

export default routes;
