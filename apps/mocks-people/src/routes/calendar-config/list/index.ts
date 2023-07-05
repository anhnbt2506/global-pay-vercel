import json200Success from '../../../fixtures/calendar-config/list/200-success.json';
import json500Error from '../../../fixtures/common/500-internal-server-error.json';
import json200GetSelectionSuccess from '../../../fixtures/calendar-config/selection/200-success.json';
import json200CreateCalendarSuccess from '../../../fixtures/calendar-config/create-calendar/200-success.json';
import json200UpdateConfigSuccess from '../../../fixtures/calendar-config/update-config/200-success.json';

const routes = [
  {
    id: 'people/v1/calendar-config/get-list',
    url: '/people/v1/calendar-config',
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
    ],
  },
  {
    id: 'people/v1/calendar-config/create',
    url: '/people/v1/calendar-config',
    method: 'POST',
    variants: [
      {
        id: '200-create-calendar-config-success',
        type: 'json',
        options: {
          status: 200,
          body: json200CreateCalendarSuccess,
        },
      },
      {
        id: '500-create-config-internal-server-error',
        type: 'json',
        options: {
          status: 500,
          body: json500Error,
        },
      },
    ],
  },
  {
    id: 'people/v1/calendar-config/get-selection',
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
    id: 'people/v1/calendar-config/update',
    url: '/people/v1/calendar-config/:calendarConfigId',
    method: 'PATCH',
    variants: [
      {
        id: '200-update-success',
        type: 'json',
        options: {
          status: 200,
          body: json200UpdateConfigSuccess,
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
