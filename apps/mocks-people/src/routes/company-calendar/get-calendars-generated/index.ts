import json200Success from '../../../fixtures/company-calendar/get-calendars-generated/200-success.json';
import json200EmptySuccess from '../../../fixtures/company-calendar/get-calendars-generated/200-empty-success.json';
import json500InternalServerError from '../../../fixtures/common/500-internal-server-error.json';

const routes = [
  {
    id: 'people/v1/company-calendar/get-calendars-generated',
    url: '/people/v1/company-calendar',
    method: 'POST',
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
        id: '200-empty-success',
        type: 'json',
        options: {
          status: 200,
          body: json200EmptySuccess,
        },
      },
      {
        id: '500-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500InternalServerError,
        },
      },
    ],
  },
];

export default routes;
