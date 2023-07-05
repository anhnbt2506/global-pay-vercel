import json200Success from '../../../fixtures/calendar-event/list/200-success.json';
import json200GetSelectionSuccess from '../../../fixtures/calendar-event/selection/200-success.json';
import json200CreateEventSuccess from '../../../fixtures/calendar-event/create-event/200-success.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';
import json200SuccessReturnEmpty from '../../../fixtures/calendar-event/list/200-success-return-empty.json';

const routes = [
  {
    id: 'people/v1/calendar-event/get-list',
    url: '/people/v1/calendar-event',
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
        id: '200-success-return-empty',
        type: 'json',
        options: {
          status: 200,
          body: json200SuccessReturnEmpty,
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
  {
    id: 'people/v1/calendar-event/get-selection',
    url: '/people/v1/calendar-tag/selection',
    method: 'GET',
    variants: [
      {
        id: '200-success',
        type: 'json',
        options: {
          status: 200,
          body: json200GetSelectionSuccess,
        },
      },
    ],
  },
  {
    id: 'people/v1/calendar-event/create',
    url: '/people/v1/calendar-event',
    method: 'POST',
    variants: [
      {
        id: '200-create-event-success',
        type: 'json',
        options: {
          status: 200,
          body: json200CreateEventSuccess,
        },
      },
      {
        id: '500-create-event-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500Error,
        },
      },
    ],
  },
  {
    id: 'people/v1/calendar-event/update',
    url: '/people/v1/calendar-event/:calendarEventId',
    method: 'PATCH',
    variants: [
      {
        id: '200-update-event-success',
        type: 'json',
        options: {
          status: 200,
          body: json200CreateEventSuccess,
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
