import json200Success from '../../../fixtures/company-calendar/get-company-events/200-success.json';
import json404NotFound from '../../../fixtures/common/404-not-found-error.json';

const routes = [
  {
    id: 'people/v1/company-calendar/get-company-events',
    url: '/people/v1/company-calendar/:companyCalendarId/events',
    method: 'GET',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: {
            data: {
              companyEvents: [
                ...json200Success.data.companyEvents.map((item) => ({
                  ...item,
                  date: new Date().toISOString().split('T')[0],
                })),
              ],
            },
          },
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
    ],
  },
];

export default routes;
