import json200SuccessPomSigned from '../../../fixtures/service-agreement/get-by-hire-type/200-success-pom-signed.json';
import json200SuccessPeoSigned from '../../../fixtures/service-agreement/get-by-hire-type/200-success-peo-signed.json';
import json200SuccessPeoInReview from '../../../fixtures/service-agreement/get-by-hire-type/200-success-peo-in-review.json';
import json200SuccessPomInReview from '../../../fixtures/service-agreement/get-by-hire-type/200-success-pom-in-review.json';
import json404NotFound from '../../../fixtures/common/404-not-found-error.json';
import json500Unknown from '../../../fixtures/common/400-unknown-error.json';

const routes = [
  {
    id: 'people/v1/service-agreement/pom/get-by-hire-type',
    url: '/people/v1/service-agreement',
    method: 'POST',
    variants: [
      {
        id: '200-success-pom-signed',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessPomSigned,
        },
      },
      {
        id: '200-success-pom-in-review',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessPomInReview,
        },
      },
      {
        id: '200-success-pom-in-review',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessPomInReview,
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
        id: '500-unknown',
        type: 'json',
        options: {
          status: 500,
          body: json500Unknown,
        },
      },
    ],
  },
  {
    id: 'people/v1/service-agreement/peo/get-by-hire-type',
    url: '/people/v1/service-agreement',
    method: 'POST',
    variants: [
      {
        id: '200-success-peo-signed',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessPeoSigned,
        },
      },
      {
        id: '200-success-peo-in-review',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessPeoInReview,
        },
      },
    ],
  },
];

export default routes;
